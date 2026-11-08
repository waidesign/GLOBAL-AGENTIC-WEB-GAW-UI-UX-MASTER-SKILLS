---
id: "opencode"
name: "OpenCode"
theme: "light"
category: "developer-tools"
tags: ["opencode","light","developer-tools","api","technical"]
vibe: "man page on bond paper. Set every word in one monospace at reading size, rule the page into a hairline-framed column, and let a single carbon-black button carry the action."
liveUrl: "https://opencode.ai/"
previewUrl: "https://ui.gradientdeck.com/styles/opencode"
lastVerified: "2026-11-08"
---

# OpenCode — Style Reference
> man page on bond paper. Set every word in one monospace at reading size, rule the page into a hairline-framed column, and let a single carbon-black button carry the action.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

OpenCode is a light, all-monospace developer page that reads like a well-kept README. A near-white #fdfcfc canvas holds a single 1080px column framed by 1px hairline rules on both sides and between every section, and a full-bleed terminal video is the only dark mass on the page. IBM Plex Mono (named Berkeley Mono in the stack) does every job: a 38px/700 headline, then section headings set at body size in 16px/700 with 2.0 line-height paragraphs in #646262 graphite. Colour is withheld entirely; carbon #201d1d buttons with 4px corners, [*] bracket markers, underlined install tabs and grey line-art charts carry the identity.

## Colors

| Name | Value | Role |
|------|-------|------|
| Carbon Ink | `#201d1d` | Headlines, nav links, the code half of the wordmark and every filled button — a warm near-black that stands in for a brand hue |
| Paper | `#fdfcfc` | The page canvas, header, section fields and button labels on Carbon Ink — a barely warm off-white |
| Body Graphite | `#646262` | Paragraphs, feature descriptions and command text — softer than Ink so bold labels stand out in the same face |
| Hairline | `#e0dede` | Column frame, section dividers, panel and outline-button borders, measured as rgba(15, 0, 0, 0.12) over Paper |
| Bracket Gray | `#8d8b8b` | The [*] list markers, Fig. captions and the grey open half of the pixel wordmark |
| Muted Gray | `#9a9898` | Inactive install tabs, FAQ plus glyphs, input placeholder, star counts and the legal footer line |
| Input Wash | `#f8f7f7` | Recessed fill of the waitlist email field and the install-command panel body |
| Chart Ash | `#bcbbbb` | Hatched strokes of the GitHub-stars line chart and the darker cells of the contributor dot matrix |
| Matrix Mist | `#dad9d9` | Faint squares in the contributor dot grid — the palest tone, so the figures read as pencil sketches |

## Typography

### IBM Plex Mono — The only face on the page, for headline, navigation, body, buttons, tabs and captions alike. The CSS names Berkeley Mono first but serves only IBM Plex Mono files, so visitors see Plex Mono's slab-footed r and open counters. Hierarchy comes from weight (400, 500, 700) and the 2.0 line-height, not size: everything sits at 14px or 16px except the single 38px/700 headline.
- **Substitute:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace
- **Licence:** open (Open licence (Google Fonts)); free to use and self-host
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 16px, 38px
- **Line height:** 1.00, 1.50, 2.00
- **Letter spacing:** normal at all sizes (0px at 14px, 16px and 38px)

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | IBM Plex Mono | 400 | 14px | 2 | 0px |
| caption-figure | IBM Plex Mono | 500 | 14px | 2 | 0px |
| tab | IBM Plex Mono | 400 | 16px | 1 | 0px |
| nav | IBM Plex Mono | 400 | 16px | 1.5 | 0px |
| body | IBM Plex Mono | 400 | 16px | 2 | 0px |
| body-strong | IBM Plex Mono | 500 | 16px | 2 | 0px |
| button | IBM Plex Mono | 500 | 16px | 1.5 | 0px |
| heading | IBM Plex Mono | 700 | 16px | 1.5 | 0px |
| display | IBM Plex Mono | 700 | 38px | 1.5 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1080px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 12px

### Border Radius

- **buttons:** 4px
- **inputs:** 6px
- **panels:** 6px
- **tabs:** 0px

## Components

### Framed Header Bar
**Role:** Top site navigation inside the column frame

