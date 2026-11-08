# Claude Code Integration

## Overview
Connects Anthropic's Claude Code CLI with the Guided Agent Workflow ecosystem.

## How it Works
1. Generates or safely merges instructions into `CLAUDE.md`.
2. Connects Claude Code to `./ai-brain/` and the codebase relationship graph (`graph.json`).
3. Connects over MCP by adding `mcp/server.js` to `claude.json`.

