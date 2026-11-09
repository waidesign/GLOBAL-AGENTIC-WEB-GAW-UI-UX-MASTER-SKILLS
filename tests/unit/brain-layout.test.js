import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';
import { ProjectDetector } from '../../core/project-detector/ProjectDetector.js';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { SkillOrchestrator } from '../../core/orchestrator/SkillOrchestrator.js';
import { loadProjectContext } from '../../core/project-context/ProjectContext.js';
import { writeActiveTask, readActiveTask, archiveActiveTask } from '../../core/project-context/activeTask.js';
import { matchesTemplate } from '../../core/project-context/layoutMigration.js';
import { renderTemplate } from '../../core/project-context/brainLayout.js';
import { lintSkillFolder } from '../../core/skill-registry/SkillLinter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAYOUT_V1 = path.resolve(__dirname, '../../templates/legacy-project-brain/layout-v1');

class NoGraphify extends GraphifyManager { getCliVersion() { return null; } }

function tempProject(pkg = { name: 'demo', dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0', vite: '^5.0.0' } }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-layout-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
  fs.mkdirSync(path.join(dir, 'src'));
  return dir;
}
const globalBrain = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-layout-gb-'));
const bootstrapper = new ProjectBootstrapper({ globalBrainDir: globalBrain, createGraphifyManager: (dir) => new NoGraphify({ projectRoot: dir }) });
const read = (dir, rel) => fs.readFileSync(path.join(dir, 'ai-brain', rel), 'utf8');
const exists = (dir, rel) => fs.existsSync(path.join(dir, 'ai-brain', rel));
const cleanup = (dir) => fs.rmSync(dir, { recursive: true, force: true });

test('templates - placeholders, UI-only blocks, and no hard-coded product name', () => {
  const out = renderTemplate('A {{X}}\n<!-- if:ui -->\nUI only\n<!-- endif:ui -->\nend {{MISSING}}', { X: 'b' }, { ui: false });
  assert.equal(out, 'A b\nend {{MISSING}}');
  assert.ok(renderTemplate('<!-- if:ui -->\nUI only\n<!-- endif:ui -->\n', {}, { ui: true }).includes('UI only'));

  const templates = path.resolve(__dirname, '../../templates/ai-brain');
  for (const f of ['README.md', 'context.md', 'rules.md', 'playbook.md']) {
    assert.ok(!fs.readFileSync(path.join(templates, f), 'utf8').includes('Guided Agent Workflow'), `${f} uses {{GAW_NAME}}`);
  }
  assert.ok(fs.readFileSync(path.join(templates, 'rules.md'), 'utf8').split('\n').length < 60, 'rules.md stays short');
});

test('init - non-UI project gets no design.md and no UI rules; commands come from package.json', async () => {
  const dir = tempProject({ name: 'api', scripts: { start: 'node server.js', test: 'node --test' }, dependencies: { express: '^4.0.0' } });
  await bootstrapper.init(dir, { noAgentation: true, noGraphify: true });

  assert.equal(exists(dir, 'design.md'), false);
  assert.ok(!read(dir, 'rules.md').includes('UI changes'));
  assert.ok(!read(dir, 'playbook.md').includes('## UI change'));
  assert.ok(read(dir, 'context.md').includes('- Test: `npm test`'));
  assert.ok(read(dir, 'rules.md').includes('Run `npm test` before'));
  const brain = JSON.parse(read(dir, 'brain.json'));
  assert.equal(brain.project.hasUi, false);
  assert.equal(brain.project.commands.dev, 'npm run start');
  cleanup(dir);
});

test('detector - npm placeholder test script is not a test command; pnpm runs scripts directly', () => {
  const dir = tempProject({ name: 'x', scripts: { test: 'echo "Error: no test specified" && exit 1', lint: 'eslint .' } });
  fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '', 'utf8');
  const info = ProjectDetector.detect(dir);
  assert.equal(info.commands.test, null);
  assert.equal(info.commands.lint, 'pnpm lint');
  assert.deepEqual(info.lockfiles, ['pnpm-lock.yaml']);
  cleanup(dir);
});

