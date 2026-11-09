# GAW CLI Reference

## Universal Project Bootstrapping
```bash
gaw init
```
Options:
- `--dry-run`: Inspect and simulate changes without writing files.
- `--force`: Force recreation or overwrite of brain files.
- `--no-agentation`: Skip visual feedback integration.
- `--install-graphify`: Install the optional Graphify CLI (and uv if needed) without asking.
- `--no-graphify`: Skip the Graphify question and the code map.

`gaw init` creates `ai-brain/` (README, brain.json, context, rules, playbook, design.md for UI projects, decisions/, memory/proposed/, five starter skills, and the git-ignored local/). Commands, stack, folder map and design values are filled in from the project's files.

In a terminal, `gaw init` then runs a short onboarding (Enter skips any question):
1. What are you building? → `ai-brain/context.md` (Project Goal)
2. Suggested skills that closely match the goal (all, some by number, or none) → `ai-brain/skills.lock.json` + `ai-brain/project-skills.md`
3. Skill packs that fit the stack and goal (all, some by number, or none) → `ai-brain/skills.lock.json`
4. Rules your AI agents must always follow → `ai-brain/rules.md` (Project-Specific Rules)
5. Graphify code map (only when Graphify is not installed)

`--yes` (or `--non-interactive`) skips onboarding and only lists the packs that fit; Graphify is then skipped unless you pass `--install-graphify`.

## Skill packs
```bash
gaw packs                  # packs that fit this project, and which are added
gaw packs show motion      # skills a pack would add here, and why
gaw packs add ui motion    # add to ai-brain/skills.lock.json
gaw packs remove ui        # remove what the pack added (hand-picked skills stay)
```
See [packs](../packs.md).

## Optional Graphify Code Map
```bash
gaw setup          # install Graphify; asks before installing uv
gaw setup --yes    # also install uv without asking
gaw graph          # build or refresh graphify-out/
```

## Project Continuation
```bash
gaw start
```
Checks project health, verifies `ai-brain/` presence, and checks if codebase graph needs refreshment.

## Skill Management & Progressive Execution
```bash
# List all skills
gaw skills

# List skills in a category
gaw skills design-systems

# Search skills
gaw search "framer motion"

# Recommend skills for task
gaw recommend "Build a checkout form with payment validation"

# Progressively load full instructions for execution (stdout)
gaw use "Build a checkout form with payment validation"

# Write the task to ai-brain/local/active-task.md: which skill files to open and why,
# what was left out and why, constraints and acceptance criteria (a few hundred tokens)
gaw use "Build a checkout form with payment validation" --inject

# Same, with the full skill text embedded (larger)
gaw use "Build a checkout form with payment validation" --inject --full

# Copy full instructions directly to OS clipboard
gaw use "Build a checkout form with payment validation" --copy

# Show the active task; archive it when finished (agents then ignore it)
gaw task
gaw task done
```

Skills that do the same job (gaw.json `exclusiveGroup`, e.g. animation libraries) are not loaded together: the one whose package is in the project's dependencies is used, and the others are listed under "Left out" with the reason.

## Keeping a project current
```bash
gaw update
```
Refreshes the `(auto-detected)` sections of `context.md` and `design.md`, `brain.json`, agent instruction files and the skill catalog. Moves projects from the old layout (identity.md, project-history.md, active-skills.md) to the current one, keeping everything a person edited.

## Real-World Design Presets (GradientDeck Integration)
```bash
# List all design presets with live inspiration links
gaw designs

# Search presets by aesthetic, theme or industry
gaw designs search "developer tools"
gaw designs --theme dark

# Inspect preset palette, typography & archetype
gaw design railway

# Replace ai-brain/design.md with a preset (it otherwise holds the values found in your stylesheets)
gaw design railway --apply

# Open live inspiration website in browser
gaw design railway --open

# Open style reference deck in browser
gaw design railway --deck
```

## Diagnostics & Brain Inspection
```bash
gaw brain
gaw brain update "UI/UX" "Use 16px root font size and 8px grid"
gaw project
gaw graph
gaw doctor
gaw version
```

