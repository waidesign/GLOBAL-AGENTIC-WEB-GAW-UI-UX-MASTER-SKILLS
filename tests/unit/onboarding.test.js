import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { runOnboarding, parseSelection, setSection, appendToSection } from '../../cli/interactive.js';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';
import { GraphifyInstaller } from '../../core/graphify-manager/GraphifyInstaller.js';

class NoGraphifyManager extends GraphifyManager {
  getCliVersion() { return null; }
}

const bootstrapper = new ProjectBootstrapper({
  createGraphifyManager: (dir) => new NoGraphifyManager({ projectRoot: dir })
});

async function initProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-onboarding-test-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'demo' }), 'utf8');
  await bootstrapper.init(dir, { noAgentation: true, noGraphify: true });
  return dir;
}

// Answers questions in order; records what was asked.
function scripted(...answers) {
  const asked = [];
  return {
    asked,
    ask: async (q) => { asked.push(q); return answers.length ? answers.shift() : ''; }
  };
}

const read = (dir, file) => fs.readFileSync(path.join(dir, 'ai-brain', file), 'utf8');
const exists = (dir, file) => fs.existsSync(path.join(dir, 'ai-brain', file));
const silent = () => {};

test('parseSelection - Enter keeps all, n keeps none, numbers keep those, junk is invalid', () => {
  assert.deepEqual(parseSelection('', 3), [0, 1, 2]);
  assert.deepEqual(parseSelection('n', 3), []);
  assert.deepEqual(parseSelection('1,3', 3), [0, 2]);
  assert.deepEqual(parseSelection('3 1 3', 3), [2, 0]);
  assert.equal(parseSelection('4', 3), null);
  assert.equal(parseSelection('landing-page', 3), null);
});

test('setSection / appendToSection - edit one section, keep the rest', () => {
  const doc = '# Title\n\n## A\nold\n\n## B\nkeep\n';
  assert.equal(setSection(doc, '## A', 'new'), '# Title\n\n## A\nnew\n\n## B\nkeep\n');
  assert.ok(setSection(doc, '## C', 'added').endsWith('## C\nadded\n'));
  assert.equal(appendToSection(doc, '## A', ['- x']), '# Title\n\n## A\nold\n- x\n\n## B\nkeep\n');
  assert.ok(appendToSection(doc, '## Z', ['- y']).endsWith('## Z\n- y\n'));
});

test('onboarding - UI goal: saves goal, activates matching skills, saves rules', async () => {
  const dir = await initProject();
  const { ask } = scripted('A SaaS landing page with pricing for my startup', '', 'Support Safari 15+', '');

  const res = await runOnboarding({ bootstrapper, projectDir: dir, ask, log: silent });

  assert.ok(read(dir, 'context.md').includes('A SaaS landing page with pricing for my startup'));
  assert.ok(!read(dir, 'context.md').includes('Add an overview of what the application does'));

  // Chosen skills are recorded in the lockfile and listed (not loaded) in the catalog
  const lock = JSON.parse(read(dir, 'skills.lock.json'));
  assert.ok(lock.skills.some(s => s.id === 'landing-page'));
  assert.ok(lock.skills.every(s => s.reason.startsWith('Matches the project goal')));
  const catalog = read(dir, 'project-skills.md');
  assert.ok(catalog.includes('(`landing-page`)'));
  assert.ok(catalog.includes('Open a skill only when the current task needs it'));
  assert.equal(exists(dir, 'active-skills.md'), false, 'no full skill bodies written up front');

  const rules = read(dir, 'rules.md');
  assert.ok(rules.includes('## Project-Specific Rules\n- Support Safari 15+'));
  assert.ok(rules.includes('## 1. Memory Precedence'), 'keeps existing rules');

  assert.equal(res.written.length, 3);
  assert.equal(exists(dir, 'ACTIVE_TASK.md'), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('onboarding - field the library does not cover: no unrelated skills are suggested', async () => {
  const dir = await initProject();
  const { ask, asked } = scripted('Flight control software for a drone in embedded C', 'Follow MISRA C', '');
  const logs = [];

  await runOnboarding({ bootstrapper, projectDir: dir, ask, log: (m) => logs.push(m) });

  assert.equal(exists(dir, 'skills.lock.json'), false);
  assert.ok(logs.join('\n').includes('No skills in the library closely match'));
  assert.ok(!asked.some(q => q.includes('Use these?')), 'does not ask to pick skills');
  assert.ok(read(dir, 'rules.md').includes('- Follow MISRA C'));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('onboarding - picking by number keeps only the chosen skills', async () => {
  const dir = await initProject();
  const { ask } = scripted('A SaaS landing page with pricing for my startup', '2', '');

  await runOnboarding({ bootstrapper, projectDir: dir, ask, log: silent });

  const lock = JSON.parse(read(dir, 'skills.lock.json'));
  assert.equal(lock.skills.length, 1);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('onboarding - skipping everything writes nothing', async () => {
  const dir = await initProject();
  const contextBefore = read(dir, 'context.md');
  const rulesBefore = read(dir, 'rules.md');
  const { ask } = scripted();

  const res = await runOnboarding({ bootstrapper, projectDir: dir, ask, log: silent });

  assert.equal(res.written.length, 0);
  assert.equal(read(dir, 'context.md'), contextBefore);
  assert.equal(read(dir, 'rules.md'), rulesBefore);
  assert.equal(exists(dir, 'skills.lock.json'), false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('onboarding - running twice does not duplicate rules', async () => {
  const dir = await initProject();
  await runOnboarding({ bootstrapper, projectDir: dir, ask: scripted('', 'Use UTC everywhere', '').ask, log: silent });
  await runOnboarding({ bootstrapper, projectDir: dir, ask: scripted('', 'Use UTC everywhere', '').ask, log: silent });

  const rules = read(dir, 'rules.md');
  assert.equal(rules.split('- Use UTC everywhere').length - 1, 1);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('onboarding - Graphify step: declining installs nothing', async () => {
  const dir = await initProject();
  const ran = [];
  const installer = new GraphifyInstaller({ platform: 'linux', locate: () => null, run: (c) => ran.push(c) });
  const { ask, asked } = scripted('', '', 'n');

  await runOnboarding({
    bootstrapper,
    projectDir: dir,
    ask,
    offerGraphify: true,
    graphifyOptions: { manager: new NoGraphifyManager(), installer },
    log: silent
  });

  assert.ok(asked.some(q => q.includes('Install Graphify now?')));
  assert.equal(ran.length, 0);
  fs.rmSync(dir, { recursive: true, force: true });
});
