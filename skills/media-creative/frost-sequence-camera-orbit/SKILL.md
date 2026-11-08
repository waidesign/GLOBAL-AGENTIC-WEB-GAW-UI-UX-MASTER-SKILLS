---
name: "frost-sequence-camera-orbit"
description: "An orbiting camera follows an ice logo as it breaks apart, reforms into two text moments, and fades. HyperFrames block, 1920×1080, 22.5s, 216 variables."
license: "Apache-2.0"
metadata:
  gaw-category: "media-creative"
  gaw-author: "heygen-com"
  gaw-version: "1.0.0"
---

# Frost Sequence Camera Orbit

A complete 22.5-second ice sequence: logo, first text, second text, breakup, and fade. The camera orbits the fixed objects with slower front-facing passes for reading. The same particle field carries each transition. Customize the two text moments and SVG logo; the source includes editable camera and assembly timing.

Composition id: `frost-sequence-rig`. Duration 22.5 s at 30 fps, 1920×1080.

## Files

- `frost-sequence-camera-orbit.html` (131 KB)
- `assets/example-logo.svg` (1 KB)
- `assets/fonts/Geist-Bold.ttf` (65 KB)
- `assets/fonts/Geist-OFL.txt` (4 KB)
- `assets/fonts/Geist-Regular.ttf` (65 KB)
- `assets/fonts/Geist-SemiBold.ttf` (65 KB)
- `assets/frost.js` (1.5 MB)
- `assets/Three-LICENSE.txt` (1 KB)
- `assets/ThreeMeshBVH-LICENSE.txt` (1 KB)
- `assets/OpentypeJS-LICENSE.txt` (1 KB)
- `assets/Clipper-LICENSE.txt` (3 KB)
- `assets/gsap-3.14.2.min.js` (128 KB)
- `assets/GSAP-NOTICE.txt` (1 KB)
- `assets/logo.svg` (1 KB)
- `assets/shards-atlas.png` (fetched from the CDN at install)
- `assets/test-mark.svg` (1 KB)
- `assets/textures/bluenoise64.png` (12 KB)
- `assets/textures/ice-inclusions-generated.png` (fetched from the CDN at install)

## Install

Install with `npx hyperframes add frost-sequence-camera-orbit`; by default the files above land under `compositions/frost-sequence-camera-orbit/`. Then mount the block from the host `index.html`:

```html
<div
  data-composition-id="frost-sequence-rig"
  data-composition-src="compositions/frost-sequence-camera-orbit/frost-sequence-camera-orbit.html"
  data-start="0"
  data-duration="22.5"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
></div>
```

Render with custom values by targeting the composition file directly:

```sh
npx --yes hyperframes@0.8.12 render 'compositions/frost-sequence-camera-orbit/frost-sequence-camera-orbit.html' --variables '{"headline1":"Hard to|break.","headline2":"Easy to|remember."}'
```

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Variables](references/variables.md) (~8923 tokens)
- [Runtime contract; Editing rules (from the source project)](references/runtime-contract.md) (~164 tokens)
