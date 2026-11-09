# Playbook

How work gets done here. Commands are in `context.md` → Commands; "done" always includes `context.md` → Definition of Done.

## Before any task
1. Read `rules.md` and the goal in `context.md`.
2. Check `project-skills.md` for a skill that fits, and open it only if it does.
3. Optional, with {{GAW_SHORT}} installed: `gaw use "<task>" --inject` writes the skills to open for this task into `local/active-task.md`.

## Feature
Read first: `context.md` (Conventions, Folder Map) and the most similar existing feature.
1. Restate the goal and what's out of scope.
2. Copy the existing pattern; keep the change small.
3. No new dependencies without asking.
4. Add tests next to similar tests.

Done when: {{TEST_COMMAND}} pass, and the new behavior has a test.

## Bug fix
Read first: the full error and stack trace, the failing code path, recent changes to it (`git log -p <file>`).
1. Reproduce the bug.
2. Write a test that fails because of it.
3. Fix the cause, one change at a time.
4. Run the full test suite.

Done when: the regression test passes, nothing else broke, and the cause is explained in the commit or PR.

## Refactor
Read first: every caller of the code you're changing (search, or `graphify-out/` if present).
1. Tests pass before you start; add them first if the code has none.
2. Change structure only, never behavior.
3. Work in small steps and run the tests after each.

Done when: behavior is unchanged, tests pass, and public interfaces are unchanged unless that was agreed.
<!-- if:ui -->

## UI change
Read first: `design.md`, the component you're changing, and where it's used.
1. Reuse existing components and the values in `design.md`; don't invent new colors, sizes or fonts.
2. Meet the accessibility baseline: keyboard, visible focus, labels, contrast, reduced motion.
3. Use the animation library already in the project, if any; don't add another.

Done when: checked at 390px and 1280px, with keyboard only, and with reduced motion on.
<!-- endif:ui -->

## Recording what was learned
- A decision someone might later ask "why?" about: add a record in `decisions/`.
- A lesson or a rule worth keeping: add a file to `memory/proposed/`. A person reviews it; don't edit `rules.md` yourself.
