import fs from 'node:fs';
import path from 'node:path';

export class GitHubCopilotAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const dir = path.join(projectPath, '.github');
    const target = path.join(dir, 'copilot-instructions.md');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — GITHUB COPILOT INSTRUCTIONS -->`,
      `# GitHub Copilot Custom Instructions`,
      `- Project Intelligence: ./ai-brain/`,
      `- Constraints: Follow ./ai-brain/rules.md.`,
      `- Anti-Slop: Strictly avoid unnecessary layout animations and unrequested gradients.`,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (!dryRun) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — GITHUB COPILOT INSTRUCTIONS')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default GitHubCopilotAdapter;

