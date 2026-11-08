# CLAUDE.md — Project Memory & Handoff Context

> **Project**: Global Agentic Web (GAW)  
> **Repository**: `E:\global-agentic-web`  
> **Remote**: `https://github.com/waidesign/GLOBAL-AGENTIC-WEB-GAW-UI-UX-MASTER-SKILLS.git` (`main`)  
> **Runtime**: Node.js >= 18 (ESM modules: `"type": "module"`). Optional, recommended: the Graphify CLI (Python 3.10+; `gaw setup` or `uv tool install graphifyy`)  
> **Role**: Centralized UI/UX Master Skills Ecosystem, Global Memory Engine, Real-World Design Presets Library & Universal Project Bootstrapper.

---

## ⚡ Quick Start for Claude Code

Do **NOT** read through the 235 skill files or 63 design files on startup. Use this architectural memory map:

### Common Commands
```bash
npm test                 # Run the test suite (12 test suites in scripts/run-tests.js)
node bin/gaw.js skills lint   # Check all skills against the GAW Skill Standard (docs/gss/spec.md)
node bin/gaw.js skills index  # Rebuild skills/index.json after adding/editing skills (a test fails if stale)
npm run eval             # Skill selection benchmark vs eval/baseline.json (run after any skill/search change)
node bin/gaw.js doctor   # Verify runtime, 235 registered skills, and 63 design presets
node bin/gaw.js recommend "<task prompt>"   # Test skill & design recommendations
node bin/gaw.js use "<task>" --inject       # Test injection into ai-brain/
```

---

## 🗺️ Codebase Architecture & File Directory

```
global-agentic-web/
├── bin/
│   └── gaw.js                   # CLI binary entry point (wraps GawCli)
├── cli/
│   ├── index.js                 # Central CLI controller (routes all gaw commands)
│   ├── interactive.js           # gaw init onboarding: goal, matching skills, rules, Graphify
│   └── graphify-setup.js        # Explains Graphify and asks before installing it
├── core/
│   ├── orchestrator/
│   │   └── SkillOrchestrator.js # Recommendation engine & task analyzer
│   ├── skill-registry/
│   │   ├── SkillRegistry.js     # Loads GSS skills (and legacy .md) via skills/index.json; bodies load lazily
│   │   ├── SkillLinter.js       # GAW Skill Standard (GSS) validation: gaw skills lint
│   │   └── frontmatter.js       # Zero-dep YAML-subset frontmatter reader/writer
│   ├── preset-registry/
│   │   └── PresetRegistry.js    # Indexer, search & semantic matcher for presets/designs/
│   ├── skill-discovery/
│   │   └── SkillDiscovery.js    # Weighted token search & relevance scoring
│   ├── bootstrapper/
│   │   └── ProjectBootstrapper.js# 7-step gaw init lifecycle engine
│   ├── memory-engine/
│   │   └── MemoryEngine.js      # Global Brain & Project Brain precedence engine
│   ├── project-detector/
│   │   └── ProjectDetector.js   # Detects framework (Next, React, Vue, Svelte), lang, pkg mgr
│   ├── graphify-manager/
│   │   ├── GraphifyManager.js   # Runs the optional Graphify CLI, reads graphify-out/
│   │   ├── GraphifyInstaller.js # Installs uv + Graphify (callers get consent first)
│   │   └── toolLocator.js       # Finds tools on PATH or in ~/.local/bin
│   ├── agentation-manager/
│   │   └── AgentationManager.js # React dev-only visual feedback overlay manager
│   └── agent-adapters/
│       └── AgentAdapters.js     # Configures CLAUDE.md, .cursorrules, AGENTS.md, GEMINI.md
├── brain/                       # Central Global Brain cross-project memory
│   ├── identity.md              # Engineer persona & core values
│   ├── design-principles.md     # Non-negotiable anti-slop principles & WCAG 2.2 AA standards
│   ├── coding-preferences.md    # TypeScript first, token architecture, modular patterns
│   ├── decision-history.md      # Historical log of confirmed architectural decisions
│   └── workflow-preferences.md  # Verification & safe update protocols
├── skills/                      # 235 GSS skills: <category>/<name>/SKILL.md + gaw.json, plus index.json
├── presets/
│   └── designs/                 # 63 real-world design presets from ui.gradientdeck.com
├── templates/
│   └── ai-brain/                # Starter files copied to target projects on gaw init
├── mcp/
│   └── server.js                # Model Context Protocol stdio server for AI agents
├── scripts/
│   ├── run-tests.js             # Native Node.js test runner
│   ├── ingest-skills-sh.mjs     # Web/Git scraper for skills.sh
│   └── ingest-gradientdeck.mjs  # Scraper & formatter for ui.gradientdeck.com
└── tests/                       # Unit & integration test suites
```

