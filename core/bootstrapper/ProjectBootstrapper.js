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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

export class ProjectBootstrapper {
  constructor(options = {}) {
    this.repoRoot = options.repoRoot || REPO_ROOT;
    this.registry = new SkillRegistry({ skillsDir: path.join(this.repoRoot, 'skills') });
    this.orchestrator = new SkillOrchestrator(this.registry);
    this.memoryEngine = new MemoryEngine({ globalBrainDir: path.join(this.repoRoot, 'brain') });
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
    report.steps.push({ step: 2, name: 'Connect Global Brain', status: 'Connected', path: path.join(this.repoRoot, 'brain') });

    // Step 4 & 5: Create Project Brain (`ai-brain/`)
    const brainDir = path.join(dir, 'ai-brain');
    const skillsDir = path.join(brainDir, 'skills');
    const templatesDir = path.join(this.repoRoot, 'templates', 'ai-brain');

    if (!dryRun) {
      fs.mkdirSync(brainDir, { recursive: true });
      fs.mkdirSync(skillsDir, { recursive: true });
    }

    const templateReplacements = {
      '{{PROJECT_NAME}}': projectInfo.projectName,
      '{{FRAMEWORK}}': projectInfo.framework,
      '{{LANGUAGES}}': projectInfo.languages.join(', '),
      '{{PACKAGE_MANAGER}}': projectInfo.packageManager,
      '{{UI_LIBRARIES}}': projectInfo.uiLibraries.join(', ') || 'Standard CSS',
      '{{BUILD_SYSTEM}}': projectInfo.buildSystem,
      '{{DATE}}': new Date().toISOString().split('T')[0],
      '{{REPO_ROOT}}': this.repoRoot
    };

    const renderTemplate = (content) => {
      let result = content;
      for (const [key, val] of Object.entries(templateReplacements)) {
        result = result.replaceAll(key, String(val));
      }
      return result;
    };

    const brainFileNames = [
      'README.md',
      'context.md',
      'identity.md',
      'rules.md',
      'playbook.md',
      'project-history.md',
      'design-principles.md',
      'coding-preferences.md',
      'component-preferences.md',
      'workflow-preferences.md',
      'tool-preferences.md',
      'lessons-learned.md',
      'confirmed-preferences.md',
      'decision-history.md'
    ];

    for (const filename of brainFileNames) {
      const p = path.join(brainDir, filename);
      if (!fs.existsSync(p) || force) {
        let content = '';
        const templatePath = path.join(templatesDir, filename);
        if (fs.existsSync(templatePath)) {
          content = renderTemplate(fs.readFileSync(templatePath, 'utf8'));
        } else {
          content = `# ${filename}\nProject: ${projectInfo.projectName}\n`;
        }
        if (!dryRun) fs.writeFileSync(p, content, 'utf8');
        report.created.push(`ai-brain/${filename}`);
      } else {
        report.skipped.push(`ai-brain/${filename} (exists)`);
      }
    }

    const skillNames = [
      'code-generation.md', 'code-review.md', 'debugging.md', 'seo.md'
    ];

    for (const sname of skillNames) {
      const sp = path.join(skillsDir, sname);
      if (!fs.existsSync(sp) || force) {
        let scontent = '';
        const templateSkillPath = path.join(templatesDir, 'skills', sname);
        if (fs.existsSync(templateSkillPath)) {
          scontent = renderTemplate(fs.readFileSync(templateSkillPath, 'utf8'));
        } else {
          scontent = `# ${sname}\nFollow best practices for ${projectInfo.framework}.\n`;
        }
        if (!dryRun) fs.writeFileSync(sp, scontent, 'utf8');
        report.created.push(`ai-brain/skills/${sname}`);
      } else {
        report.skipped.push(`ai-brain/skills/${sname} (exists)`);
      }
    }

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

    // Step 9: Recommend Relevant Skills
    const initialQuery = `${projectInfo.framework} ${projectInfo.languages.join(' ')} ${projectInfo.uiLibraries.join(' ')}`;
    const recs = await this.orchestrator.recommend(initialQuery, { framework: projectInfo.framework });
    report.skillsRecommended = recs.primarySkills.map(s => `${s.name} (${s.id})`);
    report.steps.push({ step: 7, name: 'Skill Recommendations', status: 'Identified', count: recs.primarySkills.length });

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
      const templateReplacements = {
        '{{PROJECT_NAME}}': projectInfo.projectName,
        '{{FRAMEWORK}}': projectInfo.framework,
        '{{LANGUAGES}}': projectInfo.languages.join(', '),
        '{{PACKAGE_MANAGER}}': projectInfo.packageManager,
        '{{UI_LIBRARIES}}': projectInfo.uiLibraries.join(', ') || 'Standard CSS',
        '{{BUILD_SYSTEM}}': projectInfo.buildSystem,
        '{{DATE}}': new Date().toISOString().split('T')[0],
        '{{REPO_ROOT}}': this.repoRoot
      };

      const renderTemplate = (content) => {
        let res = content;
        for (const [key, val] of Object.entries(templateReplacements)) {
          res = res.replaceAll(key, String(val));
        }
        return res;
      };

      const brainFileNames = [
        'README.md', 'context.md', 'identity.md', 'rules.md', 'playbook.md',
        'project-history.md', 'design-principles.md', 'coding-preferences.md',
        'component-preferences.md', 'workflow-preferences.md', 'tool-preferences.md',
        'lessons-learned.md', 'confirmed-preferences.md', 'decision-history.md'
      ];

      for (const filename of brainFileNames) {
        const dest = path.join(brainDir, filename);
        if (!fs.existsSync(dest)) {
          const tmplPath = path.join(templatesDir, filename);
          if (fs.existsSync(tmplPath)) {
            const content = renderTemplate(fs.readFileSync(tmplPath, 'utf8'));
            fs.writeFileSync(dest, content, 'utf8');
            result.addedBrainFiles.push(`ai-brain/${filename}`);
          }
        } else {
          result.preservedBrainFiles.push(`ai-brain/${filename}`);
        }
      }
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

    return result;
  }
}

export default ProjectBootstrapper;

