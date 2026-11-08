---
name: "debugging"
description: "Systematic diagnosis flow: reproduce, minimize, hypothesize, instrument, then fix and verify. Use when investigating a bug or unexpected behavior in this project."
license: "MIT"
metadata:
  gaw-title: "Debugging"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
---

# Project Skill: Debugging

## Systematic Diagnosis Flow
1. **Reproduce**: Identify the exact minimal trigger for the issue.
2. **Minimize**: Narrow down to the specific component, route, or function.
3. **Hypothesize**: Formulate a single testable hypothesis based on logs, network output, or stack trace.
4. **Instrument**: Add focused logging or breakpoints to verify hypothesis before changing logic.
5. **Fix & Verify**: Apply the smallest surgical correction, verify no regressions, and remove debug logs.
