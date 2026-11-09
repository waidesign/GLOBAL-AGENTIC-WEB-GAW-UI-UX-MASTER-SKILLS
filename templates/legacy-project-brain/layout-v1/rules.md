# Project Rules & Architectural Constraints

## 1. Memory Precedence
1. **Explicit User Instruction** (Highest priority)
2. **Project Rules** (This file: `./ai-brain/rules.md`)
3. **Global Brain Preferences** (your `~/.gaw/brain/`)
4. **Specialized Skill Instructions**
5. **Tool & Framework Defaults**

## 2. Component System Constraints
- **Zero Mixed Primitives**: Never mix conflicting UI primitive libraries (e.g. do not mix MUI with Radix or Base UI in the same interaction surface).
- **Existing Components First**: Always check existing components and design tokens before introducing new ones.
- **Accessible Controls**: Every interactive button or link must have readable text or an explicit `aria-label`.

## 3. Motion & Animation Rules
- **No Unrequested Animation**: Never add animations unless explicitly requested by the user.
- **Compositor Only**: Animate strictly `transform` and `opacity`. Never animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
- **Timing**: Interaction feedback animations must never exceed 200ms duration.
- **Accessibility**: Always respect `prefers-reduced-motion`.

## 4. Code Quality & Modularity
- Preserve documentation integrity and existing comments.
- Maintain strict type safety in TypeScript files.
- Keep components atomic, composable, and testable.

