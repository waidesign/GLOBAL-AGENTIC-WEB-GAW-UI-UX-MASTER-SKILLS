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

## Memory Precedence Rule
When contradictory instructions arise, agents must strictly follow this precedence:
1. **User Request (Immediate)**
2. **Project Rules (`ai-brain/rules.md`)**
3. **Global Brain Preferences (`~/.gaw/brain/`)**
4. **Loaded Skill Instructions**
5. **Tool & Framework Defaults**

## Non-Destructive Memory Updates
Memory updates are append-only to prevent regression. Decisions are logged with timestamps in `decision-history.md` (Global) and `project-history.md` (Project). Global decisions record the project by name only, not its full local path. No secrets or credentials are ever stored in memory markdown files.
