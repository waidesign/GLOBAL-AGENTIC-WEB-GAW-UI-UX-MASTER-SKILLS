# Global Brain & Project Brain Architecture

## Two-Tier Intelligence
Global Agentic Web uses a two-tier memory hierarchy:
1. **Global Brain (`~/.gaw/brain/`)**: your cross-project persona, design principles, coding preferences, and confirmed decisions. It lives in your user folder, not in the GAW package.
2. **Project Brain (`ai-brain/`)**: local, project-specific architecture, detected technology stack, local rules, and history. It lives in each project, and teams share it through git.

## Where the Global Brain lives
- Default: `~/.gaw/brain/` (Windows: `%USERPROFILE%\.gaw\brain\`). `gaw brain path` prints it.
- `GAW_HOME` moves the whole GAW data folder. Point it at a synced folder (Dropbox, OneDrive, a private git repo) to use one brain on several machines.
- On first use, GAW copies its default files from `brain/` in the GAW repository. Files you already have are never overwritten, so updating GAW can't erase your memory.
- `brain/` in the repository contains **defaults only**. Edit it to change what new users start with, never to record personal decisions.

## How a project uses the Global Brain
- `gaw init` does **not** copy your Global Brain into a project. Projects only get project files (`context.md`, `rules.md`, `identity.md`, `playbook.md`, `project-history.md`, skills), so the live Global Brain is never shadowed by a stale copy.
- Each project gets `ai-brain/global-brain.md`, a **generated, read-only summary** of your Global Brain (preferences plus your 10 most recent decisions). It's for agents that can't read outside the project folder. `gaw start`, `gaw update` and `gaw brain update` refresh it. It's personal, so GAW adds it to the project's `.gitignore`, and each teammate gets one from their own Global Brain.
- Agents connected over MCP can read the Global Brain directly (`get_global_brain`, `get_project_context`).
- Projects created by older GAW versions contain copies of Global Brain files. `gaw update` removes copies nobody changed and keeps edited ones as deliberate project choices (they override the Global Brain in that project). `gaw context` lists any overrides.

## Memory Precedence Rule
When contradictory instructions arise, agents must strictly follow this precedence:
1. **User Request (Immediate)**
2. **Project Rules (`ai-brain/rules.md`)**
3. **Global Brain Preferences (`~/.gaw/brain/`)**
4. **Loaded Skill Instructions**
5. **Tool & Framework Defaults**

## Non-Destructive Memory Updates
Memory updates are append-only to prevent regression. Decisions are logged with timestamps in `decision-history.md` (Global) and `project-history.md` (Project). Global decisions record the project by name only, not its full local path. No secrets or credentials are ever stored in memory markdown files.
