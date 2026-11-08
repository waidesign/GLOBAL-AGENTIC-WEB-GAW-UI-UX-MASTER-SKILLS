---
id: "agentcard"
name: "Agentcard"
theme: "light"
category: "fintech"
tags: ["agentcard","light","fintech","banking"]
vibe: "cobalt sky raining shopping carts, desktop windows on white. Bookend a white product page with pure #0000ff and build every module as a bevelled, tactile little app window."
liveUrl: "https://agentcard.com/"
previewUrl: "https://ui.gradientdeck.com/styles/agentcard"
lastVerified: "2026-11-08"
---

# Agentcard — Style Reference
> cobalt sky raining shopping carts, desktop windows on white. Bookend a white product page with pure #0000ff and build every module as a bevelled, tactile little app window.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Agentcard is a white product page bookended by two slabs of pure Signal Blue #0000ff: a hero where 3D shopping carts, wallets, coins and gift boxes tumble around an extruded headline, and a footer that ends in a scanlined AGENTCARD wordmark. Between them every module is dressed as a tiny desktop app — Sky Chrome #ccdbff window bars with file names like orchid.case, 10–12px corners, white keycap buttons with inset bevels and hard 7px offset shadows. Helvetica-family display type (Neue Haas Grotesk Display Pro in the stack) at 500 weight with tight negative tracking carries the headings, while Inter handles the 19px leads and 24px testimonial quotes. The effect is playful hardware nostalgia applied to serious payments infrastructure.

## Colors

| Name | Value | Role |
|------|-------|------|
| Signal Blue | `#0000ff` | Hero and footer slabs, primary keycap buttons, active tabs, quote marks and labels — one undiluted RGB blue owns the whole identity |
| Paper | `#ffffff` | Main page canvas, card faces, white keycap buttons and all text on Signal Blue |
| Ink | `#171818` | Headings, body copy, code-window panels and connector lines — a soft near-black rather than pure black |
| Muted Ink | `#5f5f5f` | Lead paragraphs, FAQ intro and inactive tab labels, measured as Ink at 68% opacity |
| Sky Chrome | `#ccdbff` | Window title bars on case cards and the FAQ panel, plus Active pills and Authorizing tags with Signal Blue text |
| Bone Ground | `#f2f1ec` | Body ground and the warm off-white panels behind the integration showcases |
| Cobalt Rim | `#0607be` | 1px border on Signal Blue buttons and the active tab thumb — a darker rim that makes the blue keys read as raised |
| Hairline Gray | `#dedede` | FAQ row dividers, window-bar edges and outlines on white keycap buttons, Ink at 14% opacity |
| Lilac Select | `#ededff` | Selected state of the stacked integration buttons, paired with a 1px Signal Blue border and a pressed inset shadow |
| Sage Tint | `#cfe3c9` | Connected status tags and one of the pastel window-bar tints on connector node cards |
| Butter Tint | `#ece3c0` | Small stored-card chips and a pastel window-bar tint in the customer connector map |
| Rose Tint | `#efcfd3` | Pastel window-bar tint on connector node cards — one of five soft hues that tell customers apart |
| Faint Ink | `#808080` | Small captions, closed-state pill text and secondary metadata, Ink at 55% opacity |
| Track Gray | `#f3f3f3` | Segmented tab track and quiet list rows inside product mockups |

## Typography

### Neue Haas Grotesk Display Pro — Display and UI face: 72px/500 hero at -3.96px tracking, 52px/500 FAQ title, 36px/500 section heads at -1.26px and 36px/400 product titles. Also sets 14px buttons, 12px footer links and 10px labels. No webfont is served, so it renders as Helvetica Neue or Arial from the stack.
- **Substitute:** Helvetica Neue, Helvetica, Arial, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 36px, 52px, 72px, 112px
- **Line height:** 1.00, 1.08, 1.10, 1.20, 1.60
- **Letter spacing:** -3.96px at 72px; -1.04px at 52px; -1.26px at 36px (500) and -1.08px at 36px (400); -0.14px at 14px; +3px on 10px arrow labels

