import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { ensureGraphify } from './graphify-setup.js';
import { explainMatch } from '../core/skill-discovery/SkillDiscovery.js';
import { selectSkills, writeCatalog } from '../core/project-context/ProjectContext.js';

const MAX_RULES = 20;

/**
 * Parse a skill selection: Enter keeps all, "n"/"none" keeps none,
 * numbers ("1,3" or "1 3") keep only those. Returns 0-based indexes, or null if invalid.
 */
export function parseSelection(input, count) {
  const answer = String(input || '').trim().toLowerCase();
  if (answer === '' || answer === 'y' || answer === 'yes' || answer === 'all') {
    return [...Array(count).keys()];
  }
  if (answer === 'n' || answer === 'no' || answer === 'none') return [];

  const parts = answer.split(/[\s,]+/).filter(Boolean);
  const indexes = [];
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 1 || n > count) return null;
    if (!indexes.includes(n - 1)) indexes.push(n - 1);
  }
  return indexes;
}

/** Find the line range of a "## heading" section: [start, end) or null. */
function findSection(lines, heading) {
  const start = lines.findIndex(l => l.trim() === heading);
  if (start === -1) return null;
  let end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  if (end === -1) end = lines.length;
  return { start, end };
}

/** Replace the body of a "## heading" section, or append the section if it is missing. */
export function setSection(content, heading, body) {
  const lines = content.replace(/\s+$/, '').split('\n');
  const section = findSection(lines, heading);
  const block = [heading, ...body.split('\n'), ''];
  if (!section) return `${lines.join('\n')}\n\n${block.join('\n')}`;
  lines.splice(section.start, section.end - section.start, ...block);
  return `${lines.join('\n').replace(/\s+$/, '')}\n`;
}

/** Add lines to the end of a "## heading" section, creating the section if it is missing. */
export function appendToSection(content, heading, newLines) {
  const lines = content.replace(/\s+$/, '').split('\n');
  const section = findSection(lines, heading);
  if (!section) return `${lines.join('\n')}\n\n${heading}\n${newLines.join('\n')}\n`;

  let insertAt = section.end;
  while (insertAt > section.start + 1 && lines[insertAt - 1].trim() === '') insertAt--;
  lines.splice(insertAt, 0, ...newLines);
  return `${lines.join('\n').replace(/\s+$/, '')}\n`;
}

const PRODUCT_OVERVIEW_PLACEHOLDER = 'Add an overview of what the application does, its target audience, and primary user flows.';

/** Save the project goal in ai-brain/context.md without touching anything the user wrote. */
function saveGoal(brainDir, goal) {
  const file = path.join(brainDir, 'context.md');
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '# Project Context\n';
  const updated = existing.includes(PRODUCT_OVERVIEW_PLACEHOLDER)
    ? existing.replace(PRODUCT_OVERVIEW_PLACEHOLDER, goal)
    : setSection(existing, '## Project Goal', goal);
  fs.writeFileSync(file, updated, 'utf8');
}

/** Append the user's rules to ai-brain/rules.md, skipping ones already there. */
function saveRules(brainDir, rules) {
  const file = path.join(brainDir, 'rules.md');
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '# Project Rules & Architectural Constraints\n';
  const fresh = rules.filter(r => !existing.includes(`- ${r}`));
  if (fresh.length === 0) return 0;
  fs.writeFileSync(file, appendToSection(existing, '## Project-Specific Rules', fresh.map(r => `- ${r}`)), 'utf8');
  return fresh.length;
}

/**
 * Interactive onboarding after `gaw init`. Works for any kind of project:
 *   1. What are you building?     -> ai-brain/context.md
 *   2. Suggested skills (if any closely match the goal) -> ai-brain/skills.lock.json + project-skills.md
 *   3. Rules agents must follow   -> ai-brain/rules.md
 *   4. Graphify code map          (only when Graphify is missing)
 *   5. Summary
 *
 * `ask(question)` returns the typed answer; pass a fake in tests.
 */
