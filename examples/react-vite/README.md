# Example: React + Vite project set up with GAW

A small React app after `gaw init --yes --no-graphify --no-agentation`, plus a project goal written into `ai-brain/context.md`.

- **`ai-brain/`**: the Project Brain.
  - `context.md`: goal, detected stack and commands, folder map, definition of done
  - `rules.md`: short rules agents follow every session (safety, scope, stack, quality)
  - `playbook.md`: steps for features, bug fixes, refactors and UI changes
  - `design.md`: fonts, colors and spacing read from `src/styles.css`
  - `brain.json`: layout version, detected stack, precedence
  - `decisions/`, `memory/proposed/`: decision records and lessons waiting for review
  - `skills/`: five short default skills (debugging, code review, implement a feature, testing, security basics)
  - `local/`: the active task and your Global Brain summary; ignored by git, so it isn't in this example
- **Agent files**: `CLAUDE.md`, `.cursorrules`, `AGENTS.md`, `GEMINI.md`, `AGENT_INSTRUCTIONS.md`, `.github/copilot-instructions.md` point agents to `ai-brain/`.

Try it:
```bash
cd examples/react-vite
gaw context
gaw use "add hover and press micro-interactions to buttons" --inject   # writes ai-brain/local/active-task.md
gaw task done                                                          # archives it when finished
```
