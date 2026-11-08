---
id: "the-line-studio"
name: "The Line Studio"
theme: "light"
category: "fintech"
tags: ["the-line-studio","light","fintech","banking"]
vibe: "stencil wordmark over a red-tinted reel. Let one grotesk at poster scale, slashes and a single vermilion signal frame the footage on a card-free page."
liveUrl: "https://thelinestudio.com/"
previewUrl: "https://ui.gradientdeck.com/styles/the-line-studio"
lastVerified: "2026-11-08"
---

# The Line Studio — Style Reference
> stencil wordmark over a red-tinted reel. Let one grotesk at poster scale, slashes and a single vermilion signal frame the footage on a card-free page.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

The Line Studio is a London animation studio site that behaves like a title sequence: a full-bleed reel washed in pure Red #ff0000 sits under a width-spanning stencil wordmark, then the page drops onto Fog Gray #dddee2 and Studio Paper #f8f8f8 planes where work floats as tilted frames. There are no cards, radii or shadows; structure comes from Ink #0b0b0b hairlines, dashed broadcast safe-area guides and slashes between every list item. Signal Vermilion #ff391e marks the active nav dot, credit roles and the sticky footer. DenimWeb does everything, from 194px/500 section titles at 0.8 line-height and -7.78px tracking down to 11px uppercase labels, so the voice stays one grotesk shouting or whispering.

## Colors

| Name | Value | Role |
|------|-------|------|
| Studio Paper | `#f8f8f8` | Main content sections (studio, clients, news, contact) and all text set over video or vermilion |
| Ink | `#0b0b0b` | All headlines, nav, lists, underline rules, dashed safe-area guides and the black wordmark |
| Fog Gray | `#dddee2` | Body canvas behind the hero, the tilted project showcase and the credits strip — a cool grey stage for the work |
| Signal Vermilion | `#ff391e` | Active nav dot and HOME label, credit-role text and the sticky footer fill — the one warm signal on a grey page |
| Reel Red | `#ff0000` | Pure-red tint layer over the hero reel and the square showreel panel, turning footage into a monochrome red print |
| Logo Mist | `#e8e9ee` | Fill of the giant stencil wordmark over the red hero reel, a hair cooler than Studio Paper |

## Typography

### DenimWeb — The only typeface on the site: the commercial variable grotesk Denim (served as DenimWeb from DenimVF, 300–800), used at five fractional weights. Section titles run 194.44px/500 at 0.8 line-height and -7.78px tracking, project titles 88.89px/470, client lists 59.26px/470, nav 20.37px/440 uppercase, labels 11.11px/440 uppercase. Sizes are fluid, leading is tight, slashes sit at weight 300.
- **Substitute:** Inter Tight, Arial, sans-serif
- **Licence:** commercial (the font file names it Denim); buy a licence from its foundry, or use the substitute
- **Weights:** 300, 400, 440, 470, 500
- **Sizes:** 7.41px, 11.11px, 14.81px, 18.52px, 20.37px, 25.93px, 29.63px, 37.04px, 59.26px, 88.89px, 118.52px, 194.44px
- **Line height:** 0.80, 0.85, 0.95, 1.10, 1.17, 1.20, 1.75
- **Letter spacing:** -7.78px at 194.44px; -3.56px at 88.89px and 118.52px; -1.11px at 37.04px; otherwise -1% of size (-0.59px at 59.26px, -0.15px at 14.81px, -0.11px at 11.11px)
- **OpenType features:** `"ss03"`

### Arial — Renders only in the footer newsletter field: the input does not inherit DenimWeb, so the 59.26px/470 'Newsletter' placeholder falls back to Arial on Signal Vermilion. Treat it as a measured quirk, not a second voice; new work should keep DenimWeb.
- **Substitute:** Helvetica, sans-serif
- **Weights:** 470
- **Sizes:** 59.26px
- **Line height:** 0.80
- **Letter spacing:** -0.59px at 59.26px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| micro | DenimWeb | 440 | 7.41px | 1.75 | -0.07px |
| label | DenimWeb | 440 | 11.11px | 1.17 | -0.11px |
| body | DenimWeb | 440 | 14.81px | 1.1 | -0.15px |
| address | DenimWeb | 440 | 18.52px | 1.2 | -0.19px |
| nav | DenimWeb | 440 | 20.37px | 0.85 | -0.2px |
| intro | DenimWeb | 400 | 25.93px | 1.1 | -0.26px |
| link | DenimWeb | 440 | 29.63px | 1.1 | -0.3px |
| headline | DenimWeb | 440 | 37.04px | 0.85 | -1.11px |
| list-display | DenimWeb | 470 | 59.26px | 0.95 | -0.59px |
| project-title | DenimWeb | 470 | 88.89px | 0.8 | -3.56px |
| reel | DenimWeb | 470 | 118.52px | 0.85 | -3.56px |
| display | DenimWeb | 500 | 194.44px | 0.8 | -7.78px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Section gap:** 296.3px
- **Card padding:** 0px
- **Element gap:** 7.41px

