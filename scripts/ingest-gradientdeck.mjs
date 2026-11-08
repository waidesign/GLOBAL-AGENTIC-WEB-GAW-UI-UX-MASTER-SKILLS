import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../');
const DESIGNS_DIR = path.join(REPO_ROOT, 'presets', 'designs');

// Ensure directory exists
if (!fs.existsSync(DESIGNS_DIR)) {
  fs.mkdirSync(DESIGNS_DIR, { recursive: true });
}

// Curated list of high-impact styles across key industries
const ICONIC_STYLES = [
  'railway',
  'mollie',
  'stripe-press',
  'tailwind-css',
  'poolsuite',
  'cloudflare',
  'pinecone',
  'laravel',
  'nestjs',
  'nuxt',
  'rauno-freiberg',
  'emil-kowalski',
  'josh-w-comeau',
  'the-pudding',
  'basement-studio',
  'cuberto',
  'family',
  'hey',
  'nothing',
  'high-protein',
  'hopper',
  'heptabase',
  'empower',
  '1x-tech',
  'a16z-speedrun',
  'a24',
  'aaply',
  'ableton',
  'acne-studios',
  'aesop',
  'agentcard',
  'blimp',
  'blond',
  'dont-board-me',
  'feeld',
  'frama',
  'gabriel-valdivia',
  'hero-collective',
  'hifi',
  'joi',
  'kobbe',
  'making-software',
  'maven-clinic',
  'maxime-heckel',
  'moooi',
  'moxie-care',
  'mubi-notebook',
  'neutra-vdl',
  'oath-biome',
  'offf-forum',
  'opal',
  'opencode',
  'rainmaker',
  'recent',
  'stereoscope-coffee',
  'studio-freight',
  'the-line-studio',
  'the-surfers-journal-archives',
  'toca-boca',
  'toys-for-joy',
  'union-boulangerie',
  'unseen-studio',
  'voldog-food'
];

async function fetchStyle(slug) {
  const pageUrl = `https://ui.gradientdeck.com/styles/${slug}`;
  const mdUrl = `https://ui.gradientdeck.com/styles/${slug}/design.md`;

  const [pageRes, mdRes] = await Promise.all([
    fetch(pageUrl),
    fetch(mdUrl)
  ]);

  if (!mdRes.ok) {
    throw new Error(`Failed to fetch markdown for ${slug}: HTTP ${mdRes.status}`);
  }

  const mdText = await mdRes.text();
  let liveUrl = '';

  if (pageRes.ok) {
    const html = await pageRes.text();
    const links = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map(m => m[1]);
    const external = links.find(l => !l.includes('gradientdeck') && !l.includes('googletagmanager'));
    if (external) liveUrl = external;
  }

  // Parse title: "# Name — Style Reference"
  const titleMatch = mdText.match(/^#\s+([^—\n]+)/m);
  const name = titleMatch ? titleMatch[1].trim() : slug;

  // Parse vibe quote: "> text"
  const vibeMatch = mdText.match(/^>\s+([^\n]+)/m);
  const vibe = vibeMatch ? vibeMatch[1].trim() : '';

  // Parse theme: "**Theme:** dark/light"
  const themeMatch = mdText.match(/\*\*Theme:\*\*\s*(dark|light)/i);
  const theme = themeMatch ? themeMatch[1].toLowerCase() : 'dark';

  // Determine category & tags
  const combined = `${slug} ${name} ${vibe}`.toLowerCase();
  let category = 'saas';
  const tags = [slug, theme];

  if (/api|cloud|dev|console|terminal|code|deploy|infra|git|linux|framework|css/i.test(combined)) {
    category = 'developer-tools';
    tags.push('developer-tools', 'api', 'technical');
  } else if (/bank|pay|finance|card|invest|crypto|wallet|ledger|money/i.test(combined)) {
    category = 'fintech';
    tags.push('fintech', 'banking');
  } else if (/shop|store|brand|coffee|cloth|goods|food|care|beauty/i.test(combined)) {
    category = 'e-commerce';
    tags.push('e-commerce', 'brand');
  } else if (/studio|agency|design|architect|art|media|creative|3d|motion/i.test(combined)) {
    category = 'creative-studio';
    tags.push('creative-studio', 'agency');
  } else if (/press|book|journal|read|news|mag|essay|publish|editorial/i.test(combined)) {
    category = 'editorial';
    tags.push('editorial', 'publishing');
  } else {
    category = 'saas';
    tags.push('saas', 'web-app');
  }

  const frontmatter = `---
id: "${slug}"
name: "${name.replace(/"/g, '\\"')}"
theme: "${theme}"
category: "${category}"
tags: ${JSON.stringify(Array.from(new Set(tags)))}
vibe: "${vibe.replace(/"/g, '\\"')}"
liveUrl: "${liveUrl}"
previewUrl: "${pageUrl}"
lastVerified: "2026-11-08"
---

`;

  return frontmatter + mdText;
}

async function run() {
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const targetSlug = args.find(a => !a.startsWith('--'));

  console.log(`🚀 Starting GradientDeck Design Presets Ingestion for GAW...`);

  let slugs = ICONIC_STYLES;

  if (targetSlug) {
    slugs = [targetSlug];
  } else if (isAll) {
    console.log(`🔍 Fetching full sitemap from ui.gradientdeck.com...`);
    const sitemapRes = await fetch('https://ui.gradientdeck.com/sitemap.xml');
    if (sitemapRes.ok) {
      const xml = await sitemapRes.text();
      const allUrls = [...xml.matchAll(/<loc>https:\/\/ui\.gradientdeck\.com\/styles\/([^<]+)<\/loc>/g)].map(m => m[1]);
      if (allUrls.length > 0) {
        slugs = allUrls;
      }
    }
  }

  console.log(`Targets: ${slugs.length} design presets to process.\n`);

  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const slug of slugs) {
    const targetFile = path.join(DESIGNS_DIR, `${slug}.md`);
    if (fs.existsSync(targetFile) && !args.includes('--force')) {
      skipped++;
      continue;
    }

    try {
      const content = await fetchStyle(slug);
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log(`  ★ Added preset: \x1b[1m${slug}\x1b[0m`);
      added++;
    } catch (e) {
      console.warn(`  ❌ Error processing ${slug}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Ingestion Summary:`);
  console.log(`  - Added Presets:     ${added}`);
  console.log(`  - Preserved/Skipped: ${skipped}`);
  console.log(`  - Errors:            ${errors}`);
  console.log(`  - Presets Directory: ${DESIGNS_DIR}`);
  console.log(`========================================\n`);
}

run().catch(console.error);

