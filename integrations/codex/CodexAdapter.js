import fs from 'node:fs';
import path from 'node:path';

export class CodexAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const target = path.join(projectPath, 'AGENTS.md');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — CODEX CONFIGURATION -->`,
      `# OpenAI Codex Agent Directives`,
      `- Project Intelligence: ./ai-brain/`,
      `- Memory & Rules: ./ai-brain/rules.md`,
      `- Central Skills: \`gaw use "<task>"\``,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — CODEX CONFIGURATION')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default CodexAdapter;

