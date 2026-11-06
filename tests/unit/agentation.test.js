import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { AgentationManager } from '../../core/agentation-manager/AgentationManager.js';

test('AgentationManager - skips non-React projects cleanly', () => {
  const manager = new AgentationManager();
  const vueProject = {
    isReact: false,
    framework: 'vue',
    projectPath: '/fake/path'
  };

  const res = manager.configure(vueProject, { dryRun: true });
  assert.equal(res.configured, false);
  assert.equal(res.skipped, true);
  assert.ok(res.reason.includes('Non-React'));
});

test('AgentationManager - injects dev-guarded component into React App', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-react-test-'));
  const srcDir = path.join(tempDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  const appFile = path.join(srcDir, 'App.tsx');
  fs.writeFileSync(appFile, `import React from 'react';

export function App() {
  return (
    <div className="container">
      <h1>Hello App</h1>
    </div>
  );
}
export default App;
`, 'utf8');

  const manager = new AgentationManager({ projectRoot: tempDir });
  const result = manager.injectComponent(tempDir, 'react-vite', false);

  assert.equal(result.injected, true);

  const updatedContent = fs.readFileSync(appFile, 'utf8');
  assert.ok(updatedContent.includes("import { Agentation } from 'agentation';"));
  assert.ok(updatedContent.includes("<Agentation />"));
  assert.ok(updatedContent.includes("import.meta.env.DEV"));

  // Verify idempotency
  const secondPass = manager.injectComponent(tempDir, 'react-vite', false);
  assert.equal(secondPass.alreadyPresent, true);

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

