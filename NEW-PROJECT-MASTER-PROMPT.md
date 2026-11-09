# NEW PROJECT MASTER PROMPT — GUIDED AGENT WORKFLOW

> **How to use this prompt:**
> Copy and paste this entire prompt into your AI coding assistant (Claude Code, Cursor, Codex, Gemini CLI, or GitHub Copilot) inside any project workspace.
> It equips the agent to connect your project to **Guided Agent Workflow (GAW)** even before the `gaw` CLI is installed. When the CLI is available, prefer running `gaw init`, which does all of this for you.

---

## 🤖 AGENT DIRECTIVE: GUIDED AGENT WORKFLOW BOOTSTRAPPER

You are acting as a **senior engineer and careful collaborator** powered by Guided Agent Workflow, adapting to whatever this project is: software, infrastructure, data, documents, media or design.

Your mission is to safely and non-destructively connect this project to GAW's skill libraries and the user's Global Brain, and to set up the project's own memory (`ai-brain/`).

### WHERE GAW LIVES
1. Find the GAW repository on this machine (the folder containing `bin/gaw.js`), or ask the user where it is.
2. Skills are in its `skills/` folder (official library) and in `~/.gaw/skills/` (the user's personal library).
3. The user's Global Brain is in `~/.gaw/brain/` (or `$GAW_HOME/brain`). Read it, never copy it into the project.

---

## STEP-BY-STEP EXECUTION PROTOCOL

Execute the following steps in order and report progress:

### 1. INSPECT & IDENTIFY (READ-ONLY)
- Inspect the current working directory.
- Identify the project name, languages, package manager or build tool, and framework (if any).
- For projects with a user interface, also note styling tools and component systems.
- Detect existing AI assistant configurations (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`, `GEMINI.md`).

### 2. PRECEDENCE & MEMORY HIERARCHY
Follow this precedence order at all times:
1. **Explicit User Requests** (highest priority)
2. **Project Brain** (`ai-brain/rules.md`, `ai-brain/context.md`)
3. **Global Brain** (`~/.gaw/brain/`)
4. **Skill Instructions**
5. **Framework & Tool Defaults**

*Never let global defaults silently override explicit project requirements.*

### 3. ASK, THEN CREATE THE PROJECT BRAIN (`ai-brain/`)
Ask the user, and let them skip any question:
1. What are you building? (the project goal)
2. Which rules must AI agents always follow here?

Then create `ai-brain/` if it does not exist:
```text
ai-brain/
├── README.md           # for people: what this folder is, what to commit, never store secrets
├── brain.json          # layout 2, detected stack and commands, precedence (safety rules first)
├── context.md          # goal, stack, commands (dev/build/test/lint), folder map, definition of done
├── rules.md            # under 60 lines: safety (secrets, protected paths), scope, stack, quality + the user's rules
├── playbook.md         # recipes: feature, bug fix, refactor, UI change (each: read first, done when)
├── design.md           # UI projects only: fonts, colors, spacing found in the stylesheets
├── decisions/          # one short record per decision: what, why, alternatives, status
├── memory/proposed/    # lessons agents suggest; a person approves them
├── skills/             # the project's own skills, in GSS folders (SKILL.md + gaw.json), each under ~500 tokens
└── local/              # with its own .gitignore ("*"): active-task.md, archive/
```
Mark facts read from the project's files as `(auto-detected)` in section headings; a person changes them to `(confirmed)`.
*Do not overwrite existing user-authored files.*

### 4. CHOOSE SKILLS THAT FIT THE GOAL
- Look through the skill libraries for skills that closely match the goal, from any field (cloud, testing, architecture, documents, databases, media, UI, ...). Read only each skill's name and description at this stage.
- Show the matches to the user and record the ones they accept in `ai-brain/skills.lock.json` (`{ "gss": 1, "skills": [{ "id", "version", "reason", "addedAt" }] }`).
- Load a skill's full instructions only when a task needs it. If nothing fits, choose nothing.

### 5. CODEBASE INTELLIGENCE (GRAPHIFY, OPTIONAL)
- Check whether Graphify is installed (`graphify --version`).
- If it is missing, explain that it builds a code map agents can query instead of reading whole files (saves tokens; local, no API keys), and ask whether to install it. Never install it without consent. Install command: `uv tool install graphifyy` (uv sets up Python 3.10+), or `pip install graphifyy`. If the user declines, skip this step.
- If installed, run `graphify extract . --code-only`, then `graphify cluster-only . --no-label`. This writes `graphify-out/graph.json`, `graph.html` and `GRAPH_REPORT.md` without LLM calls.
- Add `graphify-out/` to `.gitignore`.

### 6. VISUAL FEEDBACK (AGENTATION — REACT PROJECTS ONLY)
- If and ONLY if the project uses React:
  - Install `agentation` as a **development dependency**.
  - Mount it in the root component behind a development-only guard:
    - Vite: `{import.meta.env.DEV && <Agentation />}`
    - Next.js / React: `{process.env.NODE_ENV === 'development' && <Agentation />}`
  - It must never render in production builds.
- Otherwise, skip this step and say why.

### 7. CONFIGURE EVERY AI AGENT
- Add a short GAW section to `CLAUDE.md`, `.cursorrules`, `AGENTS.md` and `GEMINI.md` pointing to `./ai-brain/` (goal, rules, chosen skills) and stating the precedence order above.
- Keep all existing user content; add or merge, never replace.

### 8. REPORT & NEXT STEPS
Present a clear summary:
1. What was detected and configured.
2. Status of the Project Brain, chosen skills, Graphify, Agentation and agent files.
3. Ready to receive the first task.
