---
id: "rauno-freiberg"
name: "Rauno Freiberg"
theme: "light"
category: "saas"
tags: ["rauno-freiberg","light","saas","web-app"]
vibe: "sticky-note manifesto, cropped poster type. Lay out a horizontal reel of white 5:3 panels on fog gray, each holding one oversized word, one flat disc or one hand-drawn mark."
liveUrl: "https://rauno.me/"
previewUrl: "https://ui.gradientdeck.com/styles/rauno-freiberg"
lastVerified: "2026-11-08"
---

# Rauno Freiberg — Style Reference
> sticky-note manifesto, cropped poster type. Lay out a horizontal reel of white 5:3 panels on fog gray, each holding one oversized word, one flat disc or one hand-drawn mark.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Rauno Freiberg is a horizontally scrolling personal reel: a Fog Canvas #ededed field carrying a single row of square-cornered Paper #ffffff panels, steered by a tiny gray minimap at the top and a thin crosshair cursor. Each panel is a poster with one idea: an 85px bio set over a Signal Yellow #ffff02 disc, 720px words like "DD", "Craft" and "Projects" cropped by the panel edges, a Devour Orange #ff5800 circle, a Cursor Blue #0000ff pixel hand, red handwritten field notes, and a closing yellow "Make it fast." manifesto. Everything is PP Neue Montreal at a single weight with zero tracking, so scale and cropping do all the work. There are no shadows, no rounded panels and no chrome beyond 14px gray captions.

## Colors

| Name | Value | Role |
|------|-------|------|
| Fog Canvas | `#ededed` | The page field and theme colour around the panel row — a flat studio-wall gray that frames every white panel |
| Paper | `#ffffff` | Fill of every content panel; square-cornered, unbordered and shadowless against Fog Canvas |
| Signal Yellow | `#ffff02` | The intro disc behind the bio and the full-bleed manifesto panel — the site's one loud colour, used as a flat shape, never as text |
| Graphite Ink | `#171717` | The 85px bio statement and the Twitter, Email and GitHub link panel — a softened black for reading-size text |
| Ink | `#000000` | The 720px cropped panel words and the 75px manifesto lines — pure black for poster-scale type |
| Label Gray | `#6f6f6f` | The 14px captions that sit above each panel ("Devouring Details", "Craft", "Projects") |
| Minimap Gray | `#8f8f8f` | Minimap tick lines and the 1px outline of the minimap tracker rectangle at the top of the viewport |
| Devour Orange | `#ff5800` | The flat 9999px disc that replaces a letter in the Devouring Details panel — a single hot punctuation mark |
| Cursor Blue | `#0000ff` | Fill of the pixel-art pointing-hand cursor in the History of Software Design panel — pure RGB blue as a retro screen cue |
| Field Note Red | `#ff484c` | Hand-drawn SVG lettering of "Rauno's Field Notes" — a marker-pen red that marks the notebook panel as personal |

## Typography

### PP Neue Montreal — The only face on the page, served as PPNeueMontreal-Medium (dd.woff2) under the alias "X" for both the 400 and 500 slots, so every computed 400 renders as Medium. It carries the 85px bio, the 75px manifesto, 720px cropped panel words and 14px captions, all with 0px tracking and normal line-height: a neutral grotesk whose voice comes entirely from scale.
- **Substitute:** Inter Tight
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 14px, 75px, 85px, 720px
- **Line height:** 1.20
- **Letter spacing:** 0px at every size (14px, 75px, 85px and 720px)

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | PP Neue Montreal | 400 | 14px | 1.2 | 0px |
| manifesto | PP Neue Montreal | 400 | 75px | 1.2 | 0px |
| display | PP Neue Montreal | 400 | 85px | 1.2 | 0px |
| poster-word | PP Neue Montreal | 400 | 720px | 1.2 | 0px |

## Spacing & Layout

**Base unit:** 8px

**Density:** spacious

- **Section gap:** 64px
- **Card padding:** 64px
- **Element gap:** 8px

### Border Radius

- **panels:** 0px
- **discs:** 9999px

## Components

### Minimap Scroll Strip
**Role:** Scroll position indicator

Centre a row of about 15 thin Minimap Gray #8f8f8f vertical tick lines at the top of the viewport, 9px apart, with a small hollow tracker rectangle outlined in 1px solid #8f8f8f that slides along them; transition background, border-color and opacity over 0.2s ease-in-out. No fill, no label.

### Crosshair Cursor
**Role:** Custom pointer

Replace the system cursor with a thin plus-shaped crosshair of two 1px lines, roughly 20px across, held at the viewport centre while the panel row moves underneath it. Lines are stroked #ffffff in the markup but read dark on the Fog Canvas and Paper; no circle, no label.

### Panel Caption Label
**Role:** Panel title above each card

PP Neue Montreal 14px/400 at normal line-height and 0px tracking in Label Gray #6f6f6f, left-aligned just above the top-left corner of each panel ("Devouring Details", "Craft", "Projects"). No uppercase, no rule, no icon.

### Intro Bio Panel
**Role:** Opening statement

A Paper #ffffff panel with 0px radius and no shadow, 64px text inset, holding a six-line Graphite Ink #171717 statement at 85px/400 with 0px tracking; every second line is indented. A Signal Yellow #ffff02 9999px disc fills the right half and sits behind the text, which runs over it.

### Cropped Wordmark Panel
**Role:** Section poster for a project

