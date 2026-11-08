import fs from 'node:fs';
import path from 'node:path';
import { userBrainDir, DEFAULT_BRAIN_DIR } from './paths.js';

export class MemoryEngine {
  constructor(options = {}) {
    // The user's own Global Brain (~/.gaw/brain, or GAW_HOME/brain). Never the
    // installed GAW package: updates must not overwrite user memory, and personal
    // decisions must not end up in GAW's repository.
    this.globalBrainDir = options.globalBrainDir || userBrainDir();
    // Defaults shipped with GAW, copied into a new user's brain
    this.defaultsDir = options.defaultsDir || DEFAULT_BRAIN_DIR;
    this.projectRoot = options.projectRoot || process.cwd();
  }

  get projectBrainDir() {
    return path.join(this.projectRoot, 'ai-brain');
  }

  /**
   * Create the Global Brain if needed: copy GAW's default files into it, then
   * add built-in templates for anything still missing. Never overwrites a file
   * the user already has.
   */
  async initGlobalBrain() {
    fs.mkdirSync(this.globalBrainDir, { recursive: true });

    if (path.resolve(this.defaultsDir) !== path.resolve(this.globalBrainDir) && fs.existsSync(this.defaultsDir)) {
      for (const file of fs.readdirSync(this.defaultsDir)) {
        const target = path.join(this.globalBrainDir, file);
        if (file.endsWith('.md') && !fs.existsSync(target)) {
          fs.copyFileSync(path.join(this.defaultsDir, file), target);
        }
      }
    }

    const files = {
      'README.md': `# Global Brain — Centralized Cross-Project Memory\n\nPersistent store of confirmed preferences, working principles, and reusable workflows, shared by all your projects.`,
      'identity.md': `# Global Identity & Persona\n\n- Role: Senior engineer and careful collaborator who adapts to the field of each project: software, infrastructure, data, documents, media or design.\n- Focus: correct, verified results; clear communication; modular, maintainable work; performance and accessibility wherever they apply; no generic "AI slop" output.`,
      'design-principles.md': `# Confirmed Design Principles\n\nApply these when a project has a user interface.\n\n1. Anti-Slop: Avoid generic AI aesthetics, random gradients, and meaningless animations.\n2. Coherence: Adhere to established design tokens and primitives.\n3. Accessibility: Semantic HTML, keyboard navigable, WCAG AA compliant.\n4. Performance: 60fps animations on compositor only, zero unneeded re-renders.`,
      'workflow-preferences.md': `# Global Workflow Preferences\n\n- Incremental changes verified with automated tests.\n- Never overwrite user configurations without explicit review.\n- Prefer single commands for orchestration.`,
      'coding-preferences.md': `# Global Coding Preferences\n\n- TypeScript/ES Modules default for JS/TS ecosystems.\n- Clean separation of concerns (presentation vs business logic).\n- Descriptive names, strict types, comprehensive error boundaries.`,
      'decision-history.md': `# Global Decision History\n\n| Timestamp | Category | Decision | Context |\n|---|---|---|---|\n| ${new Date().toISOString().split('T')[0]} | Initial | Global Brain initialized | Baseline architecture established |\n`,
      'lessons-learned.md': `# Global Lessons Learned\n\n- Always inspect runtime environment before prescribing tool installations.\n- Visual feedback integrations (Agentation) must remain dev-only to prevent production bloat.`,
      'tool-preferences.md': `# Global Tool Preferences\n\n- Testing: Native test runners, Vitest, Playwright\n- Code Graph: Graphify\n- Visual Annotation: Agentation\n- Package Managers: Respect project lockfiles (pnpm > bun > yarn > npm)`,
      'confirmed-preferences.md': `# Confirmed Preferences\n\nConfirmed user selections across projects are logged here.`
    };

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(this.globalBrainDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }

  /**
   * Read Global Brain summary
   */
  async getGlobalBrain() {
    await this.initGlobalBrain();
    const result = {};
    const entries = fs.readdirSync(this.globalBrainDir);
    for (const entry of entries) {
      if (entry.endsWith('.md')) {
        const p = path.join(this.globalBrainDir, entry);
        result[entry] = fs.readFileSync(p, 'utf8');
      }
    }
    return result;
  }

  /**
   * Read Project Brain if present
   */
  async getProjectBrain(projectPath = this.projectRoot) {
    const dir = path.join(projectPath, 'ai-brain');
    if (!fs.existsSync(dir)) {
      return null;
    }
    const result = { files: {}, skills: {} };
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.md')) {
        result.files[entry.name] = fs.readFileSync(full, 'utf8');
      } else if (entry.isDirectory() && entry.name === 'skills') {
        const skillEntries = fs.readdirSync(full);
        for (const s of skillEntries) {
          if (s.endsWith('.md')) {
            result.skills[s] = fs.readFileSync(path.join(full, s), 'utf8');
          }
        }
      }
    }

    return result;
  }

  /**
   * Append a decision to history
   */
  async recordDecision(category, decision, context, isProjectSpecific = false, projectPath = this.projectRoot) {
    const timestamp = new Date().toISOString().split('T')[0];
    const logLine = `| ${timestamp} | ${category} | ${decision.replace(/\|/g, '-')} | ${context.replace(/\|/g, '-')} |\n`;

    if (isProjectSpecific) {
      const pHistory = path.join(projectPath, 'ai-brain', 'project-history.md');
      if (fs.existsSync(pHistory)) {
        fs.appendFileSync(pHistory, `\n- **${timestamp} [${category}]**: ${decision} (${context})`);
      }
    } else {
      await this.initGlobalBrain();
      const gHistory = path.join(this.globalBrainDir, 'decision-history.md');
      fs.appendFileSync(gHistory, logLine);
    }
  }

  /**
   * Get merged context respecting precedence:
   * 1. User Prompt
   * 2. Project Brain (ai-brain/)
   * 3. Global Brain (~/.gaw/brain/)
   */
  async getHierarchicalContext(userPrompt, projectPath = this.projectRoot) {
    const globalBrain = await this.getGlobalBrain();
    const projectBrain = await this.getProjectBrain(projectPath);

    return {
      precedence: [
        '1. User Request (Highest)',
        '2. Project Brain (ai-brain/)',
        '3. Global Brain (~/.gaw/brain/)',
        '4. Skill Instructions',
        '5. Framework/Tool Defaults'
      ],
      userPrompt,
      projectBrain: projectBrain ? {
        rules: projectBrain.files['rules.md'] || null,
        context: projectBrain.files['context.md'] || null,
        identity: projectBrain.files['identity.md'] || null,
        playbook: projectBrain.files['playbook.md'] || null
      } : null,
      globalBrain: {
        principles: globalBrain['design-principles.md'],
        codingPreferences: globalBrain['coding-preferences.md'],
        workflowPreferences: globalBrain['workflow-preferences.md']
      }
    };
  }
}

export default MemoryEngine;

