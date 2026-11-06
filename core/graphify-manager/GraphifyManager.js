import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export class GraphifyManager {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
  }

  isGraphifyCliAvailable() {
    try {
      execSync('graphify --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  async generateGraph(options = {}) {
    const targetDir = options.targetDir || this.projectRoot;
    const force = Boolean(options.force);

    const jsonPath = path.join(targetDir, 'graph.json');
    const htmlPath = path.join(targetDir, 'graph.html');
    const reportPath = path.join(targetDir, 'GRAPH_REPORT.md');

    // Check if graph already exists and reuse only if valid and not empty
    if (!force && fs.existsSync(jsonPath) && fs.existsSync(reportPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        // If the existing graph had 0 nodes, do not reuse - auto regenerate
        if (existingData && Array.isArray(existingData.nodes) && existingData.nodes.length > 0) {
          return {
            reused: true,
            jsonPath,
            htmlPath,
            reportPath,
            nodeCount: existingData.nodes.length,
            edgeCount: existingData.edges?.length || 0,
            summary: `Existing codebase graph is current (${existingData.nodes.length} modules tracked).`
          };
        }
      } catch (e) {
        // Corrupted or empty json, re-generate
      }
    }

    // If external CLI exists, attempt to run it
    if (this.isGraphifyCliAvailable()) {
      try {
        execSync(`graphify .`, { cwd: targetDir, stdio: 'ignore' });
        if (fs.existsSync(jsonPath)) {
          return {
            reused: false,
            cli: true,
            jsonPath,
            htmlPath,
            reportPath,
            summary: 'Generated via external Graphify CLI.'
          };
        }
      } catch (err) {
        // Fall back to built-in deterministic graph generator
      }
    }

    // Built-in deterministic code relationship analyzer
    const analysis = this.analyzeCodebase(targetDir);

    // Write graph.json
    fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2), 'utf8');

    // Write GRAPH_REPORT.md
    const reportContent = this.formatReport(analysis);
    fs.writeFileSync(reportPath, reportContent, 'utf8');

    // Write graph.html (Interactive visual explorer)
    const htmlContent = this.formatHtml(analysis);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');

    return {
      reused: false,
      cli: false,
      jsonPath,
      htmlPath,
      reportPath,
      nodeCount: analysis.nodes.length,
      edgeCount: analysis.edges.length,
      summary: `Analyzed ${analysis.nodes.length} files/modules with ${analysis.edges.length} relationships.`
    };
  }

  analyzeCodebase(targetDir) {
    const nodes = [];
    const edges = [];
    const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'ai-brain', '.gemini']);

    const scanFiles = (dir) => {
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch (e) {
        return;
      }

      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!ignoreDirs.has(entry.name)) {
            scanFiles(path.join(dir, entry.name));
          }
        } else if (entry.isFile() && /\.(js|jsx|ts|tsx|mjs|cjs|vue|svelte|json|md)$/i.test(entry.name)) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(targetDir, fullPath).replace(/\\/g, '/');
          
          let content = '';
          try {
            content = fs.readFileSync(fullPath, 'utf8');
          } catch (e) {
            continue;
          }

          // Simple regex-based AST relationship detection for imports & exports
          const imports = [];
          const importRegex = /(?:import|from|require)\s*\(?['"]([^'"]+)['"]\)?/g;
          let match;
          while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
          }

          // Component / function declarations
          const functions = [];
          const funcRegex = /(?:function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>))/g;
          while ((match = funcRegex.exec(content)) !== null) {
            functions.push(match[1] || match[2]);
          }

          const node = {
            id: relPath,
            label: path.basename(relPath),
            type: entry.name.endsWith('.md') ? 'doc' : (entry.name.endsWith('.json') ? 'config' : 'code'),
            size: content.length,
            functions: functions.slice(0, 10),
            importCount: imports.length
          };
          nodes.push(node);

          for (const imp of imports) {
            edges.push({
              source: relPath,
              target: imp,
              type: 'imports'
            });
          }
        }
      }
    };

    scanFiles(targetDir);

    // Identify God Nodes (most imported / most connected)
    const inDegree = {};
    for (const e of edges) {
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }

    const hubs = Object.entries(inDegree)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([target, count]) => ({ target, count }));

    return {
      timestamp: new Date().toISOString(),
      nodes,
      edges,
      hubs
    };
  }

  formatReport(analysis) {
    let md = `# GRAPHIFY — PROJECT ARCHITECTURE & RELATIONSHIP REPORT\n\n`;
    md += `Generated at: ${analysis.timestamp}\n\n`;
    md += `## Codebase Overview\n`;
    md += `- **Total Tracked Modules/Files**: ${analysis.nodes.length}\n`;
    md += `- **Total Discovered Relationships**: ${analysis.edges.length}\n\n`;

    md += `## Central Hubs & Key Dependencies (God Nodes)\n`;
    if (analysis.hubs && analysis.hubs.length > 0) {
      for (const hub of analysis.hubs) {
        md += `- \`${hub.target}\` (referenced by ${hub.count} modules)\n`;
      }
    } else {
      md += `*No high-density central hubs detected.*\n`;
    }
    md += `\n`;

    md += `## Discovered Entry Points & Modules\n\n`;
    md += `| File | Type | Functions/Components | Imports |\n`;
    md += `|---|---|---|---|\n`;
    for (const n of analysis.nodes.slice(0, 20)) {
      md += `| \`${n.id}\` | ${n.type} | ${n.functions.join(', ') || '-'} | ${n.importCount} |\n`;
    }
    if (analysis.nodes.length > 20) {
      md += `| *...and ${analysis.nodes.length - 20} more files* | | | |\n`;
    }

    return md;
  }

  formatHtml(analysis) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Graphify — Codebase Relationship Graph</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    h1 { color: #38bdf8; font-size: 1.5rem; margin-bottom: 8px; }
    .badge { display: inline-block; padding: 4px 8px; background: #1e293b; border-radius: 4px; font-size: 0.85rem; margin-right: 8px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #334155; font-size: 0.9rem; }
    th { color: #94a3b8; }
    code { font-family: monospace; color: #a5f3fc; }
  </style>
</head>
<body>
  <h1>Graphify Codebase Architecture Explorer</h1>
  <div>
    <span class="badge">Nodes: ${analysis.nodes.length}</span>
    <span class="badge">Edges: ${analysis.edges.length}</span>
    <span class="badge">Updated: ${analysis.timestamp.split('T')[0]}</span>
  </div>
  <div class="card">
    <h2>Architecture Nodes</h2>
    <table>
      <thead>
        <tr><th>Path</th><th>Type</th><th>Key Identifiers</th><th>Imports</th></tr>
      </thead>
      <tbody>
        ${analysis.nodes.map(n => `<tr><td><code>${n.id}</code></td><td>${n.type}</td><td>${n.functions.join(', ') || '-'}</td><td>${n.importCount}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  }
}

export default GraphifyManager;

