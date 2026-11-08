import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GUIDED AGENT WORKFLOW — GENERIC AGENT INSTRUCTIONS';

export class GenericAgentAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({ marker: MARKER, heading: 'Universal Agent Instructions' });
    return upsertAgentBlock(path.join(projectPath, 'AGENT_INSTRUCTIONS.md'), block, MARKER, Boolean(options.dryRun));
  }
}

export default GenericAgentAdapter;
