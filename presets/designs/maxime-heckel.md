---
id: "maxime-heckel"
name: "Maxime Heckel"
theme: "dark"
category: "fintech"
tags: ["maxime-heckel","dark","fintech","banking"]
vibe: "blueprint table under a night lamp. Open on an electric-blue WebGL grid, then let looping shader demos glow inside quiet hairline cards on a near-black canvas."
liveUrl: "https://maximeheckel.com/"
previewUrl: "https://ui.gradientdeck.com/styles/maxime-heckel"
lastVerified: "2026-11-08"
---

# Maxime Heckel — Style Reference
> blueprint table under a night lamp. Open on an electric-blue WebGL grid, then let looping shader demos glow inside quiet hairline cards on a near-black canvas.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Maxime Heckel's portfolio opens as a full-viewport Blueprint Blue #0046b0 WebGL scene, a glass logo floating over a perspective grid with tiny monospaced HUD readouts, before the page cools into a near-black Void Black #060709 canvas. From there the work is the colour: looping shader and raymarching videos fill 12px-radius Card Black #0c0f14 tiles with 1px Hairline Ink #1d212a borders, while text stays in a cool blue-grey ramp from Frost Text #e0ebfd to Steel Mist #8795ad. Inter carries everything at medium weights (500, 510, 560) with slightly negative tracking, and iA Writer Quattro V supplies the dates, labels and coordinate numerals that make the page read like an engineer's lab notebook. A floating glass navigation capsule and a single bevelled Signal Blue #4a80e8 button are the only chrome.

## Colors

| Name | Value | Role |
|------|-------|------|
| Void Black | `#060709` | Page canvas below the hero, intro and contact sections, footer field — a blue-black that lets shader footage glow |
| Card Black | `#0c0f14` | Work and contribution card backgrounds behind autoplaying demo videos and screenshots |
| Frost Text | `#e0ebfd` | Headings, navigation labels, card titles, emphasised keywords and line icons — a blue-tinted white, never pure |
| Haze Text | `#abb5c7` | Long-form body paragraphs in the intro and section blurbs, a step below the headline white |
| Steel Mist | `#8795ad` | Muted links, card dates, footer link list and secondary metadata values |
| Hairline Ink | `#1d212a` | The 1px border on every card, input and the footer grid lines — structure without visible weight |
| Blueprint Blue | `#0046b0` | The full-viewport WebGL hero field, page body colour and theme colour — a saturated drafting-table blue that frames everything as a technical drawing |
| Signal Blue | `#4a80e8` | The one filled button, the focused input border and inline Go-to links — a lighter, bevelled blue that reads as an interactive switch |
| Glass Slate | `#272e3b` | Translucent navigation capsule, section chip and circular icon-button fills, measured as rgba(103, 119, 149, 0.302) |
| Graphite Label | `#424c5f` | Inspiration tag chips at 70% opacity, faint coordinate numerals and dim inactive article titles |
| Pure White | `#ffffff` | Label text on the Signal Blue button and the hero grid strokes; used only where light must read as emitted |

## Typography

### Inter — The single voice for headings, body, navigation and buttons, loaded as Inter Variable with "cv05" and "cv11" alternates. It never goes bold: section headings sit at 24px/510 with -0.53px tracking, intro leads at 24px/500, body at 18px/500 with 28.8px line-height, nav at 14px/560 with +0.3px tracking. The in-between weights give a soft, screen-native firmness instead of marketing punch.
- **Substitute:** Inter
- **Licence:** open (Open licence (Google Fonts)); free to use and self-host
- **Weights:** 400, 500, 510, 560
- **Sizes:** 14px, 16px, 18px, 24px
- **Line height:** 1.15, 1.20, 1.40, 1.50, 1.60, 1.75
- **Letter spacing:** -1px to -0.53px at 24px; -0.25px at 18px; +0.3px at 14px nav and footer links
- **OpenType features:** `"cv05", "cv11"`

### iA Writer Quattro V — iA Writer's quattrospaced face, used for every machine-voice detail: card dates like 07.2025 at 12px/400 with -0.5px tracking, uppercase inspiration tags at 12px/500, footer metadata values, the 'Ask me anything' field at 14px/500 uppercase, and the 8px coordinate numerals on the inspiration board ruler. It is what makes the page feel like a lab notebook.
- **Substitute:** IBM Plex Mono
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500, 525
- **Sizes:** 8px, 12px, 14px, 16px
- **Line height:** 1.00, 1.29, 1.50, 1.75
- **Letter spacing:** +0.3px at 8px; -0.5px at 12px and 16px; -1.25px at 14px footer signature

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| coordinate | iA Writer Quattro V | 400 | 8px | 1 | 0.3px |
| date | iA Writer Quattro V | 400 | 12px | 1.75 | -0.5px |
| tag | iA Writer Quattro V | 500 | 12px | 1.75 | -0.25px |
| nav | Inter | 560 | 14px | 1.75 | 0.3px |
| caption | Inter | 400 | 14px | 1.75 | 0.3px |
| button | Inter | 500 | 14px | 1.6 | -0.25px |
| meta | iA Writer Quattro V | 525 | 16px | 1.5 | -0.5px |
| body | Inter | 500 | 18px | 1.6 | -0.25px |
| heading | Inter | 510 | 24px | 1.15 | -0.53px |
| lead | Inter | 500 | 24px | 1.5 | -0.25px |
| article-title | Inter | 560 | 24px | 1.4 | -1px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1100px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