A 5:3 Paper panel with 0px radius filled by a single Ink #000000 word at 720px/400 and 0px tracking, cropped by the panel edges so only part of "DD", "Craft" or "Projects" shows. Optionally replace one letter with a flat Devour Orange #ff5800 9999px disc. No caption inside the panel.

### Pixel Cursor Panel
**Role:** History of Software Design teaser

A 5:3 Paper panel with 0px radius showing one pixel-art pointing-hand cursor in Cursor Blue #0000ff, outlined in square pixel steps and centred-left on a lot of white. No text, border or shadow inside the panel.

### Field Notes Panel
**Role:** Notebook link

A 5:3 Paper panel with 0px radius and the words "Rauno's Field Notes" hand-lettered as an SVG path filled Field Note Red #ff484c, centred with wide letter spacing. No typeset text, border or shadow.

### Link Grid Panel
**Role:** Contact and social links

A 5:3 Paper panel with Graphite Ink #171717 links at 85px/400 and 0px tracking placed at the corners and centre: Twitter top-left, a year top-right, Email centre, a year bottom-left, GitHub bottom-right. Email is a transparent, borderless, unpadded button that swaps to "Copied" on click.

### Yellow Manifesto Panel
**Role:** Closing principles

A 5:3 Signal Yellow #ffff02 panel with 0px radius and no shadow listing seven Ink #000000 lines at 75px/400, 0px tracking and normal line-height: "Make it fast.", "Make it beautiful." through "Make it." Left-aligned, top-left inset, no bullets.

## Do's and Don'ts

### Do
- Use Fog Canvas #ededed as the page field and place every piece of content on square-cornered Paper #ffffff panels.
- Set all text in PP Neue Montreal at weight 400 (rendered by the Medium cut) with 0px tracking; let size alone create hierarchy.
- Set the intro bio at 85px/400 in Graphite Ink #171717, indenting every second line so the statement staggers down the panel.
- Apply Signal Yellow #ffff02 only as large flat shapes: the 9999px disc behind the bio and the full manifesto panel fill.
- Use 720px/400 Ink #000000 words cropped by the panel edges, so each panel shows only a fragment of "DD", "Craft" or "Projects".
- Keep panel captions at 14px/400 in Label Gray #6f6f6f, sitting just above the top-left corner of each panel.
- Reserve Devour Orange #ff5800, Cursor Blue #0000ff and Field Note Red #ff484c for one mark each, never repeated across panels.

### Don't
- Do not round the panels or add borders; panels are 0px radius and only the colour discs use 9999px.
- Do not add drop shadows or hover elevation to panels; the measured page has no box-shadow at all.
- Do not introduce bold 600-700 weights or negative tracking; every role is PP Neue Montreal 400 at 0px letter-spacing.
- Do not stack sections vertically; the panels run in one horizontal row that vertical scrolling slides sideways.
- Do not set body copy in Signal Yellow #ffff02 or put yellow text on white; yellow is a fill behind Ink or Graphite Ink type.
- Do not add navigation bars, buttons with fills or footers; the only chrome is the Minimap Gray #8f8f8f minimap and panel captions.
- Do not centre the bio text; it is left-aligned at a 64px inset with alternate lines indented.

## Elevation

The page is completely flat. Separation comes from one tonal step: square-cornered Paper #ffffff panels on the Fog Canvas #ededed field, with no borders, no shadows and no hover lift. The only outline anywhere is the 1px Minimap Gray #8f8f8f rectangle that tracks scroll position. Colour discs sit in the same plane as the type and are allowed to overlap it rather than float above it.

## Surfaces

- **Fog Canvas** (`#ededed`) — Page field around the horizontal panel row and the minimap.
- **Paper** (`#ffffff`) — Every content panel: bio, wordmarks, cursor, notes and links.
- **Signal Yellow** (`#ffff02`) — The manifesto panel fill and the disc behind the intro bio.

## Imagery

There is no photography. Imagery is flat graphic shorthand built from type and primitive shapes: solid 9999px discs in Signal Yellow #ffff02 and Devour Orange #ff5800 that overlap or replace letters, a pixel-art pointing hand drawn in Cursor Blue #0000ff on white, and the words "Rauno's Field Notes" hand-lettered as a red #ff484c SVG. The giant 720px words are the main visuals, cropped hard by the panel edges so only a recognisable fragment shows. Everything is flat fill on white: no gradients, textures, outlines or shadows. Icons are absent apart from the pixel cursor; the minimap ticks and crosshair cursor act as the only UI graphics.

## Layout

The site is a single horizontal reel rather than a vertical page. A Fog Canvas #ededed field holds one row of Paper panels at a 5:3 ratio, vertically centred in the viewport; vertical scroll (6208px of page height) slides the row sideways. The first panel opens enlarged (about 1176x706px at a 1600px viewport, with a 64px text inset) and the rest settle to 720x432px, separated by narrow gutters and each topped by a 14px Label Gray caption. Panel order: bio with a yellow disc, Devouring Details, Craft, History of Software Design, Projects, Field Notes, a link panel with Twitter, Email, GitHub and years at its corners and centre, and the yellow manifesto. A minimap of thin gray ticks with a tracker rectangle sits centred at the top, and a thin crosshair replaces the cursor at the viewport centre. There is no header, footer or max-width container.

## Similar Brands

- **Devouring Details** — Shares the same PP Neue Montreal face, flat yellow and orange discs, and Rauno's poster-style cropped typography.
- **Emil Kowalski** — Same design-engineer portfolio register: a quiet neutral canvas, one grotesk and interaction experiments as the content.
- **Paco Coursey** — Uses a minimal monochrome personal site built around a single sans and almost no chrome.
