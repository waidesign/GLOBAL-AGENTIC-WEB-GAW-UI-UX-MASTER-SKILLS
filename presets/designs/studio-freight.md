---
id: "studio-freight"
name: "Studio Freight"
theme: "dark"
category: "creative-studio"
tags: ["studio-freight","dark","creative-studio","agency"]
vibe: "engraved crest over a contact sheet. Scatter hard-edged project stills across a bone-white grid and let one old-style serif line hold the empty centre."
liveUrl: "https://studiofreight.com/"
previewUrl: "https://ui.gradientdeck.com/styles/studio-freight"
lastVerified: "2026-11-08"
---

# Studio Freight — Style Reference
> engraved crest over a contact sheet. Scatter hard-edged project stills across a bone-white grid and let one old-style serif line hold the empty centre.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Studio Freight is a no-scroll opening: a seven-by-seven grid of hard-cornered project stills scattered across Bone Paper #fefdfc, with holes left in it and one JJannon line, "Moving Missions Forward", at 49.33px in the centre. All colour comes from the client work; the interface itself is Freight Black #000000 on bone, flipping to black on the Aeon, Contact and darker case-study routes. Type is a deliberate clash of a 17th-century-feeling serif against Publico Text Mono, used at 14px for every label and at 157.33px, tightly leaded and uppercase, for the typewriter headline on Work. Nothing has a radius or a shadow; hover, view toggles and difference-blended chrome do all the work.

## Colors

| Name | Value | Role |
|------|-------|------|
| Bone Paper | `#fefdfc` | Canvas on light routes and all text on dark ones — the site's --white token, faintly warm rather than pure white |
| Freight Black | `#000000` | Mark, headlines, body and list text on light routes, and the full canvas on Aeon, Contact and dark case studies |
| Aeon Graphite | `#1a1a1a` | Placeholder fill behind each archive tile on the black Aeon route, visible while experiments load in |
| Night Rule | `#191919` | Composited 10% bone hairline under each Contact field and FAQ row on the black route |
| List Ash | `#5b5b5b` | Dimmed List-view rows while another row is hovered, and quiet dates on the News page |
| Hairline Mist | `#e5e4e3` | Composited 10% black rule on Info and News, and the placeholder behind News images |

## Typography

### JJannon — The voice of the site: the 49.33px centred home title, Info statements at 1.16 line-height, and 20px body and form text at 1.32. Single weight 400, normal tracking at display size; its old-style details keep the page bookish against the raw mono labels and scattered imagery.
- **Substitute:** EB Garamond
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 16.67px, 20px, 26px, 32.07px, 49.33px
- **Line height:** 1.16, 1.24, 1.32
- **Letter spacing:** 0px at 49.33px; 0.18px at 20px; 0.16px at 16.67px

### Publico Text Mono — Every interface label at 14px with 15.68px line-height and 0.14px tracking, and, blown up, the uppercase typewriter headline at 157.33px, case titles at 235.33px and the Aeon letters at 144px, all at 0.80 line-height with about -2.88px tracking. A monospaced serif at that size reads as a stamp.
- **Substitute:** IBM Plex Mono
- **Licence:** commercial (the font file names it Publico Text Mono Web); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 14px, 64px, 144px, 157.33px, 235.33px
- **Line height:** 0.80, 1.12
- **Letter spacing:** 0.14px at 14px; -1.28px at 64px; -3px at 144px; -2.88px at 157.33px and 235.33px

### Publico Text Mono Semibold — The only emphasis in the system, shipped as its own family with CSS weight 400: the centred Studio Freight footer credit at 14px, and bold lead-ins inside serif statements such as STUDIO FREIGHT at 49.33px, uppercase with 1px tracking. On mobile it also sets the 26px emphasis at computed weight 600.
- **Substitute:** IBM Plex Mono
- **Licence:** commercial (the font file names it Publico Text Mono Web); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 14px, 49.33px
- **Line height:** 1.12, 1.16
- **Letter spacing:** 0.14px at 14px; 1px at 49.33px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| label | Publico Text Mono | 400 | 14px | 1.12 | 0.14px |
| credit | Publico Text Mono Semibold | 400 | 14px | 1.12 | 0.14px |
| fine-body | JJannon | 400 | 16.67px | 1.32 | 0.16px |
| body | JJannon | 400 | 20px | 1.32 | 0.18px |
| article-title | JJannon | 400 | 26px | 1.24 | 0px |
| statement | JJannon | 400 | 49.33px | 1.16 | 0px |
| statement-lead | Publico Text Mono Semibold | 400 | 49.33px | 1.16 | 1px |
| arrow-display | Publico Text Mono | 400 | 64px | 0.8 | -1.28px |
| aeon-letter | Publico Text Mono | 400 | 144px | 0.8 | -3px |
| headline | Publico Text Mono | 400 | 157.33px | 0.8 | -2.88px |
| case-title | Publico Text Mono | 400 | 235.33px | 0.8 | -2.88px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1576px
- **Section gap:** 144px
- **Card padding:** 12px
- **Element gap:** 12px

