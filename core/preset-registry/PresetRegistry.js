import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

export function parseFrontmatter(content) {
  if (!content || !content.startsWith('---')) {
    return { data: {}, content: content || '' };
  }
  const endIdx = content.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { data: {}, content };
  }
  const rawHeader = content.slice(3, endIdx).trim();
  const body = content.slice(endIdx + 4).trim();
  const data = {};

  const lines = rawHeader.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      const items = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      data[key] = items;
    } else if (val.startsWith('"') && val.endsWith('"')) {
      data[key] = val.slice(1, -1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      data[key] = val.slice(1, -1);
    } else {
      data[key] = val;
    }
  }

  return { data, content: body };
}

export class PresetRegistry {
  constructor(options = {}) {
    this.presetsDir = options.presetsDir || path.join(REPO_ROOT, 'presets', 'designs');
    this.presets = new Map();
    this.initialized = false;
  }

  async loadPresets() {
    this.presets.clear();

    if (!fs.existsSync(this.presetsDir)) {
      this.initialized = true;
      return [];
    }

    const files = fs.readdirSync(this.presetsDir).filter(f => f.endsWith('.md'));

    for (const filename of files) {
      const fullPath = path.join(this.presetsDir, filename);
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = parseFrontmatter(raw);
        const id = data.id || path.basename(filename, '.md');
        const name = data.name || id;
        const theme = data.theme || 'dark';
        const category = data.category || 'saas';
        const tags = Array.isArray(data.tags) ? data.tags : [];
        const vibe = data.vibe || '';
        const liveUrl = data.liveUrl || '';
        const previewUrl = data.previewUrl || `https://ui.gradientdeck.com/styles/${id}`;

        // Extract color table sample if available
        const colors = [];
        const colorTableMatch = content.match(/## Colors\s*\n\s*\|[^\n]+\|\s*\n\s*\|[-|\s]+\|\s*\n([\s\S]*?)(?=\n##|\n$)/);
        if (colorTableMatch) {
          const rows = colorTableMatch[1].trim().split('\n');
          for (const row of rows.slice(0, 5)) {
            const cols = row.split('|').map(c => c.trim()).filter(Boolean);
            if (cols.length >= 2) {
              colors.push({ name: cols[0], value: cols[1], role: cols[2] || '' });
            }
          }
        }

        const preset = {
          id,
          name,
          theme,
          category,
          tags,
          vibe,
          liveUrl,
          previewUrl,
          colors,
          content,
          path: fullPath
        };

        this.presets.set(id, preset);
      } catch (e) {
        console.error(`Error loading preset ${filename}:`, e.message);
      }
    }

    this.initialized = true;
    return Array.from(this.presets.values());
  }

  async getAllPresets() {
    if (!this.initialized) await this.loadPresets();
    return Array.from(this.presets.values());
  }

  async getPreset(id) {
    if (!this.initialized) await this.loadPresets();
    return this.presets.get(id) || null;
  }

  async searchPresets(query, options = {}) {
    const all = await this.getAllPresets();
    if (!query || !query.trim()) {
      return this.filter(all, options);
    }

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = [];

    for (const preset of all) {
      let score = 0;
      const idLower = (preset.id || '').toLowerCase();
      const nameLower = (preset.name || '').toLowerCase();
      const vibeLower = (preset.vibe || '').toLowerCase();
      const catLower = (preset.category || '').toLowerCase();
      const themeLower = (preset.theme || '').toLowerCase();
      const tags = (preset.tags || []).map(t => t.toLowerCase());

      for (const token of tokens) {
        if (idLower === token) score += 30;
        else if (idLower.includes(token)) score += 15;

        if (nameLower === token) score += 25;
        else if (nameLower.includes(token)) score += 12;

        if (tags.includes(token)) score += 15;
        if (catLower.includes(token)) score += 10;
        if (themeLower === token) score += 10;
        if (vibeLower.includes(token)) score += 8;
      }

      if (score > 0) {
        scored.push({ preset, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    const filtered = scored.map(s => s.preset).filter(p => this.matchesFilter(p, options));
    if (options.limit && options.limit > 0) {
      return filtered.slice(0, options.limit);
    }
    return filtered;
  }

  filter(presets, options = {}) {
    let result = presets.filter(p => this.matchesFilter(p, options));
    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  matchesFilter(preset, options = {}) {
    if (options.theme && preset.theme.toLowerCase() !== options.theme.toLowerCase()) {
      return false;
    }
    if (options.category && preset.category.toLowerCase() !== options.category.toLowerCase()) {
      return false;
    }
    return true;
  }

  /**
   * Recommend 1-3 best matching design presets for a task prompt
   */
  async recommend(taskPrompt, options = {}) {
    const prompt = (taskPrompt || '').toLowerCase();
    const matches = await this.searchPresets(prompt, { limit: 2 });

    // Fallbacks if search yielded fewer than 2
    if (matches.length === 0) {
      const isDark = prompt.includes('dark') || !prompt.includes('light');
      const fallback = isDark ? (await this.getPreset('railway')) : (await this.getPreset('tailwind-css'));
      if (fallback) matches.push(fallback);
    }

    return matches.map(preset => {
      let reason = `Matches your design objective with an established ${preset.theme} theme archetype.`;
      if (preset.id === 'railway') {
        reason = `Calm dusk purple-black console aesthetic, serif headlines, and clear technical hierarchy. Ideal for developer tools and APIs.`;
      } else if (preset.id === 'cloudflare') {
        reason = `High-density infrastructure dashboard aesthetic with robust tabular clarity and clean technical tokens.`;
      } else if (preset.id === 'tailwind-css') {
        reason = `Clean blueprint white layout with hairline lanes and dark code window accents.`;
      } else if (preset.id === 'mollie') {
        reason = `Warm cream and dark ledger editorial space with tactile contrast and high trust.`;
      } else if (preset.id === 'stripe-press') {
        reason = `Literary, calm editorial aesthetic with rich typography and understated sophistication.`;
      }

      return {
        id: preset.id,
        name: preset.name,
        theme: preset.theme,
        category: preset.category,
        vibe: preset.vibe,
        liveUrl: preset.liveUrl,
        previewUrl: preset.previewUrl,
        colors: preset.colors,
        reason
      };
    });
  }
}

export default PresetRegistry;

