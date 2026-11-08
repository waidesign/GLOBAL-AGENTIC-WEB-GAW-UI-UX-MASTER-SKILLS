---
id: "tailwind-css"
name: "Tailwind CSS"
theme: "light"
category: "developer-tools"
tags: ["tailwind-css","light","developer-tools","api","technical"]
vibe: "blueprint margins around a midnight editor. Rule a white page into hairline lanes, set huge tight gray-950 headlines, and let dark code windows carry the colour."
liveUrl: "https://tailwindcss.com/"
previewUrl: "https://ui.gradientdeck.com/styles/tailwind-css"
lastVerified: "2026-11-08"
---

# Tailwind CSS — Style Reference
> blueprint margins around a midnight editor. Rule a white page into hairline lanes, set huge tight gray-950 headlines, and let dark code windows carry the colour.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Tailwind CSS is a white-canvas framework site drawn like an annotated blueprint: every block sits between 1px hairline rules in Guide Wash #f2f2f3, with diagonally hatched 40px gutters at the page edges and tiny IBM Plex Mono class-name annotations floating above each headline. Display type is Inter at 96px/400 with -4.8px tracking, so the hero reads dense and engineered rather than loud. Colour lives almost entirely inside the product: Midnight Ink #030712 code windows with Sky Token #74d4ff and Syntax Pink #fb64b6 highlighting, a sky-blue logo wave, and live demo panels that show off the framework's own vivid palette. The only conversion control is a black 32px-radius pill.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, header, feature cards and demo cards, plus button labels on black pills |
| Midnight Ink | `#030712` | Headlines, navigation, logo wordmark and the dark editor window frames — gray-950 rather than pure black |
| Pitch Black | `#000000` | Filled Get started and Become a sponsor pills, the only solid action fill on the marketing page |
| Body Slate | `#4a5565` | Section introductions and feature-card copy at 14px and 16px — gray-600 keeps long text calm under Ink headings |
| Guide Wash | `#f2f2f3` | Hairline guide rules, gutter hatching, the version chip fill and the tinted backdrop behind feature cards |
| Editor Graphite | `#1d202a` | Code panes inside editor windows, composited from 10% white over Midnight Ink, with a faint white inset ring |
| Wave Sky | `#00bcff` | The double-wave logo mark and the live sky demo swatches — the one saturated hue that belongs to the brand itself |
| Utility Sky | `#00a6f4` | Inline IBM Plex Mono utility names in the hero lead (flex, pt-4) — class names glow as clickable vocabulary |
| Sky Token | `#74d4ff` | Attribute values and highlighted words inside dark code windows — the main syntax colour on Midnight Ink |
| Syntax Pink | `#fb64b6` | Tag names and keywords in code panels, the warm counterpart to Sky Token in every editor demo |
| Mint Token | `#96f7e4` | CSS property names and theme variables in code samples, a third cool syntax note used sparingly |
| Muted Gray | `#6a7282` | Keyboard hints, search placeholders and secondary demo metadata such as job titles |
| Annotation Gray | `#cccccc` | IBM Plex Mono class-name annotations above headlines — 20% black so the blueprint notes whisper |
| Plus Harbor | `#00598a` | The Plus navigation link inside its dashed sky outline — the only coloured item in the header |
| Demo Pink | `#f6339a` | Fill of the in-demo Check availability button on the responsive property card, not a site-level action colour |
| Code Frost | `#f8fafc` | Default code text on Editor Graphite panes and terminal output, a cool off-white rather than pure Paper |
| Comment Slate | `#90a1b9` | Line numbers, punctuation and comments in code panes, receding behind the syntax colours |

## Typography

### Inter — Served as the Inter Variable file. The whole interface and editorial voice. The 96px/400 hero at 96px line-height with -4.8px tracking and the 40px/500 section heads at -2px are packed tight and set in plain weights, so headlines feel typeset by an engineer; body runs untracked at 14px/24px to 16px/28px with generous leading.
- **Substitute:** Inter, system-ui, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 30px, 36px, 40px, 96px
- **Line height:** 1.00, 1.20, 1.33, 1.43, 1.50, 1.56, 1.60, 1.67, 1.71, 1.75, 2.00
- **Letter spacing:** -4.8px at 96px; -2px at 40px; 0px at all text sizes from 12px to 36px
- **OpenType features:** `"cv02", "cv03", "cv04", "cv11"`

