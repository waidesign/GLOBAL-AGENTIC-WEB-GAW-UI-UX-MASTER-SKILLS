import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectDetector } from '../project-detector/ProjectDetector.js';
import { GraphifyManager } from '../graphify-manager/GraphifyManager.js';
import { AgentationManager } from '../agentation-manager/AgentationManager.js';
import { AgentAdapters } from '../agent-adapters/AgentAdapters.js';
import { SkillRegistry } from '../skill-registry/SkillRegistry.js';
import { SkillOrchestrator } from '../orchestrator/SkillOrchestrator.js';
import { MemoryEngine } from '../memory-engine/MemoryEngine.js';
import { writeCatalog, CATALOG_FILE } from '../project-context/ProjectContext.js';
import {
  PROJECT_BRAIN_FILES, SNAPSHOT_FILE, writeGlobalBrainSnapshot, findLegacyPreferenceCopies
} from '../project-context/globalBrainLink.js';
import { DEFAULT_BRAIN_DIR } from '../memory-engine/paths.js';
import {
  BRAIN_JSON, TEMPLATE_DIRS, AUTO_DETECTED, projectFacts, autoSections, renderTemplateFile,
  buildBrainJson, readBrainJson, ensureLocalDir
} from '../project-context/brainLayout.js';
import { buildDesignMd } from '../project-context/designExtractor.js';
import { migrateLayout } from '../project-context/layoutMigration.js';
import { refreshSections, sectionBody } from '../utils/markdownSections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

export class ProjectBootstrapper {
  constructor(options = {}) {
    this.repoRoot = options.repoRoot || REPO_ROOT;
    this.registry = new SkillRegistry({ skillsDir: path.join(this.repoRoot, 'skills'), user: true });
    this.orchestrator = new SkillOrchestrator(this.registry);
    this.memoryEngine = new MemoryEngine(options.globalBrainDir ? { globalBrainDir: options.globalBrainDir } : {});
    this.createGraphifyManager = options.createGraphifyManager || ((dir) => new GraphifyManager({ projectRoot: dir }));
  }

  /**
   * Build or reuse the Graphify code graph. Graphify is optional, so a missing
   * install or a failed run never stops the caller: it is reported instead.
   */
  async buildGraph(dir, options = {}) {
    try {
      return await this.createGraphifyManager(dir).generateGraph({ targetDir: dir, force: options.force });
    } catch (err) {
      return { skipped: true, reason: 'error', error: err.message, summary: `Graphify could not build the code graph: ${err.message}` };
    }
  }

