---
name: "motion-dev"
description: "Production-grade animations, spring physics, layout transitions, and gesture feedback using Motion (formerly Framer Motion) at motion.dev."
license: "MIT"
metadata:
  gaw-title: "Motion (motion.dev) Engine"
  gaw-category: "animation-motion"
  gaw-author: "motion.dev"
  gaw-version: "12.1.0"
  gaw-tags: "motion, animation, react, framer-motion, gestures, micro-interactions, spring-physics"
---

# Motion (motion.dev) — React & Web Animation

Use this skill when the project already depends on `motion` (or the older `framer-motion`). If it uses another animation library, use that library's skill instead; don't mix two libraries.

## 1. Install & imports

```bash
npm install motion
```

React: import from `"motion/react"`. Projects still on `framer-motion` import from `"framer-motion"`; the API below is the same.
```tsx
import { motion, AnimatePresence, useScroll, useReducedMotion } from "motion/react";
```

## 2. Rules

- **Prefer `transform` and `opacity`** (`x`, `y`, `scale`, `rotate`, `opacity`). They don't trigger layout.
- **Size changes**: use the `layout` prop (FLIP, transform-based) for reordering and resizing. Animating `height: "auto"` is fine for a small accordion; avoid per-frame size animation on large or many elements.
- **Timing** (see the `micro-interactions-system` skill for the full table): feedback to input starts immediately (`whileTap` applies on press) and settles within 300ms; user-triggered transitions 150–300ms; entrance reveals may take longer but never block input.
- **Reduced motion**: wrap the app in `<MotionConfig reducedMotion="user">`, or check `useReducedMotion()` and drop movement (keep opacity).
- **No infinite loops** outside a hero unless the user asked for one.

## 3. Patterns

Examples use TypeScript and utility classes; adapt them to the project's language and styling.

### 3.1 Pressable button
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  Save
</motion.button>
```

### 3.2 Mount & exit (`AnimatePresence`)
```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {message}
    </motion.div>
  )}
</AnimatePresence>
```

### 3.3 Shared layout (`layoutId`)
```tsx
{tabs.map((tab) => (
  <button key={tab} onClick={() => setActive(tab)} style={{ position: "relative" }}>
    {active === tab && (
      <motion.span layoutId="tab-indicator" style={{ position: "absolute", inset: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }} />
    )}
    <span style={{ position: "relative" }}>{tab}</span>
  </button>
))}
```

### 3.4 Scroll progress
```tsx
const { scrollYProgress } = useScroll();
return <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} />;
```

## 4. Checks
- [ ] Movement is removed or reduced under `prefers-reduced-motion`.
- [ ] Animated controls stay focusable and usable during and after transitions.
- [ ] No layout shift (CLS) from entering elements.
