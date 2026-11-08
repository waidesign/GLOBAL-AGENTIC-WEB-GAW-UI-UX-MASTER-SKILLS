import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GUIDED AGENT WORKFLOW — CODEX CONFIGURATION';

export class CodexAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({
      marker: MARKER,
      heading: 'OpenAI Codex Agent Directives',
      extra: [`- Skills for a new task: \`gaw use "<task>"\``]
    });
    return upsertAgentBlock(path.join(projectPath, 'AGENTS.md'), block, MARKER, Boolean(options.dryRun));
  }
}

export default CodexAdapter;
