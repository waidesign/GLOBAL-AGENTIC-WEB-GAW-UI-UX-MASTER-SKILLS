import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GUIDED AGENT WORKFLOW — GITHUB COPILOT INSTRUCTIONS';

export class GitHubCopilotAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({
      marker: MARKER,
      heading: 'GitHub Copilot Custom Instructions',
      extra: [`- Anti-Slop: Strictly avoid unnecessary layout animations and unrequested gradients.`]
    });
    return upsertAgentBlock(path.join(projectPath, '.github', 'copilot-instructions.md'), block, MARKER, Boolean(options.dryRun));
  }
}

export default GitHubCopilotAdapter;
