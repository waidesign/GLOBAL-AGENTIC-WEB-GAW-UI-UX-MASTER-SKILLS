---
id: "animejs"
name: "Anime.js (animejs.com) Animation Engine"
category: "animation-motion"
description: "Lightweight, modular JavaScript animation engine for complex timelines, SVG morphing, staggered reveals, and high-performance micro-interactions."
author: "animejs.com"
license: "MIT"
version: "4.0.0"
tags: ["animejs", "animation", "motion", "micro-interactions", "timelines", "svg", "stagger"]
frameworks: ["any", "react", "vue", "svelte", "html"]
dependencies: []
relatedSkills: ["motion-dev", "animation-systems", "masked-reveal"]
lastVerified: "2026-11-06"
---

# Anime.js v4 (animejs.com) — Timeline & SVG Animation

Lightweight, high-performance animation engine supporting modular imports, native WAAPI acceleration, and complex timeline orchestrations.

## 1. Installation & Modular Imports (v4 Standard)

```bash
npm install animejs
```

Anime.js v4 uses modern named modular exports (no monolithic default import):
```javascript
import { animate, createTimeline, stagger, waapi, createLayout } from 'animejs';
```

---

## 2. Core Concepts in Anime.js v4

- **Targets First**: Target elements/selectors are passed as the first argument, followed by parameter options.
- **Timing & Easing**: Uses `ease` (e.g. `'outQuad'`, `'inOutSine'`, `'outElastic(1, .5)'`).
- **Compositor Acceleration**: Uses `x`, `y`, `scale`, `rotate`, and `opacity` for hardware-accelerated transforms.

---

## 3. High-Impact Patterns & Examples

### 3.1 Staggered List / Grid Reveal

Animate grids and lists with spatial and directional stagger math:

```javascript
import { animate, stagger } from 'animejs';

export function animateGridEntrance(containerSelector = '.dashboard-card') {
  animate(containerSelector, {
    opacity: [0, 1],
    y: [24, 0],
    scale: [0.96, 1],
    duration: 350,
    ease: 'outQuad',
    delay: stagger(40, { from: 'first' })
  });
}
```

### 3.2 Dynamic Number Counter (SaaS Dashboard Metric)

Smoothly animate counters and stats without third-party ticker plugins:

```javascript
import { animate } from 'animejs';

export function animateMetricCounter(element, targetValue, duration = 1200) {
  const counterObj = { value: 0 };

  animate(counterObj, {
    value: targetValue,
    duration,
    ease: 'outExpo',
    onUpdate: () => {
      element.textContent = Math.round(counterObj.value).toLocaleString();
    }
  });
}
```

### 3.3 Chained Timeline Choreography (`createTimeline`)

Synchronize complex multi-element sequences:

```javascript
import { createTimeline } from 'animejs';

export function playModalEntrance(modalSelector, backdropSelector, contentSelector) {
  const tl = createTimeline({
    defaults: { ease: 'outQuad' }
  });

  tl.add(backdropSelector, {
    opacity: [0, 1],
    duration: 200
  })
  .add(modalSelector, {
    opacity: [0, 1],
    scale: [0.92, 1],
    y: [16, 0],
    duration: 250,
    ease: 'outBack'
  }, '-=100') // Overlap by 100ms
  .add(contentSelector, {
    opacity: [0, 1],
    y: [8, 0],
    duration: 180
  }, '-=80');

  return tl;
}
```

### 3.4 SVG Path Stroke Drawing & Morphing

Animate iconography, success checkmarks, or dynamic vector lines:

```javascript
import { animate } from 'animejs';

export function drawSuccessCheckmark(pathElement) {
  animate(pathElement, {
    strokeDashoffset: [animate.setDashoffset, 0],
    duration: 500,
    ease: 'outSine'
  });
}
```

### 3.5 Ultra-Lightweight WAAPI Mode (~3KB)

When bundle size is critical, use the Web Animations API mode:

```javascript
import { waapi } from 'animejs';

waapi.animate('.interactive-element', {
  opacity: [0, 1],
  x: [20, 0],
  duration: 250,
  ease: 'ease-out'
});
```

---

## 4. Usage Checklist
- [ ] Are animations bounded under 300ms for user-triggered micro-interactions?
- [ ] Are transforms hardware accelerated (`x`, `y`, `scale`)?
- [ ] Is `prefers-reduced-motion` honored by checking `window.matchMedia('(prefers-reduced-motion: reduce)').matches`?

