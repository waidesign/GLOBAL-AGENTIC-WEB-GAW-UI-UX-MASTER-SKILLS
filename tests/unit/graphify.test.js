import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';

test('GraphifyManager - generates graph.json, graph.html, and GRAPH_REPORT.md', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-graphify-test-'));
  
  // Create sample files
  fs.writeFileSync(path.join(tempDir, 'index.js'), `import { helper } from './utils.js';\nexport function main() { return helper(); }`, 'utf8');
  fs.writeFileSync(path.join(tempDir, 'utils.js'), `export function helper() { return 42; }`, 'utf8');

  const manager = new GraphifyManager({ projectRoot: tempDir });
  const result = await manager.generateGraph({ targetDir: tempDir });

  assert.equal(fs.existsSync(result.jsonPath), true);
  assert.equal(fs.existsSync(result.htmlPath), true);
  assert.equal(fs.existsSync(result.reportPath), true);

  const report = fs.readFileSync(result.reportPath, 'utf8');
  assert.ok(report.includes('GRAPHIFY — PROJECT ARCHITECTURE'));
  assert.ok(report.includes('Total Tracked Modules/Files'));

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});

