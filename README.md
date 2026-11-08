# 🌐 GLOBAL AGENTIC WEB (GAW)
### UI/UX Master Skills Repository, Global Brain & Universal Project Bootstrapper

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18-brightgreen.svg)](package.json)
[![MCP: Supported](https://img.shields.io/badge/MCP-Supported-purple.svg)](mcp/server.js)

**Global Agentic Web** is a centralized, reusable, intelligent developer skills ecosystem that connects AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, Copilot) to a structured library of specialized UI/UX skills, persistent cross-project memory (Global Brain), project-specific intelligence (Project Brain), automated codebase graph analysis (Graphify), and visual feedback loops (Agentation).

---

## 📑 TABLE OF CONTENTS
1. [Core Vision](#-core-vision)
2. [Key Capabilities](#-key-capabilities)
3. [Architecture & System Flow](#-architecture--system-flow)
4. [Quick Start & Installation](#-quick-start--installation)
5. [CLI Commands Reference](#-cli-commands-reference)
6. [Centralized Skills Library](#-centralized-skills-library)
7. [Global Brain & Project Brain](#-global-brain--project-brain)
8. [Graphify — Codebase Intelligence](#-graphify--codebase-intelligence)
9. [Agentation — Visual Feedback](#-agentation--visual-feedback)
10. [MCP (Model Context Protocol) Server](#-mcp-model-context-protocol-server)
11. [AI Coding Agent Integrations](#-ai-coding-agent-integrations)
12. [Testing & Verification](#-testing--verification)
13. [Contributing & License](#-contributing--license)

---

## 🎯 CORE VISION

In traditional AI coding workflows, developers constantly repeat prompt constraints, re-explain project context, configure tools from scratch, and suffer from generic "AI aesthetic slop" (meaningless purple gradients, unrequested layout animations, and accessibility violations).

**Global Agentic Web solves this with a unified model:**
> **ONE CENTRAL BRAIN. ONE REUSABLE SKILLS ECOSYSTEM. EVERY PROJECT CONNECTED. EVERY AGENT BETTER INFORMED.**

```
+------------------------------------------------------------------------+
|                   GLOBAL AGENTIC WEB ECOSYSTEM                         |
|                                                                        |
|  +--------------------+   +-------------------+   +-----------------+  |
|  | Central Skills     |   | Global Brain      |   | MCP Server      |  |
|  | (Taxonomy Registry)|   | (Memory Engine)   |   | (Stdio Tooling) |  |
|  +---------+----------+   +---------+---------+   +--------+--------+  |
+------------|------------------------|----------------------|-----------+
             |                        |                      |
             v                        v                      v
+------------------------------------------------------------------------+
|                          LOCAL PROJECT                                 |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  | `gaw init` / Universal Bootstrapper                              |  |
|  +------------------------------------------------------------------+  |
|  | • ai-brain/ (context.md, rules.md, identity.md, playbook.md)      |  |
|  | • Graphify: graphify-out/ (graph.json, graph.html, GRAPH_REPORT) |  |
|  | • Agentation: Dev-only visual feedback (React/Next.js/Vite)     |  |
|  | • Agent Adapters: CLAUDE.md, .cursorrules, AGENTS.md, GEMINI.md  |  |
|  +------------------------------------------------------------------+  |
+------------------------------------------------------------------------+
```

---

## ⚡ KEY CAPABILITIES

- **Single-Command Project Initialization (`gaw init`)**: Instantly inspects the repository, identifies framework (React, Next.js, Vite, Vue, Svelte, Angular, HTML/CSS), installs dependencies, creates `ai-brain/`, configures Graphify, mounts Agentation (dev-only for React), and hooks up AI agent adapters.
- **Progressive Skill Loading (Levels 1–6)**: Instead of flooding the LLM context with hundreds of skills, GAW dynamically discovers, scores, resolves dependencies for, and loads *only* the specific instructions required for the immediate task.
- **Strict Anti-Slop UI Baselines**: Enforces compositor-only animations (`transform`, `opacity`), 60fps interaction budgets, high-contrast typography, and accessible component primitives (Radix, Base UI).
- **Two-Tier Hierarchical Memory**:
  1. *User Prompt* (highest precedence)
  2. *Project Brain* (`ai-brain/rules.md`)
  3. *Global Brain* (`~/.gaw/brain/`)
  4. *Specialized Skills*
  5. *Framework Defaults*
- **MCP Server Ready**: Built on `@modelcontextprotocol/sdk` to provide real-time skill querying, task recommendations, and memory reading to Claude Code, Cursor, and any MCP-compatible agent.
- **Universal Multi-Agent Support**: Out-of-the-box adapters for Claude Code, Cursor, OpenAI Codex, Gemini CLI, and GitHub Copilot.

---

## 🚀 QUICK START & INSTALLATION

### Prerequisites
- Node.js >= 18.0.0
- npm, pnpm, yarn, or bun
- **Optional, recommended: [Graphify](https://github.com/safishamsi/graphify)** (needs Python >= 3.10). It builds a code map that AI agents query instead of reading whole files. `gaw init` explains it and offers to install it for you.

### 1. Install Globally or Link
```bash
git clone https://github.com/your-username/global-agentic-web.git
cd global-agentic-web
npm install
npm link
```

### 2. Verify Installation
```bash
gaw doctor   # also shows whether the optional Graphify CLI is installed
```

### 3. Initialize Any Project
Navigate to any new or existing project and run:
```bash
cd /path/to/my-project
gaw init
```

In a terminal, `gaw init` then runs a short onboarding that works for any kind of project. Press Enter to skip any question:
1. **What are you building?** Saved as the project goal in `ai-brain/context.md`.
2. **Suggested skills:** only skills that closely match your goal are shown, from any field (cloud, testing, architecture, UI, ...). Pick all, some (by number), or none. They are recorded in `ai-brain/skills.lock.json` and listed in the short catalog `ai-brain/project-skills.md`.
3. **Rules your AI agents must always follow**, e.g. "All API endpoints require auth". Saved to `ai-brain/rules.md`.
4. **Graphify code map:** asked only when Graphify is not installed.

Use `--yes` to skip onboarding.

### 4. For Existing Projects
```bash
cd /path/to/my-project
gaw start
```

### 5. Load Targeted Skills for a Task
```bash
gaw use "Build a responsive SaaS dashboard with a sidebar, data table, and smooth animations"
```

---

## 💻 CLI COMMANDS REFERENCE

| Command | Description |
|---|---|
| `gaw init` | Initialize current project with `ai-brain/`, Graphify, Agentation (React), and agent configs. |
| `gaw init --dry-run` | Preview planned initialization changes without writing files. |
| `gaw init --force` | Regenerate configuration files safely. |
| `gaw init --no-agentation` | Skip Agentation installation. |
| `gaw init --install-graphify` | Install Graphify (and uv if needed) without asking. |
| `gaw init --no-graphify` | Skip the Graphify question and the code map. |
| `gaw setup` | Install Graphify later (asks before installing uv). |
| `gaw start` | Resume an already initialized project with verified contexts. |
| `gaw skills [category]` | List all registered skills or filter by category. |
| `gaw skills select <name...>` | Use library skills in this project (`ai-brain/skills.lock.json`); `deselect` removes, `selected` lists. |
| `gaw context [--json]` | Everything GAW knows about this project: stack, goal, rules, skills, graph, Global Brain. |
| `gaw skills add <link\|folder\|file>` | Add any skill to **your personal library** (`~/.gaw/skills/`): converted to GSS, license checked at the source, supporting files copied, split if oversized, indexed. `--project` adds it to `ai-brain/skills/`, `--official` to GAW's own library (for contributors). |
| `gaw skills new "<title>"` | Create a new GSS skill from a template (personal library by default). |
| `gaw skills mine` | List the skills in your personal library. |
| `gaw skills share <name>` | Copy a personal skill into this project (`ai-brain/skills/`) so teammates get it when they clone. |
| `gaw skills pin\|block <name...>` | Prefer skills you trust, or never have a skill suggested (`unpin`, `unblock`, `prefs` to show). |
| `gaw skills lint [folder] [--levels]` | Check skills against the GAW Skill Standard and show their ranking levels. |
| `gaw skills enrich [--apply]` | Fill ranking fields (summary, whenToUse, verification, domains…) from each skill's own text. |
| `gaw skills licenses [--apply]` | Find each imported skill's real license at its source. |
| `gaw skills split <name\|--all> [--apply]` | Move the long parts of oversized skills into `references/` (lossless). |
| `gaw skills repair <name\|--all> [--apply]` | Restore supporting files imported skills are missing (text files; `--include-binary` for all). |
| `gaw designs [search <q>]` | List or search real-world design presets from GradientDeck with live links. |
| `gaw design <id> [--apply]` | Inspect palette & typography, open live inspiration site, or apply to `ai-brain/design.md`. |
| `gaw search "<query>"` | Full-text relevance search across skills, tags, and frameworks. |
| `gaw recommend "<task>"` | Analyze task prompt and output primary, supporting, and dependent skills. |
| `gaw use "<task>"` | Progressively load and format full skill instructions for immediate agent execution. |
| `gaw use "<task>" --inject` | Directly write active skills to `ai-brain/active-skills.md` without copy-pasting. |
| `gaw use "<task>" --copy` | Copy formatted skill instructions directly to OS clipboard. |
| `gaw brain` | Inspect Global Brain preferences and local Project Brain rules. |
| `gaw brain update <cat> <msg>` | Append a confirmed user decision to the Global Brain. |
| `gaw project` | Display deep inspection of project architecture, frameworks, and tools. |
| `gaw graph [--force\|--full]` | Build the Graphify code graph in `graphify-out/` (`--force`: refresh changed files, `--full`: rebuild). |
| `gaw doctor` | Diagnostic health check of runtime, registry, and environment. |
| `gaw update` | Check for updates to skills from upstream sources. |
| `gaw version` | Display GAW version information. |
| `gaw help` | Display CLI help menu. |

---

## 📚 CENTRALIZED SKILLS LIBRARY

Skills are organized into specialized categories under `skills/`:

- **Design Systems (`skills/design-systems/`)**: `build-design-system`, `design-system-boss`, `migrate-to-a-design-system`, `create-design-md`
- **UI/UX & Surfaces (`skills/ui-ux/`)**: `improve-ui`, `design-lab`, `landing-page`, `pricing-page`
- **Frontend & Craft (`skills/frontend/`)**: `frontend-design`, `tailwindcss`
- **Animation & Motion (`skills/animation-motion/`)**: `improve-animations`, `animation-systems`
- **Components & Systems (`skills/systems/`, `skills/shadcn-ui/`)**: `baseline-ui`, `ui-skills-root`, `improve-shadcn`
- **Performance (`skills/performance/`, `skills/react/`)**: `improve-react`, `fixing-motion-performance`
- **Accessibility (`skills/accessibility/`)**: `fixing-accessibility`
- **SEO & Quality (`skills/seo/`)**: `fixing-metadata`
- **3D & Emerging (`skills/3d/`)**: `threejs`

Every skill follows the **GAW Skill Standard (GSS)**, which extends the open Agent Skills `SKILL.md` format, so GAW skills also work in any tool that supports Agent Skills. Each skill is a folder:

```
skills/design-systems/build-design-system/
├── SKILL.md   # standard Agent Skills frontmatter + instructions
└── gaw.json   # optional GSS contract: keywords, dependencies, frameworks, verification...
```

```markdown
---
name: "build-design-system"
description: "Ground up construction of an evidence-based design system..."
license: "MIT"
metadata:
  gaw-title: "Build a Design System"
  gaw-category: "design-systems"
  gaw-author: "arla6ka"
  gaw-version: "1.0.0"
---
```

You never write GSS by hand: `gaw skills add` converts any skill (from GitHub, a folder or a markdown file) and `gaw skills new` creates one from a template. Both check the license, flag skills that can run commands, split oversized skills into `references/`, and update the skill index automatically. See the [GSS spec](docs/gss/spec.md) and the [authoring guide](docs/skills/authoring-guide.md).

### Official skills, your skills, and trust
GAW has two skill libraries:
- **The official library** (`skills/` in this repo): open source, reviewed by GAW maintainers. Everyone with GAW has it. Contribute with a pull request (`gaw skills add <link> --official`).
- **Your personal library** (`~/.gaw/skills/`): skills you add or write. They stay on your computer, survive GAW updates, and every project on your machine can use them. A personal skill with the same name as an official one replaces it for you only (`--override`).

Every skill shows its **trust level**: `official` (reviewed by GAW), `community` (added from someone's GitHub repo, not reviewed by GAW), `personal` (your own), or `project` (in `ai-brain/skills/`). Agents see where a skill comes from, and skills that GAW hasn't reviewed and that can run commands carry a caution. Adding such a skill needs a deliberate "yes" (or `--yes --allow-scripts`).

Your **skill preferences** live in your Global Brain (`~/.gaw/brain/skill-preferences.json`): pinned skills get a small boost when they fit a task (a pin never adds a skill that doesn't fit), and blocked skills are never suggested.

**Sharing with a team:** a project's `ai-brain/skills.lock.json` records where each selected skill came from. If a teammate doesn't have one of your personal skills, GAW tells them; `gaw skills share <name>` copies it into the project so it's committed with the code.

### How GAW picks skills
Ranking is part of the standard: **GSS Ranking v1** ([spec](docs/gss/spec.md#8-ranking-gss-ranking-v1)) publishes which fields count and how, and grades every skill as Findable, Rankable or Precise. A skill must at least say what it does and when to use it to be added.

`gaw use`, `gaw recommend` and onboarding load only skills that **closely match** the task. Rare, specific words count more than common ones, and every pick comes with a reason (*Matched "pricing", "page" (name); "SaaS" (description)*). When nothing fits, GAW loads nothing instead of unrelated skills. Full skill instructions are loaded within a token budget (default 8,000, `--budget` to change). Skills that don't fit are listed in short form with a path the agent can open if needed. Selection quality is measured with `npm run eval`.

---

## 🧠 GLOBAL BRAIN & PROJECT BRAIN

### Global Brain (`~/.gaw/brain/`)
Your cross-project preferences live in **your own folder**, `~/.gaw/brain/`. On first use, GAW copies its default files (from `brain/` in this repo) into it. From then on it reads and writes only your copy, so updating GAW never overwrites your memory and your decisions never end up in GAW's repository. `gaw brain path` shows the location. Set `GAW_HOME` to move it, for example into a synced folder (Dropbox, OneDrive, a private git repo) to share one brain across machines.

**Two layers, never mixed:** `gaw init` doesn't copy your Global Brain into a project. Every project reads the same live Global Brain, and its own `ai-brain/` holds only project things. For agents that can't read outside the project folder, each project gets `ai-brain/global-brain.md`, a generated read-only summary that `gaw start` and `gaw update` keep current. It's personal, so it stays out of git.
- `identity.md`: Engineer persona, anti-slop principles.
- `design-principles.md`: Confirmed design rules (compositor animations, high-contrast text).
- `coding-preferences.md`: TypeScript first, modular architecture, strict types.
- `decision-history.md`: Traceable log of confirmed architectural decisions.
- `workflow-preferences.md`: Test-driven verification, non-destructive file updates.

### Project Brain (`ai-brain/`)
Generated inside each target project by `gaw init`:
```text
ai-brain/
├── README.md           # Project AI overview and link to central GAW
├── context.md          # Real detected framework, languages, UI libs, and hubs
├── identity.md         # Project design direction and visual tone
├── playbook.md         # Recommended design-to-code iteration loop
├── project-history.md  # Project-specific milestone history
├── rules.md            # Non-negotiable local constraints
├── global-brain.md     # Generated, read-only summary of YOUR Global Brain (kept out of git)
├── skills.lock.json    # Library skills this project uses (gaw skills select / deselect)
├── project-skills.md   # Generated short catalog of the project's skills (what agents read)
└── skills/             # Project skills in GSS format (code-generation, review, debugging, seo)
```

### Project skills: chosen per project, loaded only when needed
Each project keeps its own skill selection in `ai-brain/skills.lock.json`, which records each skill's version, why it was chosen, and when. Onboarding fills it from your goal, and `gaw skills select` / `gaw skills deselect` change it. Agents don't get full skills up front. They read `ai-brain/project-skills.md`, a short catalog (about 300 tokens per skill instead of thousands), and open a skill only when a task needs it. Over MCP, `load_project_skills` loads just the project skills that fit the current task.

`gaw context` (and the MCP tool `get_project_context`) shows everything GAW knows about a project in one place: stack, goal, rules, skills, code graph, and where your Global Brain lives. The CLI, the MCP server and every agent file read this same context. `gaw update` refreshes the GAW section of CLAUDE.md, .cursorrules, AGENTS.md and the others in place, so agent instructions never go stale.

---

## 📊 GRAPHIFY — CODEBASE INTELLIGENCE

GAW uses the official [Graphify](https://github.com/safishamsi/graphify) CLI to build a code map. It is **optional but recommended**: AI agents look things up in the map instead of reading whole files, which usually saves tokens on questions about your code.

**Installing it:** when Graphify is missing, `gaw init` explains what it is and asks whether to install it. You can also run `gaw setup` at any time. GAW installs it with [uv](https://docs.astral.sh/uv/), which also sets up Python 3.10+. If uv is missing too, GAW asks separately before running Astral's official uv install script. GAW never installs anything without asking, unless you pass `--install-graphify`. AI agents using the MCP server can't trigger an install.

**Installing it yourself:**
```bash
# 1. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh                          # macOS / Linux
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"   # Windows
# 2. Install Graphify (note the double "y")
uv tool install graphifyy        # or, with Python 3.10+: pip install graphifyy
```

**Without Graphify**, GAW works normally and skips the code map.

GAW runs Graphify in code-only mode, which writes to `graphify-out/`:
1. `graph.json`: Machine-readable graph of code symbols and their relationships.
2. `GRAPH_REPORT.md`: Architectural summary highlighting God Nodes, communities, and entry points.
3. `graph.html`: Interactive browser visualization.

*Code-only mode parses code locally: no LLM calls and no API keys. Add `graphify-out/` to your `.gitignore`, and use a `.graphifyignore` file to exclude folders from the graph.*

---

## 🎨 AGENTATION — VISUAL FEEDBACK

For React projects (Vite, Next.js, Remix), `gaw init` automatically installs `agentation` as a development dependency and configures the component:
- **Vite**: `{import.meta.env.DEV && <Agentation />}`
- **Next.js / Standard React**: `{process.env.NODE_ENV === 'development' && <Agentation />}`

**Guaranteed Safety:** Agentation is strictly tree-shaken and excluded from production builds. It is never installed on non-React projects.

---

## 🔌 MCP (MODEL CONTEXT PROTOCOL) SERVER

GAW includes a full Model Context Protocol server in `mcp/server.js`.

### Connecting to Claude Code or Cursor
Add to your `claude.json` or Cursor MCP settings:
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

### Available MCP Tools
- `list_skills`: Browse skills registry with category filtering.
- `search_skills`: Search skills with relevance ranking.
- `get_skill`: Retrieve full markdown content for a specific skill.
- `recommend_skills`: Get tailored skill recommendations for a task prompt.
- `load_skills`: Get formatted, ready-to-execute skill context.
- `get_global_brain`: Fetch global principles and coding preferences.
- `get_project_context`: Everything GAW knows about the project (stack, goal, rules, selected skills, code graph, Global Brain), validated. Call it first.
- `get_project_skills`: The project's chosen skills as short entries (no full text).
- `load_project_skills`: Full instructions of only the project skills that fit the current task, within a token budget.
- `select_project_skills`: Add library skills to the project (after the user agrees).
- `update_project_memory`: Append confirmed decisions to project memory.
- `initialize_project`: Remotely trigger `gaw init` workflow.
- `get_project_graph`: Retrieve Graphify architectural relationship graph.
- `get_project_status`: Check readiness of current project.

---

## 🤖 AI CODING AGENT INTEGRATIONS

`gaw init` automatically injects reference links to the Project Brain and Central Skills without overwriting user configs:
- **Claude Code**: `CLAUDE.md`
- **Cursor**: `.cursorrules`
- **OpenAI Codex**: `AGENTS.md`
- **Gemini CLI**: `GEMINI.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **Generic Agents**: `AGENT_INSTRUCTIONS.md`

### Fallback Master Prompt
When working in an environment before `gaw` CLI is installed, copy and paste [`NEW-PROJECT-MASTER-PROMPT.md`](NEW-PROJECT-MASTER-PROMPT.md) into your assistant!

---

## 🧪 TESTING & VERIFICATION

Run the full automated test suite:
```bash
npm test
```
The test suite covers:
- Skill Registry indexing & frontmatter parsing
- Skill Discovery keyword ranking & filtering
- Orchestrator task analysis, recommendations & progressive loading
- Memory Engine precedence & decision logging
- Graphify AST relationship analysis
- Agentation React-only safety & dev isolation
- E2E Project Bootstrapper idempotency on fresh React projects

---

## 📄 CONTRIBUTING & LICENSE

- Distributed under the [MIT License](LICENSE).
- Upstream skills are sourced and credited to [ui-skills.com](https://www.ui-skills.com) and their respective authors (`arla6ka`, `anthropic`, `emilkowalski`, `ibelick`, `millionco`).

