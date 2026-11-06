---
id: "micro-interactions-system"
name: "Micro-Interactions Design System"
category: "micro-interactions"
description: "Tactile, physics-driven micro-interactions for buttons, toggles, forms, dialogs, and notifications with strict timing and feedback budgets."
author: "ui-skills"
license: "MIT"
version: "1.0.0"
tags: ["micro-interactions", "motion", "ui-feedback", "tactile", "springs", "gestures"]
frameworks: ["react", "vue", "svelte", "html", "tailwind"]
dependencies: []
relatedSkills: ["motion-dev", "animejs", "baseline-ui"]
lastVerified: "2026-11-06"
---

# Micro-Interactions Design System

Micro-interactions are contained product moments that acknowledge user input, convey system state, and create tangible tactile feedback.

## 1. Timing Budgets (The 100/200 Rule)

- **Acknowledge Budget ($\le$ 100ms)**: Immediate visual response upon touch or click (pressed depth, color shift, scale tap down).
- **Completion Budget (150ms – 250ms)**: Transient state animations (switches sliding, dropdowns expanding, chips dismissing).
- **Notice Budget ($\le$ 300ms)**: Modal dialog reveals, toast notifications, slide-over sheets.
- **Never exceed 300ms** for any interaction initiated by a user action.

---

## 2. Core Micro-Interaction Patterns

### 2.1 The Tactile Button Press (Scale & Depth)
Buttons should feel physically pressable:
- **Hover**: Subtle lift (`scale: 1.02` or `y: -1px`) with enhanced shadow.
- **Press (`:active`)**: Depressed depth (`scale: 0.97` or `y: 1px`).
- **Release**: Quick spring return (`stiffness: 500, damping: 25`).

### 2.2 Toggle Switch Inertia
A toggle switch must not merely snap:
- When flipped, the thumb pill stretches slightly along the axis of movement (`scaleX: 1.15`) before snapping into place with spring damping.

### 2.3 Form Input Feedback & Error Shake
- **Focus**: High-visibility focus ring expands outward by 2px in 150ms (`ease-out`).
- **Validation Failure**: Horizontal damped shake (`x: [-6, 6, -4, 4, -2, 2, 0]` over 250ms).
- **Validation Success**: Icon scale pop (`scale: [0.8, 1.15, 1]` in 200ms) with green accent.

### 2.4 Destructive Action Confirmation
- Destructive buttons require a 200ms long-press or explicit secondary popover before committing.
- Deletion feedback fades item out with quick scale collapse (`scale: 0.95`, `opacity: 0`, height collapses smoothly).

---

## 3. Technology Selection Guide

| Use Case | Recommended Tool | Why |
|---|---|---|
| **React Components & Gestures** | [`motion.dev`](../animation-motion/motion-dev.md) | Declarative `whileHover`, `whileTap`, `layoutId`, and React state sync. |
| **Complex Multi-Stage Timelines** | [`animejs`](../animation-motion/animejs.md) | Precise timeline chaining (`createTimeline`) with millisecond offsets. |
| **SVG Icons & Morphing** | [`animejs`](../animation-motion/animejs.md) | Path length calculation, dashoffset animations, shape morphing. |
| **Simple CSS Hover/Focus** | Tailwind CSS / CSS Transitions | Zero JS runtime overhead for standard hover transitions (`duration-150`). |

---

## 4. Anti-Slop Discipline
- Never add motion for decoration alone. Every micro-interaction must answer the question: *"What physical state change does this explain?"*
- Never bounce or oscillate more than once. Damped springs must settle rapidly.
- Always provide immediate visual feedback while awaiting network requests.

