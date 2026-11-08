import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GLOBAL AGENTIC WEB — GEMINI CLI CONFIGURATION';

export class GeminiCliAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({ marker: MARKER, heading: 'Gemini CLI Project Directives' });
    return upsertAgentBlock(path.join(projectPath, 'GEMINI.md'), block, MARKER, Boolean(options.dryRun));
  }
}

export default GeminiCliAdapter;
