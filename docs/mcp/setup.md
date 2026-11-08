# Model Context Protocol (MCP) Setup

## Overview
Global Agentic Web provides a native MCP server (`mcp/server.js`) compliant with the Model Context Protocol standard.

## Installation in Coding Assistants

### Antigravity IDE (`~/.gemini/config/mcp_config.json`)
```json
{
  "mcpServers": {
    "global-agentic-web": {
      "command": "node",
      "args": ["E:/master-skills/mcp/server.js"]
    }
  }
}
```

### Claude Code (`claude.json`)
```json
{
  "mcpServers": {
    "gaw": {
      "command": "node",
      "args": ["E:/master-skills/mcp/server.js"]
    }
  }
}
```

### Cursor (`~/.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "global-agentic-web": {
      "command": "node",
      "args": ["E:/master-skills/mcp/server.js"]
    }
  }
}
```

## Available Tools
- `list_skills(category?: string)`
- `search_skills(query: string, category?: string, framework?: string)`
- `get_skill(id: string)`
- `recommend_skills(taskPrompt: string, framework?: string)`
- `load_skills(taskPrompt: string)`
- `get_global_brain()`
- `get_project_context(projectPath?: string)`: validated project context (stack, goal, rules, selected skills, graph, Global Brain). Call it first.
- `get_project_skills(projectPath?: string)`: the project's chosen skills as short entries
- `load_project_skills(taskPrompt: string, projectPath?: string, tokenBudget?: number)`: only the project skills that fit the task
- `select_project_skills(ids: string[], reason?: string, projectPath?: string)`: add skills to the project (after the user agrees)
- `update_project_memory(category: string, decision: string, context: string, projectPath?: string)`
- `initialize_project(projectPath?: string, dryRun?: boolean)`
- `analyze_project(projectPath?: string)`
- `get_project_graph(projectPath?: string, forceRegenerate?: boolean)`
- `get_project_status(projectPath?: string)`

