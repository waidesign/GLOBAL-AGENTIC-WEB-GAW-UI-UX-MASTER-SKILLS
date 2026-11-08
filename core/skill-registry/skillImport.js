/**
 * Turn any skill into a GSS skill: from a GitHub link, a local skill folder,
 * or a single markdown file. Used by `gaw skills add` and the bulk importer.
 *
 *   const prepared = await prepareSkill(source)   // read + inspect, writes nothing
 *   const preview  = previewSkill(prepared, opts) // what will be written
 *   await installSkill(prepared, preview)         // write folder, license, split
 */
import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.js';
import { parseGitHubUrl } from './github.js';
import { resolveSkillLicense, normalizeLicense, licenseCategory } from './licenses.js';
import { convertToGss, planSplit, applySplit, canModify, writeSkillFolder, toSkillName } from './gss.js';
import { enrichContract, rankabilityLevel } from './rankability.js';

export const SUPPORT_LIMITS = { maxFileBytes: 512 * 1024, maxFiles: 300, maxTotalBytes: 10 * 1024 * 1024 };
const DOWNLOAD_CONCURRENCY = 8;
const SKIP_PARTS = (rel) => rel.split('/').some(seg => seg === '..' || seg.startsWith('.') || seg === 'node_modules');

/** Pick a library category from whole words (no substring guesses like "aria" in "variables"). */
export function guessCategory(text) {
  const words = new Set(String(text || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const has = (...terms) => terms.some(t => (t.endsWith('*')
    ? [...words].some(w => w.startsWith(t.slice(0, -1)))
    : words.has(t)));

  if (has('docx', 'pptx', 'xlsx', 'pdf', 'spreadsheet', 'powerpoint')) return 'documents';
  if (has('video', 'remotion', 'hyperframes', 'audio', 'music', 'image', 'images')) return 'media-creative';
  if (has('azure', 'aks', 'kubernetes', 'cloud', 'deploy*', 'docker', 'infra*', 'vercel')) return 'cloud-infra';
  if (has('postgres', 'database', 'supabase', 'sql', 'prisma')) return 'database';
  if (has('accessibility', 'accessible', 'wcag', 'aria', 'a11y')) return 'accessibility';
  if (has('tokens', 'shadcn', 'radix') || (has('design') && has('system', 'systems'))) return 'design-systems';
  if (has('animation*', 'motion', 'framer', 'animejs')) return 'animation-motion';
  if (has('test', 'tests', 'testing', 'tdd', 'vitest', 'jest', 'playwright', 'cypress')) return 'testing';
  if (has('debug*', 'bug', 'bugs', 'diagnos*', 'troubleshoot*')) return 'debugging';
  if (has('lint', 'linting', 'guardrail*', 'pre-commit') || (has('code') && has('review'))) return 'code-quality';
  if (has('architecture', 'architect', 'spec', 'tickets')) return 'architecture';
  if (has('react', 'nextjs', 'vue', 'svelte', 'tailwind', 'css', 'frontend')) return 'frontend';
  if (has('ui', 'ux', 'landing', 'layout', 'website', 'mobile')) return 'ui-ux';
  if (has('agent', 'agents', 'handoff', 'workflow', 'triage', 'prompt')) return 'workflow';
  return 'general';
}

/**
 * What a skill can do beyond giving instructions, so users see it before installing:
 * "shell" when it ships hooks, pre-approves shell tools, or includes scripts.
 */
export function detectPermissions(prepared) {
  const permissions = new Set(prepared.existingContract?.permissions || []);
  const tools = String(prepared.data['allowed-tools'] || '');
  const hasScripts = prepared.files.some(f => /^scripts\//.test(f.rel) || /\.(sh|ps1|bat|py|mjs|cjs|js|ts)$/.test(f.rel));
  if (prepared.data.hooks || /\bBash\b|\bshell\b/i.test(tools) || hasScripts) permissions.add('shell');
  return [...permissions];
}

/** Choose which supporting files to bring along, within size and count limits. */
function selectSupportFiles(files, limits = SUPPORT_LIMITS) {
  const selected = [];
  let total = 0;
  let skipped = 0;
  for (const f of files) {
    if (SKIP_PARTS(f.rel) || f.size > limits.maxFileBytes) { skipped++; continue; }
    if (selected.length >= limits.maxFiles || total + f.size > limits.maxTotalBytes) { skipped++; continue; }
    selected.push(f);
    total += f.size;
  }
  return { selected, skipped, totalBytes: total };
}

async function readFromGitHub(github, ref) {
  const tree = await github.tree(ref.repo);
  if (!tree) throw new Error(`Could not read ${ref.repo} on GitHub (missing, private, or rate limited).`);
  const skillFiles = tree.blobs.filter(b => b.path === 'SKILL.md' || b.path.endsWith('/SKILL.md'));

  let blob;
  if (ref.path) blob = skillFiles.find(b => b.path === `${ref.path}/SKILL.md`);
  else if (skillFiles.length === 1) blob = skillFiles[0];
  else blob = skillFiles.find(b => b.path === 'SKILL.md');

  if (!blob) {
    const options = skillFiles.slice(0, 15).map(b => `  https://github.com/${ref.repo}/tree/${tree.branch}/${b.path.replace(/\/?SKILL\.md$/, '')}`);
    throw new Error(skillFiles.length
      ? `${ref.repo} has ${skillFiles.length} skills. Add one of them:\n${options.join('\n')}`
      : `No SKILL.md found in ${ref.repo}${ref.path ? `/${ref.path}` : ''}.`);
  }

  const dir = blob.path.includes('/') ? blob.path.slice(0, blob.path.lastIndexOf('/')) : '';
  const text = await github.raw(ref.repo, tree.branch, blob.path);
  if (text === null) throw new Error(`Could not download ${blob.path} from ${ref.repo}.`);
  const { data, content, raw } = parseFrontmatter(text);

  // Only files inside the skill's own folder (a repo-root skill brings no extras)
  const files = dir
    ? tree.blobs.filter(b => b.path.startsWith(`${dir}/`) && b.path !== blob.path).map(b => ({ rel: b.path.slice(dir.length + 1), size: b.size, remote: b.path }))
    : [];
  const license = await resolveSkillLicense(github, { repo: ref.repo, path: blob.path }, data);

  return {
    origin: `https://github.com/${ref.repo}/tree/${tree.branch}/${dir}`,
    data,
    raw,
    content,
    nameHint: dir ? dir.split('/').pop() : ref.repo.split('/')[1],
    source: { repo: ref.repo, path: blob.path },
    license,
    files,
    readFile: (f) => github.raw(ref.repo, tree.branch, f.remote, { binary: true })
  };
}

function readFromLocal(target) {
  const full = path.resolve(target);
  if (!fs.existsSync(full)) throw new Error(`Not found: ${target}`);

  const stat = fs.statSync(full);
  let skillFile = full;
  let dir = null;
  if (stat.isDirectory()) {
    skillFile = path.join(full, 'SKILL.md');
    if (!fs.existsSync(skillFile)) throw new Error(`No SKILL.md in ${target}. Point to a skill folder or a .md file.`);
    dir = full;
  } else if (!full.endsWith('.md')) {
    throw new Error('Skills are markdown: point to a .md file or a folder containing SKILL.md.');
  }

  const { data, content, raw } = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
  let existingContract = null;
  const files = [];
  if (dir) {
    const contractFile = path.join(dir, 'gaw.json');
    if (fs.existsSync(contractFile)) {
      try { existingContract = readJsonFile(contractFile); } catch { /* ignored; rebuilt */ }
    }
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        const rel = path.relative(dir, p).replace(/\\/g, '/');
        if (e.isDirectory()) walk(p);
        else if (rel !== 'SKILL.md' && rel !== 'gaw.json') files.push({ rel, size: fs.statSync(p).size, local: p });
      }
    };
    walk(dir);
  }

  const spdx = normalizeLicense(data.license);
  return {
    origin: full,
    data,
    raw,
    content,
    existingContract,
    // A folder's name is the skill name (Agent Skills rule); a lone file uses its declared name
    nameHint: dir
      ? path.basename(dir)
      : (typeof data.name === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.name) ? data.name : path.basename(full, '.md')),
    source: null,
    license: { spdx, category: licenseCategory(spdx), evidence: spdx ? 'declared in the skill' : 'no license declared', url: null },
    files,
    readFile: (f) => fs.readFileSync(f.local)
  };
}

