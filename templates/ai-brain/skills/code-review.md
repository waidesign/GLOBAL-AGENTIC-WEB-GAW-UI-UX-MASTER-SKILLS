# Project Skill: Code Review

## Review Checklist
- [ ] **Contract Verification**: Does this change comply with `ai-brain/rules.md`?
- [ ] **Accessibility**: Are interactive buttons, dialogs, and form fields accessible via keyboard and screen readers?
- [ ] **Performance**: Are there any unnecessary re-renders or unindexed expensive computations in render paths?
- [ ] **Motion Check**: Are animations strictly compositor-only (`transform`, `opacity`) and bounded under 200ms?
- [ ] **Responsive Gates**: Does the layout work correctly at 390px (mobile) and 1280px (desktop)?

