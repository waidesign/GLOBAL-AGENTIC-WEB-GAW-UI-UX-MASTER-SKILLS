/**
 * Shared project context service. The CLI, the MCP server and the agent
 * instruction files all read a project through this module, so they always
 * agree on the project's goal, rules, skills and tools.
 *
 * Project skill selection lives in ai-brain/skills.lock.json (which library
 * skills this project uses). ai-brain/project-skills.md is a generated catalog:
 * one short entry per skill, so agents open a full skill only when a task needs it.
 */
import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { ProjectDetector } from '../project-detector/ProjectDetector.js';
import { SkillRegistry } from '../skill-registry/SkillRegistry.js';
import { SkillOrchestrator } from '../orchestrator/SkillOrchestrator.js';
import { GraphifyManager } from '../graphify-manager/GraphifyManager.js';
import { userBrainDir } from '../memory-engine/paths.js';
import { GLOBAL_PREFERENCE_FILES, SNAPSHOT_FILE, LEGACY_SNAPSHOT_FILE } from './globalBrainLink.js';
import { BRAIN_JSON, DECISIONS_DIR, PROPOSED_MEMORY_DIR, PRECEDENCE, readBrainJson } from './brainLayout.js';
import { readActiveTask } from './activeTask.js';
import { loadPacks, detectPacks } from '../packs/detect.js';
import { trustLevel, describeTrust, needsCaution } from '../skill-registry/trust.js';

export const CONTEXT_VERSION = 1;
export const LOCK_FILE = 'skills.lock.json';
export const CATALOG_FILE = 'project-skills.md';

const brainDir = (projectDir) => path.join(projectDir, 'ai-brain');
const lockPath = (projectDir) => path.join(brainDir(projectDir), LOCK_FILE);
const today = () => new Date().toISOString().split('T')[0];

// ---------- Skill lockfile ----------

/** The project's skill selection: { gss: 1, skills: [{ id, version, reason, addedAt }] }. */
export function readLock(projectDir) {
  const file = lockPath(projectDir);
  if (!fs.existsSync(file)) return { gss: 1, skills: [] };
  try {
    const lock = readJsonFile(file);
    return { gss: 1, skills: Array.isArray(lock.skills) ? lock.skills : [] };
  } catch {
    return { gss: 1, skills: [], invalid: true };
  }
}

export function writeLock(projectDir, lock) {
  fs.mkdirSync(brainDir(projectDir), { recursive: true });
  const skills = [...lock.skills].sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(lockPath(projectDir), `${JSON.stringify({ gss: 1, skills }, null, 2)}\n`, 'utf8');
}

/**
 * Add library skills to the project. Records the version, why it was chosen,
 * and when. Returns { added, already, unknown }.
 */
export async function selectSkills(projectDir, registry, ids, reason = '', options = {}) {
  const lock = readLock(projectDir);
  const result = { added: [], already: [], unknown: [] };
  for (const id of ids) {
    const skill = await registry.getSkill(id);
    if (!skill) { result.unknown.push(id); continue; }
    const existing = lock.skills.find(s => s.id === id);
    if (existing) { result.already.push(id); continue; }
    const entry = { id, version: skill.version, reason: reason || 'Selected for this project.', addedAt: today() };
    // Where it came from, so a teammate without the skill gets a clear message
    if (skill.library && skill.library !== 'official') entry.library = skill.library;
    if (skill.contract?.source?.repo) entry.from = `https://github.com/${skill.contract.source.repo}`;
    // Added by a pack: `gaw packs remove` may take it out again; skills chosen by hand have no tag
    if (options.packs?.length) entry.packs = options.packs;
    lock.skills.push(entry);
    result.added.push(id);
  }
  if (result.added.length) writeLock(projectDir, lock);
  return result;
}

/** Remove skills from the project. Returns the IDs removed. */
export function deselectSkills(projectDir, ids) {
  const lock = readLock(projectDir);
  const removed = lock.skills.filter(s => ids.includes(s.id)).map(s => s.id);
  if (removed.length) writeLock(projectDir, { ...lock, skills: lock.skills.filter(s => !ids.includes(s.id)) });
  return removed;
}

