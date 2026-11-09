import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager, GRAPHIFY_OUT_DIR } from '../../core/graphify-manager/GraphifyManager.js';
import { lintLibrary } from '../../core/skill-registry/SkillLinter.js';

function scaffoldReactProject() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-e2e-project-'));

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
  return tempDir;
}

// Behaves like a machine without Graphify installed.
class NoGraphifyManager extends GraphifyManager {
  getCliVersion() { return null; }
}

test('E2E - gaw init and start on React project without Graphify (optional)', async () => {
  const tempDir = scaffoldReactProject();
  const bootstrapper = new ProjectBootstrapper({
    createGraphifyManager: (dir) => new NoGraphifyManager({ projectRoot: dir })
  });

  // Run init: must succeed without Graphify
  const initRes = await bootstrapper.init(tempDir, { noAgentation: true }); // Avoid npm network install in test
  assert.equal(initRes.projectInfo.framework, 'react-vite');
  assert.equal(initRes.projectInfo.isReact, true);
  assert.ok(initRes.skipped.some(s => s.includes('Graphify')), 'reports the code map as skipped');
  assert.equal(initRes.warnings.length, 0);

  // Check ai-brain directory
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'README.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'context.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'rules.md')), true);
  // Layout 2: brain.json, playbook, design.md (UI project), decisions/, memory/proposed/, local/
  for (const rel of ['brain.json', 'playbook.md', 'design.md', 'decisions/README.md', 'memory/proposed/README.md', 'local/.gitignore']) {
    assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', rel)), true, `ai-brain/${rel}`);
  }
  for (const old of ['identity.md', 'project-history.md', 'global-brain.md']) {
    assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', old)), false, `no ai-brain/${old} in the new layout`);
  }
  const brain = JSON.parse(fs.readFileSync(path.join(tempDir, 'ai-brain', 'brain.json'), 'utf8'));
  assert.equal(brain.layout, 2);
  assert.equal(brain.project.hasUi, true);
  assert.deepEqual(brain.project.languages, ['TypeScript'], 'App.tsx means TypeScript even without tsconfig.json');

  // Starter project skills are GAW Skill Standard folders, short and lint-clean
  for (const name of ['debugging', 'code-review', 'implement-feature', 'testing', 'security-basics']) {
    assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'skills', name, 'SKILL.md')), true, name);
    assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'skills', name, 'gaw.json')), true, name);
  }
  const lint = lintLibrary(path.join(tempDir, 'ai-brain', 'skills'));
  assert.equal(lint.errorCount, 0);
  assert.equal(lint.warningCount, 0, 'starter skills stay under the project-skill size budget');

  // No graph without Graphify
  assert.equal(fs.existsSync(path.join(tempDir, GRAPHIFY_OUT_DIR)), false);

  // Check agent adapters
  assert.equal(fs.existsSync(path.join(tempDir, 'CLAUDE.md')), true);
  assert.equal(fs.existsSync(path.join(tempDir, '.cursorrules')), true);

  // Test idempotency: second init should NOT recreate or overwrite
  const secondInit = await bootstrapper.init(tempDir, { noAgentation: true });
  assert.ok(secondInit.skipped.length > 0);

  // Test start command
  const startRes = await bootstrapper.start(tempDir);
  assert.equal(startRes.hasProjectBrain, true);
  assert.equal(startRes.hasGraph, false);
  assert.ok(startRes.graphStatus.includes('gaw setup'));
  assert.equal(startRes.status, 'Ready');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('E2E - gaw init with --no-graphify skips the code map', async () => {
  const tempDir = scaffoldReactProject();
  const bootstrapper = new ProjectBootstrapper();

  const initRes = await bootstrapper.init(tempDir, { noAgentation: true, noGraphify: true });
  assert.ok(initRes.skipped.some(s => s.includes('Graphify')));
  assert.equal(fs.existsSync(path.join(tempDir, GRAPHIFY_OUT_DIR)), false);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

const graphifyInstalled = new GraphifyManager().isGraphifyCliAvailable();

test('E2E - gaw init builds the Graphify code map when Graphify is installed', {
  skip: graphifyInstalled ? false : 'Graphify CLI not installed (optional)'
}, async () => {
  const tempDir = scaffoldReactProject();
  const bootstrapper = new ProjectBootstrapper();

  const initRes = await bootstrapper.init(tempDir, { noAgentation: true });
  assert.ok(initRes.steps.some(s => s.name === 'Configure Graphify'));

  const graph = GraphifyManager.locateGraph(tempDir);
  assert.ok(graph, 'expected graphify-out/graph.json');
  assert.equal(fs.existsSync(graph.reportPath), true);

  const startRes = await bootstrapper.start(tempDir);
  assert.equal(startRes.hasGraph, true);

  fs.rmSync(tempDir, { recursive: true, force: true });
});
