---
id: "emil-kowalski"
name: "Emil Kowalski"
theme: "light"
category: "fintech"
tags: ["emil-kowalski","light","fintech","banking"]
vibe: "typed index card, single graphite pill. Set the whole page at 16px in one narrow column and let warm gray, weight 500 and long silences stand in for a type scale."
liveUrl: "https://emilkowal.ski/"
previewUrl: "https://ui.gradientdeck.com/styles/emil-kowalski"
lastVerified: "2026-11-08"
---

# Emil Kowalski — Style Reference
> typed index card, single graphite pill. Set the whole page at 16px in one narrow column and let warm gray, weight 500 and long silences stand in for a type scale.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Emil Kowalski is a one-column personal index set entirely at 16px on a barely warm Bone Paper #fdfdfc canvas. There is no hero, no imagery and no navigation: a two-line name masthead, then labelled sections (Today, Projects, Writing, Newsletter, More) separated by 128px of empty paper inside a 692px column. Hierarchy comes only from colour and weight: Graphite Ink #21201c at 500 for section labels and the name, Graphite Ink at 400 for list titles, Ash Gray #63635e for every description and paragraph. Inter Variable with the cv01 and ss03 alternates reads calm and exact rather than designed-at; the single filled object on the page is a Graphite Ink 9999px Subscribe pill nested inside a hairline-ringed pill field.

## Colors

| Name | Value | Role |
|------|-------|------|
| Bone Paper | `#fdfdfc` | The single page canvas and the Subscribe label — a hair warmer than white so the page reads as paper, not screen |
| Graphite Ink | `#21201c` | The name, section labels, list titles and the only filled control, the Subscribe pill — a warm near-black that never goes to pure #000 |
| Ash Gray | `#63635e` | Every description line, intro paragraph, the Design Engineer subtitle and underlined inline links — the secondary voice of the page |

## Typography

### Inter Variable — Self-hosted Inter Variable 4.0, exposed by next/font under the alias Sans (optical-size axis, opsz auto), with the cv01 alternate one and ss03 round quotes switched on. It is the only face that renders on the page: every line is 16px, at 400 for reading and 500 for labels, with untouched 0px tracking and 24px line-height (26.4px in the intro paragraphs).
- **Substitute:** Inter, Arial
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500
- **Sizes:** 16px
- **Line height:** 1.00, 1.50, 1.65
- **Letter spacing:** 0px at 16px (normal tracking throughout)
- **OpenType features:** `"cv01", "ss03"`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| subtitle | Inter Variable | 500 | 16px | 1 | 0px |
| body | Inter Variable | 400 | 16px | 1.5 | 0px |
| intro | Inter Variable | 400 | 16px | 1.65 | 0px |
| label | Inter Variable | 500 | 16px | 1.5 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 692px
- **Section gap:** 128px
- **Card padding:** 12px
- **Element gap:** 16px

### Border Radius

- **buttons:** 9999px
- **inputs:** 9999px

## Components

### Name Masthead
**Role:** Page identity in place of a navigation bar

Two stacked lines at the top-left of the 692px column after 64px of top padding: the name in Graphite Ink #21201c 16px/500 at 24px line-height, then Design Engineer in Ash Gray #63635e 16px directly beneath. No logo, links, border or background.

### Section Label
**Role:** Heading for each content group

A single word (Today, Projects, Writing, Newsletter, More) in Graphite Ink #21201c 16px/500 at 24px line-height and 0px tracking, placed 24px above its content and 128px below the previous section. Same size as body text; no uppercase, rule or icon.

### Intro Prose Block
**Role:** Short biographical paragraphs

Ash Gray #63635e Inter 16px/400 at 26.4px line-height, set as short paragraphs with 16px between them inside the 692px column. Names like Linear and Vercel stay in running text with no link colour or bolding.

### Title Description Row
**Role:** One project or article in a list

A two-line text row: the title in Graphite Ink #21201c 16px/400, the one-line summary in Ash Gray #63635e 16px/400 below, both at 24px line-height. 12px padding around the row, 16px gap between rows, no bullets, dates, thumbnails, borders or arrows.

### Pill Email Field
**Role:** Newsletter signup form

A 9999px pill form on Bone Paper #fdfdfc with no border, outlined by the 1px rgba(0,0,0,0.08) ring and a 0 2px 2px rgba(0,0,0,0.04) shadow. Inside, a transparent 48px-high input with 0 14px padding in 16px/400 Graphite Ink, placeholder Enter your email, and the Subscribe pill flush right.

