import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';

test('E2E - gaw init and start on React project', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-e2e-project-'));

  // Scaffold a minimal React/Vite project structure
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
    name: 'test-saas-app',
    version: '0.1.0',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      vite: '^5.0.0'
    }
  }, null, 2), 'utf8');

  const srcDir = path.join(tempDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });
  fs.writeFileSync(path.join(srcDir, 'App.tsx'), `import React from 'react';\nexport default function App() { return <div>App</div>; }`, 'utf8');

  const bootstrapper = new ProjectBootstrapper();

  // Run init
  const initRes = await bootstrapper.init(tempDir, { noAgentation: true }); // Avoid npm network install in test
  assert.equal(initRes.projectInfo.framework, 'react-vite');
  assert.equal(initRes.projectInfo.isReact, true);

  // Check ai-brain directory
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'README.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'context.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'rules.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'skills', 'code-generation.md')), true);

  // Check graph outputs
  assert.equal(fs.existsSync(path.join(tempDir, 'graph.json')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'GRAPH_REPORT.md')), true);

  // Check agent adapters
  assert.equal(fs.existsSync(path.join(tempDir, 'CLAUDE.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, '.cursorrules')), true);

  // Test idempotency: second init should NOT recreate or overwrite
  const secondInit = await bootstrapper.init(tempDir, { noAgentation: true });
  assert.ok(secondInit.skipped.length > 0);

  // Test start command
  const startRes = await bootstrapper.start(tempDir);
  assert.equal(startRes.hasProjectBrain, true);
  assert.equal(startRes.hasGraph, true);
  assert.equal(startRes.status, 'Ready');

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

