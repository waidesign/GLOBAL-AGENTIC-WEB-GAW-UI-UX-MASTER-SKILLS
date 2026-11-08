import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.js';

// GAW Skill Standard (GSS) v1 rules. See docs/gss/spec.md.
const ALLOWED_FRONTMATTER = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PLACEHOLDERS = new Set(['>', '>-', '>+', '|', '|-', '|+']);
const MAX_BODY_TOKENS = 5000;
const MAX_BODY_LINES = 500;
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
  source: 'object',
  extraFrontmatter: 'object'
};
const PERMISSIONS = new Set(['shell', 'network', 'filesystem', 'secrets']);

function typeMatches(value, type) {
  if (type === 'string[]') return Array.isArray(value) && value.every(v => typeof v === 'string');
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

/**
 * Validate one GSS skill folder. Returns { name, errors: [], warnings: [] }.
 * `knownSkills` (a Set of names) enables dependsOn checks.
 */
export function lintSkillFolder(dir, knownSkills = null) {
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
  if (tokens > MAX_BODY_TOKENS) warnings.push(`Body is ~${tokens} tokens (guideline: under ${MAX_BODY_TOKENS}); move detail into references/`);
  if (lines > MAX_BODY_LINES) warnings.push(`Body is ${lines} lines (guideline: under ${MAX_BODY_LINES})`);

  const contractFile = path.join(dir, 'gaw.json');
  if (fs.existsSync(contractFile)) {
    let contract = null;
    try {
      contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
    } catch (err) {
      errors.push(`gaw.json is not valid JSON: ${err.message}`);
    }
    if (contract) {
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

  return { name: name || folderName, errors, warnings };
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

  return {
    results,
    errorCount: results.reduce((n, r) => n + r.errors.length, 0),
    warningCount: results.reduce((n, r) => n + r.warnings.length, 0)
  };
}
