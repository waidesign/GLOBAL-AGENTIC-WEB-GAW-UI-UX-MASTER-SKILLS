---
id: "unseen-studio"
name: "Unseen Studio"
theme: "dark"
category: "creative-studio"
tags: ["unseen-studio","dark","creative-studio","agency"]
vibe: "plaster arcade, drowned at dusk. Stage thin serif and grotesk type over a live blush-pink 3D room, then let white pills and one side panel do all the navigating."
liveUrl: "https://unseen.co/"
previewUrl: "https://ui.gradientdeck.com/styles/unseen-studio"
lastVerified: "2026-11-08"
---

# Unseen Studio — Style Reference
> plaster arcade, drowned at dusk. Stage thin serif and grotesk type over a live blush-pink 3D room, then let white pills and one side panel do all the navigating.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Unseen Studio is a brand, digital and motion agency whose site is a single-screen WebGL world rather than a scrolling page. A blush #efded9 gate with cartoon eyes opens onto a grainy plaster room standing in mauve water; a fogged white arcade holds the bending project planes, and a curtained pink room says hello. Interface chrome stays tiny and flat: Studio Ink #212121 text, white 9999px pills and 43px discs. Type is a two-voice duet, thin Saol Display italics against tight Neue Montreal, tracked -1.6px at 96-100px. A black blob then swallows the room into a #0a0a0a World of draggable images on a wireframe globe.

## Colors

| Name | Value | Role |
|------|-------|------|
| Studio Ink | `#212121` | Logo, nav text, active filter fill and hover pills — a soft off-black that sits on plaster without punching holes in it |
| Paper | `#ffffff` | Fill pills, circular menu, sound and world discs, and text over dark or photographic scenes |
| Plaster Rose | `#e6c8c4` | Sunlit plaster sampled from the WebGL hero wall — the colour the whole site is remembered by |
| Blush Gate | `#efded9` | The full-screen Enter gate behind the eyes mark — the flat CSS version of the 3D room outside it |
| Menu Bone | `#f1edeb` | The 656px side-panel menu that slides over the live scene, solid and flat against the grain |
| Lavender Hill | `#d4acc6` | Hillside seen through the arches in the WebGL hero — the cool counterweight to the rose walls |
| Window Sky | `#d0dafb` | Pale sky in the hero window and its reflections in the water — the only blue in the room |
| Water Mauve | `#927c87` | Rippled water filling the bottom of the hero and contact scenes, grounding the pale architecture |
| Arcade Mist | `#d2d6d7` | Fogged white arches and pale haze of the WebGL project gallery, sampled from the rendered scene |
| Graphite Copy | `#424242` | Gate title and tagline, plus the contact introduction — a step softer than Studio Ink |
| World Black | `#0a0a0a` | Grain-textured canvas of the drag-to-explore World view and the scrolling project case pages |
| Oyster Text | `#faf6f4` | Label on the active filter pill — a warmed white that avoids a stark chip on Studio Ink |
| Hairline Fog | `#e7e7e7` | One-pixel outlines on idle filter pills, barely visible over the white arcade |
| Index Dim | `#d6d6d6` | The current page in the side menu, greyed back with its numeral so the other items lead |

## Typography

### Saol Display — The voice of the site: thin high-contrast serif set large and tight. Menu items run 100px/100px at -1.6px, case titles 96px uppercase italic, nav hovers swap into 20.8px italic. Weight reads 400 in CSS but the served files are the Light and Light Italic cuts, so 400 here means Light.
- **Substitute:** Georgia, Cambria, Times New Roman
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 20.8px, 96px, 100px
- **Line height:** 0.90, 1.00
- **Letter spacing:** -1.6px at 96px and 100px; 0 at 20.8px

### Neue Montreal — The working grotesk and the second half of every headline. 64px/76.8px at -1.28px for Selected Projects, 96px uppercase in case titles, 19.2px nav, 32px/41.6px weight 300 for case overviews, 12.8px filter pills. The site serves only the Regular file, so other weights are browser-derived from it.
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 300, 400, 500, 600
- **Sizes:** 10px, 11.2px, 12.8px, 16px, 16.8px, 18px, 19.2px, 20.8px, 32px, 36px, 64px, 96px, 100px
- **Line height:** 0.86, 1.00, 1.10, 1.15, 1.20, 1.30, 1.50
- **Letter spacing:** -1.6px at 96-100px; -1.28px at 64px; -0.8px at 36px; -0.4px at 16-18px; -0.36px at 10-12.8px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | Neue Montreal | 400 | 11.2px | 1.5 | 0px |
| label | Neue Montreal | 500 | 12.8px | 1.5 | 0px |
| filter | Neue Montreal | 400 | 12.8px | 1 | -0.36px |
| body | Neue Montreal | 400 | 16px | 1.15 | -0.4px |
| button | Neue Montreal | 400 | 16.8px | 0.86 | 0px |
| nav | Neue Montreal | 400 | 19.2px | 1.1 | 0px |
| nav-hover | Saol Display | 400 | 20.8px | 0.9 | 0px |
| lead | Neue Montreal | 300 | 32px | 1.3 | 0px |
| heading | Neue Montreal | 400 | 64px | 1.2 | -1.28px |
| display | Neue Montreal | 400 | 96px | 1 | -1.6px |
| display-serif | Saol Display | 400 | 100px | 1 | -1.6px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1280px
- **Section gap:** 160px
- **Card padding:** 32px
- **Element gap:** 12px

