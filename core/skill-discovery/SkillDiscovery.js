export class SkillDiscovery {
  constructor(skillRegistry) {
    this.registry = skillRegistry;
  }

  async search(query, options = {}) {
    const skills = await this.registry.getAllSkills();
    if (!query || !query.trim()) {
      return this.filter(skills, options);
    }

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scoredSkills = [];

    for (const skill of skills) {
      let score = 0;
      const idLower = (skill.id || '').toLowerCase();
      const nameLower = (skill.name || '').toLowerCase();
      const descLower = (skill.description || '').toLowerCase();
      const catLower = (skill.category || '').toLowerCase();
      const tags = (skill.tags || []).map(t => t.toLowerCase());
      const frameworks = (skill.frameworks || []).map(f => f.toLowerCase());
      const contentLower = (skill.content || '').toLowerCase();

      for (const token of tokens) {
        if (idLower === token) score += 25;
        else if (idLower.includes(token)) score += 15;

        if (nameLower === token) score += 20;
        else if (nameLower.includes(token)) score += 10;

        if (tags.includes(token)) score += 12;
        if (frameworks.includes(token)) score += 10;
        if (catLower.includes(token)) score += 8;
        if (descLower.includes(token)) score += 5;
        if (contentLower.includes(token)) score += 1;
      }

      if (score > 0) {
        scoredSkills.push({ skill, score });
      }
    }

    // Sort descending by score
    scoredSkills.sort((a, b) => b.score - a.score);

    const filtered = scoredSkills
      .map(entry => entry.skill)
      .filter(skill => this.matchesFilter(skill, options));

    if (options.limit && options.limit > 0) {
      return filtered.slice(0, options.limit);
    }

    return filtered;
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