### Inter — Reading and data face: 19px/400 leads at -0.38px, 24px/500 testimonial quotes at -0.72px and 1.2 line-height, 16px/500 customer names, 14px/500 integration buttons and the 10–12px text inside product mockups. Line-heights run loose at 1.35–1.6.
- **Substitute:** Arial
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 19px, 24px
- **Line height:** 1.20, 1.30, 1.35, 1.40, 1.55, 1.60
- **Letter spacing:** -0.72px at 24px; -0.38px at 19px; -0.32px at 16px; -0.28px at 14px; 0 at 10–12px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| pill | Inter | 600 | 10px | 1.35 | 0px |
| caption | Neue Haas Grotesk Display Pro | 400 | 12px | 1.6 | 0px |
| button | Neue Haas Grotesk Display Pro | 400 | 14px | 1.6 | 0px |
| faq-question | Neue Haas Grotesk Display Pro | 500 | 14px | 1.2 | -0.14px |
| body | Inter | 400 | 16px | 1.6 | 0px |
| lead | Inter | 400 | 19px | 1.4 | -0.38px |
| quote | Inter | 500 | 24px | 1.2 | -0.72px |
| product-title | Neue Haas Grotesk Display Pro | 400 | 36px | 1.1 | -1.08px |
| section-heading | Neue Haas Grotesk Display Pro | 500 | 36px | 1.08 | -1.26px |
| heading | Neue Haas Grotesk Display Pro | 500 | 52px | 1.1 | -1.04px |
| display | Neue Haas Grotesk Display Pro | 500 | 72px | 1 | -3.96px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1240px
- **Section gap:** 72px
- **Card padding:** 22px
- **Element gap:** 12px

### Border Radius

- **tags:** 2px
- **badges:** 4px
- **nav:** 6px
- **buttons:** 8px
- **figures:** 10px
- **cards:** 12px
- **panels:** 20px
- **pills:** 9999px

## Components

### Floating Dock Bar
**Role:** Primary site navigation

A bottom-centred glass bar fixed over content: rgba(24, 24, 24, 0.42) fill, 1px rgba(255, 255, 255, 0.22) border, 8px radius and the Glass Dock shadow. Links are 14px/400 Neue Haas at 14px line-height, 9px 14px padding, 6px radius; the active link is a Paper keycap with Signal Blue text.

### Dock Get Started Button
**Role:** Persistent conversion control

A separate Signal Blue #0000ff block beside the dock: 8px radius, 1px Cobalt Rim #0607be border, Paper 14px/400 label with a trailing arrow, sitting in its own glass frame with the same Glass Dock shadow.

### Corner Header Bar
**Role:** Hero-level account actions

A transparent 40px bar inset 20px from the top and 30px from the sides: white agentcard wordmark at left; at right a Sign in button with a 1px rgba(255, 255, 255, 0.549) outline and a Paper Get started button with Signal Blue text, both 8px radius.

### Signal Blue Keycap Button
**Role:** Primary call to action

Signal Blue #0000ff fill, Paper label, 1px Cobalt Rim #0607be border, 8px radius, 0 22px padding and 40px height. Label in Neue Haas 14px/400 at 22.4px line-height. Apply the Blue Keycap shadow: white top inset, dark 2px bottom bevel, blue-tinted 3px 8px drop.

### Paper Keycap Button
**Role:** Stacked selector option

A 56px-high list button with a Paper-to-near-white vertical gradient, 1px rgba(25, 25, 25, 0.161) border, 8px radius, 0 16px padding, a small logo and Inter 14px/500 label at -0.28px. Selected state turns Lilac Select #ededff with a 1px Signal Blue border and a pressed inset shadow.

### Case Window Card
**Role:** Customer testimonial

A 12px-radius Signal Blue frame topped by a Sky Chrome #ccdbff title bar reading orchid.case in 10px type. Inside, a Paper figure with 10px radius and 26px 24px 30px padding: blue quote mark, 14px Muted Ink intro, Inter 24px/500 quote at -0.72px, 2px dotted divider, logo and Signal Blue category.

### Product Showcase Card
**Role:** Product pathway teaser

Paper card with 1px rgba(25, 25, 25, 0.161) border, 20px radius, 12px padding and the hard 7px 7px Offset Product Card shadow. A 12px-radius scanline media stage fills the top; below sit a 36px/400 Neue Haas title at -1.08px, a 19px Inter lead in Muted Ink and a Signal Blue keycap button.

