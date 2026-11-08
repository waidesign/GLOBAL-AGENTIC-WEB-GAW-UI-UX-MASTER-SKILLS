import { MAX_KEYWORDS, MAX_TAGS, RANKING_VERSION } from '../skill-registry/rankability.js';
import { PIN_BOOST } from '../skill-registry/preferences.js';

export { RANKING_VERSION };

// GSS Ranking v1 (docs/gss/spec.md, "Ranking"): exclusion and context rules
const NOT_FOR_MIN_MATCHED = 2;     // a whenNotToUse item needs at least this many task words matched...
const NOT_FOR_MIN_SHARE = 0.5;     // ...covering at least half of the item's words
const DOMAIN_BOOST = 1.1;          // small boost when a skill's domains match the project's

// Filler words that carry no topic. Without this, words like "a" or "on"
// matched inside unrelated skill IDs (e.g. "on" inside "animation").
const STOP_WORDS = new Set([
  'a', 'about', 'all', 'also', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'but', 'by',
  'can', 'could', 'do', 'for', 'from', 'get', 'have', 'help', 'how', 'i', 'im', 'in', 'into',
  'is', 'it', 'its', 'just', 'like', 'me', 'more', 'my', 'need', 'new', 'of', 'on', 'one',
  'or', 'our', 'should', 'so', 'some', 'that', 'the', 'their', 'them', 'then', 'there',
  'these', 'this', 'to', 'up', 'us', 'use', 'using', 'very', 'want', 'was', 'we', 'what',
  'when', 'where', 'which', 'who', 'will', 'with', 'would', 'you', 'your',
  'build', 'building', 'create', 'creating', 'develop', 'developing', 'make', 'making',
  'project', 'something', 'thing', 'things'
]);

// How much a match in each skill field counts. A word in the skill's ID or
// name says more about what the skill is for than a word in its description.
// GSS Ranking v1 scores these fields. summary and whenToUse are not scored: measured with
// npm run eval, adding them gave no gain (summary repeats the description; whenToUse copied
// from skill bodies is often a broad trigger list). Revisit when authors write their own.
const FIELD_WEIGHTS = { id: 3, name: 2, tags: 2, keywords: 2, category: 1, description: 1.5 };
const FIELD_ORDER = ['id', 'name', 'tags', 'keywords', 'category', 'description'];
// Matching inside skill bodies (weak signal). Off by default so search reads only
// the metadata index and never loads skill bodies; see `npm run eval`.
const CONTENT_WEIGHT = Number(process.env.GAW_CONTENT_WEIGHT || 0);

// Relevance rules for findRelevant (tuned with `npm run eval`):
// - the matched words must carry at least this share of the task's meaning
const MIN_COVERAGE = 0.34;
// - and a result must score at least this share of the best result
const MIN_SHARE_OF_BEST = 0.4;
// - a skill matching only one part of a multi-part task must cover at least half of that part
const MIN_PART_COVERAGE = 0.5;

/**
 * Split text into meaningful lowercase tokens: drops filler words and single
 * characters, joins dotted names ("three.js" -> "threejs"), and trims a plural
 * "s" ("pages" -> "page").
 */
export function tokenizeQuery(text) {
  const tokens = String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .map(t => t.replace(/^\.+|\.+$/g, '').replace(/\./g, ''))
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(t => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));
  return [...new Set(tokens)];
}

/**
 * Does a query token match a skill word? Exact for short tokens ("ui", "api"),
 * word start for longer ones ("auth" -> "authentication"), and the reverse for
 * word forms ("deployment" -> "deploy").
 */
function tokenMatchesWord(token, word) {
  if (token === word) return true;
  if (token.length >= 4 && word.startsWith(token)) return true;
  if (word.length >= 5 && token.startsWith(word)) return true;
  return false;
}

/**
 * Tie-breaker only: verified open license and a recent check rank a skill above an
 * otherwise equally relevant one. Never changes relevance itself.
 */
function trustRank(skill) {
  const status = skill.contract?.source?.licenseStatus;
  const license = status === 'open' || status === 'copyleft' ? 2 : status ? 0 : 1;
  const verified = Date.parse(skill.lastVerified || skill.contract?.lastVerified || '') || 0;
  return license * 1e13 + verified;
}

const matchesAny = (token, words) => {
  for (const word of words) {
    if (tokenMatchesWord(token, word)) return true;
  }
  return false;
};

/**
 * Split a multi-part task into its parts ("a, b, and c" -> ["a", "b", "c"]).
 * Returns [] for single-part tasks.
 */
export function splitTaskParts(task) {
  const parts = String(task || '')
    .split(/[,;]|\band\b|\bthen\b|\bplus\b/i)
    .map(p => p.trim())
    .filter(p => tokenizeQuery(p).length > 0);
  return parts.length > 1 ? parts : [];
}

/**
 * Map each query token back to the word the user typed ("saa" -> "SaaS"),
 * so explanations use the user's own words.
 */
