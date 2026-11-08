---
id: "opal"
name: "Opal Electronics"
theme: "dark"
category: "saas"
tags: ["opal","dark","saas","web-app"]
vibe: "prototypes on a glass table, a yellow button in the dark. Run a narrow white manifesto over overhead hardware film, then let Signal Yellow arrive only once."
liveUrl: "https://op.al/"
previewUrl: "https://ui.gradientdeck.com/styles/opal"
lastVerified: "2026-11-08"
---

# Opal Electronics — Style Reference
> prototypes on a glass table, a yellow button in the dark. Run a narrow white manifesto over overhead hardware film, then let Signal Yellow arrive only once.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Opal Electronics opens on a single letter set over film: an overhead 2160p loop of hands arranging cameras, circuit boards and prototypes on a table, with a 400px column of white Die Grotesk C running down its centre at 23.3px. The film falls away into Void #000000, where the last line, See you soon, is the one touch of Signal Yellow #ffdb01 and a pointer-lit dot-matrix wordmark fills the footer. Its other routes split in tone: Jobs stays black with #7c7c7c text and an 80px/700 title, while Composer and Dr. Opal go light, with glossy yellow 3D objects and bolted white instrument panels. Depth is reserved for those panels; the editorial pages are flat.

## Colors

| Name | Value | Role |
|------|-------|------|
| Void | `#000000` | Footer, Jobs canvas, the fade under the table film, and Download button fills on light routes |
| White Sheet | `#ffffff` | Manifesto text on film, Apply button fill, and the Composer and Dr. Opal panels |
| Signal Yellow | `#ffdb01` | The Allow Connection fill and the See you soon sign-off — the site's --color-opal-yellow-digital, used in tiny doses |
| Listing Gray | `#7c7c7c` | Body copy on the black Jobs page, deliberately low in contrast beneath its bright headings |
| Release Gray | `#767676` | Composer release-note items and the opal-grey2 token, used for almost all long-form text on white |
| Studio Gray | `#e7e7e7` | Full-bleed canvas behind the Composer hero, the seamless backdrop for its glossy 3D objects |
| Bevel Gold | `#e5c501` | The 1px edge around the yellow Allow Connection button, which gives the fill a pressed-hardware rim |
| Footer Ash | `#818181` | All rights reserved in the footer and other fine print, the footer-subtle token |
| Notice Olive | `#d5d560` | The 3px rule on Composer release-note notice blocks, a dulled echo of the yellow on white |
| Panel Wash | `#f6f6f6` | Instrument badges and the Copy button on Dr. Opal, one step off the white panel |
| Title Mist | `#f1f1f1` | Role and section headings on the black Jobs route, the job-listing-title token, softer than white |
| Readout Ghost | `#ececec` | The huge idle temperature digits on Dr. Opal, nearly white on white, like an unlit display segment |
| Note Graphite | `#626262` | The 12px macOS requirement line under the Composer hero, one step darker than the release notes |
| Etch Line | `#cccccc` | Composer dividers and the uppercase labels on inactive Dr. Opal instrument badges |
| Paper Hole | `#0d0d0d` | The row of 8px sprocket squares on the Jobs page, barely visible against Void like tractor-feed paper |

## Typography

### Die Grotesk C — The site's one voice: 54.37px/700 the table title, 23.3px/400 manifesto at 1.10 line-height, 80px/700 Jobs title, and 16px text at 1.50. Its tight, slightly quirky grotesque shapes and tiny positive tracking read close to engineered hardware labelling.
- **Substitute:** Inter
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 13px, 14px, 16px, 23.3px, 24px, 32px, 40px, 54.37px, 80px
- **Line height:** 1.00, 1.10, 1.33, 1.50
- **Letter spacing:** 1.09px at 54.37px; 0.47px at 23.3px; 0.48px at 24px; -0.4px at 40px; 0.32px or 0.16px at 16px; 0.12px at 12px

### system-ui — Dr. Opal readouts request -apple-system, BlinkMacSystemFont, SF Pro Display, system-ui, sans-serif. This Windows capture used a local fallback, normally Segoe UI; SF Pro was not verified. Readouts measure 152px/400 with -7.6px tracking and 60px/300. The preview uses the local system face.
- **Substitute:** sans-serif
- **Weights:** 300, 400
- **Sizes:** 60px, 152px
- **Line height:** 1.00, 1.50
- **Letter spacing:** -7.6px at 152px; 0px at 60px

