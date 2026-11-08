import path from 'node:path';
import fs from 'node:fs';
import { spawn, exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';
import { SkillDiscovery } from '../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';
import { PresetRegistry } from '../core/preset-registry/PresetRegistry.js';
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
    this.presetRegistry = new PresetRegistry({ presetsDir: path.join(this.repoRoot, 'presets', 'designs') });
    this.orchestrator = new SkillOrchestrator(this.registry, this.presetRegistry);
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
        case 'designs':
        case 'presets':
          await this.cmdDesigns(args.slice(1));
          break;
        case 'design':
        case 'preset':
          await this.cmdDesign(args.slice(1));
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

    if (recs.designPresets && recs.designPresets.length > 0) {
      console.log(`\n🎨 Recommended Design Presets (Click to preview inspiration):`);
      for (const dp of recs.designPresets) {
        console.log(`  ★ \x1b[1m${dp.name}\x1b[0m (${dp.id}) — [${dp.theme} | ${dp.category}]`);
        if (dp.reason) {
          console.log(`    • ${dp.reason}`);
        }
        if (dp.vibe) {
          console.log(`    • Vibe: "${dp.vibe}"`);
        }
        if (dp.liveUrl) {
          console.log(`    • 🌐 \x1b[36mLive Inspiration:\x1b[0m ${dp.liveUrl} (Ctrl + Click)`);
        }
        console.log(`    • 📖 \x1b[35mStyle Reference:\x1b[0m  ${dp.previewUrl}`);
      }
    }
    console.log();
  }

  copyToClipboard(text) {
    return new Promise((resolve, reject) => {
      let proc;
      if (process.platform === 'win32') {
        proc = spawn('clip');
      } else if (process.platform === 'darwin') {
        proc = spawn('pbcopy');
      } else {
        proc = spawn('xclip', ['-selection', 'clipboard']);
      }
      proc.on('error', reject);
      proc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`Clipboard process exited with code ${code}`));
      });
      proc.stdin.write(text);
      proc.stdin.end();
    });
  }

  async cmdUse(args) {
    const isInject = args.includes('--inject') || args.includes('--save') || args.includes('-i');
    const isCopy = args.includes('--copy') || args.includes('-c');

    const cleanArgs = args.filter(a => !['--inject', '--save', '-i', '--copy', '-c'].includes(a));
    const prompt = cleanArgs.join(' ').trim();

    if (!prompt) {
      console.log(`Please provide a task prompt or skill list: gaw use "<task description>" [--inject] [--copy]`);
      return;
    }

    const projectInfo = ProjectDetector.detect(process.cwd());
    const loaded = await this.orchestrator.loadSkillsForTask(prompt, projectInfo);

    if (isInject) {
      this.printHeader();
      const brainDir = path.join(process.cwd(), 'ai-brain');
      if (!fs.existsSync(brainDir)) {
        fs.mkdirSync(brainDir, { recursive: true });
      }
      const activeSkillsPath = path.join(brainDir, 'active-skills.md');
      fs.writeFileSync(activeSkillsPath, loaded.formattedInstructions, 'utf8');

      console.log(`✅ Injected ${loaded.selectedSkillCount} specialized skill(s) directly into:`);
      console.log(`   📄 ${path.relative(process.cwd(), activeSkillsPath)}\n`);

      console.log(`🎯 Active Skills Loaded:`);
      for (const s of loaded.skills) {
        console.log(`  ★ \x1b[1m${s.name}\x1b[0m (${s.id}) — [${s.category}]`);
      }

      if (loaded.conflictResolutions && loaded.conflictResolutions.length > 0) {
        console.log(`\n⚠️ Active Conflict Resolutions:`);
        for (const conf of loaded.conflictResolutions) {
          console.log(`  ! [${conf.skills.join(' ↔ ')}]: ${conf.resolution}`);
        }
      }

      if (loaded.recommendedDesignPreset) {
        const designPath = path.join(brainDir, 'design.md');
        fs.writeFileSync(designPath, loaded.recommendedDesignPreset.content, 'utf8');
        console.log(`\n🎨 Injected Design Preset [${loaded.recommendedDesignPreset.name}] directly into:`);
        console.log(`   📄 ${path.relative(process.cwd(), designPath)}`);
        if (loaded.recommendedDesignPreset.liveUrl) {
          console.log(`   🌐 Live Inspiration: ${loaded.recommendedDesignPreset.liveUrl} (Ctrl + Click)`);
        }
      }

      console.log(`\n👉 Your AI coding agent (Antigravity, Cursor, Claude Code, Codex)`);
      console.log(`   will now automatically read and apply these constraints from ai-brain/active-skills.md!\n`);
      return;
    }

    if (isCopy) {
      try {
        await this.copyToClipboard(loaded.formattedInstructions);
        this.printHeader();
        console.log(`📋 Successfully copied ${loaded.selectedSkillCount} active skill instruction(s) to your clipboard!\n`);
        return;
      } catch (err) {
        console.warn(`⚠️ Could not copy directly to clipboard (${err.message}). Printing to stdout instead:\n`);
      }
    }

    console.log(loaded.formattedInstructions);
    console.log(`\n💡 Tip: Run with --inject (or --save) to write directly to ai-brain/active-skills.md without copy-pasting!`);
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

  openUrl(url) {
    if (!url) return;
    const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
    exec(`${cmd} "${url}"`);
  }

  async cmdDesigns(args) {
    this.printHeader();
    const sub = args[0];
    const themeFilter = args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null;

    let presets = [];
    if (sub === 'search') {
      const q = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
      presets = await this.presetRegistry.searchPresets(q, { theme: themeFilter });
      console.log(`Search results for design presets "${q}" (${presets.length} matches):\n`);
    } else {
      presets = await this.presetRegistry.getAllPresets();
      if (themeFilter) {
        presets = presets.filter(p => p.theme.toLowerCase() === themeFilter.toLowerCase());
      }
      console.log(`🎨 GradientDeck Design Presets Library (${presets.length} presets available):\n`);
    }

    for (const p of presets) {
      console.log(`• \x1b[1m${p.id}\x1b[0m (${p.name}) — [${p.theme} | ${p.category}]`);
      if (p.liveUrl) {
        console.log(`  🌐 \x1b[36mLive:\x1b[0m ${p.liveUrl} (Ctrl + Click) | 📖 \x1b[35mDeck:\x1b[0m ${p.previewUrl}`);
      } else {
        console.log(`  📖 \x1b[35mDeck:\x1b[0m ${p.previewUrl}`);
      }
      if (p.vibe) {
        console.log(`  "${p.vibe}"\n`);
      } else {
        console.log();
      }
    }

    console.log(`👉 Use 'gaw design <id>' to inspect palette & typography.`);
    console.log(`👉 Use 'gaw design <id> --apply' to write directly to ai-brain/design.md.`);
    console.log(`👉 Use 'gaw design <id> --open' to launch the live site in browser.\n`);
  }

  async cmdDesign(args) {
    this.printHeader();
    const id = args[0];
    if (!id || id.startsWith('--')) {
      console.log(`Please specify a design preset ID: gaw design <id> [--apply] [--open] [--deck]`);
      return;
    }

    const preset = await this.presetRegistry.getPreset(id);
    if (!preset) {
      console.log(`❌ Preset '${id}' not found. Run 'gaw designs' to see all available presets.`);
      return;
    }

    if (args.includes('--open')) {
      if (preset.liveUrl) {
        console.log(`🌐 Launching live inspiration in browser: ${preset.liveUrl}`);
        this.openUrl(preset.liveUrl);
      } else {
        console.log(`📖 Launching preview deck: ${preset.previewUrl}`);
        this.openUrl(preset.previewUrl);
      }
      return;
    }

    if (args.includes('--deck')) {
      console.log(`📖 Launching preview deck in browser: ${preset.previewUrl}`);
      this.openUrl(preset.previewUrl);
      return;
    }

    if (args.includes('--apply')) {
      const brainDir = path.join(process.cwd(), 'ai-brain');
      if (!fs.existsSync(brainDir)) {
        fs.mkdirSync(brainDir, { recursive: true });
      }
      const targetFile = path.join(brainDir, 'design.md');
      fs.writeFileSync(targetFile, preset.content, 'utf8');
      console.log(`✅ Applied design preset '${preset.name}' directly to:`);
      console.log(`   📄 ${path.relative(process.cwd(), targetFile)}\n`);
      if (preset.liveUrl) {
        console.log(`🌐 Live Inspiration: ${preset.liveUrl} (Ctrl + Click)`);
      }
      console.log(`\n👉 Your AI coding agent will now adhere to the typography, color roles, and layout constraints of this design!\n`);
      return;
    }

    // Default inspection view
    console.log(`🎨 DESIGN PRESET: \x1b[1m${preset.name}\x1b[0m (${preset.id})\n`);
    console.log(`Theme:    ${preset.theme.toUpperCase()}`);
    console.log(`Category: ${preset.category}`);
    if (preset.liveUrl) {
      console.log(`🌐 Live Inspiration: \x1b[36m${preset.liveUrl}\x1b[0m (Ctrl + Click)`);
    }
    console.log(`📖 Style Reference:  \x1b[35m${preset.previewUrl}\x1b[0m\n`);

    if (preset.vibe) {
      console.log(`Archetype: "${preset.vibe}"\n`);
    }

    if (preset.colors && preset.colors.length > 0) {
      console.log(`Color Palette Sample:`);
      for (const c of preset.colors) {
        console.log(`  ■ \x1b[1m${c.value.padEnd(10)}\x1b[0m ${c.name.padEnd(20)} (${c.role})`);
      }
      console.log();
    }

    console.log(`Actions:`);
    console.log(`  • Apply to project:    gaw design ${preset.id} --apply`);
    console.log(`  • Open live website:   gaw design ${preset.id} --open`);
    console.log(`  • Open style deck:     gaw design ${preset.id} --deck\n`);
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

    const presets = await this.presetRegistry.getAllPresets();
    console.log(`[✓] Design Presets:     ${presets.length} presets active (with live inspiration links)`);

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
    console.log(`  designs [search <q>] [--theme <dark|light>]`);
    console.log(`                        List or search real-world design presets from GradientDeck`);
    console.log(`  design <id> [--apply] [--open] [--deck]`);
    console.log(`                        Inspect preset with color palette & live website link`);
    console.log(`  search <query>        Search skills library with relevance ranking`);
    console.log(`  recommend <task>      Analyze task and recommend targeted skills`);
    console.log(`  use <task> [--inject] [--copy]`);
    console.log(`                        Load skills (use --inject to write directly to ai-brain/)`);
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

