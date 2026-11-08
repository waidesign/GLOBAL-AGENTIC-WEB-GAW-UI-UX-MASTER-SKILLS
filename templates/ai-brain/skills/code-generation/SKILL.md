---
name: "code-generation"
description: "Project conventions for writing code: follow existing patterns, explicit types for props and state, predictable named exports. Use whenever generating or editing code in this project."
license: "MIT"
metadata:
  gaw-title: "Code Generation"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
---

# Project Skill: Code Generation

## Protocol
1. Follow existing codebase conventions and naming schemes.
2. In TypeScript/React projects:
   - Prefer functional components and custom hooks.
   - Separate server data fetching from client interactive state.
   - Use proper utility-first CSS (`cn` utility combining `clsx` and `tailwind-merge`).
3. Ensure all props and state variables have explicit type definitions.
4. Export components predictably (prefer named exports).
