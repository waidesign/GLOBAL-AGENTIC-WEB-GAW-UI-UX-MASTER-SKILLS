---
id: "the-pudding"
name: "The Pudding"
theme: "light"
category: "saas"
tags: ["the-pudding","light","saas","web-app"]
vibe: "die-cut stickers on a contact sheet. Keep the chrome a quiet white-and-charcoal index of typewriter labels and chunky serif titles, and let each story frame carry the colour."
liveUrl: "https://pudding.cool/"
previewUrl: "https://ui.gradientdeck.com/styles/the-pudding"
lastVerified: "2026-11-08"
---

# The Pudding — Style Reference
> die-cut stickers on a contact sheet. Keep the chrome a quiet white-and-charcoal index of typewriter labels and chunky serif titles, and let each story frame carry the colour.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

The Pudding is a white-canvas index of visual essays laid out like a contact sheet: three columns of story cards, each a flat, saturated colour frame with a screenshot of the essay sunk into it. The site's own chrome stays almost colourless, Paper #ffffff with Pudding Charcoal #262626 type, outlined issue-number pills and 2px-cornered charcoal buttons, so the per-story frames supply every bit of hue. Gooper SemiCondensed 32px/700 lowercase titles at -0.8px tracking give the page a chunky, friendly editorial voice, Atlas Typewriter uppercase labels add a zine-like catalogue register, and Atlas Grotesk keeps teasers plain. Die-cut sticker lettering for the wordmark, nav and footer is the signature flourish.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, header, footer, text fields and button labels — the flat white field every colour frame sits on |
| Pudding Charcoal | `#262626` | Body text, story titles, issue-pill outlines and the filled block buttons — a soft charcoal rather than pure black runs the whole chrome |
| Graphite Gray | `#6d6d6d` | Story teaser lines under each title and the link hover colour — one quiet step down from Pudding Charcoal |
| Ink | `#000000` | Sticker wordmark, filter icons and other SVG artwork fills — the pure black of the die-cut lettering |
| Ash Border | `#acacac` | 1px outline of the search, email and captcha fields, measured as rgba(48, 48, 48, 0.4) over Paper |
| Highlighter Yellow | `#fde300` | Example story-frame fill — each essay picks its own flat frame colour; this acid yellow is one of the loudest in the grid |
| Sticker Magenta | `#ed12ed` | Example story-frame fill — saturated per-story colour fields like this, never the chrome, bring the hue to the index |

## Typography

### Gooper SemiCondensed — The display voice: lowercase story titles at 32px/700 with 32px line-height and -0.8px tracking, and 24px/700 promo headings at 24px line-height. The soft, ball-terminal semi-condensed serif is chunky and warm, so headlines read like friendly magazine headers rather than news.
- **Substitute:** Fraunces, Iowan Old Style, Times New Roman, serif
- **Licence:** commercial (the font file names it GooperSemiCondensed); buy a licence from its foundry, or use the substitute
- **Weights:** 700
- **Sizes:** 24px, 32px
- **Line height:** 1.00
- **Letter spacing:** -0.8px at 32px; normal at 24px
- **OpenType features:** `"kern", "liga" 0, "onum" 0, "tnum"`

### Atlas Typewriter — The catalogue layer: uppercase issue numbers and dates at 14px/400 with 19.6px line-height, filter and button labels at 12.8px, the search field and load-more label at 16px. Only the Medium cut is loaded, so it renders a sturdy typewriter texture; +1px tracking appears on button labels only.
- **Substitute:** IBM Plex Mono, Menlo, Consolas, monospace
- **Licence:** commercial (the font file names it Atlas Typewriter Web); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 12.8px, 14px, 16px
- **Line height:** 1.15, 1.40
- **Letter spacing:** normal at 12.8px and 14px; +1px on 12.8px and 16px uppercase button labels
- **OpenType features:** `"kern", "liga" 0, "onum" 0, "tnum"`

