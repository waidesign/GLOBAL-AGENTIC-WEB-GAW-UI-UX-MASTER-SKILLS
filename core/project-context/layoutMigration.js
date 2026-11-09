/**
 * Moves a Project Brain from layout 1 (identity.md, project-history.md,
 * active-skills.md, global-brain.md next to the project files) to layout 2
 * (brain.json, decisions/, memory/proposed/, local/).
 *
 * Nothing a person wrote is lost: generated files are archived or regenerated,
 * template files nobody changed are replaced by the new templates (carrying over
 * the goal and rules that onboarding added), and edited files are kept as they are.
 */
import fs from 'node:fs';
import path from 'node:path';
import { TASK_ARCHIVE_DIR, ensureLocalDir, renderTemplateFile } from './brainLayout.js';
import { setSection, sectionBody, appendToSection } from '../utils/markdownSections.js';

const normalize = (text) => String(text).replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n').trim();
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when `content` is `template` with only its {{PLACEHOLDERS}} filled in. */
export function matchesTemplate(content, template) {
  const parts = normalize(template).split(/\{\{[A-Z_]+\}\}/);
  const re = new RegExp(`^${parts.map(escapeRe).join('[^\\n]*')}$`);
  return re.test(normalize(content));
}

const OLD_GOAL_HEADING = '## Product Overview';
const NEW_GOAL_HEADING = '## Project Goal';
const RULES_HEADING = '## Project-Specific Rules';
const OLD_GOAL_PLACEHOLDER = 'Add an overview of what the application does, its target audience, and primary user flows.';

function archive(brainDir, file, report, date) {
  const src = path.join(brainDir, file);
  if (!fs.existsSync(src)) return;
  const destDir = path.join(brainDir, TASK_ARCHIVE_DIR);
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, `${date}-${file.replace(/\.md$/i, '').toLowerCase()}.md`);
  fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'), 'utf8');
  fs.unlinkSync(src);
  report.archived.push(`ai-brain/${file} → ai-brain/${path.relative(brainDir, dest).replace(/\\/g, '/')}`);
}

/**
 * Migrate ai-brain/ in place. `legacyDir` holds the layout 1 templates;
 * `templatesDir` the current ones. Returns { archived, removed, replaced, kept }.
 */
export function migrateLayout(projectDir, { templatesDir, legacyDir, facts, dryRun = false }) {
  const brainDir = path.join(projectDir, 'ai-brain');
  const report = { archived: [], removed: [], replaced: [], kept: [] };
  if (!fs.existsSync(brainDir)) return report;
  const date = new Date().toISOString().split('T')[0];
  const read = (f) => fs.readFileSync(path.join(brainDir, f), 'utf8');
  const legacy = (f) => {
    const p = path.join(legacyDir, f);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };
  const write = (f, content) => { if (!dryRun) fs.writeFileSync(path.join(brainDir, f), content, 'utf8'); };
  const remove = (f) => { if (!dryRun) fs.unlinkSync(path.join(brainDir, f)); };
  const has = (f) => fs.existsSync(path.join(brainDir, f));
  const fresh = (f) => renderTemplateFile(templatesDir, f, facts);

  if (!dryRun) ensureLocalDir(projectDir);

  // Task files from older versions: whole skill bodies, often stale. Archived, never deleted.
  for (const f of ['active-skills.md', 'ACTIVE_TASK.md']) {
    if (!has(f)) continue;
    if (dryRun) report.archived.push(`ai-brain/${f}`);
    else archive(brainDir, f, report, date);
  }

  // Files the new layout replaces: removed when untouched, kept when someone edited them
  const hints = {
    'identity.md': 'move what still matters into context.md (goal) or design.md (look and feel), then delete it',
    'project-history.md': 'move the decisions into decisions/ (one short record each), then delete it'
  };
  for (const f of Object.keys(hints)) {
    if (!has(f)) continue;
    const template = legacy(f);
    if (template && matchesTemplate(read(f), template)) {
      remove(f);
      report.removed.push(`ai-brain/${f} (unchanged template)`);
    } else {
      report.kept.push(`ai-brain/${f}: edited, so kept; ${hints[f]}`);
    }
  }

  // README and playbook: replace when untouched
  for (const f of ['README.md', 'playbook.md']) {
    if (!has(f)) continue;
    const template = legacy(f);
    if (template && matchesTemplate(read(f), template)) {
      write(f, fresh(f));
      report.replaced.push(`ai-brain/${f}`);
    } else {
      report.kept.push(`ai-brain/${f}: edited, so kept; compare with the new template (gaw init --force in a scratch folder shows it)`);
    }
  }

  // context.md: the old template plus a goal from onboarding → the new template with that goal
  if (has('context.md')) {
    const current = read('context.md');
    const goal = [sectionBody(current, NEW_GOAL_HEADING), sectionBody(current, OLD_GOAL_HEADING)]
      .find(g => g && !g.startsWith(OLD_GOAL_PLACEHOLDER.slice(0, 30))) || null;
    let probe = setSection(current, OLD_GOAL_HEADING, OLD_GOAL_PLACEHOLDER);
    if (current.includes(NEW_GOAL_HEADING)) {
      const lines = probe.split('\n');
      const start = lines.findIndex(l => l.trim() === NEW_GOAL_HEADING);
      let end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
      if (end === -1) end = lines.length;
      lines.splice(start, end - start);
      probe = lines.join('\n');
    }
    const template = legacy('context.md');
    if (template && matchesTemplate(probe, template)) {
      let next = fresh('context.md');
      if (goal) next = setSection(next, NEW_GOAL_HEADING, goal);
      write('context.md', next);
      report.replaced.push(`ai-brain/context.md${goal ? ' (goal kept)' : ''}`);
    } else {
      report.kept.push('ai-brain/context.md: edited, so kept; add the Commands, Folder Map and Definition of Done sections from the new template');
    }
  }

  // rules.md: the old template plus rules from onboarding → the new template with those rules
  if (has('rules.md')) {
    const current = read('rules.md');
    const own = sectionBody(current, RULES_HEADING).split('\n').filter(l => /^\s*-\s+/.test(l)).map(l => l.trim());
    const lines = current.replace(/\r\n/g, '\n').split('\n');
    const start = lines.findIndex(l => l.trim() === RULES_HEADING);
    const probe = start === -1 ? current : lines.slice(0, start).join('\n');
    const template = legacy('rules.md');
    if (template && matchesTemplate(probe, template)) {
      let next = fresh('rules.md');
      if (own.length) next = appendToSection(next, RULES_HEADING, own);
      write('rules.md', next);
      report.replaced.push(`ai-brain/rules.md${own.length ? ` (${own.length} project rule${own.length > 1 ? 's' : ''} kept)` : ''}`);
    } else {
      report.kept.push('ai-brain/rules.md: edited, so kept; consider the Safety and Scope sections from the new template');
    }
  }

  return report;
}
