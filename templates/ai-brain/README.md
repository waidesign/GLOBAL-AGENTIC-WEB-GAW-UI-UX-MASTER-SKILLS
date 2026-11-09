# ai-brain: {{PROJECT_NAME}}

This folder tells AI coding agents (Claude Code, Cursor, Codex, Gemini, Copilot and others) how to work on this project. It was set up by {{GAW_NAME}} ({{GAW_SHORT}}). Everything is plain text: read it, edit it, and review changes to it like code.

## What's here

| Path | What it is | In git? |
|---|---|---|
| `context.md` | Goal, stack, commands, folder map, conventions, definition of done | Yes |
| `rules.md` | Short rules agents follow in every session | Yes |
| `playbook.md` | Step-by-step recipes per kind of task | Yes |
<!-- if:ui -->
| `design.md` | Fonts, colors, spacing and other design values used in the code | Yes |
<!-- endif:ui -->
| `decisions/` | Short records of decisions and why they were made | Yes |
| `memory/proposed/` | Lessons agents suggest; a person moves them into the files above or deletes them | Yes |
| `skills/`, `skills.lock.json`, `project-skills.md` | Skills for this project; agents open one only when a task needs it | Yes |
| `brain.json` | Settings {{GAW_SHORT}} reads: layout version, detected stack, precedence | Yes |
| `local/` | Your current task and a summary of your personal preferences | No (ignored by its own `.gitignore`) |

Sections marked **(auto-detected)** are refreshed by `gaw update`. Change the heading to **(confirmed)** to keep your own version. Everything else is yours and is never overwritten.

## Never store secrets here

No API keys, passwords, tokens or customer data. These files are committed and read by AI tools.

## Updating

Run `gaw update` to refresh the auto-detected sections, `brain.json`, the agent instruction files and the skill catalog. Teammates without {{GAW_SHORT}} can still use every file here; nothing requires it.

## Removing

Delete this folder, and the section between the `GUIDED AGENT WORKFLOW` markers in `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules` and `.github/copilot-instructions.md`. Nothing else depends on it.
