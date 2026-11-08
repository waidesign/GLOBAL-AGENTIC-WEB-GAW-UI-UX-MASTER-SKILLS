---
id: "hifi"
name: "HIFI"
theme: "dark"
category: "developer-tools"
tags: ["hifi","dark","developer-tools","api","technical"]
vibe: "lemon cursor in a blacked-out terminal. Build flat black planes ruled by white hairlines, where a single acid-lemon fill marks every action and the first words of every headline."
liveUrl: "https://www.hifi.com/"
previewUrl: "https://ui.gradientdeck.com/styles/hifi"
lastVerified: "2026-11-08"
---

# HIFI — Style Reference
> lemon cursor in a blacked-out terminal. Build flat black planes ruled by white hairlines, where a single acid-lemon fill marks every action and the first words of every headline.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

HIFI is a black-canvas money-infrastructure site that reads like a terminal at 2 a.m.: Void Black #000000 sections, 1px white-at-20% hairlines and square corners everywhere, with Lemon Signal #f2ff66 as the only colour that isn't grey. Lemon lights the primary buttons, the opening word of the hero and section headlines, and the small sparkle nodes in its line diagrams. Rhithmic Sans carries the headlines at a single 400 weight with zero tracking, so 80px statements stay calm and engineered; Space Grotesk handles reading copy in 70% white, and Space Mono bold sets navigation, footer links and JSON payloads, giving the page its developer-console register. Warm red-and-amber motion-blur photography bleeds behind two middle sections as the only atmosphere.

## Colors

| Name | Value | Role |
|------|-------|------|
| Void Black | `#000000` | Page canvas, hero and every content section, capability grid cells and Get Started label text |
| Lemon Signal | `#f2ff66` | Primary button fills, the announcement strip, first words of headlines and diagram nodes — an acid highlight that reads as a live cursor on black |
| Paper White | `#ffffff` | Headlines after the lemon lead-in, card titles, outline-button borders, footer links and line diagrams |
| Mist Copy | `#b2b2b2` | White-at-70% reading copy and the header navigation labels — body text never goes full white |
| Hairline Graphite | `#333333` | The 1px white-at-20% rules that frame grids, panels and card edges on black |
| Smoked Glass | `#121212` | Product cards over photography: white at 7% laid on the image, with a 1px top glint |
| Ash Label | `#808080` | White-at-50% Space Mono: JSON values, footer column heads and secondary metadata |
| Aubergine Ink | `#191314` | Text and chip fills sitting on Lemon Signal: the Book Demo label and the Read More tag — a warm near-black instead of pure black |
| Footer Obsidian | `#020202` | Footer field and the top stop of the fading header gradient, a hair off pure black |
| Dusk Gray | `#7d7979` | Small legal and helper copy where even 50% white would be too loud |
| Lifted Charcoal | `#1a1a1a` | White-at-10% grid backings and quiet raised strips behind ruled content |

## Typography

### Rhithmic Sans — Display and section headlines at one weight only. The 80px/400 hero and 40px/400 section heads sit at 0.96 and 1.12 line-height with no tracking, letting a wide, open geometric grotesk feel engineered rather than loud; 24px/400 titles the compliance panels. Headlines animate in character by character.
- **Substitute:** Space Grotesk, Arial, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400
- **Sizes:** 24px, 40px, 80px
- **Line height:** 0.96, 1.12, 1.18

### Space Grotesk — Reading copy, card titles, uppercase card labels and block-button labels. Body runs 16px/400 at a loose 1.63 line-height in Mist Copy; 14px/600 uppercase labels head the capability grid, and 12px/600 uppercase sets the Get Started and outline buttons. Its quirky terminals keep the copy faintly technical. The site ships the variable file (300–700), whose default instance is named Space Grotesk Light.
- **Substitute:** Arial, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 600
- **Sizes:** 12px, 14px, 16px, 20px
- **Line height:** 1.20, 1.45, 1.50, 1.63

### Space Mono — The developer-console layer: 13px/700 uppercase header navigation, 12px/700 uppercase Book Demo and Read More labels, 14px/700 footer links, 14px/400 uppercase footer column heads and legal copy, and 11px/400 JSON payloads at 1.45. Only a regular file ships, so the bold is the browser's synthesized weight.
- **Substitute:** Courier New, monospace
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 700
- **Sizes:** 11px, 12px, 13px, 14px, 16px
- **Line height:** 1.00, 1.20, 1.35, 1.45, 1.55

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| code | Space Mono | 400 | 11px | 1.45 | 0px |
| button | Space Grotesk | 600 | 12px | 1.2 | 0px |
| button-mono | Space Mono | 700 | 12px | 1.2 | 0px |
| nav | Space Mono | 700 | 13px | 1 | 0px |
| label | Space Grotesk | 600 | 14px | 1.45 | 0px |
| footer-link | Space Mono | 700 | 14px | 1.35 | 0px |
| body | Space Grotesk | 400 | 16px | 1.63 | 0px |
| card-title | Space Grotesk | 400 | 20px | 1.2 | 0px |
| subheading | Rhithmic Sans | 400 | 24px | 1.18 | 0px |
| heading | Rhithmic Sans | 400 | 40px | 1.12 | 0px |
| display | Rhithmic Sans | 400 | 80px | 0.96 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1920px
- **Section gap:** 128px
- **Card padding:** 32px
- **Element gap:** 12px