### Border Radius

- **buttons:** 9999px
- **tags:** 200px
- **cards:** 0px
- **images:** 0px
- **cursor:** 19.2px

## Components

### Enter Gate Panel
**Role:** Full-screen entrance before the experience

Fill the viewport with flat Blush Gate #efded9. Centre the eyes mark, then an 18px/27px uppercase Neue Montreal title at -0.4px, a three-line 16px/18.4px Graphite Copy #424242 tagline, and one Enter pill. Add an 11.2px/500 uppercase underlined Enter without audio link near the bottom.

### Paper Pill Button
**Role:** Primary action on scenes

A 41px-high Paper #ffffff pill with 9999px radius, 16.8px/14.4px Neue Montreal 400 Studio Ink #212121 text and a small diagonal arrow. On hover the fill floods to Studio Ink #212121 from a 26.4px-radius inner layer and the label turns white. No border, no shadow.

### Outline Pill Button
**Role:** Secondary link over scenes

A 41px-high transparent pill with a 1px Paper #ffffff border and 9999px radius, 16.8px Neue Montreal Paper label, 189px wide for Our 2025 Wrapped. It sits bottom left beside the sound disc and shows the scene straight through. No shadow.

### Corner Disc Control
**Role:** Menu, sound and world toggles

A 43.2px Paper #ffffff disc centred in a 59.2px hit area, 100% radius, holding a tiny Studio Ink #212121 glyph: two dots for menu, equaliser bars for sound, a globe for world. The menu dots become a white cross on a Studio Ink disc when the panel is open.

### Swap Type Nav Link
**Role:** Top-right site navigation

Three text links with 2.4px 12px padding in 19.2px/21.12px Neue Montreal 400 Studio Ink #212121, on dark case pages Paper #ffffff. On hover and for the active page the letters swap, staggered, into 20.8px/18.72px Saol Display italic. No underline or background.

### Menu Bone Side Panel
**Role:** Full navigation overlay

A 656px-wide, full-height Menu Bone #f1edeb panel sliding in from the right with 132.8px 0 132.8px 100px padding. Items are 100px/100px Saol Display at -1.6px with 20.8px superscript numerals; the current item dims to Index Dim #d6d6d6 with a thick underline. No shadow.

### Project Filter Pill
**Role:** Gallery category filter

A 25.2px-high pill with 200px radius and 5.2px 14px padding in 12.8px/12.8px Neue Montreal at -0.36px with a 10px count. Idle: transparent with a 1px Hairline Fog #e7e7e7 border and Studio Ink text. Active: Studio Ink #212121 fill and Oyster Text #faf6f4 label.

### Curved Project Card
**Role:** WebGL gallery item

Square-cornered 0px image planes in a two-column grid over Arcade Mist #d2d6d7, bending through the shader as they scroll. Each carries a title and caption in 12.8px Neue Montreal beneath it, with a hairline rule and a small diagonal arrow at right. No shadow or card fill.

### Gallery Title Block
**Role:** Fixed header of the project view

Centre Selected Projects in 64px/76.8px Neue Montreal 400 at -1.28px in Studio Ink #212121, pinned at the top of the viewport with the filter row 16px below while the grid moves underneath. No backing fill, so the fog and passing cards show behind it.

### Dark Contact Pill
**Role:** End-of-gallery call to action

A 41px Studio Ink #212121 pill with 9999px radius and white 16.8px projects@unseen.co label plus diagonal arrow, 213px wide, below a 12.8px/19.2px weight-600 prompt. It sits at the foot of the gallery and floats in front of the last cards. No shadow.

### Say Hello Block
**Role:** Contact view content

Over the Plaster Rose room, a 96px/86.4px Saol Display italic heading at -1.6px sits beside two 39.8px toggle pills, Paper when selected and 1px Studio Ink #212121 outlined when not. Below: 14.4px/18.72px uppercase lines and a 32px/35.2px weight-300 email link. General reveals the offices.

### Case Study Header
**Role:** Top of a project page

On grain World Black #0a0a0a, stack alternating 96px/96px lines at -1.6px of uppercase Saol Display italic and Neue Montreal in Paper #ffffff, around a WebGL form. Below, 12.8px/19.2px weight-500 uppercase labels, a 32px/41.6px weight-300 overview, and 19.2px credits.

### World Globe Stage
**Role:** Draggable image sphere

