# Skill: Motion (motion.dev) Engine

# Motion (motion.dev) — React & Web Animation

Modern web animation standard powered by `motion` (formerly Framer Motion).

## 1. Installation & Imports

```bash
npm install motion
# or pnpm add motion / yarn add motion / bun add motion
```

Always import from `"motion/react"` in React applications:
```tsx
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "motion/react";
```

---

## 2. Anti-Slop Constraints & Performance Rules

- **Compositor Only**: Animate strictly `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`. NEVER animate layout properties (`width`, `height`, `margin`, `padding`, `top`, `left`).
- **Duration Budget**: Micro-interactions must complete within **150ms to 300ms**.
- **Reduced Motion**: Always check `useReducedMotion()` or CSS `@media (prefers-reduced-motion)`.
- **No Infinite Loops**: Never run looping animations on non-hero elements unless explicitly requested.

---

## 3. Core Implementation Patterns

### 3.1 Fluid Spring Micro-Interaction (Button & Card)

```tsx
import { motion } from "motion/react";

export function InteractiveButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium shadow-sm"
    >
      {children}
    </motion.button>
  );
}
```

### 3.2 Exit & Mount Animations (`AnimatePresence`)

Always wrap conditionally rendered elements with `<AnimatePresence>`:

```tsx
import { motion, AnimatePresence } from "motion/react";

export function NotificationToast({ isVisible, message }: { isVisible: boolean; message: string }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 right-4 rounded-md bg-card p-4 shadow-lg border border-border"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 3.3 Shared Layout Transitions (`layoutId`)

Enable magical transitions between tabs, cards, or active states with zero math:

```tsx
import { useState } from "react";
import { motion } from "motion/react";

const TABS = ["Overview", "Metrics", "Settings"];

export function TabNav() {
  const [active, setActive] = useState(TABS[0]);

  return (
    <div className="flex gap-2 border-b border-border p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className="relative px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {active === tab && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute inset-0 rounded-md bg-accent"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
```

### 3.4 Scroll-Linked Progress & Parallax

```tsx
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
    />
  );
}
```

---

## 4. Accessibility Checklist for Motion
- [ ] Are animations disabled or simplified when `prefers-reduced-motion` is active?
- [ ] Are all animated elements keyboard focusable before and after transitions?
- [ ] Does layout remain stable without Cumulative Layout Shift (CLS)?