// ---------- Project skills: selected library skills + skills in ai-brain/skills ----------

/** Registry over the project's own skills (ai-brain/skills), without writing an index into the project. */
export function projectSkillRegistry(projectDir) {
  return new SkillRegistry({ skillsDir: path.join(brainDir(projectDir), 'skills'), library: 'project', autoIndex: false });
}

/**
 * Copy a skill into the project (ai-brain/skills/<id>) so everyone who clones the
 * project has it, then remove it from the lockfile (it is now a project skill).
 * Returns { dir } or throws when the project already has a skill with that name.
 */
export function shareSkillWithProject(projectDir, skill) {
  const dest = path.join(brainDir(projectDir), 'skills', skill.id);
  if (fs.existsSync(dest)) throw new Error(`This project already has a skill named "${skill.id}" in ai-brain/skills/.`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(skill.dir, dest, { recursive: true, filter: (src) => path.basename(src) !== 'index.json' });
  deselectSkills(projectDir, [skill.id]);
  return { dir: dest };
}

/** Human-readable reasons for selected skills this machine doesn't have. */
function missingSkillWarnings(lock, missing) {
  if (!missing.length) return [];
  const byId = new Map(lock.skills.map(s => [s.id, s]));
  const personal = missing.filter(id => byId.get(id)?.library === 'personal');
  const other = missing.filter(id => !personal.includes(id));
  const out = [];
  if (personal.length) {
    out.push(`Selected skills that live only in someone's personal library: ${personal.join(', ')}. Ask whoever selected them to run \`gaw skills share <name>\` so they are committed with the project${personal.some(id => byId.get(id)?.from) ? ', or add them from their source with `gaw skills add <link>`' : ''}.`);
  }
  if (other.length) out.push(`Selected skills not found in the GAW library: ${other.join(', ')}.`);
  return out;
}

/**
 * The skills this project uses: library skills selected in the lockfile plus the
 * project's own skills. Returns a registry-shaped object for SkillOrchestrator.
 */
export async function projectSkillSet(projectDir, libraryRegistry) {
  const lock = readLock(projectDir);
  const selected = [];
  const missing = [];
  for (const entry of lock.skills) {
    const skill = await libraryRegistry.getSkill(entry.id);
    // A wrapper with the selection attached; the shared registry object (and its lazy body) stay untouched
    if (skill) selected.push(Object.assign(Object.create(skill), { selection: entry }));
    else missing.push(entry.id);
  }
  const own = await projectSkillRegistry(projectDir).getAllSkills();
  const all = [...selected, ...own.filter(s => !selected.some(x => x.id === s.id))];
  const byId = new Map(all.map(s => [s.id, s]));
  return {
    selected,
    own,
    missing,
    getAllSkills: async () => all,
    getSkill: async (id) => byId.get(id) || null
  };
}

const firstItems = (list, n) => (Array.isArray(list) ? list.slice(0, n) : []);

/** Write ai-brain/project-skills.md: a short catalog agents read instead of full skills. */
export async function writeCatalog(projectDir, libraryRegistry) {
  const set = await projectSkillSet(projectDir, libraryRegistry);
  const lines = [
    '# Project Skills',
    '',
    '_Generated by GAW from `ai-brain/skills.lock.json` and `ai-brain/skills/`. Do not edit; use `gaw skills select` / `gaw skills deselect`._',
    '',
    'These are the skills chosen for this project. **Open a skill only when the current task needs it**, or ask GAW for the ones that fit a task (MCP tool `load_project_skills`).',
    ''
  ];
  if (set.selected.length === 0 && set.own.length === 0) {
    lines.push('No skills selected yet. Add some with `gaw skills select <skill-name>`.');
  }

  const entry = (skill, origin) => {
    const c = skill.contract || {};
    const out = [`## ${skill.name} (\`${skill.id}\`)`, ''];
    out.push(c.summary || skill.description);
    const when = firstItems(c.whenToUse, 2);
    if (when.length) out.push('', `**When to use**: ${when.join(' ')}`);
    if (skill.selection?.reason) out.push(`**Why chosen**: ${skill.selection.reason}`);
    if (trustLevel(skill) !== 'official') out.push(`**Source**: ${describeTrust(skill)}`);
    if ((c.permissions || []).includes('shell')) {
      out.push(needsCaution(skill)
        ? '**Can run commands, not reviewed by GAW**: show the user any command from this skill before running it.'
        : '**Can run commands**: review its scripts before running them.');
    }
    const file = origin === 'project'
      ? path.relative(projectDir, skill.filePath).replace(/\\/g, '/')
      : skill.filePath.replace(/\\/g, '/');
    out.push(`**Full instructions** (~${skill.tokenEstimate ?? '?'} tokens): \`${file}\``, '');
    return out.join('\n');
  };

  if (set.selected.length) {
    lines.push('## Selected from the GAW library', '');
    for (const s of set.selected) lines.push(entry(s, 'library').replace(/^## /, '### '));
  }
  if (set.own.length) {
    lines.push('## Project skills (`ai-brain/skills/`)', '');
    for (const s of set.own) lines.push(entry(s, 'project').replace(/^## /, '### '));
  }
  if (set.missing.length) {
    for (const w of missingSkillWarnings(readLock(projectDir), set.missing)) lines.push('', `_${w}_`);
  }

  fs.mkdirSync(brainDir(projectDir), { recursive: true });
  fs.writeFileSync(path.join(brainDir(projectDir), CATALOG_FILE), `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`, 'utf8');
  return set;
}

/**
 * Skills for a task, chosen only among the project's skills: close matches
 * within the token budget, formatted like `gaw use`. Returns the same shape as
 * SkillOrchestrator.loadSkillsForTask.
 */
export async function loadProjectSkillsForTask(projectDir, libraryRegistry, taskPrompt, options = {}) {
  const set = await projectSkillSet(projectDir, libraryRegistry);
  const orchestrator = new SkillOrchestrator(set);
  return orchestrator.loadSkillsForTask(taskPrompt, {}, options);
}

// ---------- Reading ai-brain files ----------

function sectionText(markdown, headingRe) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(l => /^##\s/.test(l) && headingRe.test(l));
  if (start === -1) return '';
  const end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n').trim();
}

/** Placeholder text of the goal section: layout 1 ("Product Overview") and layout 2 ("Project Goal"). */
export const GOAL_PLACEHOLDERS = [
  'Add an overview of what the application does, its target audience, and primary user flows.',
  '_Not written yet: one or two sentences on what this project does and for whom._'
];

function readProjectGoal(projectDir) {
  const file = path.join(brainDir(projectDir), 'context.md');
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  const goal = sectionText(text, /project goal/i) || sectionText(text, /product overview/i);
  return goal && !GOAL_PLACEHOLDERS.some(p => goal.startsWith(p.slice(0, 30))) ? goal : null;
}

/** Packs added to the project (from lockfile tags) and packs that fit it but aren't added yet. */
function projectPacks(dir, info, lock, goal) {
  const added = [...new Set(lock.skills.flatMap(s => s.packs || []))].sort();
  const suggested = detectPacks(loadPacks(), info, { projectDir: dir, goal: goal || '' })
    .filter(p => !added.includes(p.pack.name))
    .map(p => ({ name: p.pack.name, title: p.pack.title, reasons: p.reasons }));
  return { added, suggested };
}

/** The first of these project-relative paths that exists, or null. */
function existing(dir, ...relPaths) {
  return relPaths.find(p => fs.existsSync(path.join(dir, p))) || null;
}

function readProjectRules(projectDir) {
  const file = path.join(brainDir(projectDir), 'rules.md');
  if (!fs.existsSync(file)) return [];
  return sectionText(fs.readFileSync(file, 'utf8'), /project-specific rules/i)
    .split('\n')
    .filter(l => /^\s*-\s+/.test(l))
    .map(l => l.replace(/^\s*-\s+/, '').trim());
}

/**
 * Everything GAW knows about a project, validated, in one object. Used by
 * `gaw context`, the MCP server (get_project_context) and the agent adapters.
 */
export async function loadProjectContext(projectDir, options = {}) {
  const dir = path.resolve(projectDir);
  const libraryRegistry = options.registry || new SkillRegistry({ user: true });
  const info = ProjectDetector.detect(dir);
  const initialized = fs.existsSync(brainDir(dir));
  const warnings = [];

  const lock = readLock(dir);
  if (lock.invalid) warnings.push(`ai-brain/${LOCK_FILE} is not valid JSON; no skills are selected until it is fixed.`);
  const set = await projectSkillSet(dir, libraryRegistry);
  warnings.push(...missingSkillWarnings(lock, set.missing));
  if (!initialized) warnings.push('No ai-brain/ folder: run `gaw init` in this project.');
  const overrides = initialized ? GLOBAL_PREFERENCE_FILES.filter(f => fs.existsSync(path.join(brainDir(dir), f))) : [];
  if (overrides.length) {
    warnings.push(`These project files override your Global Brain here: ${overrides.map(f => `ai-brain/${f}`).join(', ')}. Run \`gaw update\` to remove unchanged copies.`);
  }
  const brain = initialized ? readBrainJson(dir) : null;
  if (initialized && !brain) warnings.push('ai-brain/ uses the old layout (no brain.json). Run `gaw update` to move to the current one; your edits are kept.');

  // The current task counts only while active; a finished or stale one must not steer agents
  const task = initialized ? readActiveTask(dir) : null;
  const activeTask = task && task.status === 'active' ? task : null;
  if (task && task.status !== 'active') warnings.push(`${task.file} has status "${task.status}": it is ignored. Run \`gaw task done\` to archive it.`);

  const graph = GraphifyManager.locateGraph(dir);
  const describe = (s) => ({
    id: s.id,
    name: s.name,
    summary: s.contract?.summary || s.description,
    reason: s.selection?.reason || null,
    version: s.selection?.version || s.version,
    tokens: s.tokenEstimate ?? null,
    trust: trustLevel(s),
    permissions: s.contract?.permissions || [],
    path: s.filePath
  });

  return {
    version: CONTEXT_VERSION,
    project: {
      name: info.projectName,
      path: dir,
      framework: info.framework,
      languages: info.languages,
      packageManager: info.packageManager,
      uiLibraries: info.uiLibraries
    },
    initialized,
    layout: brain?.layout || (initialized ? 1 : null),
    goal: initialized ? readProjectGoal(dir) : null,
    rules: initialized ? readProjectRules(dir) : [],
    commands: brain?.project?.commands || info.commands,
    precedence: brain?.precedence || PRECEDENCE,
    files: {
      brain: existing(dir, `ai-brain/${BRAIN_JSON}`),
      context: 'ai-brain/context.md',
      rules: 'ai-brain/rules.md',
      playbook: existing(dir, 'ai-brain/playbook.md'),
      skillCatalog: existing(dir, `ai-brain/${CATALOG_FILE}`),
      design: existing(dir, 'ai-brain/design.md'),
      decisions: existing(dir, `ai-brain/${DECISIONS_DIR}`),
      proposedMemory: existing(dir, `ai-brain/${PROPOSED_MEMORY_DIR}`),
      globalBrainSummary: existing(dir, `ai-brain/${SNAPSHOT_FILE}`, `ai-brain/${LEGACY_SNAPSHOT_FILE}`)
    },
    activeTask,
    skills: {
      selected: set.selected.map(describe),
      project: set.own.map(describe)
    },
    packs: projectPacks(dir, info, lock, initialized ? readProjectGoal(dir) : null),
    graph: graph ? { available: true, json: graph.jsonPath, report: graph.reportPath } : { available: false },
    globalBrain: options.globalBrainDir || userBrainDir(),
    warnings
  };
}
