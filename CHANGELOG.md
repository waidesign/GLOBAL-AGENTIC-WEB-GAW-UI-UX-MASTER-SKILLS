# Changelog

All notable changes to the **Global Agentic Web** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-06

### Added
- **Universal Project Bootstrapper (`gaw init`)**: Single command initialization supporting React, Next.js, Vite, Remix, Vue, Svelte, Angular, and HTML/CSS.
- **Skill Registry & Discovery Engine**: 34 authoritative skills indexed across 23 taxonomy categories with full-text scoring, category filtering, and dependency resolution.
- **Progressive Skill Loading (Levels 1–6)**: Low token consumption orchestrator packaging targeted instructions for AI coding assistants.
- **Two-Tier Memory Engine**: Global Brain (`brain/`) and Project Brain (`ai-brain/`) with strict precedence hierarchy and traceable decision history logging.
- **Codebase Graph Intelligence (Graphify)**: Deterministic code dependency and AST relationship analysis outputting `graph.json`, `graph.html`, and `GRAPH_REPORT.md`.
- **Visual Feedback Integration (Agentation)**: Framework-safe development-only component injector strictly excluded from production bundles.
- **Multi-Agent Adapters**: Non-destructive integration adapters for Claude Code (`CLAUDE.md`), Cursor (`.cursorrules`), OpenAI Codex (`AGENTS.md`), Gemini CLI (`GEMINI.md`), GitHub Copilot (`.github/copilot-instructions.md`), and generic markdown agents.
- **Model Context Protocol (MCP) Server**: Full stdio-based MCP server (`mcp/server.js`) exposing 12 tools for Claude Code, Cursor, and MCP clients.
- **Automated Test Suite**: 7 test suites covering unit and integration testing with 100% pass rate.

