# Active Task: Build micro-interactions with motion-dev and animejs

Timestamp: 2026-11-06T13:36:53.839Z

# GUIDED AGENT WORKFLOW — ACTIVE SKILL CONTEXT

Loaded 6 specialized skill(s) for the current task.

## Skill: Anime.js (animejs.com) Animation Engine (animejs)
**Category**: `animation-motion` | **Author**: animejs.com | **Version**: 4.0.0

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

---

## Skill: Micro-Interactions Design System (micro-interactions-system)
**Category**: `micro-interactions` | **Author**: ui-skills | **Version**: 1.0.0

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

---

## Skill: Motion (motion.dev) Engine (motion-dev)
**Category**: `animation-motion` | **Author**: motion.dev | **Version**: 12.0.0

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

---

## Skill: Build a Design System (build-design-system)
**Category**: `design-systems` | **Author**: arla6ka | **Version**: 1.0.0

\# Build a design system

Vocabulary is in \`references/glossary.md\`, defaults for bans and widths in \`references/taste.md\`. The app's own look is the source. Invent no colour, font, shadow, gradient or motion value it does not already have, unless the person chose a design source and confirmed a sample.

Scripts are in this skill's \`scripts/\`. Run them from the repo root with node, and read \`--help\` first. \`scripts/capture.mjs\` takes the screenshots behind \`scripts/capture-guard.mjs\`, which blocks every write, and \`scripts/pixdiff.mjs\` compares them. Capture and pixdiff need Playwright and a Chromium, which \`scripts/find-chromium.mjs\` finds or explains how to install.

\#\# Steps

1\. \*\*Frame.\*\* Read AGENTS.md or CLAUDE.md, the manifest and the route tree. Write the complaint in the person's words, the first visible change that answers it, and the pilot flow (the one the complaint names, else the flow with the most component families and a form with an error state). Add \`.design-system/\` to \`.git/info/exclude\` so no note, capture or scratch file is ever committed. Use the branch the person named as the run branch, or cut one and write the branch you started on to \`.design-system/start-branch\`, which \`land.mjs\` refuses. Offer \`references/taste.md\` once with its bans unselected and save the accepted copy to \`.design-system/taste.md\`. Ask nothing else. Take the default, record it as \`default (unanswered)\` and go on.  
   Done when the complaint, pilot, branch and accepted taste file are written down.

2\. \*\*Inventory and baselines.\*\* List every surface, its states and whether it writes data. Count raw values in occurrences (\`\#fff\`, \`text-gray-500\`, \`p-\[13px\]\`) with \`scripts/check-system.mjs \--no-allowlist \--no-self-test \--json\`, and group components into families. Capture every surface in every state at the narrowest and widest supported width (390 and 1280 by default), one fresh navigation per width, before any edit. With the app running (port 3000 here), list each surface as a \`surface\<TAB\>route\<TAB\>states\` row in \`.design-system/surfaces.tsv\` and every write the app sends as \`METHOD URL\` in \`.design-system/writes.txt\`, copied from its network log, then run \`node \<this skill\>/scripts/capture.mjs \--base http\://localhost:3000 \--kind before \--out .design-system/captures \--surfaces .design-system/surfaces.tsv \--writes .design-system/writes.txt\`. It refuses to start without \`--writes\` (or \`--no-backend\` for an app that sends no writes), proves each write blocked before the browser opens, saves each capture's accessibility tree and exits 1 on any capture it missed. Delete what nothing uses, in its own commit.  
   Done when each surface has a baseline or a stated \`not captured\` reason.

3\. \*\*Tokens.\*\* Cluster raw values by role, name them by purpose and pair each surface with its foreground (\`references/tokens.md\`). Run \`token-mapping\` until every raw value maps to a role, a merge or a listed exception. Merges inside tolerance are decisions. Past tolerance, open one gate per cluster whose default is the merge. Make every identical-value swap on every route.  
   Done when \`token-mapping\` reports zero gaps outside the exception list and \`pixdiff.mjs\` at tolerance 0 reports 0% for every surface a swap touched.

4\. \*\*Components.\*\* Build the most-used family end to end first (\`references/components.md\`). The text primitive and the small-text primitive ship in wave 1 beside Button. Document each with \`component-docs\`. Show the family to the person before fan-out, because a core bug found after screens consume the system costs a sweep (a disabled field still drawn red, a Combobox 2 px taller than Input, panel actions that do not wrap, a file drop that fails in silence).  
   Done when every canonical component has a registry row and a doc, and its disabled, required, error and long-text states are captured in the showcase and shown to the person.

5\. \*\*Checks.\*\* Copy \`scripts/check-system.mjs\` and \`scripts/oklch.mjs\` into the repo's \`scripts/\`, run \`--init\`, then \`--init-allowlist\` once. A rule counts only once it is seen failing: plant one violation in a scanned folder, run \`--files \<plant\> \--no-allowlist\`, see exit 1 naming the rule, then delete the plant. The allowlist and ratchet only shrink. A ban ships with its check rule in the same change. Copy rules ship with their exemptions, element-scoped, for text that must stay verbatim (quotes, terms, version strings) and for payload strings that a machine or person pastes elsewhere (a prompt, an API example, a clipboard value), because rewriting them changes what someone else receives.  
   Done when the check exits 0 on a clean clone, \`--self-test\` ends "all as expected", and every rule the run added was seen failing on its plant this session.

6\. \*\*Pilot.\*\* Move the pilot flow with a codemod you read hunk by hunk. Capture after with the baseline's command, widths, themes and data, changing only \`--kind after\`, then \`pixdiff.mjs\` the two folders. An unexplained difference is a defect. Walk the flow by keyboard, force its error and loading states, then run \`ui-review\` on the after captures.  
   Done when every difference in the captures traces to a decision or gate. A rendered change with no capture is reported \`checks-only\`.

7\. \*\*Readiness.\*\* Before a migration fans out, the five audits below hold or carry a recorded exemption.

8\. \*\*Handoff.\*\* Rerun the counts. Report what the system covers in numbers, unanswered defaults first, then what was found and not fixed, ranked. Offer the migration with its size. Do not start it.  
   Done when every number in the report names the command that produced it.

\#\# Readiness audits

A gap found after screens consume the system costs a sweep. A gap found before costs a row. Run these at the end of step 5 and again before the first wave. Write each result to \`.design-system/readiness.md\` with a verdict word.

1\. \*\*Slot and prop parity.\*\* Every prop of each legacy primitive that has call sites has a matching prop on the new primitive or a gap row.  
2\. \*\*Behaviour contracts.\*\* A "what fires when" table per interactive primitive, each row a test (\`references/components.md\`).  
3\. \*\*Tone parity.\*\* Every pressable and row primitive crossed with every status tone plus muted. Each empty cell is a gap row or stated unsupported.  
4\. \*\*Pinned strings.\*\* Every legacy test query by role name or text has a default name on the new primitive and a label override.  
5\. \*\*Hardest screens.\*\* One hardest call site per family renders in the showcase, with a screenshot.

A family that is not ready is not migrated. Its screens stay on legacy.

\#\# Never

\- Push, publish or deploy, unless the person asks for it in this session.  
\- Commit on the branch the run started on. Cut the run branch first.  
\- Stash, or switch branches in a dirty checkout. A dirty checkout gets the run branch in its own worktree (\`git worktree add\`).  
\- Delete anything another package or a public API exports. Stop, and list it as a gate with its importers.  
\- Skip a step in silence. If the app will not build or run, the report says \`code-complete, not runtime-verified\` and names what was not exercised.  
\- Call your own work \`verified\`. On a host that cannot start other agents, run the steps in order, check each from a fresh read of the diff and the captures, and mark those verdicts \`self-verified\`.

\#\# Rules

\- Raw value smells are \`\#fff\`, \`rgb(\`, \`text-gray-500\`, \`p-\[13px\]\` and \`style={{ padding: 12 }}\`. Each maps to a semantic token or a listed exception.  
\- A missing primitive is a gap row, never a workaround inside a surface.  
\- Colour merges inside delta E OK 2 and spacing merges inside 2 px are decisions. Border width, weight and easing have no tolerance.  
\- A change that only adds semantics (a name, a role, \`aria-current\`) is a decision. One that removes or restructures semantics is a gate.  
\- Wrong: \`{saving ? "Saving..." : "Save"}\`. Right: the idle label stays, a spinner sits inside the same box, \`aria-busy\` is set.  
\- A fix that recurs twice becomes a check rule or a script, not another sentence.  
\- A baseline is never edited to make a diff pass. A check that flags correct code is fixed in the check, with a planted case that proves the fix, never by bending the code.  
\- A count no script produced, or a check never seen failing, is not reported.

\#\# Done

The check exits 0 on a clean clone with every rule seen failing, every route answers 200 on the production build (\`capture.mjs \--status\`), the pilot matches its baseline except for the listed intended changes, and every handoff count comes from a script.

\`references/traps.md\` lists behaviour traps by ID. \`references/tokens.md\` holds layers, names, tolerances and motion presets.

\#\# Install

npx skills add https\://github.com/arla6ka/skills \--skill build-design-system

---

## Skill: landing-page (landing-page)
**Category**: `ui-ux` | **Author**: ui-skills | **Version**: 1.0.0

# Landing Page (High‑Conversion) — Web Design Skill

A landing page is not a homepage.
A homepage serves multiple intents.
A landing page wins one intent: **one offer → one audience → one primary action**.

## Before you design/write
Gather (ask if missing):

### 1) Page purpose
- What is the ONE primary action? (trial, demo, buy, waitlist, download)
- What’s the offer? (exactly what do they get?)
- What counts as conversion? (click, signup, purchase)

### 2) Audience + context
- Who is the ICP?
- What problem are they trying to solve?
- Top 3 objections (why they don’t convert today)
- Traffic source: ads / search / social / email
- What do visitors already know when they land?

### 3) Proof + assets
- Any proof points: logos, testimonials, numbers, case studies
- Screenshots, demo video, product GIFs
- Guarantees / refund / cancellation terms

### 4) Constraints
- Brand voice: casual vs professional
- Design direction: minimal editorial vs playful 3D vs glass UI
- Mobile priority?

---

## Core structure (what it should include)

### Above the fold (must)
1) **Headline** (outcome + audience)
2) **Subheadline** (clarifies “how” + adds specificity)
3) **Primary CTA** (clear verb + what they get)
4) **One proof signal** (logo strip / stat / short testimonial)
5) **Hero visual** (product screenshot/video) *or* a strong illustration

### Mid page (argument)
6) **Problem → solution** (1 section)
7) **Benefits** (3–5, outcome-driven)
8) **How it works** (3 steps)
9) **Social proof** (testimonials/case study)

### Bottom (objection handling)
10) **FAQ** (6–12 Q/A)
11) **Risk reversal** (trial, cancel anytime, guarantee)
12) **Final CTA** (same as top)

---

## Layout types (pick one)

### A) Classic hero + sections (most common)
Best when:
- product is understandable with a hero screenshot

### B) Long-form story (sales page)
Best when:
- you need to educate + overcome skepticism

### C) Minimal conversion page
Best when:
- high-intent traffic (email → known users)
- short offer (download, waitlist)

### D) Comparison landing page
Best when:
- search intent includes alternatives (“X vs Y”, “best for…”)—usually paired with SEO pages

---

## High‑conversion strategies (practical)

### 1) Match message to source
If traffic is from ads:
- mirror the ad headline in the hero
- use the same promise and visual tone

### 2) Make the next step obvious
- one primary CTA
- avoid multiple competing CTAs above the fold

### 3) Write benefit-first
- Features: what it does
- Benefits: what that means for them

### 4) Use specificity
- ❌ “Save time and streamline”
- ✅ “Cut your weekly reporting from 4 hours to 15 minutes”

### 5) Reduce risk
Pick at least one:
- free trial
- free plan
- no credit card
- cancel anytime
- money-back guarantee

### 6) Objection handling is a section, not a footer
- add FAQ earlier if it’s a high-friction offer
- put proof right next to the claim it supports

---

## Copywriting templates

### Headline formulas
- “{Outcome} without {pain}”
- “The {category} for {audience}”
- “Ship {result} in {time}”

### Subheadline rules
- 1–2 sentences
- clarify what it is + who it’s for

### CTA rules
- Verb + what they get
- Avoid weak CTAs: “Learn more”, “Submit”

Examples:
- “Start free trial”
- “Book a demo”
- “Get the checklist”

### Benefit bullets
Format:
- **Benefit** — proof/detail

Example:
- **Faster iteration** — generate 3 layout variants in one click.

---

## Section-by-section workflow (designer-friendly)
Work in this order:
1) Hero
2) Benefits
3) How it works
4) Proof
5) FAQ
6) Final CTA

Rule: don’t rebuild the whole page each time.
Iterate section-by-section to keep control.

---

## SEO + AEO checklist (when relevant)

### When landing pages should NOT be indexed
- ad-only campaigns
- highly time-bound offers

Use:
- `noindex` (or keep it behind a non-indexed path)

### When they SHOULD be indexed
- evergreen offers
- search intent matches the promise

Add:
- clear title + meta
- internal links from homepage/feature pages
- FAQ in plain Q/A for AEO

Optional:
- FAQ schema (if appropriate)

---

## Common pitfalls
- Too many CTAs above the fold
- Vague value prop (“streamline”, “optimize”)
- Big feature list with no outcomes
- Proof hidden at the bottom
- Mobile layout breaks readability
- No clear next step

---

## Output format (when generating a landing page)
Return:
1) **Page outline** (sections + order)
2) **Hero copy** (headline, subheadline, CTA, proof line)
3) **Benefits section** (3–5 bullets)
4) **How it works** (3 steps)
5) **FAQ** (6–12 Q/A)
6) **SEO/AEO** (indexing recommendation + title/meta if indexed)
7) **Layout recommendation** (A/B/C/D + why)

---

## Quick questions (if user says “make a landing page”)
- What’s the ONE primary CTA?
- Who is the ICP and what’s the main pain?
- Any proof (numbers/testimonials/logos)?
- What’s the offer and risk reversal?
- Where is traffic coming from?

---

## Skill: masked-reveal (masked-reveal)
**Category**: `micro-interactions` | **Author**: ui-skills | **Version**: 1.0.0

# Masked Reveal

## Use When
- A headline or short text block needs a premium reveal on scroll.
- Words should rise through an invisible mask with a staggered sequence.
- The project already uses GSAP or needs ScrollTrigger-based motion.

## Motion Defaults
- Trigger: start when the text top reaches `82%` of the viewport.
- Duration: `0.7s` to `0.9s`.
- Stagger: `0.025s` to `0.045s` per word.
- Offset: `yPercent: 110` to `0`.
- Ease: `power3.out` or `expo.out`.
- Replay: reveal once by default.

## HTML

```html
<h1 class="masked-reveal" data-masked-reveal>
  Design systems that feel alive from the first scroll.
