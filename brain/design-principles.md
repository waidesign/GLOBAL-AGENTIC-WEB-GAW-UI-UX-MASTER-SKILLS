# Confirmed Design Principles

_These apply when a project has a user interface. Projects without one can ignore them._

> **Conflict Resolution Hierarchy**:  
> When design rules or implementation trade-offs conflict, resolve in strict order:  
> **Accessibility → Clarity → Coherence → Performance → Polish**

---

## 1. Anti-Slop (Intentionality & Discipline)

- **1.1 Purpose-Driven Elements**: Every visual element must earn its place by helping the user complete a task. If it exists only for decoration, eliminate it.
- **1.2 Zero Generic AI Aesthetics**: Forbid random purple gradients, background glows, cliché stock hero illustrations, and purposeless glassmorphism.
- **1.3 Icon Discipline**: No emojis in product UI. Icons are permitted only when they carry clear semantic meaning and have a visible text label or accessible programmatic name.
- **1.4 Surface Hierarchy**: Never nest cards inside cards. Avoid unnecessary border outlines: establish visual boundaries using whitespace and subtle background tone shifts first; borders are a last resort.
- **1.5 Text & Contrast Hygiene**: No text shadows. No color overlays or gradient fills placed over text or imagery. Headings must use solid, high-contrast typography tokens (`color.text.primary`). Strictly forbid unnecessary gradient text fills (`text-transparent bg-clip-text bg-gradient-...`) on header colors; apply gradient text to headings only if strictly necessary according to the user's explicit input.
- **1.6 Purposeful Motion**: No gratuitous animations. Every motion must explain a change of state, position, or hierarchy.
- **1.7 Editorial Punctuation**: Body copy must not contain hyphens (`-`), double hyphens (`--`), asterisks (`*`), or underscores (`_`) used as punctuation, decoration, or faux list markers. Use proper commas, periods, or colons.
- **1.8 No Placeholder Copy**: Shipped work and pull requests must contain realistic, domain-specific copy. Never ship with `lorem ipsum` or generic placeholder labels.
- **1.9 Header & Eyebrow Discipline**: Do not prepend eyebrow badges, eyebrow text, kicker labels, announcement banners, or top pills everywhere above headers (`<h1>`, `<h2>`) as boilerplate decoration. Headings must carry visual hierarchy through scale, weight, and spacing alone. Use an eyebrow element or top pill only if strictly necessary or when the user explicitly requests one.

---

## 2. Coherence & Consistency

- **2.1 Token Enforcement**: Every visual attribute (color, typography, spacing, radius, elevation, and motion) must use established design tokens. No hardcoded raw values (`#fff`, `13px`, `padding: 7px`) in component files.
- **2.2 Baseline Grid**: Spacing must adhere strictly to a 4pt or 8pt base scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **2.3 Primitive Reuse**: Reuse existing primitives and atomic components before creating new ones. Enforce one canonical pattern per problem across the product.
- **2.4 Platform Conventions**: Respect native platform affordances: links look like links, buttons look like buttons, and input fields look like inputs.
- **2.5 Typographic Scale**: Limit interfaces to one or two typeface families. Use a fixed, proportional type scale with predetermined line heights and weights.

---

## 3. Clarity & Visual Hierarchy

- **3.1 3-Second Primary Action**: Every view must present exactly one distinct primary action that any user can locate within three seconds.
- **3.2 Natural Hierarchy**: Build hierarchy through scale, weight, contrast, and proximity. Group related elements closely together and separate distinct sections with generous whitespace.
- **3.3 Explicit Action Labels**: Labels must explicitly state outcomes: use strong action verbs for triggers (`Create project`, `Delete record`) and clear nouns for destinations (`Settings`, `Billing`).
- **3.4 Reading Comfort**: Maintain optimal body copy line lengths between 50 and 75 characters per line, with a line-height ratio of 1.4 to 1.6.
- **3.5 Recognition over Recall**: Present options visibly instead of requiring memory recall. Provide sensible defaults, and progressively disclose advanced or secondary configuration.