### Border Radius

- **images:** 0px
- **buttons:** 0px
- **inputs:** 0px
- **dot:** 9999px

## Components

### Difference Header Bar
**Role:** Fixed site chrome on every route

A transparent fixed bar with 12px padding: a 40px engraved griffin mark at left, then a 9999px dot and the current route, comma-separated routes at x 1070 and Contact at far right, all Bone Paper #fefdfc Publico Text Mono 14px/400 in mix-blend-mode difference, with no fill, border or shadow.

### Sparse Mosaic Tile
**Role:** Home page project thumbnail

A 214.84px by 121.14px image link with 0px radius and object-fit cover, placed on a 7 by 7 grid with 12px gaps. Many cells stay empty and placement reshuffles per load. It has no caption, border or shadow at rest; its aria-label carries the project name.

### Hover Project Cluster
**Role:** Home tile hover state

Hovering a Sparse Mosaic Tile fades out every other project and spreads the hovered project's stills over larger spans of the same 12px-gap grid. Tile transitions run at opacity 0.2s ease; there is no scale effect, overlay or shadow on the images.

### Retyping Centre Title
**Role:** Home page headline

An h1 in JJannon 49.33px/400 with 57.23px line-height, centred on the viewport in Bone Paper #fefdfc with mix-blend-mode difference so it shows black on bone. Letters type on one at a time, and it swaps to the hovered project name, then back to Moving Missions Forward.

### Typewriter Capability Headline
**Role:** Work and News page heading

Freight Black Publico Text Mono 157.33px/400 at 125.87px line-height and -2.88px tracking, uppercase, cycling STRATEGY, DESIGN, EXPERIENCE and METTLE character by character with a | caret. An engraved black-and-white illustration sits directly to its left, with a 12px page gutter.

### Grid List Zoom Toggle
**Role:** Work view switcher in the header

Three Publico Text Mono 14px/400 labels separated by typed slashes at x 541 in the header. The active view takes a plain text underline and nothing else: no fill, pill or 0px-radius chip. Selecting one rewrites the URL with ?view=list or ?view=zoom and re-lays the same projects.

### Project Grid Item
**Role:** Work page project card

A borderless link holding a 0px-radius image in a staggered 12px-gap grid, up to 782px wide in the first row. Below it sit the name in Publico Text Mono 14px/400 and the sector at opacity 0.64, 15.68px line-height, with no card fill, padding or shadow.

### Filter Plus Toggle
**Role:** Work category filter

A Publico Text Mono 14px/400 Filter label with a typed (+), Freight Black on bone. It opens eight numbered categories, 01 AI & Technology to 08 Other, in two 14px columns; a chosen one appears beside the toggle with its own (×), and the grid re-flows. It uses no dropdown chrome or 0px-radius box.

### Inverting List Row
**Role:** Work list view project row

A 24.5px row with 4px 0 padding, 12px gaps and four 385px columns for year, client, sector and services in Publico Text Mono 14px/400. On hover the row takes mix-blend-mode difference and reads as a full-width black band with bone text, and other rows dim toward List Ash #5b5b5b.

### Zoom Column Stage
**Role:** Work zoom view

A single centred column of 0px-radius images on Bone Paper #fefdfc, which grow as they approach the centre on scroll. Each current project has Publico Text Mono 14px/400 name and sector captions pinned out at the far left and right page edges, with the 12px gutter and no frame.

### Case Study Title Block
**Role:** Project page heading

Publico Text Mono 235.33px/400 at 188.27px line-height, -2.88px tracking and uppercase. Below it, a JJannon 20px/400 intro at 26.4px line-height with 0.18px tracking, then full-width 0px-radius media separated by 12px gaps. Dark clients flip the whole route to Freight Black #000000.

### Serif Statement Block
**Role:** Info page body statement

JJannon 49.33px/400 at 1.16 line-height spanning the 1576px width, with a lead-in in Publico Text Mono Semibold 49.33px, uppercase and 1px tracked, and footnote numerals as 32.07px superscripts. Numbered 20px paragraphs step diagonally beneath, 1px Hairline Mist #e5e4e3 rules dividing lower lists.

### Aeon Letter Spread
**Role:** Aeon archive masthead and tiles

Four letters, A E O N, in Bone Paper Publico Text Mono 144px/400 with 115.2px line-height and -3px tracking, spread edge to edge on Freight Black. Below sits a dense 12px-gap tile wall on Aeon Graphite #1a1a1a placeholders, captioned with raw filenames at 14px; a 1X / 2X / 00 toggle sits in the header.

### Underlined Serif Field
**Role:** Contact form input

A borderless JJannon 20px/400 field with 26.4px line-height and 12px 0 padding, 51px high on Freight Black, separated only by a 1px bottom rule at 10% bone, Night Rule #191919 when composited. The Submit control is the same 20px serif with no fill, 50px high and a 0px radius.

