#!/usr/bin/env node
/**
 * GAW evaluation harness: measures how well GAW picks skills for tasks.
 *
 *   npm run eval                    # run and compare with eval/baseline.json
 *   npm run eval -- --verbose       # also show every case
 *   npm run eval -- --save-baseline # store this run as the new baseline
 *   npm run eval -- --json          # machine-readable output
 *
 * Systems measured:
 *   onboarding  SkillDiscovery.findRelevant (strict close matches, used by gaw init)
 *   use         SkillOrchestrator.loadSkillsForTask (what `gaw use` gives agents)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../core/skill-registry/SkillRegistry.js';
import { SkillOrchestrator } from '../core/orchestrator/SkillOrchestrator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CASES_FILE = path.join(REPO_ROOT, 'eval', 'cases', 'skill-selection.json');
const BASELINE_FILE = path.join(REPO_ROOT, 'eval', 'baseline.json');

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const asJson = args.includes('--json');
const saveBaseline = args.includes('--save-baseline');

const estimateTokens = (text) => Math.round((text || '').length / 4);
const round = (n, digits = 3) => Math.round(n * 10 ** digits) / 10 ** digits;
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

// Descriptions the frontmatter reader failed to parse (YAML block markers) or that say nothing
const isMissingDescription = (d) => !d || ['>', '>-', '|', '|-'].includes(d.trim()) || d.trim().length < 15;

async function main() {
  const { cases } = JSON.parse(fs.readFileSync(CASES_FILE, 'utf8'));
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const orchestrator = new SkillOrchestrator(registry);
  const allSkills = await registry.getAllSkills();

  const systems = {
    onboarding: async (task) => {
      const skills = await orchestrator.discovery.findRelevant(task, { limit: 5 });
      return { ids: skills.map(s => s.id), tokens: estimateTokens(orchestrator.formatInstructions(skills)) };
    },
    use: async (task) => {
      const loaded = await orchestrator.loadSkillsForTask(task, {});
      return { ids: loaded.skills.map(s => s.id), tokens: estimateTokens(loaded.formattedInstructions) };
    }
  };

  const results = {};
  const perCase = [];

  for (const [name, run] of Object.entries(systems)) {
    const covered = [];   // cases the library covers
    const uncovered = []; // cases that should get no skills
    const tokens = [];
    const counts = [];

    for (const c of cases) {
      const { ids, tokens: t } = await run(c.task);
      const relevantPicked = ids.filter(id => c.relevant.includes(id));
      tokens.push(t);
      counts.push(ids.length);

      if (c.relevant.length > 0) {
        covered.push({
          hit: relevantPicked.length > 0,
          precision: ids.length ? relevantPicked.length / ids.length : 0
        });
      } else {
        uncovered.push({ correctlyEmpty: ids.length === 0 });
      }
      perCase.push({ system: name, id: c.id, domain: c.domain, picked: ids, relevantPicked, tokens: t, expectNone: c.relevant.length === 0 });
    }

    results[name] = {
      hitRate: round(mean(covered.map(c => (c.hit ? 1 : 0)))),
      precision: round(mean(covered.map(c => c.precision))),
      noMatchAccuracy: round(mean(uncovered.map(c => (c.correctlyEmpty ? 1 : 0)))),
      avgSkills: round(mean(counts), 2),
      avgTokens: Math.round(mean(tokens))
    };
    // One number to track: equal weight on finding a good skill, avoiding bad ones, and staying quiet when nothing fits
    results[name].score = round((results[name].hitRate + results[name].precision + results[name].noMatchAccuracy) / 3);
  }

  const tokenSizes = allSkills.map(s => estimateTokens(s.content));
  const library = {
    skills: allSkills.length,
    missingDescriptions: allSkills.filter(s => isMissingDescription(s.description)).length,
    oversized: tokenSizes.filter(t => t > 5000).length,
    largestSkillTokens: Math.max(...tokenSizes)
  };

  const report = {
    generatedAt: new Date().toISOString(),
    cases: cases.length,
    coveredCases: cases.filter(c => c.relevant.length > 0).length,
    noMatchCases: cases.filter(c => c.relevant.length === 0).length,
    systems: results,
    library
  };

  const baseline = fs.existsSync(BASELINE_FILE) ? JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')) : null;

  if (asJson) {
    console.log(JSON.stringify({ ...report, perCase }, null, 2));
  } else {
    printReport(report, baseline, verbose ? perCase : null);
  }

  if (saveBaseline) {
    fs.writeFileSync(BASELINE_FILE, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    if (!asJson) console.log(`Saved baseline: ${path.relative(REPO_ROOT, BASELINE_FILE)}\n`);
  }
}

function printReport(report, baseline, perCase) {
  // Higher is better for rates and score; lower is better for tokens and library problems
  const lowerIsBetter = new Set(['avgTokens', 'missingDescriptions', 'oversized', 'largestSkillTokens']);
  const delta = (key, now, before) => {
    if (before === undefined || before === now) return '';
    const better = lowerIsBetter.has(key) ? now < before : now > before;
    const diff = round(now - before, 3);
    return `  (${diff > 0 ? '+' : ''}${diff} ${better ? 'better' : 'worse'})`;
  };
  const pct = (n) => `${Math.round(n * 100)}%`;

  console.log(`\nGAW SKILL SELECTION EVAL  ·  ${report.cases} cases (${report.coveredCases} covered, ${report.noMatchCases} should get no skills)\n`);

  for (const [name, r] of Object.entries(report.systems)) {
    const b = baseline?.systems?.[name] || {};
    console.log(`${name}`);
    console.log(`  score             ${pct(r.score)}${delta('score', r.score, b.score)}`);
    console.log(`  hit rate          ${pct(r.hitRate)}   found an acceptable skill${delta('hitRate', r.hitRate, b.hitRate)}`);
    console.log(`  precision         ${pct(r.precision)}   share of picks that were acceptable${delta('precision', r.precision, b.precision)}`);
    console.log(`  no-match accuracy ${pct(r.noMatchAccuracy)}   returned nothing when nothing fits${delta('noMatchAccuracy', r.noMatchAccuracy, b.noMatchAccuracy)}`);
    console.log(`  avg skills        ${r.avgSkills}${delta('avgSkills', r.avgSkills, b.avgSkills)}`);
    console.log(`  avg tokens        ${r.avgTokens}${delta('avgTokens', r.avgTokens, b.avgTokens)}\n`);
  }

  const l = report.library;
  const bl = baseline?.library || {};
  console.log(`library health`);
  console.log(`  skills                 ${l.skills}`);
  console.log(`  missing descriptions   ${l.missingDescriptions}${delta('missingDescriptions', l.missingDescriptions, bl.missingDescriptions)}`);
  console.log(`  over ~5000 tokens      ${l.oversized}${delta('oversized', l.oversized, bl.oversized)}`);
  console.log(`  largest skill (tokens) ${l.largestSkillTokens}${delta('largestSkillTokens', l.largestSkillTokens, bl.largestSkillTokens)}\n`);

  if (!baseline) console.log(`No baseline yet. Save one with: npm run eval -- --save-baseline\n`);

  if (perCase) {
    console.log(`per case`);
    for (const c of perCase) {
      const ok = c.expectNone ? c.picked.length === 0 : c.relevantPicked.length > 0;
      const picks = c.picked.length ? c.picked.join(', ') : '(none)';
      console.log(`  ${ok ? '✓' : '✗'} [${c.system}] ${c.id.padEnd(22)} ${picks}`);
    }
    console.log();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