### IBM Plex Mono — Every code window (13px/400 at 24px line-height), the faint 12px class-name annotations that label each headline, demo axis labels, and the 17px/500 inline utility names in the hero lead. Slashed zero and ss02 alternates make it read as real editor text, the site's second voice.
- **Substitute:** IBM Plex Mono, ui-monospace, monospace
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 14px, 17px
- **Line height:** 1.33, 1.65, 1.85, 2.00, 2.15
- **Letter spacing:** 0px at all sizes
- **OpenType features:** `"ss02", "zero"`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | Inter | 400 | 12px | 1.33 | 0px |
| annotation | IBM Plex Mono | 400 | 12px | 2 | 0px |
| code | IBM Plex Mono | 400 | 13px | 1.85 | 0px |
| nav | Inter | 400 | 14px | 1.71 | 0px |
| button | Inter | 600 | 14px | 1.71 | 0px |
| body | Inter | 400 | 16px | 1.75 | 0px |
| utility-token | IBM Plex Mono | 500 | 17px | 1.65 | 0px |
| lead | Inter | 500 | 18px | 1.56 | 0px |
| feature-title | Inter | 500 | 24px | 1.67 | 0px |
| section-display | Inter | 500 | 40px | 1 | -2px |
| hero-display | Inter | 400 | 96px | 1 | -4.8px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1600px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 8px

### Border Radius

- **buttons:** 32px
- **pills:** 9999px
- **cards:** 16px
- **windows:** 12px
- **panels:** 8px
- **images:** 8px
- **tabs:** 4px

## Components

### Ruled Navigation Bar
**Role:** Top-level site navigation

A 56px Paper bar with a 1px Guide Wash bottom rule: logo wave and wordmark at left beside a 24px version chip (Guide Wash fill, 16px radius, 2px 6px 2px 10px padding, Inter 12px/500). At right a Ctrl K search pill, Midnight Ink Inter 14px/400 links at 24px line-height, and the Plus link.

### Plus Outline Link
**Role:** Highlighted paid-product link

Plus Harbor #00598a Inter 14px/400 text with 0px 6px padding inside a 1px dashed rgba(115, 212, 255, 0.6) outline with small corner marks. No fill, no radius, no shadow; it is the only coloured header item.

### Annotated Hero Block
**Role:** Primary landing statement

Left-aligned Inter 96px/400 headline at 96px line-height and -4.8px tracking in Midnight Ink, preceded by an IBM Plex Mono 12px/400 Annotation Gray class-name note and followed by an Inter 18px/500 lead at 28px line-height. Each line sits in its own lane between full-width 1px Guide Wash rules.

### Black Pill Button
**Role:** Primary call to action

Pitch Black #000000 fill, Paper Inter 14px/600 label at 24px line-height, 32px radius, 8px 16px padding, 40px height, no border and no shadow. Used for Get started and the smaller Become a sponsor action.

### Quick Search Pill Field
**Role:** Docs search trigger

A Paper pill with 9999px radius and an inset 1px ring of Midnight Ink at 8% opacity, a small magnifier, Muted Gray #6a7282 Inter 14px placeholder and a right-aligned 12px Ctrl K hint. Sits directly beside the Black Pill Button.

### Inline Utility Token
**Role:** Class names inside prose

IBM Plex Mono 17px/500 at 28px line-height in Utility Sky #00a6f4, set inline within the 18px/500 Inter lead with no background, padding or radius, so utilities like flex and pt-4 read as highlighted code.

### Midnight Code Window
**Role:** Editor demo of Tailwind markup

A Midnight Ink #030712 window with 12px radius and three gray traffic-light dots, holding Editor Graphite #1d202a panes at 8px radius with an inset 1px white ring at 10%. Code is IBM Plex Mono 13px/400 at 24px line-height in Code Frost #f8fafc, with Sky Token, Syntax Pink, Mint Token and Comment Slate #90a1b9 line numbers.

### Editor File Tab
**Role:** File switcher inside code windows

Inter 12px/400 Paper text at 20px line-height with 4px 8px padding and 4px radius. The active tab takes Editor Graphite fill with an inset 1px white ring at 5%; inactive tabs are transparent. Tabs sit in a strip above each pane.

### Feature Demo Card
**Role:** Bento grid capability tile

A Paper card with 16px radius on the Guide Wash backdrop. Put a grayscale isometric line icon beside an Inter 24px/500 Midnight Ink title and 14px/400 Body Slate copy at 28px line-height, then an 8px-radius demo stage with dotted radial pattern and inset 1px ring at 5%.

### Sponsor Logo Cell
**Role:** Partner and sponsor wall

Four equal columns of square-ish Paper cells separated by 1px Guide Wash rules, each centring a flat Midnight Ink wordmark around 40px tall. No card fill, radius or shadow; the hairline grid is the only structure.

### Floating Demo Card
**Role:** Rendered component inside demos

A Paper card with 12px radius, an inset 1px Midnight Ink ring at 5% and the 0 25px 50px -12px rgba(0, 0, 0, 0.25) drop, listing avatars with Inter 16px/500 names and Muted Gray titles separated by hairlines. Appears only inside demo stages.

