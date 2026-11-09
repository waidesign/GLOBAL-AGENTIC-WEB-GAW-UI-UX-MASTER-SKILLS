---
name: "implement-feature"
description: "Add or change a feature the way this codebase already does things: find the existing pattern first, stay in scope, no new dependencies without asking, tests included. Use when building a feature or changing behavior."
license: "MIT"
metadata:
  gaw-title: "Implement a Feature"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
---

# Implement a Feature

1. **Restate the goal** in one or two sentences, with what is out of scope. Ask if anything is unclear before writing code.
2. **Find the existing pattern.** Look for the most similar feature in this codebase (search names, routes, components; `graphify-out/` if present). Copy its structure, naming, error handling and test style.
3. **Plan the change**: files to add or edit, and anything shared that others depend on. Keep it as small as the goal allows.
4. **No new dependencies without asking.** If something seems missing, check what's already installed first; if you still need a package, say which one and why.
5. **Write the code** in the project's language and style (see `ai-brain/context.md` → Stack and Conventions). Don't rewrite unrelated code; list follow-ups instead.
6. **Add tests** for the new behavior next to similar tests, using the project's test command.
7. **Check** against the Definition of Done in `ai-brain/context.md`: tests, lint/type check, and for UI the accessibility baseline.

## Report
- What changed (files) and how to try it.
- Tests added.
- Follow-ups you noticed but didn't do.
