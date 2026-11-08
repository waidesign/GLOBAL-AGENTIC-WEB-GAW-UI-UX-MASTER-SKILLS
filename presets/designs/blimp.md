---
id: "blimp"
name: "Blimp"
theme: "dark"
category: "editorial"
tags: ["blimp","dark","editorial","publishing"]
vibe: "crop marks on a record sleeve, red pen on newsprint. Spread black Helvetica letters edge to edge, then pin tiny mono labels beside them."
liveUrl: "https://www.blimp.gr/"
previewUrl: "https://ui.gradientdeck.com/styles/blimp"
lastVerified: "2026-11-08"
---

# Blimp — Style Reference
> crop marks on a record sleeve, red pen on newsprint. Spread black Helvetica letters edge to edge, then pin tiny mono labels beside them.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Blimp is a Greek album-review zine laid out like a print-shop proof sheet. A near-black #121212 canvas alternates with bands of flat concrete-grey #b3b2ae, and every card is a square-cornered bone-grey #c1c1bd sheet framed by black printer's crop marks instead of borders or shadows. Helvetica Now Display Black runs at 143–146px with 0.8 line-height, letters spread edge to edge so headlines read as poster type, while everything else is 12px uppercase Helvetica Monospaced with +0.24px tracking. The only colour is a scribbled #ea0f32 red pen mark: the favicon, the arrows that point into headlines and the star beside the active item.

## Colors

| Name | Value | Role |
|------|-------|------|
| Pressroom Black | `#121212` | Page canvas, header and footer bands, archive list, and the giant cropped letters on grey bands |
| Bone | `#c1c1bd` | Wordmark, nav and mono text on the dark canvas, plus the fill of every crop-marked album card |
| Concrete | `#b3b2ae` | Full-width light section bands behind the album grid, the Album of the Week and the Babaluma banner |
| Ink | `#000000` | Album card titles, crop-mark corners and genre labels set on Bone card sheets |
| Scribble Red | `#ea0f32` | Hand-drawn favicon scrawl, arrows pointing into section titles and star bullets beside active labels — a red-pen proofing mark, never a fill |

## Typography

### HelveticaNowDisplay — Every headline, the split THE / BLIMP wordmark and card titles, always uppercase. Only the Black (900) file is loaded, so the 400 and 500 weights the CSS asks for still render Black. Sizes jump from 28px titles to 48px section heads to 143–146px poster letters at 0.8–0.9 line-height, with -0.03em tracking at 28px and 48px and none at poster sizes.
- **Substitute:** Inter Tight, Helvetica Neue, Arial, sans-serif
- **Licence:** commercial (the font file names it Helvetica Now Display); buy a licence from its foundry, or use the substitute
- **Weights:** 400, 500, 900
- **Sizes:** 28px, 48px, 143px, 146.3px
- **Line height:** 0.80, 0.90
- **Letter spacing:** -0.84px at 28px; -1.44px at 48px; 0 at 143px and 146.3px

### Helvetica Monospaced W1G — The whole small-text layer: navigation, card labels, genres, the three-column archive index, dates, captions and credits. Set at 12px, uppercase, 18px line-height and +0.24px tracking (requested at weight 300; the file is the Regular cut), it reads like a typewritten catalogue slip against the Black display type.
- **Substitute:** IBM Plex Mono, Courier New, Courier, monospace
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 300
- **Sizes:** 12px, 14px
- **Line height:** 0.80, 1.20, 1.50
- **Letter spacing:** +0.24px at 12px; 0 at 14px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| label | Helvetica Monospaced W1G | 300 | 12px | 1.5 | 0.24px |
| tagline | Helvetica Monospaced W1G | 300 | 14px | 0.8 | 0px |
| card-title | HelveticaNowDisplay | 900 | 28px | 0.9 | -0.84px |
| section-heading | HelveticaNowDisplay | 900 | 48px | 0.9 | -1.44px |
| wordmark | HelveticaNowDisplay | 900 | 143px | 0.8 | 0px |
| display | HelveticaNowDisplay | 500 | 146.3px | 0.8 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1600px
- **Section gap:** 100px
- **Card padding:** 10px
- **Element gap:** 20px

