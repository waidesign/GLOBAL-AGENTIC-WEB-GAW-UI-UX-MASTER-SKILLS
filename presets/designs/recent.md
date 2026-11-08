---
id: "recent"
name: "Recent"
theme: "light"
category: "saas"
tags: ["recent","light","saas","web-app"]
vibe: "gallery wall behind a white mat. Let the work fill a tight four-column masonry of 8px tiles while every piece of chrome shrinks to 13px gray type and 28px pills."
liveUrl: "https://recent.design/"
previewUrl: "https://ui.gradientdeck.com/styles/recent"
lastVerified: "2026-11-08"
---

# Recent — Style Reference
> gallery wall behind a white mat. Let the work fill a tight four-column masonry of 8px tiles while every piece of chrome shrinks to 13px gray type and 28px pills.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Recent is a white-canvas design-inspiration feed where the curated work is the only loud thing on the page. A fixed 252px sidebar and a four-column masonry of 316px Tile Gray #f5f5f5 tiles with 8px corners and 12px gutters carry an endless stream of posters, interfaces and motion pieces, while the chrome stays tiny: Inter at 13px/400 in translucent-black grays, 28px-high pills, and one Press Black #0b0b0b chip marking the active filter. Colour enters only as punctuation, a Hot Magenta #f900a3 hand-scribbled 'new' marker and a holographic Staff Pick Violet #af6eff badge. Depth comes from hairline rings and inset glass badges rather than cast shadows.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, sidebar, raised Log in and sort pills, and text on dark or glass badges |
| Tile Gray | `#f5f5f5` | Feed tile backing behind every image and video, and the Design jobs panel — the mat that frames the work |
| Press Black | `#0b0b0b` | Logo mark, active filter chip, Sign up pill and primary text — a near-black that is the only solid fill the chrome ever uses |
| Muted Graphite | `#838383` | Inactive navigation, chip labels, company names, sponsor copy and member counts — rgba(0,0,0,0.486) text |
| Chip Mist | `#efefef` | Inactive category chips and the Post a job pill — rgba(0,0,0,0.063) black wash over Paper |
| Faint Ash | `#bbbbbb` | Sidebar group labels (Browse, Resources) and the copyright line — rgba(0,0,0,0.267) text |
| Hairline | `#e6e6e6` | 1px rgba(0,0,0,0.063) dividers such as the See all jobs rule and the sidebar separator |
| Glass Smoke | `#878787` | Translucent rgba(0,0,0,0.447) fill of the slide-count and open-arrow badges floating on media tiles |
| Hot Magenta | `#f900a3` | The 'new' label and its hand-drawn squiggle underline in the sidebar — a single shot of colour that reads like a marker note |
| Staff Pick Violet | `#af6eff` | Base fill of the 28px Staff Pick badge on feed tiles, under the holographic foil and a violet-tinted bevel |
| Holo Foil Gradient | `linear-gradient(115deg, #ff39bc 0%, #ffcf00 18%, #00ecb0 36%, #00c1ff 54%, #b460ff 72%, #ff46c5 86%, #ffcf00 100%)` | Iridescent foil on the Staff Pick badge, under a white radial highlight — the only gradient in the interface, sized to 28px |

## Typography

### Inter — The only face on the page, self-hosted as the Inter Variable file and held to 12–16px: 13px/400 at 1.4 line-height for navigation, chips and body, 13px/500 for job titles and the sidebar pitch, and a lone 16px/500 page title. The refusal to scale up is the point; type behaves like gallery wall labels beside the work.
- **Substitute:** ui-sans-serif, system-ui, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 16px
- **Line height:** 1.00, 1.40
- **Letter spacing:** -0.04px at 13px on buttons, links and job titles; 0 elsewhere

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| tag | Inter | 500 | 12px | 1 | 0px |
| marker | Inter | 400 | 12px | 1.4 | 0px |
| badge | Inter | 400 | 13px | 1 | 0px |
| body | Inter | 400 | 13px | 1.4 | 0px |
| control | Inter | 400 | 13px | 1.4 | -0.04px |
| emphasis | Inter | 500 | 13px | 1.4 | -0.04px |
| heading | Inter | 500 | 16px | 1.4 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** compact

- **Page max-width:** 1680px
- **Section gap:** 32px
- **Card padding:** 12px
- **Element gap:** 8px

### Border Radius

- **cards:** 8px
- **images:** 8px
- **logos:** 2px
- **buttons:** 9999px
- **pills:** 9999px
- **badges:** 9999px

## Components

### Sidebar Navigation Panel
**Role:** Fixed left-hand site navigation