---

## 4. Accessibility (WCAG 2.2 AA Minimum)

- **4.1 Semantic HTML First**: Use proper document structure with a single `<h1>`, sequential heading levels (`<h2>`–`<h6>`), and native controls (`<button>`, `<a>`, `<label>`). Use ARIA attributes only when native HTML elements cannot satisfy the pattern.
- **4.2 Complete Keyboard Navigation**: All interactive elements must be fully operable by keyboard with a logical tab order, zero keyboard traps, and a visible skip-to-content link on pages with persistent navigation.
- **4.3 Visible Focus Indicators**: Provide a high-visibility focus ring on every interactive element with at least a 3:1 contrast ratio against its surrounding background. Never remove `:focus` or `outline` without an explicit replacement.
- **4.4 Strict Contrast Ratios**: Maintain a minimum contrast ratio of 4.5:1 for body copy and 3:1 for large display text and essential UI component boundaries.
- **4.5 Multi-Cue Signaling**: Never rely on color alone to convey status, errors, or meaning; always pair color with text, icons, or structural patterns.
- **4.6 Touch Targets**: Maintain a minimum touch and click target area of 44 × 44 px for all interactive surfaces.
- **4.7 User Preference Respect**: Adhere strictly to `prefers-reduced-motion`, `prefers-color-scheme`, and system text zoom. Layouts must reflow cleanly up to 200% zoom without triggering horizontal page scrolling.
- **4.8 Semantic Media & Form Labels**: Every image must have meaningful descriptive `alt` text (or `alt=""` if purely decorative). Every form input must have a programmatic, linked `<label>`.
- **4.9 Dynamic Announcements**: Communicate asynchronous UI updates (toasts, validation errors, inline alerts, loading completions) to assistive tech using appropriate ARIA live regions (`polite` or `assertive`).

---

## 5. Interaction & User Feedback

- **5.1 Immediate Feedback Budget**: Acknowledge every user interaction within 100ms. Display loading skeletons or indicators after 300ms, and show determinable progress bars for tasks taking longer than 1 second.
- **5.2 Complete State Design**: Every component and view must have intentionally designed states: Default, Hover, Active/Pressed, Focus, Disabled, Loading/Skeleton, Error, Empty, and Success.
- **5.3 Error Prevention & Recovery**: Prevent user mistakes through smart constraints and input masking. Require explicit confirmation dialogs for destructive or irreversible actions, and provide immediate undo affordances. Always provide an escape route (`Cancel`, `Back`, `Escape` key).
- **5.4 Contextual Plain-Language Errors**: Error messages must clearly state what went wrong and how to correct it in plain language, placed immediately adjacent to the affected field. Validate inputs upon field blur (`onBlur`), never mid-keystroke.
- **5.5 Friction Reduction**: Minimize form fields, enable appropriate browser `autocomplete` and `type` attributes, and preserve user input during validation failures.

---

## 6. Responsive & Content-First Design

- **6.1 Mobile-First Real Content**: Design mobile-first (390px baseline) using edge-case data: unusually long names, missing avatars, empty datasets, and multi-line translated strings.
- **6.2 Cognitive Load Management**: Limit choices per screen on narrow viewports; split multi-step tasks into clear, progressive disclosures.
- **6.3 Encapsulated Overflow**: Data tables, wide code blocks, and rich media must scroll horizontally inside their own isolated container. The global browser window must never scroll horizontally.

---

## 7. Performance & Motion Engineering

- **7.1 Compositor-Only Animation**: Animate exclusively `transform` and `opacity` properties to guarantee sustained 60fps execution on the compositor thread. Never animate layout dimensions (`width`, `height`, `margin`, `padding`, `top`, `left`).
- **7.2 Transition Timing**: Micro-interactions and UI transitions must execute within 150ms to 300ms, using ease-out (deceleration) on entrance and ease-in (acceleration) on exit.
- **7.3 Render Optimization**: Eliminate unnecessary virtual DOM re-renders. Keep component state as local as possible, memoize expensive computations, use stable object references, and avoid inline function declarations on hot rendering paths.
- **7.4 Perceived Performance**: Prioritize content skeletons and optimistic UI mutations over blocking full-screen spinners. Lazy-load below-the-fold media, use `font-display: swap`, and reserve explicit aspect-ratio space to prevent Cumulative Layout Shift (CLS).

