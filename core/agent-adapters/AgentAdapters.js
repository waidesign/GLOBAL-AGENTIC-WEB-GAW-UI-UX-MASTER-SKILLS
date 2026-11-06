import { ClaudeCodeAdapter } from '../../integrations/claude-code/ClaudeCodeAdapter.js';
import { CursorAdapter } from '../../integrations/cursor/CursorAdapter.js';
import { CodexAdapter } from '../../integrations/codex/CodexAdapter.js';
import { GeminiCliAdapter } from '../../integrations/gemini-cli/GeminiCliAdapter.js';
import { GitHubCopilotAdapter } from '../../integrations/github-copilot/GitHubCopilotAdapter.js';
import { GenericAgentAdapter } from '../../integrations/generic-agents/GenericAgentAdapter.js';

export class AgentAdapters {
  static configureAll(projectPath, projectInfo, options = {}) {
    return {
      claude: ClaudeCodeAdapter.configure(projectPath, projectInfo, options),
      cursor: CursorAdapter.configure(projectPath, projectInfo, options),
      codex: CodexAdapter.configure(projectPath, projectInfo, options),
      gemini: GeminiCliAdapter.configure(projectPath, projectInfo, options),
      copilot: GitHubCopilotAdapter.configure(projectPath, projectInfo, options),
      generic: GenericAgentAdapter.configure(projectPath, projectInfo, options)
    };
  }

  static configureClaudeCode(projectPath, projectInfo, options = {}) {
    return ClaudeCodeAdapter.configure(projectPath, projectInfo, options);
  }

  static configureCursor(projectPath, projectInfo, options = {}) {
    return CursorAdapter.configure(projectPath, projectInfo, options);
  }

  static configureCodex(projectPath, projectInfo, options = {}) {
    return CodexAdapter.configure(projectPath, projectInfo, options);
  }

  static configureGemini(projectPath, projectInfo, options = {}) {
    return GeminiCliAdapter.configure(projectPath, projectInfo, options);
  }

  static configureCopilot(projectPath, projectInfo, options = {}) {
    return GitHubCopilotAdapter.configure(projectPath, projectInfo, options);
  }

  static configureGeneric(projectPath, projectInfo, options = {}) {
    return GenericAgentAdapter.configure(projectPath, projectInfo, options);
  }
}

export default AgentAdapters;
