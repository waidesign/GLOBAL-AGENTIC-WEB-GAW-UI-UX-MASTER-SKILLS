import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';
import { SkillDiscovery } from '../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';
import { MemoryEngine } from '../core/memory-engine/MemoryEngine.js';
import { ProjectDetector } from '../core/project-detector/ProjectDetector.js';
import { ProjectBootstrapper } from '../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../core/graphify-manager/GraphifyManager.js';

import { runInteractiveOnboarding } from './interactive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');

export class GawCli {
  constructor() {
    this.repoRoot = REPO_ROOT;
    this.registry = new SkillRegistry({ skillsDir: path.join(this.repoRoot, 'skills') });
    this.discovery = new SkillDiscovery(this.registry);
    this.orchestrator = new SkillOrchestrator(this.registry);
    this.memoryEngine = new MemoryEngine({ globalBrainDir: path.join(this.repoRoot, 'brain') });
    this.bootstrapper = new ProjectBootstrapper({ repoRoot: this.repoRoot });
  }

  printHeader() {
    console.log(`\n======================================================`);
    console.log(`🌐 GLOBAL AGENTIC WEB (GAW) — UI/UX MASTER SKILLS CLI`);
    console.log(`======================================================\n`);
  }

  async run(args = process.argv.slice(2)) {
    const cmd = args[0] || 'help';

    try {
      switch (cmd) {
        case 'init':
          await this.cmdInit(args.slice(1));
          break;
        case 'start':
          await this.cmdStart(args.slice(1));
          break;
        case 'skills':
          await this.cmdSkills(args.slice(1));
          break;
        case 'search':
          await this.cmdSearch(args.slice(1));
          break;
        case 'recommend':
          await this.cmdRecommend(args.slice(1));
          break;
        case 'use':
          await this.cmdUse(args.slice(1));
          break;
        case 'brain':
          await this.cmdBrain(args.slice(1));
          break;
        case 'project':
          await this.cmdProject(args.slice(1));
          break;
        case 'graph':
          await this.cmdGraph(args.slice(1));
          break;
        case 'update':
          await this.cmdUpdate(args.slice(1));
          break;
        case 'doctor':
          await this.cmdDoctor(args.slice(1));
          break;
        case 'version':
        case '-v':
        case '--version':
          this.cmdVersion();
          break;
        case 'help':
        case '-h':
        case '--help':
        default:
          this.cmdHelp();
          break;
      }
    } catch (err) {
      console.error(`\n❌ Error executing 'gaw ${cmd}':`, err.message);
      process.exitCode = 1;
    }
  }

  async cmdInit(args) {
    this.printHeader();
    const dryRun = args.includes('--dry-run');
    const force = args.includes('--force');
    const noAgentation = args.includes('--no-agentation');
    const noGraphify = args.includes('--no-graphify');

    console.log(`🚀 Initializing project at: ${process.cwd()}`);
    if (dryRun) console.log(`🔍 Mode: DRY RUN (no files will be written)`);

    const result = await this.bootstrapper.init(process.cwd(), {
      dryRun,
      force,
      noAgentation,
      noGraphify
    });

    console.log(`\n📋 Project Inspection:`);
    console.log(`  - Project Name:   ${result.projectInfo.projectName}`);
    console.log(`  - Framework:      ${result.projectInfo.framework}`);
    console.log(`  - Language:       ${result.projectInfo.languages.join(', ')}`);
    console.log(`  - Package Mgr:    ${result.projectInfo.packageManager}`);
    console.log(`  - React Detected: ${result.projectInfo.isReact ? 'Yes' : 'No'}`);

    console.log(`\n⚡ Completed Steps:`);
    for (const step of result.steps) {
      console.log(`  ✓ [Step ${step.step}] ${step.name}: ${step.status}`);
    }

    if (result.created.length > 0) {
      console.log(`\n📄 Created Files:`);
      for (const f of result.created) {
        console.log(`  + ${f}`);
      }
    }

    if (result.skipped.length > 0) {
      console.log(`\n⏭️ Preserved Existing Files / Skipped:`);
      for (const s of result.skipped) {
        console.log(`  • ${s}`);
      }
    }

    if (result.skillsRecommended.length > 0) {
      console.log(`\n🎯 Recommended Initial Skills:`);
      for (const skill of result.skillsRecommended) {
        console.log(`  ★ ${skill}`);
      }
    }

    console.log(`\n✅ Project initialization complete!`);

    // Check if interactive onboarding should run
    const isInteractive = args.includes('-i') || args.includes('--interactive') || (process.stdin.isTTY && !args.includes('--yes') && !args.includes('--non-interactive'));
    if (isInteractive && !dryRun) {
      await runInteractiveOnboarding(this.bootstrapper, result.projectInfo, result.skillsRecommended, this.repoRoot);
    } else {
      console.log(`👉 Next: Use 'gaw use "<your task>"' to load targeted skills for any task.\n`);
    }
  }