### Border Radius

- **buttons:** 0px
- **cards:** 0px
- **panels:** 0px
- **images:** 0px
- **badges:** 9999px

## Components

### Lemon Announcement Strip
**Role:** Site-wide news banner

A 40px full-width Lemon Signal #f2ff66 bar with a centered megaphone icon, Space Grotesk 14px/600 Aubergine Ink #191314 text, a 28px-high Aubergine Ink Read More tag with Lemon Signal Space Mono 12px/700 uppercase label and 0px 12px padding, and a close cross at the right edge.

### Fading Header Bar
**Role:** Fixed top navigation

A fixed header whose fill is linear-gradient(rgb(2, 2, 2) 0%, rgba(2, 2, 2, 0.86) 58%, rgba(2, 2, 2, 0) 100%), no border, no shadow. White HIFI wordmark at left, centered Space Mono 13px/700 uppercase links in Mist Copy #b2b2b2 at 13px line-height with 4.8px 0px padding and small chevrons, and the Lemon Demo Button at right.

### Lemon Demo Button
**Role:** Header conversion control

A 32px-high Lemon Signal #f2ff66 rectangle with a 1px #f2ff66 border, 0px radius and 0px 16px padding; Aubergine Ink #191314 Space Mono 12px/700 uppercase label at 14.4px line-height. No shadow.

### Lemon Block Button
**Role:** Primary page call to action

A 42px-high Lemon Signal #f2ff66 block with a 1px #f2ff66 border, 0px radius and 24px horizontal padding; Void Black #000000 label in Space Grotesk 12px/600 uppercase at 14.4px line-height. Flat, no shadow; colour transitions run 0.18s.

### White Outline Button
**Role:** Secondary call to action

Transparent fill, 1px solid #ffffff border, 0px radius, 42px high with 24px horizontal padding and a Paper White Space Grotesk 12px/600 uppercase label. The footer Talk to Us variant uses Space Mono 12px/700 uppercase with 16px 32px padding at 40px high.

### Scan-line Display Hero
**Role:** Opening statement

A 1000px Void Black screen with the copy block bottom-left at a 64px gutter: Rhithmic Sans 80px/400 at 76.8px line-height and 0px tracking, first line Lemon Signal and second Paper White, then a Mist Copy Space Grotesk 16px/400 paragraph at 26px line-height, then one Lemon Block Button. White dash lines stream across the right.

### Atomic Capability Grid
**Role:** Four-pillar platform overview

Four equal Void Black cells in one frame ruled by 1px rgba(255, 255, 255, 0.2) borders, 0px radius, 20px padding. Each cell stacks a Paper White Space Grotesk 14px/600 uppercase label, a centered 1px white line diagram with lemon sparkle nodes, and a Mist Copy 16px/400 description at 26px line-height at the bottom.

### Smoked Product Card
**Role:** Product links over photography

A four-up row of Smoked Glass rgba(255, 255, 255, 0.071) cards with 32px padding, 0px radius, 1px rgba(255, 255, 255, 0.2) right and bottom rules and an inset rgba(255, 255, 255, 0.08) 0px 1px 0px top glint. Outline icon, then a Paper White Space Grotesk 20px/400 title at 24px line-height and a 14px/400 muted subtitle.

### JSON Payload Panel
**Role:** API request and response showcase

Square, hairline-framed boxes on Void Black that overlap in a stair-step. A Space Mono 11px/400 header like POST /settlement-rules, then a JSON body at 15.95px line-height with Paper White keys and Ash Label #808080 values; one pixelated block glyph as decoration. No fill, no radius, no shadow.

### Bracket Tree List
**Role:** Use-case bullet list

A vertical 1px white-at-20% spine with short horizontal branches to each item; each row has a 10px square rgba(255, 255, 255, 0.298) marker and a Mist Copy Space Grotesk 16px/400 line, rows spaced about 48px apart. Sits right of a Lemon Signal 40px Rhithmic headline and a White Outline Button.

### Compliance Feature Panel
**Role:** Trust and security proof blocks