/** Read and inspect a skill from a GitHub link, folder or .md file. Writes nothing. */
export async function prepareSkill(target, { github } = {}) {
  const ref = parseGitHubUrl(target);
  if (ref) {
    if (!github) throw new Error('A GitHub client is required for GitHub links.');
    return readFromGitHub(github, ref);
  }
  return readFromLocal(target);
}

/**
 * Work out exactly what will be written: GSS frontmatter and contract, target
 * folder, files to copy, and whether the skill will be split.
 * options: { root, category, name, flat }
 */
export function previewSkill(prepared, options = {}) {
  const declared = (typeof prepared.data.category === 'string' && prepared.data.category)
    || prepared.data.metadata?.['gaw-category'];
  const category = options.category || declared
    || guessCategory(`${prepared.nameHint} ${prepared.data.name || ''} ${prepared.data.description || ''}`);
  const categorySource = options.category ? 'chosen' : declared ? 'from the skill' : 'guessed';
  const nameHint = options.name || prepared.nameHint;
  const converted = convertToGss({
    data: options.name ? { ...prepared.data, name: toSkillName(options.name), id: undefined } : prepared.data,
    content: prepared.content,
    nameHint,
    category,
    existingContract: prepared.existingContract,
    raw: prepared.raw || {}
  });

  const { license } = prepared;
  converted.data.license = license.spdx || converted.data.license || 'UNKNOWN';
  if (prepared.source) {
    converted.contract.source = {
      ...prepared.source,
      licenseVerified: Boolean(license.spdx),
      licenseStatus: license.category,
      licenseEvidence: license.evidence,
      licenseUrl: license.url,
      licenseCheckedAt: new Date().toISOString().split('T')[0]
    };
  }

  const permissions = detectPermissions(prepared);
  if (permissions.length) converted.contract.permissions = permissions;

  // Author-supplied when-to-use (gaw skills add --when) counts as written by the author
  if (options.when) converted.contract.whenToUse = [String(options.when)];

  // GSS Ranking v1: fill ranking fields from the skill's own text, then grade it
  const asSkill = {
    id: converted.data.name,
    name: converted.data.metadata['gaw-title'] || converted.data.name,
    description: converted.data.description,
    category,
    tags: String(converted.data.metadata['gaw-tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
    content: prepared.content,
    contract: converted.contract
  };
  converted.contract = enrichContract(asSkill).contract;
  const rank = rankabilityLevel({ ...asSkill, contract: converted.contract });

  const name = converted.data.name;
  const dir = options.flat ? path.join(options.root, name) : path.join(options.root, category, name);
  const support = selectSupportFiles(prepared.files);
  const plan = planSplit(prepared.content, { skillName: name });
  // Restructuring someone else's skill needs a license that allows changes
  const mayModify = canModify(license.category);

  const warnings = [...converted.warnings];
  if (license.category === 'unknown') warnings.push(`No license found${prepared.source ? ' at the source' : ''}: get the author's permission before sharing this skill.`);
  if (license.category === 'restricted') warnings.push('The license is restricted: this skill may not be redistributed without permission.');
  if (permissions.includes('shell')) warnings.push('This skill can run commands on your computer (hooks or scripts). Review them before use.');
  if (support.skipped) warnings.push(`${support.skipped} supporting file(s) were not copied (hidden, too large, or over the limit of ${SUPPORT_LIMITS.maxFiles} files / ${SUPPORT_LIMITS.maxTotalBytes / 1024 / 1024} MB).`);
  if (plan && !mayModify) warnings.push(`The skill is ~${plan.before} tokens (over the 5000 guideline) but its license doesn't clearly allow changes, so it was not split.`);

  return {
    name,
    category,
    categorySource,
    level: rank.level,
    levelName: rank.name,
    levelMissing: rank.missing,
    dir,
    data: converted.data,
    contract: converted.contract,
    content: prepared.content,
    support,
    split: plan && mayModify ? plan : null,
    oversizedNotSplit: Boolean(plan && !mayModify),
    warnings
  };
}

async function runPool(items, worker, size) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) await worker(items[next++]);
  }));
}

