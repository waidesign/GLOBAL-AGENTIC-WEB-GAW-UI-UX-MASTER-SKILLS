/**
 * GSS Ranking v1: rankability levels, contract enrichment from a skill's own
 * text, and the domain vocabulary. See docs/gss/spec.md, section "Ranking".
 *
 * Levels:
 *   0  Incomplete lint errors, or the skill doesn't say when to use it
 *   1  Findable   valid GSS + a description that says what the skill does and when to use it
 *   2  Rankable   + summary, whenToUse, domains, 3+ search terms (keywords, tags, frameworks)
 *   3  Precise    + whenNotToUse, verification
 */
import fs from 'node:fs';
import path from 'node:path';

export const RANKING_VERSION = 'gss-ranking-1';
export const LEVEL_NAMES = ['Incomplete', 'Findable', 'Rankable', 'Precise'];

// Anti-gaming caps (also enforced by the linter and the index)
export const MAX_KEYWORDS = 20;
export const MAX_KEYWORD_LENGTH = 40;
export const MAX_TAGS = 15;
export const MIN_SEARCH_TERMS = 3;

/** Recommended domains (open list: any lowercase word is allowed). */
export const DOMAINS = [
  'software', 'web', 'design', 'cloud', 'data', 'ai', 'security', 'documents', 'writing',
  'media', 'education', 'research', 'business', 'finance', 'health', 'science', 'legal', 'engineering'
];

const CATEGORY_DOMAINS = {
  '3d': ['web', 'design'], accessibility: ['web', 'design'], 'animation-motion': ['web', 'design'],
  architecture: ['software'], 'cloud-infra': ['cloud', 'software'], 'code-quality': ['software'],
  color: ['design'], components: ['web', 'design'], database: ['data', 'software'], debugging: ['software'],
  'design-systems': ['design', 'web'], documents: ['documents'], 'frontend-frameworks': ['web', 'software'],
  frontend: ['web', 'software'], interaction: ['web', 'design'], 'media-creative': ['media'],
  'micro-interactions': ['web', 'design'], performance: ['software'], react: ['web', 'software'],
  seo: ['web'], 'shadcn-ui': ['web', 'design'], systems: ['design', 'web'], testing: ['software'],
  typography: ['design'], 'ui-ux': ['design', 'web'], workflow: ['software', 'ai'], project: ['software']
};

// Whole words in a description that point to a domain
const DESCRIPTION_DOMAINS = [
  ['ai', /\b(llm|llms|claude|gpt|openai|anthropic|agents?|prompts?|ai)\b/i],
  ['writing', /\b(writ(e|ing)|prose|copywriting|articles?|essays?|docs?|documentation|communications?)\b/i],
  ['media', /\b(images?|videos?|audio|music|photos?|avatars?)\b/i],
  ['education', /\b(teach(ing)?|learn(ing)?|courses?|students?|lessons?|tutor(ing)?)\b/i],
  ['research', /\b(research|literature|sources|papers|citations?)\b/i],
  ['data', /\b(data|datasets?|sql|analytics|spreadsheets?|csv)\b/i],
  ['security', /\b(security|secure|vulnerabilit(y|ies)|auth(entication|orization)?|secrets?)\b/i],
  ['finance', /\b(financ(e|ial)|accounting|budgets?|invoices?|costs?)\b/i],
  ['business', /\b(business|marketing|sales|brand(ing)?|internal communications?)\b/i]
];

const USE_TRIGGER = /\b(use|used|useful|apply|invoke|trigger)\w*\b[^.]{0,80}\b(when|whenever|for|if|before|after)\b/i;

/** Split text into sentences without breaking "Three.js", "e.g." or version numbers. */
export function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z"'(“])/)
    .map(s => s.trim())
    .filter(Boolean);
}

