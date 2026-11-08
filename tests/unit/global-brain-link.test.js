import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';
import { GLOBAL_PREFERENCE_FILES } from '../../core/project-context/globalBrainLink.js';
import { loadProjectContext } from '../../core/project-context/ProjectContext.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY_TEMPLATES = path.resolve(__dirname, '../../templates/legacy-project-brain');

class NoGraphify extends GraphifyManager { getCliVersion() { return null; } }

function setup() {
  const globalBrain = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-gb-'));
  fs.writeFileSync(path.join(globalBrain, 'design-principles.md'), '# Design\n\n- Prefer clean typography', 'utf8');
  fs.writeFileSync(path.join(globalBrain, 'decision-history.md'),
    '# History\n\n| Timestamp | Category | Decision | Context |\n|---|---|---|---|\n| 2026-01-01 | UI | Use 8px grid | test |\n', 'utf8');
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-gb-project-'));
  fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'demo' }), 'utf8');
  fs.writeFileSync(path.join(project, '.gitignore'), 'node_modules/\n', 'utf8');
  const bootstrapper = new ProjectBootstrapper({
    globalBrainDir: globalBrain,
    createGraphifyManager: (dir) => new NoGraphify({ projectRoot: dir })
  });
  return { globalBrain, project, bootstrapper };
}

const cleanup = (...dirs) => dirs.forEach(d => fs.rmSync(d, { recursive: true, force: true }));

test('init - project brain gets project files only, plus a read-only Global Brain summary', async () => {
  const { globalBrain, project, bootstrapper } = setup();
  await bootstrapper.init(project, { noAgentation: true, noGraphify: true });

  for (const file of GLOBAL_PREFERENCE_FILES) {
    assert.equal(fs.existsSync(path.join(project, 'ai-brain', file)), false, `${file} must not be copied into the project`);
  }
  for (const file of ['context.md', 'rules.md', 'identity.md', 'playbook.md']) {
    assert.ok(fs.existsSync(path.join(project, 'ai-brain', file)), `${file} is a project file`);
  }

  const summary = fs.readFileSync(path.join(project, 'ai-brain', 'global-brain.md'), 'utf8');
  assert.ok(summary.includes('Do not edit'));
  assert.ok(summary.includes('Prefer clean typography'), 'contains the live Global Brain');
  assert.ok(summary.includes('Use 8px grid'), 'contains recent decisions');
  assert.ok(fs.readFileSync(path.join(project, '.gitignore'), 'utf8').includes('ai-brain/global-brain.md'), 'personal summary kept out of git');
  cleanup(globalBrain, project);
});

test('start - the summary follows changes to the Global Brain', async () => {
  const { globalBrain, project, bootstrapper } = setup();
  await bootstrapper.init(project, { noAgentation: true, noGraphify: true });

  fs.writeFileSync(path.join(globalBrain, 'design-principles.md'), '# Design\n\n- Prefer generous whitespace', 'utf8');
  await bootstrapper.start(project);

  const summary = fs.readFileSync(path.join(project, 'ai-brain', 'global-brain.md'), 'utf8');
  assert.ok(summary.includes('Prefer generous whitespace'));
  assert.ok(!summary.includes('Prefer clean typography'));
  cleanup(globalBrain, project);
});

test('update - removes unchanged old copies, keeps edited ones as project choices', async () => {
  const { globalBrain, project, bootstrapper } = setup();
  await bootstrapper.init(project, { noAgentation: true, noGraphify: true });

  // Simulate a project created by an older GAW version
  fs.copyFileSync(path.join(LEGACY_TEMPLATES, 'coding-preferences.md'), path.join(project, 'ai-brain', 'coding-preferences.md'));
  fs.copyFileSync(path.join(LEGACY_TEMPLATES, 'tool-preferences.md'), path.join(project, 'ai-brain', 'tool-preferences.md'));
  fs.appendFileSync(path.join(project, 'ai-brain', 'tool-preferences.md'), '\n- This project uses Bun\n', 'utf8');

  const before = await loadProjectContext(project);
  assert.ok(before.warnings.some(w => w.includes('override your Global Brain')));

  const res = await bootstrapper.update(project);
  assert.deepEqual(res.removedLegacyCopies, ['ai-brain/coding-preferences.md']);
  assert.deepEqual(res.keptProjectOverrides, ['ai-brain/tool-preferences.md']);
  assert.equal(fs.existsSync(path.join(project, 'ai-brain', 'coding-preferences.md')), false);
  assert.ok(fs.readFileSync(path.join(project, 'ai-brain', 'tool-preferences.md'), 'utf8').includes('uses Bun'));
  cleanup(globalBrain, project);
});