### Graphite Pill Button
**Role:** The page's only filled control

Graphite Ink #21201c fill, Bone Paper #fdfdfc label Subscribe in 16px/500 at 24px line-height, 9999px radius, 0 14px padding and a 38px height, sitting inside the email pill. No border, no shadow, no icon.

### Underlined Inline Link
**Role:** Links inside running sentences

Ash Gray #63635e 16px/400 text identical to its sentence, distinguished only by a light underline. Colour, background and decoration colour ease over 0.15s cubic-bezier(0.4, 0, 0.2, 1) on hover; no accent colour.

### Closing Note Block
**Role:** End of page in place of a footer

A final More section: a Graphite Ink 16px/500 label, then one Ash Gray #63635e 16px/400 sentence pointing to Twitter and GitHub as underlined inline links. No columns, copyright line, divider or background change.

## Do's and Don'ts

### Do
- Use Bone Paper #fdfdfc as the one and only background, from the masthead to the last line.
- Set every piece of text at 16px in Inter Variable with "cv01" and "ss03" on and normal 0px tracking.
- Keep hierarchy to colour and weight: Graphite Ink #21201c 500 for labels, Graphite Ink 400 for titles, Ash Gray #63635e 400 for descriptions.
- Hold all content in a single left-aligned 692px column and leave 128px between sections.
- Pair each list title with its one-line Ash Gray description directly underneath at 24px line-height, with no bullets, dates or arrows.
- Reserve Graphite Ink fills for one control: the 38px-high 9999px Subscribe pill with 0 14px padding and 16px/500 Bone Paper text.
- Give the email field a 9999px radius and the 1px rgba(0,0,0,0.08) ring plus 0 2px 2px rgba(0,0,0,0.04) shadow instead of a border.

### Don't
- Do not add a display size or hero headline; the largest text on the page is 16px.
- Do not use bold 600-700 weights for section labels; 500 against 400 is the whole contrast.
- Do not use pure black or pure white; keep Graphite Ink #21201c on Bone Paper #fdfdfc.
- Do not wrap projects or articles in cards, borders or thumbnails; they are plain two-line text rows.
- Do not introduce an accent colour for links; inline links stay Ash Gray and are marked only by an underline.
- Do not add a navigation bar, logo or footer columns; the name masthead and a closing More sentence frame the page.
- Do not widen the column past 692px on large screens; it stays a narrow measure with empty space to the right.

## Elevation

- **Newsletter Field Ring:** `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px 0px`

## Surfaces

- **Bone Paper** (`#fdfdfc`) — The entire page canvas, including inside the newsletter field.
- **Graphite Ink** (`#21201c`) — The Subscribe pill, the only filled surface on the page.

## Imagery

There is no imagery on the page: no photographs, illustrations, screenshots, icons, avatars or logo mark. The visual content is entirely typographic, and the only non-text shapes are the Graphite Ink Subscribe pill and the hairline-ringed pill field it sits in. Underlines on the two inline links (Twitter, GitHub) are the last graphic detail. When applying this style, resist adding thumbnails to project or writing rows; the lack of pictures is the signature, and any visual proof of the work (Sonner, Vaul, animation courses) lives on the linked pages, not on the index.

## Layout

A single narrow column, 692px wide, centred in the viewport but left-aligned inside itself, so on a 1600px screen the text starts at x 478 and leaves a wide empty field to the right. The page opens with 64px of top padding and a two-line masthead (name, then Design Engineer) with no navigation. Below it come five labelled sections, Today, Projects, Writing, Newsletter and More, each separated by 128px of empty canvas. Inside a section the 16px/500 label sits 24px above its content; Projects and Writing are vertical stacks of two-line rows with 12px padding and 16px gaps, about 88px per item. Today is two short Ash Gray paragraphs at 26.4px line-height. The page ends on a one-sentence More block rather than a footer. Density is spacious overall but each row is tight.

## Similar Brands

- **Paco Coursey** — Same single narrow column of plain two-line project and writing rows, with gray secondary text and no imagery.
- **Lee Robinson** — Uses a text-only personal index on a light canvas, where body-sized labels and gray descriptions replace any hero.
- **Rauno Freiberg** — Shares the design-engineer personal site built from small uniform type, generous empty space and almost no colour.