Build an 80px-high Paper #fdfcfc bar inside the 1080px frame with a 1px Hairline #e0dede bottom rule. Place the pixel wordmark at left, 16px/400 IBM Plex Mono Carbon Ink nav links at 24px line-height spaced 32px apart, and the Carbon Download Button at right.

### Carbon Download Button
**Role:** Primary header action with leading icon

Fill Carbon Ink #201d1d with a Paper #fdfcfc 16px/500 IBM Plex Mono label at 24px line-height, 4px radius, 8px 16px 8px 10px padding and 40px height, with a thin download arrow before the label. No border and no shadow.

### Carbon Arrow Button
**Role:** Primary in-content action such as Read docs

Use the Carbon Ink #201d1d fill, Paper #fdfcfc 16px/500 label, 4px radius and 40px height, with 8px 12px 8px 20px padding so a trailing right arrow sits close to the edge. No shadow.

### Hairline Outline Button
**Role:** Secondary action such as Learn about Zen

Use a Paper #fdfcfc fill, Carbon Ink #201d1d 16px/500 label, 1px Hairline #e0dede border, 4px radius, 8px 12px 8px 20px padding and 42px height, with a trailing right arrow. No shadow.

### Install Command Panel
**Role:** Tabbed install snippet in the hero

Wrap a tab strip and a command row in a 1px Hairline #e0dede border with 6px corners (6px 6px 0 0 on the strip, 0 0 6px 6px on the body) and an Input Wash #f8f7f7 body. Set the command in 16px/400 Body Graphite #646262 with the URL path in Carbon Ink, 24px padding and a trailing copy glyph.

### Underline Package Tab
**Role:** Package-manager switcher in the install panel

Transparent 16px/400 IBM Plex Mono labels at 16px line-height with 16px 0 padding and 0px radius, spaced 40px apart. The active tab is Carbon Ink #201d1d with a 2px solid #201d1d bottom border; inactive tabs are Muted Gray #9a9898 with no border.

### Bracket Feature Row
**Role:** Feature list item with a [*] marker

Start with a [*] marker in Bracket Gray #8d8b8b, then a 16px/500 Carbon Ink #201d1d label, then a 16px/400 Body Graphite #646262 description, all at 32px line-height on one line, with 16px between rows. No icons, cards or dividers.

### Body-Size Section Heading
**Role:** Title and lead paragraph opening each section

Set the heading in 16px/700 IBM Plex Mono Carbon Ink #201d1d at 24px line-height, then 16px/400 Body Graphite #646262 copy at 32px line-height after a 12px gap. Never enlarge it; weight alone marks the heading.

### Figure Chart Tile
**Role:** Line-art statistic with a paper-style caption

Draw a monochrome SVG figure (hatched area, dot-matrix squares or vertical bars) in Chart Ash #bcbbbb and Matrix Mist #dad9d9, then caption it in 14px/400 Bracket Gray #8d8b8b at 28px line-height as 'Fig 1.' with the figure itself in 14px/500 Carbon Ink #201d1d.

### Plus FAQ Row
**Role:** Collapsible question in the FAQ list

Use a transparent button with 0px padding and 0px radius: a thin Muted Gray #9a9898 plus glyph at left, then the question in 16px/500 Carbon Ink #201d1d at 32px line-height. Separate rows by 24px; no borders between them.

### Waitlist Email Field
**Role:** Newsletter signup with inset submit

Build a 66px-high Input Wash #f8f7f7 field with a 1px Hairline #e0dede border, 6px radius and 20px padding, placeholder in 16px/400 Muted Gray #9a9898. Inset a Carbon Ink #201d1d Subscribe button at right with 4px radius, 4px 20px padding and 40px height.

### Terminal Demo Video
**Role:** Full-column product video below the hero

Run a 1078px by 606px autoplaying video of the terminal UI flush to both column rules with 0px radius, no border and no shadow; it is the only dark block on the Paper #fdfcfc page.

### Gridded Footer Strip
**Role:** Primary footer links in equal cells

Divide an 89px-high strip into five equal cells with 1px Hairline #e0dede top and vertical rules. Centre 16px/400 Carbon Ink #201d1d links in each cell and show counts in brackets in Muted Gray #9a9898, as in GitHub [215K].

### Legal Link Line
**Role:** Copyright and policy links below the frame

