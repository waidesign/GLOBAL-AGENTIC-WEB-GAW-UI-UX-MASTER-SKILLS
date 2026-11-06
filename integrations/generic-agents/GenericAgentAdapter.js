import fs from 'node:fs';
import path from 'node:path';

export class GenericAgentAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const target = path.join(projectPath, 'AGENT_INSTRUCTIONS.md');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — GENERIC AGENT INSTRUCTIONS -->`,
      `# Universal Agent Instructions`,
      `- Project Intelligence: ./ai-brain/`,
      `- Precedence: User > ai-brain/rules.md > Global Brain > Skills > Defaults`,
      `- Code Graph: ./graph.json`,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — GENERIC AGENT INSTRUCTIONS')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default GenericAgentAdapter;