Half-width panels of rgba(0, 0, 0, 0.851) with a 1px rgba(255, 255, 255, 0.2) border, 0px radius and 32px 56px 32px 40px padding, staggered left-right like a checkerboard over blurred amber photography. A 192px white-outline circle diagram at left, Rhithmic Sans 24px/400 Paper White title and Mist Copy 16px/400 body at right.

### Monospace Sitemap Footer
**Role:** Site footer and legal

A Footer Obsidian #020202 field with a giant white HIFI wordmark bottom-left and a three-column sitemap right: Space Mono 14px/400 uppercase Ash Label heads, Space Mono 14px/700 Paper White links at 18.9px line-height, a Lemon Signal 9999px status dot, and Space Mono 14px/400 Dusk Gray legal copy at 1.55, split by 1px hairlines.

## Do's and Don'ts

### Do
- Use Void Black #000000 for every section canvas and Footer Obsidian #020202 for the footer; the page never turns light.
- Set headlines in Rhithmic Sans 400 only: 80px/0.96 for the hero, 40px/1.12 for sections, 24px/1.18 for panel titles, all at 0px tracking.
- Apply Lemon Signal #f2ff66 to the first word or line of a headline and keep the rest in Paper White #ffffff.
- Keep every button, card, panel and image at a 0px radius; reserve 9999px for the tiny status dot.
- Use Lemon Signal #f2ff66 fills with a 1px #f2ff66 border for primary actions, and transparent fills with a 1px #ffffff border for secondary ones.
- Set reading copy in Space Grotesk 16px/400 at 26px line-height in Mist Copy #b2b2b2.
- Build grids as one ruled frame: cells share 1px rgba(255, 255, 255, 0.2) borders with 20px–32px padding inside.

### Don't
- Do not round corners to soften cards or buttons; HIFI is square at 0px throughout.
- Do not add drop shadows or glows; separate surfaces with 1px white-at-20% hairlines and translucent white fills.
- Do not bold the Rhithmic Sans headlines; every display size is weight 400 with zero tracking.
- Do not introduce a second accent hue; Lemon Signal #f2ff66 is the only chromatic colour in the interface.
- Do not set body copy in pure #ffffff; reading text is Mist Copy #b2b2b2 and small print drops to Dusk Gray #7d7979.
- Do not use pure black text on Lemon Signal chips in the header; the Book Demo and Read More treatments use Aubergine Ink #191314.
- Do not set navigation or footer links in Space Grotesk; they are Space Mono 700 (13px uppercase in the header, 14px in the footer).

## Elevation

- **Smoked Card Glint:** `rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset`

## Surfaces

- **Void Black** (`#000000`) — Page canvas, hero, capability grid and compliance sections.
- **Footer Obsidian** (`#020202`) — Footer field and the top of the fading header.
- **Smoked Glass** (`#121212`) — Product cards laid over the motion-blur photograph.
- **Lifted Charcoal** (`#1a1a1a`) — Translucent backing strips behind ruled grids.
- **Lemon Signal** (`#f2ff66`) — Announcement strip, primary buttons and status dot.

## Imagery

Almost no conventional imagery. The hero is a looping video of white horizontal dash lines on black, like data packets crossing a wire, and faint columns of block characters flicker behind headlines. Two sections sit on wide, heavily motion-blurred photographs graded deep red, rust and amber that read as city lights streaking at speed; content floats over them in translucent black or white-at-7% panels. Everything else is drawn: thin 1px white line diagrams (orbits, connectors, an S-curve route) with small circular nodes containing lemon sparkle or currency glyphs, outline product icons, and JSON payloads typeset as image-like code panels. All imagery is square-cornered and full-bleed or framed by hairlines.

## Layout

A full-bleed black page capped at 1920px with 64px side gutters and roughly 124–128px between major sections. A fixed header fades from Footer Obsidian to transparent over 116px, with a 40px Lemon Signal announcement strip above a wordmark-left, centered-nav, button-right row. The hero is a full 1000px screen with the headline block bottom-left (80px Rhithmic, a 736px-wide paragraph, one Lemon button) and animated white scan-line dashes streaming in from the right. Sections then alternate: a left-aligned headline over a four-column hairline-ruled capability grid; a centered headline floating on red-amber motion-blur photography above a four-up row of smoked product cards and a split code-panel/copy block; a two-column "Run money as code" row with a bracket-tree list; a centered 80px statement; and three compliance panels staggered in a checkerboard across the width. The footer puts a giant HIFI wordmark bottom-left and a dense Space Mono sitemap on the right.

## Similar Brands

- **Vercel** — Uses black planes divided by thin white-alpha hairlines and square-ish grids in place of shadows and cards.
- **Resend** — Same near-monochrome dark developer aesthetic, pairing a calm grotesk with monospace labels and code samples.
- **Modal** — Uses a single acid yellow-green accent against black for actions and highlights across an otherwise greyscale developer site.
