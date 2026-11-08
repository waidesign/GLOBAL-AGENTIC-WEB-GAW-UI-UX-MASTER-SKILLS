import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './frontmatter.js';
import { userSkillsDir, skillPreferencesFile } from '../memory-engine/paths.js';
import { readSkillPreferences } from './preferences.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

export const INDEX_FILE = 'index.json';
const INDEX_VERSION = 1;

// Kept for existing imports; the full YAML-subset parser lives in frontmatter.js
export { parseFrontmatter };

const estimateTokens = (text) => Math.round((text || '').length / 4);
const toList = (value) => (Array.isArray(value) ? value : String(value || '').split(',').map(s => s.trim()).filter(Boolean));

/**
 * Turn a parsed skill (GSS folder or legacy single file) into the registry's
 * skill shape. `content` is attached separately so it can load lazily.
 */
function toSkillRecord({ data, contract, relPath, categoryFromPath, isGss }) {
  const meta = (data.metadata && typeof data.metadata === 'object') ? data.metadata : {};

  if (isGss) {
    return {
      id: data.name,
      name: meta['gaw-title'] || data.name,
      category: meta['gaw-category'] || categoryFromPath,
      description: data.description || '',
      author: meta['gaw-author'] || 'unknown',
      license: data.license || 'UNKNOWN',
      version: meta['gaw-version'] || '1.0.0',
      tags: toList(meta['gaw-tags']),
      keywords: toList(contract.keywords),
      frameworks: contract.frameworks?.length ? contract.frameworks : ['any'],
      dependencies: contract.dependsOn || [],
      relatedSkills: contract.related || [],
      lastVerified: contract.lastVerified || null,
      summary: contract.summary || '',
      contract,
      format: 'gss',
      path: relPath
    };
  }

  // Legacy single-file skill (frontmatter with id/name/category/...)
  const id = data.id || path.basename(relPath, '.md');
  return {
    id,
    name: data.name || id,
    category: data.category || categoryFromPath,
    description: data.description || '',
    author: data.author || 'unknown',
    license: data.license || 'UNKNOWN',
    version: data.version || '1.0.0',
    tags: toList(data.tags),
    keywords: [],
    frameworks: Array.isArray(data.frameworks) && data.frameworks.length ? data.frameworks : ['any'],
    dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
    relatedSkills: Array.isArray(data.relatedSkills) ? data.relatedSkills : [],
    lastVerified: data.lastVerified || null,
    summary: '',
    contract: {},
    format: 'legacy',
    path: relPath
  };
}

export const OFFICIAL_SKILLS_DIR = path.join(REPO_ROOT, 'skills');

export class SkillRegistry {
  /**
   * options:
   *   skillsDir   the library folder (default: GAW's official library)
   *   library     what that folder is: 'official' (default), 'personal' or 'project'
   *   user        also load the user's personal library (~/.gaw/skills) and skill
   *               preferences (pin/block). Off by default, so tests, the benchmark
   *               and import scripts see only the official library. The CLI, the MCP
   *               server and gaw init turn it on.
   *   userSkillsDir / preferencesFile   override the user's locations (tests)
   */
  constructor(options = {}) {
    this.skillsDir = options.skillsDir || OFFICIAL_SKILLS_DIR;
    this.library = options.library || 'official';
    this.skills = new Map();
    this.categories = new Set();
    this.initialized = false;
    this.duplicates = [];
    this.overrides = [];
    // Rewrite skills/index.json when skills changed, so nobody has to remember `gaw skills index`
    this.autoIndex = options.autoIndex !== false;
    this.user = Boolean(options.user);
    this.personal = this.user
      ? new SkillRegistry({ skillsDir: options.userSkillsDir || userSkillsDir(), library: 'personal', autoIndex: this.autoIndex })
      : null;
    this.preferencesFile = this.user ? (options.preferencesFile || skillPreferencesFile()) : null;
    this.preferences = { pinned: [], blocked: [] };
  }

  /** Where `gaw skills add` saves skills by default: the personal library when loaded, else this library. */
  get personalDir() {
    return this.personal ? this.personal.skillsDir : null;
  }

