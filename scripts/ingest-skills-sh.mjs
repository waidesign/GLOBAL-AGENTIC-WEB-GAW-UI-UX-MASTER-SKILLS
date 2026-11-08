import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');

// Target repositories for Option A (Official, Curated & Trending)
const TARGET_REPOSITORIES = [
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

/**
 * Determine best GAW category based on repo, path, skill name, and description.
 */
function determineCategory(repo, skillPath, skillName, desc = '') {
  const text = `${repo} ${skillPath} ${skillName} ${desc}`.toLowerCase();

  if (text.includes('design-system') || text.includes('tokens') || text.includes('radix') || text.includes('shadcn')) {
    return 'design-systems';
  }
  if (text.includes('animation') || text.includes('motion') || text.includes('framer') || text.includes('animejs')) {
    return 'animation-motion';
  }
  if (text.includes('accessib') || text.includes('wcag') || text.includes('aria')) {
    return 'accessibility';
  }
  if (text.includes('performance') || text.includes('optimization') || text.includes('optimize') || text.includes('memory-leak')) {
    return 'performance';
  }
  if (text.includes('video') || text.includes('remotion') || text.includes('hyperframe') || text.includes('audio') || text.includes('music')) {
    return 'media-creative';
  }
  if (text.includes('azure') || text.includes('cloud') || text.includes('kubernetes') || text.includes('deploy') || text.includes('docker') || text.includes('infra')) {
    return 'cloud-infra';
  }
  if (text.includes('postgres') || text.includes('database') || text.includes('supabase') || text.includes('sql') || text.includes('prisma')) {
    return 'database';
  }
  if (text.includes('test') || text.includes('tdd') || text.includes('vitest') || text.includes('jest') || text.includes('cypress')) {
    return 'testing';
  }
  if (text.includes('debug') || text.includes('bug') || text.includes('diagnos') || text.includes('troubleshoot') || text.includes('error')) {
    return 'debugging';
  }
  if (text.includes('review') || text.includes('lint') || text.includes('quality') || text.includes('guardrail') || text.includes('pre-commit')) {
    return 'code-quality';
  }
  if (text.includes('architect') || text.includes('deep-module') || text.includes('domain-model') || text.includes('spec') || text.includes('ticket') || text.includes('wayfinder')) {
    return 'architecture';
  }
  if (text.includes('react') || text.includes('nextjs') || text.includes('vue') || text.includes('svelte') || text.includes('tailwind') || text.includes('css')) {
    return 'frontend';
  }
  if (text.includes('ui') || text.includes('ux') || text.includes('taste') || text.includes('mobile-app') || text.includes('landing') || text.includes('layout')) {
    return 'ui-ux';
  }
  if (text.includes('agent') || text.includes('grill') || text.includes('handoff') || text.includes('prompt') || text.includes('workflow') || text.includes('triage')) {
    return 'workflow';
  }

  return 'general';
}

/**
 * Extract frontmatter and content from raw SKILL.md.
 */
function parseRawSkillMd(content) {
  if (!content.startsWith('---')) {
    return { metadata: {}, body: content };
  }
  const endIdx = content.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { metadata: {}, body: content };
  }
  const header = content.slice(3, endIdx).trim();
  const body = content.slice(endIdx + 4).trim();
  
  // Extract simple YAML fields
  const metadata = {};
  for (const line of header.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    metadata[key] = val;
  }
  return { metadata, body };
}

/**
 * Generate GAW standard frontmatter.
 */
function formatGawSkill(id, name, category, description, author, body) {
  // Clean description string to be single line, escaped quotes
  const cleanDesc = (description || `${name} skill for AI coding agents.`)
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, '\\"')
    .trim();

  const cleanName = (name || id).replace(/"/g, '\\"');
  const cleanAuthor = (author || 'skills.sh-community').replace(/"/g, '\\"');
  const tags = JSON.stringify([id, category, 'skills.sh']);
  const frameworks = JSON.stringify(['any']);

  return `---
id: "${id}"
name: "${cleanName}"
category: "${category}"
description: "${cleanDesc}"
author: "${cleanAuthor}"
license: "MIT"
version: "1.0.0"
tags: ${tags}
frameworks: ${frameworks}
dependencies: []
relatedSkills: []
lastVerified: "2026-11-08"
---

${body}
`;
}

async function fetchRepoTree(owner, repo) {
  for (const branch of ['main', 'master']) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'GAW-Skill-Ingester' } });
      if (res.ok) {
        const data = await res.json();
        const skillBlobs = (data.tree || []).filter(item => 
          item.type === 'blob' && 
          item.path.endsWith('SKILL.md')
        );
        return { branch, skillBlobs };
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

async function run() {
  console.log(`🚀 Starting Global Agentic Web (GAW) Skills Ingestion (Option A)...`);
  console.log(`Target Repositories: ${TARGET_REPOSITORIES.length}\n`);

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
      // Determine skill ID from directory or file
      const parts = blob.path.split('/');
      let skillName = parts.length > 1 ? parts[parts.length - 2] : repo;
      if (skillName === 'skills' || skillName === 'src' || skillName === '.') {
        skillName = repo;
      }
      
      const skillId = skillName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      
      // Check if this skill already exists anywhere in GAW skills/
      let alreadyExists = false;
      const categories = fs.readdirSync(SKILLS_DIR);
      for (const cat of categories) {
        const p = path.join(SKILLS_DIR, cat, `${skillId}.md`);
        if (fs.existsSync(p)) {
          alreadyExists = true;
          break;
        }
      }

      if (alreadyExists) {
        console.log(`  ⏭️ Skipped (already exists): ${skillId}`);
        skippedCount++;
        continue;
      }

      // Fetch raw content
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${treeData.branch}/${blob.path}`;
      try {
        const res = await fetch(rawUrl);
        if (!res.ok) {
          errorCount++;
          continue;
        }
        const rawContent = await res.text();
        const { metadata, body } = parseRawSkillMd(rawContent);

        const category = determineCategory(repo, blob.path, skillId, metadata.description || '');
        const targetDir = path.join(SKILLS_DIR, category);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const displayName = metadata.name || skillName;
        const author = metadata.author || owner;
        const description = metadata.description || '';

        const formatted = formatGawSkill(skillId, displayName, category, description, author, body);
        const targetFile = path.join(targetDir, `${skillId}.md`);
        fs.writeFileSync(targetFile, formatted, 'utf8');

        console.log(`  ★ Added [${category}] ${skillId} (from ${owner}/${repo})`);
        addedCount++;
      } catch (err) {
        console.error(`  ❌ Error processing ${blob.path}:`, err.message);
        errorCount++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Ingestion Summary:`);
  console.log(`  - Added Skills:     ${addedCount}`);
  console.log(`  - Preserved/Skipped: ${skippedCount}`);
  console.log(`  - Errors:           ${errorCount}`);
  console.log(`========================================\n`);
}

run().catch(console.error);

