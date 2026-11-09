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
import { selectSkills, deselectSkills, writeCatalog, loadProjectContext, shareSkillWithProject } from '../core/project-context/ProjectContext.js';
import { trustLevel, describeTrust, TRUST_LEVELS } from '../core/skill-registry/trust.js';
import { updateSkillPreferences } from '../core/skill-registry/preferences.js';
import { writeGlobalBrainSnapshot, SNAPSHOT_FILE } from '../core/project-context/globalBrainLink.js';
import { writeActiveTask, readActiveTask, archiveActiveTask } from '../core/project-context/activeTask.js';
import { ACTIVE_TASK_FILE } from '../core/project-context/brainLayout.js';
import { loadPacks, packReasons, packSkills, addPack, removePack, addedPacks } from '../core/packs/packs.js';
import { listDrafts, approveDrafts, rejectDrafts } from '../core/skill-registry/drafts.js';
import { SkillDiscovery } from '../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';
import { PresetRegistry } from '../core/preset-registry/PresetRegistry.js';
import { MemoryEngine } from '../core/memory-engine/MemoryEngine.js';
import { ProjectDetector } from '../core/project-detector/ProjectDetector.js';
import { ProjectBootstrapper } from '../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager, GRAPHIFY_SETUP_HINT } from '../core/graphify-manager/GraphifyManager.js';

import { runInteractiveOnboarding } from './interactive.js';
import { ensureGraphify, askYesNo, askTyped } from './graphify-setup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ACTIVE_TASK_LABEL = `ai-brain/${ACTIVE_TASK_FILE}`;
const REPO_ROOT = path.resolve(__dirname, '../');

export class GawCli {
  constructor() {
    this.repoRoot = REPO_ROOT;
    // GAW's official library plus the user's personal library (~/.gaw/skills) and pin/block preferences
    this.registry = new SkillRegistry({ skillsDir: path.join(this.repoRoot, 'skills'), user: true });
    this.discovery = new SkillDiscovery(this.registry);
    this.presetRegistry = new PresetRegistry({ presetsDir: path.join(this.repoRoot, 'presets', 'designs') });
    this.orchestrator = new SkillOrchestrator(this.registry, this.presetRegistry);
    this.memoryEngine = new MemoryEngine();
    this.bootstrapper = new ProjectBootstrapper({ repoRoot: this.repoRoot });
  }

  /** Short trust and preference tags for listings: "[community · pinned]". */
  skillTags(skill) {
    const prefs = this.registry.preferences || {};
    const tags = [trustLevel(skill)];
    if (skill.overrides) tags.push(`replaces the ${skill.overrides} one`);
    if ((prefs.pinned || []).includes(skill.id)) tags.push('pinned');
    if ((prefs.blocked || []).includes(skill.id)) tags.push('blocked');
    return `[${tags.join(' · ')}]`;
  }

