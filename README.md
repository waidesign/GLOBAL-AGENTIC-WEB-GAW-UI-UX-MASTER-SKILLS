# 🌐 GUIDED AGENT WORKFLOW (GAW)
### The Universal Intelligence Layer for AI Agents
**One Brain. Any Agent. Every Project.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=18](https://img.shields.io/badge/Node-%3E%3D18-brightgreen.svg)](package.json)
[![MCP: Supported](https://img.shields.io/badge/MCP-Supported-purple.svg)](mcp/server.js)

**Guided Agent Workflow** is an open-source intelligence layer for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, Copilot). It gives every agent, in every project:
- a **skill library for any field**: cloud and infrastructure, testing, architecture, documents, databases, media, agent workflows, UI and more, with skills chosen per task so agents don't waste context;
- **persistent memory** that follows you across projects (Global Brain) and memory for each project (Project Brain);
- **project intelligence**: stack detection, a shared project context, and an optional code map (Graphify);
- **one setup for every agent**: `gaw init` configures CLAUDE.md, .cursorrules, AGENTS.md, GEMINI.md and more, plus an MCP server.

---

## 📑 TABLE OF CONTENTS
1. [Core Vision](#-core-vision)
2. [Key Capabilities](#-key-capabilities)
3. [Architecture & System Flow](#-architecture--system-flow)
4. [Quick Start & Installation](#-quick-start--installation)
5. [CLI Commands Reference](#-cli-commands-reference)
6. [Skills Library](#-skills-library)
7. [Global Brain & Project Brain](#-global-brain--project-brain)
8. [Graphify — Codebase Intelligence](#-graphify--codebase-intelligence)
9. [Design Presets & Agentation (UI projects)](#-design-presets--agentation-ui-projects)
10. [MCP (Model Context Protocol) Server](#-mcp-model-context-protocol-server)
11. [AI Coding Agent Integrations](#-ai-coding-agent-integrations)
12. [Testing & Verification](#-testing--verification)
13. [Contributing & License](#-contributing--license)

---

## 🎯 CORE VISION

In everyday AI-assisted work, people repeat the same constraints in every prompt, re-explain each project from scratch, set up every tool and agent by hand, and get generic output because the agent knows nothing about their standards, their stack or their past decisions.

**Guided Agent Workflow solves this with one shared layer:**
> **ONE BRAIN. ANY AGENT. EVERY PROJECT.**

```
+------------------------------------------------------------------------+
|                   GUIDED AGENT WORKFLOW                                   |
|                                                                        |
|  +--------------------+   +-------------------+   +-----------------+  |
|  | Skill Libraries    |   | Global Brain      |   | MCP Server      |  |
|  | (official+personal)|   | (your memory)     |   | (agent tools)   |  |
|  +---------+----------+   +---------+---------+   +--------+--------+  |
+------------|------------------------|----------------------|-----------+
             |                        |                      |
             v                        v                      v
+------------------------------------------------------------------------+
|                          YOUR PROJECT                                  |
|                                                                        |
|  +------------------------------------------------------------------+  |
|  | `gaw init` / Universal Bootstrapper                              |  |
|  +------------------------------------------------------------------+  |
|  | • ai-brain/ (goal, rules, chosen skills, Global Brain summary)   |  |
|  | • Graphify: graphify-out/ (graph.json, graph.html, GRAPH_REPORT) |  |
|  | • Agent files: CLAUDE.md, .cursorrules, AGENTS.md, GEMINI.md     |  |
|  | • Agentation: dev-only visual feedback (React projects only)     |  |
|  +------------------------------------------------------------------+  |
+------------------------------------------------------------------------+
```

---

## ⚡ KEY CAPABILITIES

- **One-command project setup (`gaw init`)**: detects the stack (language, framework, package manager), creates `ai-brain/`, runs a short onboarding (goal, matching skills, rules), offers the optional Graphify code map, and configures every AI agent. For React projects it also adds Agentation (dev only).
- **The right skills, only when they fit**: GAW picks skills that closely match the task, loads full instructions within a token budget, explains every pick, and loads nothing when nothing fits.
- **An open skill standard (GSS)**: every skill follows the GAW Skill Standard, an extension of the open Agent Skills `SKILL.md` format, with published ranking rules, license checks at the source, and trust levels (official, community, personal, project).
- **Layered memory, with a clear order of precedence**:
  1. *Your current instruction* (highest)
  2. *Project Brain* (`ai-brain/rules.md`, `ai-brain/context.md`)
  3. *Global Brain* (`~/.gaw/brain/`)
  4. *Skill instructions*
  5. *Framework and tool defaults*
- **Quality defaults you control**: the Global Brain starts with coding, workflow and design preferences (including anti-slop UI rules for interface work) that you can change once and apply everywhere.
- **MCP server**: built on `@modelcontextprotocol/sdk`, so Claude Code, Cursor and any MCP-compatible agent can query skills, project context and memory directly.
- **Every major agent supported**: Claude Code, Cursor, OpenAI Codex, Gemini CLI, GitHub Copilot, and a generic instructions file for the rest.

---

## 🚀 QUICK START & INSTALLATION

### Prerequisites
- Node.js >= 18.0.0
- npm, pnpm, yarn, or bun
- **Optional, recommended: [Graphify](https://github.com/safishamsi/graphify)** (needs Python >= 3.10). It builds a code map that AI agents query instead of reading whole files. `gaw init` explains it and offers to install it for you.

### 1. Install Globally or Link
```bash
git clone https://github.com/waidesign/gaw-guided-agent-workflow.git
cd gaw-guided-agent-workflow
npm install
npm link
```

### 2. Verify Installation
```bash
gaw doctor   # runtime, skill libraries, and whether the optional Graphify CLI is installed
```

### 3. Initialize Any Project
Navigate to any new or existing project and run:
```bash
cd /path/to/my-project
gaw init
```

In a terminal, `gaw init` then runs a short onboarding that works for any kind of project. Press Enter to skip any question:
1. **What are you building?** Saved as the project goal in `ai-brain/context.md`.
2. **Suggested skills:** only skills that closely match your goal are shown, from any field (cloud, testing, architecture, documents, UI, ...). Pick all, some (by number), or none. They are recorded in `ai-brain/skills.lock.json` and listed in the short catalog `ai-brain/project-skills.md`.
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
gaw use "Deploy this Python web app to Azure App Service"
gaw use "Write integration tests first for the checkout flow"
gaw use "Build a responsive SaaS dashboard with a sidebar and data table"
```

---

## 💻 CLI COMMANDS REFERENCE

| Command | Description |
|---|---|
| `gaw init` | Set up the current project: `ai-brain/`, onboarding, agent files, optional Graphify code map, Agentation (React only). |
| `gaw init --dry-run` | Preview planned initialization changes without writing files. |
| `gaw init --force` | Regenerate configuration files safely. |
| `gaw init --no-agentation` | Skip Agentation installation. |
| `gaw init --install-graphify` | Install Graphify (and uv if needed) without asking. |
| `gaw init --no-graphify` | Skip the Graphify question and the code map. |
| `gaw setup` | Install Graphify later (asks before installing uv). |
| `gaw start` | Resume an already initialized project with verified contexts. |
| `gaw update` | Refresh this project: agent instructions, skill catalog, Global Brain summary and code graph. |
| `gaw context [--json]` | Everything GAW knows about this project: stack, goal, rules, skills, graph, Global Brain. |
| `gaw skills [category]` | List all skills, or one category, with their trust level. |
| `gaw skills select <name...>` | Use library skills in this project (`ai-brain/skills.lock.json`); `deselect` removes, `selected` lists. |
| `gaw skills add <link\|folder\|file>` | Add any skill to **your personal library** (`~/.gaw/skills/`): converted to GSS, license checked at the source, supporting files copied, split if oversized, indexed. `--project` adds it to `ai-brain/skills/`, `--official` to GAW's own library (for contributors). |
| `gaw skills new "<title>"` | Create a new GSS skill from a template (personal library by default). |
| `gaw skills mine` | List the skills in your personal library. |
| `gaw skills share <name>` | Copy a personal skill into this project (`ai-brain/skills/`) so teammates get it when they clone. |
| `gaw skills pin\|block <name...>` | Prefer skills you trust, or never have a skill suggested (`unpin`, `unblock`, `prefs` to show). |
| `gaw skills lint [folder] [--levels]` | Check skills against the GAW Skill Standard and show their ranking levels. |
| `gaw skills review [--all]` | Review AI-drafted ranking fields; `--approve` / `--reject` them. |
| `gaw skills enrich [--apply]` | Fill ranking fields (summary, whenToUse, verification, domains…) from each skill's own text. |
| `gaw skills licenses [--apply]` | Find each imported skill's real license at its source. |
| `gaw skills split <name\|--all> [--apply]` | Move the long parts of oversized skills into `references/` (lossless). |
| `gaw skills repair <name\|--all> [--apply]` | Restore supporting files imported skills are missing (text files; `--include-binary` for all). |
| `gaw search "<query>"` | Relevance search across skill names, tags, keywords and descriptions. |
| `gaw recommend "<task>"` | Recommend skills for a task, each with the reason it was picked. |
| `gaw use "<task>"` | Load the closely matching skills' instructions for an agent, within a token budget. |
| `gaw use "<task>" --inject` | Write the active skills to `ai-brain/active-skills.md`. |
| `gaw use "<task>" --copy` | Copy formatted skill instructions to the clipboard. |
| `gaw brain` | Inspect Global Brain preferences and local Project Brain rules. |
| `gaw brain update <cat> <msg>` | Append a confirmed decision to the Global Brain. |
| `gaw designs [search <q>]` | UI projects: list or search real-world design presets from GradientDeck, with live links. |
| `gaw design <id> [--apply]` | UI projects: inspect a preset's palette and typography, open its live site, or apply it to `ai-brain/design.md`. |
| `gaw project` | Detailed analysis of the project's frameworks, dependencies and tools. |
| `gaw graph [--force\|--full]` | Build the Graphify code graph in `graphify-out/` (`--force`: refresh changed files, `--full`: rebuild). |
| `gaw doctor` | Health check of runtime, skill libraries and environment. |
| `gaw version` | Display GAW version information. |
| `gaw help` | Display CLI help menu. |

---

## 📚 SKILLS LIBRARY

GAW's official library has **235 skills** in `skills/`, across many fields:

| Area | Skills | Examples |
|---|---|---|
| Media & creative | 67 | `ai-image-generation`, `ai-video-generation`, `ai-music`, `hyperframes`, `remotion-create` |
| Cloud & infrastructure | 58 | `azure-deploy`, `aks-troubleshooting`, `cost-optimization`, `deploy-to-vercel`, `google-agents-cli-deploy` |
| UI, frontend & design | 45 | `frontend-design`, `build-design-system`, `fixing-accessibility`, `react-best-practices`, `better-typography` |
| Agent workflows | 21 | `chief-of-staff`, `handoff`, `triage`, `grilling`, `skill-creator` |
| General | 17 | `claude-api`, `internal-comms`, `teach`, `canvas-design`, `discernment-nudge` |
| Code quality, testing & debugging | 11 | `code-review`, `tdd`, `webapp-testing`, `diagnosing-bugs`, `setup-pre-commit` |
| Architecture & planning | 10 | `codebase-design`, `domain-modeling`, `to-spec`, `to-tickets`, `implement` |
| Documents | 4 | `docx`, `pdf`, `pptx`, `xlsx` |
| Databases | 2 | `supabase`, `supabase-postgres-best-practices` |

Browse them with `gaw skills`, `gaw skills <category>` or `gaw search "<keyword>"`.

Every skill follows the **GAW Skill Standard (GSS)**, which extends the open Agent Skills `SKILL.md` format, so GAW skills also work in any tool that supports Agent Skills. Each skill is a folder:

```
skills/testing/tdd/
├── SKILL.md   # standard Agent Skills frontmatter + instructions
├── gaw.json   # optional GSS contract: keywords, when to use, dependencies, verification...
└── tests.md   # optional supporting files the skill refers to
```

```markdown
---
name: "tdd"
description: "Test-driven development. Use when the user wants to build features or fix bugs test-first..."
license: "MIT"
metadata:
  gaw-category: "testing"
  gaw-author: "mattpocock"
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

The main default files, all yours to edit (others hold tool and component preferences and lessons learned):
- `identity.md`: how your agents should work (role, focus, values).
- `coding-preferences.md`: languages, typing, structure and modularity.
- `workflow-preferences.md`: verification and safe-update habits.
- `design-principles.md`: rules for interface work (contrast, accessibility, compositor-only animation, no AI-slop styling).
- `decision-history.md`: a log of confirmed decisions.
- `skill-preferences.json`: pinned and blocked skills (created when you first pin or block one).

### Project Brain (`ai-brain/`)
Generated inside each project by `gaw init`:
```text
ai-brain/
├── README.md           # What this folder is and how agents use it
├── context.md          # Project goal plus the detected stack (framework, languages, libraries)
├── identity.md         # Project identity and direction (tone, design direction)
├── playbook.md         # How agents should work in this project, step by step
├── project-history.md  # Project milestones and decisions
├── rules.md            # Rules agents must always follow here
├── global-brain.md     # Generated, read-only summary of YOUR Global Brain (kept out of git)
├── skills.lock.json    # Library skills this project uses (gaw skills select / deselect)
├── project-skills.md   # Generated short catalog of the project's skills (what agents read)
└── skills/             # The project's own skills in GSS format (starter: code-generation, code-review, debugging, seo)
```

### Project skills: chosen per project, loaded only when needed
Each project keeps its own skill selection in `ai-brain/skills.lock.json`, which records each skill's version, why it was chosen, when, and where it came from. Onboarding fills it from your goal, and `gaw skills select` / `gaw skills deselect` change it. Agents don't get full skills up front. They read `ai-brain/project-skills.md`, a short catalog (about 300 tokens per skill instead of thousands), and open a skill only when a task needs it. Over MCP, `load_project_skills` loads just the project skills that fit the current task.

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

## 🎨 DESIGN PRESETS & AGENTATION (UI PROJECTS)

These two features only apply when a project has a user interface.

**Design presets:** 63 real-world design archetypes (Linear, Stripe Press, Railway, Cloudflare, Tailwind CSS and more) from [GradientDeck](https://ui.gradientdeck.com), each with its palette, typography and a link to the live site. `gaw use` suggests one only for UI tasks; `gaw design <id> --apply` writes it to `ai-brain/design.md`.

**Agentation:** for React projects (Vite, Next.js, Remix), `gaw init` installs `agentation` as a development dependency and adds its visual feedback overlay:
- **Vite**: `{import.meta.env.DEV && <Agentation />}`
- **Next.js / Standard React**: `{process.env.NODE_ENV === 'development' && <Agentation />}`

Agentation is excluded from production builds and never installed in non-React projects. Skip it with `gaw init --no-agentation`.

---

## 🔌 MCP (MODEL CONTEXT PROTOCOL) SERVER

GAW includes a full Model Context Protocol server in `mcp/server.js`.

### Connecting to Claude Code or Cursor
Add to your MCP settings (`.mcp.json` for Claude Code, or Cursor's MCP settings), with the path to your GAW folder:
```json
{
  "mcpServers": {
    "guided-agent-workflow": {
      "command": "node",
      "args": ["/path/to/gaw-guided-agent-workflow/mcp/server.js"]
    }
  }
}
```

### Available MCP Tools
- `list_skills`: Browse skills with category filtering (with trust levels).
- `search_skills`: Search skills with relevance ranking.
- `get_skill`: Retrieve full instructions and metadata for a specific skill.
- `recommend_skills`: Get skill recommendations for a task, each with a reason.
- `load_skills`: Get formatted, ready-to-use skill instructions for a task.
- `get_global_brain`: Fetch the user's Global Brain preferences.
- `get_project_context`: Everything GAW knows about the project (stack, goal, rules, selected skills, code graph, Global Brain), validated. Call it first.
- `get_project_skills`: The project's chosen skills as short entries (no full text).
- `load_project_skills`: Full instructions of only the project skills that fit the current task, within a token budget.
- `select_project_skills`: Add library skills to the project (after the user agrees).
- `update_project_memory`: Append confirmed decisions to project memory.
- `initialize_project`: Run the `gaw init` workflow (never installs Graphify).
- `analyze_project`: Inspect the project's framework, dependencies and tools.
- `get_project_graph`: Retrieve the Graphify relationship graph.
- `get_project_status`: Check whether the project is initialized and ready.

---

## 🤖 AI CODING AGENT INTEGRATIONS

`gaw init` adds a GAW section pointing to the Project Brain and skills, without overwriting your own content. `gaw update` refreshes that section in place:
- **Claude Code**: `CLAUDE.md`
- **Cursor**: `.cursorrules`
- **OpenAI Codex**: `AGENTS.md`
- **Gemini CLI**: `GEMINI.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **Generic Agents**: `AGENT_INSTRUCTIONS.md`

### Fallback Master Prompt
Before the `gaw` CLI is installed, you can paste [`NEW-PROJECT-MASTER-PROMPT.md`](NEW-PROJECT-MASTER-PROMPT.md) into your assistant.

---

## 🧪 TESTING & VERIFICATION

```bash
npm test        # 18 test suites; uses a throwaway GAW_HOME, never your real ~/.gaw
npm run eval    # skill selection benchmark: tuning set + held-out set, compared with eval/baseline.json
```

The tests cover:
- Skill registry, GSS conversion, frontmatter parsing, imports and license handling
- Skill discovery, ranking levels, AI drafts and the eval cases
- Personal library, trust levels and pin/block preferences
- Orchestrator task analysis, recommendations and progressive loading
- Project context, Global Brain link and memory precedence
- Onboarding, Graphify setup and code graph
- Agentation (React only, dev only)
- End-to-end `gaw init` on fresh projects

---

## 📄 CONTRIBUTING & LICENSE

- **GAW's code** (CLI, engine, MCP server) is distributed under the [MIT License](LICENSE).
- **Each skill keeps its own license**, shown in its `SKILL.md` and checked at its source (`gaw skills licenses`): 168 MIT, 48 Apache-2.0, and 19 whose source has no license yet (the linter flags them; they need the author's permission before redistribution). GAW never relabels a skill's license.
- **Skills come from their authors**, credited in each skill: Anthropic, Microsoft, Google, Vercel, Supabase, Remotion, HeyGen (HyperFrames), Matt Pocock, gencraft-labs, [ui-skills.com](https://www.ui-skills.com) and individual authors (`arla6ka`, `emilkowalski`, `ibelick`, `millionco` and others).
- **Contributing a skill:** add it with `gaw skills add <link|folder> --official`, run `npm test` and `npm run eval`, and open a pull request.