### Scanline Media Stage
**Role:** Product mockup backdrop

A 12px-radius dark panel of blurred blue and green colour fields overlaid with repeating 1px Ink lines every 3px, a radial vignette and 34% Ink side edges. Product mockups such as stacked cards or app-icon keycaps float in the centre.

### Glass Mockup Panel
**Role:** Floating product UI window

A translucent window over media: white gradient from 38% to 12% opacity, 1px rgba(255, 255, 255, 0.6) border, 12px radius, a white 1px top inset and a 0 12px 32px -10px Ink drop. Holds 10px and 12px Inter list rows with 4px-radius card chips and status pills.

### Code Window Panel
**Role:** Integration code sample

Ink #171818 window with a 12px-radius top title bar carrying three gray dots and a 10px file name, a 1px rgba(255, 255, 255, 0.102) divider, then 12px/400 code at 1.55 line-height in rgba(255, 255, 255, 0.878). Drops a 0 16px 36px -14px shadow.

### Status Pill
**Role:** Card state indicator

A 9999px-radius pill with 2px 6px padding in Inter 10px/600 at 13.5px line-height. Active uses Sky Chrome #ccdbff with Signal Blue text; closed uses rgba(28, 28, 28, 0.071) fill with Faint Ink text. No border, no shadow.

### Status Tag
**Role:** Integration progress label

A near-square 2px-radius tag with 2px 6px padding in Inter 10px/400 at 16px line-height: Sage Tint #cfe3c9 with Ink text for Connected, Sky Chrome #ccdbff with Signal Blue text for Authorizing.

### Connector Node Card
**Role:** Customer network map

A Paper card with 1px rgba(23, 23, 23, 0.22) border and 10px radius, topped by a pastel window bar (Sage Tint, Rose Tint, Butter Tint or Sky Chrome gradient). A logo and Inter 16px/500 name at -0.32px sit centred; 1px Ink lines join cards into a map.

### Segmented Tab Control
**Role:** FAQ category switcher

A Track Gray #f3f3f3 track with 8px radius, 1px Hairline Gray border and a soft inset shadow. The active thumb is a Signal Blue keycap with a Paper 14px label; inactive tabs are transparent with 14px/400 Muted Ink text, 40px high.

### FAQ Accordion Row
**Role:** Question list

Rows inside a Paper window card with a Sky Chrome title bar: Neue Haas 14px/500 question at 16.8px line-height and -0.14px tracking, a thin plus glyph at right, separated by 1px rgba(21, 21, 21, 0.141) hairlines. No fills, no row shadow.

### Signal Blue Footer
**Role:** Site footer and sign-off

Full-bleed Signal Blue #0000ff with a Backed by Y Combinator line, wordmark and two-line mission at left, five link columns in Neue Haas 12px/400 at 19.2px line-height in Paper, a merchant marquee between 1px rgba(255, 255, 255, 0.451) rules, and a giant scanlined AGENTCARD wordmark.

## Do's and Don'ts

### Do
- Use Signal Blue #0000ff full-bleed for the hero and footer only, and keep the middle of the page on Paper #ffffff and Bone Ground #f2f1ec.
- Set section headings in Neue Haas Grotesk Display Pro 36px/500 with 1.08 line-height and -1.26px tracking, centred above a 19px/400 Inter lead in Muted Ink #5f5f5f.
- Build primary buttons as Signal Blue keycaps: 8px radius, 1px Cobalt Rim #0607be border, 0 22px padding, 40px height and the Blue Keycap bevel shadow.
- Give every card a window title bar: a Sky Chrome #ccdbff strip with a 10px file name like orchid.case centred and a [*] glyph at right.
- Apply the hard 7px 7px offset shadow and 20px radius to product showcase cards, with a 12px-radius media stage inside 12px padding.
- Reserve Sage Tint, Butter Tint and Rose Tint for small 2px-radius tags and window-bar tints; never for large surfaces.
- Keep motion springy: 0.16s transitions on scale and transform with cubic-bezier(0.22, 1, 0.36, 1), and the 1.55 overshoot curve for pops.

