import { SkillDiscovery, explainMatch } from '../skill-discovery/SkillDiscovery.js';
import { PresetRegistry } from '../preset-registry/PresetRegistry.js';
import { trustLevel, describeTrust, needsCaution } from '../skill-registry/trust.js';

// Default context budget for `gaw use`: full instructions are loaded while they
// fit; anything beyond is listed in short form for the agent to open if needed.
export const DEFAULT_TOKEN_BUDGET = 8000;
const MAX_SKILLS_PER_TASK = 4;

// Skill categories that mean the task involves a user interface, so a design preset can help
const UI_CATEGORIES = new Set([
  'ui-ux', 'design-systems', 'frontend', 'frontend-frameworks', 'animation-motion',
  'micro-interactions', 'interaction', 'typography', 'color', 'components', 'shadcn-ui',
  'systems', 'react', '3d'
]);
const UI_TASK_WORDS = /\b(ui|ux|website|web ?site|web ?page|landing|dashboard|layout|interface|front-?end|component|styling|css|tailwind|design system|screen|app design)\b/i;

const estimateTokens = (text) => Math.round((text || '').length / 4);

export class SkillOrchestrator {
  constructor(skillRegistry, presetRegistry = null) {
    this.registry = skillRegistry;
    this.discovery = new SkillDiscovery(skillRegistry);
    this.presetRegistry = presetRegistry || new PresetRegistry();
  }

  /** A task needs a design preset only when it involves a user interface. */
  isUiTask(taskPrompt, skills = []) {
    return UI_TASK_WORDS.test(taskPrompt || '') || skills.some(s => UI_CATEGORIES.has(s.category));
  }

  /**
   * Analyze a task: find skills that closely match it (and nothing when none do),
   * with a reason for each.
   */
  async analyzeTask(taskPrompt, projectContext = {}) {
    const matches = await this.discovery.findRelevant(taskPrompt, { limit: MAX_SKILLS_PER_TASK + 2, withScores: true });
    const reasonById = new Map(matches.map(m => [m.skill.id, explainMatch(m)]));
    const ranked = matches.map(m => m.skill);

    const primarySkills = ranked.slice(0, 3);
    const supportingSkills = ranked.slice(3, MAX_SKILLS_PER_TASK + 2);

    // Resolve declared dependencies that are not already selected
    const selectedIds = new Set(ranked.map(s => s.id));
    const dependencies = [];
    for (const skill of ranked) {
      for (const depId of skill.dependencies || []) {
        if (selectedIds.has(depId)) continue;
        const dep = await this.registry.getSkill(depId);
        if (dep) {
          dependencies.push(dep);
          selectedIds.add(depId);
          reasonById.set(depId, `Required by ${skill.id}.`);
        }
      }
    }

    // Known conflicts between selected skills
    const conflicts = [];
    if (selectedIds.has('baseline-ui') && selectedIds.has('improve-animations')) {
      conflicts.push({
        skills: ['baseline-ui', 'improve-animations'],
        resolution: 'Baseline UI restricts unnecessary animations. Animations must strictly be compositor-driven and deliberate.'
      });
    }

    const detectedFrameworks = new Set();
    if (projectContext.framework) detectedFrameworks.add(projectContext.framework.toLowerCase());

    return {
      objective: taskPrompt,
      detectedCategories: [...new Set(ranked.map(s => s.category))],
      detectedFrameworks: [...detectedFrameworks],
      primarySkills,
      supportingSkills,
      dependencies,
      conflicts,
      reasons: reasonById,
      recommendedOrder: [...primarySkills, ...supportingSkills, ...dependencies]
    };
  }

  /**
   * Recommend skills for a task, each with the reason it was chosen.
   */
  async recommend(taskPrompt, projectContext = {}) {
    const analysis = await this.analyzeTask(taskPrompt, projectContext);
    const describe = (s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      trust: trustLevel(s),
      reason: analysis.reasons.get(s.id) || 'Selected for this task.'
    });

    const designPresets = this.isUiTask(taskPrompt, analysis.recommendedOrder)
      ? await this.presetRegistry.recommend(taskPrompt)
      : [];