Centre a single row of 16px/400 Muted Gray #9a9898 links at 24px line-height (copyright, Brand, Privacy, Terms, language picker) below the framed column, with roughly 24px gaps and no rule above.

## Do's and Don'ts

### Do
- Use IBM Plex Mono for every element, from the 38px/700 headline to 14px captions, with normal tracking throughout.
- Set section headings at body size, 16px/700 Carbon Ink #201d1d, and let 16px/400 Body Graphite #646262 paragraphs run at 32px line-height.
- Keep the page inside a 1080px column framed by 1px Hairline #e0dede rules on both sides and across every section boundary.
- Use Carbon Ink #201d1d fills with Paper #fdfcfc 16px/500 labels, 4px radius and 8px 12px 8px 20px padding for primary buttons.
- Give sections 80px padding on all sides inside the frame and keep local gaps at 12px or 16px on the 4px grid.
- Use a [*] marker in Bracket Gray #8d8b8b to open each feature and stat line, followed by a 16px/500 Ink label.
- Reserve 6px radii for the install panel and email field; recess both with Input Wash #f8f7f7 and a 1px Hairline border.

### Don't
- Do not introduce a brand hue; the page is entirely warm grays, and the blue --color-accent token in the CSS never renders.
- Do not set headings in a sans-serif or scale section titles up; section headings stay 16px/700 monospace.
- Do not add drop shadows or elevated cards; separate content with 1px Hairline rules only.
- Do not round buttons into pills; keep 4px corners on every button and 0px on tabs.
- Do not use pure black for text or fills; use Carbon Ink #201d1d.
- Do not tighten body leading below 2.0; the 32px line-height on 16px text is what makes the page read like documentation.
- Do not use colourful product imagery; charts are grey line art in Chart Ash #bcbbbb and Matrix Mist #dad9d9.

## Elevation

There is no shadow anywhere on the page. Structure is drawn with 1px Hairline rules (rgba(15, 0, 0, 0.12)) that frame the 1080px column, divide sections and outline panels, while depth is a single tonal step from Paper #fdfcfc down to the Input Wash #f8f7f7 of recessed fields. The only heavy mass is the flush, square-cornered terminal video.

## Surfaces

- **Paper** (`#fdfcfc`) — Page canvas, header and every section field
- **Input Wash** (`#f8f7f7`) — Recessed email field and install-command panel
- **Carbon Ink** (`#201d1d`) — Filled Download, Read docs and Subscribe buttons

## Imagery

Imagery is almost entirely the product itself. The one large visual is an autoplaying video of the OpenCode terminal UI, near-black with grey monospace output and a sidebar, set flush to the column with square corners and no frame. Below it, statistics are illustrated as three grey line-art figures, a hatched area chart, a dot-matrix grid of squares and a field of vertical bars, captioned like a paper ('Fig 1. 215K GitHub Stars'). Model providers appear as a row of small monochrome Carbon Ink logo marks at 24px. Icons are thin single-stroke glyphs (download arrow, right arrow, copy, plus). There is no photography, illustration or colour anywhere.

## Layout

The whole page lives in one 1078px column, centred on the canvas and bounded by 1px Hairline rules on its left and right edges, so it reads like a printed document with visible margins. An 80px header bar carries the pixel wordmark at left and nav plus the Download button at right, closed by a Hairline rule. Inside the frame every section is left-aligned to a 918px text measure with 80px padding and a full-width Hairline divider, never alternating backgrounds. The hero stacks a 38px headline, a two-line graphite paragraph and the tabbed install panel; then a 1078x606 terminal video runs edge to edge of the column. Subsequent sections are plain text blocks: a [*] feature list, stats with three figure charts in a row, a privacy note, an FAQ list, a Zen block with model-provider logos, the waitlist form, and a five-cell footer grid divided by vertical hairlines. Density is comfortable: few elements, long line-heights, generous vertical space.

## Similar Brands

- **SST** — Same team (Anomaly) and the same monospace-first, text-led developer page with restrained gray styling.
- **Berkeley Graphics** — Uses a single monospace face for every element on a light canvas, with ruled, document-like page structure.
- **terminal.shop** — Shares the all-monospace, terminal-native presentation where the product UI itself is the hero image.