### Atlas Grotesk — Plain reading text: 16px/400 story teasers and footer copy at 22.4px line-height, 16px/700 underlined footer links, and the 14px two-line masthead tagline at 1.32 line-height. A neutral grotesk at normal tracking, it steps aside so titles and artwork lead.
- **Substitute:** Inter, -apple-system, Helvetica, Arial, sans-serif
- **Licence:** commercial (the font file names it Atlas Grotesk Web); buy a licence from its foundry, or use the substitute
- **Weights:** 400, 700
- **Sizes:** 14px, 16px
- **Line height:** 1.15, 1.32, 1.40
- **Letter spacing:** normal at 14px and 16px
- **OpenType features:** `"kern", "liga" 0, "onum" 0, "tnum"`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| filter-label | Atlas Typewriter | 400 | 12.8px | 1.15 | 0px |
| button-label | Atlas Typewriter | 400 | 12.8px | 1.4 | 0px |
| issue-label | Atlas Typewriter | 400 | 14px | 1.4 | 0px |
| masthead-tagline | Atlas Grotesk | 400 | 14px | 1.32 | 0px |
| body | Atlas Grotesk | 400 | 16px | 1.4 | 0px |
| footer-link | Atlas Grotesk | 700 | 16px | 1.4 | 0px |
| promo-heading | Gooper SemiCondensed | 700 | 24px | 1 | 0px |
| story-title | Gooper SemiCondensed | 700 | 32px | 1 | -0.8px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 16px

### Border Radius

- **buttons:** 2px
- **submit:** 3px
- **inputs:** 6px
- **badges:** 28px
- **images:** 0px

## Components

### Sticker Masthead Bar
**Role:** Site header with wordmark and top links

A 120px-high transparent bar on Paper with 32px 16px 16px padding: a two-line Atlas Grotesk 14px tagline at left (400 then 700, 18.55px line-height) in Pudding Charcoal, the black die-cut sticker wordmark centred, and three sticker-lettered image links at right. No border, no shadow.

### Sticky Filter Bar
**Role:** Search and story-category filters

A 48px-high row: a sticker magnifier and a Find a story field in Atlas Typewriter 16px at left; six transparent filter buttons at right, each a chunky Ink outlined icon plus an uppercase Atlas Typewriter 12.8px/400 label at 14.72px line-height, 0px padding, 2px radius. Sticks to the top on scroll over Paper.

### Issue Number Pill
**Role:** Story number tag above each card

Transparent tag with a 1px solid Pudding Charcoal #262626 border, 28px radius, 4px padding and 30px height; text is Atlas Typewriter 14px/400 uppercase at 19.6px line-height, like #225. The month and year sit right-aligned on the same row in the same type, no border.

### Colour Frame Story Card
**Role:** The repeating essay card in the index grid

Tag row, then a near-square flat frame (about 394px wide) in a story-specific hue such as Highlighter Yellow #fde300, holding a centred portrait screenshot cropped by the bottom edge; 0px radius, no border or shadow. Below, a lowercase Gooper SemiCondensed 32px/700 title at -0.8px tracking and a Graphite Gray #6d6d6d Atlas Grotesk 16px/400 teaser.

### Charcoal Block Button
**Role:** Filled action button

Pudding Charcoal #262626 fill, Paper uppercase Atlas Typewriter 12.8px/400 label, 2px radius, no border or shadow. Compact version (Shop Our Swag) uses 12px padding and 17.92px line-height for a 42px height; Load More Stories uses 16px 18px padding, a leading chevron and +1px tracking at 55px high.

### Lipped Text Field
**Role:** Search, email and captcha inputs