</h1>
```

## CSS Mask

```css
.masked-reveal {
  visibility: visible;
}

html.js .masked-reveal[data-masked-reveal] {
  visibility: hidden;
}

html.js .masked-reveal.is-split {
  visibility: visible;
}

.masked-reveal .word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}

.masked-reveal .word {
  display: inline-block;
  transform: translateY(110%);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  html.js .masked-reveal[data-masked-reveal] {
    visibility: visible;
  }

  .masked-reveal .word {
    transform: none;
  }
}
```

## GSAP ScrollTrigger
This helper avoids the paid SplitText plugin and keeps spaces intact.

```js
document.documentElement.classList.add("js");
gsap.registerPlugin(ScrollTrigger);

function escapeHTML(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function splitMaskedReveal(element) {
  if (element.dataset.maskedRevealReady === "true") return;

  const text = element.textContent.trim();
  element.setAttribute("aria-label", text);
  element.innerHTML = text
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) return part;
      return `<span class="word-mask" aria-hidden="true"><span class="word">${escapeHTML(part)}</span></span>`;
    })
    .join("");
  element.dataset.maskedRevealReady = "true";
  element.classList.add("is-split");
}

function initMaskedReveals(selector = "[data-masked-reveal]") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(selector).forEach((element) => {
    splitMaskedReveal(element);
    const words = element.querySelectorAll(".word");

    gsap.set(element, { autoAlpha: 1 });
    gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: element,
          start: "top 82%",
          once: true,
        },
      }
    );
  });
}

initMaskedReveals();
```

## React Cleanup Pattern

```js
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    initMaskedReveals("[data-masked-reveal]");
  }, rootRef);

  return () => ctx.revert();
}, []);
```

## Taste Rules
- Use on short headlines, labels, and section intros; avoid long paragraphs.
- Keep the vertical offset clean. Do not combine with blur unless the style explicitly calls for it.
- Stagger by word, not letter, for a calmer editorial feel.
- Initialize after fonts are loaded if line wrapping is critical.
- Use `ScrollTrigger.refresh()` after late-loading images or layout shifts.
- Do not split text that contains links, buttons, or meaningful inline markup.

## Quick Checks
- Text is hidden before GSAP initializes, then becomes visible with `autoAlpha: 1`.
- Screen readers get the original full text through `aria-label`.
- Spaces between words are preserved.
- Reduced-motion users see static text.
- ScrollTrigger is cleaned up in SPA routes.

---