    return {
      prompt: taskPrompt,
      primarySkills: analysis.primarySkills.map(describe),
      supportingSkills: analysis.supportingSkills.map(describe),
      dependencies: analysis.dependencies.map(describe),
      conflicts: analysis.conflicts,
      designPresets,
      executionOrder: analysis.recommendedOrder.map(s => s.id)
    };
  }

  /**
   * Progressive skill loading for a task:
   *   1. explicit skill IDs in the prompt ("<landing-page>, <pricing-page>"), or
   *   2. skills that closely match the task (none when nothing fits),
   * then full instructions while they fit the token budget, short form after that.
   */
  async loadSkillsForTask(taskPrompt, projectContext = {}, options = {}) {
    const tokenBudget = options.tokenBudget || DEFAULT_TOKEN_BUDGET;

    // Explicit skill IDs (e.g. "<landing-page>, <pricing-page>" or "landing-page pricing-page")
    const cleanedTokens = (taskPrompt || '')
      .replace(/[<>,()]/g, ' ')
      .split(/\s+/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const explicitSkills = [];
    for (const token of cleanedTokens) {
      const skill = await this.registry.getSkill(token);
      if (skill && !explicitSkills.some(s => s.id === skill.id)) {
        explicitSkills.push(skill);
      }
    }

    let selected = [];
    let conflicts = [];
    let reasons = new Map();

    if (explicitSkills.length > 0) {
      selected = explicitSkills;
      reasons = new Map(explicitSkills.map(s => [s.id, 'Requested explicitly.']));
    } else {
      const analysis = await this.analyzeTask(taskPrompt, projectContext);
      selected = analysis.recommendedOrder.slice(0, MAX_SKILLS_PER_TASK);
      conflicts = analysis.conflicts;
      reasons = analysis.reasons;
    }

    const loadedInstructions = this.fitToBudget(selected, reasons, tokenBudget);

    const recommendedDesignPreset = this.isUiTask(taskPrompt, selected)
      ? (await this.presetRegistry.recommend(taskPrompt))[0] || null
      : null;

    return {
      timestamp: new Date().toISOString(),
      task: taskPrompt,
      selectedSkillCount: selected.length,
      tokenBudget,
      skills: loadedInstructions,
      conflictResolutions: conflicts,
      recommendedDesignPreset,
      formattedInstructions: this.formatInstructions(loadedInstructions, conflicts, { objective: taskPrompt })
    };
  }

  /**
   * Full instructions while they fit the token budget; beyond it, a short form
   * (description, reason, file path) the agent opens only if needed.
   * Reads skill bodies only for skills that are actually loaded.
   */
  fitToBudget(skills, reasons = new Map(), tokenBudget = DEFAULT_TOKEN_BUDGET) {
    let used = 0;
    return skills.map(skill => {
      const fullTokens = skill.tokenEstimate ?? estimateTokens(skill.content);
      const fits = used + fullTokens <= tokenBudget;
      used += fits ? fullTokens : estimateTokens(skill.description) + 60;
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        author: skill.author,
        version: skill.version,
        frameworks: skill.frameworks,
        description: skill.description,
        filePath: skill.filePath,
        trust: trustLevel(skill),
        trustNote: describeTrust(skill),
        caution: needsCaution(skill),
        reason: reasons.get(skill.id) || 'Selected for this task.',
        mode: fits ? 'full' : 'summary',
        fullTokens,
        content: fits ? skill.content : ''
      };
    });
  }

  /**
   * Load exactly the given skills (e.g. the ones a user picked during onboarding)
   * within the token budget, formatted for ai-brain/active-skills.md. Unknown IDs are ignored.
   */
  async loadSkillsByIds(skillIds, objective = '', options = {}) {
    const skills = [];
    for (const id of skillIds) {
      const skill = await this.registry.getSkill(id);
      if (skill && !skills.some(s => s.id === skill.id)) skills.push(skill);
    }
    const loaded = this.fitToBudget(skills, options.reasons || new Map(), options.tokenBudget || DEFAULT_TOKEN_BUDGET);
    return {
      skills: loaded,
      formattedInstructions: this.formatInstructions(loaded, [], { objective })
    };
  }

  formatInstructions(skills, conflicts = [], options = {}) {
    let md = `# GLOBAL AGENTIC WEB — ACTIVE SKILL CONTEXT\n\n`;
    if (options.objective) md += `**Objective**: ${options.objective}\n\n`;

    if (skills.length === 0) {
      md += `No skills in the library closely match this task, so none were loaded.\n`;
      md += `Work from the project rules in ai-brain/ and your own expertise.\n`;
      return md;
    }

    md += `Loaded ${skills.length} specialized skill(s) for the current task.\n\n`;

    if (conflicts.length > 0) {
      md += `## ⚠️ Conflict Resolutions & Hierarchy\n`;
      for (const conf of conflicts) {
        md += `- **[${conf.skills.join(' ↔ ')}]**: ${conf.resolution}\n`;
      }
      md += `\n`;
    }

    for (const skill of skills) {
      md += `## Skill: ${skill.name} (${skill.id})\n`;
      md += `**Category**: \`${skill.category}\` | **Author**: ${skill.author} | **Version**: ${skill.version}\n`;
      if (skill.reason) md += `**Why**: ${skill.reason}\n`;
      // Official skills need no note; others say where they come from
      if (skill.trust && skill.trust !== 'official') md += `**Source**: ${skill.trustNote}\n`;
      if (skill.caution) md += `**Caution**: this skill can run commands and GAW has not reviewed it. Show the user any command from it before running it.\n`;
      md += `\n`;

      if (skill.mode === 'summary') {
        md += `${skill.description}\n\n`;
        md += `_Full instructions (~${skill.fullTokens} tokens) were not loaded to save context. `;
        md += `Read them only if this task needs them: \`${skill.filePath}\`_\n\n`;
      } else {
        md += `${skill.content}\n\n`;
      }
      md += `---\n\n`;
    }

    return md;
  }
}

export default SkillOrchestrator;
