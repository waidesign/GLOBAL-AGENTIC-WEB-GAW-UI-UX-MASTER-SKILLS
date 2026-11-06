import fs from 'node:fs';
import path from 'node:path';

export class ClaudeCodeAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const target = path.join(projectPath, 'CLAUDE.md');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — CLAUDE CODE CONFIGURATION -->`,
      `# Claude Code Project Guidelines`,
      `- Project Intelligence: ./ai-brain/`,
      `- Architecture Graph: ./graph.json, ./GRAPH_REPORT.md`,
      `- Design Rules: Follow ./ai-brain/rules.md strictly.`,
      `- Framework: ${projectInfo.framework}`,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — CLAUDE CODE CONFIGURATION')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default ClaudeCodeAdapter;

