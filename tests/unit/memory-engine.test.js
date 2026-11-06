import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { MemoryEngine } from '../../core/memory-engine/MemoryEngine.js';

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
  assert.equal(context.precedence[2], '3. Global Brain (brain/)');

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

