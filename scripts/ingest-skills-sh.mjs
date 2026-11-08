#!/usr/bin/env node
/**
 * Import Agent Skills from GitHub repositories into the GAW library as
 * GAW Skill Standard (GSS) folders (see docs/gss/spec.md).
 *
 *   node scripts/ingest-skills-sh.mjs                      # all target repos
 *   node scripts/ingest-skills-sh.mjs --repo owner/name    # one repo
 *   node scripts/ingest-skills-sh.mjs --out ./tmp-skills   # write somewhere else (for testing)
 *   node scripts/ingest-skills-sh.mjs --no-files           # SKILL.md and gaw.json only
 *
 * Keeps each skill's original description and license, copies its supporting
 * files (references/, scripts/, assets/), and records the source in gaw.json.
 * Afterwards run: gaw skills lint && gaw skills index
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, stringifyFrontmatter } from '../core/skill-registry/frontmatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');

const args = process.argv.slice(2);
const argValue = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const SKILLS_DIR = path.resolve(argValue('--out') || path.join(REPO_ROOT, 'skills'));

// Target repositories (official, curated and trending)
const TARGET_REPOSITORIES = argValue('--repo') ? [argValue('--repo')] : [
  'vercel-labs/agent-skills',
  'anthropics/skills',
  'mattpocock/skills',
  'supabase/agent-skills',
  'remotion-dev/skills',
  'microsoft/azure-skills',
  'google/agents-cli',
  'designed-by-ai/skills',
  'heygen-com/hyperframes',
  'gencraft-labs/skills',
  'leonxlnx/taste-skill'
];

// Supporting files: some skills ship hundreds of assets, so cap what one import copies
const COPY_FILES = !args.includes('--no-files');
const MAX_SUPPORT_FILE_BYTES = 512 * 1024;
const MAX_SUPPORT_FILES = 300;
const MAX_SUPPORT_TOTAL_BYTES = 10 * 1024 * 1024;
const DOWNLOAD_CONCURRENCY = 8;

/** Run async jobs with a fixed number in flight. */
async function runPool(items, worker, size) {
  let next = 0;
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  });
  await Promise.all(lanes);
}
const PLACEHOLDERS = new Set(['>', '>-', '>+', '|', '|-', '|+']);

/**
 * Pick a GAW category from whole words in the repo, path, name and description.
 * Whole-word matching avoids the old substring mistakes ("aria" in "variables").
 */
