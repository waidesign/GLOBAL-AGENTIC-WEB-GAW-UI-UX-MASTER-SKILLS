/**
 * GAW Skill Standard (GSS) helpers: read/write skill folders, convert any skill
 * to GSS, apply verified licenses, and split oversized skills. See docs/gss/spec.md.
 */
import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { parseFrontmatter, stringifyFrontmatter } from './frontmatter.js';

export const MAX_BODY_TOKENS = 5000;
export const SPLIT_TARGET_TOKENS = 3500;
// Reference files group neighboring sections so agents open a few useful files, not dozens of tiny ones
const GROUP_MIN_TOKENS = 1200;
const GROUP_MAX_TOKENS = 3000;
const INDEX_HEADING = '## Detailed references';
const estimateTokens = (text) => Math.round((text || '').length / 4);

/** { data, content, contract } for a GSS skill folder. */
export function readSkillFolder(dir) {
  const { data, content } = parseFrontmatter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
  const contractFile = path.join(dir, 'gaw.json');
  const contract = fs.existsSync(contractFile) ? readJsonFile(contractFile) : { gss: 1 };
  return { data, content, contract };
}

export function writeSkillFolder(dir, { data, content, contract }) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), stringifyFrontmatter(data, content), 'utf8');
  if (contract) fs.writeFileSync(path.join(dir, 'gaw.json'), `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
}

/**
 * Record a resolved license (see licenses.js) in SKILL.md and gaw.json.
 * Unknown licenses are recorded as UNKNOWN, never guessed.
 */
export function applyLicense(dir, result, checkedAt = new Date().toISOString().split('T')[0]) {
  const skill = readSkillFolder(dir);
  skill.data.license = result.spdx || 'UNKNOWN';
  skill.contract.source = {
    ...(skill.contract.source || {}),
    licenseVerified: Boolean(result.spdx),
    licenseStatus: result.category,
    licenseEvidence: result.evidence,
    licenseUrl: result.url,
    licenseCheckedAt: checkedAt
  };
  writeSkillFolder(dir, skill);
  return skill;
}

// ---------- Converting any skill to GSS ----------

const STANDARD_FIELDS = ['name', 'description', 'license', 'compatibility', 'allowed-tools', 'metadata'];
const PLACEHOLDERS = new Set(['>', '>-', '>+', '|', '|-', '|+']);

/** Lowercase-hyphen skill name from any title ("My Cool Skill!" -> "my-cool-skill"). */
export function toSkillName(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\.md$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/, '');
}

/** First prose paragraph of a body, as a fallback description. */
export function deriveDescription(body, fallback) {
  for (const p of String(body || '').split(/\n\s*\n/).map(x => x.trim())) {
    if (!p || /^(#|```|\||<|-|>|\*\s)/.test(p)) continue;
    const text = p.replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();
    if (text.length >= 30) return text.length > 300 ? `${text.slice(0, 297).replace(/\s+\S*$/, '')}…` : text;
  }
  return fallback;
}

const asList = (v) => (Array.isArray(v) ? v.map(String) : String(v || '').split(',').map(s => s.trim()).filter(Boolean));

/**
 * Convert parsed frontmatter + body from any skill format (Agent Skills SKILL.md,
 * legacy GAW .md, or plain markdown) into GSS { data, contract, warnings }.
 * Non-standard top-level fields move into metadata (gaw-*) or gaw.json.
 */