  /** Skill files on disk: GSS folders (SKILL.md) and legacy single .md files. */
  listSkillFiles() {
    const found = [];
    const walk = (dir) => {
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      if (entries.some(e => e.isFile() && e.name === 'SKILL.md')) {
        found.push({ file: path.join(dir, 'SKILL.md'), isGss: true });
        return; // files inside a skill folder (references/, scripts/) are not skills
      }
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
          found.push({ file: full, isGss: false });
        }
      }
    };
    walk(this.skillsDir);
    return found.sort((a, b) => a.file.localeCompare(b.file));
  }

  /** Cheap fingerprint of the library: paths and sizes of skill files and contracts. */
  fingerprint(files) {
    return files.map(({ file, isGss }) => {
      const rel = path.relative(this.skillsDir, file).replace(/\\/g, '/');
      const size = fs.statSync(file).size;
      const contractFile = path.join(path.dirname(file), 'gaw.json');
      const contractSize = isGss && fs.existsSync(contractFile) ? fs.statSync(contractFile).size : 0;
      return `${rel}:${size}:${contractSize}`;
    }).join('|');
  }

  /** Read and parse every skill file (full scan). Returns records with token estimates. */
  scanSkills(files = this.listSkillFiles()) {
    const records = [];
    for (const { file, isGss } of files) {
      try {
        const raw = fs.readFileSync(file, 'utf8');
        const { data, content } = parseFrontmatter(raw);
        const relPath = path.relative(this.skillsDir, file).replace(/\\/g, '/');
        const categoryFromPath = relPath.includes('/') ? relPath.split('/')[0] : 'general';
        let contract = {};
        if (isGss) {
          const contractFile = path.join(path.dirname(file), 'gaw.json');
          if (fs.existsSync(contractFile)) contract = readJsonFile(contractFile);
        }
        const record = toSkillRecord({ data, contract, relPath, categoryFromPath, isGss });
        record.tokenEstimate = estimateTokens(content);
        records.push({ record, content });
      } catch (err) {
        console.error(`Error loading skill from ${file}:`, err.message);
      }
    }
    return records;
  }

  /** Build the metadata index (what `gaw skills index` writes to skills/index.json). */
  buildIndex() {
    const files = this.listSkillFiles();
    const records = this.scanSkills(files).map(r => r.record);
    return {
      version: INDEX_VERSION,
      fingerprint: this.fingerprint(files),
      skills: records
    };
  }

  /** Write this library's index (and the personal library's, when loaded and present). Returns this library's index. */
  writeIndex() {
    const index = this.buildIndex();
    fs.writeFileSync(path.join(this.skillsDir, INDEX_FILE), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
    if (this.personal && fs.existsSync(this.personal.skillsDir)) this.personal.writeIndex();
    return index;
  }

  /** The saved index, if it exists and still matches the files on disk. */
  readFreshIndex(files) {
    const indexFile = path.join(this.skillsDir, INDEX_FILE);
    if (!fs.existsSync(indexFile)) return null;
    try {
      const index = readJsonFile(indexFile);
      if (index.version !== INDEX_VERSION) return null;
      return index.fingerprint === this.fingerprint(files) ? index : null;
    } catch {
      return null;
    }
  }

  /** Attach `content` as a lazy property: the skill body is read only when used. */
  attachContent(record, preloaded) {
    const filePath = path.join(this.skillsDir, record.path);
    let cached = preloaded;
    Object.defineProperty(record, 'content', {
      enumerable: false,
      get() {
        if (cached === undefined) {
          try {
            cached = parseFrontmatter(fs.readFileSync(filePath, 'utf8')).content;
          } catch {
            cached = '';
          }
        }
        return cached;
      }
    });
    record.filePath = filePath;
    record.dir = path.dirname(filePath);
    return record;
  }

  async loadSkills() {
    this.skills.clear();
    this.categories.clear();
    this.duplicates = [];
    this.overrides = [];

    if (this.user) this.preferences = readSkillPreferences(this.preferencesFile);
    if (!fs.existsSync(this.skillsDir)) {
      await this.mergePersonal();
      this.initialized = true;
      return Array.from(this.skills.values());
    }

    const files = this.listSkillFiles();
    const index = this.readFreshIndex(files);
    const entries = index
      ? index.skills.map(record => ({ record: { ...record }, content: undefined }))
      : this.scanSkills(files);

    // Skills were added or edited since the index was written: refresh it (best effort;
    // a read-only install simply keeps scanning)
    if (!index && this.autoIndex && files.length > 0) {
      try {
        const fresh = { version: INDEX_VERSION, fingerprint: this.fingerprint(files), skills: entries.map(e => e.record) };
        fs.writeFileSync(path.join(this.skillsDir, INDEX_FILE), `${JSON.stringify(fresh, null, 2)}\n`, 'utf8');
      } catch {
        // not writable
      }
    }

    for (const { record, content } of entries) {
      if (this.skills.has(record.id)) {
        this.duplicates.push(record.id);
        continue; // first one wins; `gaw skills lint` reports duplicates
      }
      record.library = this.library;
      this.skills.set(record.id, this.attachContent(record, content));
      this.categories.add(record.category);
    }

    await this.mergePersonal();
    this.initialized = true;
    this.loadedFromIndex = Boolean(index);
    return Array.from(this.skills.values());
  }

  /**
   * Add the user's personal library. A personal skill with the same name as an
   * official one replaces it for this user only, and is marked `overrides`.
   */
  async mergePersonal() {
    if (!this.personal) return;
    for (const skill of await this.personal.loadSkills()) {
      if (this.skills.has(skill.id)) {
        skill.overrides = this.skills.get(skill.id).library;
        this.overrides.push(skill.id);
      }
      this.skills.set(skill.id, skill);
      this.categories.add(skill.category);
    }
    this.duplicates.push(...this.personal.duplicates);
  }

  /** Reload preferences after `gaw skills pin/block` (skills stay loaded). */
  reloadPreferences() {
    if (this.user) this.preferences = readSkillPreferences(this.preferencesFile);
    return this.preferences;
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
