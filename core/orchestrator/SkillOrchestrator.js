import { SkillDiscovery } from '../skill-discovery/SkillDiscovery.js';

export class SkillOrchestrator {
  constructor(skillRegistry) {
    this.registry = skillRegistry;
    this.discovery = new SkillDiscovery(skillRegistry);
  }

  /**
   * Analyze a user task prompt and project context
   */
  async analyzeTask(taskPrompt, projectContext = {}) {
    const prompt = taskPrompt || '';
    const tokens = prompt.toLowerCase();

    // Categorization heuristics
    const detectedCategories = new Set();
    const detectedFrameworks = new Set();

    if (/design system|token|component library|tokens|ds\b/i.test(tokens)) {
      detectedCategories.add('design-systems');
    }
    if (/animat|motion|transition|gsap|framer|scroll|micro-interaction/i.test(tokens)) {
      detectedCategories.add('animation-motion');
    }
    if (/ui|ux|wireframe|flow|layout|dashboard|landing|pricing|saas/i.test(tokens)) {
      detectedCategories.add('ui-ux');
    }
    if (/react|jsx|tsx|hook|virtual dom|state|million/i.test(tokens)) {
      detectedCategories.add('react');
      detectedFrameworks.add('react');
    }
    if (/shadcn|radix|lucide|ui component/i.test(tokens)) {
      detectedCategories.add('shadcn-ui');
    }
    if (/perform|speed|render|re-render|bundle|vitals/i.test(tokens)) {
      detectedCategories.add('performance');
    }
    if (/accessib|a11y|screen reader|aria|wcag|contrast/i.test(tokens)) {
      detectedCategories.add('accessibility');
    }
    if (/seo|metadata|meta tag|sitemap|open graph/i.test(tokens)) {
      detectedCategories.add('seo');
    }
    if (/3d|three\.js|threejs|webgl|mesh|canvas/i.test(tokens)) {
      detectedCategories.add('3d');
    }
    if (/tailwind|css|flex|grid|styling/i.test(tokens)) {
      detectedCategories.add('frontend');
    }

    if (projectContext.framework) {
      detectedFrameworks.add(projectContext.framework.toLowerCase());
    }

    // Run semantic/token discovery
    const candidates = await this.discovery.search(taskPrompt, { limit: 12 });

    // Select primary and supporting skills
    const primarySkills = [];
    const supportingSkills = [];
    const dependencyIds = new Set();

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (i < 3) {
        primarySkills.push(candidate);
      } else if (i < 6) {
        supportingSkills.push(candidate);
      }

      // Check dependencies
      if (candidate.dependencies && candidate.dependencies.length > 0) {
        for (const dep of candidate.dependencies) {
          dependencyIds.add(dep);
        }
      }
    }

    // Resolve dependencies
    const resolvedDependencies = [];
    for (const depId of dependencyIds) {
      if (!primarySkills.some(s => s.id === depId) && !supportingSkills.some(s => s.id === depId)) {
        const depSkill = await this.registry.getSkill(depId);
        if (depSkill) resolvedDependencies.push(depSkill);
      }
    }

    // Detect potential conflicts (e.g. baseline-ui vs custom raw styling, or animations when minimal motion required)
    const conflicts = [];
    const allSelectedIds = [...primarySkills, ...supportingSkills, ...resolvedDependencies].map(s => s.id);
    if (allSelectedIds.includes('baseline-ui') && allSelectedIds.includes('improve-animations')) {
      conflicts.push({
        skills: ['baseline-ui', 'improve-animations'],
        resolution: 'Baseline UI restricts unnecessary animations. Animations must strictly be compositor-driven and deliberate.'
      });
    }

    return {
      objective: taskPrompt,
      detectedCategories: Array.from(detectedCategories),
      detectedFrameworks: Array.from(detectedFrameworks),
      primarySkills,
      supportingSkills,
      dependencies: resolvedDependencies,
      conflicts,
      recommendedOrder: [...primarySkills, ...supportingSkills, ...resolvedDependencies]
    };
  }

  /**
   * Recommend skills for a task with structured rationale
   */
  async recommend(taskPrompt, projectContext = {}) {
    const analysis = await this.analyzeTask(taskPrompt, projectContext);
    
    return {
      prompt: taskPrompt,
      primarySkills: analysis.primarySkills.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        reason: `Primary skill addressing key objectives of '${s.category}' and requested functionality.`
      })),
      supportingSkills: analysis.supportingSkills.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        reason: `Supporting guidance for '${s.category}'.`
      })),
      dependencies: analysis.dependencies.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        reason: `Required dependency for selected skills.`
      })),
      conflicts: analysis.conflicts,
      executionOrder: analysis.recommendedOrder.map(s => s.id)
    };
  }

  /**
   * Progressive Skill Loading:
   * Level 1: Discovery (metadata only)
   * Level 2: Selection
   * Level 3: Full instructions of selected skills
   */
  async loadSkillsForTask(taskPrompt, projectContext = {}, options = {}) {
    const analysis = await this.analyzeTask(taskPrompt, projectContext);
    const selected = analysis.recommendedOrder;

    // Build the progressive loaded context payload
    const loadedInstructions = selected.map(skill => {
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        author: skill.author,
        version: skill.version,
        frameworks: skill.frameworks,
        content: skill.content
      };
    });

    const contextPayload = {
      timestamp: new Date().toISOString(),
      task: taskPrompt,
      selectedSkillCount: selected.length,
      skills: loadedInstructions,
      conflictResolutions: analysis.conflicts,
      formattedInstructions: this.formatInstructions(loadedInstructions, analysis.conflicts)
    };

    return contextPayload;
  }

  formatInstructions(skills, conflicts = []) {
    let md = `# GLOBAL AGENTIC WEB — ACTIVE SKILL CONTEXT\n\n`;
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
      md += `**Category**: \`${skill.category}\` | **Author**: ${skill.author} | **Version**: ${skill.version}\n\n`;
      md += `${skill.content}\n\n`;
      md += `---\n\n`;
    }

    return md;
  }
}

export default SkillOrchestrator;

