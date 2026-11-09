---
name: "animejs"
description: "Lightweight, modular JavaScript animation engine for complex timelines, SVG morphing, staggered reveals, and high-performance micro-interactions."
license: "MIT"
metadata:
  gaw-title: "Anime.js (animejs.com) Animation Engine"
  gaw-category: "animation-motion"
  gaw-author: "animejs.com"
  gaw-version: "4.1.0"
  gaw-tags: "animation, motion, micro-interactions, timelines, svg, stagger"
---

# Anime.js v4 — Timelines & SVG Animation

Use this skill when the project already depends on `animejs` (v4). If it uses another animation library, use that library's skill instead; don't mix two libraries. Projects on v3 (`import anime from 'animejs'`) need the v3 API; see the [v3 → v4 migration guide](https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4).

## 1. Install & imports

```bash
npm install animejs
```

v4 uses named exports (no default `anime` object):
```javascript
import { animate, createTimeline, stagger, svg, waapi } from 'animejs';
```

## 2. Rules
- Targets first, then parameters: `animate(targets, { ... })`. Easing uses `ease` (`'outQuad'`, `'inOutSine'`).
- Prefer `x`, `y`, `scale`, `rotate`, `opacity`.
- Timing: feedback to input settles within 300ms; entrance sequences may take longer but never block input; counters ~1–1.5s (see the `micro-interactions-system` skill).
- Reduced motion: check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and set the final state without animating.

## 3. Patterns

### 3.1 Staggered entrance
```javascript
animate('.card', {
  opacity: [0, 1],
  y: [24, 0],
  duration: 350,
  ease: 'outQuad',
  delay: stagger(40)
});
```

### 3.2 Number counter (ambient/data motion)
```javascript
export function countTo(element, target, duration = 1200) {
  const state = { value: 0 };
  animate(state, {
    value: target,
    duration,
    ease: 'outExpo',
    onUpdate: () => { element.textContent = Math.round(state.value).toLocaleString(); }
  });
}
```
Keep the final value in the HTML (or an `aria-label`) so screen readers don't hear every step.

### 3.3 Timeline
```javascript
const tl = createTimeline({ defaults: { ease: 'outQuad' } });
tl.add('.backdrop', { opacity: [0, 1], duration: 200 })
  .add('.dialog', { opacity: [0, 1], scale: [0.95, 1], duration: 250 }, '-=100');
```

### 3.4 SVG line drawing
v4 replaces v3's `anime.setDashoffset` with `svg.createDrawable()` and a `draw` property:
```javascript
animate(svg.createDrawable('.checkmark path'), {
  draw: ['0 0', '0 1'],
  duration: 500,
  ease: 'outSine'
});
```

### 3.5 Lightweight WAAPI mode
`waapi.animate()` runs on the browser's native Web Animations API; anime.js's docs list it at about 3KB versus about 10KB for `animate()`.
```javascript
waapi.animate('.toast', { opacity: [0, 1], y: [20, 0], duration: 250, ease: 'ease-out' });
```

## 4. Checks
- [ ] Feedback animations settle within 300ms; longer motion is entrance or ambient only.
- [ ] Transforms and opacity only, unless a size change is deliberate.
- [ ] `prefers-reduced-motion` skips movement and shows the final state.
