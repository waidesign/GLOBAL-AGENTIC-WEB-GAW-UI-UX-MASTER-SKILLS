#!/usr/bin/env node
/**
 * One-time migration of the skill library to the GAW Skill Standard (GSS).
 *
 *   node scripts/gss/migrate-to-gss.mjs --dry-run   # show the plan, change nothing
 *   node scripts/gss/migrate-to-gss.mjs --recover   # also recover lost descriptions from GitHub
 *
 * For each legacy skills/<category>/<id>.md it writes skills/<category>/<id>/SKILL.md
 * (standard Agent Skills frontmatter + gaw- metadata) and gaw.json, then removes the
 * old file. Applies scripts/gss/category-fixes.json and keywords.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, stringifyFrontmatter } from '../../core/skill-registry/frontmatter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const recover = args.includes('--recover');

const { fixes: CATEGORY_FIXES } = JSON.parse(fs.readFileSync(path.join(__dirname, 'category-fixes.json'), 'utf8'));
const { keywords: KEYWORDS } = JSON.parse(fs.readFileSync(path.join(__dirname, 'keywords.json'), 'utf8'));

// Repositories the old importer pulled from (scripts/ingest-skills-sh.mjs)
const SOURCE_REPOS = [
  'vercel-labs/agent-skills', 'anthropics/skills', 'mattpocock/skills', 'supabase/agent-skills',
  'remotion-dev/skills', 'microsoft/azure-skills', 'google/agents-cli', 'designed-by-ai/skills',
  'heygen-com/hyperframes', 'gencraft-labs/skills', 'leonxlnx/taste-skill'
];

const PLACEHOLDER_DESCRIPTIONS = new Set(['>', '>-', '>+', '|', '|-', '|+']);
const isPlaceholder = (d) => !d || PLACEHOLDER_DESCRIPTIONS.has(String(d).trim());

const oneLine = (text) => String(text || '').replace(/\s+/g, ' ').trim();

/** Trim to max length at a sentence or word boundary. */
function clip(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > max * 0.5) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Fallback description: the first prose paragraph of the skill body. */
function deriveDescription(body, title) {
  const paragraphs = body.split(/\n\s*\n/).map(p => p.trim());
  for (const p of paragraphs) {
    if (!p || p.startsWith('#') || p.startsWith('```') || p.startsWith('|') || p.startsWith('<') || p.startsWith('-') || p.startsWith('>')) continue;
    const text = oneLine(p.replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
    if (text.length >= 30) return clip(text, 300);
  }
  return `${title} skill.`;
}

/** Map skill name -> { repo, path } for every SKILL.md in the source repos (one API call per repo). */
async function fetchSourceIndex() {
  const index = new Map();
  for (const fullRepo of SOURCE_REPOS) {
    const [owner, repo] = fullRepo.split('/');
    for (const branch of ['main', 'master']) {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
          headers: { 'User-Agent': 'GAW-GSS-Migration' }
        });
        if (!res.ok) continue;
        const data = await res.json();
        for (const item of data.tree || []) {
          if (item.type !== 'blob' || !item.path.endsWith('SKILL.md')) continue;
          const parts = item.path.split('/');
          let skillName = parts.length > 1 ? parts[parts.length - 2] : repo;
          if (['skills', 'src', '.'].includes(skillName)) skillName = repo;
          const id = skillName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          if (!index.has(id)) index.set(id, { repo: fullRepo, branch, path: item.path });
        }
        break;
      } catch {
        // network problem: skip this repo
      }
    }
  }
  return index;
}