### ui-monospace — Inline kbd and code tokens in the Composer release notes at 16px/500 and 24px line-height. It renders as SF Mono on Apple devices, Consolas on Windows and Liberation Mono on Linux, and appears nowhere outside those technical notes.
- **Substitute:** SFMono-Regular, Menlo, Consolas
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.50
- **Letter spacing:** 0px at 16px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| label | Die Grotesk C | 700 | 12px | 1.5 | 0.12px |
| fine-print | Die Grotesk C | 500 | 14px | 1.5 | -0.14px |
| body | Die Grotesk C | 400 | 16px | 1.5 | 0.16px |
| release-item | Die Grotesk C | 500 | 16px | 1.5 | 0px |
| manifesto | Die Grotesk C | 400 | 23.3px | 1.1 | 0.47px |
| release-lead | Die Grotesk C | 500 | 24px | 1.33 | 0px |
| subheading | Die Grotesk C | 700 | 32px | 1 | 0px |
| panel-title | Die Grotesk C | 700 | 40px | 1 | -0.4px |
| heading | Die Grotesk C | 700 | 54.37px | 1.1 | 1.09px |
| readout-serial | system-ui | 300 | 60px | 1 | 0px |
| display | Die Grotesk C | 700 | 80px | 1 | 0px |
| readout-digits | system-ui | 400 | 152px | 1.5 | -7.6px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

### Border Radius

- **panels:** 0px
- **buttons:** 4px
- **cards:** 8px
- **icons:** 28px
- **pills:** 9999px

## Components

### Difference Wordmark Bar
**Role:** Fixed site header

An 80px fixed transparent bar with 0 20px padding and only a 40px two-line opal electronics wordmark at left, in white fill with mix-blend-mode difference so it inverts over film, black or white. No links, background, border or shadow; every other route lives in the footer.

### Table Film Surface
**Role:** Full-bleed page background

A 2844px-tall edge-to-edge Mux 2160p looping video of the table shot from above, under a noise.avif grain layer, ending in a Void #000000 to transparent gradient over the bottom 75%. It has a 0px radius and no frame; it scrolls with the page, and text sits directly on it.

### Manifesto Text Column
**Role:** Long-form letter on film

A 400px column centred on the film from 20vh: a White Sheet Die Grotesk C 54.37px/700 title at 59.81px line-height and 1.09px tracking, then 23.3px/400 paragraphs at 25.63px line-height that fade in on scroll, closing on one Signal Yellow #ffdb01 line.

### Dot Matrix Wordmark
**Role:** Interactive footer signature

A 1560px by 743px canvas that spells opal in a fine dot grid on Void #000000, almost invisible at rest. Dots glow brighter only around the pointer, leaving a soft lit patch that follows the cursor, with no fill, outline or text behind it.

### Footer Link Row
**Role:** Site routes and legal links

A single row on Void #000000 with 24px 20px padding: the two-line wordmark and Footer Ash #818181 All rights reserved at left, then Support, Terms, Privacy, Jobs and Contact at right in White Sheet Die Grotesk C 16px/400 with 24px line-height and 0.32px tracking.

### Sprocket Paper Bar
**Role:** Jobs page decorative rule

A row of 8px by 8px Paper Hole #0d0d0d squares near the top of the black Jobs route, like tractor-feed computer paper, barely visible on Void #000000 and joined by a 1px dashed line one step lighter. It has no shadow and is its only ornament.

### Apply Reveal Button
**Role:** Primary action on Jobs

A 240px by 60px rectangle with a 0px radius and 1px White Sheet border, Die Grotesk C 24px/400 at 36px line-height and 0.48px tracking. At rest a black inner layer shows white text; on hover the layer clears to a white fill with black text, with no shadow or scale.

### Job Listing Block
**Role:** Role description on Jobs

A Title Mist #f1f1f1 Die Grotesk C 32px/700 heading at 32px line-height, a 16px/700 Focus label, then Listing Gray #7c7c7c 16px/400 body at 24px line-height and 0.16px tracking, with bulleted requirements, in two columns with 64px gaps on Void.

### Composer Hero Stage
**Role:** Light software hero

A full-bleed Studio Gray #e7e7e7 field holding a glossy yellow 3D still life around a dark squircle app icon. Beneath it are 12px/500 Note Graphite #626262 requirements text at 20px line-height and a centred black Download button with 4px radius, 40px high.

### Black Download Button
**Role:** Primary action on light routes

A Void #000000 fill with White Sheet Die Grotesk C 14px/500 at 21px line-height, 40px high with a 4px radius and no border or shadow. It appears on every Composer release and as the Visit Site control for Tadpole firmware.

### Release Note Card
**Role:** Composer changelog entry

A White Sheet panel with an 8px radius, split into a left rail with a 28px-radius squircle icon, a 24px/700 version name, a 14px/500 date at -0.14px tracking and Download; the right rail has a 24px/500 lead and 16px/500 Release Gray #767676 items at 27px indent with 3px dot bullets.

### Bolted Instrument Panel
**Role:** Dr. Opal dashboard tile

A White Sheet card with an 8px radius and a rgba(0,0,0,0.05) 0px 2px 4px shadow, screw dots drawn at its four corners. It holds a grayscale readout such as 152px/400 platform-system digits in Readout Ghost #ececec with a tick-mark slider, or 60px/300 serial numbers, on a finely dotted page field.

