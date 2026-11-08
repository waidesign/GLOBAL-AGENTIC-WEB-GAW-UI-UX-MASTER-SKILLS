# GAW CLI Reference

## Universal Project Bootstrapping
```bash
gaw init
```
Options:
- `--dry-run`: Inspect and simulate changes without writing files.
- `--force`: Force recreation or overwrite of brain files.
- `--no-agentation`: Skip visual feedback integration.
- `--no-graphify`: Skip codebase architecture graph generation.

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

## Diagnostics & Brain Inspection
```bash
gaw brain
gaw brain update "UI/UX" "Use 16px root font size and 8px grid"
gaw project
gaw graph
gaw doctor
gaw version
```

