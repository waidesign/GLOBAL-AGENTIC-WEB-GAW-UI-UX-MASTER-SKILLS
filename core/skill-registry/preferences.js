/**
 * Skill preferences in the user's Global Brain (~/.gaw/brain/skill-preferences.json):
 *   pinned   skills you trust and want considered first: a small ranking boost when
 *            they already fit the task (a pin never adds a skill that doesn't fit)
 *   blocked  skills GAW never suggests to you (naming one explicitly still works)
 */
import fs from 'node:fs';
import path from 'node:path';
import { readJsonFile } from '../utils/readJson.js';
import { skillPreferencesFile } from '../memory-engine/paths.js';

export const PIN_BOOST = 1.15;

const EMPTY = () => ({ pinned: [], blocked: [] });
const uniqueSorted = (list) => [...new Set((Array.isArray(list) ? list : []).map(String))].sort();

export function readSkillPreferences(file = skillPreferencesFile()) {
  if (!file || !fs.existsSync(file)) return EMPTY();
  try {
    const data = readJsonFile(file);
    return { pinned: uniqueSorted(data.pinned), blocked: uniqueSorted(data.blocked) };
  } catch {
    return { ...EMPTY(), invalid: true };
  }
}

export function writeSkillPreferences(prefs, file = skillPreferencesFile()) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const data = { pinned: uniqueSorted(prefs.pinned), blocked: uniqueSorted(prefs.blocked) };
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return data;
}

/**
 * Change preferences. action: pin | unpin | block | unblock. Pinning a skill
 * unblocks it and blocking unpins it, so a skill is never both.
 * Returns { changed: [ids], prefs }.
 */
export function updateSkillPreferences(action, ids, file = skillPreferencesFile()) {
  const prefs = readSkillPreferences(file);
  const pinned = new Set(prefs.pinned);
  const blocked = new Set(prefs.blocked);
  const changed = [];
  for (const id of ids) {
    const before = `${pinned.has(id)}|${blocked.has(id)}`;
    if (action === 'pin') { pinned.add(id); blocked.delete(id); }
    else if (action === 'unpin') pinned.delete(id);
    else if (action === 'block') { blocked.add(id); pinned.delete(id); }
    else if (action === 'unblock') blocked.delete(id);
    else throw new Error(`Unknown preference action: ${action}`);
    if (`${pinned.has(id)}|${blocked.has(id)}` !== before) changed.push(id);
  }
  const saved = changed.length ? writeSkillPreferences({ pinned: [...pinned], blocked: [...blocked] }, file) : prefs;
  return { changed, prefs: saved };
}