/**
 * Supporting files an imported skill is missing compared with its source folder
 * on GitHub (skills imported before files were copied). Never includes files that
 * already exist locally. Returns { files, skipped, totalBytes } or null without a source.
 */
// Text files skill instructions refer to (scripts, docs, templates, config). Binary assets
// (fonts, images, archives) are left at the source unless asked for, to keep GAW small.
const TEXT_FILE = /\.(md|markdown|txt|py|js|mjs|cjs|ts|tsx|jsx|sh|bash|ps1|bat|json|jsonc|yaml|yml|toml|ini|cfg|xml|xsd|html|htm|css|scss|svg|csv|tsv|sql|graphql|rb|go|rs|java|kt|swift|php|r|lua|tex|env|example|template|tmpl|j2|ejs|hbs|liquid)$|(^|\/)(LICENSE|NOTICE|README|Makefile|Dockerfile)[^/]*$/i;
export const isTextFile = (rel) => TEXT_FILE.test(rel);

export async function findMissingSupportFiles(github, skill, options = {}) {
  const source = skill.contract?.source;
  if (!source?.repo || !source.path) return null;
  const tree = await github.tree(source.repo);
  if (!tree) return null;
  const dir = source.path.includes('/') ? source.path.slice(0, source.path.lastIndexOf('/')) : '';
  if (!dir) return { files: [], skipped: 0, totalBytes: 0, branch: tree.branch };

  const all = tree.blobs
    .filter(b => b.path.startsWith(`${dir}/`) && b.path !== source.path)
    .map(b => ({ rel: b.path.slice(dir.length + 1), size: b.size, remote: b.path }))
    .filter(f => !fs.existsSync(path.join(skill.dir, f.rel)));
  const candidates = options.includeBinary ? all : all.filter(f => isTextFile(f.rel));
  const { selected, skipped, totalBytes } = selectSupportFiles(candidates);
  return { files: selected, skipped, binaryLeftAtSource: all.length - candidates.length, totalBytes, branch: tree.branch };
}