---

## 8. Design System Governance & Token Architecture

- **8.1 Single Source of Truth**: Design tokens are authored once; design and code share identical token keys, variant names, and prop signatures. An unmapped raw value is treated as a defect.
- **8.2 Three-Tier Token Hierarchy**:
  - *Tier 1: Global Primitives* (e.g., `blue.600`, `space.16`, `font.size.14`)
  - *Tier 2: Semantic Roles* (e.g., `color.surface.primary`, `color.text.muted`, `action.primary.bg`)
  - *Tier 3: Component Scoped* (e.g., `button.padding.x`, `dialog.radius`)  
  *Application code and components consume Tier 2 and Tier 3 tokens only; never Tier 1 primitives directly.*
- **8.3 Decoupled Themes**: Theming (Light/Dark/Brand) swaps semantic token values with zero component code modification. Document the contrast ratio of every token pair.
- **8.4 System Foundations**: Maintain an official type scale with named roles, an 8pt spacing ladder, standardized color roles with interactive states, a compact 4-level elevation ladder used strictly for layering, one shared responsive breakpoint set, and standardized animation durations tied to user intent.
- **8.5 Single-Responsibility Components**: Components encapsulate one job built on accessible primitives (Radix, Base UI). Accessibility semantics ship internal to the component.
- **8.6 Minimal Component APIs**: Favor composition over bloated configuration props. Prohibit arbitrary CSS/style overrides, handle variable content lengths gracefully, never apply outer margins, and embed the 44 × 44 px target geometry natively.
- **8.7 Canonical Pattern Documentation**: Document when to use each pattern, when to avoid it, and its component dependencies. Formalize editorial voice, label casing, and error structures alongside code.
- **8.8 Living Documentation**: Every component catalog entry must specify: purpose, usage guidelines, anatomy diagram, variant matrix, interactive states, accessibility checklist, and live interactive examples with side-by-side Do's and Don'ts.
- **8.9 Evolution & Governance**: Semantic versioning with breaking changes reserved for major releases. A new component requires a validated user problem, reuse across at least two independent flows, and an assigned owner. Deprecate with migration guides prior to removal.
- **8.10 Automated Quality Gates**: Automated accessibility audits (`axe-core`) and visual regression checks on all variants and themes. Enforce linting rules that fail on raw color, spacing, or typography values.
- **8.11 Token Gaps**: Never invent an unapproved raw value. Select the nearest existing token, flag the gap in the system tracker, and propose an addition.

---

## 9. Definition of Done Checklist

Before approving any UI surface or component for merge, verify:

- [ ] **1. 3-Second Action**: Can the primary call to action be identified within 3 seconds?
- [ ] **2. Full Keyboard Navigability**: Does every control operate via keyboard with a high-visibility focus ring?
- [ ] **3. Contrast Compliance**: Do all text (4.5:1) and UI boundaries (3:1) satisfy WCAG 2.2 AA contrast?
- [ ] **4. Comprehensive States**: Are Default, Hover, Focus, Disabled, Loading/Skeleton, Error, and Empty states implemented?
- [ ] **5. Token Fidelity**: Does the implementation use semantic design tokens with zero raw values?
- [ ] **6. Safe Motion**: Are animations strictly compositor-only (`transform`/`opacity`), capped at 300ms, and disabled under `prefers-reduced-motion`?
- [ ] **7. Zero Slop**: Has every non-functional decorative element, emoji, nested card, unnecessary eyebrow badge/pill, unrequested gradient header text, and hyphenated punctuation been eliminated?
- [ ] **8. System Integration**: For new components: is it named by purpose, documented with Do/Don't examples, accessibility-tested, and version-tracked?
