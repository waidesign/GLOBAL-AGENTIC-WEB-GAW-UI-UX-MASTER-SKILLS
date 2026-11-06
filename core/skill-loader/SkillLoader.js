/**
 * SkillLoader
 * Implements Progressive Skill Loading Levels 1 through 6:
 * - Level 1: Discovery (lightweight metadata)
 * - Level 2: Selection (scoring & dependencies)
 * - Level 3: Instruction Loading (full instruction text for selected skills)
 * - Level 4: Supporting References
 * - Level 5: Execution Packaging
 * - Level 6: Output Evaluation Criteria
 */
export class SkillLoader {
  constructor(skillRegistry) {
    this.registry = skillRegistry;
  }

  async loadProgressiveContext(selectedSkills, conflicts = []) {
    const loaded = [];

    for (const skill of selectedSkills) {
      loaded.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        author: skill.author,
        version: skill.version,
        frameworks: skill.frameworks,
        tags: skill.tags,
        content: skill.content
      });
    }

    return {
      totalLoaded: loaded.length,
      skills: loaded,
      conflicts,
      formattedInstructions: this.formatInstructions(loaded, conflicts)
    };
  }

  formatInstructions(skills, conflicts = []) {
    let md = `# GLOBAL AGENTIC WEB — ACTIVE SKILL CONTEXT\n\n`;
    md += `Loaded ${skills.length} specialized skill(s) for the current task.\n\n`;

    if (conflicts && conflicts.length > 0) {
      md += `## ⚠️ Conflict Resolutions & Precedence\n`;
      for (const conf of conflicts) {
        md += `- **[${conf.skills.join(' ↔ ')}]**: ${conf.resolution}\n`;
      }
      md += `\n`;
    }

    for (const skill of skills) {
      md += `## Skill: ${skill.name} (${skill.id})\n`;
      md += `**Category**: \`${skill.category}\` | **Author**: ${skill.author} | **Version**: ${skill.version}\n\n`;
      md += `${skill.content}\n\n`;
      md += `---\n\n`;
    }

    return md;
  }
}

export default SkillLoader;

