import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawn, exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';
import { lintLibrary, lintSkillFolder, NEW_SKILL_TODO } from '../core/skill-registry/SkillLinter.js';
import { prepareSkill, previewSkill, installSkill, findMissingSupportFiles, restoreSupportFiles } from '../core/skill-registry/skillImport.js';
import { GitHubClient } from '../core/skill-registry/github.js';
import { resolveSkillLicense } from '../core/skill-registry/licenses.js';
import { applyLicense, planSplit, applySplit, canModify, writeSkillFolder, readSkillFolder, toSkillName } from '../core/skill-registry/gss.js';
import { enrichContract, rankabilityLevel, LEVEL_NAMES } from '../core/skill-registry/rankability.js';
import { selectSkills, deselectSkills, writeCatalog, loadProjectContext } from '../core/project-context/ProjectContext.js';
import { writeGlobalBrainSnapshot, SNAPSHOT_FILE } from '../core/project-context/globalBrainLink.js';
import { listDrafts, approveDrafts, rejectDrafts } from '../core/skill-registry/drafts.js';
import { SkillDiscovery } from '../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';
import { PresetRegistry } from '../core/preset-registry/PresetRegistry.js';
import { MemoryEngine } from '../core/memory-engine/MemoryEngine.js';
import { ProjectDetector } from '../core/project-detector/ProjectDetector.js';
import { ProjectBootstrapper } from '../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager, GRAPHIFY_SETUP_HINT } from '../core/graphify-manager/GraphifyManager.js';