### Border Radius

- **cards:** 0px
- **images:** 0px
- **links:** 0px

## Components

### Split Wordmark Header
**Role:** Masthead and primary navigation

A 132px Pressroom Black #121212 bar with 0px 10px padding: THE at left and BLIMP at right in Bone HelveticaNowDisplay 143px/900 at 0.8 line-height. Along the bottom edge run 12px/300 uppercase Helvetica Monospaced nav links with 10px left padding, a Scribble Red star on the active item, and a right-aligned LAST UPDATED stamp.

### Crop-Mark Album Card
**Role:** Album review teaser

A Bone #c1c1bd sheet on a Concrete band with 10px padding, 0px radius and no shadow or border; black L-shaped crop marks sit just outside each corner. Label line in 12px/300 mono, title in Ink HelveticaNowDisplay 28px/900 at 25.2px line-height and -0.84px tracking, genres bottom-left, square cover flush bottom-right.

### Feature Album Card
**Role:** Latest review lead slot

The 780px by 700px version of the Crop-Mark Album Card, spanning two rows at the left of the grid. Title at 48px/900 with 43.2px line-height and -1.44px tracking, a Scribble Red star plus LATEST label in 12px mono top-right, and a 360px square cover flush to the bottom-right corner.

### Bracketed Mono Tag
**Role:** Column headers, tagline and credits

12px/300 Helvetica Monospaced text, often lowercase, framed by two thin half-brackets: one at the top-left corner and one at the bottom-right. Used for artist + title / genre / label column heads, the spaced-out tagline under the wordmark, and footer credits. No fill, no radius.

### Archive Index Table
**Role:** Chronological list of past reviews

Three borderless columns on Pressroom Black: numbered artist and title, genre, label. Every cell is Bone #c1c1bd Helvetica Monospaced 12px/300 uppercase at 18px line-height and +0.24px tracking; long values wrap within the column. No row rules, no zebra fill and no hover chrome in the static state.

### Spread-Letter Section Title
**Role:** Poster-scale section heading

HelveticaNowDisplay 146.3px uppercase at 0.8 line-height and 0 tracking, rendered Black, with the first word's letters justified across the full 1600px width and the next line's words pushed to the left, middle and right. A Scribble Red arrow points into the last word; a small mono date stamp sits below.

### Scribble Red Arrow
**Role:** Hand-drawn pointer and bullet

An 80px by 102px marker-drawn SVG arrow in Scribble Red #ea0f32, slightly rotated, placed just before the last word of a section title. A 12px by 10px scrawled star of the same red marks the active nav item, LATEST and AOTW labels. Never filled, boxed or animated into a button.

### Explore Text Link
**Role:** Secondary navigation into a section

A bare 12px/300 uppercase Helvetica Monospaced EXPLORE label in Bone with +0.24px tracking, followed by a small Scribble Red hand-drawn arrow to its right. No underline, background, padding box or radius; it floats in the empty left margin of a section.

### Date Stamp Block
**Role:** Issue date beside a section title

A two-line stack: a 12px/300 mono label such as WEEK: 45 or DAY: at 9.6px line-height, directly above a HelveticaNowDisplay 28px/900 date at 25.2px line-height and -0.84px tracking. Colour follows the band: Pressroom Black on Concrete, Bone on Pressroom Black.

### Soundtrack Artwork Block
**Role:** Featured mix with large cover

A 600px square artwork centred on Pressroom Black with 0px radius and no frame. A mono RECORDED LIVE duration caption sits at the far right, an EXPLORE link at the far left, and a centred 12px LISTEN NOW mono label below the image.

### Babaluma Type Banner
**Role:** Full-bleed typographic interlude

A full-width Concrete #b3b2ae band holding a 1600px by 810px SVG of Pressroom Black letters spelling SOON OVER BA BALU MA, cropped off every edge. Below it runs one row of 12px mono microcopy: NON-RIGID at left, a centred two-line statement, TRANSMISSIONS at right, then a bracketed BACK TO TOP tag.

### Wordmark Footer
**Role:** Closing masthead and credits