### Panel Label Badge
**Role:** Instrument label chip

A Panel Wash #f6f6f6 chip 32px high with an 8px radius and a 1px border at 10% black, holding uppercase Etch Line #cccccc Die Grotesk C 12px/700 at 18px line-height and 0.12px tracking: TEMPERATURE, SERIAL NUMBER, DISCONNECTED or COPY at 48px high.

### Allow Connection Button
**Role:** Dr. Opal yellow primary action

A 180px by 48px Signal Yellow #ffdb01 button with an 8px radius and a 1px Bevel Gold #e5c501 edge, carrying uppercase Die Grotesk C 12px/700 in Void at 18px line-height. It is the only saturated element on the page, in a well with a lit inset shadow.

## Do's and Don'ts

### Do
- Use a straight-down film of real objects as the page surface, with the text column set directly on top of it.
- Keep the manifesto column 400px wide, in White Sheet #ffffff Die Grotesk C 23.3px/400 at 1.10 line-height and 0.47px tracking.
- Reserve Signal Yellow #ffdb01 for a single sign-off line or one primary button on a page.
- Set the Jobs route on Void #000000, with an 80px/700 title and Listing Gray #7c7c7c 16px body at 1.50 line-height.
- Apply mix-blend-mode difference to the 80px fixed header, so its white wordmark inverts over any surface.
- Build Dr. Opal-style panels in White Sheet with an 8px radius and a 0px 2px 4px 5% black shadow, and keep instrument labels 12px/700 uppercase.
- Let hover be a reveal: the Apply button is black with a 1px white border until its inner layer gives way to a white fill.

### Don't
- Do not recreate the old webcam product landing page; this site is now a company letter over a film of its table.
- Do not add a top navigation menu; the header is only a wordmark and routes live in the footer row.
- Do not spread yellow across headings or backgrounds on the editorial routes; it stays a rare signal.
- Do not place the film in a rounded or inset frame; it fills the section edge to edge at full width.
- Do not use shadows on the table or Jobs pages; flat black and film carry them without elevation.
- Do not substitute a heavy weight for 23.3px manifesto text; retain Die Grotesk C 400 and reserve 700 for titles.
- Do not round the 240px by 60px Apply button; it stays 0px, unlike the 4px Download buttons on the light routes.

## Elevation

- **Instrument Panel:** `rgba(0, 0, 0, 0.05) 0px 2px 4px 0px`
- **Lit Firmware Well:** `rgba(255, 255, 255, 0.4) 0px 2px 1px 0px inset, rgba(0, 0, 0, 0.05) 0px 4px 4px 0px`
- **Sunken Readout:** `rgba(0, 0, 0, 0.04) 0px 2px 5px 0px inset`
- **Release Icon:** `rgba(0, 0, 0, 0.3) 0px 2.33px 3.5px 0px`

## Surfaces

- **Void** (`#000000`) — Table fade, footer and the whole Jobs route.
- **White Sheet** (`#ffffff`) — Composer release notes and the Dr. Opal panels.
- **Studio Gray** (`#e7e7e7`) — Full-bleed backdrop for the Composer hero 3D composition.
- **Panel Wash** (`#f6f6f6`) — Instrument badges and Copy button on the Dr. Opal panels.

## Imagery

The defining image is the table: a straight-down film of Opal's own hardware, from webcams and blue-cased boards to resin forms, a jewel-coloured block of tubes and hands reaching in. It is real objects photographed under cool light with a noise.avif grain layer on top, never cropped into cards, and darkened as the page descends. Composer swaps to glossy 3D renders: yellow dials, a clock, a toggle and a dropper around a dark squircle app icon on a dotted gray field. Dr. Opal uses grayscale skeuomorphic drawings of a laptop, a keyboard, a cable and a mounted camera. Release notes carry a small squircle icon and sparing emoji. The footer wordmark is made purely of dots rendered on a canvas.

## Layout

A fixed 80px header holds only a 40px two-line wordmark, inset by a 20px page gutter, with no navigation at all; routes live in the footer. The table page is one 2844px film surface with a 400px text column centred on it from 20vh down, with the imagery working as margins either side, and a gradient to black over the bottom 75%. A footer of about 1173px follows, with a 1560px by 743px dot-matrix wordmark above one row of links. Jobs is a two-column black document, the title at left and an Apply button at right, then 40px and 64px gaps between role listings. Composer is a tall changelog of 26202px beneath a full-bleed yellow hero, and Dr. Opal is a 1380px, one-screen grid of four instrument panels and a tall firmware card. Mobile keeps the editorial column but moves it to the right half of the film.

## Similar Brands

- **Teenage Engineering** — Shares a hardware maker's love of objects shot plainly, engineered type and a single bright signal colour.
- **Nothing** — Uses dot-matrix type as a brand signature for consumer electronics, on stark black and white surfaces.
- **Humane** — Same pattern of a hardware company speaking through a sparse letter-like manifesto and large object imagery.