export function convertToGss({ data = {}, content = '', nameHint = '', category = 'general', source = null, existingContract = null, raw = {} }) {
  const warnings = [];
  // Agent Skills names must match the folder, so the folder (nameHint) wins over a differing `name`
  const name = toSkillName(data.id || nameHint || data.name);
  if (!name) throw new Error('Could not work out a skill name. Use --name <skill-name>.');

  let description = typeof data.description === 'string' ? data.description.replace(/\s+/g, ' ').trim() : '';
  if (!description || PLACEHOLDERS.has(description)) {
    description = deriveDescription(content, '');
    if (description) warnings.push('No description found: one was derived from the skill text. Review it.');
    else {
      description = `${name} skill.`;
      warnings.push('No description found: add one that says what the skill does and when to use it.');
    }
  }
  if (description.length > 1024) {
    description = `${description.slice(0, 1020).replace(/\s+\S*$/, '')}…`;
    warnings.push('Description was longer than 1024 characters and was shortened.');
  }

  const upstreamMeta = (data.metadata && typeof data.metadata === 'object') ? data.metadata : {};
  const title = data.name && toSkillName(data.name) !== data.name ? String(data.name) : upstreamMeta['gaw-title'];
  const tags = asList(data.tags || upstreamMeta['gaw-tags']).filter(t => t !== name && t !== category && t !== 'skills.sh');

  const metadata = {};
  for (const [k, v] of Object.entries(upstreamMeta)) metadata[k] = String(v);
  Object.assign(metadata, {
    'gaw-title': title || undefined,
    'gaw-category': category,
    'gaw-author': String(data.author || upstreamMeta['gaw-author'] || upstreamMeta.author || 'unknown'),
    'gaw-version': String(data.version || upstreamMeta['gaw-version'] || upstreamMeta.version || '1.0.0'),
    'gaw-tags': tags.length ? tags.join(', ') : undefined
  });
  for (const k of Object.keys(metadata)) if (metadata[k] === undefined) delete metadata[k];

  const out = {
    name,
    description,
    license: data.license ? String(data.license) : undefined,
    compatibility: data.compatibility ? String(data.compatibility) : undefined,
    'allowed-tools': data['allowed-tools'] ? String(data['allowed-tools']) : undefined,
    metadata
  };

  // summary and other ranking fields are filled by enrichContract (rankability.js), which records them in `derived`
  const contract = { gss: 1, ...(existingContract || {}) };
  const deps = asList(data.dependencies || data.dependsOn);
  if (deps.length && !contract.dependsOn) contract.dependsOn = deps;
  const related = asList(data.relatedSkills || data.related);
  if (related.length && !contract.related) contract.related = related;
  const frameworks = asList(data.frameworks).filter(f => f !== 'any');
  if (frameworks.length && !contract.frameworks) contract.frameworks = frameworks;
  if (!contract.lastVerified) contract.lastVerified = new Date().toISOString().split('T')[0];
  if (source && !contract.source) contract.source = { ...source, licenseVerified: false };

  // Fields outside Agent Skills/GSS are kept in gaw.json so nothing from the original is lost
  const known = new Set([...STANDARD_FIELDS, 'id', 'category', 'author', 'version', 'tags', 'dependencies', 'dependsOn', 'relatedSkills', 'related', 'frameworks', 'lastVerified']);
  // Stored as the original YAML text, so nested structures survive exactly
  const extra = Object.fromEntries(Object.entries(data)
    .filter(([key]) => !known.has(key))
    .map(([key, value]) => [key, raw[key] ?? value]));
  if (Object.keys(extra).length) {
    contract.extraFrontmatter = { ...(contract.extraFrontmatter || {}), ...extra };
    warnings.push(`Kept non-standard field(s) ${Object.keys(extra).map(k => `"${k}"`).join(', ')} in gaw.json (extraFrontmatter).`);
  }

  return { data: out, contract, warnings };
}

// ---------- Splitting oversized skills ----------

const slugify = (text) => toSkillName(text) || 'section';

/** Split markdown into sections at "## " headings, ignoring headings inside code fences. */
function splitSections(body, level = 2) {
  const marker = `${'#'.repeat(level)} `;
  const lines = body.split('\n');
  const sections = [{ heading: null, lines: [] }];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && line.startsWith(marker)) sections.push({ heading: line.slice(marker.length).trim(), lines: [line] });
    else sections[sections.length - 1].lines.push(line);
  }
  return sections.map(s => ({ heading: s.heading, text: s.lines.join('\n').trim() })).filter(s => s.text);
}

