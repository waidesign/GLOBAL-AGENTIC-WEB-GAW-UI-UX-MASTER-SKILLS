import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { MemoryEngine } from '../../core/memory-engine/MemoryEngine.js';
import { gawHome, userBrainDir, DEFAULT_BRAIN_DIR } from '../../core/memory-engine/paths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_BRAIN = path.resolve(__dirname, '../../brain');

test('MemoryEngine - global brain initialization and precedence', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-brain-test-'));
  const engine = new MemoryEngine({ globalBrainDir: tempDir, projectRoot: tempDir });

  await engine.initGlobalBrain();
  const globalBrain = await engine.getGlobalBrain();

  assert.ok(globalBrain['identity.md']);
  assert.ok(globalBrain['design-principles.md']);
  assert.ok(globalBrain['coding-preferences.md']);

  // Precedence test
  const context = await engine.getHierarchicalContext('Build a button component', tempDir);
  assert.equal(context.precedence[0], '1. User Request (Highest)');
  assert.equal(context.precedence[1], '2. Project Brain (ai-brain/)');
  assert.equal(context.precedence[2], '3. Global Brain (~/.gaw/brain/)');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('Global Brain - lives in the user folder (GAW_HOME), never in the GAW package', () => {
  const engine = new MemoryEngine();
  assert.equal(engine.globalBrainDir, userBrainDir());
  assert.equal(userBrainDir(), path.join(gawHome(), 'brain'));
  assert.notEqual(path.resolve(engine.globalBrainDir), path.resolve(REPO_BRAIN));
  assert.equal(path.resolve(DEFAULT_BRAIN_DIR), path.resolve(REPO_BRAIN));
});

test('Global Brain - seeded from GAW defaults without overwriting the user', async () => {
  const defaults = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-defaults-'));
  const user = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-user-brain-'));
  fs.writeFileSync(path.join(defaults, 'design-principles.md'), '# Default principles', 'utf8');
  fs.writeFileSync(path.join(defaults, 'identity.md'), '# Default identity', 'utf8');
  fs.writeFileSync(path.join(user, 'identity.md'), '# My own identity', 'utf8');

  const engine = new MemoryEngine({ globalBrainDir: user, defaultsDir: defaults });
  await engine.initGlobalBrain();

  assert.equal(fs.readFileSync(path.join(user, 'design-principles.md'), 'utf8'), '# Default principles');
  assert.equal(fs.readFileSync(path.join(user, 'identity.md'), 'utf8'), '# My own identity', 'user file kept');

  // Decisions are written to the user's brain, never to the defaults
  await engine.recordDecision('Testing', 'Use UTC everywhere', 'unit test');
  assert.ok(fs.readFileSync(path.join(user, 'decision-history.md'), 'utf8').includes('Use UTC everywhere'));
  assert.equal(fs.existsSync(path.join(defaults, 'decision-history.md')), false);

  fs.rmSync(defaults, { recursive: true, force: true });
  fs.rmSync(user, { recursive: true, force: true });
});

test('Global Brain - GAW defaults contain no personal decision history', () => {
  const history = fs.readFileSync(path.join(REPO_BRAIN, 'decision-history.md'), 'utf8');
  const rows = history.split('\n').filter(l => /^\|\s*\d{4}-\d{2}-\d{2}/.test(l));
  assert.equal(rows.length, 0, 'brain/decision-history.md must stay an empty template');
});
