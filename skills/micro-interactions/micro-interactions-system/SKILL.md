---
name: "micro-interactions-system"
description: "Tactile, physics-driven micro-interactions for buttons, toggles, forms, dialogs, and notifications with strict timing and feedback budgets."
license: "MIT"
metadata:
  gaw-title: "Micro-Interactions Design System"
  gaw-category: "micro-interactions"
  gaw-author: "ui-skills"
  gaw-version: "1.1.0"
  gaw-tags: "motion, ui-feedback, tactile, springs, gestures"
---

# Micro-Interactions Design System

Micro-interactions are small product moments that acknowledge input, show system state, and make controls feel physical. They are library-agnostic: use whatever the project already has (CSS transitions, or the animation library in `package.json`). Never add a second animation library.

## 1. Timing budgets

Pick the budget by **who started the motion**:

| Kind | Examples | Budget |
|---|---|---|
| Feedback to input | press, hover, toggle, focus ring, validation | Starts within **100ms**, done within **300ms** |
| Transition the user triggered | open a dialog, expand, toast, sheet | **150–300ms** |
| Entrance / scroll reveal | section or headline revealing as it enters | Up to **~1s** total; content is readable and usable immediately, never blocks input |
| Ambient / data | number counters, progress, loading | Can run longer (counters ~1–1.5s); never loop forever outside a hero |

"Never exceed 300ms" applies to the first two rows. Entrance and ambient motion follow their own rows.

## 2. Patterns

### 2.1 Button press
- **Hover**: subtle lift (`scale: 1.02` or `y: -1px`).
- **Press (`:active`)**: `scale: 0.97` or `y: 1px`, applied on press, not after release.
- **Release**: quick spring back (e.g. stiffness 500, damping 25) that settles with at most one small overshoot.

### 2.2 Toggle switch
The thumb may stretch slightly along its path (`scaleX: 1.15`) then settle. State, color and `aria-checked` change immediately; motion only follows.

### 2.3 Form feedback
- **Focus**: visible focus ring, appears within 150ms (never animate it in slowly).
- **Validation failure**: one short damped shake (`x: [0, -6, 6, -3, 3, 0]` within 250ms) **plus** the error message, color and icon. Under `prefers-reduced-motion`, skip the shake; the message, color and icon carry the meaning.
- **Validation success**: icon scale pop (`scale: [0.8, 1.1, 1]` in 200ms) with a success color; reduced motion: no scale.

### 2.4 Destructive actions
- Use an explicit confirm step that names what will be deleted, or do the action and offer **Undo** (toast, 5–10s).
- Never require a long-press: it is hard for keyboard, switch and motor-impaired users.
- Removal: fade and scale out (`opacity: 0`, `scale: 0.95`). If the list must close the gap, animate the layout with the library's layout feature (or FLIP) rather than animating `height` per frame.

## 3. Choosing a tool

Use the first that fits **and is already in the project**:

1. CSS transitions/`:active`/`:focus-visible` for hover, press and focus (no JS).
2. The animation library already in `package.json` (see the `motion-dev`, `animejs` or `masked-reveal` skill for its API).
3. Only if none is installed and CSS can't do it: ask before adding one library.

## 4. Rules
- Every micro-interaction explains a state change. No decoration-only motion.
- Springs settle with at most one visible overshoot. The validation shake is the only multi-swing motion, and it is skipped under reduced motion.
- Under `prefers-reduced-motion: reduce`, remove movement (translate, scale, shake); keep instant state changes and short opacity fades.
- Show feedback immediately while waiting for the network (pressed or loading state), then the result.
- Follow the shared accessibility baseline (`accessibility-baseline` skill).