import { runInteractiveOnboarding } from './interactive.js';
import { ensureGraphify, askYesNo } from './graphify-setup.js';

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
    this.memoryEngine = new MemoryEngine();
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
        case 'setup':
          await this.cmdSetup(args.slice(1));
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
        case 'context':
          await this.cmdContext(args.slice(1));
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
    const isInteractive = args.includes('-i') || args.includes('--interactive') || (process.stdin.isTTY && !args.includes('--yes') && !args.includes('--non-interactive'));

    console.log(`🚀 Initializing project at: ${process.cwd()}`);
    if (dryRun) console.log(`🔍 Mode: DRY RUN (no files will be written)`);

    const runOnboarding = isInteractive && !dryRun;
    const graphify = await this.prepareGraphifyForInit(args, { dryRun, runOnboarding });

    const result = await this.bootstrapper.init(process.cwd(), {
      dryRun,
      force,
      noAgentation,
      noGraphify: !graphify.ready
    });

    // Onboarding asks about Graphify itself, so don't also list it as skipped
    if (graphify.askInOnboarding) {
      result.skipped = result.skipped.filter(s => !s.startsWith('Graphify'));
    }

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

    if (result.warnings.length > 0) {
      console.log(`\n⚠️ Warnings:`);
      for (const w of result.warnings) {
        console.log(`  • ${w}`);
      }
    }

    // Onboarding suggests skills from the user's goal instead of the stack
    if (!runOnboarding && result.skillsRecommended.length > 0) {
      console.log(`\n🎯 Recommended Initial Skills:`);
      for (const skill of result.skillsRecommended) {
        console.log(`  ★ ${skill}`);
      }
    }

    console.log(`\n✅ Project initialization complete!`);

    if (runOnboarding) {
      await runInteractiveOnboarding(this.bootstrapper, process.cwd(), {
        offerGraphify: graphify.askInOnboarding
      });
    } else {
      console.log(`👉 Next: Use 'gaw use "<your task>"' to load targeted skills for any task.\n`);
    }
  }

  /**
   * Decide how init handles the optional Graphify code map. Never installs
   * without consent: interactive runs ask during onboarding (step 4).
   * Returns { ready, askInOnboarding }.
   */
  async prepareGraphifyForInit(args, { dryRun, runOnboarding }) {
    if (args.includes('--no-graphify')) return { ready: false, askInOnboarding: false };

    const manager = new GraphifyManager();
    if (manager.isGraphifyCliAvailable()) return { ready: true, askInOnboarding: false };

    if (dryRun) {
      console.log(`ℹ Graphify is not installed. A normal run would ask whether to install it (optional).`);
      return { ready: false, askInOnboarding: false };
    }

    if (args.includes('--install-graphify')) {
      const res = await ensureGraphify({ manager, confirmGraphify: false, confirmUv: false });
      return { ready: res.available, askInOnboarding: false };
    }

    if (runOnboarding) return { ready: false, askInOnboarding: true };

    console.log(`ℹ Graphify is not installed (optional): skipping the code map. Add it later with: gaw setup`);
    return { ready: false, askInOnboarding: false };
  }

  async cmdSetup(args) {
    this.printHeader();
    const yes = args.includes('--yes');
    const canAsk = Boolean(process.stdin.isTTY) && !args.includes('--non-interactive');

    // Running `gaw setup` is consent to install Graphify. Installing uv (a remote
    // script) is still confirmed, unless --yes was passed.
    const res = await ensureGraphify({
      confirmGraphify: false,
      confirmUv: !yes,
      ask: canAsk ? askYesNo : null
    });

    if (res.available) {
      if (!res.installed) console.log(`✓ Graphify is already installed (${res.version}).`);
      console.log(`👉 Next: run 'gaw graph' inside a project to build its code map.\n`);
    } else {
      process.exitCode = 1;
    }
  }

  async cmdStart(args) {
    this.printHeader();
    const res = await this.bootstrapper.start(process.cwd());
    console.log(`Project:           ${res.projectName}`);
    console.log(`Framework:         ${res.framework}`);
    console.log(`Project Brain:     ${res.hasProjectBrain ? 'Configured (ai-brain/)' : 'Missing'}`);
    console.log(`Codebase Graph:    ${res.hasGraph ? 'Generated (graphify-out/graph.json)' : res.graphStatus}`);
    console.log(`Status:            ${res.status}`);
    console.log(`\n${res.recommendedNextStep}\n`);
  }

  async cmdSkills(args) {
    if (args[0] === 'lint') return this.cmdSkillsLint(args.slice(1));
    if (args[0] === 'index') return this.cmdSkillsIndex();
    if (args[0] === 'licenses') return this.cmdSkillsLicenses(args.slice(1));
    if (args[0] === 'split') return this.cmdSkillsSplit(args.slice(1));
    if (args[0] === 'add') return this.cmdSkillsAdd(args.slice(1));
    if (args[0] === 'new') return this.cmdSkillsNew(args.slice(1));
    if (args[0] === 'repair') return this.cmdSkillsRepair(args.slice(1));
    if (args[0] === 'enrich') return this.cmdSkillsEnrich(args.slice(1));
    if (args[0] === 'select') return this.cmdSkillsSelect(args.slice(1));
    if (args[0] === 'deselect') return this.cmdSkillsDeselect(args.slice(1));
    if (args[0] === 'selected') return this.cmdSkillsSelected();
    if (args[0] === 'review') return this.cmdSkillsReview(args.slice(1));

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

  /** gaw skills lint [folder] [--quiet]: check skills against the GAW Skill Standard (docs/gss/spec.md). */
  async cmdSkillsLint(args) {
    const quiet = args.includes('--quiet');
    const target = args.find(a => !a.startsWith('--'));
    const root = target ? path.resolve(target) : this.registry.skillsDir;
    const showLevels = args.includes('--levels');
    const { results, levels, errorCount, warningCount } = lintLibrary(root);

    for (const r of results) {
      if (r.errors.length === 0 && (quiet || r.warnings.length === 0)) continue;
      console.log(`${r.errors.length ? '✗' : '⚠'} ${path.relative(process.cwd(), r.dir) || r.dir}`);
      for (const e of r.errors) console.log(`    error:   ${e}`);
      if (!quiet) for (const w of r.warnings) console.log(`    warning: ${w}`);
    }

    if (showLevels) {
      console.log(`\nRankability (GSS Ranking v1):`);
      for (const r of [...results].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))) {
        const next = r.missing.length ? `  → needs ${r.missing.join(', ')}` : '';
        console.log(`  ${String(r.level)} ${r.levelName.padEnd(10)} ${r.name}${next}`);
      }
    }

    console.log(`\n${results.length} skill(s) checked: ${errorCount} error(s), ${warningCount} warning(s).`);
    console.log(`Rankability: ${levels.map(l => `${l.name} ${l.count}`).join(' · ')}${showLevels ? '' : '   (details: --levels)'}`);
    if (errorCount > 0) process.exitCode = 1;
  }

  /**
   * gaw skills licenses [--apply]: find each imported skill's real license at its
   * source (skill LICENSE file, original SKILL.md, or repository license).
   */
  async cmdSkillsLicenses(args) {
    const apply = args.includes('--apply');
    const github = new GitHubClient();
    const skills = await this.registry.getAllSkills();
    const withSource = skills.filter(s => s.contract?.source?.repo);
    const noSource = skills.filter(s => !s.contract?.source?.repo);

    console.log(`Checking licenses of ${withSource.length} skills against their source repositories...\n`);
    const results = [];
    for (const skill of withSource) {
      try {
        const result = await resolveSkillLicense(github, skill.contract.source);
        results.push({ skill, result });
        if (apply) applyLicense(skill.dir, result);
      } catch (err) {
        console.log(`\n${err.message}`);
        process.exitCode = 1;
        break;
      }
    }

    const groups = { open: [], copyleft: [], restricted: [], unknown: [] };
    for (const r of results) groups[r.result.category].push(r);
    const label = { open: 'Open (may share and modify)', copyleft: 'Copyleft (share alike)', restricted: 'Restricted (may not redistribute without permission)', unknown: 'No license found' };
    for (const [category, items] of Object.entries(groups)) {
      if (!items.length) continue;
      const bySpdx = {};
      for (const { result } of items) bySpdx[result.spdx || 'none'] = (bySpdx[result.spdx || 'none'] || 0) + 1;
      console.log(`${label[category]}: ${items.length}  (${Object.entries(bySpdx).map(([k, v]) => `${k} ${v}`).join(', ')})`);
      if (category !== 'open') {
        for (const { skill, result } of items) console.log(`    ${skill.id}  [${result.evidence}] ${result.url}`);
      }
    }
    const relabeled = results.filter(r => r.result.spdx && r.skill.license !== r.result.spdx);
    console.log(`\nLicense differs from what the library says: ${relabeled.length} skill(s).`);
    if (noSource.length) {
      console.log(`No source on record (license cannot be checked automatically): ${noSource.length} skill(s).`);
    }
    if (apply) {
      this.registry.writeIndex();
      console.log(`\n✓ Recorded licenses in SKILL.md and gaw.json, and rebuilt skills/index.json.`);
    } else {
      console.log(`\nRun 'gaw skills licenses --apply' to record these licenses.`);
    }
  }

  /**
   * gaw skills split [<skill-name> | --all] [--apply]: move the long parts of
   * oversized skills into references/ (lossless). Preview unless --apply.
   */
  async cmdSkillsSplit(args) {
    const apply = args.includes('--apply');
    const all = args.includes('--all');
    const name = args.find(a => !a.startsWith('--'));
    const skills = (await this.registry.getAllSkills()).filter(s => (all ? true : s.id === name));
    if (!all && skills.length === 0) {
      console.log(`Usage: gaw skills split <skill-name> [--apply]   or   gaw skills split --all [--apply]`);
      return;
    }

    let changed = 0;
    for (const skill of skills) {
      if (skill.format !== 'gss') continue;
      const plan = planSplit(skill.content, { skillName: skill.id });
      if (!plan) {
        if (!all) console.log(`${skill.id} is within the size guideline; nothing to split.`);
        continue;
      }
      const status = skill.contract?.source?.licenseStatus;
      if (skill.contract?.source && !canModify(status)) {
        console.log(`⏭  ${skill.id}: not split. Its license (${status || 'unverified'}) doesn't clearly allow changes.`);
        continue;
      }
      console.log(`${apply ? '✓' : '•'} ${skill.id}: ~${plan.before} → ~${plan.after} tokens in SKILL.md, ${plan.references.length} reference file(s)`);
      for (const r of plan.references) console.log(`    ${r.file} (~${r.tokens} tokens)`);
      if (apply) {
        applySplit(skill.dir, plan);
        changed++;
      }
    }

    if (apply && changed) {
      this.registry.writeIndex();
      console.log(`\nSplit ${changed} skill(s) and rebuilt skills/index.json.`);
    } else if (!apply) {
      console.log(`\nPreview only. Add --apply to write the files.`);
    }
  }

  /** Read "--flag value" options; returns { values, positional }. */
  parseOptions(args, valueFlags) {
    const values = {};
    const positional = [];
    for (let i = 0; i < args.length; i++) {
      if (valueFlags.includes(args[i])) values[args[i].slice(2)] = args[++i];
      else if (!args[i].startsWith('--')) positional.push(args[i]);
    }
    return { values, positional };
  }

  /** Where new skills go: the GAW library, or ai-brain/skills with --project. */
  skillTarget(args) {
    const project = args.includes('--project');
    return {
      project,
      root: project ? path.join(process.cwd(), 'ai-brain', 'skills') : this.registry.skillsDir,
      flat: project
    };
  }

  /** After writing a skill: check it and refresh the library index. */
  finishNewSkill(dir, project) {
    const known = new Set([...this.registry.skills.keys(), path.basename(dir)]);
    const { errors, warnings } = lintSkillFolder(dir, known);
    if (!project) this.registry.writeIndex();
    for (const e of errors) console.log(`  error:   ${e}`);
    for (const w of warnings) console.log(`  warning: ${w}`);
    return errors.length === 0;
  }

  /**
   * gaw skills add <github-link | folder | file.md> [--category c] [--name n]
   *   [--project] [--allow-changes] [--yes]
   * Converts any skill to GSS, checks its license, copies its supporting files,
   * splits it if oversized (when the license allows), then lints and indexes it.
   */
  async cmdSkillsAdd(args) {
    this.printHeader();
    const { values, positional } = this.parseOptions(args, ['--category', '--name', '--description', '--when']);
    const target = positional[0];
    if (!target) {
      console.log(`Usage: gaw skills add <github-link | skill-folder | file.md> [--category <c>] [--name <n>]`);
      console.log(`         [--description "<what it does>"] [--when "<when to use it>"] [--project] [--yes]`);
      return;
    }
    const { project, root, flat } = this.skillTarget(args);
    await this.registry.ensureLoaded();

    let prepared;
    try {
      prepared = await prepareSkill(target, { github: new GitHubClient() });
    } catch (err) {
      console.log(err.message);
      process.exitCode = 1;
      return;
    }

    if (values.description) prepared.data = { ...prepared.data, description: values.description };
    const preview = previewSkill(prepared, { root, category: values.category, name: values.name, flat, when: values.when });
    if (args.includes('--allow-changes') && preview.oversizedNotSplit) {
      // The user confirms they own the skill or may change it
      preview.split = planSplit(prepared.content, { skillName: preview.name });
      preview.warnings = preview.warnings.filter(w => !w.includes('was not split'));
    }

    if (fs.existsSync(preview.dir) || (!project && this.registry.skills.has(preview.name))) {
      console.log(`A skill named "${preview.name}" already exists. Choose another name with --name <skill-name>.`);
      process.exitCode = 1;
      return;
    }

    const lic = prepared.license;
    console.log(`Skill:        ${preview.name}${preview.data.metadata['gaw-title'] ? ` (${preview.data.metadata['gaw-title']})` : ''}`);
    console.log(`Category:     ${preview.category} (${preview.categorySource}${preview.categorySource === 'chosen' ? '' : '; change with --category'})`);
    console.log(`From:         ${prepared.origin}`);
    console.log(`License:      ${lic.spdx || 'none found'} (${lic.category}, ${lic.evidence})`);
    console.log(`Description:  ${preview.data.description.length > 160 ? `${preview.data.description.slice(0, 157)}...` : preview.data.description}`);
    console.log(`Size:         ~${Math.round(prepared.content.length / 4)} tokens${preview.split ? ` → split into SKILL.md (~${preview.split.after}) + ${preview.split.references.length} reference file(s)` : ''}`);
    if (preview.support.selected.length) console.log(`Files:        ${preview.support.selected.length} supporting file(s)`);
    console.log(`Permissions:  ${preview.contract.permissions?.length ? preview.contract.permissions.join(', ') : 'instructions only'}`);
    console.log(`Ranking:      Level ${preview.level} ${preview.levelName}${preview.levelMissing.length ? ` (next level needs: ${preview.levelMissing.join(', ')})` : ''}`);
    console.log(`Saves to:     ${path.relative(process.cwd(), preview.dir) || preview.dir}`);
    for (const w of preview.warnings) console.log(`⚠ ${w}`);

    // GSS Ranking v1: skills must be at least Findable (Level 1) to be added
    if (preview.level < 1) {
      console.log(`\nNot added: GAW can only rank a skill that says what it does and when to use it.`);
      console.log(`Missing: ${preview.levelMissing.join('; ')}.`);
      console.log(`Fix it in the skill, or add it here: --when "<when to use it>"  /  --description "<what it does and when>"`);
      process.exitCode = 1;
      return;
    }

    if (!args.includes('--yes')) {
      if (!process.stdin.isTTY) {
        console.log(`\nNot added. Run again with --yes to add it without a prompt.`);
        return;
      }
      if (!(await askYesNo('\nAdd this skill? (Y/n) '))) {
        console.log('Not added.');
        return;
      }
    }

    const result = await installSkill(prepared, preview);
    console.log(`\n✓ Added ${preview.name} as a GSS skill${result.copied ? ` with ${result.copied} supporting file(s)` : ''}.`);
    const ok = this.finishNewSkill(result.dir, project);
    if (!ok) {
      console.log(`Fix the errors above, then run: gaw skills lint ${path.relative(process.cwd(), result.dir)}`);
      process.exitCode = 1;
    }
  }

  /**
   * gaw skills new "<Title>" [--category c] [--description d] [--license l]
   *   [--author a] [--project]: create a ready-to-fill GSS skill.
   */
  async cmdSkillsNew(args) {
    const { values, positional } = this.parseOptions(args, ['--category', '--description', '--license', '--author']);
    const title = positional.join(' ').trim();
    const name = toSkillName(title);
    if (!name) {
      console.log(`Usage: gaw skills new "<Skill title>" [--category <c>] [--description "<d>"] [--license <l>] [--project]`);
      return;
    }
    const { project, root, flat } = this.skillTarget(args);
    const category = values.category || 'general';
    const dir = flat ? path.join(root, name) : path.join(root, category, name);
    await this.registry.ensureLoaded();
    if (fs.existsSync(dir) || (!project && this.registry.skills.has(name))) {
      console.log(`A skill named "${name}" already exists.`);
      process.exitCode = 1;
      return;
    }

    const license = values.license || 'MIT';
    const data = {
      name,
      description: values.description || `${NEW_SKILL_TODO} say what ${title} does and when to use it.`,
      license,
      metadata: {
        'gaw-title': title !== name ? title : undefined,
        'gaw-category': category,
        'gaw-author': values.author || os.userInfo().username,
        'gaw-version': '0.1.0'
      }
    };
    for (const k of Object.keys(data.metadata)) if (data.metadata[k] === undefined) delete data.metadata[k];

    const content = [
      `# ${title}`,
      '',
      '## When to use',
      '- (Situations where an agent should follow this skill)',
      '',
      '## Instructions',
      '1. (Step-by-step guidance for the agent)',
      '',
      '## Checks',
      '- (How to confirm the result is correct)'
    ].join('\n');

    const contract = {
      gss: 1,
      keywords: [],
      whenToUse: [],
      whenNotToUse: [],
      verification: [],
      lastVerified: new Date().toISOString().split('T')[0]
    };

    writeSkillFolder(dir, { data, content, contract });
    console.log(`✓ Created ${path.relative(process.cwd(), dir) || dir} (license ${license}${values.license ? '' : '; change it in SKILL.md if needed'}).`);
    this.finishNewSkill(dir, project);
    console.log(`\nNext: write the description and instructions in SKILL.md, add search keywords in gaw.json,`);
    console.log(`then run: gaw skills lint ${path.relative(process.cwd(), dir) || dir}`);
  }

  /**
   * gaw skills repair [<skill-name> | --all] [--repo owner/name] [--apply]: download
   * supporting files (scripts, references, assets) that imported skills are missing.
   */
  async cmdSkillsRepair(args) {
    const apply = args.includes('--apply');
    const { values, positional } = this.parseOptions(args, ['--repo']);
    const name = positional[0];
    const skills = (await this.registry.getAllSkills()).filter(s =>
      s.contract?.source?.repo
      && (args.includes('--all') || values.repo ? true : s.id === name)
      && (!values.repo || s.contract.source.repo === values.repo));
    if (skills.length === 0) {
      console.log(`Usage: gaw skills repair <skill-name> | --all | --repo <owner/name>  [--apply]`);
      return;
    }

    const github = new GitHubClient();
    let files = 0;
    let bytes = 0;
    let written = 0;
    for (const skill of skills) {
      let missing;
      try {
        missing = await findMissingSupportFiles(github, skill, { includeBinary: args.includes('--include-binary') });
      } catch (err) {
        console.log(err.message);
        process.exitCode = 1;
        break;
      }
      if (!missing || missing.files.length === 0) continue;
      files += missing.files.length;
      bytes += missing.totalBytes;
      const extra = [
        missing.skipped ? `${missing.skipped} over the limits` : '',
        missing.binaryLeftAtSource ? `${missing.binaryLeftAtSource} binary left at source` : ''
      ].filter(Boolean).join(', ');
      console.log(`${apply ? '✓' : '•'} ${skill.id}: ${missing.files.length} missing file(s), ${(missing.totalBytes / 1024).toFixed(0)} KB${extra ? ` (${extra})` : ''}`);
      if (apply) written += await restoreSupportFiles(github, skill, missing);
    }

    console.log(`\n${apply ? `Restored ${written}` : `Would restore ${files}`} file(s), ${(bytes / 1024 / 1024).toFixed(1)} MB.`);
    if (!apply && files) console.log(`Add --apply to download them.`);
  }

  /**
   * gaw skills enrich [--apply]: fill empty gaw.json ranking fields (summary,
   * whenToUse, whenNotToUse, verification, domains, permissions) from each skill's
   * own text. Never overwrites author fields, never invents content.
   */
  async cmdSkillsEnrich(args) {
    const apply = args.includes('--apply');
    const refresh = args.includes('--refresh'); // recompute previously derived fields
    const skills = (await this.registry.getAllSkills()).filter(s => s.format === 'gss');
    const fieldCounts = {};
    const before = [0, 0, 0, 0];
    const after = [0, 0, 0, 0];
    let changed = 0;

    for (const skill of skills) {
      before[rankabilityLevel(skill).level]++;
      const { contract, filled } = enrichContract(skill, { refresh });
      after[rankabilityLevel({ ...skill, contract }).level]++;
      if (!filled.length) continue;
      changed++;
      for (const f of filled) fieldCounts[f] = (fieldCounts[f] || 0) + 1;
      if (apply) {
        const folder = readSkillFolder(skill.dir);
        writeSkillFolder(skill.dir, { ...folder, contract });
      }
    }

    console.log(`${apply ? 'Filled' : 'Would fill'} fields from the skills' own text in ${changed} of ${skills.length} skill(s):`);
    for (const [field, n] of Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${field.padEnd(13)} ${n}`);
    const fmt = (d) => LEVEL_NAMES.map((n, i) => `${n} ${d[i]}`).join(' · ');
    console.log(`\nRankability before: ${fmt(before)}`);
    console.log(`Rankability after:  ${fmt(after)}`);
    if (apply) {
      this.registry.writeIndex();
      console.log(`\n✓ Updated gaw.json files and skills/index.json. Filled fields are listed in each contract's "derived".`);
    } else {
      console.log(`\nPreview only. Add --apply to write gaw.json files.`);
    }
  }

  /** gaw skills select <name...> [--reason "<why>"]: use library skills in this project. */
  async cmdSkillsSelect(args) {
    const { values, positional } = this.parseOptions(args, ['--reason']);
    if (!positional.length) {
      console.log(`Usage: gaw skills select <skill-name> [more names] [--reason "<why this project needs it>"]`);
      return;
    }
    const res = await selectSkills(process.cwd(), this.registry, positional, values.reason);
    await writeCatalog(process.cwd(), this.registry);
    if (res.added.length) console.log(`✓ Selected for this project: ${res.added.join(', ')}`);
    if (res.already.length) console.log(`  Already selected: ${res.already.join(', ')}`);
    if (res.unknown.length) {
      console.log(`  Not found in the library: ${res.unknown.join(', ')} (search with: gaw search "<keyword>")`);
      process.exitCode = 1;
    }
    console.log(`  Agents see them in ai-brain/project-skills.md and open each one only when a task needs it.`);
  }

  /** gaw skills deselect <name...>: stop using skills in this project. */
  async cmdSkillsDeselect(args) {
    if (!args.length) {
      console.log(`Usage: gaw skills deselect <skill-name> [more names]`);
      return;
    }
    const removed = deselectSkills(process.cwd(), args);
    await writeCatalog(process.cwd(), this.registry);
    console.log(removed.length ? `✓ Removed from this project: ${removed.join(', ')}` : `None of these skills were selected.`);
  }

  /** gaw skills selected: the skills this project uses. */
  async cmdSkillsSelected() {
    const ctx = await loadProjectContext(process.cwd(), { registry: this.registry });
    if (!ctx.skills.selected.length && !ctx.skills.project.length) {
      console.log(`No skills selected for this project. Add some with: gaw skills select <skill-name>`);
      return;
    }
    if (ctx.skills.selected.length) {
      console.log(`Selected from the GAW library:`);
      for (const s of ctx.skills.selected) console.log(`  • ${s.id} (v${s.version})${s.reason ? ` — ${s.reason}` : ''}`);
    }
    if (ctx.skills.project.length) {
      console.log(`Project skills (ai-brain/skills/):`);
      for (const s of ctx.skills.project) console.log(`  • ${s.id}`);
    }
    for (const w of ctx.warnings) console.log(`⚠ ${w}`);
  }

  /** gaw context [--json]: everything GAW knows about this project (what MCP get_project_context returns). */
  async cmdContext(args) {
    const ctx = await loadProjectContext(process.cwd(), { registry: this.registry });
    if (args.includes('--json')) {
      console.log(JSON.stringify(ctx, null, 2));
      return;
    }
    this.printHeader();
    console.log(`Project:        ${ctx.project.name} (${ctx.project.framework})`);
    console.log(`Project Brain:  ${ctx.initialized ? 'ai-brain/' : 'not initialized (run gaw init)'}`);
    console.log(`Goal:           ${ctx.goal || '(none yet)'}`);
    console.log(`Rules:          ${ctx.rules.length ? '' : '(none yet)'}`);
    for (const r of ctx.rules) console.log(`  - ${r}`);
    console.log(`Skills:         ${ctx.skills.selected.length} selected, ${ctx.skills.project.length} project skill(s)`);
    for (const s of [...ctx.skills.selected, ...ctx.skills.project]) console.log(`  • ${s.id}${s.tokens ? ` (~${s.tokens} tokens, loaded only when needed)` : ''}`);
    console.log(`Code graph:     ${ctx.graph.available ? ctx.graph.json : 'not built (gaw graph)'}`);
    console.log(`Global Brain:   ${ctx.globalBrain}`);
    for (const w of ctx.warnings) console.log(`⚠ ${w}`);
    console.log();
  }

  /**
   * gaw skills review [<name> | --all] [--approve <name|all>] [--reject <name|all>] [--field <f>]
   * Show AI-drafted fields waiting for review; approve them (they start counting for
   * ranking) or reject them (deleted). Drafts never count until approved.
   */
  async cmdSkillsReview(args) {
    const { values, positional } = this.parseOptions(args, ['--approve', '--reject', '--field']);
    const skills = await this.registry.getAllSkills();
    const withDrafts = skills.filter(s => s.format === 'gss' && (s.contract?.drafts || []).length);
    const fields = values.field ? [values.field] : null;

    const act = (target, fn, verb) => {
      const list = target === 'all' ? withDrafts : withDrafts.filter(s => s.id === target);
      if (!list.length) {
        console.log(target === 'all' ? 'No drafts waiting for review.' : `No drafts for "${target}".`);
        return;
      }
      let count = 0;
      for (const s of list) count += fn(s.dir, fields).length;
      this.registry.writeIndex();
      console.log(`✓ ${verb} ${count} drafted field(s) in ${list.length} skill(s).`);
    };
    if (values.approve) return act(values.approve, approveDrafts, 'Approved');
    if (values.reject) return act(values.reject, rejectDrafts, 'Rejected');

    const shown = args.includes('--all') || !positional[0] ? withDrafts : withDrafts.filter(s => s.id === positional[0]);
    if (!shown.length) {
      console.log(withDrafts.length ? `No drafts for "${positional[0]}".` : 'No drafts waiting for review.');
      return;
    }
    for (const s of shown) {
      console.log(`\n${s.id}  (${s.category})`);
      console.log(`  ${String(s.description).slice(0, 160)}${s.description.length > 160 ? '…' : ''}`);
      for (const [field, value] of Object.entries(listDrafts(s.contract))) {
        console.log(`  ${field}:`);
        for (const v of value) console.log(`    - ${v}`);
      }
    }
    console.log(`\n${shown.length} skill(s) with drafts. Approve: gaw skills review --approve <name|all> [--field keywords]`);
    console.log(`Reject:  gaw skills review --reject <name|all> [--field whenNotToUse]`);
  }

  /** gaw skills index: rebuild skills/index.json after adding or editing skills. */
  async cmdSkillsIndex() {
    const index = this.registry.writeIndex();
    console.log(`✓ Wrote ${path.relative(process.cwd(), path.join(this.registry.skillsDir, 'index.json'))} (${index.skills.length} skills).`);
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

    if (recs.primarySkills.length === 0) {
      console.log(`No skills in the library closely match this task.`);
      console.log(`Try different words, browse with 'gaw skills', or search with 'gaw search "<keyword>"'.`);
    } else {
      console.log(`🎯 Primary Skills:`);
      for (const p of recs.primarySkills) {
        console.log(`  ★ \x1b[1m${p.name}\x1b[0m (${p.id}) — [${p.category}]`);
        console.log(`    Why: ${p.reason}`);
      }
    }

    if (recs.supportingSkills.length > 0) {
      console.log(`\n🛠️ Supporting Skills:`);
      for (const s of recs.supportingSkills) {
        console.log(`  • ${s.name} (${s.id}) — [${s.category}]`);
        console.log(`    Why: ${s.reason}`);
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

    // --budget <tokens>: how much skill content to load in full (default 8000)
    const budgetIdx = args.indexOf('--budget');
    const tokenBudget = budgetIdx !== -1 ? Number(args[budgetIdx + 1]) : undefined;
    if (budgetIdx !== -1 && !(tokenBudget > 0)) {
      console.log(`--budget needs a positive number of tokens, e.g. --budget 4000`);
      return;
    }

    const cleanArgs = args.filter((a, i) =>
      !['--inject', '--save', '-i', '--copy', '-c', '--budget'].includes(a) && !(budgetIdx !== -1 && i === budgetIdx + 1));
    const prompt = cleanArgs.join(' ').trim();

    if (!prompt) {
      console.log(`Please provide a task prompt or skill list: gaw use "<task description>" [--inject] [--copy] [--budget <tokens>]`);
      return;
    }

    const projectInfo = ProjectDetector.detect(process.cwd());
    const loaded = await this.orchestrator.loadSkillsForTask(prompt, projectInfo, { tokenBudget });

    if (isInject && loaded.selectedSkillCount === 0) {
      this.printHeader();
      console.log(`No skills in the library closely match this task, so ai-brain/active-skills.md was left unchanged.`);
      console.log(`Try different words, browse with 'gaw skills', or name skills directly: gaw use "<skill-id>, <skill-id>" --inject\n`);
      return;
    }

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

      console.log(`🎯 Active Skills Loaded (budget ~${loaded.tokenBudget} tokens):`);
      for (const s of loaded.skills) {
        const mode = s.mode === 'summary' ? ` — short form (full skill ~${s.fullTokens} tokens, read on demand)` : '';
        console.log(`  ★ \x1b[1m${s.name}\x1b[0m (${s.id}) — [${s.category}]${mode}`);
        console.log(`    Why: ${s.reason}`);
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
      // Record the project by name only: full local paths don't belong in shared memory
      await this.memoryEngine.recordDecision(category, decision, `Updated via CLI in ${path.basename(process.cwd())}`);
      console.log(`✅ Recorded decision in Global Brain: [${category}] ${decision}`);
      console.log(`   ${path.join(this.memoryEngine.globalBrainDir, 'decision-history.md')}`);
      // Agents in this project see it right away
      if (writeGlobalBrainSnapshot(process.cwd(), this.memoryEngine.globalBrainDir)) {
        console.log(`   Refreshed ai-brain/${SNAPSHOT_FILE} in this project.`);
      }
      return;
    }

    if (sub === 'path') {
      console.log(this.memoryEngine.globalBrainDir);
      return;
    }

    await this.memoryEngine.initGlobalBrain();
    console.log(`🧠 GLOBAL BRAIN & MEMORY PRECEDENCE:`);
    console.log(`  Global Brain location: ${this.memoryEngine.globalBrainDir}`);
    console.log(`  (set GAW_HOME to move it, e.g. into a synced folder)\n`);
    console.log(`  Precedence Order:`);
    console.log(`  1. Explicit User Request (Highest)`);
    console.log(`  2. Project Brain (./ai-brain/rules.md)`);
    console.log(`  3. Global Brain (${this.memoryEngine.globalBrainDir})`);
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
    const full = args.includes('--full');
    const manager = new GraphifyManager({ projectRoot: process.cwd() });
    console.log(`Generating/Inspecting codebase relationship graph...`);
    const res = await manager.generateGraph({ targetDir: process.cwd(), force, full });
    if (res.skipped) {
      console.log(`\nGraphify is not installed, so there is no code map yet.`);
      console.log(`${GRAPHIFY_SETUP_HINT}\n`);
      process.exitCode = 1;
      return;
    }
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
      console.log(`${res.graphUpdated ? '✓' : 'ℹ'} Codebase Architecture Graph: ${res.graphSummary}`);
      if (res.agentationChecked) {
        console.log(`✓ Agentation visual inspection verified.`);
      }
      if (res.agentFilesUpdated?.length) console.log(`✓ Refreshed agent instructions: ${res.agentFilesUpdated.join(', ')}`);
      if (res.catalogUpdated) console.log(`✓ Refreshed ai-brain/project-skills.md`);
      if (res.globalBrainSnapshot) console.log(`✓ Refreshed ${res.globalBrainSnapshot} from your Global Brain (${this.memoryEngine.globalBrainDir})`);
      if (res.removedLegacyCopies?.length) {
        console.log(`✓ Removed old, unchanged copies of Global Brain files (your live Global Brain now applies): ${res.removedLegacyCopies.join(', ')}`);
      }
      if (res.keptProjectOverrides?.length) {
        console.log(`ℹ Kept edited copies as project-level choices (they override your Global Brain here): ${res.keptProjectOverrides.join(', ')}`);
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
    await this.memoryEngine.initGlobalBrain();
    console.log(`[✓] Global Brain:       ${this.memoryEngine.globalBrainDir}`);

    const skills = await this.registry.getAllSkills();
    console.log(`[✓] Registered Skills:  ${skills.length} skills verified`);

    const categories = await this.registry.getCategories();
    console.log(`[✓] Taxonomy:           ${categories.length} categories active`);

    const presets = await this.presetRegistry.getAllPresets();
    console.log(`[✓] Design Presets:     ${presets.length} presets active (with live inspiration links)`);

    const graphify = new GraphifyManager({ projectRoot: process.cwd() });
    const graphifyVersion = graphify.getCliVersion();
    console.log(`[${graphifyVersion ? '✓' : '⚠'}] Graphify CLI:       ${graphifyVersion || 'Not installed (optional, recommended)'}`);

    const project = ProjectDetector.detect(process.cwd());
    console.log(`[✓] Current Directory:  ${project.projectName} (${project.framework})\n`);

    if (!graphifyVersion) {
      console.log(`${GRAPHIFY_SETUP_HINT}\n`);
    }
  }

  cmdVersion() {
    const pkg = JSON.parse(fs.readFileSync(path.join(this.repoRoot, 'package.json'), 'utf8'));
    console.log(`gaw version ${pkg.version}`);
  }

  cmdHelp() {
    this.printHeader();
    console.log(`Usage: gaw <command> [options]\n`);
    console.log(`Core Commands:`);
    console.log(`  init [--dry-run] [--force] [--no-agentation] [--install-graphify | --no-graphify]`);
    console.log(`                        Initialize current project with GAW ecosystem`);
    console.log(`  setup [--yes]         Install Graphify (optional code map for AI agents)`);
    console.log(`  start                 Resume an existing initialized project`);
    console.log(`  skills [category]     List all skills or filter by category`);
    console.log(`  skills add <link|folder|file> [--category c] [--project] [--yes]`);
    console.log(`                        Add any skill; converted to GSS, license checked, split if oversized`);
    console.log(`  skills new "<title>" [--category c] [--project]`);
    console.log(`                        Create a new GSS skill from a template`);
    console.log(`  skills lint [folder] [--levels]  Check skills against GSS and show ranking levels`);
    console.log(`  skills enrich [--apply]  Fill ranking fields from each skill's own text`);
    console.log(`  skills select <name...> [--reason r]  Use library skills in this project (skills.lock.json)`);
    console.log(`  skills deselect <name...>  Stop using skills in this project`);
    console.log(`  skills selected       List the skills this project uses`);
    console.log(`  skills review [name|--all] [--approve|--reject <name|all>]  Review AI-drafted ranking fields`);
    console.log(`  context [--json]      Everything GAW knows about this project (goal, rules, skills, graph)`);
    console.log(`  skills licenses [--apply]  Check each skill's license at its source`);
    console.log(`  skills split <name|--all> [--apply]  Move long parts of oversized skills into references/`);
    console.log(`  skills index          Rebuild skills/index.json (also happens automatically)`);
    console.log(`  designs [search <q>] [--theme <dark|light>]`);
    console.log(`                        List or search real-world design presets from GradientDeck`);
    console.log(`  design <id> [--apply] [--open] [--deck]`);
    console.log(`                        Inspect preset with color palette & live website link`);
    console.log(`  search <query>        Search skills library with relevance ranking`);
    console.log(`  recommend <task>      Analyze task and recommend targeted skills`);
    console.log(`  use <task> [--inject] [--copy] [--budget <tokens>]`);
    console.log(`                        Load closely matching skills (use --inject to write to ai-brain/)`);
    console.log(`  brain [update <msg> | path]  Inspect or update your Global Brain (~/.gaw/brain)`);
    console.log(`  project               Display detailed project architecture analysis`);
    console.log(`  graph [--force|--full] Build the code graph (--force: refresh changed files, --full: rebuild)`);
    console.log(`  doctor                Diagnose environment, dependencies & registry`);
    console.log(`  update                Check for updates to skill library`);
    console.log(`  version               Display version info`);
    console.log(`  help                  Display this help menu\n`);
  }
}

export default GawCli;

