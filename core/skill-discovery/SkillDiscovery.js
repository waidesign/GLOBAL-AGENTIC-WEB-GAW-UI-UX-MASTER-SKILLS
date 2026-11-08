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

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Split a query into meaningful lowercase tokens: drops filler words and
 * single characters, and trims a plural "s" ("pages" -> "page").
 */
export function tokenizeQuery(query) {
  const tokens = String(query || '')
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .map(t => t.replace(/^\.+|\.+$/g, ''))
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(t => (t.length > 3 && t.endsWith('s') && !t.endsWith('ss') ? t.slice(0, -1) : t));
  return [...new Set(tokens)];
}

/**
 * Whole-word match for short tokens ("ui", "go"), word-start match for longer
 * ones ("auth" matches "authentication", but "api" does not match "rapid").
 */
function wordMatcher(token) {
  const t = escapeRegExp(token);
  return token.length <= 2
    ? new RegExp(`(^|[^a-z0-9])${t}($|[^a-z0-9])`)
    : new RegExp(`(^|[^a-z0-9])${t}`);
}

export class SkillDiscovery {
  constructor(skillRegistry) {
    this.registry = skillRegistry;
  }

  /**
   * Score one skill against query tokens. `strongScore` leaves out matches found
   * only in the skill body, which are weak signals of relevance.
   */
  scoreSkill(skill, tokens) {
    const idLower = (skill.id || '').toLowerCase();
    const nameLower = (skill.name || '').toLowerCase();
    const descLower = (skill.description || '').toLowerCase();
    const catLower = (skill.category || '').toLowerCase();
    const tags = (skill.tags || []).map(t => String(t).toLowerCase());
    const frameworks = (skill.frameworks || []).map(f => String(f).toLowerCase());
    const contentLower = (skill.content || '').toLowerCase();

    let strongScore = 0;
    let contentScore = 0;
    let matchedTokens = 0;

    for (const token of tokens) {
      const matches = wordMatcher(token);
      const before = strongScore;

      if (idLower === token) strongScore += 25;
      else if (matches.test(idLower)) strongScore += 15;

      if (nameLower === token) strongScore += 20;
      else if (matches.test(nameLower)) strongScore += 10;

      if (tags.includes(token)) strongScore += 12;
      else if (tags.some(tag => matches.test(tag))) strongScore += 6;

      if (frameworks.includes(token)) strongScore += 10;
      if (matches.test(catLower)) strongScore += 8;
      if (matches.test(descLower)) strongScore += 5;
      if (matches.test(contentLower)) contentScore += 1;

      if (strongScore > before) matchedTokens++;
    }

    return { score: strongScore + contentScore, strongScore, matchedTokens };
  }

  /**
   * Search skills by relevance. With `withScores: true`, returns
   * [{ skill, score, strongScore, matchedTokens }] instead of skills.
   */
  async search(query, options = {}) {
    const skills = await this.registry.getAllSkills();

    // No query at all: list skills (used by `gaw skills` style browsing)
    if (!query || !String(query).trim()) {
      const filtered = this.filter(skills, options);
      return options.withScores ? filtered.map(skill => ({ skill, score: 0, strongScore: 0 })) : filtered;
    }

    // A query made only of filler words matches nothing
    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return [];

    const scored = [];
    for (const skill of skills) {
      const { score, strongScore, matchedTokens } = this.scoreSkill(skill, tokens);
      if (score > 0 && this.matchesFilter(skill, options)) {
        scored.push({ skill, score, strongScore, matchedTokens });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    const limited = options.limit && options.limit > 0 ? scored.slice(0, options.limit) : scored;
    return options.withScores ? limited : limited.map(entry => entry.skill);
  }

  /**
   * Only close matches, for suggesting skills from a free-text goal.
   * A skill qualifies when it matches 2+ words of the goal with a solid score,
   * or one word very strongly (e.g. in its ID, name and tags). Returns [] for
   * fields the library does not cover, rather than unrelated skills.
   */
  async findRelevant(query, options = {}) {
    const limit = options.limit || 5;
    const entries = await this.search(query, { ...options, limit: 0, withScores: true });
    return entries
      .filter(e => (e.matchedTokens >= 2 && e.strongScore >= 25) || e.strongScore >= 40)
      .slice(0, limit)
      .map(e => e.skill);
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