A 252px Paper column with 16px side padding: logo at top-left, raised Log in pill at top-right, Faint Ash #bbbbbb group labels, then Inter 13px/400 links at 18.2px line-height in Muted Graphite #838383 with 2px 14px 2px 0 padding; the active link turns Press Black with a small black dot.

### Feed Title Bar
**Role:** Page heading and sponsor icons

A 28px-high transparent row: the title in Inter 16px/500 at 22.4px line-height in Press Black #0b0b0b, followed by a 13px/400 Muted Graphite tagline; a cluster of small square sponsor app icons sits at the right edge. No border, no background.

### Press Black Filter Chip
**Role:** Active category filter

Press Black #0b0b0b fill, Paper text in Inter 13px/400 at 18.2px line-height, 28px height, 0 12px padding, 9999px radius, no border and no shadow. Only one chip in the row is ever filled.

### Chip Mist Filter Chip
**Role:** Inactive category filter

Chip Mist #efefef fill (rgba(0,0,0,0.063)), Muted Graphite #838383 label in Inter 13px/400, 28px height, 0 12px padding, 9999px radius; chips sit 8px apart and background-color eases over 0.18s.

### Raised White Pill Button
**Role:** Log in and sort controls

Paper #ffffff fill, Press Black text in Inter 13px/400 with -0.04px tracking, 28px height, 0 12px padding (0 4px 0 12px with a trailing chevron), 9999px radius, and the Raised Pill Lift shadow: 0.5px ring, 1px drop, 1px 2px blur.

### Press Black Sign Up Button
**Role:** Membership conversion control

Press Black #0b0b0b fill with a 1px #0b0b0b border, Paper label in Inter 13px/400 at 18.2px line-height and -0.04px tracking, 28px height, 0 12px padding, 9999px radius, no shadow; paired at right with an overlapping 9999px avatar stack.

### Media Feed Card
**Role:** Curated work tile in the masonry

A 316px-wide Tile Gray #f5f5f5 tile with an 8px radius, zero padding and no shadow; the image or muted looping video fills it at native aspect ratio. Overlays sit 12px from the edges: contributor avatar bottom-left, Glass Media Badge bottom-right. Tiles stack with 12px gaps.

### Glass Media Badge
**Role:** Slide count and open-arrow control on media

A 28px circle filled Glass Smoke rgba(0,0,0,0.447) with Paper content: a 13px/400 numeral at 13px line-height or a diagonal arrow icon. 9999px radius and the Glass Badge Ring, a 1px inset white at 16% opacity.

### Staff Pick Holo Badge
**Role:** Editorial highlight marker

A 28px 9999px circle with a Staff Pick Violet #af6eff base, the Holo Foil Gradient at 115deg beneath a white radial highlight, a white star glyph, and the Holo Badge Bevel: inset white top light, inset violet underside, 1px 3px violet drop.

### Sponsor Tag Pill
**Role:** Marks paid placements in the feed

A compact pill over the top-left of a sponsored tile: rgba(10,10,10,0.4) fill, Paper label in Inter 12px/500 at 12px line-height, 9999px radius, no border. The sponsored tile otherwise matches the Media Feed Card.

### Design Jobs Panel
**Role:** Job listings at the top of the fourth column

A 316px Tile Gray #f5f5f5 panel with 8px radius and 16px side padding: a Muted Graphite 13px/400 header with a Chip Mist Post a job pill, rows of square logos with a 13px/400 Muted Graphite company over a 13px/500 Press Black role, and a See all jobs row with 8px 16px padding and a 1px Hairline top rule.

### Contributor Avatar
**Role:** Credit for the person who shared a tile

A 28px circular photo with 9999px radius and the Avatar Hairline shadow (1px black ring at 5% plus 1px 2px at 6%); placeholder avatars use an rgba(152,152,152,0.302) fill with a white 13px/500 question mark.

### New Marker Link
**Role:** Flags a freshly launched section

Append the word 'new' after a sidebar link in Hot Magenta #f900a3, Inter 12px/400 at 16.8px line-height, with a hand-drawn magenta squiggle beneath it in place of a text underline; no pill, no background.

### Sidebar Sign Up Block
**Role:** Newsletter and membership pitch

Below a 1px Hairline divider, a 13px/500 Press Black pitch at 18.2px line-height, the Press Black Sign Up Button with an overlapping avatar stack, and a 13px/400 Muted Graphite member count; a sponsor spot with a square logo, name and Sponsored label sits above.

### Sidebar Footer
**Role:** Copyright and secondary links

