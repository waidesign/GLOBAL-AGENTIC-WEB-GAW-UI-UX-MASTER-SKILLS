---
id: "basement-studio"
name: "Basement Studio"
theme: "dark"
category: "creative-studio"
tags: ["basement-studio","dark","creative-studio","agency"]
vibe: "arcade glow in a concrete bunker. Build a pitch-black, hairline-ruled canvas where heavy grey Geist headlines do the shouting and one hot orange signal marks what is live."
liveUrl: "https://basement.studio/"
previewUrl: "https://ui.gradientdeck.com/styles/basement-studio"
lastVerified: "2026-11-08"
---

# Basement Studio — Style Reference
> arcade glow in a concrete bunker. Build a pitch-black, hairline-ruled canvas where heavy grey Geist headlines do the shouting and one hot orange signal marks what is live.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Basement Studio is a dev-led creative studio site staged entirely on a Void Black #000000 canvas, opening on a full-screen WebGL render of the studio's own basement before handing over to type. Every word is Geist at a single 600 weight: 87px and 76px headlines at 0.89 line-height and -0.04em tracking stack like poster copy, while 20px body runs at a blunt 1.0 line-height. Colour is almost absent; Bone #e6e6e6 and Concrete Gray #c4c4c4 carry the text, 1px translucent rules draw logo grids and project rows, and Basement Orange #ff4d00 appears only as a pulsing online dot and the active HUMAN toggle. Nothing is rounded except that one pill, and nothing casts a shadow.

## Colors

| Name | Value | Role |
|------|-------|------|
| Void Black | `#000000` | Page canvas, footer, toggle pill fill and media frames — the whole site sits on pure black with no tonal sections |
| Bone | `#e6e6e6` | Hero headline, body copy, navigation links, project titles and tag labels — the default reading colour |
| Concrete Gray | `#c4c4c4` | Section displays, the capabilities statement, client logos and the giant BSMNT.26 footer wordmark |
| Ash Gray | `#757575` | Superscript counters like (26), the Contact and Trusted by labels, and dimmed metadata |
| Charcoal Rule | `#2e2e2e` | Capability tag fills, the toggle pill outline and 20%-white hairlines around logo cells and project media |
| Graphite Rule | `#454545` | Stronger 30%-white grid rules under section headings and between project rows |
| Soot Field | `#1a1a1a` | Newsletter email field fill and the translucent tint behind the fixed 36px navigation bar |
| Basement Orange | `#ff4d00` | Active HUMAN toggle label and the pulsing Online status dot — a single hot signal that reads as a live indicator, never a fill |
| Signal White | `#ffffff` | Typed text inside the email field and the footer submit label |

## Typography

### Geist — The only text face, set almost entirely at weight 600: 87px and 76px displays at 0.89–0.90 line-height with -0.04em tracking, 38px project titles, 20px body at a solid 1.0 line-height, 12px navigation and 9px superscript counters. One heavy weight at every size makes the page read like engineered poster copy rather than an editorial hierarchy.
- **Substitute:** Arial
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 500, 600
- **Sizes:** 9px, 12px, 13px, 20px, 24px, 38px, 76px, 87px
- **Line height:** 0.89, 0.90, 1.00, 1.23, 1.33
- **Letter spacing:** -3.48px at 87px; -3.04px at 76px; -1.52px at 38px; -0.72px at 24px; -0.40px at 20px; normal at 13px and below
- **OpenType features:** `"ss01"`

### Geist Mono — Reserved for the fixed HUMAN / MACHINE mode toggle at the bottom of the viewport: 13px/600 uppercase at 16px line-height with normal tracking. Its single appearance gives the page one terminal-like control against the all-sans layout.
- **Substitute:** SFMono-Regular, Menlo, Consolas, monospace
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 600
- **Sizes:** 13px
- **Line height:** 1.23
- **Letter spacing:** normal at 13px
- **OpenType features:** `"ss01"`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| counter | Geist | 600 | 9px | 1 | 0px |
| nav | Geist | 600 | 12px | 1.33 | 0px |
| tag | Geist | 600 | 13px | 1.23 | 0px |
| toggle | Geist Mono | 600 | 13px | 1.23 | 0px |
| body | Geist | 600 | 20px | 1 | -0.4px |
| eyebrow | Geist | 600 | 24px | 1 | -0.72px |
| project-title | Geist | 600 | 38px | 0.89 | -1.52px |
| section-display | Geist | 600 | 76px | 0.89 | -3.04px |
| hero-display | Geist | 600 | 87px | 0.9 | -3.48px |