function originalWords(text) {
  const map = new Map();
  for (const raw of String(text || '').split(/[^A-Za-z0-9+#.]+/)) {
    const [token] = tokenizeQuery(raw);
    if (token && !map.has(token)) map.set(token, raw.replace(/^\.+|\.+$/g, ''));
  }
  return map;
}

// Where a match counts most, for explanations: ID and name both read as "name"
const FIELD_LABELS = [['id', 'name'], ['name', 'name'], ['tags', 'tags'], ['keywords', 'keywords'], ['category', 'category'], ['description', 'description']];

/**
 * Human-readable reason, e.g. 'Matched "pricing", "page" (name); "SaaS" (description).'
 * Each word is listed under the most telling field it matched.
 */
export function explainMatch(entry) {
  if (!entry?.reasons?.length) return 'Selected explicitly.';
  const groups = new Map();
  for (const r of entry.reasons) {
    const label = FIELD_LABELS.find(([field]) => r.fields.includes(field))[1];
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(`"${r.word || r.token}"`);
  }
  const order = ['name', 'tags', 'keywords', 'category', 'description'];
  const parts = order.filter(l => groups.has(l)).map(l => `${groups.get(l).join(', ')} (${l})`);
  return `Matched ${parts.join('; ')}.`;
}

export class SkillDiscovery {
  constructor(skillRegistry) {
    this.registry = skillRegistry;
    this.index = null;
  }

  /** Word sets per skill field, plus document frequencies for IDF. Built once per skill set. */
  async getIndex() {
    const skills = await this.registry.getAllSkills();
    if (this.index && this.index.skills === skills.length) return this.index;

    const entries = skills.map(skill => {
      // Unreviewed AI drafts don't count for ranking (GSS Ranking v1)
      const drafts = new Set(skill.contract?.drafts || []);
      const contract = Object.fromEntries(Object.entries(skill.contract || {}).filter(([k]) => !drafts.has(k)));
      if (drafts.has('keywords')) skill = { ...skill, keywords: [] };
      return {
        skill,
        fields: {
          id: new Set(tokenizeQuery((skill.id || '').replace(/-/g, ' '))),
          name: new Set(tokenizeQuery(skill.name)),
          // Imported skills repeat their ID and category as tags; skip those so they don't count twice.
          // Caps stop keyword stuffing from buying a higher rank.
          tags: new Set((skill.tags || [])
            .map(String)
            .filter(t => t !== skill.id && t !== skill.category && t !== 'skills.sh')
            .slice(0, MAX_TAGS)
            .flatMap(t => tokenizeQuery(t))),
          keywords: new Set((skill.keywords || []).slice(0, MAX_KEYWORDS).flatMap(k => tokenizeQuery(String(k)))),
          category: new Set(tokenizeQuery((skill.category || '').replace(/-/g, ' '))),
          description: new Set(tokenizeQuery(skill.description))
        },
        notFor: (contract.whenNotToUse || [])
          .map(item => ({ item, tokens: tokenizeQuery(item) }))
          .filter(n => n.tokens.length >= NOT_FOR_MIN_MATCHED),
        domains: new Set((contract.domains || []).map(d => String(d).toLowerCase())),
        trust: trustRank(skill),
        content: CONTENT_WEIGHT > 0 ? new Set(tokenizeQuery(skill.content)) : new Set()
      };
    });

    this.index = { skills: skills.length, entries, df: new Map() };
    return this.index;
  }

  /** Inverse document frequency: rare words (few skills mention them) weigh more. */
  idf(index, token) {
    if (!index.df.has(token)) {
      let df = 0;
      for (const entry of index.entries) {
        if (FIELD_ORDER.some(f => matchesAny(token, entry.fields[f]))) df++;
      }
      index.df.set(token, df);
    }
    return Math.log(1 + index.entries.length / (1 + index.df.get(token)));
  }

  /**
   * Score one indexed skill. Returns score, coverage (share of the task's
   * meaning the skill matched in its metadata), matchedTokens and reasons.
   */
  scoreEntry(entry, tokens, weights, totalWeight) {
    let score = 0;
    let coveredWeight = 0;
    let namesSkill = false;
    const reasons = [];
    const compactId = (entry.skill.id || '').replace(/-/g, '');

    for (const token of tokens) {
      // The task names this skill outright ("teach me...", "tdd", "pdf")
      if (token === compactId) namesSkill = true;
      const w = weights.get(token);
      const fields = FIELD_ORDER.filter(f => matchesAny(token, entry.fields[f]));
      if (fields.length > 0) {
        score += fields.reduce((sum, f) => sum + FIELD_WEIGHTS[f], 0) * w;
        coveredWeight += w;
        reasons.push({ token, fields });
      } else if (entry.content.has(token)) {
        score += CONTENT_WEIGHT * w;
      }
    }

    return {
      score,
      strongScore: score,
      coverage: totalWeight > 0 ? coveredWeight / totalWeight : 0,
      matchedTokens: reasons.length,
      namesSkill,
      reasons
    };
  }

  /**
   * Search skills by relevance. With `withScores: true`, returns
   * [{ skill, score, coverage, matchedTokens, reasons }] instead of skills.
   */
  async search(query, options = {}) {
    const skills = await this.registry.getAllSkills();

    // No query at all: list skills (used by `gaw skills` style browsing)
    if (!query || !String(query).trim()) {
      const filtered = this.filter(skills, options);
      return options.withScores ? filtered.map(skill => ({ skill, score: 0, coverage: 0, matchedTokens: 0, reasons: [] })) : filtered;
    }

    // A query made only of filler words matches nothing
    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return [];

    const index = await this.getIndex();
    const weights = new Map(tokens.map(t => [t, this.idf(index, t)]));
    const totalWeight = [...weights.values()].reduce((a, b) => a + b, 0);
    const words = originalWords(query);

    const projectDomains = new Set((options.domains || []).map(d => String(d).toLowerCase()));
    // The user's skill preferences (Global Brain): blocked skills are never suggested,
    // pinned ones get a small boost. Only registries that load user data have them.
    const prefs = this.registry.preferences || {};
    const blocked = new Set(options.includeBlocked ? [] : (prefs.blocked || []));
    const pinned = new Set(prefs.pinned || []);

    const scored = [];
    for (const entry of index.entries) {
      if (blocked.has(entry.skill.id)) continue;
      if (!this.matchesFilter(entry.skill, options)) continue;
      const result = this.scoreEntry(entry, tokens, weights, totalWeight);
      if (result.score <= 0) continue;
      for (const r of result.reasons) r.word = words.get(r.token) || r.token;

      // Exclusion: the author said the skill is not for tasks like this one
      const notFor = entry.notFor.find(n => {
        const matched = n.tokens.filter(t => tokens.some(q => tokenMatchesWord(q, t)));
        return matched.length >= NOT_FOR_MIN_MATCHED && matched.length / n.tokens.length >= NOT_FOR_MIN_SHARE;
      });
      if (notFor) result.notFor = notFor.item;

      // Context: small boost when the skill's domains match the project's
      if (projectDomains.size && [...entry.domains].some(d => projectDomains.has(d))) result.score *= DOMAIN_BOOST;

      // Pinned by the user: a small boost. Coverage is unchanged, so a pin never
      // makes a skill that doesn't fit the task qualify.
      if (pinned.has(entry.skill.id)) {
        result.score *= PIN_BOOST;
        result.pinned = true;
      }

      scored.push({ skill: entry.skill, trust: entry.trust, ...result });
    }

    // Relevance first; trust only breaks exact ties
    scored.sort((a, b) => b.score - a.score || b.trust - a.trust);

    const limited = options.limit && options.limit > 0 ? scored.slice(0, options.limit) : scored;
    return options.withScores ? limited : limited.map(entry => entry.skill);
  }

  /**
   * Only close matches, for suggesting skills from a free-text task or goal.
   * A skill qualifies when its metadata covers enough of the task's meaning
   * (rare words weigh more) and it scores close to the best match. Returns []
   * for fields the library does not cover, rather than unrelated skills.
   * With `withScores: true`, entries include `reasons` (see explainMatch).
   */
  async findRelevant(query, options = {}) {
    const limit = options.limit || 5;
    const whole = await this.search(query, { ...options, limit: 0, withScores: true });
    const qualified = new Set(this.closeMatches(whole).map(e => e.skill.id));

    // Multi-part tasks ("dashboard with a sidebar, data table, and smooth animations"):
    // a skill that covers one part qualifies too, but only through its ID, name,
    // tags or category, so a passing phrase in a description is not enough.
    for (const part of splitTaskParts(query)) {
      const entries = await this.search(part, { ...options, limit: 0, withScores: true });
      const structural = entries.filter(e => e.reasons.some(r => r.fields.some(f => f !== 'description')));
      for (const e of this.closeMatches(structural, MIN_PART_COVERAGE)) qualified.add(e.skill.id);
    }

    // Rank by relevance to the whole task
    const relevant = whole.filter(e => qualified.has(e.skill.id)).slice(0, limit);
    return options.withScores ? relevant : relevant.map(e => e.skill);
  }

  /** Entries that cover enough of the query and score near the best one. */
  closeMatches(entries, minCoverage = MIN_COVERAGE) {
    // Skills whose whenNotToUse matches the task are never suggested
    const strong = entries.filter(e => !e.notFor && (e.namesSkill || (e.matchedTokens > 0 && e.coverage >= minCoverage)));
    if (strong.length === 0) return [];
    const best = strong[0].score;
    return strong.filter(e => e.namesSkill || e.score >= best * MIN_SHARE_OF_BEST);
  }

  filter(skills, options = {}) {
    let result = skills.filter(skill => this.matchesFilter(skill, options));
    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  matchesFilter(skill, options = {}) {
    if (options.category) {
      if (skill.category.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }
    }
    if (options.framework) {
      const target = options.framework.toLowerCase();
      const supported = (skill.frameworks || []).map(f => f.toLowerCase());
      if (!supported.includes('any') && !supported.includes(target)) {
        return false;
      }
    }
    if (options.tag) {
      const target = options.tag.toLowerCase();
      const tags = (skill.tags || []).map(t => t.toLowerCase());
      if (!tags.includes(target)) {
        return false;
      }
    }
    return true;
  }
}

export default SkillDiscovery;