/**
 * Download missing supporting files into a skill folder, and note in gaw.json how
 * many binary files stayed at the source. Returns the number written.
 */
export async function restoreSupportFiles(github, skill, missing) {
  let written = 0;
  if (missing.binaryLeftAtSource) {
    const contractFile = path.join(skill.dir, 'gaw.json');
    const contract = fs.existsSync(contractFile) ? readJsonFile(contractFile) : { gss: 1 };
    contract.source = { ...(contract.source || {}), filesLeftAtSource: missing.binaryLeftAtSource };
    fs.writeFileSync(contractFile, `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
  }
  await runPool(missing.files, async (file) => {
    const bytes = await github.raw(skill.contract.source.repo, missing.branch, file.remote, { binary: true });
    if (!bytes) return;
    const dest = path.join(skill.dir, file.rel);
    if (fs.existsSync(dest)) return;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, bytes);
    written++;
  }, DOWNLOAD_CONCURRENCY);
  return written;
}

/** Write the previewed skill to disk: supporting files, SKILL.md, gaw.json, then split. */
export async function installSkill(prepared, preview) {
  let copied = 0;
  await runPool(preview.support.selected, async (file) => {
    const bytes = await prepared.readFile(file);
    if (bytes === null || bytes === undefined) return;
    const dest = path.join(preview.dir, file.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, bytes);
    copied++;
  }, DOWNLOAD_CONCURRENCY);

  writeSkillFolder(preview.dir, { data: preview.data, content: preview.content, contract: preview.contract });
  if (preview.split) applySplit(preview.dir, preview.split);
  return { dir: preview.dir, copied };
}