## Spacing & Layout

**Base unit:** 4px

**Density:** compact

- **Page max-width:** 1920px
- **Section gap:** 128px
- **Card padding:** 8px
- **Element gap:** 4px

### Border Radius

- **buttons:** 0px
- **cards:** 0px
- **tags:** 0px
- **inputs:** 0px
- **images:** 0px
- **pills:** 9999px

## Components

### Grid-Ruled Top Bar
**Role:** Fixed site navigation

A fixed 36px-high bar over Void Black with a Soot Field #1a1a1a tint and a 1px black grid gradient. The basement. wordmark sits at left, Geist 12px/600 Bone #e6e6e6 links are centred with 9px Ash Gray #757575 superscript counts like (26), and an orange Online dot and Contact Us sit at right. No border radius, no shadow.

### Human Machine Toggle Pill
**Role:** Fixed site-mode switch

A 30px-high Void Black #000000 pill with a 1px Charcoal Rule #2e2e2e border and 9999px radius, fixed at bottom centre. It holds two Geist Mono 13px/600 uppercase links at 16px line-height with 6px 12px padding: the active HUMAN in Basement Orange #ff4d00, the inactive MACHINE in Bone #e6e6e6.

### Online Pulse Badge
**Role:** Live studio status indicator

A 6px Basement Orange #ff4d00 dot with a 9999px radius and a pulse animation, followed by Geist 12px/600 Bone #e6e6e6 Online text and a 9px Ash Gray #757575 superscript count. It is the only animated colour in the nav.

### WebGL Studio Hero Block
**Role:** Full-viewport opening scene

A full 1600x1000px canvas on Void Black #000000 rendering the 3D basement studio, with no headline overlaid. Only the 36px top bar and the bottom-centre 9999px toggle pill sit on top of it; the statement headline begins below the fold.

### Statement Headline Block
**Role:** Positioning headline and intro

A left-aligned Geist 87px/600 headline at 78px line-height and -3.48px tracking in Bone #e6e6e6, spanning about four fifths of the width. It is followed by a Geist 20px/600 paragraph at 20px line-height and -0.4px tracking, about 840px wide, with no button.

### Logo Wall Cell
**Role:** Client proof grid

Eight-column grid of 0px-radius cells, each framed by a 1px rgba(230, 230, 230, 0.2) hairline on Void Black #000000, about 100px high with roughly 12px gaps. A monochrome Concrete Gray #c4c4c4 client logo is centred in each; no fill, no shadow.

### Featured Project Row
**Role:** Case-study listing

A full-width row under a 1px Graphite Rule #454545 line: a 910x512px 0px-radius media frame with a 1px hairline at left, a Geist 20px/600 Concrete Gray description at 20px line-height in the middle, a 38px/600 Bone title at -1.52px tracking right-aligned, and 20px/600 service names pinned to the bottom.

### Capability Column
**Role:** Service description block

One of four indented text columns: a Geist 20px/600 Bone #e6e6e6 title, then 20px/600 Concrete Gray #c4c4c4 copy at 20px line-height and -0.4px tracking, then a wrapping row of Charcoal Tag chips with 4px gaps. No card, border or fill around the column.

### Charcoal Tag
**Role:** Service keyword chip

A flat Charcoal Rule #2e2e2e rectangle with 0px radius and 0 4px padding, 16px high, holding a Geist 13px/600 Bone #e6e6e6 label at 16px line-height and normal tracking. Chips wrap with 4px gaps and carry no border or shadow.

### Contact Display Block
**Role:** Closing call to contact

An indented block starting with a Geist 24px/600 Ash Gray #757575 Contact label at -0.72px tracking, then two Geist 76px/600 lines at 68px line-height and -3.04px tracking: the slogan in Concrete Gray #c4c4c4 and hello@basement.studio in Bone #e6e6e6.

### Soot Email Field
**Role:** Newsletter signup input

A 420px-wide, 24px-high Soot Field #1a1a1a input with a matching 1px #1a1a1a border, 0px radius and 0 4px padding. It uses Geist 20px/600 Signal White #ffffff text at -0.4px tracking, with a text-only Roll Me In arrow button below.

### Wordmark Footer
**Role:** Closing site footer

A Void Black #000000 footer opening with a full-width extended BSMNT.26 SVG wordmark in Concrete Gray #c4c4c4 over a 1px rule. Below it sit Geist 38px/600 Bone navigation links with 9px superscript counts, the newsletter form at left, and 12px/600 social links and copyright at bottom right.

## Do's and Don'ts