### Showcase Mosaic
**Role:** Sites built with Tailwind

A dense five-column masonry of real website screenshots in 8px-radius frames with about 8px gutters, mixing tall mobile captures and wide desktop crops. The images carry all the colour; no captions, borders or shadows.

### Hairline Link Footer
**Role:** Site-wide footer navigation

Three columns between full-height 1px Guide Wash rules: Inter 14px/600 Midnight Ink headings, then Inter 14px/400 links at 28px line-height. A ruled bottom row carries the copyright and Trademark Policy link in a darker slate gray.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the canvas and divide it with 1px Guide Wash #f2f2f3 rules that run edge to edge above and below every text block.
- Set the hero in Inter 96px/400 with 96px line-height and -4.8px tracking in Midnight Ink #030712.
- Set section headings in Inter 40px/500 at 40px line-height with -2px tracking, followed by Body Slate #4a5565 copy at 16px/28px.
- Keep the single filled action a Pitch Black #000000 pill: 32px radius, 8px 16px padding, Inter 14px/600 Paper label, 40px tall.
- Place an IBM Plex Mono 12px/400 class-name annotation in Annotation Gray above each headline and paragraph.
- Build code demos as a Midnight Ink #030712 window with 12px radius and Editor Graphite #1d202a panes at 8px radius, set in IBM Plex Mono 13px/24px.
- Reserve colour for code and demos: Sky Token #74d4ff, Syntax Pink #fb64b6 and Mint Token #96f7e4 inside editors, Utility Sky #00a6f4 for inline class names.

### Don't
- Do not use pure black for text; headings and navigation are Midnight Ink #030712, with #000000 kept for the filled pill only.
- Do not make the hero bold; the 96px display stays at weight 400 with -4.8px tracking.
- Do not paint marketing sections with brand-coloured bands; the page stays white and Wave Sky #00bcff appears only in the logo and demos.
- Do not use Demo Pink #f6339a for site buttons; it belongs to the in-demo property card.
- Do not separate cards with drop shadows; use a 1px inset ring of Midnight Ink at 5–10% opacity.
- Do not round code windows into pills or soft 24px blobs; windows are 12px and inner panes 8px.
- Do not drop the hatched 40px side gutters and hairline guides; without them the page loses its blueprint frame.

## Elevation

- **Floating Demo Card:** `oklab(0.129999 -0.00404751 -0.027702 / 0.05) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`
- **Album Cover Lift:** `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, header, feature and demo cards
- **Guide Wash** (`#f2f2f3`) — Hatched gutters, guide rules, feature-grid backdrop, version chip
- **Midnight Ink** (`#030712`) — Code editor window frames with traffic-light dots
- **Editor Graphite** (`#1d202a`) — Code panes, terminal panes and active editor tabs

## Imagery

The visuals are the product working: dark code editors with syntax highlighting, and the components that code renders. Feature cards pair a small grayscale isometric line illustration with a live demo on a dotted, faintly tinted stage, such as a property listing with lakeside photos, a banking card in dark mode, a full P3 colour grid, easing curves with coloured dots, and gradient performance bars. Photography appears only inside these demos and the showcase mosaic (album art, house interiors, portraits, real customer sites), cropped into 8px-radius frames. Sponsor and customer logos are flat monochrome Midnight Ink wordmarks. There is no atmospheric illustration and no decorative gradient on the page itself.

## Layout

A full-width white page framed by 40px diagonally hatched gutters on both sides, with content running in a single ruled column between them. Every headline, paragraph and button row sits in its own horizontal lane bounded by 1px Guide Wash hairlines that extend across the whole width, so the page reads like annotated graph paper. The hero is left-aligned: class-name note, 96px two-line headline, 18px lead, then a black pill beside a pill-shaped search field, followed by a split stage of a wide dark code editor at left and its rendered card at right. Below come a four-column sponsor logo wall in hairline cells, a bento grid of white feature cards (responsive design, filters, dark mode, CSS variables, P3 colours, grid, transitions, cascade layers and more) on a tinted backdrop, a full-width two-pane editor with terminal, a dense masonry of showcase screenshots, and a quiet three-column link footer. Sections are left-aligned throughout, roughly 96px apart.

## Similar Brands

- **Vercel** — Shares a white developer-platform page laid out on visible hairline grid lines, with black filled buttons and dark code panels as proof.
- **shadcn/ui** — Uses near-black ink on white, Inter-style neutrals, and live component demos framed in thin-bordered stages instead of illustrations.
- **Next.js** — Same black-on-white framework marketing with oversized, tightly tracked sans headlines, black primary buttons and code snippets up front.
