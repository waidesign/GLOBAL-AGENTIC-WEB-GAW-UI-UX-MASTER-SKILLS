import fs from 'node:fs';
import path from 'node:path';

// Section markers. GAW was called "Global Agentic Web" before; agent files written
// then use the old prefix, so it is still recognized and replaced in place.
export const MARKER_PREFIX = 'GUIDED AGENT WORKFLOW';
const LEGACY_MARKER_PREFIX = 'GLOBAL AGENTIC WEB';
const END_MARKER = `<!-- END ${MARKER_PREFIX} -->`;
const LEGACY_END_MARKER = `<!-- END ${LEGACY_MARKER_PREFIX} -->`;

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
    `- Global Brain (the user's preferences across all projects): ./ai-brain/global-brain.md, a read-only summary of ~/.gaw/brain.`,
    `- Project skills: ./ai-brain/project-skills.md lists the skills chosen for this project. Open a skill only when the task needs it.`,
    `- Current task skills: prioritize ./ai-brain/active-skills.md when present.`,
    `- Code graph: ./graphify-out/graph.json and GRAPH_REPORT.md (if present; build with \`gaw graph\`).`,
    `- GAW over MCP (if connected): get_project_context, load_project_skills (skills for the current task).`,
    `- Precedence: user request > ./ai-brain/rules.md > Global Brain (~/.gaw/brain) > skills > tool defaults.`,
    ...extra,
    END_MARKER,
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
  let start = existing.indexOf(`<!-- ${marker} -->`);
  if (start === -1) start = existing.indexOf(`<!-- ${marker.replace(MARKER_PREFIX, LEGACY_MARKER_PREFIX)} -->`);
  if (start === -1) {
    if (!dryRun) fs.writeFileSync(target, `${block}\n${existing}`, 'utf8');
    return { target, action: 'merged' };
  }

  // The section ends at the first end marker after it, old or new name
  const ends = [END_MARKER, LEGACY_END_MARKER]
    .map(m => ({ m, i: existing.indexOf(m, start) }))
    .filter(e => e.i !== -1)
    .sort((a, b) => a.i - b.i);
  const end = ends.length ? ends[0].i + ends[0].m.length : existing.length;
  const updated = `${existing.slice(0, start)}${block.trimEnd()}${existing.slice(end)}`;
  if (updated === existing) return { target, action: 'unchanged' };
  if (!dryRun) fs.writeFileSync(target, updated, 'utf8');
  return { target, action: 'updated' };
}
