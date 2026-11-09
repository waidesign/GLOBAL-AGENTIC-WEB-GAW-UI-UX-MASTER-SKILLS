---
name: "accessibility-baseline"
description: "The shared baseline every new or changed UI meets while it is built: keyboard, focus, names, contrast, motion and forms. Loaded alongside UI and animation skills so they don't each repeat it; for audits and fixes use fixing-accessibility."
license: "MIT"
metadata:
  gaw-title: "Accessibility Baseline (WCAG 2.2 AA)"
  gaw-category: "accessibility"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
  gaw-tags: "accessibility, baseline, keyboard, focus, reduced-motion"
---

# Accessibility Baseline

Every UI change meets these. They are short on purpose; for audits and fixes use the `fixing-accessibility` skill.

## Keyboard & focus
- Everything clickable works with the keyboard (Tab, Enter/Space, Esc for dialogs and menus).
- Use native elements first (`button`, `a href`, `input`, `select`, `dialog`) before ARIA.
- Focus is always visible (`:focus-visible`, at least 3:1 against the background) and never hidden behind sticky headers.
- Dialogs move focus in, keep it inside, and return it to the trigger on close.

## Names & structure
- Every control has an accessible name: visible text, `<label>`, or `aria-label` for icon-only buttons.
- Images: meaningful `alt`, or `alt=""` when decorative.
- One `h1` per page; headings don't skip levels.
- Status changes (toasts, saved, errors) are announced: `role="status"` or `aria-live="polite"`.

## Color & contrast
- Body text 4.5:1, large text and UI boundaries 3:1.
- Never use color alone to show state: add text, an icon or a pattern.

## Motion
- Respect `prefers-reduced-motion: reduce`: no movement (translate, scale, parallax, shake); instant changes or short fades only.
- Nothing flashes more than 3 times per second. Auto-playing motion longer than 5s can be paused.
- Animation never delays or blocks input.

## Forms
- Errors say what went wrong and how to fix it, next to the field, linked with `aria-describedby`; `aria-invalid="true"` on the field.
- Don't disable the submit button to signal errors; show them.
- Destructive actions use a confirm step or Undo, never a long-press or a timed hold.

## Targets & zoom
- Touch targets at least 24×24 CSS px (44×44 preferred).
- Works at 200% zoom and 320px width without horizontal scrolling.

## Done when
- [ ] Keyboard-only walkthrough of the change works.
- [ ] Contrast checked for new colors.
- [ ] Reduced-motion setting tested.
- [ ] A screen reader names every new control.
