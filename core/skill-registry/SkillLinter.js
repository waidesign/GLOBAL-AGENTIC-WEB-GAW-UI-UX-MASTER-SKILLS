import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.js';
import { rankabilityLevel, MAX_KEYWORDS, MAX_KEYWORD_LENGTH, MAX_TAGS, LEVEL_NAMES } from './rankability.js';

// Keyword stuffing: one word used this many times AND making up this share of the description.
// (Ranking already counts each word once per field, so this only flags extreme cases.)
const STUFFING_REPEATS = 6;
const STUFFING_SHARE = 0.1;
const STUFFING_IGNORE = new Set(['with', 'that', 'this', 'from', 'your', 'when', 'what', 'into', 'their', 'them', 'they', 'will', 'such', 'also', 'skill', 'skills', 'used', 'using']);

// GAW Skill Standard (GSS) v1 rules. See docs/gss/spec.md.
const ALLOWED_FRONTMATTER = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PLACEHOLDERS = new Set(['>', '>-', '>+', '|', '|-', '|+']);
const MAX_BODY_TOKENS = 5000;
const MAX_BODY_LINES = 500;
// Project skills (ai-brain/skills) load into every task that needs them, so they stay short:
// details go in references/ and are opened on demand
export const MAX_PROJECT_BODY_TOKENS = 500;
// Placeholder written by `gaw skills new`; a skill can't be published until it's replaced
export const NEW_SKILL_TODO = 'TODO:';

const CONTRACT_FIELDS = {
  gss: 'number',
  summary: 'string',
  keywords: 'string[]',
  whenToUse: 'string[]',
  whenNotToUse: 'string[]',
  inputs: 'string[]',
  outputs: 'string[]',
  constraints: 'string[]',
  dependsOn: 'string[]',
  related: 'string[]',
  frameworks: 'string[]',
  verification: 'string[]',
  permissions: 'string[]',
  lastVerified: 'string',
  verifiedAgainst: 'string[]',
  packages: 'string[]',
  exclusiveGroup: 'string',
  source: 'object',
  extraFrontmatter: 'object',
  domains: 'string[]',
  derived: 'string[]',
  drafts: 'string[]'
};
const PERMISSIONS = new Set(['shell', 'network', 'filesystem', 'secrets']);

function typeMatches(value, type) {
  if (type === 'string[]') return Array.isArray(value) && value.every(v => typeof v === 'string');
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

/** The body without fenced code blocks, so examples aren't checked as instructions. */
function proseOnly(body) {
  return body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '');
}

/** True when a skill folder sits in a project brain (ai-brain/skills/<name>). */
export function isProjectSkillDir(dir) {
  const parts = path.resolve(dir).split(path.sep);
  return parts.length >= 3 && parts[parts.length - 2] === 'skills' && parts[parts.length - 3] === 'ai-brain';
}

/**
 * Body problems agents trip over: links and supporting files that don't exist,
 * a second top-level heading, LaTeX math that renders as raw text.
 */
