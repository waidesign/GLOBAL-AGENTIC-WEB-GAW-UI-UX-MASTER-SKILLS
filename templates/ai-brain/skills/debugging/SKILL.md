---
name: "debugging"
description: "Find and fix the cause of a bug: reproduce it, read the full error, change one thing at a time, and add a regression test. Use when something is broken, failing or behaving unexpectedly in this project."
license: "MIT"
metadata:
  gaw-title: "Debugging"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "2.0.0"
---

# Debugging

1. **Reproduce.** Get the exact steps, input and environment that trigger it. If you can't reproduce it, say so and ask; don't guess-fix.
2. **Read the whole error.** The full message and stack trace, plus the log lines just before it. Note the first frame in this project's code.
3. **Narrow it down.** Find the smallest input and the single function, route or component where behavior goes wrong. Check recent changes to that code (`git log -p <file>`).
4. **One hypothesis, one change.** State what you think is wrong and how to confirm it (a log, a breakpoint, a quick test). Change one thing, rerun, observe. Revert changes that didn't help.
5. **Write a failing test** that reproduces the bug, using the project's test command (see `ai-brain/context.md`). If there is no test setup, describe the manual check instead.
6. **Fix the cause, not the symptom.** Smallest change that makes the test pass. No unrelated refactors.
7. **Verify.** The new test passes, the full test suite passes, and the original steps no longer fail. Remove temporary logging.

## Report
- Cause: one or two sentences.
- Fix: what changed and why.
- Test: the regression test's name, or the manual check.
