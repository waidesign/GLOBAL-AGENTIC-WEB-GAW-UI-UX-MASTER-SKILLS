import fs from 'node:fs';
import path from 'node:path';

export class GeminiCliAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const target = path.join(projectPath, 'GEMINI.md');
    const dryRun = Boolean(options.dryRun);

    const banner = [
      `<!-- GLOBAL AGENTIC WEB — GEMINI CLI CONFIGURATION -->`,
      `# Gemini CLI Project Directives`,
      `- Project Intelligence: ./ai-brain/`,
      `- Active Task Skills: Prioritize ./ai-brain/active-skills.md when present.`,
      `- Rules: Follow ./ai-brain/rules.md.`,
      `- Code Graph: ./graphify-out/graph.json (if present; build with \`gaw graph\`)`,
      `<!-- END GLOBAL AGENTIC WEB -->\n`
    ].join('\n');

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      if (existing.includes('GLOBAL AGENTIC WEB — GEMINI CLI CONFIGURATION')) {
        return { target, action: 'already-configured' };
      }
      if (!dryRun) fs.writeFileSync(target, `${banner}\n\n${existing}`, 'utf8');
      return { target, action: 'merged' };
    }

    if (!dryRun) fs.writeFileSync(target, banner, 'utf8');
    return { target, action: 'created' };
  }
}

export default GeminiCliAdapter;

