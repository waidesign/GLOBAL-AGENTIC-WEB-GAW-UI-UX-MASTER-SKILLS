import fs from 'node:fs';
import path from 'node:path';

export class CursorAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const target = path.join(projectPath, '.cursorrules');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — CURSOR CONFIGURATION -->`,
      `# Cursor Project Rules`,
      `- Project Intelligence: ./ai-brain/`,
      `- Code Graph: ./graph.json`,
      `- Rules: Respect ./ai-brain/rules.md before proposing code changes.`,
      `- Framework: ${projectInfo.framework}`,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — CURSOR CONFIGURATION')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default CursorAdapter;

