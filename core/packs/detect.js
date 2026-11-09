/** Pack definitions and detection (no project files are written here). See packs.js. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PACKS_DIR = path.resolve(__dirname, '../../packs');

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Problems in one pack definition (empty when valid). Skill names are checked when `knownSkills` is given. */
export function validatePack(pack, knownSkills = null) {
  const problems = [];
  if (!pack || typeof pack !== 'object') return ['not a JSON object'];
  if (!NAME.test(pack.name || '')) problems.push('"name" must be lowercase letters, digits and hyphens');
  if (!pack.title) problems.push('missing "title"');
  if (!pack.description) problems.push('missing "description"');
  const signals = pack.signals || {};
  if (!signals.always && !['dependencies', 'dependencyPrefixes', 'files', 'goalWords'].some(k => (signals[k] || []).length)) {
    problems.push('"signals" needs at least one of always, dependencies, dependencyPrefixes, files, goalWords');
  }
  const names = [...(pack.skills || []), ...(pack.when || []).flatMap(w => w.skills || [])];
  if (!names.length && !pack.fromGroup) problems.push('no skills');
  if (knownSkills) for (const n of names) if (!knownSkills.has(n)) problems.push(`unknown skill "${n}"`);
  return problems;
}

/** All packs in `dir` (default: GAW's packs/), sorted by name. Invalid files are skipped with a warning. */
export function loadPacks(dir = PACKS_DIR) {
  if (!fs.existsSync(dir)) return [];
  const packs = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    try {
      const pack = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8').replace(/^﻿/, ''));
      if (validatePack(pack).length === 0) packs.push(pack);
    } catch { /* invalid JSON: skipped; tests check every shipped pack */ }
  }
  return packs;
}

const deps = (info) => new Set((info.dependencies || []).map(d => String(d).toLowerCase()));

/** Why a pack fits this project (one reason per signal that matched); [] when it doesn't. */
export function packReasons(pack, info, { projectDir = info.projectPath, goal = '' } = {}) {
  if (pack.requires?.hasUi && !info.hasUi) return [];
  const s = pack.signals || {};
  const installed = deps(info);
  const reasons = [];

  const byName = (s.dependencies || []).filter(d => installed.has(d.toLowerCase()));
  const byPrefix = [...installed].filter(d => (s.dependencyPrefixes || []).some(p => d.startsWith(p.toLowerCase())));
  const packages = [...new Set([...byName, ...byPrefix])];
  if (packages.length) reasons.push(`${packages.slice(0, 3).join(', ')} ${packages.length > 1 ? 'are' : 'is'} in package.json`);

  const files = (s.files || []).filter(f => projectDir && fs.existsSync(path.join(projectDir, f)));
  if (files.length) reasons.push(`${files.join(', ')} found`);

  const text = String(goal || '').toLowerCase();
  const words = (s.goalWords || []).filter(w => new RegExp(`(^|[^a-z0-9])${w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(text));
  if (words.length) reasons.push(`the goal mentions "${words.slice(0, 2).join('", "')}"`);

  if (!reasons.length && s.always) reasons.push(pack.requires?.hasUi ? 'the project has a user interface' : 'fits every project');
  return reasons;
}

/** The packs that fit a project: [{ pack, reasons }]. */
export function detectPacks(packs, info, options = {}) {
  return packs.map(pack => ({ pack, reasons: packReasons(pack, info, options) })).filter(p => p.reasons.length);
}