/** Split long text without headings into paragraph chunks of roughly maxTokens. */
function chunkParagraphs(text, maxTokens) {
  const chunks = [];
  let current = [];
  let inFence = false;
  for (const para of text.split(/\n\s*\n/)) {
    const fences = (para.match(/^\s*(```|~~~)/gm) || []).length;
    if (!inFence && current.length && estimateTokens([...current, para].join('\n\n')) > maxTokens) {
      chunks.push(current.join('\n\n'));
      current = [];
    }
    current.push(para);
    if (fences % 2 === 1) inFence = !inFence;
  }
  if (current.length) chunks.push(current.join('\n\n'));
  return chunks;
}

/**
 * Plan a lossless split of an oversized skill body: keep the opening sections in
 * SKILL.md (up to ~targetTokens), move the rest into references/*.md, and add a
 * "Reference files" list so agents load each part only when the task needs it.
 * Returns null when the body is already within the limit.
 */
export function planSplit(content, options = {}) {
  const maxTokens = options.maxTokens || MAX_BODY_TOKENS;
  const target = options.targetTokens || SPLIT_TARGET_TOKENS;
  if (estimateTokens(content) <= maxTokens) return null;

  let sections = splitSections(content, 2);
  if (sections.length < 3) sections = splitSections(content, 3);
  if (sections.length < 3) {
    sections = chunkParagraphs(content, target).map((text, i) => ({ heading: i === 0 ? null : `Part ${i + 1}`, text }));
  }

  const keep = [];
  const move = [];
  let used = 0;
  for (const section of sections) {
    const tokens = estimateTokens(section.text);
    if (move.length === 0 && (keep.length === 0 || used + tokens <= target)) {
      keep.push(section);
      used += tokens;
    } else {
      move.push(section);
    }
  }
  // An opening section that is itself huge: split it into paragraphs
  if (move.length === 0 || used > maxTokens) {
    const chunks = chunkParagraphs(keep.map(s => s.text).join('\n\n'), target);
    keep.length = 0;
    keep.push({ heading: null, text: chunks[0] });
    move.unshift(...chunks.slice(1).map((text, i) => ({ heading: `Part ${i + 2}`, text })));
  }

  // Group neighboring moved sections into files of a useful size
  const groups = [];
  for (const section of move) {
    const tokens = estimateTokens(section.text);
    const current = groups[groups.length - 1];
    if (!current || current.tokens >= GROUP_MIN_TOKENS || current.tokens + tokens > GROUP_MAX_TOKENS) {
      groups.push({ sections: [section], tokens });
    } else {
      current.sections.push(section);
      current.tokens += tokens;
    }
  }

  const skillName = options.skillName || 'this';
  const usedNames = new Set();
  const references = groups.map((group, i) => {
    const headings = group.sections.map((s, j) => s.heading || `Part ${i + j + 2}`);
    const base = slugify(headings[0]);
    let file = `${base}.md`;
    for (let n = 2; usedNames.has(file); n++) file = `${base}-${n}.md`;
    usedNames.add(file);
    const title = headings.length > 3 ? `${headings.slice(0, 3).join('; ')}; …` : headings.join('; ');
    const body = group.sections.map(s => (s.text.startsWith('#') ? s.text : `## ${s.heading || 'Continued'}\n\n${s.text}`)).join('\n\n');
    const content = `<!-- Part of the ${skillName} skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->\n\n${body}\n`;
    return { file: `references/${file}`, title, headings, tokens: group.tokens, content };
  });

  const index = [
    INDEX_HEADING,
    '',
    '_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_',
    '',
    ...references.map(r => `- [${r.title}](${r.file}) (~${r.tokens} tokens)`)
  ].join('\n');

  const main = `${keep.map(s => s.text).join('\n\n')}\n\n${index}\n`;
  return { main, references, before: estimateTokens(content), after: estimateTokens(main) };
}

/** Apply a split plan to a skill folder (never overwrites existing reference files). */
export function applySplit(dir, plan) {
  const skill = readSkillFolder(dir);
  for (const ref of plan.references) {
    let target = path.join(dir, ref.file);
    if (fs.existsSync(target)) {
      const ext = path.extname(target);
      let n = 2;
      while (fs.existsSync(`${target.slice(0, -ext.length)}-${n}${ext}`)) n++;
      const renamed = `${ref.file.slice(0, -ext.length)}-${n}${ext}`;
      plan.main = plan.main.replace(`](${ref.file})`, `](${renamed})`);
      target = path.join(dir, renamed);
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, ref.content, 'utf8');
  }
  skill.content = plan.main;
  writeSkillFolder(dir, skill);
}

/** Whether a license allows GAW to restructure (modify) a skill. */
export function canModify(licenseStatus) {
  return licenseStatus === 'open' || licenseStatus === 'copyleft';
}