### Border Radius

- **buttons:** 0px
- **images:** 0px
- **inputs:** 0px
- **dots:** 9999px

## Components

### Slash Navigation Bar
**Role:** Fixed top site navigation and studio status

A transparent 20px fixed bar with 0 7.41px padding: stencil wordmark left, 11.11px/440 uppercase status labels with a 9999px dot, and 20.37px/440 uppercase links at 0.85 line-height split by weight-300 slashes. Active HOME is Signal Vermilion with a dot; no fill, no shadow.

### Stencil Wordmark Hero
**Role:** Full-viewport opening reel

A full-bleed autoplaying reel under a flat Reel Red #ff0000 tint layer, with the blocky stencil THE LINE wordmark in Logo Mist #e8e9ee spanning the full width along the bottom edge and a circled R above its right end. No headline, no button.

### Giant Section Title
**Role:** Section opener

Set Ink #0b0b0b DenimWeb at 194.44px/500, 0.8 line-height and -7.78px tracking, flush left on the 7.41px gutter, preceded by an 11.11px uppercase slash eyebrow. Leave roughly 300px of empty Studio Paper before the content begins.

### Slash Eyebrow
**Role:** Section and metadata label

DenimWeb 11.11px/440 uppercase at 12.96px line-height and -0.11px tracking in Ink, led by a weight-300 slash: '/ THE LOWDOWN', '/ STUDIO NEWS / 27/02/2026'. Never bold, never spaced out.

### Tilted Project Frame
**Role:** Highlights showcase item

A 0-radius still or video frame rotated a few degrees on Fog Gray #dddee2, overlapping its neighbours, with an 88.89px/470 Ink title at 0.8 line-height and -3.56px tracking and a View project arrow link at the opposite edge. No border, no shadow.

### Safe Area Guide Frame
**Role:** Broadcast-style decorative overlay

Nested rectangles drawn with 1px dashed #0b0b0b and one 1px solid #0b0b0b crop line, each labelled in 11.11px/500 uppercase DenimWeb (OVERSCAN, CROP, ACTION SAFE, [ 16:9 ]). Sits behind project frames as a production reference.

### Arrow Underline Link
**Role:** Primary action

DenimWeb 29.63px/440 Ink text at 1.1 line-height and -0.3px tracking over a full-width 1px solid #0b0b0b underline, with a trailing arrow glyph and an optional 7.41px count like [ 20 ]. 0 radius, no fill; colour transitions 0.6s.

### Slash Client List
**Role:** Clients and partners wall

One running paragraph of Ink DenimWeb 59.26px/470 at 0.95 line-height and -0.59px tracking, names split by weight-300 slashes with small monochrome SVG logos set inline at text height. Full width, left aligned, no grid.

### Award Underline List
**Role:** Awards and press mentions

Two columns from the page midpoint of DenimWeb 14.81px/440 uppercase at 1.1 line-height and -0.15px tracking. Award names carry a text underline; press names are plain Ink. Headed by an 11.11px slash eyebrow.

### Showreel Panel
**Role:** Reel play trigger

A full-bleed video on an Ink #0b0b0b section with a centred square Reel Red #ff0000 tint panel; inside, a play triangle and Reel at 118.52px/470 in Studio Paper, with 11.11px uppercase corner metadata (SHOWREEL / 2025, 1:26, THE LINE © MMXXVI).

### News Story Tile
**Role:** Studio news teaser

Two equal columns with an 8px gutter: a 0-radius 16:10 image, an 11.11px uppercase slash meta line, then an Ink 37.04px/440 uppercase headline at 0.85 line-height and -1.11px tracking. No card fill, no shadow.

### Let's Talk Block
**Role:** Closing contact prompt

A 194.44px/500 Ink title with a 1px solid #0b0b0b underline spanning half the page and an oversized Ink arrow at the right edge, then the black stencil wordmark spanning the full width with a circled R.

### Vermilion Sticky Footer
**Role:** Contact, address and site links

A full-bleed Signal Vermilion #ff391e footer revealed under the sliding wordmark: Studio Paper 29.63px/470 email and phone at left, 18.52px/440 address, social and nav columns under 11.11px slash eyebrows, and a red-print character illustration. No borders between columns.

### Underline Newsletter Field
**Role:** Email signup

A transparent 0-radius input with a 1px solid #f8f8f8 bottom border, 59.26px/470 Studio Paper placeholder at 0.8 line-height, 0 64.81px 0 0 padding, and an arrow submit at the right end. No box, no fill.