  async init(targetDir = process.cwd(), options = {}) {
    const dir = path.resolve(targetDir);
    const dryRun = Boolean(options.dryRun);
    const force = Boolean(options.force);
    const noAgentation = Boolean(options.noAgentation);
    const noGraphify = Boolean(options.noGraphify);

    const report = {
      projectPath: dir,
      dryRun,
      steps: [],
      created: [],
      updated: [],
      skipped: [],
      warnings: [],
      skillsRecommended: [],
      integrations: {}
    };

    // Step 1 & 2: Inspect and Identify
    const projectInfo = ProjectDetector.detect(dir);
    report.projectInfo = projectInfo;
    report.steps.push({ step: 1, name: 'Inspect & Identify', status: 'Completed', details: `Detected ${projectInfo.framework} using ${projectInfo.packageManager}` });

    // Step 3: Global Brain Verification
    await this.memoryEngine.initGlobalBrain();
    report.steps.push({ step: 2, name: 'Connect Global Brain', status: 'Connected', path: this.memoryEngine.globalBrainDir });

    // Step 4 & 5: Create Project Brain (`ai-brain/`). Only project files: preferences stay in
    // the user's Global Brain (~/.gaw/brain), so a stale copy can never override them
    const brainFiles = this.writeBrain(dir, projectInfo, { force, dryRun, starterSkills: true });
    report.created.push(...brainFiles.created);
    report.skipped.push(...brainFiles.skipped);
    report.steps.push({ step: 3, name: 'Create Project Brain', status: 'Completed', path: 'ai-brain/' });

    // Step 6: Build the Graphify code graph in graphify-out/ (optional)
    if (noGraphify) {
      report.skipped.push('Graphify code map (not installed or --no-graphify; add it later with: gaw setup)');
    } else if (dryRun) {
      report.integrations.graphify = { dryRun: true, planned: 'Generate graphify-out/graph.json, graph.html, GRAPH_REPORT.md' };
    } else {
      const graphRes = await this.buildGraph(dir, { force });
      report.integrations.graphify = graphRes;
      if (graphRes.reason === 'error') {
        report.warnings.push(graphRes.summary);
      } else if (graphRes.skipped) {
        report.skipped.push('Graphify code map (not installed; add it later with: gaw setup)');
      } else {
        report.steps.push({ step: 4, name: 'Configure Graphify', status: 'Completed' });
      }
    }

    // Step 7: Configure Agentation (if React)
    if (!noAgentation && projectInfo.isReact) {
      const agentation = new AgentationManager({ projectRoot: dir });
      const agentationRes = agentation.configure(projectInfo, { dryRun });
      report.integrations.agentation = agentationRes;
      report.steps.push({ step: 5, name: 'Configure Agentation', status: 'Configured (React)' });
    } else if (!projectInfo.isReact) {
      report.skipped.push('Agentation (Non-React project)');
    } else {
      report.skipped.push('Agentation (--no-agentation)');
    }

    // Step 8: Configure AI Agent Adapters
    const adapterRes = AgentAdapters.configureAll(dir, projectInfo, { dryRun });
    report.integrations.agentAdapters = adapterRes;
    report.steps.push({ step: 6, name: 'Configure AI Agents', status: 'Configured' });

    // Project skill catalog (ai-brain/project-skills.md): what agents read instead of full skills,
    // and a read-only summary of the user's Global Brain for agents that can't read ~/.gaw
    if (!dryRun) {
      await writeCatalog(dir, this.registry);
      report.created.push(`ai-brain/${CATALOG_FILE}`);
      if (writeGlobalBrainSnapshot(dir, this.memoryEngine.globalBrainDir)) report.created.push(`ai-brain/${SNAPSHOT_FILE}`);
    }

    // Step 9: Recommend Relevant Skills from the detected stack. Generic language names
    // ("JavaScript", "Python") match skills of every field, so only specific signals count:
    // a known framework and UI libraries. Without them, nothing is suggested (the goal-based
    // onboarding, or `gaw recommend "<task>"`, gives better suggestions).
    const stackTerms = [
      ...(['unknown', 'node', 'plain-frontend'].includes(projectInfo.framework) ? [] : [projectInfo.framework]),
      ...projectInfo.uiLibraries
    ];
    // A skill must be about the stack (name, tags, keywords), not just mention it in its description
    const matches = stackTerms.length
      ? await this.orchestrator.discovery.findRelevant(stackTerms.join(' '), { limit: 3, withScores: true })
      : [];
    const starters = matches.filter(e => e.reasons.some(r => r.fields.some(f => f !== 'description'))).map(e => e.skill);
    report.skillsRecommended = starters.map(s => `${s.name} (${s.id})`);
    report.steps.push({ step: 7, name: 'Skill Recommendations', status: 'Identified', count: starters.length });

    // Summary
    report.summary = {
      project: projectInfo.projectName,
      framework: projectInfo.framework,
      brainCreated: !dryRun,
      filesCreated: report.created.length,
      filesSkipped: report.skipped.length
    };

    return report;
  }