async function fetchUpstream(source) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${source.repo}/${source.branch}/${source.path}`);
    if (!res.ok) return null;
    return parseFrontmatter(await res.text()).data;
  } catch {
    return null;
  }
}

function listLegacySkills() {
  const files = [];
  for (const category of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    for (const entry of fs.readdirSync(path.join(SKILLS_DIR, category.name), { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push({ category: category.name, file: path.join(SKILLS_DIR, category.name, entry.name) });
      }
    }
  }
  return files;
}

async function main() {
  const legacy = listLegacySkills();
  console.log(`${dryRun ? '[dry run] ' : ''}Migrating ${legacy.length} legacy skill files to GSS...`);

  const sourceIndex = recover ? await fetchSourceIndex() : new Map();
  if (recover) console.log(`Found ${sourceIndex.size} SKILL.md files in ${SOURCE_REPOS.length} source repos.`);

  const stats = { migrated: 0, recovered: 0, derived: 0, recategorized: 0, keywords: 0, withSource: 0 };
  const report = [];

  for (const { category: folderCategory, file } of legacy) {
    const { data, content } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
    const id = data.id || path.basename(file, '.md');
    const oldCategory = data.category || folderCategory;
    const category = CATEGORY_FIXES[id] || oldCategory;
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const imported = tags.includes('skills.sh');
    const title = data.name && data.name !== id ? data.name : undefined;

    const source = sourceIndex.get(id);
    let description = data.description;
    let descriptionNote = '';

    if (isPlaceholder(description)) {
      const upstream = source ? await fetchUpstream(source) : null;
      if (upstream && !isPlaceholder(upstream.description)) {
        description = upstream.description;
        descriptionNote = `recovered from ${source.repo}`;
        stats.recovered++;
      } else {
        description = deriveDescription(content, title || id);
        descriptionNote = 'derived from skill text';
        stats.derived++;
      }
    }
    description = clip(oneLine(description), 1024);

    const frontmatter = {
      name: id,
      description,
      license: data.license,
      metadata: {
        'gaw-title': title,
        'gaw-category': category,
        'gaw-author': data.author,
        'gaw-version': data.version,
        'gaw-tags': tags.filter(t => t !== id && t !== oldCategory && t !== category && t !== 'skills.sh').join(', ')
      }
    };

    const contract = { gss: 1 };
    if (KEYWORDS[id]) {
      contract.keywords = KEYWORDS[id];
      stats.keywords++;
    }
    if (Array.isArray(data.dependencies) && data.dependencies.length) contract.dependsOn = data.dependencies;
    if (Array.isArray(data.relatedSkills) && data.relatedSkills.length) contract.related = data.relatedSkills;
    if (Array.isArray(data.frameworks) && data.frameworks.length && !(data.frameworks.length === 1 && data.frameworks[0] === 'any')) {
      contract.frameworks = data.frameworks;
    }
    if (data.lastVerified) contract.lastVerified = data.lastVerified;
    if (imported) {
      contract.source = source
        ? { repo: source.repo, path: source.path, licenseVerified: false }
        : { licenseVerified: false };
      if (source) stats.withSource++;
    }

    if (category !== oldCategory) stats.recategorized++;
    report.push({ id, from: oldCategory, to: category, descriptionNote });

    const targetDir = path.join(SKILLS_DIR, category, id);
    if (!dryRun) {
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'SKILL.md'), stringifyFrontmatter(frontmatter, content), 'utf8');
      fs.writeFileSync(path.join(targetDir, 'gaw.json'), `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
      fs.unlinkSync(file);
    }
    stats.migrated++;
  }

  // Remove category folders left empty by recategorization
  if (!dryRun) {
    for (const category of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
      const dir = path.join(SKILLS_DIR, category.name);
      if (category.isDirectory() && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    }
  }

  for (const r of report.filter(r => r.descriptionNote)) console.log(`  description ${r.descriptionNote}: ${r.id}`);
  console.log(`\nMigrated ${stats.migrated} skills: ${stats.recovered} descriptions recovered, ${stats.derived} derived, ` +
    `${stats.recategorized} recategorized, ${stats.keywords} with keywords, ${stats.withSource} with a known source.`);
  if (dryRun) console.log('Dry run: no files were changed.');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