function lintBody(dir, body) {
  const warnings = [];
  const prose = proseOnly(body);

  // Relative links must point to files that exist. Not checked: web links, anchors,
  // placeholders like (URL), and links inside `inline code` (examples for the user's project)
  const broken = new Set();
  for (const m of prose.replace(/`[^`\n]*`/g, '').matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target = m[1].split('#')[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) continue;
    if (!/[./]/.test(target)) continue;
    if (!fs.existsSync(path.resolve(dir, decodeURIComponent(target)))) broken.add(m[1]);
  }
  if (broken.size) warnings.push(`Broken link${broken.size > 1 ? 's' : ''} (file not found): ${[...broken].join(', ')}`);

  // Supporting files the instructions tell the agent to open or run
  const missing = new Set();
  // Not skill files: HTML attribute values (src="assets/x.mp4") and destinations in the
  // user's repo ("copy it to `scripts/x.json`", "into the repo's `scripts/`")
  for (const m of prose.matchAll(/(?:^|[\s`(]|(?<!=)['"])(?:\.\/)?((?:references|scripts|assets)\/[\w./-]*\w\.[a-z0-9]+)/gim)) {
    const before = prose.slice(Math.max(0, m.index - 16), m.index + 1);
    if (/(\bto|\binto|repo's|project's)\s*`?$/i.test(before)) continue;
    const sentence = prose.slice(0, m.index + 1).split(/[.!?]\s|\n/).pop();
    if (/\bcopy\b.*\b(to|into)\b/i.test(sentence)) continue;
    if (!fs.existsSync(path.join(dir, m[1]))) missing.add(m[1]);
  }
  if (missing.size) warnings.push(`Mentions file${missing.size > 1 ? 's' : ''} that this skill doesn't include: ${[...missing].slice(0, 6).join(', ')}${missing.size > 6 ? ` (+${missing.size - 6} more)` : ''}`);

  const h1s = prose.split('\n').filter(l => /^# \S/.test(l));
  if (h1s.length > 1) warnings.push(`${h1s.length} top-level (#) headings: keep one title; use ## for sections`);

  if (/\$\\(?:le|ge|leq|geq|times|approx|neq|pm|rightarrow|to)\$/.test(prose)) {
    warnings.push('LaTeX math like $\\le$ shows as raw text in Markdown: use plain characters (≤, ≥, ×, ≈, →)');
  }
  return warnings;
}

/**
 * Validate one GSS skill folder. Returns { name, errors: [], warnings: [] }.
 * `knownSkills` (a Set of names) enables dependsOn checks.
 * `options.maxBodyTokens` overrides the size guideline (project skills use a smaller one).
 */
export function lintSkillFolder(dir, knownSkills = null, options = {}) {
  const errors = [];
  const warnings = [];
  const folderName = path.basename(dir);
  const skillFile = path.join(dir, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    return { name: folderName, errors: ['Missing SKILL.md'], warnings };
  }

  const { data, content, hasFrontmatter } = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
  if (!hasFrontmatter) errors.push('SKILL.md has no frontmatter (--- block)');

  for (const key of Object.keys(data)) {
    if (!ALLOWED_FRONTMATTER.has(key)) {
      errors.push(`Unknown frontmatter field "${key}": put GAW data in metadata (gaw-*) or gaw.json`);
    }
  }

  const name = typeof data.name === 'string' ? data.name : '';
  if (!name) errors.push('Missing "name"');
  else {
    if (name.length > 64) errors.push('"name" is longer than 64 characters');
    if (!NAME_PATTERN.test(name)) errors.push('"name" must be lowercase letters, digits and single hyphens');
    if (name !== folderName) errors.push(`"name" (${name}) must match the folder name (${folderName})`);
  }

  const description = typeof data.description === 'string' ? data.description.trim() : '';
  if (!description) errors.push('Missing "description"');
  else if (PLACEHOLDERS.has(description)) errors.push(`"description" is a placeholder ("${description}")`);
  else if (description.startsWith(NEW_SKILL_TODO)) errors.push('"description" is still the template text: say what the skill does and when to use it');

  // Anti-gaming: repeated words in the description
  if (description) {
    const counts = new Map();
    const allWords = description.toLowerCase().match(/[a-z][a-z0-9+#-]*/g) || [];
    for (const w of allWords) {
      if (w.length >= 4 && !STUFFING_IGNORE.has(w)) counts.set(w, (counts.get(w) || 0) + 1);
    }
    const stuffed = [...counts.entries()]
      .filter(([, n]) => n >= STUFFING_REPEATS && n / allWords.length >= STUFFING_SHARE)
      .map(([w]) => w);
    if (stuffed.length) warnings.push(`Description repeats ${stuffed.map(w => `"${w}"`).join(', ')} unusually often. Repetition doesn't improve ranking; list trigger phrases in gaw.json keywords instead`);
  }
  else if (description.length > 1024) errors.push('"description" is longer than 1024 characters');
  else if (description.length < 20) warnings.push('"description" is very short: say what the skill does and when to use it');

  if (data.compatibility !== undefined && String(data.compatibility).length > 500) {
    errors.push('"compatibility" is longer than 500 characters');
  }

  if (data.metadata !== undefined) {
    if (typeof data.metadata !== 'object' || Array.isArray(data.metadata)) {
      errors.push('"metadata" must be a map of string keys to string values');
    } else {
      for (const [k, v] of Object.entries(data.metadata)) {
        if (typeof v !== 'string') errors.push(`metadata "${k}" must be a string`);
      }
      const tagCount = String(data.metadata['gaw-tags'] || '').split(',').map(t => t.trim()).filter(Boolean).length;
      if (tagCount > MAX_TAGS) errors.push(`metadata gaw-tags has ${tagCount} tags (max ${MAX_TAGS})`);
      const category = data.metadata['gaw-category'];
      const parentFolder = path.basename(path.dirname(dir));
      // Library layout is skills/<category>/<name>; project skills sit directly in ai-brain/skills/
      if (category && parentFolder !== 'skills' && category !== parentFolder) {
        warnings.push(`metadata gaw-category (${category}) differs from the parent folder (${parentFolder})`);
      }
    }
  }

  if (!data.license) warnings.push('No "license": state the original author\'s license');

  const tokens = Math.round(content.length / 4);
  const lines = content.split('\n').length;
  const maxTokens = options.maxBodyTokens || (isProjectSkillDir(dir) ? MAX_PROJECT_BODY_TOKENS : MAX_BODY_TOKENS);
  if (tokens > maxTokens) warnings.push(`Body is ~${tokens} tokens (guideline: under ${maxTokens}); move detail into references/`);
  if (lines > MAX_BODY_LINES) warnings.push(`Body is ${lines} lines (guideline: under ${MAX_BODY_LINES})`);
  warnings.push(...lintBody(dir, content));

  const contractFile = path.join(dir, 'gaw.json');
  let contract = {};
  if (fs.existsSync(contractFile)) {
    try {
      contract = readJsonFile(contractFile);
    } catch (err) {
      errors.push(`gaw.json is not valid JSON: ${err.message}`);
      contract = null;
    }
    if (contract) {
      // Anti-gaming caps on search terms
      if (Array.isArray(contract.keywords)) {
        if (contract.keywords.length > MAX_KEYWORDS) errors.push(`gaw.json: ${contract.keywords.length} keywords (max ${MAX_KEYWORDS})`);
        const long = contract.keywords.filter(k => String(k).length > MAX_KEYWORD_LENGTH);
        if (long.length) errors.push(`gaw.json: keywords longer than ${MAX_KEYWORD_LENGTH} characters: ${long.map(k => `"${String(k).slice(0, 20)}…"`).join(', ')}`);
      }
      for (const [key, value] of Object.entries(contract)) {
        const type = CONTRACT_FIELDS[key];
        if (!type) warnings.push(`gaw.json: unknown field "${key}"`);
        else if (!typeMatches(value, type)) errors.push(`gaw.json: "${key}" must be ${type}`);
      }
      for (const dep of contract.dependsOn || []) {
        if (knownSkills && !knownSkills.has(dep)) errors.push(`gaw.json: dependsOn "${dep}" is not a known skill`);
      }
      for (const p of contract.permissions || []) {
        if (!PERMISSIONS.has(p)) warnings.push(`gaw.json: unknown permission "${p}"`);
      }
      const src = contract.source;
      if (src && (src.licenseStatus === 'unknown' || src.licenseStatus === 'restricted')) {
        warnings.push(`License ${src.licenseStatus === 'unknown' ? 'not found' : 'is restricted'} at the source (${src.licenseUrl || src.repo}): get the author's permission before redistributing`);
      } else if (src && src.licenseVerified === false) {
        warnings.push('License not yet verified against the original source: run gaw skills licenses');
      }
    }
  }

  // GSS Ranking v1 rankability level
  const meta = (data.metadata && typeof data.metadata === 'object') ? data.metadata : {};
  const rank = rankabilityLevel({
    id: name || folderName,
    name: meta['gaw-title'] || name,
    description,
    tags: String(meta['gaw-tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
    contract: contract || {}
  }, errors.length);

  return { name: name || folderName, errors, warnings, level: rank.level, levelName: rank.name, missing: rank.missing };
}

/** Find every GSS skill folder under a directory. */
export function findSkillFolders(root) {
  const folders = [];
  const walk = (dir) => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    if (entries.some(e => e.isFile() && e.name === 'SKILL.md')) {
      folders.push(dir);
      return;
    }
    for (const e of entries) if (e.isDirectory()) walk(path.join(dir, e.name));
  };
  walk(root);
  return folders.sort();
}

/**
 * Lint every skill under `root` (or one skill folder). Also reports duplicate
 * names and legacy single-file skills. Returns { results, errorCount, warningCount }.
 */
export function lintLibrary(root) {
  const folders = fs.existsSync(path.join(root, 'SKILL.md')) ? [root] : findSkillFolders(root);
  const names = new Map();
  for (const dir of folders) {
    const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
    const name = data.name || path.basename(dir);
    names.set(name, [...(names.get(name) || []), dir]);
  }
  const known = new Set(names.keys());

  const results = folders.map(dir => ({ dir, ...lintSkillFolder(dir, known) }));
  for (const [name, dirs] of names) {
    if (dirs.length > 1) {
      for (const r of results.filter(res => dirs.includes(res.dir))) {
        r.errors.push(`Duplicate skill name "${name}" (${dirs.length} folders)`);
      }
    }
  }

  // Anti-gaming: the same description on several skills
  const byDescription = new Map();
  for (const dir of folders) {
    const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
    const key = String(data.description || '').toLowerCase().replace(/\W+/g, ' ').trim();
    if (key.length >= 40) byDescription.set(key, [...(byDescription.get(key) || []), dir]);
  }
  for (const dirs of byDescription.values()) {
    if (dirs.length < 2) continue;
    for (const r of results.filter(res => dirs.includes(res.dir))) {
      r.warnings.push(`Same description as ${dirs.filter(d => d !== r.dir).map(d => path.basename(d)).join(', ')}`);
    }
  }

  const levels = LEVEL_NAMES.map((levelName, level) => ({ level, name: levelName, count: results.filter(r => r.level === level).length }));

  return {
    results,
    levels,
    errorCount: results.reduce((n, r) => n + r.errors.length, 0),
    warningCount: results.reduce((n, r) => n + r.warnings.length, 0)
  };
}
