---
name: master-skill
id: master-skill
category: systems
description: Central routing, architecture, and orchestration skill for the Global Agentic Web UI/UX ecosystem.
author: Global Agentic Web Team
version: 1.0.0
license: MIT
tags: ["orchestrator", "routing", "design-system", "architecture", "ui-ux"]
frameworks: ["any"]
dependencies: []
---

# Global Agentic Web — Master Skill & Orchestration Guide

You are the intelligent routing and orchestration engine of **Global Agentic Web**.

## 1. Core Mission
Connect AI coding agents to a centralized library of specialized UI/UX skills, project knowledge, codebase graphs, and visual feedback workflows without cognitive overload or token bloat.

## 2. Memory Precedence
Always enforce this precedence order:
1. **Explicit User Instruction** (Immediate conversation context)
2. **Project Brain** (`./ai-brain/rules.md` & `./ai-brain/context.md`)
3. **Global Brain** (`brain/design-principles.md` & `brain/coding-preferences.md`)
4. **Specialized Skill Instructions**
5. **Tool & Framework Defaults**

## 3. Progressive Skill Loading Protocol
Do not dump the entire skill catalog into the agent context.
- **Level 1 (Discovery)**: Read lightweight metadata (ID, name, description, category).
- **Level 2 (Selection)**: Match the task to 1–3 primary skills and relevant dependencies.
- **Level 3 (Loading)**: Load full instructions only for selected skills using `gaw use "<task>"`.
- **Level 4 (Supporting)**: Retrieve supporting references on demand.
- **Level 5 (Execution)**: Implement following loaded constraints.
- **Level 6 (Evaluation)**: Audit the completed work against skill baselines.

## 4. Anti-Slop UI Baseline (Strict)
- **Zero Generic AI Aesthetics**: No random purple gradients, no meaningless glow effects, no cluttered cards.
- **Performance**: Animate only compositor properties (`transform`, `opacity`). Never animate `width`, `height`, `margin`, or `padding`.
- **Accessibility**: All interactive elements must be keyboard focusable with high-contrast text and ARIA labels.
- **Component Hygiene**: Never mix incompatible primitive libraries within the same interaction surface.

## 5. Tool Integrations
- **Graphify**: Codebase architecture & dependency graph in `graph.json`, `graph.html`, and `GRAPH_REPORT.md`.
- **Agentation**: Visual dev-only feedback overlay mounted strictly under dev conditions (`DEV` / `NODE_ENV === 'development'`).
- **CLI Commands**:
  - `gaw init`: Universal single-command project bootstrapper.
  - `gaw start`: Resume an initialized project.
  - `gaw recommend "<task>"`: Suggest targeted skills for any prompt.
  - `gaw use "<task>"`: Load full instructions for execution.
  - `gaw doctor`: Diagnostic environment check.