  /**
   * Write the Project Brain (layout 2): template files, folder READMEs, design.md
   * for UI projects, brain.json, local/ and, if asked, the starter skills.
   * Existing files are kept unless `force`; brain.json is always refreshed.
   * Returns { created: [], skipped: [] } as ai-brain/ relative paths.
   */
  writeBrain(dir, projectInfo, options = {}) {
    const { force = false, dryRun = false, starterSkills = false } = options;
    const brainDir = path.join(dir, 'ai-brain');
    const skillsDir = path.join(brainDir, 'skills');
    const templatesDir = path.join(this.repoRoot, 'templates', 'ai-brain');
    const facts = projectFacts(projectInfo, dir);
    const created = [];
    const skipped = [];
    const put = (rel, content) => {
      rel = rel.replace(/\\/g, '/');
      const target = path.join(brainDir, rel);
      if (fs.existsSync(target) && !force) {
        skipped.push(`ai-brain/${rel} (exists)`);
        return;
      }
      if (!dryRun) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, content, 'utf8');
      }
      created.push(`ai-brain/${rel}`);
    };

    if (!dryRun) fs.mkdirSync(skillsDir, { recursive: true });

    for (const file of PROJECT_BRAIN_FILES) put(file, renderTemplateFile(templatesDir, file, facts) ?? `# ${file}\n`);
    for (const sub of TEMPLATE_DIRS) {
      const readme = path.join(sub, 'README.md');
      put(readme, renderTemplateFile(templatesDir, readme, facts) ?? `# ${sub}\n`);
    }
    if (facts.hasUi) put('design.md', buildDesignMd(dir, projectInfo.projectName));

    // brain.json is GAW's own record: refreshed every time, keeping keys someone added
    const existingBrain = readBrainJson(dir);
    if (!dryRun) {
      fs.writeFileSync(path.join(brainDir, BRAIN_JSON), `${JSON.stringify(buildBrainJson(facts, existingBrain || {}, this.version()), null, 2)}\n`, 'utf8');
      ensureLocalDir(dir);
    }
    if (!existingBrain) created.push(`ai-brain/${BRAIN_JSON}`);

    // Starter project skills, in GAW Skill Standard folders: ai-brain/skills/<name>/SKILL.md + gaw.json
    const templateSkillsDir = path.join(templatesDir, 'skills');
    const starters = starterSkills && fs.existsSync(templateSkillsDir)
      ? fs.readdirSync(templateSkillsDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)
      : [];
    for (const sname of starters) {
      const target = path.join(skillsDir, sname);
      if (fs.existsSync(path.join(skillsDir, `${sname}.md`)) && !force) { // single-file skill from older GAW versions
        skipped.push(`ai-brain/skills/${sname}.md (exists)`);
        continue;
      }
      if (fs.existsSync(path.join(target, 'SKILL.md')) && !force) {
        skipped.push(`ai-brain/skills/${sname}/ (exists)`);
        continue;
      }
      if (!dryRun) {
        fs.mkdirSync(target, { recursive: true });
        for (const file of fs.readdirSync(path.join(templateSkillsDir, sname))) {
          fs.copyFileSync(path.join(templateSkillsDir, sname, file), path.join(target, file));
        }
      }
      created.push(`ai-brain/skills/${sname}/`);
    }
    return { created, skipped };
  }

  /** GAW's version, from its package.json. */
  version() {
    try {
      return JSON.parse(fs.readFileSync(path.join(this.repoRoot, 'package.json'), 'utf8')).version || '';
    } catch {
      return '';
    }
  }

  async start(targetDir = process.cwd()) {
    const dir = path.resolve(targetDir);
    const projectInfo = ProjectDetector.detect(dir);
    const brain = await this.memoryEngine.getProjectBrain(dir);

    // Refresh the Graphify graph if it is missing or empty (skipped when Graphify is not installed)
    const graphRes = await this.buildGraph(dir);

    // Auto-configure Agentation if React and not yet injected
    if (projectInfo.isReact) {
      const agentation = new AgentationManager({ projectRoot: dir });
      agentation.configure(projectInfo, { dryRun: false });
    }

    // Keep the Global Brain summary current with the user's latest preferences
    if (brain) {
      await this.memoryEngine.initGlobalBrain();
      writeGlobalBrainSnapshot(dir, this.memoryEngine.globalBrainDir);
    }

    return {
      projectPath: dir,
      projectName: projectInfo.projectName,
      framework: projectInfo.framework,
      hasProjectBrain: Boolean(brain),
      graphStatus: graphRes.summary,
      hasGraph: GraphifyManager.locateGraph(dir) !== null,
      status: brain ? 'Ready' : 'Not initialized (run `gaw init` first)',
      recommendedNextStep: brain ? 'Run `gaw use "<task description>"` to execute your task with loaded skills.' : 'Run `gaw init`'
    };
  }

  async update(targetDir = process.cwd(), options = {}) {
    const dir = path.resolve(targetDir);
    const projectInfo = ProjectDetector.detect(dir);
    const brainDir = path.join(dir, 'ai-brain');
    const templatesDir = path.join(this.repoRoot, 'templates', 'ai-brain');

    const result = {
      projectPath: dir,
      projectName: projectInfo.projectName,
      addedBrainFiles: [],
      preservedBrainFiles: [],
      graphUpdated: false,
      graphSummary: '',
      agentationChecked: false
    };

    if (fs.existsSync(brainDir)) {
      const facts = projectFacts(projectInfo, dir);

      // Layout 1 → 2 (no brain.json yet): archive old task files, replace untouched templates
      if (!readBrainJson(dir)) {
        result.migration = migrateLayout(dir, {
          templatesDir,
          legacyDir: path.join(this.repoRoot, 'templates', 'legacy-project-brain', 'layout-v1'),
          facts
        });
      }

      // Missing files are added (and, when migrating, the new starter skills); existing ones are kept
      const brainFiles = this.writeBrain(dir, projectInfo, { starterSkills: Boolean(result.migration) });
      result.addedBrainFiles.push(...brainFiles.created);
      result.preservedBrainFiles.push(...brainFiles.skipped.map(s => s.replace(/ \(exists\)$/, '')));

      // Refresh the "(auto-detected)" sections; sections marked "(confirmed)" or renamed are left alone
      result.refreshedSections = [];
      const contextFile = path.join(brainDir, 'context.md');
      if (fs.existsSync(contextFile)) {
        const { content, changed } = refreshSections(fs.readFileSync(contextFile, 'utf8'), autoSections(facts));
        if (changed.length) {
          fs.writeFileSync(contextFile, content, 'utf8');
          result.refreshedSections.push(...changed.map(h => `context.md ${h.replace(/^## /, '')}`));
        }
      }
      const designFile = path.join(brainDir, 'design.md');
      if (fs.existsSync(designFile) && facts.hasUi) {
        const generated = buildDesignMd(dir, projectInfo.projectName);
        const sections = {};
        for (const line of generated.split('\n').filter(l => l.startsWith('## ') && l.endsWith(AUTO_DETECTED))) {
          sections[line] = sectionBody(generated, line);
        }
        const { content, changed } = refreshSections(fs.readFileSync(designFile, 'utf8'), sections);
        if (changed.length) {
          fs.writeFileSync(designFile, content, 'utf8');
          result.refreshedSections.push(...changed.map(h => `design.md ${h.replace(/^## /, '')}`));
        }
      }

      // Older GAW versions copied Global Brain files into projects, where they
      // overrode the user's live preferences. Remove copies nobody changed;
      // keep edited ones as deliberate project choices.
      await this.memoryEngine.initGlobalBrain();
      const legacy = findLegacyPreferenceCopies(dir, [
        path.join(this.repoRoot, 'templates', 'legacy-project-brain'),
        DEFAULT_BRAIN_DIR,
        this.memoryEngine.globalBrainDir
      ]);
      for (const file of legacy.untouched) fs.unlinkSync(path.join(brainDir, file));
      result.removedLegacyCopies = legacy.untouched.map(f => `ai-brain/${f}`);
      result.keptProjectOverrides = legacy.edited.map(f => `ai-brain/${f}`);
      writeGlobalBrainSnapshot(dir, this.memoryEngine.globalBrainDir);
      result.globalBrainSnapshot = `ai-brain/${SNAPSHOT_FILE}`;
    }

    // Rebuild the Graphify graph (skipped when Graphify is not installed)
    const graphRes = await this.buildGraph(dir, { force: true });
    result.graphUpdated = !graphRes.skipped;
    result.graphSummary = graphRes.summary;

    // Auto-configure Agentation if React
    if (projectInfo.isReact) {
      const agentation = new AgentationManager({ projectRoot: dir });
      agentation.configure(projectInfo, { dryRun: false });
      result.agentationChecked = true;
    }

    // Keep agent instructions and the skill catalog current
    if (fs.existsSync(brainDir)) {
      const adapters = AgentAdapters.configureAll(dir, projectInfo, {});
      result.agentFilesUpdated = Object.values(adapters).filter(a => a.action !== 'unchanged').map(a => path.relative(dir, a.target));
      await writeCatalog(dir, this.registry);
      result.catalogUpdated = true;
    }

    return result;
  }
}

export default ProjectBootstrapper;