### Don't
- Do not soften Signal Blue #0000ff into a navy or indigo; the identity depends on the raw RGB blue.
- Do not use pill-shaped 9999px buttons; buttons are 8px keycaps and only tiny status pills go fully round.
- Do not set headings in Inter or at bold 700; display type is Neue Haas Grotesk Display Pro at 400 to 500 with negative tracking.
- Do not replace the keycap bevels with flat fills or one soft blurred shadow; the inset top highlight and bottom bevel are the signature.
- Do not place large Signal Blue panels in the middle of the page; blue belongs to the hero, footer, case-card frames, buttons and active states.
- Do not use pure black for text; Ink is #171818 and secondary text is Ink at 68% or 55% opacity.
- Do not drop the floating dock; site navigation is a bottom-centred glass bar with 14px links, not a classic sticky top bar.

## Elevation

- **Blue Keycap:** `rgba(255, 255, 255, 0.34) 0px 1px 0px 0px inset, rgba(23, 24, 24, 0.16) 0px -2px 0px 0px inset, rgba(23, 24, 24, 0.24) 0px 1px 2px 0px, rgba(0, 0, 255, 0.18) 0px 3px 8px 0px`
- **Paper Keycap:** `rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(23, 24, 24, 0.08) 0px -2px 0px 0px inset, rgba(23, 24, 24, 0.22) 0px 1px 2px 0px, rgba(23, 24, 24, 0.1) 0px 3px 8px 0px, rgba(23, 24, 24, 0.1) 0px 3px 0px 0px`
- **Offset Product Card:** `rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(23, 24, 24, 0.06) 0px -2px 0px 0px inset, rgba(23, 24, 24, 0.1) 7px 7px 0px 0px`
- **Floating Window:** `rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(23, 24, 24, 0.06) 0px -2px 0px 0px inset, rgba(23, 24, 24, 0.14) 0px 1px 2px 0px, rgba(23, 24, 24, 0.4) 0px 12px 32px -18px`
- **Glass Dock:** `rgba(255, 255, 255, 0.32) 0px 1px 0px 0px inset, rgba(23, 24, 24, 0.2) 0px 8px 24px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Main canvas between the blue hero and footer, and card faces.
- **Bone Ground** (`#f2f1ec`) — Warm panels behind the integration showcases.
- **Track Gray** (`#f3f3f3`) — Segmented tab tracks and quiet rows in mockups.
- **Sky Chrome** (`#ccdbff`) — Window title bars on case cards and the FAQ panel.
- **Ink** (`#171818`) — Code windows and dark mockup chrome.
- **Signal Blue** (`#0000ff`) — Full-bleed hero, footer and case-card frames.

## Imagery

Imagery is glossy 3D renders of commerce objects (shopping carts, wallets, coin stacks, banknotes, gift boxes, sale tags, payment terminals, a padlock, a safe and a tiny suited agent figure) cut out on transparent backgrounds and floated in the margins at playful angles. Inside cards the media stages are dark, blurred blue-and-green fields overlaid with 1px horizontal scanlines and a vignette, holding product mockups: stacked payment cards, rows of chunky app-icon keycaps, chat bubbles and approval sheets. Interface fragments use realistic data such as card numbers, amounts and merchants. Customer logos appear small and monochrome; there is no photography of people.

## Layout

The page opens with a full-viewport Signal Blue hero: a small white wordmark at top left, Sign in and Get started buttons at top right in a 40px bar inset 30px, and a 3D scene of tumbling commerce objects around an extruded, perspective-tilted headline. Navigation lives in a bottom-centred floating dock that stays on screen the whole scroll. Below, a white canvas runs centred sections with a 36px heading and two-line 19px lead, each followed by a staged composition inside roughly 1200 to 1240px: three tilted case-study windows, a two-column grid of product showcase cards, Bone Ground integration panels pairing a stacked button list with a code window, a node map of customer cards joined by thin lines, and a FAQ window ringed by floating 3D objects. Sections breathe at about 72px; the page closes on a Signal Blue footer with five link columns, a merchant marquee and a giant scanlined wordmark.

## Similar Brands

- **Poolsuite** — Shares the retro desktop-window chrome, with title bars and framed panels used as the main content containers.
- **Raycast** — Uses tactile bevelled keycap controls and glossy 3D objects to make developer infrastructure feel physical.
- **Cash App** — Same pairing of a saturated single-colour full-bleed background with floating glossy 3D money and commerce renders.