const stripMarkdown = (t) => String(t || '')
  .replace(/^\s*[-*+]\s+(\[[ xX]\]\s+)?/, '')
  .replace(/^\s*\d+[.)]\s+/, '')
  .replace(/\*\*|__|`/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

/** Full text of a skill: SKILL.md body plus references/*.md (split skills keep sections there). */
export function readFullText(skill) {
  let text = skill.content || '';
  const refDir = skill.dir ? path.join(skill.dir, 'references') : null;
  if (refDir && fs.existsSync(refDir)) {
    for (const f of fs.readdirSync(refDir)) {
      if (f.endsWith('.md')) text += `\n\n${fs.readFileSync(path.join(refDir, f), 'utf8')}`;
    }
  }
  return text;
}

/** List items (or first sentences) under the first heading matching `headingRe`. */
function sectionItems(text, headingRe, max) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) inFence = !inFence;
    const heading = !inFence && lines[i].match(/^(#{1,4})\s+(.*)$/);
    if (!heading || !headingRe.test(heading[2])) continue;

    const level = heading[1].length;
    const items = [];
    const prose = [];
    let fence = false;
    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j];
      if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
      if (fence) continue;
      const next = line.match(/^(#{1,4})\s/);
      if (next && next[1].length <= level) break;
      if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) items.push(stripMarkdown(line));
      else if (line.trim() && !next && !line.trim().startsWith('|')) prose.push(line.trim());
    }
    const picked = items.length
      ? items
      : splitSentences(prose.join(' ')).slice(0, 2).map(stripMarkdown);
    return picked.filter(t => t.length >= 4 && t.length <= 240).slice(0, max);
  }
  return [];
}

// "DO NOT USE FOR: …", "Never use for …", "… not for general …": limits, not uses
const NOT_USE_TRIGGER = /\b(do not|don'?t|never|not to)\s+use\b|\bnot (for|as)\b|\buse \w+ instead\b/i;

/** Sentences of a description that say when to use the skill (never the "do not use" ones). */
function whenSentences(description) {
  return splitSentences(description)
    .filter(s => USE_TRIGGER.test(s) && !NOT_USE_TRIGGER.test(s))
    .map(s => s.slice(0, 240))
    .slice(0, 3);
}

/** Sentences of a description that say when NOT to use the skill. */
function whenNotSentences(description) {
  return splitSentences(description)
    .filter(s => NOT_USE_TRIGGER.test(s))
    .map(s => s.slice(0, 240))
    .slice(0, 3);
}

/**
 * Fill empty GSS contract fields from the skill's own text. Never overwrites a
 * field the author set, and never invents content: every value is taken from
 * the skill's description or body. Filled fields are listed in `derived`.
 * Keywords are not derived: synonyms must come from authors (or reviewed drafts).
 * Returns { contract, filled: [fieldNames] }.
 */
export function enrichContract(skill, options = {}) {
  const contract = { ...(skill.contract || {}) };
  const filled = [];
  // refresh: recompute fields GAW derived earlier (author-written fields are never in `derived`)
  if (options.refresh) {
    for (const field of contract.derived || []) delete contract[field];
    delete contract.derived;
  }
  const set = (field, value) => {
    const empty = contract[field] === undefined || contract[field] === '' || (Array.isArray(contract[field]) && contract[field].length === 0);
    if (!empty || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) return;
    contract[field] = value;
    filled.push(field);
  };
  const text = readFullText(skill);

  // summary: first one or two sentences of the description
  const sentences = splitSentences(skill.description);
  const summary = sentences.slice(0, 2).join(' ');
  set('summary', summary.length <= 300 ? summary : `${summary.slice(0, 297).replace(/\s+\S*$/, '')}…`);

  // whenToUse: "use when..." sentences, then a "When to use" section
  const whenToUse = [
    ...whenSentences(skill.description),
    ...sectionItems(text, /^(when to use|use (this|it)? ?when|use cases?|triggers?)\b/i, 6)
  ];
  set('whenToUse', [...new Set(whenToUse)].slice(0, 6));

  // whenNotToUse: explicit "do not use" sentences in the description, or a "when not to use" section
  const whenNot = [
    ...whenNotSentences(skill.description),
    ...sectionItems(text, /^(when not to use|when to avoid|do not use|don'?t use|not for)\b/i, 6)
  ];
  set('whenNotToUse', [...new Set(whenNot)].slice(0, 6));

  // verification: checklist / verification sections
  set('verification', sectionItems(text, /\b(checklist|checks?|verif\w*|validat\w*|quality gates?|acceptance criteria|definition of done)\b/i, 8));

  // domains: from the category, plus whole words in the description
  const domains = new Set(CATEGORY_DOMAINS[skill.category] || []);
  for (const [domain, re] of DESCRIPTION_DOMAINS) if (re.test(skill.description || '')) domains.add(domain);
  set('domains', [...domains].slice(0, 4));

  // permissions: hooks, pre-approved shell tools, or bundled scripts
  if (!contract.permissions?.length) {
    const hasScripts = skill.dir && fs.existsSync(path.join(skill.dir, 'scripts'));
    const hooks = contract.extraFrontmatter?.hooks;
    if (hasScripts || hooks) set('permissions', ['shell']);
  }

  if (filled.length) contract.derived = [...new Set([...(contract.derived || []), ...filled])].sort();
  return { contract, filled };
}

const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim()));

/** Unique search terms beyond the name: keywords, tags and frameworks. */
export function searchTerms(skill) {
  const c = skill.contract || {};
  const frameworks = (c.frameworks || skill.frameworks || []).filter(f => f !== 'any');
  return [...new Set([...(c.keywords || skill.keywords || []), ...(skill.tags || []), ...frameworks].map(t => String(t).toLowerCase()))];
}

/**
 * Rankability level of a skill and what is missing for the next level.
 * `lintErrorCount` comes from the linter (errors make a skill Invalid).
 */
export function rankabilityLevel(skill, lintErrorCount = 0) {
  // Unreviewed AI drafts don't count until a person reviews them
  const drafts = new Set(skill.contract?.drafts || []);
  const c = Object.fromEntries(Object.entries(skill.contract || {}).filter(([k]) => !drafts.has(k)));
  if (drafts.has('keywords')) skill = { ...skill, keywords: [], contract: c };
  if (lintErrorCount > 0) return { level: 0, name: LEVEL_NAMES[0], missing: ['fix lint errors'] };

  const findable = [];
  if (String(skill.description || '').trim().length < 40) findable.push('a description of at least 40 characters');
  if (!USE_TRIGGER.test(skill.description || '') && !nonEmpty(c.whenToUse)) findable.push('say when to use it (in the description or whenToUse)');
  if (findable.length) return { level: 0, name: LEVEL_NAMES[0], missing: findable };

  const rankable = [];
  if (!nonEmpty(c.summary)) rankable.push('summary');
  if (!nonEmpty(c.whenToUse)) rankable.push('whenToUse');
  if (!nonEmpty(c.domains)) rankable.push('domains');
  const terms = searchTerms(skill).length;
  if (terms < MIN_SEARCH_TERMS) rankable.push(`${MIN_SEARCH_TERMS - terms} more search term(s) (keywords or tags)`);
  if (rankable.length) return { level: 1, name: LEVEL_NAMES[1], missing: rankable };

  const precise = [];
  if (!nonEmpty(c.whenNotToUse)) precise.push('whenNotToUse');
  if (!nonEmpty(c.verification)) precise.push('verification');
  if (precise.length) return { level: 2, name: LEVEL_NAMES[2], missing: precise };

  return { level: 3, name: LEVEL_NAMES[3], missing: [] };
}