### Credits Strip
**Role:** Site credits

A Fog Gray #dddee2 band with a 194.44px/500 Credits title at left and a run of 14.81px DenimWeb text: Signal Vermilion role labels at 470 each led by a 9999px dot, Ink names at 440, all split by weight-300 slashes.

## Do's and Don'ts

### Do
- Use DenimWeb for every role, from 194.44px/500 section titles at 0.8 line-height and -7.78px tracking down to 11.11px/440 uppercase labels.
- Set section titles flush left on the 7.41px page gutter and leave hundreds of pixels of empty Studio Paper #f8f8f8 below them.
- Use a weight-300 slash, at the same size as the text, between every list item, nav link and breadcrumb.
- Reserve Signal Vermilion #ff391e for the active nav dot, credit-role labels and the full-bleed sticky footer.
- Apply Reel Red #ff0000 as a flat tint layer over footage in the hero and showreel panel, never as a UI fill.
- Keep every image, video and field at 0px radius; use 9999px only on the small status and active-nav dots.
- Pair text links with a 1px solid Ink #0b0b0b underline and a trailing arrow glyph, as in View project and See All.

### Don't
- Do not introduce a second typeface for headings or body; the Arial newsletter field is an inheritance slip, keep DenimWeb.
- Do not add filled or pill buttons; actions are underlined DenimWeb text with an arrow, not boxes.
- Do not add box-shadows or rounded cards; work sits as square, tilted frames on Fog Gray #dddee2.
- Do not loosen the display line-height; 194.44px titles stay at 0.8 and 88.89px titles at 0.8 with -3.56px tracking.
- Do not use bold 700–800 weights; the heaviest measured weight is 500 and most text sits at 440 or 470.
- Do not centre content in a max-width column; the page is full-bleed with a 7.41px side gutter.
- Do not spread Signal Vermilion #ff391e across headings or body text; Ink #0b0b0b carries all the type.

## Elevation

There is no elevation at all: no box-shadows were measured and every image, panel and field is square-cornered. Depth comes from motion and layering instead — project frames tilt and slide over the Fog Gray stage, the black wordmark rides up over the sticky Signal Vermilion footer, and Reel Red tints sit on top of footage. Separation is done with 1px solid Ink underlines and 1px dashed Ink safe-area guides.

## Surfaces

- **Fog Gray** (`#dddee2`) — Body canvas behind the hero, the Highlights stage and credits.
- **Studio Paper** (`#f8f8f8`) — Studio, clients, news and contact content sections.
- **Ink** (`#0b0b0b`) — Showreel section behind the full-bleed video.
- **Signal Vermilion** (`#ff391e`) — Sticky footer revealed beneath the black wordmark.

## Imagery

The imagery is the studio's animation: Gorillaz, Marvel Snap and commercial work as autoplaying full-bleed video and large stills, always square-cornered and edge to edge or tilted a few degrees as loose prints. The hero and showreel get a flat pure-red tint so footage reads as a single-colour print under white type. Studio photography (caps on brick walls, desk flat-lays) is shot with flash and collaged at angles. Client logos are small monochrome SVGs set inline in the type. The only graphics are the blocky stencil THE LINE wordmark with its circled R, heavy arrow glyphs, and dashed broadcast safe-area frames labelled OVERSCAN, CROP and ACTION SAFE. No icons, no illustrations made for UI.

## Layout

A full-bleed, edge-to-edge page with no max-width container and a 7.41px side gutter; every measurement is viewport-scaled. A 20px transparent header sits fixed on top: wordmark left, two 11.11px status labels at fixed offsets, slash-separated uppercase nav right. The hero is a full-viewport red-tinted reel with the stencil wordmark spanning the full width along the bottom edge. Below, a Fog Gray stage holds a scroll-driven Highlights sequence of tilted, overlapping project frames with 88.89px titles. Content sections follow on Studio Paper: a 194.44px title flush left, a huge empty band, then an asymmetric split (rotated photo collage left, intro and award columns from the midpoint right). Clients run as one 59.26px slash-separated paragraph, the showreel is a full-bleed video with a centred square panel, news is two equal 0-radius columns, and Let's Talk hands over to a sticky Signal Vermilion footer the black wordmark slides across. Section gaps run near 300px.

## Similar Brands

- **Buck** — Same animation-studio pattern of full-bleed reel footage leading the page with minimal interface chrome around the work.
- **Studio Freight** — Shares oversized flush-left grotesk titles, viewport-scaled type and scroll-driven motion on a plain light canvas.
- **Locomotive** — Uses huge tight-leading grotesk display type, full-bleed layouts and long expo-out scroll transitions.