Paper fill, 1px solid rgba(48, 48, 48, 0.4) border (reads as Ash Border #acacac), 6px radius, 8px padding, Pudding Charcoal Atlas Grotesk 16px/400 at 18.4px line-height (Atlas Typewriter for search), and a hard rgba(0, 0, 0, 0.3) 0 2px 1px lip shadow. 32–36px high.

### Inbox Promo Tile
**Role:** Newsletter signup inside the story grid

Occupies one grid cell with no frame: a winking envelope mascot illustration, a centred Gooper SemiCondensed 24px/700 two-line heading at 24px line-height, an email Lipped Text Field, a Prove you're human captcha field and a Pudding Charcoal Subscribe button with a 3px radius and 1px tracking.

### Merch Promo Tile
**Role:** Shop teaser inside the story grid

One borderless grid cell on Paper: a centred Gooper SemiCondensed 24px/700 heading at 24px line-height, a product photo of a black T-shirt covered in die-cut stickers, and a compact Charcoal Block Button with 12px padding below it.

### Load More Fade
**Role:** Pagination at the end of the grid

The final row of cards fades to Paper under linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 30%, #ffffff 50%), with a centred 55px Charcoal Block Button reading Load More Stories on top of the fade.

### Sticker Footer
**Role:** Support, newsletter and site links

Three columns on Paper, each topped by a die-cut sticker image (Donate badge, Subscribe roundel, wordmark). Under them, Atlas Grotesk 16px/700 underlined Pudding Charcoal links with a north-east arrow, 16px/400 body copy at 22.4px line-height, and Atlas Typewriter 14px uppercase column labels. No rules, no fill.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the only page canvas and keep every piece of chrome in Pudding Charcoal #262626 or Graphite Gray #6d6d6d.
- Set story titles in Gooper SemiCondensed 32px/700, 32px line-height and -0.8px tracking, written in lowercase.
- Set issue numbers and dates in Atlas Typewriter 14px/400 uppercase at 19.6px line-height, the number inside a 1px Pudding Charcoal outline with a 28px radius and 4px padding.
- Give each story card its own flat saturated frame colour, such as Highlighter Yellow #fde300 or Sticker Magenta #ed12ed, with the essay screenshot inset and square-cornered.
- Keep teasers in Atlas Grotesk 16px/400 at 22.4px line-height in Graphite Gray #6d6d6d directly beneath the title.
- Build filled actions as Pudding Charcoal #262626 blocks with Paper uppercase Atlas Typewriter 12.8px labels, a 2px radius and 12px or 16px 18px padding.
- Set the index as a three-column grid inside 1280px with 32px gutters and 64px between rows.

### Don't
- Do not tint the chrome with a brand hue; the header, labels, buttons and footer stay Pudding Charcoal #262626 on Paper #ffffff.
- Do not round or shadow the story frames; they are 0px-radius flat colour fields with no border.
- Do not set titles in sentence or title case or at regular weight; keep Gooper SemiCondensed 700 lowercase.
- Do not use pill-shaped 9999px buttons; filled buttons use a 2px radius and only the issue-number tag is rounded at 28px.
- Do not reuse one frame colour across neighbouring cards; adjacent stories should contrast like a contact sheet.
- Do not replace the Atlas Typewriter uppercase labels with the grotesk; the typewriter layer is what makes the index feel catalogued.
- Do not give text fields a flat outline only; keep the 1px Ash Border #acacac, 6px radius and the 0 2px 1px lip shadow.

## Elevation

- **Field Lip:** `rgba(0, 0, 0, 0.3) 0px 2px 1px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, masthead, grid gutters, footer and text fields.
- **Pudding Charcoal** (`#262626`) — Filled Load More, Subscribe and Shop Our Swag buttons.

## Imagery

Imagery is the stories themselves. Every card frame is a flat, highly saturated colour picked per essay (acid yellow, magenta, violet, teal, tomato, sky blue, lime) with a portrait screenshot of the piece set into it, centred and cropped by the frame's bottom edge so the interface bleeds out of view. The screenshots show the essays' own charts, 3D scenes, maps and illustrated scenes, so the grid reads as a colourful contact sheet of data graphics. Site-owned artwork is sticker-style: black die-cut script lettering with a white outline and soft drop for the wordmark and nav, chunky outlined icons beside each filter, a winking envelope mascot, and Donate and Subscribe badge stickers in red, yellow and lilac in the footer. There is no stock photography; the one product photo is a merch T-shirt with stickers on it.

## Layout

A centred 1280px column on a pure white page. The 120px masthead has three parts: a two-line 'A digital publication that…' tagline at left whose second line rotates, the die-cut sticker wordmark centred, and three sticker-lettered links (About, Subscribe, More) at right. Below it sits a filter row, search icon and 'Find a story…' field at left and six icon-plus-label filters (Our Faves, Popular, Updating, Your Input, Video, Audio) at right; this row turns sticky as the page scrolls. The body is a strict three-column grid of story cards with 32px gutters and about 64px between rows, each card a tag row, a near-square colour frame, a title and a teaser. Promo tiles (newsletter signup, merch) occupy single grid cells, centred and borderless. The last row fades to white under a centred Load More Stories button, and a three-column sticker footer closes the page.

## Similar Brands

- **Information is Beautiful** — Shares an index of colourful data-visualisation thumbnails tiled in a grid on a plain white page.
- **It's Nice That** — Uses a white editorial index where bold, varied thumbnail imagery carries the colour and the chrome stays black and white.
- **Are.na** — Same contact-sheet logic of a quiet white grid whose colour comes entirely from the content blocks.