test('update - refreshes (auto-detected) sections, keeps (confirmed) ones and the team\'s text', async () => {
  const dir = tempProject();
  await bootstrapper.init(dir, { noAgentation: true, noGraphify: true });
  const contextFile = path.join(dir, 'ai-brain', 'context.md');
  let text = fs.readFileSync(contextFile, 'utf8')
    .replace('## Folder Map (auto-detected)', '## Folder Map (confirmed)')
    .replace(/_Not written yet: naming[^\n]*/, 'Use kebab-case file names.');
  fs.writeFileSync(contextFile, text, 'utf8');

  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  pkg.scripts = { test: 'vitest run' };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg), 'utf8');
  fs.mkdirSync(path.join(dir, 'docs'));

  const res = await bootstrapper.update(dir);
  text = read(dir, 'context.md');
  assert.ok(text.includes('- Test: `npm test`'), 'commands refreshed');
  assert.ok(!text.includes('`docs/`'), 'confirmed folder map kept as written');
  assert.ok(text.includes('Use kebab-case file names.'));
  assert.ok(res.refreshedSections.some(s => s.includes('Commands')));
  assert.equal(res.migration, undefined, 'already on the current layout');
  cleanup(dir);
});

test('update - migrates layout 1: archives task files, keeps goal and rules, keeps edited files', async () => {
  const dir = tempProject();
  const brain = path.join(dir, 'ai-brain');
  fs.mkdirSync(brain);
  const fill = (text) => text.replace(/\{\{[A-Z_]+\}\}/g, 'x');
  fs.writeFileSync(path.join(brain, 'README.md'), fill(fs.readFileSync(path.join(LAYOUT_V1, 'README.md'), 'utf8')), 'utf8');
  fs.writeFileSync(path.join(brain, 'context.md'), fill(fs.readFileSync(path.join(LAYOUT_V1, 'context.md'), 'utf8'))
    .replace('Add an overview of what the application does, its target audience, and primary user flows.', 'A booking app for clinics'), 'utf8');
  fs.writeFileSync(path.join(brain, 'rules.md'), `${fs.readFileSync(path.join(LAYOUT_V1, 'rules.md'), 'utf8')}\n## Project-Specific Rules\n- Support Safari 15+\n`, 'utf8');
  fs.writeFileSync(path.join(brain, 'identity.md'), fill(fs.readFileSync(path.join(LAYOUT_V1, 'identity.md'), 'utf8')), 'utf8');
  fs.writeFileSync(path.join(brain, 'project-history.md'), `${fill(fs.readFileSync(path.join(LAYOUT_V1, 'project-history.md'), 'utf8'))}\n| 2026-01-02 | DB | Use Postgres | team call |\n`, 'utf8');
  fs.writeFileSync(path.join(brain, 'playbook.md'), '# My own playbook\n', 'utf8');
  fs.writeFileSync(path.join(brain, 'active-skills.md'), '# GUIDED AGENT WORKFLOW — ACTIVE SKILL CONTEXT\n\nhuge skill bodies', 'utf8');
  fs.writeFileSync(path.join(brain, 'global-brain.md'), '# Global Brain (summary)\n\nold', 'utf8');

  const before = await loadProjectContext(dir);
  assert.ok(before.warnings.some(w => w.includes('old layout')));

  const res = await bootstrapper.update(dir);
  const m = res.migration;
  assert.ok(m, 'migration ran');

  assert.equal(exists(dir, 'active-skills.md'), false);
  assert.equal(fs.readdirSync(path.join(brain, 'local', 'archive')).length, 1, 'old task file archived, not deleted');
  assert.equal(exists(dir, 'global-brain.md'), false, 'generated summary moved to local/');
  assert.equal(exists(dir, 'local/global-brain.md'), true);
  assert.equal(exists(dir, 'identity.md'), false, 'untouched template removed');
  assert.equal(exists(dir, 'project-history.md'), true, 'edited history kept');
  assert.equal(read(dir, 'playbook.md'), '# My own playbook\n', 'edited playbook kept');

  assert.ok(read(dir, 'context.md').includes('## Project Goal\nA booking app for clinics'), 'goal carried over');
  assert.ok(read(dir, 'context.md').includes('## Commands (auto-detected)'));
  assert.ok(read(dir, 'rules.md').includes('## Safety'));
  assert.ok(read(dir, 'rules.md').includes('- Support Safari 15+'), 'project rules carried over');
  for (const rel of ['brain.json', 'decisions/README.md', 'memory/proposed/README.md', 'skills/implement-feature/SKILL.md']) {
    assert.ok(exists(dir, rel), rel);
  }
  assert.ok(m.kept.some(k => k.startsWith('ai-brain/project-history.md')));

  const after = await loadProjectContext(dir);
  assert.equal(after.layout, 2);
  assert.equal(after.goal, 'A booking app for clinics');
  assert.ok(after.rules.includes('Support Safari 15+'));
  cleanup(dir);
});

