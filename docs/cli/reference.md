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

In a terminal, `gaw init` runs a short onboarding (Enter skips any question):
1. What are you building? → `ai-brain/context.md`
2. Suggested skills that closely match the goal (all, some by number, or none) → `ai-brain/active-skills.md`
3. Rules your AI agents must always follow → `ai-brain/rules.md`
4. Graphify code map (only when Graphify is not installed)

`--yes` (or `--non-interactive`) skips onboarding; Graphify is then skipped unless you pass `--install-graphify`.

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

# Automatically inject instructions into ai-brain/active-skills.md (no copy-pasting required!)
gaw use "Build a checkout form with payment validation" --inject

# Copy full instructions directly to OS clipboard
gaw use "Build a checkout form with payment validation" --copy
```

## Real-World Design Presets (GradientDeck Integration)
```bash
# List all design presets with live inspiration links
gaw designs

# Search presets by aesthetic, theme or industry
gaw designs search "developer tools"
gaw designs --theme dark

# Inspect preset palette, typography & archetype
gaw design railway

# Apply design preset directly to ai-brain/design.md
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