  printHeader() {
    console.log(`\n======================================================`);
    console.log(`🌐 GUIDED AGENT WORKFLOW (GAW) — One Brain. Any Agent. Every Project.`);
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
        case 'task':
          await this.cmdTask(args.slice(1));
          break;
        case 'packs':
        case 'pack':
          await this.cmdPacks(args.slice(1));
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

    // Onboarding asks about packs itself (it also knows the goal)
    if (!runOnboarding && result.packsSuggested?.length > 0) {
      console.log(`\n📦 Skill packs that fit this project (nothing added yet):`);
      for (const p of result.packsSuggested) {
        console.log(`  ★ ${p.name}: ${p.title} (${p.skills.join(', ')})`);
        console.log(`    Why: ${p.reasons.join('; ')}`);
      }
      console.log(`  Add with: gaw packs add ${result.packsSuggested.map(p => p.name).join(' ')}`);
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
    if (['pin', 'unpin', 'block', 'unblock'].includes(args[0])) return this.cmdSkillsPreference(args[0], args.slice(1));
    if (args[0] === 'prefs' || args[0] === 'preferences') return this.cmdSkillsPrefs();
    if (args[0] === 'share') return this.cmdSkillsShare(args.slice(1));
    if (args[0] === 'mine') return this.cmdSkillsMine();

    this.printHeader();
    const category = args[0];
    let skills;
    if (category) {
      skills = await this.registry.getSkillsByCategory(category);
      console.log(`Showing skills for category: [${category}] (${skills.length} skills)\n`);
    } else {
      skills = await this.registry.getAllSkills();
      const personal = skills.filter(s => s.library === 'personal').length;
      console.log(`Listing all registered skills (${skills.length} total${personal ? `, ${personal} in your personal library` : ''}):\n`);
    }

    for (const s of skills) {
      console.log(`• \x1b[1m${s.id}\x1b[0m — [${s.category}] ${this.skillTags(s)}`);
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

  /**
   * Where new skills go:
   *   default     your personal library (~/.gaw/skills): every project on this machine can use it
   *   --project   this project's ai-brain/skills (committed with the project)
   *   --official  GAW's own library (for GAW maintainers; share it with a pull request)
   */
  skillTarget(args) {
    const project = args.includes('--project');
    const official = !project && args.includes('--official');
    const where = project ? 'project' : official ? 'official' : 'personal';
    const root = project
      ? path.join(process.cwd(), 'ai-brain', 'skills')
      : official ? this.registry.skillsDir : (this.registry.personalDir || this.registry.skillsDir);
    return { project, where, root, flat: project };
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
   *   [--project | --official] [--override] [--allow-changes] [--yes] [--allow-scripts]
   * Converts any skill to GSS, checks its license, copies its supporting files,
   * splits it if oversized (when the license allows), then lints and indexes it.
   * Saves to your personal library unless --project or --official is given.
   */
  async cmdSkillsAdd(args) {
    this.printHeader();
    const { values, positional } = this.parseOptions(args, ['--category', '--name', '--description', '--when']);
    const target = positional[0];
    if (!target) {
      console.log(`Usage: gaw skills add <github-link | skill-folder | file.md> [--category <c>] [--name <n>]`);
      console.log(`         [--description "<what it does>"] [--when "<when to use it>"] [--project | --official] [--yes]`);
      console.log(`Saves to your personal library (${this.registry.personalDir || 'GAW library'}) unless --project or --official is given.`);
      return;
    }
    const { project, where, root, flat } = this.skillTarget(args);
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

    // Name clashes: a personal skill may replace an official one for you only, and only on purpose
    const existing = this.registry.skills.get(preview.name);
    const mayOverride = where === 'personal' && existing?.library === 'official' && args.includes('--override');
    if (fs.existsSync(preview.dir) || (!project && existing && !mayOverride)) {
      console.log(`A skill named "${preview.name}" already exists${existing ? ` (${trustLevel(existing)})` : ''}. Choose another name with --name <skill-name>.`);
      if (where === 'personal' && existing?.library === 'official') {
        console.log(`To use your version instead of the official one (for you only), add --override.`);
      }
      process.exitCode = 1;
      return;
    }

    // The trust level the skill will have once added
    const willBe = trustLevel({ library: where, contract: preview.contract });
    const canRunCommands = (preview.contract.permissions || []).includes('shell');
    const unreviewed = willBe === 'community' || willBe === 'personal';

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
    console.log(`Trust:        ${TRUST_LEVELS[willBe].label} — ${TRUST_LEVELS[willBe].note}`);
    const library = { personal: 'your personal library', project: 'this project', official: "GAW's official library" }[where];
    console.log(`Saves to:     ${library}: ${where === 'personal' ? preview.dir : (path.relative(process.cwd(), preview.dir) || preview.dir)}`);
    if (mayOverride) console.log(`Replaces:     the official "${preview.name}" skill, for you only`);
    for (const w of preview.warnings) console.log(`⚠ ${w}`);

    // GSS Ranking v1: skills must be at least Findable (Level 1) to be added
    if (preview.level < 1) {
      console.log(`\nNot added: GAW can only rank a skill that says what it does and when to use it.`);
      console.log(`Missing: ${preview.levelMissing.join('; ')}.`);
      console.log(`Fix it in the skill, or add it here: --when "<when to use it>"  /  --description "<what it does and when>"`);
      process.exitCode = 1;
      return;
    }

    // Not reviewed by GAW and able to run commands: ask for a deliberate confirmation
    if (canRunCommands && unreviewed) {
      console.log(`\n┌─ This skill can run commands on your computer, and GAW has not reviewed it.`);
      console.log(`│  Agents following it may run its scripts or hooks in any project that uses it.`);
      console.log(`│  Only add it if you trust the author, and read its scripts first:`);
      console.log(`│  ${prepared.origin}`);
      console.log(`└─`);
      if (args.includes('--yes')) {
        if (!args.includes('--allow-scripts')) {
          console.log(`Not added. To confirm without a prompt, add --allow-scripts as well as --yes.`);
          process.exitCode = 1;
          return;
        }
      } else if (!process.stdin.isTTY) {
        console.log(`Not added. Run again with --yes --allow-scripts to add it without a prompt.`);
        return;
      } else if (!(await askTyped(`Type "yes" to add it anyway: `))) {
        console.log('Not added.');
        return;
      }
    } else if (!args.includes('--yes')) {
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
    console.log(`\n✓ Added ${preview.name} to ${library}${result.copied ? ` with ${result.copied} supporting file(s)` : ''}.`);
    if (where === 'personal') console.log(`  Every project on this computer can use it. To include it in a project for teammates: gaw skills share ${preview.name}`);
    if (where === 'official') console.log(`  It is part of GAW's library: share it with a pull request.`);
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
    const { project, where, root, flat } = this.skillTarget(args);
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
    const shown = where === 'personal' ? dir : (path.relative(process.cwd(), dir) || dir);
    console.log(`✓ Created ${shown} in ${where === 'personal' ? 'your personal library' : where === 'project' ? 'this project' : "GAW's official library"} (license ${license}${values.license ? '' : '; change it in SKILL.md if needed'}).`);
    this.finishNewSkill(dir, project);
    console.log(`\nNext: write the description and instructions in SKILL.md, add search keywords in gaw.json,`);
    console.log(`then run: gaw skills lint ${shown}`);
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
      console.log(`Selected from your skill libraries:`);
      for (const s of ctx.skills.selected) console.log(`  • ${s.id} (v${s.version}) [${s.trust}]${s.reason ? ` — ${s.reason}` : ''}`);
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
    const commands = Object.entries(ctx.commands || {}).filter(([, c]) => c);
    console.log(`Commands:       ${commands.length ? commands.map(([k, c]) => `${k}: ${c}`).join(' · ') : '(none detected)'}`);
    console.log(`Active task:    ${ctx.activeTask ? `${ctx.activeTask.task} (${ctx.activeTask.file})` : '(none)'}`);
    console.log(`Packs:          ${ctx.packs.added.length ? ctx.packs.added.join(', ') : '(none added)'}${ctx.packs.suggested.length ? `; also fit: ${ctx.packs.suggested.map(p => p.name).join(', ')} (gaw packs)` : ''}`);
    console.log(`Skills:         ${ctx.skills.selected.length} selected, ${ctx.skills.project.length} project skill(s)`);
    for (const s of [...ctx.skills.selected, ...ctx.skills.project]) console.log(`  • ${s.id}${s.tokens ? ` (~${s.tokens} tokens, loaded only when needed)` : ''}`);
    console.log(`Code graph:     ${ctx.graph.available ? ctx.graph.json : 'not built (gaw graph)'}`);
    console.log(`Global Brain:   ${ctx.globalBrain}`);
    for (const w of ctx.warnings) console.log(`⚠ ${w}`);
    console.log();
  }

  /**
   * gaw skills pin|unpin|block|unblock <name...>: skill preferences in your Global Brain.
   * Pinned skills get a small boost when they fit a task; blocked skills are never suggested.
   */
  async cmdSkillsPreference(action, ids) {
    if (!ids.length) {
      console.log(`Usage: gaw skills ${action} <skill-name> [more names]`);
      return;
    }
    await this.registry.ensureLoaded();
    const unknown = ids.filter(id => !this.registry.skills.has(id));
    const known = ids.filter(id => this.registry.skills.has(id));
    if (unknown.length) {
      console.log(`Not found: ${unknown.join(', ')} (search with: gaw search "<keyword>")`);
      process.exitCode = 1;
    }
    if (!known.length) return;
    const { changed } = updateSkillPreferences(action, known, this.registry.preferencesFile || undefined);
    this.registry.reloadPreferences();
    const done = { pin: 'Pinned', unpin: 'Unpinned', block: 'Blocked', unblock: 'Unblocked' }[action];
    const effect = {
      pin: 'GAW considers them first when they fit a task.',
      unpin: 'They rank like any other skill again.',
      block: 'GAW will not suggest them. You can still use one by naming it: gaw use "<skill-name>"',
      unblock: 'GAW may suggest them again.'
    }[action];
    if (changed.length) console.log(`✓ ${done}: ${changed.join(', ')}. ${effect}`);
    const same = known.filter(id => !changed.includes(id));
    if (same.length) console.log(`  No change for: ${same.join(', ')}`);
  }

  /** gaw skills prefs: pinned and blocked skills. */
  async cmdSkillsPrefs() {
    await this.registry.ensureLoaded();
    const prefs = this.registry.preferences;
    console.log(`Skill preferences (${this.registry.preferencesFile}):`);
    console.log(`  Pinned:  ${prefs.pinned.length ? prefs.pinned.join(', ') : '(none)'}   gaw skills pin <name>`);
    console.log(`  Blocked: ${prefs.blocked.length ? prefs.blocked.join(', ') : '(none)'}   gaw skills block <name>`);
    if (prefs.invalid) console.log(`⚠ The preferences file is not valid JSON; fix or delete it.`);
  }

  /** gaw skills mine: the skills in your personal library. */
  async cmdSkillsMine() {
    const skills = (await this.registry.getAllSkills()).filter(s => s.library === 'personal');
    console.log(`Your personal library: ${this.registry.personalDir}`);
    if (!skills.length) {
      console.log(`No skills yet. Add one with: gaw skills add <github-link | folder | file.md>  or  gaw skills new "<Title>"`);
      return;
    }
    for (const s of skills) {
      console.log(`• \x1b[1m${s.id}\x1b[0m — [${s.category}] ${this.skillTags(s)}`);
      if (s.contract?.source?.repo) console.log(`  From: https://github.com/${s.contract.source.repo}`);
      if ((s.contract?.permissions || []).includes('shell')) console.log(`  Can run commands (scripts or hooks)`);
    }
  }

  /**
   * gaw skills share <name> [--yes]: copy a skill from your personal library into this
   * project (ai-brain/skills/) so teammates get it when they clone the project.
   */
  async cmdSkillsShare(args) {
    const id = args.find(a => !a.startsWith('--'));
    if (!id) {
      console.log(`Usage: gaw skills share <skill-name>   (copies a personal skill into ai-brain/skills/ for this project)`);
      return;
    }
    const skill = await this.registry.getSkill(id);
    if (!skill) {
      console.log(`Not found: ${id}`);
      process.exitCode = 1;
      return;
    }
    if (skill.library === 'official') {
      console.log(`"${id}" is in GAW's official library, so everyone with GAW already has it. Select it instead: gaw skills select ${id}`);
      return;
    }
    // Committing a skill into a project shares it: the license has to allow that
    const status = skill.contract?.source?.licenseStatus;
    if (skill.contract?.source && !canModify(status) && !args.includes('--yes')) {
      console.log(`"${id}" comes from ${skill.contract.source.repo} and its license (${status || 'unknown'}) may not allow sharing copies.`);
      console.log(`Get the author's permission, then run again with --yes. Teammates can also add it themselves: gaw skills add https://github.com/${skill.contract.source.repo}`);
      process.exitCode = 1;
      return;
    }
    try {
      const { dir } = shareSkillWithProject(process.cwd(), skill);
      await writeCatalog(process.cwd(), this.registry);
      console.log(`✓ Copied ${id} into ${path.relative(process.cwd(), dir)}. Commit it so teammates get it.`);
      if ((skill.contract?.permissions || []).includes('shell')) console.log(`⚠ It can run commands: teammates should review its scripts too.`);
    } catch (err) {
      console.log(err.message);
      process.exitCode = 1;
    }
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
    const personal = (await this.registry.getAllSkills()).filter(s => s.library === 'personal').length;
    if (personal) console.log(`✓ Wrote your personal library's index (${personal} skills).`);
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
      console.log(`• \x1b[1m${s.id}\x1b[0m — [${s.category}] ${this.skillTags(s)}`);
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
      const blockedFits = (await this.discovery.findRelevant(prompt, { includeBlocked: true }))
        .filter(s => (this.registry.preferences.blocked || []).includes(s.id));
      if (blockedFits.length) {
        console.log(`You blocked skills that fit: ${blockedFits.map(s => s.id).join(', ')} (gaw skills unblock <name>)`);
      }
      console.log(`Try different words, browse with 'gaw skills', or search with 'gaw search "<keyword>"'.`);
    } else {
      console.log(`🎯 Primary Skills:`);
      for (const p of recs.primarySkills) {
        console.log(`  ★ \x1b[1m${p.name}\x1b[0m (${p.id}) — [${p.category}] ${this.skillTags(this.registry.skills.get(p.id) || p)}`);
        console.log(`    Why: ${p.reason}`);
      }
    }

    if (recs.supportingSkills.length > 0) {
      console.log(`\n🛠️ Supporting Skills:`);
      for (const s of recs.supportingSkills) {
        console.log(`  • ${s.name} (${s.id}) — [${s.category}] ${this.skillTags(this.registry.skills.get(s.id) || s)}`);
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
    const isFull = args.includes('--full');

    // --budget <tokens>: how much skill content to load in full (default 8000)
    const budgetIdx = args.indexOf('--budget');
    const tokenBudget = budgetIdx !== -1 ? Number(args[budgetIdx + 1]) : undefined;
    if (budgetIdx !== -1 && !(tokenBudget > 0)) {
      console.log(`--budget needs a positive number of tokens, e.g. --budget 4000`);
      return;
    }

    const cleanArgs = args.filter((a, i) =>
      !['--inject', '--save', '-i', '--copy', '-c', '--budget', '--full'].includes(a) && !(budgetIdx !== -1 && i === budgetIdx + 1));
    const prompt = cleanArgs.join(' ').trim();

    if (!prompt) {
      console.log(`Please provide a task prompt or skill list: gaw use "<task description>" [--inject [--full]] [--copy] [--budget <tokens>]`);
      return;
    }

    const projectDir = process.cwd();
    const projectInfo = ProjectDetector.detect(projectDir);
    const loaded = await this.orchestrator.loadSkillsForTask(prompt, projectInfo, { tokenBudget });

    if (isInject && loaded.selectedSkillCount === 0) {
      this.printHeader();
      console.log(`No skills in the library closely match this task, so ${ACTIVE_TASK_LABEL} was left unchanged.`);
      console.log(`Try different words, browse with 'gaw skills', or name skills directly: gaw use "<skill-id>, <skill-id>" --inject\n`);
      return;
    }

    if (isInject) {
      this.printHeader();
      // A small pointer (which skill files to open and why), not the skill text: agents open
      // each skill only when they reach that part of the task. --full also embeds the bodies.
      let content = this.orchestrator.formatTaskPointer(loaded, { projectInfo, projectDir });
      if (isFull) content += `\n## Full skill instructions (--full)\n\n${loaded.formattedInstructions.replace(/^# .*\n+/, '')}`;
      const { file, archived } = writeActiveTask(projectDir, content);
      const tokens = Math.round(content.length / 4);

      console.log(`✅ Wrote the active task (~${tokens} tokens${isFull ? ', with full skill text' : ''}) to:`);
      console.log(`   📄 ${file}`);
      if (archived) console.log(`   (the previous task was archived to ${archived})`);

      console.log(`\n🎯 Skills for this task (agents open each file only when needed):`);
      for (const s of loaded.skills) {
        console.log(`  ★ \x1b[1m${s.name}\x1b[0m (${s.id}) — ~${s.fullTokens} tokens — [${s.category}] ${this.skillTags(this.registry.skills.get(s.id) || s)}`);
        console.log(`    Why: ${s.reason}`);
        if (s.caution) console.log(`    ⚠ Can run commands and is not reviewed by GAW: check commands from it before running them.`);
      }
      if (loaded.baseline) console.log(`  + ${loaded.baseline.name} (${loaded.baseline.id}) for every UI change`);

      if (loaded.excludedSkills?.length) {
        console.log(`\n↷ Left out:`);
        for (const e of loaded.excludedSkills) console.log(`  - ${e.id}: ${e.reason}`);
      }
      if (loaded.conflictResolutions?.length) {
        console.log(`\n⚠️ Conflicts:`);
        for (const conf of loaded.conflictResolutions) console.log(`  ! [${conf.skills.join(' ↔ ')}]: ${conf.resolution}`);
      }
      if (loaded.recommendedDesignPreset) {
        const p = loaded.recommendedDesignPreset;
        console.log(`\n🎨 Reference design (optional): ${p.name}. Inspect with 'gaw design ${p.id}'; 'gaw design ${p.id} --apply' replaces ai-brain/design.md.`);
      }

      console.log(`\n👉 Agents read ${file} while its Status is active. When the task is finished: gaw task done\n`);
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
    console.log(`\n💡 Tip: --inject writes a short task file (${ACTIVE_TASK_LABEL}) that tells agents which skills to open, instead of pasting them.`);
  }

  /**
   * gaw packs                      list packs; which fit this project and which are added
   * gaw packs show <name>          the skills a pack would add here, and why
   * gaw packs add <name...>        add packs' skills to ai-brain/skills.lock.json
   * gaw packs remove <name...>     take out what a pack added (skills chosen by hand stay)
   */
  async cmdPacks(args) {
    const projectDir = process.cwd();
    const sub = args[0];
    const names = args.slice(1).filter(a => !a.startsWith('--'));
    const info = ProjectDetector.detect(projectDir);
    const packs = loadPacks();
    const byName = new Map(packs.map(p => [p.name, p]));
    const unknown = names.filter(n => !byName.has(n));
    const needsBrain = () => {
      if (fs.existsSync(path.join(projectDir, 'ai-brain'))) return true;
      console.log(`No ai-brain/ here. Run 'gaw init' first.`);
      process.exitCode = 1;
      return false;
    };

    if (['add', 'remove', 'show'].includes(sub)) {
      if (!names.length) { console.log(`Usage: gaw packs ${sub} <name> [more names]   (list them with: gaw packs)`); return; }
      if (unknown.length) {
        console.log(`Unknown pack${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}. Packs: ${packs.map(p => p.name).join(', ')}`);
        process.exitCode = 1;
        return;
      }
    }

    if (sub === 'show') {
      for (const name of names) {
        const pack = byName.get(name);
        const { skills, missing } = await packSkills(pack, info, this.registry);
        console.log(`\n${pack.name}: ${pack.title}\n  ${pack.description}`);
        const reasons = packReasons(pack, info, { projectDir });
        console.log(`  Fits this project: ${reasons.length ? `yes (${reasons.join('; ')})` : 'not detected'}`);
        console.log(`  Skills it adds here:`);
        for (const s of skills) console.log(`    • ${s.id} — ${s.reason}`);
        if (missing.length) console.log(`  Not in your library: ${missing.join(', ')}`);
      }
      console.log();
      return;
    }

    if (sub === 'add') {
      if (!needsBrain()) return;
      for (const name of names) {
        const res = await addPack(projectDir, this.registry, byName.get(name), info);
        const parts = [];
        if (res.added.length) parts.push(`added ${res.added.join(', ')}`);
        if (res.tagged.length) parts.push(`also in this pack: ${res.tagged.join(', ')}`);
        if (res.already.length) parts.push(`already selected: ${res.already.join(', ')}`);
        console.log(`✓ ${name}: ${parts.join('; ') || 'nothing to add'}`);
        if (res.missing.length) console.log(`  Not in your library, skipped: ${res.missing.join(', ')}`);
      }
      await writeCatalog(projectDir, this.registry);
      console.log(`Refreshed ai-brain/project-skills.md. Agents open these skills only when a task needs them.`);
      return;
    }

    if (sub === 'remove') {
      if (!needsBrain()) return;
      for (const name of names) {
        const { removed, kept } = removePack(projectDir, name);
        if (!removed.length && !kept.length) { console.log(`• ${name}: not added to this project`); continue; }
        console.log(`✓ ${name}: removed ${removed.join(', ') || 'nothing'}${kept.length ? `; kept ${kept.join(', ')} (another pack uses ${kept.length > 1 ? 'them' : 'it'})` : ''}`);
      }
      await writeCatalog(projectDir, this.registry);
      return;
    }

    // List
    this.printHeader();
    const added = new Set(fs.existsSync(path.join(projectDir, 'ai-brain')) ? addedPacks(projectDir) : []);
    const goal = (await loadProjectContext(projectDir, { registry: this.registry })).goal || '';
    console.log(`Skill packs (curated sets of library skills):\n`);
    for (const pack of packs) {
      const reasons = packReasons(pack, info, { projectDir, goal });
      const status = added.has(pack.name) ? '\x1b[32m[added]\x1b[0m' : reasons.length ? '\x1b[36m[fits]\x1b[0m' : '';
      console.log(`  ${pack.name.padEnd(14)} ${status ? `${status} ` : ''}${pack.title}`);
      console.log(`  ${''.padEnd(14)} ${pack.description}`);
      if (reasons.length && !added.has(pack.name)) console.log(`  ${''.padEnd(14)} Why it fits: ${reasons.join('; ')}`);
      console.log();
    }
    console.log(`Details: gaw packs show <name>   Add: gaw packs add <name>   Remove: gaw packs remove <name>\n`);
  }

  /** gaw task [done]: show the active task, or archive it when finished. */
  async cmdTask(args) {
    const projectDir = process.cwd();
    const sub = args[0];
    if (sub === 'done' || sub === 'archive') {
      const archived = archiveActiveTask(projectDir, 'done');
      console.log(archived ? `✅ Task archived to ${archived}. Agents no longer read it.` : `No active task (${ACTIVE_TASK_LABEL} doesn't exist).`);
      return;
    }
    const task = readActiveTask(projectDir);
    if (!task) {
      console.log(`No active task. Start one with: gaw use "<task>" --inject`);
      return;
    }
    console.log(`Task:    ${task.task}`);
    console.log(`Status:  ${task.status}${task.status === 'active' ? '' : ' (agents ignore it)'}`);
    console.log(`Started: ${task.started || 'unknown'}`);
    console.log(`File:    ${task.file}`);
    console.log(`\nWhen it's finished: gaw task done`);
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
      if (res.migration) {
        const m = res.migration;
        console.log(`\n📦 Moved ai-brain/ to the current layout (brain.json, decisions/, memory/proposed/, local/):`);
        for (const f of m.archived) console.log(`  ↷ archived ${f}`);
        for (const f of m.removed) console.log(`  - removed ${f}`);
        for (const f of m.replaced) console.log(`  ✓ updated ${f}`);
        for (const f of m.kept) console.log(`  ℹ ${f}`);
      }
      if (res.refreshedSections?.length) console.log(`✓ Refreshed auto-detected sections: ${res.refreshedSections.join(', ')}`);
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
    const personal = skills.filter(s => s.library === 'personal').length;
    console.log(`[✓] Registered Skills:  ${skills.length - personal} official${personal ? ` + ${personal} in your personal library (${this.registry.personalDir})` : ''}`);
    if (this.registry.overrides.length) console.log(`[i] Your skills replacing official ones: ${this.registry.overrides.join(', ')}`);
    if (this.registry.preferences.invalid) console.log(`[⚠] ${this.registry.preferencesFile} is not valid JSON; pins and blocks are ignored until it is fixed.`);

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
    console.log(`  skills add <link|folder|file> [--category c] [--project | --official] [--yes]`);
    console.log(`                        Add any skill to your personal library (~/.gaw/skills); converted to GSS,`);
    console.log(`                        license checked, split if oversized`);
    console.log(`  skills new "<title>" [--category c] [--project | --official]`);
    console.log(`                        Create a new GSS skill from a template`);
    console.log(`  skills mine           List the skills in your personal library`);
    console.log(`  skills share <name>   Copy a personal skill into this project (ai-brain/skills/) for teammates`);
    console.log(`  skills pin|unpin <name...>     Prefer skills you trust when they fit a task`);
    console.log(`  skills block|unblock <name...> Never suggest a skill (naming it still works)`);
    console.log(`  skills prefs          Show pinned and blocked skills`);
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
    console.log(`  use <task> [--inject [--full]] [--copy] [--budget <tokens>]`);
    console.log(`                        Load closely matching skills (--inject: write the task and skill files`);
    console.log(`                        to open into ai-brain/local/active-task.md; --full also embeds skill text)`);
    console.log(`  task [done]           Show the active task, or archive it when finished`);
    console.log(`  packs [show|add|remove <name...>]  Curated skill sets (ui, motion, marketing, design-system,`);
    console.log(`                        design-system-build)`);
    console.log(`                        that fit this project; add or remove them as a group`);
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