---

## 🧠 Core Systems & How They Work

### 1. Progressive Skill Orchestration (`core/orchestrator/`)
- **`gaw recommend "<task>"`**: Analyzes prompt against project framework, scores skills using `SkillDiscovery`, and returns:
  - 🎯 **Primary Skills (Top 3)**
  - 🛠️ **Supporting Skills (Next 3)**
  - 🔗 **Resolved Dependencies**
  - ⚠️ **Anti-Slop Conflict Resolutions**
  - 🎨 **Recommended Design Presets** (with direct live website links)
- **`gaw use "<task>"`**:
  - Supports natural language task prompts: `gaw use "Build a SaaS Landing page"`
  - Supports explicit skill IDs: `gaw use "<landing-page>, <pricing-page>"`
  - Flag `--inject` (or `--save`): Writes compiled skills to `ai-brain/active-skills.md` AND recommended design preset to `ai-brain/design.md`.
  - Flag `--copy`: Copies compiled instructions directly to system clipboard.

### 1b. Skill Engine & GAW Skill Standard (`core/skill-discovery/`, `core/skill-registry/`)
- **GSS**: skills are folders `skills/<category>/<name>/SKILL.md` (standard Agent Skills frontmatter, GAW data in `metadata.gaw-*`) + optional `gaw.json` contract (keywords, dependsOn, frameworks, verification, source). Spec: `docs/gss/spec.md`.
- **Matching** (`SkillDiscovery.findRelevant`): metadata only (never skill bodies), rare words weigh more (IDF), a skill must cover enough of the task (or of one part of a multi-part task), and nothing is returned when nothing fits. `explainMatch()` gives the "Why" shown to users.
- **Loading** (`SkillOrchestrator.loadSkillsForTask`): at most 4 skills, full bodies within a token budget (default 8000), short form + file path beyond it. Design presets only for UI tasks.
- Tune with `npm run eval`; don't change thresholds without checking the score and the no-match cases.

### 2. GradientDeck Design Presets Library (`core/preset-registry/`, `presets/designs/`)
- 63 real-world design archetypes (Railway, Stripe Press, Tailwind CSS, Mollie, Cloudflare, Linear, etc.).
- Every preset stores `liveUrl` (official site) and `previewUrl` (GradientDeck).
- Commands:
  - `gaw designs` / `gaw presets`: List all presets with live links.
  - `gaw designs search "<query>"`: Search by aesthetic, keyword, or industry.
  - `gaw designs --theme dark|light`: Filter by theme.
  - `gaw design <id>`: Inspect palette (ANSI terminal swatches), typography, and live links.
  - `gaw design <id> --apply`: Writes directly to project `ai-brain/design.md`.
  - `gaw design <id> --open`: Opens live inspiration website in default browser.
  - `gaw design <id> --deck`: Opens GradientDeck style page in browser.