### Border Radius

- **cards:** 12px
- **nav:** 12px
- **panels:** 16px
- **images:** 10px
- **buttons:** 8px
- **inputs:** 8px
- **badges:** 6px
- **pills:** 9999px

## Components

### Glass Navigation Capsule
**Role:** Fixed top-centred site navigation

A fixed capsule centred 24px from the top: Glass Slate rgba(103, 119, 149, 0.302) fill with backdrop blur, 1px rgba(168, 181, 201, 0.149) border, 12px radius. Monogram at left, a thin vertical divider, then Index, About, Work, Contact in Frost Text Inter 14px/560 with +0.3px tracking.

### Section Context Chip
**Role:** Current-chapter indicator under the nav

A small glass chip directly below the navigation capsule naming the chapter in view (Shaders, Study, Contributions): line icon plus Inter 14px/560 Frost Text, same Glass Slate fill and 1px translucent border, 8px radius. It swaps label as you scroll; no shadow.

### Blueprint WebGL Hero
**Role:** Full-viewport opening scene

A 100vh Blueprint Blue #0046b0 canvas rendering a perspective line grid, a glass 3D monogram and tiny HUD readouts in iA Writer Quattro V 8px/400 with +0.3px tracking. Pin an uppercase Inter 24px/510 two-line caption in Frost Text bottom-left at 1.15 line-height and -0.53px tracking.

### Intro Lead Block
**Role:** First-person introduction

A narrow centred column on Void Black: the opening paragraph in Inter 24px/500 Frost Text at 36px line-height and -0.25px tracking, then 18px/500 Haze Text #abb5c7 paragraphs at 28.8px line-height, a handwritten signature and the location in iA Writer Quattro V 16px/525.

### Chapter Intro Block
**Role:** Heading and blurb above each work grid

A ~450px column with an Inter 24px/510 Frost Text heading at 1.15 line-height and -0.53px tracking, then an Inter 18px/500 Haze Text paragraph at 28.8px line-height with technical keywords bolded in Frost Text. No eyebrow, no divider; 64px of air above the grid.

### Shader Demo Card
**Role:** Autoplaying work showcase tile

Card Black #0c0f14, 12px radius, 1px Hairline Ink #1d212a border and the 0.5px 1px 1px Card Lip; a looping video fills it edge to edge, 472px tall. Bottom-up linear-gradient(to top, rgba(0, 0, 0, 0.5), 50%, transparent) scrim; Inter 14px/560 title bottom-left, iA Writer Quattro V 12px/400 date bottom-right.

### Glass Arrow Pill
**Role:** Open-project icon button on cards

A small circular 9999px button in the top-right corner of every card: Glass Slate translucent fill, 1px rgba(168, 181, 201, 0.149) border, a thin Frost Text up-right arrow. Some cards add a matching info circle top-left. Opacity transitions at 0.3s ease.

### Signal Blue Bevel Button
**Role:** Primary call to action

Signal Blue #4a80e8 fill, Pure White Inter 14px/500 label at 22.4px line-height and -0.25px tracking, 34px tall with 0 12px padding, 8px radius, and the Bevel Button inset shadow: rgba(255, 255, 255, 0.3) 0 1px 1px inset plus rgba(0, 0, 0, 0.3) 0 -1.5px 2px inset.

### Article Title Wheel Panel
**Role:** Scrolling list of blog posts

A Void Black panel with 16px padding, 1px Hairline Ink border and 12px radius listing post titles centred in Inter 24px/560 at 33.6px line-height and -1px tracking. The middle titles read in Frost Text and fade through Steel Mist to Graphite Label toward the top and bottom edges like a drum picker.

### Gradient Ask Field
**Role:** Ask-me-anything prompt about the writing

A 16px-radius panel whose fill is a live peach-to-lilac-to-cyan shader gradient, with a borderless transparent textarea in iA Writer Quattro V 14px/500 uppercase at -0.5px tracking and 8px padding, plus small suggestion chips above it.

### Inspiration Board Canvas
**Role:** Draggable collage of references

A wide field with a dotted 1px grid and an iA Writer Quattro V 8px/400 coordinate ruler numbered 00–50 along the edges. Tilted image prints with 10px radius and the Pinned Board Card shadow 0 2px 4px 5px rgba(0, 0, 0, 0.1) overlap freely; Resize, Move, Rotate controls sit top-right in Inter 14px/500.

### Monospace Tag Chip
**Role:** Label pinned to inspiration prints

Graphite Label rgba(66, 76, 95, 0.702) fill, 6px radius, the 0 2px 4px 5px shadow, a 16px favicon at left, then an uppercase iA Writer Quattro V 12px/500 Frost Text label at -0.25px tracking and a thin up-right arrow.