export async function runOnboarding(options) {
  const {
    bootstrapper,
    projectDir,
    ask,
    offerGraphify = false,
    graphifyOptions = {},
    log = console.log
  } = options;

  const brainDir = path.join(projectDir, 'ai-brain');
  fs.mkdirSync(brainDir, { recursive: true });
  const written = [];
  const totalSteps = offerGraphify ? 4 : 3;
  const step = (n, title) => log(`\n[${n}/${totalSteps}] ${title}`);

  log(`\n======================================================`);
  log(`✨ PROJECT ONBOARDING (press Enter to skip any question)`);
  log(`======================================================`);

  // 1. Goal
  step(1, 'What are you building?');
  log(`    One line is enough, e.g. "REST API for a booking app" or "Marketing site for a bakery".`);
  const goal = (await ask('    > ')).trim();
  if (goal) {
    saveGoal(brainDir, goal);
    written.push('ai-brain/context.md (project goal)');
    log(`    ✓ Saved as the project goal.`);
  } else {
    log(`    Skipped.`);
  }

  // 2. Skills that closely match the goal
  step(2, 'Suggested skills');
  if (!goal) {
    log(`    Skipped: no goal to match skills against.`);
    log(`    Later: gaw use "<your task>" --inject`);
  } else {
    const scored = await bootstrapper.orchestrator.discovery.findRelevant(goal, { limit: 5, withScores: true });
    const matches = scored.map(e => e.skill);
    const reasons = new Map(scored.map(e => [e.skill.id, explainMatch(e)]));
    if (matches.length === 0) {
      log(`    No skills in the library closely match this goal yet.`);
      log(`    Browse them with: gaw skills   or search: gaw search "<keyword>"`);
    } else {
      log(`    These skills match your goal. Your AI agent will follow them.`);
      matches.forEach((s, i) => {
        const description = (s.description || '').replace(/\s+/g, ' ').trim();
        const short = description.length > 70 ? `${description.slice(0, 67)}...` : description;
        log(`      ${i + 1}. ${s.id}${short ? `  ${short}` : ''}`);
        log(`         Why: ${reasons.get(s.id)}`);
      });

      let picked = null;
      for (let attempt = 0; attempt < 3 && picked === null; attempt++) {
        picked = parseSelection(await ask('    Use these? (Enter = all, numbers to keep only those e.g. "1,3", n = none) '), matches.length);
        if (picked === null) log(`    Please press Enter, type n, or numbers between 1 and ${matches.length}.`);
      }

      const chosen = (picked || []).map(i => matches[i]);
      if (chosen.length > 0) {
        // Record the choice in the project's skill lockfile; agents read the short
        // catalog and open a full skill only when a task needs it
        for (const s of chosen) {
          await selectSkills(projectDir, bootstrapper.registry, [s.id], `Matches the project goal: ${reasons.get(s.id)}`);
        }
        await writeCatalog(projectDir, bootstrapper.registry);
        written.push(`ai-brain/skills.lock.json + project-skills.md (${chosen.length} skill${chosen.length > 1 ? 's' : ''})`);
        log(`    ✓ Selected for this project: ${chosen.map(s => s.id).join(', ')}`);
      } else {
        log(`    No skills selected.`);
      }
    }
  }

  // 3. Rules
  step(3, 'Any rules your AI agents must always follow?');
  log(`    e.g. "All API endpoints require auth", "Follow MISRA C", "Support Safari 15+".`);
  const rules = [];
  while (rules.length < MAX_RULES) {
    const rule = (await ask(rules.length === 0 ? '    Rule (Enter to skip): ' : '    Another rule (Enter to finish): ')).trim();
    if (!rule) break;
    rules.push(rule);
  }
  if (rules.length > 0) {
    const added = saveRules(brainDir, rules);
    if (added > 0) written.push(`ai-brain/rules.md (${added} rule${added > 1 ? 's' : ''})`);
    log(`    ✓ Saved ${rules.length} rule${rules.length > 1 ? 's' : ''}.`);
  } else {
    log(`    Skipped.`);
  }

  // 4. Graphify (only when missing)
  if (offerGraphify) {
    step(4, 'Graphify code map');
    const askYesNo = async (question) => {
      const answer = (await ask(question)).trim().toLowerCase();
      return answer === '' || answer === 'y' || answer === 'yes';
    };
    const res = await ensureGraphify({ ask: askYesNo, log, ...graphifyOptions });
    if (res.available) {
      const graph = await bootstrapper.buildGraph(projectDir);
      if (!graph.skipped) written.push('graphify-out/ (code map)');
      log(`    ${graph.skipped ? 'ℹ' : '✓'} ${graph.summary}`);
    }
  }

  // 5. Summary
  log(`\n======================================================`);
  log(`✅ ONBOARDING COMPLETE`);
  log(`======================================================`);
  if (written.length > 0) {
    log(`Saved:`);
    for (const w of written) log(`  • ${w}`);
  }
  log(`\nYour AI agent reads ai-brain/ automatically (via CLAUDE.md, .cursorrules, AGENTS.md or GEMINI.md).`);
  log(`Next: describe your first task to your agent, or load skills for it with: gaw use "<task>" --inject\n`);

  return { goal, rules, written };
}

/**
 * Line-based asker that keeps every input line, so answers typed ahead or piped
 * in are not lost, and treats end of input as "skip" instead of exiting mid-flow.
 */
export function createLineAsker(input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, output, terminal: Boolean(input.isTTY) });
  const queued = [];
  const waiting = [];
  let closed = false;

  rl.on('line', (rawLine) => {
    const line = rawLine.replace(/^﻿/, ''); // some shells prefix piped input with a byte-order mark
    if (waiting.length > 0) waiting.shift()(line);
    else queued.push(line);
  });
  rl.on('close', () => {
    closed = true;
    while (waiting.length > 0) waiting.shift()('');
  });

  const ask = async (question) => {
    output.write(question);
    let answer;
    if (queued.length > 0) answer = queued.shift();
    else if (closed) answer = '';
    else answer = await new Promise(resolve => waiting.push(resolve));
    // Piped answers are not echoed by the terminal; show them so the log reads naturally
    if (!input.isTTY) output.write(`${answer}\n`);
    return answer;
  };

  return { ask, close: () => rl.close() };
}

/** Terminal wrapper: runs onboarding with a real prompt. */
export async function runInteractiveOnboarding(bootstrapper, projectDir, options = {}) {
  const asker = createLineAsker();
  try {
    return await runOnboarding({ bootstrapper, projectDir, ask: asker.ask, ...options });
  } finally {
    asker.close();
  }
}
