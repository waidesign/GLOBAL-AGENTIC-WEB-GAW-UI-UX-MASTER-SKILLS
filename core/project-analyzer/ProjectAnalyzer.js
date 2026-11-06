import fs from 'node:fs';
import path from 'node:path';

/**
 * ProjectAnalyzer
 * Deep codebase analysis: component scanning, CSS architecture, route topology, and dependencies.
 */
export class ProjectAnalyzer {
  static analyze(projectDir = process.cwd()) {
    const findings = {
      projectDir,
      totalFiles: 0,
      components: [],
      routes: [],
      styles: [],
      configs: []
    };

    const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'ai-brain', '.gemini']);

    const traverse = (dir) => {
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch (e) {
        return;
      }

      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!ignoreDirs.has(entry.name)) {
            traverse(path.join(dir, entry.name));
          }
        } else if (entry.isFile()) {
          findings.totalFiles++;
          const relPath = path.relative(projectDir, path.join(dir, entry.name)).replace(/\\/g, '/');

          // Detect components
          if (/(?:components|ui|common)\/.*?\.(?:tsx|jsx|vue|svelte)$/i.test(relPath) || /^[A-Z][A-Za-z0-9]+\.(?:tsx|jsx|vue|svelte)$/.test(entry.name)) {
            findings.components.push(relPath);
          }

          // Detect routes
          if (/(?:routes|pages|app)\/.*?\.(?:tsx|jsx|ts|js|vue|svelte)$/i.test(relPath)) {
            findings.routes.push(relPath);
          }

          // Detect styling
          if (/\.(?:css|scss|sass|less|tailwind\.(?:js|ts|json))$/i.test(entry.name)) {
            findings.styles.push(relPath);
          }

          // Detect configs
          if (/(?:config|\.rc)\.[a-z]+$/i.test(entry.name) || entry.name.endsWith('.json')) {
            findings.configs.push(relPath);
          }
        }
      }
    };

    traverse(projectDir);
    return findings;
  }
}

export default ProjectAnalyzer;

