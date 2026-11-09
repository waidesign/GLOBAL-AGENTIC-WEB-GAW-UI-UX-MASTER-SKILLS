---
name: "code-review"
description: "Review a change against this project's rules with a severity-ordered checklist and a fixed report format. Use when reviewing a diff or pull request, or before saying a change is done."
license: "MIT"
metadata:
  gaw-title: "Code Review"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "2.0.0"
---

# Code Review

Read the whole diff and the code around it before commenting. Check in this order and stop to report anything in the first two groups.

## 1. Blocking
- [ ] Does it do what was asked? Any behavior change that wasn't asked for?
- [ ] Bugs: wrong conditions, off-by-one, null/undefined, unhandled errors, race conditions.
- [ ] Security: secrets in code or logs, unvalidated input, injection (SQL, shell, HTML), missing auth checks.
- [ ] Breaks `ai-brain/rules.md` (protected paths, new dependencies without approval).

## 2. Important
- [ ] Tests cover the new or changed behavior, and they pass.
- [ ] Data changes are safe: migrations reversible, no silent data loss.
- [ ] UI changes meet the accessibility baseline (keyboard, focus, labels, contrast, reduced motion).

## 3. Minor
- [ ] Follows the existing patterns and naming in this codebase.
- [ ] Simpler option exists (less code, an existing helper).
- [ ] Clear names; comments explain why, not what.

## Report format
```
Verdict: approve | approve with changes | request changes

Blocking
- path/file.ext:42 — problem. Why it matters. Suggested fix.

Important
- ...

Minor
- ...
```
Write "none" under an empty group. Every finding names a file and line. Don't list style preferences the linter already enforces.