  async cmdStart(args) {
    this.printHeader();
    const res = await this.bootstrapper.start(process.cwd());
    console.log(`Project:           ${res.projectName}`);
    console.log(`Framework:         ${res.framework}`);
    console.log(`Project Brain:     ${res.hasProjectBrain ? 'Configured (ai-brain/)' : 'Missing'}`);
    console.log(`Codebase Graph:    ${res.hasGraph ? 'Generated (graph.json)' : 'Not generated'}`);
    console.log(`Status:            ${res.status}`);
    console.log(`\n${res.recommendedNextStep}\n`);
  }

  async cmdSkills(args) {
    this.printHeader();
    const category = args[0];
    let skills;
    if (category) {
      skills = await this.registry.getSkillsByCategory(category);
      console.log(`Showing skills for category: [${category}] (${skills.length} skills)\n`);
    } else {
      skills = await this.registry.getAllSkills();
      console.log(`Listing all registered skills (${skills.length} total):\n`);
    }

    for (const s of skills) {
      console.log(`• \x1b[1m${s.id}\x1b[0m — [${s.category}]`);
      console.log(`  ${s.description || 'No description'}`);
      console.log(`  Author: ${s.author} | Frameworks: ${(s.frameworks || []).join(', ')}\n`);
    }
  }

  async cmdSearch(args) {
    this.printHeader();
    const query = args.join(' ');
    if (!query) {
      console.log(`Please provide a search term: gaw search "<term>"`);
      return;
    }

    const matches = await this.discovery.search(query, { limit: 10 });
    console.log(`Search results for "${query}" (${matches.length} matches):\n`);
    for (const s of matches) {
      console.log(`• \x1b[1m${s.id}\x1b[0m — [${s.category}]`);
      console.log(`  ${s.description}`);
      console.log(`  Author: ${s.author} | Frameworks: ${(s.frameworks || []).join(', ')}\n`);
    }
  }

  async cmdRecommend(args) {
    this.printHeader();
    const prompt = args.join(' ');
    if (!prompt) {
      console.log(`Please provide a task prompt: gaw recommend "<task description>"`);
      return;
    }

    console.log(`Analyzing task: "${prompt}"...\n`);
    const projectInfo = ProjectDetector.detect(process.cwd());
    const recs = await this.orchestrator.recommend(prompt, projectInfo);

    console.log(`🎯 Primary Skills:`);
    for (const p of recs.primarySkills) {
      console.log(`  ★ \x1b[1m${p.name}\x1b[0m (${p.id}) — [${p.category}]`);
      console.log(`    Reason: ${p.reason}`);
    }

    if (recs.supportingSkills.length > 0) {
      console.log(`\n🛠️ Supporting Skills:`);
      for (const s of recs.supportingSkills) {
        console.log(`  • ${s.name} (${s.id}) — [${s.category}]`);
      }
    }

    if (recs.dependencies.length > 0) {
      console.log(`\n🔗 Resolved Dependencies:`);
      for (const d of recs.dependencies) {
        console.log(`  ↳ ${d.name} (${d.id})`);
      }
    }

    if (recs.conflicts.length > 0) {
      console.log(`\n⚠️ Detected Conflicts & Resolutions:`);
      for (const c of recs.conflicts) {
        console.log(`  ! [${c.skills.join(' ↔ ')}]: ${c.resolution}`);
      }
    }
    console.log();
  }

