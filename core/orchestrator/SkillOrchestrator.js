import path from 'node:path';
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

// Shown to agents on every UI task instead of repeating accessibility rules in each skill
export const UI_BASELINE_SKILL = 'accessibility-baseline';

const groupOf = (skill) => skill.contract?.exclusiveGroup || null;
const packagesOf = (skill) => (skill.contract?.packages || []).map(p => p.toLowerCase());
const groupLabel = (group) => group.replace(/-/g, ' ');

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
  /**
   * Skills that do the same job (same gaw.json `exclusiveGroup`, e.g. animation
   * libraries) are not loaded together. The one whose package is in the project's
   * dependencies wins; when the task matched a different one, the installed one
   * replaces it. Explicitly requested skills are all kept, with a conflict note.
   * Returns { skills, excluded: [{ id, name, reason }], conflicts, reasons }.
   */
  async resolveAlternatives(skills, projectContext = {}, options = {}) {
    const deps = new Set((projectContext.dependencies || []).map(d => String(d).toLowerCase()));
    const installedPackage = (skill) => packagesOf(skill).find(p => deps.has(p)) || null;
    const excluded = [];
    const conflicts = [];
    const reasons = new Map();

    const byGroup = new Map();
    for (const s of skills) {
      const g = groupOf(s);
      if (g) byGroup.set(g, [...(byGroup.get(g) || []), s]);
    }
    if (byGroup.size === 0) return { skills, excluded, conflicts, reasons };

    let result = [...skills];
    const blocked = new Set(this.registry.preferences?.blocked || []);
    for (const [group, members] of byGroup) {
      if (options.explicit) {
        if (members.length > 1) {
          const installed = members.find(installedPackage);
          conflicts.push({
            skills: members.map(m => m.id),
            resolution: `These do the same job (${groupLabel(group)}). Don't mix them in one feature${installed
              ? `; this project already uses ${installedPackage(installed)}, so prefer ${installed.id}`
              : deps.size ? '; neither is installed yet, so ask the user which one to add' : ''}.`
          });
        }
        continue;
      }

      let keep = members.find(installedPackage) || null;
      if (!keep && deps.size) {
        // The task matched a library the project doesn't use: switch to the one it does use
        const all = await this.registry.getAllSkills();
        const alt = all.find(s => groupOf(s) === group && installedPackage(s) && !blocked.has(s.id));
        if (alt) {
          keep = alt;
          reasons.set(alt.id, `${installedPackage(alt)} is in this project's dependencies; used instead of ${members.map(m => m.id).join(', ')} (same job).`);
          const at = result.indexOf(members[0]);
          result.splice(at, 0, alt);
        }
      }
      keep ||= members[0];

      for (const m of members) {
        if (m === keep) continue;
        result = result.filter(s => s !== m);
        const why = installedPackage(keep)
          ? `Same job as ${keep.id} (${groupLabel(group)}); ${installedPackage(keep)} is the one in this project's dependencies.`
          : `Same job as ${keep.id} (${groupLabel(group)}); one per task. Neither is installed yet: ask before adding one.`;
        excluded.push({ id: m.id, name: m.name, reason: why });
      }
    }
    return { skills: result, excluded, conflicts, reasons };
  }

  async analyzeTask(taskPrompt, projectContext = {}) {
    const matches = await this.discovery.findRelevant(taskPrompt, { limit: MAX_SKILLS_PER_TASK + 2, withScores: true });
    const reasonById = new Map(matches.map(m => [m.skill.id, explainMatch(m)]));
    const alternatives = await this.resolveAlternatives(matches.map(m => m.skill), projectContext);
    for (const [id, reason] of alternatives.reasons) reasonById.set(id, reason);
    const ranked = alternatives.skills;

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
      excluded: alternatives.excluded,
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
      excluded: analysis.excluded,
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
    let excluded = [];
    let reasons = new Map();

    if (explicitSkills.length > 0) {
      selected = explicitSkills;
      reasons = new Map(explicitSkills.map(s => [s.id, 'Requested explicitly.']));
      conflicts = (await this.resolveAlternatives(explicitSkills, projectContext, { explicit: true })).conflicts;
    } else {
      const analysis = await this.analyzeTask(taskPrompt, projectContext);
      selected = analysis.recommendedOrder.slice(0, MAX_SKILLS_PER_TASK);
      conflicts = analysis.conflicts;
      excluded = analysis.excluded;
      reasons = analysis.reasons;
    }

    const loadedInstructions = this.fitToBudget(selected, reasons, tokenBudget);
    const uiTask = selected.length > 0 && this.isUiTask(taskPrompt, selected);

    // UI tasks always point to the shared accessibility baseline (as a file to open, never inlined)
    let baseline = null;
    if (uiTask && !selected.some(s => s.id === UI_BASELINE_SKILL)) {
      const skill = await this.registry.getSkill(UI_BASELINE_SKILL);
      if (skill) baseline = { id: skill.id, name: skill.name, filePath: skill.filePath, fullTokens: skill.tokenEstimate ?? estimateTokens(skill.content) };
    }

    const recommendedDesignPreset = uiTask
      ? (await this.presetRegistry.recommend(taskPrompt))[0] || null
      : null;

    return {
      timestamp: new Date().toISOString(),
      task: taskPrompt,
      selectedSkillCount: selected.length,
      tokenBudget,
      skills: loadedInstructions,
      excludedSkills: excluded,
      conflictResolutions: conflicts,
      baseline,
      recommendedDesignPreset,
      formattedInstructions: this.formatInstructions(loadedInstructions, conflicts, { objective: taskPrompt })
    };
  }

  /**
   * The active-task pointer (ai-brain/local/active-task.md): the task, its status,
   * which skill files to open and why, what was left out and why, constraints
   * and acceptance criteria. No skill bodies, so it costs a few hundred tokens.
   */
  formatTaskPointer(loaded, options = {}) {
    const info = options.projectInfo || {};
    const projectDir = options.projectDir || null;
    const date = (loaded.timestamp || new Date().toISOString()).split('T')[0];
    const fileRef = (p) => {
      if (!p) return '(no file)';
      const rel = projectDir ? path.relative(projectDir, p) : p;
      const shown = rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel : p;
      return `\`${shown.replace(/\\/g, '/')}\``;
    };
    const cell = (text) => String(text || '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

    const stack = [];
    if (info.framework && !['unknown', 'node'].includes(info.framework)) stack.push(info.framework);
    if (info.languages?.length) stack.push(info.languages.join(', '));
    if (info.hasUi) stack.push(info.uiLibraries?.length ? info.uiLibraries.join(', ') : 'plain CSS');

    const out = [
      '# Active Task',
      '',
      `- **Task**: ${cell(loaded.task)}`,
      '- **Status**: active',
      `- **Started**: ${date}`,
      ...(stack.length ? [`- **Project stack**: ${stack.join(' · ')}`] : []),
      '',
      '_Generated by `gaw use --inject`. Open a skill file only when you reach the part of the task it covers. When the task is finished, run `gaw task done` (or set Status to done). Ignore this file if Status is not active._',
      ''
    ];

    out.push('## Skills to use', '');
    if (!loaded.skills.length) {
      out.push('No skill in the library closely matches this task. Work from `ai-brain/rules.md`, `ai-brain/playbook.md` and the code.', '');
    } else {
      out.push('| Skill | File | ~Tokens | Why |', '|---|---|---|---|');
      for (const s of loaded.skills) {
        const note = s.trust && s.trust !== 'official' ? ` Source: ${s.trustNote}.` : '';
        out.push(`| ${cell(s.name)} (\`${s.id}\`) | ${fileRef(s.filePath)} | ${s.fullTokens} | ${cell(s.reason)}${cell(note)} |`);
      }
      out.push('');
      if (stack.length) {
        out.push(`Skill examples may use another language or styling (for example TypeScript or Tailwind). Write code for this project's stack: ${stack.join(' · ')}.`, '');
      }
    }

    if (loaded.baseline) {
      out.push('## For every UI change', '', `- ${loaded.baseline.name}: ${fileRef(loaded.baseline.filePath)} (~${loaded.baseline.fullTokens} tokens)`, '');
    }

    if (loaded.excludedSkills?.length) {
      out.push('## Left out', '');
      for (const e of loaded.excludedSkills) out.push(`- \`${e.id}\`: ${e.reason}`);
      out.push('');
    }

    out.push('## Constraints', '', '- Follow `ai-brain/rules.md`; its Safety rules always apply.');
    for (const c of loaded.conflictResolutions || []) out.push(`- ${c.skills.join(' / ')}: ${c.resolution}`);
    for (const s of loaded.skills) {
      if (s.caution) out.push(`- \`${s.id}\` can run commands and GAW has not reviewed it: show the user any command from it before running it.`);
    }
    if (loaded.recommendedDesignPreset) {
      out.push(`- Use the values in \`ai-brain/design.md\`. Optional reference design: ${loaded.recommendedDesignPreset.name} (\`gaw design ${loaded.recommendedDesignPreset.id}\`).`);
    }
    out.push('');

    const checks = [];
    for (const s of loaded.skills) {
      for (const v of (s.verification || []).slice(0, 3)) {
        if (!checks.includes(v)) checks.push(v);
      }
    }
    out.push('## Acceptance criteria', '');
    for (const v of checks.slice(0, 8)) out.push(`- [ ] ${v}`);
    out.push('- [ ] The Definition of Done in `ai-brain/context.md` is met.', '');
    return out.join('\n');
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
        verification: skill.contract?.verification || [],
        mode: fits ? 'full' : 'summary',
        fullTokens,
        content: fits ? skill.content : ''
      };
    });
  }

  /**
   * Load exactly the given skills (e.g. the ones a user picked during onboarding)
   * within the token budget. Unknown IDs are ignored.
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
    let md = `# GUIDED AGENT WORKFLOW — ACTIVE SKILL CONTEXT\n\n`;
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