function determineCategory(repo, skillPath, skillName, desc = '') {
  const words = new Set(`${repo} ${skillPath} ${skillName} ${desc}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const has = (...terms) => terms.some(t => (t.endsWith('*')
    ? [...words].some(w => w.startsWith(t.slice(0, -1)))
    : words.has(t)));

  if (has('docx', 'pptx', 'xlsx', 'pdf', 'spreadsheet', 'powerpoint')) return 'documents';
  if (has('video', 'remotion', 'hyperframes', 'audio', 'music', 'image', 'images')) return 'media-creative';
  if (has('azure', 'aks', 'kubernetes', 'cloud', 'deploy*', 'docker', 'infra*', 'vercel')) return 'cloud-infra';
  if (has('postgres', 'database', 'supabase', 'sql', 'prisma')) return 'database';
  if (has('accessibility', 'accessible', 'wcag', 'aria', 'a11y')) return 'accessibility';
  if (has('design-system', 'tokens', 'shadcn', 'radix')) return 'design-systems';
  if (has('animation*', 'motion', 'framer', 'animejs')) return 'animation-motion';
  if (has('test', 'tests', 'testing', 'tdd', 'vitest', 'jest', 'playwright', 'cypress')) return 'testing';
  if (has('debug*', 'bug', 'bugs', 'diagnos*', 'troubleshoot*')) return 'debugging';
  if (has('review', 'lint', 'linting', 'guardrail*', 'pre-commit')) return 'code-quality';
  if (has('architecture', 'architect', 'spec', 'tickets', 'domain')) return 'architecture';
  if (has('react', 'nextjs', 'vue', 'svelte', 'tailwind', 'css', 'frontend')) return 'frontend';
  if (has('ui', 'ux', 'landing', 'layout', 'mobile')) return 'ui-ux';
  if (has('agent', 'agents', 'handoff', 'workflow', 'triage', 'prompt')) return 'workflow';
  return 'general';
}

async function fetchRepoTree(owner, repo) {
  for (const branch of ['main', 'master']) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'GAW-Skill-Ingester' } });
      if (res.ok) {
        const data = await res.json();
        const blobs = (data.tree || []).filter(item => item.type === 'blob');
        return { branch, blobs, skillBlobs: blobs.filter(item => item.path.endsWith('SKILL.md')) };
      }
    } catch {
      // try the next branch
    }
  }
  return null;
}

function skillExists(skillId) {
  if (!fs.existsSync(SKILLS_DIR)) return false;
  for (const category of fs.readdirSync(SKILLS_DIR)) {
    if (fs.existsSync(path.join(SKILLS_DIR, category, skillId, 'SKILL.md'))) return true;
    if (fs.existsSync(path.join(SKILLS_DIR, category, `${skillId}.md`))) return true;
  }
  return false;
}

async function run() {
  console.log(`🚀 GAW skill import (GSS) into ${SKILLS_DIR}`);
  console.log(`Target repositories: ${TARGET_REPOSITORIES.length}\n`);

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const fullRepo of TARGET_REPOSITORIES) {
    const [owner, repo] = fullRepo.split('/');
    console.log(`\n📦 Inspecting ${fullRepo}...`);

    const treeData = await fetchRepoTree(owner, repo);
    if (!treeData || treeData.skillBlobs.length === 0) {
      console.log(`  ⚠️ No SKILL.md found or rate limited for ${fullRepo}`);
      continue;
    }
    console.log(`  ✓ Found ${treeData.skillBlobs.length} skill files (branch: ${treeData.branch})`);

    for (const blob of treeData.skillBlobs) {
      const parts = blob.path.split('/');
      let skillName = parts.length > 1 ? parts[parts.length - 2] : repo;
      if (['skills', 'src', '.'].includes(skillName)) skillName = repo;
      const skillId = skillName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

      if (skillExists(skillId)) {
        console.log(`  ⏭️ Skipped (already exists): ${skillId}`);
        skippedCount++;
        continue;
      }

      const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${treeData.branch}/`;
      try {
        const res = await fetch(rawBase + blob.path);
        if (!res.ok) {
          errorCount++;
          continue;
        }
        const { data, content } = parseFrontmatter(await res.text());
        const description = typeof data.description === 'string' && !PLACEHOLDERS.has(data.description.trim())
          ? data.description.replace(/\s+/g, ' ').trim()
          : '';
        if (!description) {
          console.log(`  ⚠️ ${skillId}: no description upstream; add one before publishing`);
        }

        const category = determineCategory(repo, blob.path, skillId, description);
        const targetDir = path.join(SKILLS_DIR, category, skillId);
        fs.mkdirSync(targetDir, { recursive: true });

        const upstreamMeta = (data.metadata && typeof data.metadata === 'object') ? data.metadata : {};
        const frontmatter = {
          name: skillId,
          description: description || `${skillId} skill.`,
          license: data.license || 'UNKNOWN',
          compatibility: data.compatibility,
          'allowed-tools': data['allowed-tools'],
          metadata: {
            ...Object.fromEntries(Object.entries(upstreamMeta).map(([k, v]) => [k, String(v)])),
            'gaw-title': data.name && data.name !== skillId ? String(data.name) : undefined,
            'gaw-category': category,
            'gaw-author': String(data.author || upstreamMeta.author || owner),
            'gaw-version': String(upstreamMeta.version || data.version || '1.0.0')
          }
        };
        fs.writeFileSync(path.join(targetDir, 'SKILL.md'), stringifyFrontmatter(frontmatter, content), 'utf8');

        // Copy the skill's supporting files (references/, scripts/, assets/, ...), within limits
        const skillDirPath = parts.slice(0, -1).join('/');
        const candidates = COPY_FILES && skillDirPath
          ? treeData.blobs.filter(b => b.path.startsWith(`${skillDirPath}/`) && b.path !== blob.path)
          : [];
        const supportFiles = [];
        let totalBytes = 0;
        for (const file of candidates) {
          const rel = file.path.slice(skillDirPath.length + 1);
          if (rel.split('/').some(seg => seg === '..' || seg.startsWith('.'))) continue;
          if ((file.size || 0) > MAX_SUPPORT_FILE_BYTES) continue;
          if (supportFiles.length >= MAX_SUPPORT_FILES || totalBytes + (file.size || 0) > MAX_SUPPORT_TOTAL_BYTES) break;
          totalBytes += file.size || 0;
          supportFiles.push({ ...file, rel });
        }
        if (supportFiles.length < candidates.length) {
          console.log(`  ⚠️ ${skillId}: copied ${supportFiles.length} of ${candidates.length} supporting files (size/count limits). See ${fullRepo}/${skillDirPath} for the rest.`);
        }

        let copied = 0;
        await runPool(supportFiles, async (file) => {
          const fileRes = await fetch(rawBase + file.path);
          if (!fileRes.ok) return;
          const dest = path.join(targetDir, file.rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, Buffer.from(await fileRes.arrayBuffer()));
          copied++;
        }, DOWNLOAD_CONCURRENCY);

        const contract = {
          gss: 1,
          lastVerified: new Date().toISOString().split('T')[0],
          source: {
            repo: fullRepo,
            path: blob.path,
            licenseVerified: false
          }
        };
        fs.writeFileSync(path.join(targetDir, 'gaw.json'), `${JSON.stringify(contract, null, 2)}\n`, 'utf8');

        console.log(`  ★ Added [${category}] ${skillId} (license: ${frontmatter.license}, ${copied} supporting file(s))`);
        addedCount++;
      } catch (err) {
        console.error(`  ❌ Error processing ${blob.path}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Import summary:`);
  console.log(`  - Added skills:      ${addedCount}`);
  console.log(`  - Skipped (exists):  ${skippedCount}`);
  console.log(`  - Errors:            ${errorCount}`);
  console.log(`========================================`);
  console.log(`Next: review licenses, then run 'gaw skills lint' and 'gaw skills index'.\n`);
}

run().catch(console.error);