On World Black #0a0a0a, a wireframe globe sits behind a chromatic-glitch UNSEEN WORLD title with a 16px/24px Paper drag prompt. Dragging releases the title and images on the sphere rotate past. Opening one dims and scanlines the rest, adding a 72px/72px outlined uppercase title at -3.2px tracking.

### Ring Cursor
**Role:** Custom pointer

A 35.2px ring with a 1px Studio Ink #212121 border and 19.2px radius, trailing the pointer with a soft lag and stretching along its direction of travel. Transparent inside so the scene shows through, and it turns white over dark case pages. Sits above everything.

## Do's and Don'ts

### Do
- Use a live or richly rendered scene as the page itself, with Plaster Rose #e6c8c4 walls, Lavender Hill #d4acc6 distance and Water Mauve #927c87 below.
- Pair the two voices inside one headline: Saol Display italic on one line, Neue Montreal on the next, both at -1.6px tracking from 96px up.
- Set primary actions as 41px-high Paper #ffffff pills with 9999px radius, 16.8px Studio Ink #212121 labels and a small diagonal arrow.
- Keep persistent controls as 43.2px Paper discs in the corners inside a 59.2px hit area: menu, sound and world.
- Hold the gate in flat Blush Gate #efded9, with the eyes mark, an 18px uppercase title, a 16px/18.4px tagline and a single Enter pill.
- Reserve Saol Display at 100px/100px for the Menu Bone #f1edeb side panel, with 20.8px numerals set as superscripts.
- Apply filters as 25.2px pills with 200px radius, 5.2px 14px padding and 12.8px text, filling Studio Ink #212121 only when active.

### Don't
- Do not build this as a stacked scrolling landing page; the home, gallery and contact views are full-screen scene changes with no document scroll.
- Do not add CSS drop shadows to pills, discs or cards; no box-shadow appears anywhere and depth comes from the rendered scene.
- Do not substitute a heavy serif for Saol Display; its Light and Light Italic cuts are what make 100px type feel weightless.
- Do not round the project cards; they are square-cornered planes that take their shape from the bend of the WebGL shader.
- Do not use saturated brand colour on chrome; the interface stays Studio Ink #212121 and Paper #ffffff, and colour belongs to the scene and the work.
- Do not enlarge the navigation; 19.2px links and 12.8px filters stay small so the 96-100px display type and the scene carry the page.
- Do not make dark the default; World Black #0a0a0a is reserved for the World view and case pages, and the entry path stays pale and rosy.

## Elevation

No CSS shadow was measured in any of the 16 states. Depth is literally three-dimensional: the WebGL scene supplies real light, water reflections and fog, while the DOM chrome floats flat on top as white discs, pills and one solid Menu Bone panel. Cards gain presence by bending in the shader as they move, not by casting anything.

## Surfaces

- **Blush Gate** (`#efded9`) — Full-screen entrance gate before the scene loads
- **Plaster Rose** (`#e6c8c4`) — WebGL hero and contact room, the default environment
- **Arcade Mist** (`#d2d6d7`) — Fogged WebGL arcade behind the project gallery
- **World Black** (`#0a0a0a`) — Grain canvas of the World view and case pages
- **Menu Bone** (`#f1edeb`) — Slide-in side menu panel above the live scene
- **Paper** (`#ffffff`) — Pills and circular control discs floating on scenes

## Imagery

The imagery is real-time 3D rather than photography: a grain-filtered plaster room with arches, stairs, boulders, an iridescent pearl sphere and rippling water, a white fogged arcade with drifting petals, and a pink curtained room with a shell chair on a plinth. Everything sits in soft sunset light with chromatic fringing at the edges. Project work appears as bending, square-cornered planes showing saturated CGI and device mockups, a colour shock against the pale gallery. The World view pins illustrations and polaroids to a wireframe globe. The brand mark is a pair of black-outlined cartoon eyes whose pupils turn to hearts on hover. Icons are small, linear glyphs: a diagonal arrow, a globe and an equaliser.

## Layout

Every primary view is one 1600x1000 stage with a document no taller than the viewport; a WebGL canvas fills it and the DOM floats above as fixed corner chrome. The wordmark sits at top left, three 19.2px links and the menu disc at top right, the sound disc and an outline pill at bottom left, the world disc at bottom centre and a copyright at bottom right. Content is centred: the hero headline stack and pill, the gate column, and the Selected Projects title with its 64px heading and filter row pinned at the top while a two-column project grid wheels underneath. The menu is a 656px right panel with 132.8px vertical and 100px left padding. The World view repeats the fixed chrome over a free-dragging image globe. Case pages alone scroll, about 12,000px in a 1280px column with 160px gaps.

## Similar Brands

- **Active Theory** — Same conviction that an agency home page should be a real-time WebGL environment entered rather than scrolled.
- **Lusion** — Uses a shader-driven 3D scene as the page itself, with minimal DOM chrome floating above it.
- **Resn** — Shares the playful, experience-first agency site where interaction and transitions carry the identity.
