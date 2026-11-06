# Component Preferences & Universal Reusability Standards

> This document defines the universal component architecture and reusability standards for Global Agentic Web.
> Refer to [coding-preferences.md](coding-preferences.md) for full implementation patterns and TypeScript conventions.

## Core Rules for Every Component
1. **Zero Hardcoded Values**: No raw hex codes, fixed pixel dimensions, or arbitrary spacing. Use design tokens exclusively.
2. **Layout Independence**: Components must never set outer margins (`m-*`). Parents manage spacing via `gap-*`.
3. **Composition Over Configuration**: Prefer compound components (`Card.Header`, `Card.Content`) and children slots over dozens of boolean flags.
4. **Polymorphic Controls**: Interactive components must support `asChild` (Radix Slot) to render as links or buttons while retaining styles and accessibility.
5. **Fluid Sizing**: Use `w-full`, `max-w-*`, container queries (`@container`), and `h-dvh`. Never fix fixed heights or widths.
6. **Accessible Primitives**: Build on headless primitives (`Radix UI`, `Base UI`). Never hand-roll keyboard traps or focus loops.
7. **Predictable APIs**: Accept standard HTML attributes, strictly typed props, and merge `className` with `cn(variants(), className)`.

