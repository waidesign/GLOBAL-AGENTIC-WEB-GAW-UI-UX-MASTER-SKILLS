# Project Rules & Constraints

1. **Component Purity**: Never mix conflicting UI primitive systems.
2. **Safe Styling**: Never animate layout properties (width, height, margin); animate compositor properties only (transform, opacity).
3. **Accessibility**: Every interactive button must have accessible text or an `aria-label`.
4. **Precedence**: Local project rules override global preferences; explicit user prompts override both.
