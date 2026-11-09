/**
 * Skill packs: small, curated sets of library skills for one kind of work (UI,
 * motion, marketing, design system). `gaw init` offers the packs that fit the
 * project, judged from its dependencies, files and goal, instead of guessing
 * skills from keywords. Adding a pack records its skills in ai-brain/skills.lock.json,
 * tagged with the pack, so removing it later takes out only what it added.
 *
 * Pack file (packs/<name>.json):
 *   name, title, description
 *   requires: { hasUi?: true }                         all must hold
 *   signals:  { always?, dependencies?, dependencyPrefixes?, files?, goalWords? }   any one fits
 *   skills:   [skill names]                            always added
 *   when:     [{ dependencies: [...], skills: [...] }] added when one of those packages is installed
 *   fromGroup: "animation-library"                     add the group's skill whose package is installed
 */
import { readLock, writeLock, selectSkills } from '../project-context/ProjectContext.js';
export { PACKS_DIR, validatePack, loadPacks, packReasons, detectPacks } from './detect.js';

const deps = (info) => new Set((info.dependencies || []).map(d => String(d).toLowerCase()));

/**
 * The skills a pack adds to this project, in order, each with why:
 * [{ id, reason }]. Skills missing from the library are left out and listed in `missing`.
 */
export async function packSkills(pack, info, registry) {
  const installed = deps(info);
  const out = [];
  const missing = [];
  const add = async (id, reason) => {
    if (out.some(s => s.id === id)) return;
    if (await registry.getSkill(id)) out.push({ id, reason });
    else missing.push(id);
  };

  for (const id of pack.skills || []) await add(id, `Pack "${pack.name}"`);
  for (const rule of pack.when || []) {
    const hit = (rule.dependencies || []).find(d => installed.has(d.toLowerCase()));
    if (hit) for (const id of rule.skills || []) await add(id, `Pack "${pack.name}": ${hit} is installed`);
  }
  if (pack.fromGroup) {
    const all = await registry.getAllSkills();
    for (const skill of all) {
      if (skill.contract?.exclusiveGroup !== pack.fromGroup) continue;
      const hit = (skill.contract?.packages || []).find(p => installed.has(p.toLowerCase()));
      if (hit) await add(skill.id, `Pack "${pack.name}": ${hit} is installed`);
    }
  }
  return { skills: out, missing };
}

/** Names of packs added to this project (from the lockfile's pack tags). */
export function addedPacks(projectDir) {
  return [...new Set(readLock(projectDir).skills.flatMap(s => s.packs || []))].sort();
}

/**
 * Add a pack's skills to the project. Skills someone selected by hand are left
 * as they are (a pack never claims them). Returns { added, tagged, already, missing }.
 */
export async function addPack(projectDir, registry, pack, info) {
  const { skills, missing } = await packSkills(pack, info, registry);
  const result = { added: [], tagged: [], already: [], missing };
  for (const { id, reason } of skills) {
    const existing = readLock(projectDir).skills.find(s => s.id === id);
    if (!existing) {
      const res = await selectSkills(projectDir, registry, [id], reason, { packs: [pack.name] });
      if (res.added.length) result.added.push(id);
      continue;
    }
    if (!existing.packs) { result.already.push(id); continue; } // chosen by hand: not the pack's to manage
    if (existing.packs.includes(pack.name)) { result.already.push(id); continue; }
    const lock = readLock(projectDir);
    lock.skills = lock.skills.map(s => (s.id === id ? { ...s, packs: [...s.packs, pack.name] } : s));
    writeLock(projectDir, lock);
    result.tagged.push(id);
  }
  return result;
}

/**
 * Remove a pack: its tag comes off every skill, and skills no other pack (and no
 * person) chose are deselected. Returns { removed, kept }.
 */
export function removePack(projectDir, name) {
  const lock = readLock(projectDir);
  const removed = [];
  const kept = [];
  const skills = [];
  for (const s of lock.skills) {
    if (!s.packs?.includes(name)) { skills.push(s); continue; }
    const others = s.packs.filter(p => p !== name);
    if (others.length) {
      // Keep the reason honest: it now stays because of another pack
      const reason = s.reason?.startsWith(`Pack "${name}"`) ? `Pack "${others[0]}"` : s.reason;
      skills.push({ ...s, reason, packs: others });
      kept.push(s.id);
    } else {
      removed.push(s.id);
    }
  }
  if (removed.length || kept.length) writeLock(projectDir, { ...lock, skills });
  return { removed, kept };
}
