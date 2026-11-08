import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { findTool, TOOL_ENV } from './toolLocator.js';

// GAW uses the official Graphify CLI (Python package `graphifyy`), which is
// optional but recommended. Graphify writes its output to <project>/graphify-out/.
export const GRAPHIFY_OUT_DIR = 'graphify-out';

export const GRAPHIFY_SETUP_HINT =
  'Graphify is optional but recommended. Add it with: gaw setup   (or manually: uv tool install graphifyy)';

const CLI_TIMEOUT_MS = 5 * 60 * 1000;

export class GraphifyManager {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.cli = undefined; // resolved lazily: { command, version } or null
  }

  /** Paths of the Graphify output files for a project. */
  static graphPaths(dir) {
    const outDir = path.join(dir, GRAPHIFY_OUT_DIR);
    return {
      jsonPath: path.join(outDir, 'graph.json'),
      htmlPath: path.join(outDir, 'graph.html'),
      reportPath: path.join(outDir, 'GRAPH_REPORT.md')
    };
  }

  /** The project's graph paths if graph.json exists, otherwise null. */
  static locateGraph(dir) {
    const paths = GraphifyManager.graphPaths(dir);
    return fs.existsSync(paths.jsonPath) ? paths : null;
  }

  /**
   * Node and edge counts (Graphify stores edges as `links`).
   * Returns null for missing, corrupt or empty graphs.
   */
  static readGraphStats(jsonPath) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (!data || !Array.isArray(data.nodes) || data.nodes.length === 0) return null;
      const edges = data.links || data.edges || [];
      return { nodeCount: data.nodes.length, edgeCount: edges.length };
    } catch (e) {
      return null;
    }
  }

  /** Finds Graphify on PATH or in uv's tool folder. Pass refresh: true after installing it. */
  resolveCli({ refresh = false } = {}) {
    if (refresh || this.cli === undefined) {
      this.cli = findTool('graphify');
    }
    return this.cli;
  }

  /** Installed Graphify version (e.g. "graphify 0.9.104"), or null when not installed. */
  getCliVersion(options) {
    return this.resolveCli(options)?.version || null;
  }

  isGraphifyCliAvailable() {
    return this.getCliVersion() !== null;
  }

  /**
   * Run Graphify in code-only mode (local AST parsing, no LLM calls or API keys),
   * then cluster to write GRAPH_REPORT.md and graph.html.
   */
  runGraphifyCli(targetDir, options = {}) {
    const { command } = this.resolveCli();
    const run = (args) => execSync(`"${command}" ${args}`, {
      cwd: targetDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      env: TOOL_ENV,
      timeout: CLI_TIMEOUT_MS
    });

    // Incremental: re-extract only changed files and rewrite graph, report and HTML
    if (options.incremental && GraphifyManager.locateGraph(targetDir)) {
      try {
        run('update .');
        return 'incremental';
      } catch {
        // fall through to a full build
      }
    }

    try {
      run('extract . --code-only');
    } catch (err) {
      const detail = String(err.stderr || err.message || '').trim().split('\n').slice(-5).join('\n');
      throw new Error(
        `Graphify failed to build the code graph.\n${detail}\n` +
        'If your Graphify is outdated, update it with: uv tool upgrade graphifyy'
      );
    }

    try {
      run('cluster-only . --no-label');
    } catch (e) {
      // Report and HTML are optional; graph.json alone is usable
    }
    return 'full';
  }

  /**
   * Build or reuse the project's code graph. When Graphify is not installed this
   * returns { skipped: true } instead of failing, because Graphify is optional.
   *   force: refresh an existing graph (incremental: only changed files)
   *   full:  rebuild from scratch
   */
  async generateGraph(options = {}) {
    const targetDir = options.targetDir || this.projectRoot;
    const full = Boolean(options.full);
    const force = Boolean(options.force) || full;

    if (!this.isGraphifyCliAvailable()) {
      return {
        skipped: true,
        reason: 'not-installed',
        summary: 'Skipped: Graphify is not installed (optional). Add the code map with: gaw setup'
      };
    }

    // Reuse an existing, non-empty graph unless forced
    if (!force) {
      const existing = GraphifyManager.locateGraph(targetDir);
      const stats = existing && fs.existsSync(existing.reportPath)
        ? GraphifyManager.readGraphStats(existing.jsonPath)
        : null;
      if (stats) {
        return {
          reused: true,
          ...existing,
          ...stats,
          summary: `Existing codebase graph is current (${stats.nodeCount} nodes tracked).`
        };
      }
    }

    const mode = this.runGraphifyCli(targetDir, { incremental: !full }) || 'full';

    const paths = GraphifyManager.graphPaths(targetDir);
    const stats = GraphifyManager.readGraphStats(paths.jsonPath);
    if (!stats) {
      throw new Error(
        `Graphify ran but produced no usable graph at ${path.join(GRAPHIFY_OUT_DIR, 'graph.json')}. ` +
        'Check that the project contains source code that is not excluded by .gitignore or .graphifyignore.'
      );
    }

    return {
      reused: false,
      mode,
      ...paths,
      ...stats,
      summary: `${mode === 'incremental' ? 'Updated' : 'Generated'} via Graphify (${stats.nodeCount} nodes, ${stats.edgeCount} relationships).`
    };
  }
}

export default GraphifyManager;