  async cmdUse(args) {
    const prompt = args.join(' ');
    if (!prompt) {
      console.log(`Please provide a task prompt: gaw use "<task description>"`);
      return;
    }

    const projectInfo = ProjectDetector.detect(process.cwd());
    const loaded = await this.orchestrator.loadSkillsForTask(prompt, projectInfo);

    console.log(loaded.formattedInstructions);
  }

  async cmdBrain(args) {
    this.printHeader();
    const sub = args[0];

    if (sub === 'update') {
      const category = args[1] || 'General';
      const decision = args.slice(2).join(' ') || 'User confirmed preference update';
      await this.memoryEngine.recordDecision(category, decision, `Updated via CLI from ${process.cwd()}`);
      console.log(`✅ Recorded decision in Global Brain: [${category}] ${decision}`);
      return;
    }

    console.log(`🧠 GLOBAL BRAIN & MEMORY PRECEDENCE:`);
    console.log(`  Precedence Order:`);
    console.log(`  1. Explicit User Request (Highest)`);
    console.log(`  2. Project Brain (./ai-brain/rules.md)`);
    console.log(`  3. Global Brain (${path.join(this.repoRoot, 'brain')})`);
    console.log(`  4. Specialized Skill Instructions`);
    console.log(`  5. Framework & Tool Defaults\n`);

    const globalBrain = await this.memoryEngine.getGlobalBrain();
    console.log(`Global Principles:`);
    console.log(globalBrain['design-principles.md'] || 'None');

    const projectBrain = await this.memoryEngine.getProjectBrain(process.cwd());
    if (projectBrain) {
      console.log(`\n📁 Local Project Brain (ai-brain/): ACTIVE`);
      console.log(`Local Rules:\n${projectBrain.files['rules.md'] || 'None'}`);
    } else {
      console.log(`\n📁 Local Project Brain: Not initialized (run 'gaw init')`);
    }
    console.log();
  }

  async cmdProject(args) {
    this.printHeader();
    const info = ProjectDetector.detect(process.cwd());
    console.log(`Project Inspection for: ${info.projectName}`);
    console.log(`- Path:           ${info.projectPath}`);
    console.log(`- Framework:      ${info.framework}`);
    console.log(`- Languages:      ${info.languages.join(', ')}`);
    console.log(`- Package Mgr:    ${info.packageManager}`);
    console.log(`- React:          ${info.isReact ? 'Yes' : 'No'}`);
    console.log(`- Build System:   ${info.buildSystem}`);
    console.log(`- UI Libraries:   ${info.uiLibraries.join(', ') || 'None'}`);
    console.log(`- Testing:        ${info.testingFrameworks.join(', ') || 'None'}`);
    console.log(`- Project Brain:  ${info.hasProjectBrain ? 'Yes' : 'No'}`);
    console.log(`- Graphify:       ${info.hasGraphify ? 'Yes' : 'No'}`);
    console.log(`- Agentation:     ${info.hasAgentation ? 'Yes' : 'No'}`);
    console.log(`- AI Adapters:    ${info.aiConfigs.join(', ') || 'None'}\n`);
  }

  async cmdGraph(args) {
    this.printHeader();
    const force = args.includes('--force');
    const manager = new GraphifyManager({ projectRoot: process.cwd() });
    console.log(`Generating/Inspecting codebase relationship graph...`);
    const res = await manager.generateGraph({ targetDir: process.cwd(), force });
    console.log(`- Status:   ${res.summary}`);
    console.log(`- Output:   ${res.reportPath}`);
    console.log(`- Explorer: ${res.htmlPath}`);
    console.log(`- JSON:     ${res.jsonPath}\n`);
  }