A single row at the bottom of the sidebar: © 2026 in Faint Ash #bbbbbb at left, Sponsor and Info links in Muted Graphite #838383 Inter 13px/400 at right, no border and no background.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the canvas and Tile Gray #f5f5f5 behind every feed image or video, with 8px corners and no shadow.
- Set all interface text in Inter 13px/400 at 18.2px line-height; step up only to 13px/500 for job titles and 16px/500 for the page title.
- Keep every control 28px high with 0 12px padding and a 9999px radius: chips, Log in, Sign up, sort and Post a job.
- Reserve Press Black #0b0b0b fill for the active filter chip and the Sign up pill; inactive chips use Chip Mist #efefef with Muted Graphite #838383 labels.
- Apply the Glass Badge Ring (1px inset white at 16%) to 28px Glass Smoke circles for slide counts and open arrows on media.
- Build the feed as four 316px masonry columns with 12px gutters beside a fixed 252px sidebar, inside a 1680px maximum width.
- Pair motion with the measured 0.18s and 0.12s durations on cubic-bezier(0.2, 0, 0, 1), animating opacity, transform and background-color.

### Don't
- Do not add display headlines or hero copy; the largest type on the page is the 16px/500 Design title.
- Do not drop shadows under feed tiles; tiles separate from Paper only by the Tile Gray #f5f5f5 fill and 12px gutters.
- Do not use bold 600-700 weights anywhere; Recent stops at Inter 500.
- Do not use Hot Magenta #f900a3 for buttons or links; it belongs only to the small 'new' marker and its squiggle.
- Do not spread the Holo Foil Gradient beyond the 28px Staff Pick badge.
- Do not use solid gray hex text when building on tinted surfaces; the grays are rgba(0,0,0,0.486) and rgba(0,0,0,0.267) washes.
- Do not square off controls; every button, chip, badge and avatar uses a 9999px radius.

## Elevation

- **Glass Badge Ring:** `oklch(1 0 0 / 0.16) 0px 0px 0px 1px inset`
- **Avatar Hairline:** `oklch(0 0 0 / 0.06) 0px 1px 2px 0px, oklch(0 0 0 / 0.05) 0px 0px 0px 1px`
- **Holo Badge Bevel:** `oklch(1 0 0 / 0.7) 0px 1px 1px 0px inset, oklch(0.25 0.12 300 / 0.22) 0px -1px 2px 0px inset, oklch(0.25 0.12 300 / 0.18) 0px 1px 3px 0px`
- **Raised Pill Lift:** `oklch(0 0 0 / 0.08) 0px 0px 0px 0.5px, oklch(0 0 0 / 0.2) 0px 1px 1px -1px, oklch(0 0 0 / 0.08) 0px 1px 2px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, sidebar and raised utility pills.
- **Tile Gray** (`#f5f5f5`) — Feed tiles and the Design jobs panel.
- **Chip Mist** (`#efefef`) — Inactive category chips and the Post a job pill.
- **Press Black** (`#0b0b0b`) — Active filter chip, Sign up pill and logo mark.

## Imagery

Imagery is the content: curated posters, brand identities, app screenshots, icon sets, 3D illustration and looping motion pieces, shown as posters or autoplaying muted MP4s at their native aspect ratio inside 8px Tile Gray tiles, so a tall phone capture sits beside a short wide banner. Nothing is recoloured or cropped to a grid; the tile is a neutral mat and each piece keeps its own palette, which makes the feed a patchwork of saturated blues, blacks and creams against the gray-and-white chrome. Overlays are small and consistent: a 28px circular contributor avatar at the bottom-left, a glass open-arrow badge at the bottom-right, a slide-count or Staff Pick badge at the top-right. Interface iconography is minimal monochrome line work; company logos in the jobs panel are square marks with 2px corners.

## Layout

The page is an app-like two-pane feed inside a 1680px maximum width. A fixed 252px sidebar on the left holds the black R logo and a raised Log in pill at the top, Browse and Resources link groups with faint Ash labels, and at the bottom a rotating sponsor spot, the 'A daily curation' sign-up block with an overlapping avatar stack and member count, and a © 2026 / Sponsor / Info footer. The main pane starts 16px further right: a 28px title row (Design 16px/500 plus a muted tagline, sponsor app icons at right), then a row of 28px category chips with an 8px gap and a white Recent sort pill at the far right. Below, four 316px masonry columns with 12px gutters run continuously; the fourth column is topped by the Design jobs panel, and sponsored tiles sit in the stream like any other item. There are no sections, bands or footer in the main pane; density is high and the rhythm comes entirely from varied tile heights.

## Similar Brands

- **Cosmos** — Shares a white-canvas masonry of curated images where the interface recedes to small gray type and pill controls.
- **Savee** — Uses an endless multi-column inspiration grid with images at native aspect ratio and minimal overlay chrome.
- **Pinterest** — Same masonry feed of rounded image tiles with small avatar and action overlays on each pin.
- **Mobbin** — Uses a light, gray-tiled reference library where screenshots sit on neutral mats and filters are compact pill chips.
