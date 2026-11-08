# Confirmed Coding & Component Preferences

> **Core Axiom**:  
> **Never hardcode design values.** Every visual attribute must derive from design tokens.  
> Every component must be built as an **unopinionated, reusable, composable primitive** that can be dropped into any surface across the product without modification.

---

## 1. Zero Hardcoding Mandate

### 1.1 No Magic Numbers or Raw Values
- **Colors**: Strictly forbid raw hex codes (`#ffffff`, `#3b82f6`), RGB, or HSL strings in component files. Use semantic tokens (e.g., `var(--color-surface-primary)`, `text-muted-foreground`, `bg-card`).
- **Spacing**: Forbid arbitrary margins and paddings (e.g., `p-[13px]`, `margin: 7px`). All spacing must resolve to the standardized 4pt/8pt scale (`space-1` through `space-16`).
- **Typography**: Forbid arbitrary font sizes, line heights, or weights (e.g., `text-[15px]`, `font-size: 1.1rem`). Always use defined type scale tokens (`text-sm`, `text-base`, `text-lg`, `leading-relaxed`).
- **Radii & Borders**: Forbid arbitrary border-radius values (e.g., `rounded-[5px]`). Use tokenized radius scales (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`).
- **Z-Index**: Never invent arbitrary z-index values (`z-[9999]`). Use the design system's fixed elevation ladder (`z-dropdown`, `z-sticky`, `z-modal`, `z-toast`).

### 1.2 Theme-Agnostic Implementation
- Components must never assume a light or dark theme.
- Components must respond automatically to theme changes via CSS variables and semantic tokens.
- Never hardcode white backgrounds with black text; use `bg-background text-foreground`.

---

## 2. Component Reusability & Architecture

### 2.1 One Pattern Per Problem
- Before creating any new component, inspect existing primitives and UI components.
- If a component already satisfies 80% of the requirement, extend it using composition or variants—never create a duplicate or near-clone.
- Consolidate similar one-off components into a single canonical primitive.

### 2.2 Layout Independence (The No-Outer-Margin Rule)
- **Zero Outer Margins**: A component must NEVER set an outer margin (`m-*`, `margin`, `my-*`, `mx-*`) on its root element.
- **Container-Controlled Spacing**: The parent container (using flexbox `gap-*` or CSS grid `gap-*`) is solely responsible for positioning and spacing between siblings.
- A component must seamlessly fit inside a narrow sidebar, a modal dialog, or a full-width page without altering its internal layout.

### 2.3 Fluid Sizing & Container Awareness
- Never hardcode fixed pixel widths or heights on layout containers (e.g., avoid `w-[320px]`, `h-[450px]`).
- Use relative units (`w-full`, `max-w-prose`, `min-h-dvh`, `flex-1`) and CSS `clamp()` or container queries (`@container`) for responsive adaptation.
- Never use `h-screen` (which breaks on mobile viewports with browser chrome); use dynamic viewport units (`h-dvh` or `min-h-dvh`).

---

## 3. Component API Design & Composition

### 3.1 Composition Over Configuration
- Avoid "God Components" with dozens of boolean flags (e.g., `isHeader`, `hasFooter`, `withSidebar`, `isCompact`).
- Deconstruct complex surfaces into modular, composable compound components:
  ```tsx
  // PREFERRED: Flexible, composable Compound Component
  <Card>
    <CardHeader>
      <CardTitle>Analytics</CardTitle>
      <CardDescription>Overview of this month's traffic</CardDescription>
    </CardHeader>
    <CardContent>
      <MetricsChart />
    </CardContent>
    <CardFooter>
      <Button variant="outline">Download Report</Button>
    </CardFooter>
  </Card>
  ```

### 3.2 Polymorphic Rendering & Slot Patterns (`asChild`)
- Provide polymorphic rendering using Radix UI's `Slot` (`asChild`) pattern or React's `as` prop.
- Allow buttons to render seamlessly as link anchors (`<a>`) or Next.js `<Link>` elements while preserving button styling, focus rings, and keyboard accessibility:
  ```tsx
  <Button asChild variant="primary">
    <Link href="/dashboard">Go to Dashboard</Link>
  </Button>
  ```

### 3.3 Strict Class & Style Merging (`cn` Utility)
- Every component root must accept an optional `className` prop and merge it using the standard `cn` utility (`clsx` + `tailwind-merge`):
  ```tsx
  import { cn } from "@/lib/utils";

  export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
      <div
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
  ```
- **No Arbitrary Inline Styles**: Forbid the `style={{ ... }}` prop except for dynamic, runtime-calculated properties (e.g., drag-and-drop coordinates or canvas positions).

---

## 4. State & Logic Decoupling (Headless Architecture)

### 4.1 Separation of Presentation and Logic
- **Pure Presentation**: Components should focus purely on rendering, structure, and accessibility.
- **Headless Hooks**: Extract state transitions, data fetching, validation, and keyboard handlers into reusable custom hooks (e.g., `useDataTable`, `useDisclosure`, `useMediaQuery`).
- This ensures the same underlying logic can be reused across different UI layouts (mobile drawer vs. desktop dropdown).

### 4.2 Single Primitive Foundations
- Build interactive controls on top of proven, accessible headless primitives (`Radix UI`, `Base UI`, `React Aria`).
- Never hand-roll custom keyboard navigation, focus traps, or ARIA state machines when an accessible primitive already exists.
- Never mix different primitive libraries within the same interaction surface.

---

## 5. TypeScript & Code Quality Standards

### 5.1 Strict Typings & Predictable Props
- Explicitly type all component props using TypeScript interfaces or types.
- Extend native HTML element attributes so components support native events and accessibility attributes:
  ```tsx
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
    isLoading?: boolean;
  }
  ```
- Never use `any`. Use strict generic parameters where appropriate.

### 5.2 Clean Named Exports & Predictable File Structure
- Use named exports exclusively (`export function Button() { ... }`) instead of default exports to ensure consistent naming and reliable IDE auto-imports.
- Maintain an atomic component directory structure:
  ```text
  src/components/
  ├── ui/               # Reusable atomic design system primitives (Button, Input, Dialog)
  ├── layout/           # Shared layout containers (Header, Sidebar, Navigation)
  └── features/         # Feature-specific compositions built from ui/ primitives
  ```

### 5.3 Error Boundaries & Graceful Degradation
- Wrap complex composite components (dashboards, data tables, charts) in localized Error Boundaries.
- A failure inside a single widget or chart must never crash the entire application viewport.

---

## 6. Component Reusability Audit Checklist

Before committing any component, verify against this 6-point checklist:

- [ ] **1. Zero Raw Values**: Are all colors, paddings, fonts, radii, and shadows deriving from tokens?
- [ ] **2. No Outer Margins**: Is the component free of outer margins, allowing its parent container to position it?
- [ ] **3. Fluid Dimensions**: Does the component adapt cleanly from mobile widths (320px) to wide containers without horizontal overflow?
- [ ] **4. Composable API**: Does the component use compound sub-components or `children` slots instead of monolithic configuration props?
- [ ] **5. Polymorphic & Extensible**: Does it accept standard HTML attributes, an optional `className` merged with `cn()`, and support `asChild` if interactive?
- [ ] **6. Theme-Agnostic**: Does the component look correct in both Light and Dark themes without any conditional style hacks?