### Typed Glyph FAQ Row
**Role:** Contact accordion

JJannon 20px/400 question rows with a 1px Night Rule #191919 bottom rule and a typed (+) in Publico Text Mono 14px at right; opening one swaps it to (×), dims its siblings and reveals a JJannon 16.67px/400 answer at 22px line-height. It uses no icons, fill or 0px-radius panel.

### Pinned Credit Footer
**Role:** Fixed bottom strip

A transparent strip with 12px 0 padding, 40px high and pinned to the viewport: IG / LI at left and ©2026 / Terms at right in Publico Text Mono 14px/400, with a centred Studio Freight credit in the 14px semibold family. It has no rule, fill or shadow, and shrinks to SF on mobile.

## Do's and Don'ts

### Do
- Use Bone Paper #fefdfc as the light canvas and Freight Black #000000 as the only interface ink, with no accent colour in the chrome.
- Set every label, nav item and caption in Publico Text Mono 14px/400 at 15.68px line-height and 0.14px tracking.
- Set statements in JJannon 49.33px/400 at 1.16 line-height, and centre the home line alone over the grid.
- Keep images hard-cornered at 0px radius, on a 12px gap and a 12px page gutter.
- Apply mix-blend-mode difference to the fixed header, the mark and the home title, so #fefdfc reads correctly over any image.
- Build the home page as seven 214.84px columns by seven 121.14px rows, leaving cells empty and reshuffling on each load.
- Reserve Publico Text Mono at 157.33px/400, uppercase, 0.80 line-height and -2.88px tracking for the typed Work headline with its | caret.

### Don't
- Do not fill every cell of the home grid; the holes around the title are the composition.
- Do not add box-shadows, rounded corners or card chrome to project images; the site measures none.
- Do not introduce a brand accent colour; all chroma comes from client work.
- Do not swap JJannon for a modern grotesque in statements or form fields; the old-style serif is the personality.
- Do not set Publico Text Mono labels above 14px or in a heavier CSS weight; emphasis comes from the separate semibold family.
- Do not let the home page scroll; every project there is reached by hovering and clicking tiles.
- Do not put text over images except the difference-blended chrome and title; captions sit below at 14px.

## Elevation

There is no elevation anywhere: 13 measured routes and states report zero box-shadows, and the only radius is the 9999px route dot. Depth comes from stacking instead. The header, the logo and the home title sit above the imagery in mix-blend-mode difference, so #fefdfc text flips to black on the bone canvas and stays legible as it passes over photographs. Separation is gaps of 12px or a composited 10% hairline.

## Surfaces

- **Bone Paper** (`#fefdfc`) — Canvas for Home, Work, Info, News and light case studies.
- **Freight Black** (`#000000`) — Canvas for Aeon, Contact and dark case studies such as Brex.
- **Aeon Graphite** (`#1a1a1a`) — Placeholder under each Aeon archive tile on the black route.
- **Hairline Mist** (`#e5e4e3`) — Placeholder behind News imagery on the bone canvas.

## Imagery

Imagery is client work shown as found: billboards in the street, printed boxes, apparel on bodies, 3D renders, identity marks on black, photographed without any interface treatment. Stills and films are square-cornered and cropped to their grid cell, with no overlays, tints, captions over the image or hover zooms except the home page, where hovering one tile dissolves the rest and spreads that project across larger cells. The studio's own voice is black-and-white engraving: a heraldic griffin mark, a wireframe globe, a mechanical creature and a line-art illustration beside the headline. Aeon is an archive of experiments on black, captioned with raw filenames such as Elliot_1.png. There are no icons beyond typed glyphs such as (+), (×) and arrows.

## Layout

Every route shares a fixed frame: a 12px gutter, a 1576px live width, a 40px engraved mark at top left, the current route after a dot at x 396, the other routes as a comma list at x 1070, Contact at far right, and a footer strip pinned to the bottom edge. The home page does not scroll at all: seven 214.84px columns by seven 121.14px rows with 12px gaps, reshuffled on every load, with cells left empty and the title centred over them. Work scrolls: a 157.33px headline, a Filter toggle, then a staggered grid of mixed spans; the same data re-lays as a four-column 14px List index or a single-file Zoom column. Case studies are stacked full-width media with 12px gaps. Info is wide serif statements staggered diagonally down a 9184px page. Density flips between enormous voids and tight 14px rows.

## Similar Brands

- **Are.na** — Shares a bone-white grid of unstyled blocks captioned in tiny text, with content rather than chrome carrying the colour.
- **Savee** — Uses a dense wall of hard-cornered inspiration images with small quiet labels and almost no interface colour.
- **Pentagram** — Same discipline of plain white project grids, where client work supplies every bit of colour and the frame stays neutral.
- **Cosmos** — Shares a sparse image-first canvas with minimal chrome and tile-driven browsing instead of marketing sections.
