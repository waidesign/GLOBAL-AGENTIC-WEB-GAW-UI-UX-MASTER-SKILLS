import fs from 'node:fs';
import path from 'node:path';

/**
 * The GAW section written into agent instruction files (CLAUDE.md, .cursorrules,
 * AGENTS.md, GEMINI.md, copilot-instructions.md, AGENT_INSTRUCTIONS.md). Every
 * adapter uses the same lines, so all agents get the same project context.
 */
export function agentBlock({ marker, heading, extra = [] }) {
  return [
    `<!-- ${marker} -->`,
    `# ${heading}`,
    `- Project Brain: ./ai-brain/ (goal: context.md, rules: rules.md). Follow ./ai-brain/rules.md.`,
    `- Project skills: ./ai-brain/project-skills.md lists the skills chosen for this project. Open a skill only when the task needs it.`,
    `- Current task skills: prioritize ./ai-brain/active-skills.md when present.`,
    `- Code graph: ./graphify-out/graph.json and GRAPH_REPORT.md (if present; build with \`gaw graph\`).`,
    `- GAW over MCP (if connected): get_project_context, load_project_skills (skills for the current task).`,
    `- Precedence: user request > ./ai-brain/rules.md > Global Brain (~/.gaw/brain) > skills > tool defaults.`,
    ...extra,
    `<!-- END GLOBAL AGENTIC WEB -->`,
    ''
  ].join('\n');
}

/**
 * Write or refresh the GAW section in an agent file. An existing section (found by
 * its marker) is replaced in place, so instructions stay current; everything else
 * in the file is kept. Returns { target, action: created | merged | updated | unchanged }.
 */
export function upsertAgentBlock(target, block, marker, dryRun = false) {
  if (!fs.existsSync(target)) {
    if (!dryRun) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, block, 'utf8');
    }
    return { target, action: 'created' };
  }

  const existing = fs.readFileSync(target, 'utf8');
  const start = existing.indexOf(`<!-- ${marker} -->`);
  if (start === -1) {
    if (!dryRun) fs.writeFileSync(target, `${block}\n${existing}`, 'utf8');
    return { target, action: 'merged' };
  }

  const endMarker = '<!-- END GLOBAL AGENTIC WEB -->';
  const endIdx = existing.indexOf(endMarker, start);
  const end = endIdx === -1 ? existing.length : endIdx + endMarker.length;
  const updated = `${existing.slice(0, start)}${block.trimEnd()}${existing.slice(end)}`;
  if (updated === existing) return { target, action: 'unchanged' };
  if (!dryRun) fs.writeFileSync(target, updated, 'utf8');
  return { target, action: 'updated' };
}
