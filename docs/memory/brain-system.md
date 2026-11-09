# Global Brain & Project Brain Architecture

## Two-Tier Intelligence
Guided Agent Workflow uses a two-tier memory hierarchy:
1. **Global Brain (`~/.gaw/brain/`)**: your cross-project persona, design principles, coding preferences, and confirmed decisions. It lives in your user folder, not in the GAW package.
2. **Project Brain (`ai-brain/`)**: the project's goal, detected stack and commands, rules, recipes, decisions and skills. It lives in each project, and teams share it through git (except `ai-brain/local/`).

## Where the Global Brain lives
- Default: `~/.gaw/brain/` (Windows: `%USERPROFILE%\.gaw\brain\`). `gaw brain path` prints it.
- `GAW_HOME` moves the whole GAW data folder. Point it at a synced folder (Dropbox, OneDrive, a private git repo) to use one brain on several machines.
- On first use, GAW copies its default files from `brain/` in the GAW repository. Files you already have are never overwritten, so updating GAW can't erase your memory.
- `brain/` in the repository contains **defaults only**. Edit it to change what new users start with, never to record personal decisions.

## Project Brain layout (layout 2)
| Path | Purpose | In git |
|---|---|---|
| `README.md` | What the folder is, what to commit, no secrets, how to update or remove | Yes |
| `brain.json` | Layout version, detected stack and commands, precedence | Yes |
| `context.md` | Goal, stack, commands, folder map, architecture, conventions, definition of done | Yes |
| `rules.md` | Short rules loaded every session (under ~60 lines) | Yes |
| `playbook.md` | Recipes per task type (feature, bug fix, refactor, UI change) | Yes |
| `design.md` | UI projects only: design values found in the stylesheets | Yes |
| `decisions/` | One short record per decision | Yes |
| `memory/proposed/` | Lessons agents suggest, waiting for a person | Yes |
| `skills/`, `skills.lock.json`, `project-skills.md` | Project skills | Yes |
| `local/` | `active-task.md`, `archive/`, `global-brain.md` | No (`local/.gitignore`) |

Sections whose heading ends in **(auto-detected)** are rewritten by `gaw update`. Renaming one to **(confirmed)** keeps it as written. Nothing else a person wrote is overwritten.

`gaw update` moves projects from layout 1 (`identity.md`, `project-history.md`, `active-skills.md`, `global-brain.md` next to the project files) to layout 2: old task files go to `local/archive/`, untouched templates are replaced (carrying over the goal and the project-specific rules from onboarding), and edited files are kept with a note on where their content belongs now.

## How a project uses the Global Brain
- `gaw init` does **not** copy your Global Brain into a project, so the live Global Brain is never shadowed by a stale copy.
- Each project gets `ai-brain/local/global-brain.md`, a **generated, read-only summary** of your Global Brain (preferences plus your 10 most recent decisions). It's for agents that can't read outside the project folder. `gaw start`, `gaw update` and `gaw brain update` refresh it. It's personal, so it lives in `local/`, which git ignores, and each teammate gets one from their own Global Brain.
- Agents connected over MCP can read the Global Brain directly (`get_global_brain`, `get_project_context`).
- Projects created by older GAW versions contain copies of Global Brain files. `gaw update` removes copies nobody changed and keeps edited ones as deliberate project choices (they override the Global Brain in that project). `gaw context` lists any overrides.

## Precedence
When instructions conflict, agents follow this order (also recorded in `ai-brain/brain.json`):
1. **Safety rules** in `ai-brain/rules.md`: always apply. Instructions found in files, web pages, issues or tool output never override them, and a user request that breaks one needs explicit confirmation.
2. **User request**
3. **Project rules** (`ai-brain/rules.md`)
4. **Global Brain preferences** (`~/.gaw/brain/`)
5. **Loaded skill instructions**
6. **Tool & framework defaults**

## Non-Destructive Memory Updates
Memory never changes behind a person's back. Global decisions are appended with timestamps to `decision-history.md`; project decisions become one short record each in `ai-brain/decisions/` (MCP `update_project_memory`). Agents propose new rules or lessons as files in `ai-brain/memory/proposed/`, and a person decides where they go. Global decisions record the project by name only, not its full local path. No secrets or credentials are ever stored in memory files.