A 194px Pressroom Black band with 20px 0px 30px padding repeating THE and BLIMP at 143px/900, 114.4px line-height in Bone at opposite edges. Beneath each word sits a Bracketed Mono Tag credit in 12px/300 lowercase at 9.6px line-height.

## Do's and Don'ts

### Do
- Use Pressroom Black #121212 as the canvas and switch whole full-width bands to Concrete #b3b2ae for the album grid, Album of the Week and banner sections.
- Set headlines in HelveticaNowDisplay Black, uppercase, at 143px or 146.3px with 0.8 line-height and 0 tracking, spreading the letters across the full 1600px width.
- Set all small text in Helvetica Monospaced W1G 12px/300, uppercase, 18px line-height and +0.24px tracking.
- Apply black L-shaped crop marks just outside the four corners of every Bone #c1c1bd card instead of a border.
- Reserve Scribble Red #ea0f32 for hand-drawn arrows, the star bullet and the favicon mark, pointing into a headline or label.
- Keep album card titles at 28px/900 with 25.2px line-height and -0.84px tracking in Ink #000000, with 10px card padding.
- Keep the wordmark split: THE at the left edge and BLIMP at the right edge, with the empty middle left open.

### Don't
- Do not round anything; every card, image and link uses a 0px radius.
- Do not add drop shadows or 1px borders to cards; use the Bone #c1c1bd tonal step and crop marks.
- Do not use Scribble Red #ea0f32 as a button fill, background or text colour; it only appears as a pen-drawn mark.
- Do not set display type in regular or medium weights; HelveticaNowDisplay renders only its Black cut.
- Do not use sentence-case body copy in a proportional face; running text is 12px uppercase Helvetica Monospaced W1G.
- Do not introduce a lighter paper-white surface; the lightest tone on the page is Bone #c1c1bd.
- Do not centre headlines in a narrow column; poster letters run edge to edge and break across 1600px.

## Elevation

There is no elevation at all: no shadows, no radii, no borders. Cards separate from the Concrete band only by the one-step tonal lift to Bone #c1c1bd and by black L-shaped crop marks just outside each corner, drawn with stacked linear-gradient backgrounds. Depth comes from type scale and from tone switches between Pressroom Black and Concrete bands, not from layers.

## Surfaces

- **Pressroom Black** (`#121212`) — Page canvas, header, archive, soundtrack block and footer.
- **Concrete** (`#b3b2ae`) — Full-width light bands behind cards and the type banner.
- **Bone** (`#c1c1bd`) — Crop-marked album card sheets on Concrete bands.

## Imagery

Imagery is album artwork only: square covers placed flush into the lower-right corner of cards at 200–360px, or a single 600px square centred in the Soundtrack block, always with 0px radius, no frame and no shadow. Covers keep their own colour, which makes them the only full-colour moments against the grey-and-black page. The intro canvas scatters dozens of small covers over Pressroom Black. Graphics are typographic: a 1600x810 SVG of cropped SOON OVER BA BALU MA letters, and hand-scribbled Scribble Red arrow and star SVGs that look drawn with a marker. There are no photographs of people, no icon set and no illustrations.

## Layout

A full-bleed 1600px page with a 10px outer gutter and no centred container. The 132px header splits the wordmark into THE at the far left and BLIMP at the far right, with a monospace nav row and last-updated stamp along its bottom edge. Sections are full-width tone bands of about 1000px each: a Concrete album grid (one 780px feature card plus a 2x2 grid of smaller cards), a Pressroom Black archive with a 48px heading pinned low-left and a three-column mono index to the right, the Concrete Album of the Week with letters spread across two lines and a single centred card, a dark Soundtrack for the Day block with a 600px square artwork, and a Concrete banner of cropped giant letters. Large stretches of empty canvas are deliberate; content clusters at edges and corners.

## Similar Brands

- **Pitchfork** — Same subject, music reviews built around album artwork as the main imagery on each review card.
- **The Quietus** — Shares an independent music-zine voice and a list-heavy archive of reviews by artist, label and genre.
- **Experimental Jetset** — Uses black Helvetica type at poster scale with words pushed to the edges of the format.
- **Wax Poetics** — Uses record sleeves as the only colour on an otherwise restrained editorial page.
