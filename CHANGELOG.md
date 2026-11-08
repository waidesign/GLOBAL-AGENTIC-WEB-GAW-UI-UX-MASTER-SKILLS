# Changelog

All notable changes to the **Global Agentic Web** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **New `gaw init` onboarding for any kind of project**: (1) what are you building → `ai-brain/context.md`, (2) skills that closely match the goal, picked by number → `ai-brain/active-skills.md`, (3) rules agents must always follow → `ai-brain/rules.md`, (4) Graphify, only if missing. It replaces the old questions (pick skill IDs from all 235, external skills, goal).
- **`SkillDiscovery.findRelevant()`**: returns only close matches for a free-text goal, and nothing for fields the library does not cover.
- **Guided Graphify install**: when Graphify is missing, `gaw init` explains what it does and asks whether to install it. It installs with uv, and asks separately before running Astral's uv install script. Non-interactive runs and the MCP server never install anything.
- **`gaw setup`**: install Graphify at any time (`--yes` also installs uv without asking).
- **`gaw init --install-graphify`**: opt in to installing without questions.
- GAW finds Graphify in uv's tool folder (`~/.local/bin`) as well as on `PATH`, so it works right after installing, without a new terminal.

### Changed
- **The code map now comes only from the official Graphify CLI**, which is optional and recommended. Without it, GAW skips the code map. `gaw doctor` shows its status.
- **Graph location**: the graph now lives in `graphify-out/` (`graph.json`, `graph.html`, `GRAPH_REPORT.md`). Agent adapters (`CLAUDE.md`, `.cursorrules`, `GEMINI.md`, `AGENT_INSTRUCTIONS.md`) point there.
- Graphify runs in code-only mode (`graphify extract . --code-only`, then `graphify cluster-only . --no-label`): local parsing, no LLM calls or API keys.
- A failed Graphify run is reported as a warning and no longer stops `gaw init`.

### Removed
- The "add external skills" onboarding question, which downloaded any URL into `ai-brain/skills/` without checks.
- Copying full skill files into `ai-brain/skills/` during onboarding (chosen skills go to `active-skills.md`, like `gaw use --inject`).
- The built-in regex-based graph generator. Its "God Nodes" counted raw import strings (such as `node:fs`), so it often pointed agents to the wrong hubs.

### Fixed
- **Onboarding: accepting the recommended skills saved nothing.** Display names like `"Landing Page (landing-page)"` were looked up as skill IDs.
- **Onboarding: the build goal was never read by agents.** It was saved to `ai-brain/ACTIVE_TASK.md`, which no agent instruction file references. It now goes to `context.md` and `active-skills.md`.
- **Onboarding: piped or typed-ahead answers were lost**, and end of input ended onboarding silently.
- **Skill search matched filler words inside skill IDs** (e.g. "on" inside "animation", "a" almost everywhere), which surfaced unrelated skills for `gaw use`, `gaw search` and `gaw recommend`. Search now ignores filler words and matches whole words or word starts.
- GAW called `graphify .`, which fails when run non-interactively, and looked for output in the project root instead of `graphify-out/`, so the Graphify graph was never used.
- `gaw start` always reported a graph as present.

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

