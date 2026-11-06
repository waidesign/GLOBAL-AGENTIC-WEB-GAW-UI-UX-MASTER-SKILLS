import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

/**
 * Simple, robust frontmatter parser for markdown files.
 */
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

export class SkillRegistry {
  constructor(options = {}) {
    this.skillsDir = options.skillsDir || path.join(REPO_ROOT, 'skills');
    this.skills = new Map();
    this.categories = new Set();
    this.initialized = false;
  }

  async loadSkills() {
    this.skills.clear();
    this.categories.clear();

    if (!fs.existsSync(this.skillsDir)) {
      this.initialized = true;
      return Array.from(this.skills.values());
    }

    const traverse = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          traverse(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const raw = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = parseFrontmatter(raw);
            const relativePath = path.relative(this.skillsDir, fullPath).replace(/\\/g, '/');
            const categoryFromPath = relativePath.includes('/') ? relativePath.split('/')[0] : 'general';
            
            const id = data.id || path.basename(entry.name, '.md');
            const name = data.name || id;
            const category = data.category || categoryFromPath;
            const description = data.description || '';
            const author = data.author || 'unknown';
            const license = data.license || 'MIT';
            const version = data.version || '1.0.0';
            const tags = Array.isArray(data.tags) ? data.tags : [];
            const frameworks = Array.isArray(data.frameworks) ? data.frameworks : ['any'];
            const dependencies = Array.isArray(data.dependencies) ? data.dependencies : [];
            const relatedSkills = Array.isArray(data.relatedSkills) ? data.relatedSkills : [];
            const lastVerified = data.lastVerified || new Date().toISOString().split('T')[0];

            const skill = {
              id,
              name,
              category,
              description,
              author,
              license,
              version,
              tags,
              frameworks,
              dependencies,
              relatedSkills,
              lastVerified,
              filePath: fullPath,
              content
            };

            this.skills.set(id, skill);
            this.categories.add(category);
          } catch (err) {
            console.error(`Error loading skill from ${fullPath}:`, err.message);
          }
        }
      }
    };

    traverse(this.skillsDir);
    this.initialized = true;
    return Array.from(this.skills.values());
  }

  async ensureLoaded() {
    if (!this.initialized) {
      await this.loadSkills();
    }
  }

  async getAllSkills() {
    await this.ensureLoaded();
    return Array.from(this.skills.values());
  }

  async getSkill(id) {
    await this.ensureLoaded();
    return this.skills.get(id) || null;
  }

  async getCategories() {
    await this.ensureLoaded();
    return Array.from(this.categories).sort();
  }

  async getSkillsByCategory(category) {
    await this.ensureLoaded();
    return Array.from(this.skills.values()).filter(
      s => s.category.toLowerCase() === category.toLowerCase()
    );
  }

  async validateSkill(id) {
    const skill = await this.getSkill(id);
    if (!skill) return { valid: false, errors: ['Skill not found'] };

    const errors = [];
    if (!skill.name) errors.push('Missing name');
    if (!skill.description) errors.push('Missing description');
    if (!skill.category) errors.push('Missing category');
    if (!skill.content) errors.push('Missing skill content');

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default SkillRegistry;