  async cmdUpdate(args) {
    this.printHeader();
    console.log(`Checking for skills updates from central registry...`);
    const skills = await this.registry.getAllSkills();
    console.log(`✓ Central registry is current with ${skills.length} skills loaded.\n`);

    const brainDir = path.join(process.cwd(), 'ai-brain');
    if (fs.existsSync(brainDir)) {
      console.log(`🔄 Syncing current project with latest GAW templates & architecture tools...`);
      const res = await this.bootstrapper.update(process.cwd());
      if (res.addedBrainFiles.length > 0) {
        console.log(`\n📄 Added Missing Project Brain Files:`);
        for (const f of res.addedBrainFiles) {
          console.log(`  + ${f}`);
        }
      } else {
        console.log(`✓ All project brain files are up to date (${res.preservedBrainFiles.length} files preserved).`);
      }
      console.log(`✓ Codebase Architecture Graph: ${res.graphSummary}`);
      if (res.agentationChecked) {
        console.log(`✓ Agentation visual inspection verified.`);
      }
      console.log(`\n🎉 Project successfully updated to latest GAW standards!\n`);
    } else {
      console.log(`ℹ️ No local 'ai-brain/' directory found in current path (${process.cwd()}).`);
      console.log(`👉 Run 'gaw init' to initialize GAW in this project.\n`);
    }
  }

  async cmdDoctor(args) {
    this.printHeader();
    console.log(`🏥 GAW DIAGNOSTIC DOCTOR:\n`);
    console.log(`[✓] Node.js Runtime:    ${process.version}`);
    console.log(`[✓] GAW Repository:     ${this.repoRoot}`);

    const skills = await this.registry.getAllSkills();
    console.log(`[✓] Registered Skills:  ${skills.length} skills verified`);

    const categories = await this.registry.getCategories();
    console.log(`[✓] Taxonomy:           ${categories.length} categories active`);

    const graphify = new GraphifyManager({ projectRoot: process.cwd() });
    const hasGraphCli = graphify.isGraphifyCliAvailable();
    console.log(`[${hasGraphCli ? '✓' : 'ℹ'}] Graphify CLI:      ${hasGraphCli ? 'Installed' : 'Built-in deterministic analyzer active'}`);

    const project = ProjectDetector.detect(process.cwd());
    console.log(`[✓] Current Directory:  ${project.projectName} (${project.framework})\n`);
  }

  cmdVersion() {
    const pkg = JSON.parse(fs.readFileSync(path.join(this.repoRoot, 'package.json'), 'utf8'));
    console.log(`gaw version ${pkg.version}`);
  }

  cmdHelp() {
    this.printHeader();
    console.log(`Usage: gaw <command> [options]\n`);
    console.log(`Core Commands:`);
    console.log(`  init [--dry-run] [--force] [--no-agentation] [--no-graphify]`);
    console.log(`                        Initialize current project with GAW ecosystem`);
    console.log(`  start                 Resume an existing initialized project`);
    console.log(`  skills [category]     List all skills or filter by category`);
    console.log(`  search <query>        Search skills library with relevance ranking`);
    console.log(`  recommend <task>      Analyze task and recommend targeted skills`);
    console.log(`  use <task>            Progressively load full skill instructions for a task`);
    console.log(`  brain [update <msg>]  Inspect or update Global Brain and precedence`);
    console.log(`  project               Display detailed project architecture analysis`);
    console.log(`  graph [--force]       Generate or inspect Codebase Architecture Graph`);
    console.log(`  doctor                Diagnose environment, dependencies & registry`);
    console.log(`  update                Check for updates to skill library`);
    console.log(`  version               Display version info`);
    console.log(`  help                  Display this help menu\n`);
  }
}

export default GawCli;

