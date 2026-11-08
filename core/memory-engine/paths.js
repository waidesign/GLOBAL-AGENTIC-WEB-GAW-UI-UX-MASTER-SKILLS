import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../');

/**
 * GAW's per-user data folder. Defaults to ~/.gaw; set GAW_HOME to move it,
 * for example into a synced folder (Dropbox, OneDrive, a git repo) to share
 * one Global Brain across machines.
 */
export function gawHome() {
  return process.env.GAW_HOME ? path.resolve(process.env.GAW_HOME) : path.join(os.homedir(), '.gaw');
}

/** The user's Global Brain: cross-project preferences and decisions. */
export function userBrainDir() {
  return path.join(gawHome(), 'brain');
}

/**
 * The user's personal skill library: skills added with `gaw skills add`. It lives
 * outside GAW's own folder, so GAW updates never touch it and it never ends up
 * in GAW's repository. Every project on this machine can use it.
 */
export function userSkillsDir() {
  return path.join(gawHome(), 'skills');
}

/** Pinned and blocked skills (gaw skills pin / block), part of the Global Brain. */
export function skillPreferencesFile() {
  return path.join(userBrainDir(), 'skill-preferences.json');
}

/** Default Global Brain files shipped with GAW, copied into new users' brains. */
export const DEFAULT_BRAIN_DIR = path.join(REPO_ROOT, 'brain');