### Hairline Input Field
**Role:** Text input in the design-system demo

A near-black field (a hair lighter than Void Black) with 1px Hairline Ink #1d212a border, 8px radius, 4px 12px 4px 40px padding leaving room for a leading line icon, Inter 14px/400 Frost Text at 26px line-height; the border turns Signal Blue #4a80e8 on focus.

### Metadata Grid Footer
**Role:** Site footer with build details and links

A Void Black field crossed by 1px grid lines. A centred panel lists Commit, Browser, Current Time, Dimensions as Inter 14px/560 Frost Text labels over iA Writer Quattro V values in Steel Mist, a dashed divider, then 14px/400 Steel Mist links at +0.3px tracking. Below, the monogram and © line.

## Do's and Don'ts

### Do
- Use Void Black #060709 as the page canvas after the hero and Card Black #0c0f14 for every media card.
- Set section headings in Inter 24px/510 at 1.15 line-height with -0.53px tracking, in Frost Text #e0ebfd.
- Keep body copy at Inter 18px/500, 28.8px line-height and -0.25px tracking in Haze Text #abb5c7, bolding key terms in Frost Text.
- Apply a 12px radius and a 1px Hairline Ink #1d212a border to all work cards; let the video fill the card edge to edge.
- Use iA Writer Quattro V 12px/400 with -0.5px tracking for dates and uppercase 12px/500 for tag labels.
- Reserve Signal Blue #4a80e8 for the single 8px-radius bevelled call-to-action and focused field borders.
- Pair each card title in Inter 14px/560 bottom-left with its date in Steel Mist #8795ad bottom-right, over a bottom-up 50% black scrim.

### Don't
- Do not use pure black or Pure White #ffffff for canvas and body text; keep the blue-tinted Void Black #060709 and Frost Text #e0ebfd.
- Do not set headings bold 700; the heaviest weight on the page is Inter 560.
- Do not add drop shadows with large blur to cards; use the 1px Hairline Ink border and the 0.5px 1px 1px Card Lip.
- Do not fill sections with Blueprint Blue #0046b0 below the hero; it belongs to the opening WebGL scene only.
- Do not replace demo videos with static thumbnails or illustrations; every work card shows a live rendering.
- Do not round cards into large 24px+ blobs or pills; cards stay at 12px and only icon buttons use 9999px.
- Do not set dates, metadata or tags in Inter; they belong to iA Writer Quattro V.

## Elevation

- **Card Lip:** `rgba(2, 2, 3, 0.333) 0.5px 1px 1px 0px`
- **Pinned Board Card:** `rgba(0, 0, 0, 0.1) 0px 2px 4px 5px`
- **Bevel Button:** `rgba(255, 255, 255, 0.3) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.3) 0px -1.5px 2px 0px inset`

## Surfaces

- **Blueprint Blue** (`#0046b0`) — Full-viewport WebGL hero field and body colour.
- **Void Black** (`#060709`) — Main page canvas, intro, contact and footer.
- **Card Black** (`#0c0f14`) — Work and contribution cards behind demo footage.
- **Glass Slate** (`#272e3b`) — Translucent nav capsule, section chip and icon buttons.

## Imagery

The imagery is the work itself: autoplaying, looping MP4 captures of WebGL and WebGPU experiments such as glass pills, fluted glass, volumetric clouds, caustics, dithering, pixelated statues and physics toys. Each sits edge to edge in a 12px-radius card with no padding, under a bottom-up black scrim for the title. Colour comes entirely from these renders, from sky blues and lilac clouds to Vermeer-like painted portraits and orange-red product shots. Contribution cards use flat UI screenshots of Docker and Tango over vivid macOS-style gradients. The inspiration board collages tilted 10px-radius prints with monospaced uppercase tag chips. Iconography is thin 1.5px line icons in Frost Text, and the logo is a looping double-stroke monogram rendered as a glass object in the hero.

## Layout

A single centred column on a full-bleed canvas. The hero is a 100vh Blueprint Blue WebGL scene with a fixed, top-centred glass navigation capsule and a two-line uppercase caption pinned bottom-left at the 280px content edge. The intro follows in a narrow ~660px column on Void Black. Work is organised into themed chapters (shader light effects, post-processing, raymarching, interaction patterns), each opening with a 24px heading and a short ~450px blurb, followed by a 1038px-wide card grid that mixes one full-width card, 683px + 329px pairs and triples of 329px cards separated by 16px gaps. Later come an article-title wheel beside a gradient ask-me field, a draggable inspiration collage on a coordinate grid, contribution cards and a short contact block. The footer is a gridded metadata panel. Density is spacious between chapters and compact inside the grids.

## Similar Brands

- **Bruno Simon** — Uses a full-screen interactive WebGL scene as the portfolio itself, with the 3D render carrying the identity.
- **Lusion** — Shares a dark canvas where real-time 3D and shader renders supply all the colour while the interface stays minimal.
- **Shadertoy** — Same grid of live shader renders on a dark background, each tile titled with small text below or over the footage.
- **Rauno Freiberg** — Shares the personal engineer-designer portfolio built from small interaction experiments framed in quiet dark cards.
