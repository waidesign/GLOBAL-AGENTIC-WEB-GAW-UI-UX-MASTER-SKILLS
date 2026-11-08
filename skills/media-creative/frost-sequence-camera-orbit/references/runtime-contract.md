<!-- Part of the frost-sequence-camera-orbit skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Runtime contract

- One paused GSAP timeline registered as `window.__timelines["frost-sequence-rig"]`.
- Re-syncs on the `hf-seek` CustomEvent; every frame is a closed-form function of time (seeded PRNG only, no rAF loops, no Date.now).
- Renderer: WebGPU, GSAP, Matcap.
- External runtime dependencies: none (served locally).

## Editing rules (from the source project)

1. Keep `data-composition-variables` a single-quoted attribute with plain `"` JSON. Never save it through Studio's Design panel.
2. Do not put `<canvas>` in static markup; create it at runtime.
3. Keep every visual state a function of t; seek-safety is what makes the block renderable.
