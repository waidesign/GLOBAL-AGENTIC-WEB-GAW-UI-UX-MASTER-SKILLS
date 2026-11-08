import path from 'node:path';
import { agentBlock, upsertAgentBlock } from '../shared/agentBlock.js';

const MARKER = 'GLOBAL AGENTIC WEB — CURSOR CONFIGURATION';

export class CursorAdapter {
  static configure(projectPath, projectInfo, options = {}) {
    const block = agentBlock({
      marker: MARKER,
      heading: 'Cursor Project Rules',
      extra: [`- Framework: ${projectInfo.framework}`]
    });
    return upsertAgentBlock(path.join(projectPath, '.cursorrules'), block, MARKER, Boolean(options.dryRun));
  }
}

export default CursorAdapter;
