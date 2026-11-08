import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { GraphifyManager, GRAPHIFY_OUT_DIR } from '../../core/graphify-manager/GraphifyManager.js';

function makeTempProject() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-graphify-test-'));
  fs.writeFileSync(path.join(tempDir, 'index.js'), `import { helper } from './utils.js';\nexport function main() { return helper(); }`, 'utf8');
  fs.writeFileSync(path.join(tempDir, 'utils.js'), `export function helper() { return 42; }`, 'utf8');
  return tempDir;
}

// Writes a graph in the official Graphify format (edges stored as `links`).
function writeOfficialGraph(dir) {
  const outDir = path.join(dir, GRAPHIFY_OUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify({
    directed: true,
    nodes: [{ id: 'main' }, { id: 'helper' }, { id: 'utils.js' }],
    links: [{ source: 'main', target: 'helper' }, { source: 'helper', target: 'utils.js' }]
  }), 'utf8');
  fs.writeFileSync(path.join(outDir, 'GRAPH_REPORT.md'), '# Graph Report', 'utf8');
  fs.writeFileSync(path.join(outDir, 'graph.html'), '<html></html>', 'utf8');
}

// Stands in for the real Graphify CLI so unit tests don't depend on what is installed.
class FakeCliManager extends GraphifyManager {
  constructor(options, { installed = true, writesOutput = true } = {}) {
    super(options);
    this.installed = installed;
    this.writesOutput = writesOutput;
    this.cliRuns = 0;
  }
  getCliVersion() { return this.installed ? 'graphify 0.0.0-test' : null; }
  runGraphifyCli(targetDir) {
    this.cliRuns++;
    if (this.writesOutput) writeOfficialGraph(targetDir);
  }
}

test('GraphifyManager - skips (does not fail) when Graphify is not installed', async () => {
  const tempDir = makeTempProject();
  const manager = new FakeCliManager({ projectRoot: tempDir }, { installed: false });
  const result = await manager.generateGraph({ targetDir: tempDir });

  assert.equal(result.skipped, true);
  assert.equal(result.reason, 'not-installed');
  assert.ok(result.summary.includes('gaw setup'));
  assert.equal(manager.cliRuns, 0);
  assert.equal(fs.existsSync(path.join(tempDir, GRAPHIFY_OUT_DIR)), false);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('GraphifyManager - builds the graph in graphify-out/ and reads Graphify `links`', async () => {
  const tempDir = makeTempProject();
  const manager = new FakeCliManager({ projectRoot: tempDir });
  const result = await manager.generateGraph({ targetDir: tempDir });

  assert.equal(result.reused, false);
  assert.equal(result.jsonPath, path.join(tempDir, GRAPHIFY_OUT_DIR, 'graph.json'));
  assert.equal(result.nodeCount, 3);
  assert.equal(result.edgeCount, 2);
  assert.equal(fs.existsSync(path.join(tempDir, 'graph.json')), false);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('GraphifyManager - reuses an existing graph without re-running Graphify', async () => {
  const tempDir = makeTempProject();
  writeOfficialGraph(tempDir);
  const manager = new FakeCliManager({ projectRoot: tempDir });
  const result = await manager.generateGraph({ targetDir: tempDir });

  assert.equal(result.reused, true);
  assert.equal(manager.cliRuns, 0);

  const forced = await manager.generateGraph({ targetDir: tempDir, force: true });
  assert.equal(forced.reused, false);
  assert.equal(manager.cliRuns, 1);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('GraphifyManager - errors when Graphify produces no graph', async () => {
  const tempDir = makeTempProject();
  const manager = new FakeCliManager({ projectRoot: tempDir }, { writesOutput: false });

  await assert.rejects(manager.generateGraph({ targetDir: tempDir }), /produced no usable graph/);

  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('GraphifyManager - locateGraph only finds graphify-out/graph.json', () => {
  const tempDir = makeTempProject();
  fs.writeFileSync(path.join(tempDir, 'graph.json'), '{"nodes":[{"id":"x"}]}', 'utf8');
  assert.equal(GraphifyManager.locateGraph(tempDir), null);

  writeOfficialGraph(tempDir);
  assert.equal(GraphifyManager.locateGraph(tempDir).jsonPath, path.join(tempDir, GRAPHIFY_OUT_DIR, 'graph.json'));

  fs.rmSync(tempDir, { recursive: true, force: true });
});
