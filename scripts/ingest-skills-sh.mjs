#!/usr/bin/env node
/**
 * Bulk-import Agent Skills from GitHub repositories into the GAW library.
 * Every skill goes through the same pipeline as `gaw skills add`: converted to
 * GSS, license checked at the source, supporting files copied (within limits),
 * split if oversized (when the license allows), and indexed.
 *
 *   node scripts/ingest-skills-sh.mjs                      # all target repos
 *   node scripts/ingest-skills-sh.mjs --repo owner/name    # one repo
 *   node scripts/ingest-skills-sh.mjs --out ./tmp-skills   # write somewhere else (for testing)
 *   node scripts/ingest-skills-sh.mjs --skip-unlicensed    # leave out skills with no license
 *
 * Set GITHUB_TOKEN for more than 60 GitHub API requests per hour.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GitHubClient } from '../core/skill-registry/github.js';
import { prepareSkill, previewSkill, installSkill } from '../core/skill-registry/skillImport.js';
import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../');

const args = process.argv.slice(2);
const argValue = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
const SKILLS_DIR = path.resolve(argValue('--out') || path.join(REPO_ROOT, 'skills'));
const skipUnlicensed = args.includes('--skip-unlicensed');

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

async function run() {
  console.log(`🚀 GAW skill import (GSS) into ${SKILLS_DIR}\n`);
  const github = new GitHubClient();
  const registry = new SkillRegistry({ skillsDir: SKILLS_DIR });
  const existing = new Set(fs.existsSync(SKILLS_DIR) ? (await registry.getAllSkills()).map(s => s.id) : []);
  const counts = { added: 0, skipped: 0, unlicensed: 0, errors: 0 };

  for (const repo of TARGET_REPOSITORIES) {
    console.log(`📦 ${repo}`);
    const tree = await github.tree(repo);
    if (!tree) {
      console.log(`  ⚠️ Could not read the repository (missing or rate limited)`);
      continue;
    }

    const skillDirs = tree.blobs
      .filter(b => b.path === 'SKILL.md' || b.path.endsWith('/SKILL.md'))
      .map(b => b.path.replace(/\/?SKILL\.md$/, ''));

    for (const dir of skillDirs) {
      const link = `https://github.com/${repo}/tree/${tree.branch}/${dir}`;
      try {
        const prepared = await prepareSkill(link, { github });
        const preview = previewSkill(prepared, { root: SKILLS_DIR });

        if (existing.has(preview.name)) {
          counts.skipped++;
          continue;
        }
        if (skipUnlicensed && prepared.license.category === 'unknown') {
          console.log(`  ⏭️ ${preview.name}: no license at the source, skipped`);
          counts.unlicensed++;
          continue;
        }

        const result = await installSkill(prepared, preview);
        existing.add(preview.name);
        counts.added++;
        const notes = [
          prepared.license.spdx || 'no license',
          result.copied ? `${result.copied} file(s)` : null,
          preview.split ? `split into ${preview.split.references.length} reference file(s)` : null
        ].filter(Boolean).join(', ');
        console.log(`  ★ [${preview.category}] ${preview.name} (${notes})`);
        for (const w of preview.warnings) console.log(`      ⚠ ${w}`);
      } catch (err) {
        console.log(`  ❌ ${dir}: ${err.message.split('\n')[0]}`);
        counts.errors++;
      }
    }
  }

  if (counts.added) new SkillRegistry({ skillsDir: SKILLS_DIR }).writeIndex();

  console.log(`\nAdded ${counts.added}, already present ${counts.skipped}, skipped without license ${counts.unlicensed}, errors ${counts.errors}.`);
  console.log(`Next: review warnings, then run 'gaw skills lint'.\n`);
}

run().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});