### Do
- Use Void Black #000000 as the single page canvas from hero to footer; do not introduce lighter section bands.
- Set every headline in Geist 600 with sub-1.0 leading: 87px/78px at -3.48px tracking for the hero and 76px/68px at -3.04px for section displays.
- Set body copy in Geist 20px/600 at 20px line-height and -0.4px tracking, in Bone #e6e6e6 or Concrete Gray #c4c4c4.
- Reserve Basement Orange #ff4d00 for live-state signals: the pulsing 9999px Online dot and the active HUMAN toggle label.
- Use 1px rgba(230, 230, 230, 0.2) hairlines and 0px corners to draw grids around logo cells and project media.
- Apply Charcoal Rule #2e2e2e tag chips with 0 4px padding, 13px/600 Bone labels and 4px gaps under capability columns.
- Keep the 16px side gutter and run full-width content up to the 1920px max width, with 128px between major sections.

### Don't
- Do not round cards, buttons, inputs or media; everything is 0px except the 9999px HUMAN / MACHINE pill and status dot.
- Do not add drop shadows or glows to panels; separate surfaces with 1px translucent white rules only.
- Do not use Basement Orange #ff4d00 as a button fill, link colour or section background.
- Do not mix in a 400 weight or a second sans family for body text; the system is Geist 600 almost throughout.
- Do not open up line-height on displays or body to 1.4–1.6; keep 0.89 on displays and 1.0 on 20px body.
- Do not use Geist Mono for labels or eyebrows; it belongs only to the 13px uppercase mode toggle.
- Do not fill the hero with a stock photo or gradient; it is a full-viewport real-time WebGL scene.

## Elevation

There is no elevation at all: no box-shadows were measured anywhere. Structure comes from 1px rgba(230, 230, 230, 0.2) hairlines (Charcoal Rule #2e2e2e on black) around logo cells and project media, stronger 0.3-alpha Graphite Rule #454545 lines under headings, and flat Charcoal Rule tag fills. The only layered surface is the fixed 36px nav, a Soot Field #1a1a1a tint over the page with a 1px black grid gradient.

## Surfaces

- **Void Black** (`#000000`) — Page canvas, footer, project rows and the mode toggle pill.
- **Soot Field** (`#1a1a1a`) — Fixed navigation tint and the newsletter email field.
- **Charcoal Rule** (`#2e2e2e`) — Capability tag chips and hairline frames around cells and media.

## Imagery

Imagery is mostly rendered, not photographed. The hero is a real-time WebGL scene (a canvas, so none of it is measured): a dim, warm-lit basement studio with a staircase, an orange-glowing arcade cabinet, a BSMNT SHOT basketball hoop, a neon basement. sign, a wall of flickering monochrome CRT monitors, a seated figure and a dog. Project media are 910x512 rectangles with square corners and 1px hairline frames: a dithered, stippled particle triangle on black for Vercel Ship (also a canvas), a soft-shadowed daylight logo shot, a cloud-sky KidSuper Studios graphic and a pink sunburst MrBeast storefront. Client logos are monochrome Concrete Gray SVGs, one per bordered cell. The footer ends on a giant extended BSMNT.26 SVG wordmark. Icons are few and minimal (a corner arrow, the X glyph); the Contact block sits on a faint diagonal-hatch texture.

## Layout

The page is a single full-bleed black column with a 16px side gutter and a 1920px max width, under a fixed 36px navigation bar (wordmark left, links centred, status and Contact Us right). The first viewport is entirely a WebGL canvas of a 3D basement studio, with only the bottom-centre HUMAN / MACHINE pill floating over it. Below, an 87px left-aligned headline and a 20px intro paragraph lead into an eight-column grid of hairline-bordered client-logo cells. Featured Projects stacks full-width rows: a 76px section title over a 1px rule, then a 910x512 media frame at left, a 20px description in the middle and a 38px right-aligned project title, with the service list pinned to the row's bottom. Capabilities pairs a three-line 76px statement with four indented text columns and tag chips; Contact sets two 76px lines in an indented block. The footer is a full-width BSMNT.26 wordmark, a rule, then the large footer nav and a newsletter form. Rows are dense; sections breathe at about 128px.

## Similar Brands

- **Vercel** — Uses the same Geist type family on a pure black canvas with 1px hairline grids around logo and feature cells.
- **Lusion** — Shares a dark studio site led by a real-time WebGL hero scene rather than photography.
- **Active Theory** — Same dev-led creative studio approach, with immersive 3D canvases as the main showcase and minimal UI chrome over black.
