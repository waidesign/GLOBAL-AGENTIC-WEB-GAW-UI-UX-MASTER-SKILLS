import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GLOBAL AGENTIC WEB — CLAUDE CODE CONFIGURATION';

export class ClaudeCodeAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({
      marker: MARKER,
      heading: 'Claude Code Project Guidelines',
      extra: [`- Framework: ${projectInfo.framework}`]
    });
    return upsertAgentBlock(path.join(projectPath, 'CLAUDE.md'), block, MARKER, Boolean(options.dryRun));
  }
}

export default ClaudeCodeAdapter;