### 3. Memory Precedence Hierarchy (`core/memory-engine/`)
Always enforce this strict order when resolving conflicts:
1. **Explicit User Instruction** (Immediate conversation prompt)
2. **Project Brain** (`./ai-brain/rules.md` and `./ai-brain/context.md`)
3. **Global Brain** (`brain/design-principles.md` and `brain/coding-preferences.md`)
4. **Specialized Skill Instructions**
5. **Framework & Tool Defaults**

### 4. Project Bootstrapping (`core/bootstrapper/ProjectBootstrapper.js`)
When `gaw init` runs in any target project, it executes 7 steps:
1. **Inspect & Identify**: Scans framework, languages, and package manager.
2. **Connect Global Brain**: Binds cross-project rules.
3. **Create Project Brain**: Generates local `ai-brain/` directory.
4. **Configure Graphify** (optional): If Graphify is missing, `gaw init` explains it and asks to install it (`cli/graphify-setup.js`). Non-interactive runs and MCP never install. When available, runs Graphify in code-only mode, writing `graphify-out/graph.json`, `graph.html`, and `GRAPH_REPORT.md`. Otherwise the step is skipped.
5. **Configure Agentation**: Injects dev-only visual feedback overlay if React.
6. **Configure AI Agent Adapters**: Updates `CLAUDE.md`, `.cursorrules`, `AGENTS.md`, `GEMINI.md`.
7. **Recommend Starter Skills**: Identifies the top skills for the detected stack (non-interactive runs only).

In a terminal, init then runs onboarding (`cli/interactive.js`), designed for any kind of project, not only UI: goal → `ai-brain/context.md`, skills that closely match the goal (`SkillDiscovery.findRelevant`) → `ai-brain/active-skills.md`, rules → `ai-brain/rules.md`, then Graphify if missing.

---

## 🚫 Anti-Slop Non-Negotiables (`brain/design-principles.md`)

When writing UI code or reviewing designs:
1. **Rule 1.9 (Header & Eyebrow Discipline)**: Never automatically prepend eyebrow badges, eyebrow text, kicker labels, announcement banners, or top pills above headers (`<h1>`, `<h2>`) as boilerplate decoration. Headings must carry visual hierarchy through scale, weight, and spacing alone. Include an eyebrow element or top pill only when strictly necessary or explicitly requested by the user.
2. **Rule 1.5 (No Unnecessary Gradient Header Text)**: Headings must use solid, high-contrast typography tokens (`color.text.primary`). Strictly forbid unnecessary gradient text fills (`text-transparent bg-clip-text bg-gradient-...`) on header colors unless explicitly requested.
3. **Performance**: Animations must be strictly compositor-only (`transform`, `opacity`), capped at 300ms, and disabled under `prefers-reduced-motion`. Never animate `width`, `height`, `margin`, or `padding`.
4. **Contrast & A11y**: WCAG 2.2 AA minimum: 4.5:1 for body copy, 3:1 for large display text and essential UI component boundaries. No text shadows. No emojis in product UI.

---

## 🛠️ Testing & Development Guidelines

- **Dependencies**: GAW runs natively on modern Node.js using ESM. The only npm dependency is `@modelcontextprotocol/sdk`. The Graphify CLI (Python) is an optional external tool; the e2e test that uses real Graphify is skipped without it.
- **Run tests before committing**: `npm test` executes the 12 native test suites in `tests/`.
- **Measure skill selection changes**: `npm run eval` scores skill picks on `eval/cases/skill-selection.json` and compares with `eval/baseline.json`. Only update the baseline (`npm run eval -- --save-baseline`) when a change is an intended improvement.
- **Git workflow**: Main branch is `main`. Remote is `origin` (`https://github.com/waidesign/GLOBAL-AGENTIC-WEB-GAW-UI-UX-MASTER-SKILLS.git`).
- **Global Path Wiring**: On this machine, `C:\Users\ITUSER\.gemini\antigravity\bin\gaw.cmd` and `gaw.ps1` execute `node "E:\global-agentic-web\bin\gaw.js" %*`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