test('matchesTemplate - placeholders match one line; any other change does not', () => {
  const t = '# Brain — {{PROJECT_NAME}}\n- Date: {{DATE}}\n';
  assert.ok(matchesTemplate('# Brain — shop\r\n- Date: 2026-01-01\n', t));
  assert.ok(!matchesTemplate('# Brain — shop\n- Date: 2026-01-01\n- extra\n', t));
});

test('active task - pointer is archived when replaced or done, and only an active one counts', async () => {
  const dir = tempProject();
  await bootstrapper.init(dir, { noAgentation: true, noGraphify: true });
  const task = (name) => `# Active Task\n\n- **Task**: ${name}\n- **Status**: active\n- **Started**: 2026-11-09\n`;

  writeActiveTask(dir, task('first'));
  const second = writeActiveTask(dir, task('second'));
  assert.ok(second.archived.includes('first'));
  assert.equal(readActiveTask(dir).task, 'second');
  assert.equal((await loadProjectContext(dir)).activeTask.task, 'second');

  fs.writeFileSync(path.join(dir, 'ai-brain', 'local', 'active-task.md'), task('third').replace('active', 'done'), 'utf8');
  const ctx = await loadProjectContext(dir);
  assert.equal(ctx.activeTask, null, 'a finished task is ignored');
  assert.ok(ctx.warnings.some(w => w.includes('gaw task done')));

  assert.ok(archiveActiveTask(dir, 'done'));
  assert.equal(readActiveTask(dir), null);
  // "first" (replaced) and "third" (done); "second" was overwritten directly above
  assert.equal(fs.readdirSync(path.join(dir, 'ai-brain', 'local', 'archive')).length, 2);
  cleanup(dir);
});

test('skills - one animation library per task, chosen from the project dependencies', async () => {
  const orchestrator = new SkillOrchestrator(new SkillRegistry());
  const withMotion = { dependencies: ['react', 'motion'] };

  const loaded = await orchestrator.loadSkillsForTask('add a masked word reveal on scroll to the hero headline', withMotion);
  const ids = loaded.skills.map(s => s.id);
  assert.ok(ids.includes('motion-dev'), 'the installed library is used');
  assert.ok(!ids.includes('masked-reveal'));
  assert.ok(loaded.excludedSkills.some(e => e.id === 'masked-reveal' && e.reason.includes('motion')));

  // Named explicitly: both are kept, with a conflict note
  const explicit = await orchestrator.loadSkillsForTask('motion-dev animejs', withMotion);
  assert.deepEqual(explicit.skills.map(s => s.id), ['motion-dev', 'animejs']);
  assert.ok(explicit.conflictResolutions.some(c => c.resolution.includes('prefer motion-dev')));

  // The pointer lists files, reasons and checks, never skill bodies
  const pointer = orchestrator.formatTaskPointer(loaded, { projectInfo: { framework: 'react-vite', languages: ['JavaScript'], hasUi: true, uiLibraries: [] } });
  assert.ok(pointer.includes('- **Status**: active'));
  assert.ok(pointer.includes('## Left out'));
  assert.ok(pointer.includes('accessibility-baseline'), 'UI tasks point to the shared accessibility baseline');
  assert.ok(pointer.includes('JavaScript · plain CSS'), 'tells agents to adapt examples to the project stack');
  assert.ok(!pointer.includes('```'), 'no code from the skills');
  assert.ok(pointer.length < 4000, `small: ${pointer.length} chars`);
});

test('lint - broken links, missing supporting files, extra H1s and LaTeX are flagged', () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-lint-')), 'demo-skill');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'SKILL.md'), [
    '---', 'name: demo-skill', 'description: "A demo skill that checks the new body rules of the linter."', 'license: MIT', '---', '',
    '# Skill: Demo', '# Demo', '', 'See [motion](../animation-motion/motion-dev.md) and run `scripts/check.mjs`.',
    'Budget ($\\le$ 100ms).', '', '```bash', 'node scripts/in-a-code-block.mjs', '```', ''
  ].join('\n'), 'utf8');
  const { warnings } = lintSkillFolder(dir);
  assert.ok(warnings.some(w => w.includes('Broken link') && w.includes('motion-dev.md')));
  assert.ok(warnings.some(w => w.includes("doesn't include") && w.includes('scripts/check.mjs')));
  assert.ok(!warnings.some(w => w.includes('in-a-code-block')), 'code examples are not checked');
  assert.ok(warnings.some(w => w.includes('top-level (#) headings')));
  assert.ok(warnings.some(w => w.includes('LaTeX')));
  cleanup(path.dirname(dir));
});

test.after(() => cleanup(globalBrain));
