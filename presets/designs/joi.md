---
id: "joi"
name: "Joi"
theme: "light"
category: "saas"
tags: ["joi","light","saas","web-app"]
vibe: "felt-tip headlines on a blank notepad. Build one centred column of oversized black semibold statements on pure white, carried by a single phone photograph and one black button."
liveUrl: "https://joi.software/"
previewUrl: "https://ui.gradientdeck.com/styles/joi"
lastVerified: "2026-11-08"
---

# Joi — Style Reference
> felt-tip headlines on a blank notepad. Build one centred column of oversized black semibold statements on pure white, carried by a single phone photograph and one black button.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Joi is a near-monochrome iOS planner page that reads like a single sheet of paper: Paper #ffffff canvas, Planner Black #000000 type, and almost nothing else. Everything sits on one centred axis, from the 96px semibold SF Pro Display headline with small black glyph icons dropped between its words, to the Showcase Mist #fafafa panel where a hand holds the phone, to 78px statements that sharpen from blurred grey to solid black as they scroll in. The only filled colour is the black Download for iOS button; secondary text fades to 30% black, and the footer whispers in Faded Graphite #b3b3b3.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, the floating navigation capsule and button labels on black |
| Planner Black | `#000000` | Headlines, the wordmark, inline headline glyphs and both Download for iOS buttons — pure black is the whole brand, with no hue anywhere in the chrome |
| Showcase Mist | `#fafafa` | The 60px-radius product panel behind the phone photograph — a barely-there step off Paper |
| Faded Graphite | `#b3b3b3` | Footer links and Apple award captions at 30% black — secondary text recedes rather than changes colour |
| Hairline Gray | `#f4f4f4` | The 1px rgba(34, 34, 34, 0.05) outline around the floating navigation capsule |
| Near Black | `#111111` | Small vector glyph fills inside the headline icons and award laurels |

## Typography

### SF Pro Display — Apple's system display face, called through its private .SFNSDisplay-Semibold name at a computed weight of 599. It sets the 96px hero headline and the 78px scroll statements at 1.05 line-height with -1% tracking, plus 20px footer links. Tight, round and confident, it makes the page feel like an iOS screen blown up; on non-Apple machines the stack falls through to the browser's sans-serif (Arial in the capture).
- **Substitute:** SFProDisplay-Semibold, SFUIDisplay-Semibold, -apple-system, BlinkMacSystemFont, Inter, Arial
- **Weights:** 599
- **Sizes:** 16px, 20px, 78px, 96px
- **Line height:** 1.05, 1.10
- **Letter spacing:** -0.96px at 96px; -0.78px at 78px; normal at 16px and 20px

### SF Pro Display Bold — A self-hosted SF Pro Display Bold file loaded under its own family name, so CSS weight 400 renders bold. It carries the interface voice: the 27px Joi Planner label, 18px navigation links at -0.2px, and the 22px and 16px Download for iOS button labels at 1.0 line-height. Use a 700 weight of SF Pro or Inter when substituting.
- **Substitute:** -apple-system, BlinkMacSystemFont, Inter, Arial
- **Licence:** commercial (the font file names it SF Pro Display); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 16px, 18px, 22px, 27px
- **Line height:** 1.00, 1.20
- **Letter spacing:** -0.2px at 18px; normal at 16px, 22px and 27px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | SF Pro Display | 599 | 16px | 1.1 | 0px |
| button-small | SF Pro Display Bold | 400 | 16px | 1 | 0px |
| nav | SF Pro Display Bold | 400 | 18px | 1.2 | -0.2px |
| footer-link | SF Pro Display | 599 | 20px | 1.1 | 0px |
| button | SF Pro Display Bold | 400 | 22px | 1 | 0px |
| product-label | SF Pro Display Bold | 400 | 27px | 1.2 | 0px |
| statement | SF Pro Display | 599 | 78px | 1.05 | -0.78px |
| display | SF Pro Display | 599 | 96px | 1.05 | -0.96px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Section gap:** 120px
- **Card padding:** 80px
- **Element gap:** 10px

### Border Radius

- **buttons:** 20px
- **panels:** 60px
- **device:** 64px
- **screen:** 50px
- **pills:** 9999px

## Components

### Floating Capsule Navigation
**Role:** Top navigation after the hero

A roughly 72px-tall Paper capsule with 9999px radius and a 1px rgba(34, 34, 34, 0.05) outline, inset 40px from the viewport sides with 12px inner padding. Put the Joi wordmark at left, 18px SF Pro Display Bold links at -0.2px tracking at right, then the black download pill. No shadow.

### Planner Black Pill Button
**Role:** Download control inside the navigation

Planner Black #000000 fill, 9999px radius, about 48px tall, with a white Apple glyph and a 16px SF Pro Display Bold Paper label at 16px line-height; sits flush to the right end of the navigation capsule. No border or shadow.

### Download Hero Button
**Role:** Primary app store conversion

Planner Black #000000 fill with a 20px radius, about 72px tall and 270px wide, a leading white Apple glyph and a 22px SF Pro Display Bold Paper label at 22px line-height. Centre it under the headline and repeat it unchanged after the final statement.

### Product Name Label
**Role:** Small product name above the headline

Joi Planner in 27px SF Pro Display Bold at 32.4px line-height in Planner Black #000000, centred about 40px above the display headline. It replaces an eyebrow: no uppercase, no colour, no badge.

### Glyph Display Headline
**Role:** Hero statement with inline icons

SF Pro Display 96px/599 at 100.8px line-height and -0.96px tracking in Planner Black #000000, centred over three lines. Drop a solid black pictogram (calendar tile, lightning bolt, brain) between words at cap height with a 10px gap either side.

### Apple Award Laurel
**Role:** Social proof under the hero button

Two centred laurel-wreath badges about 40px apart: grey wreaths at 30% black around a tiny Featured by Apple caption and a 22px title such as App of the Day, all in Faded Graphite #b3b3b3 tones. No box, border or fill.

### Showcase Mist Phone Panel
**Role:** Product photography stage

A Showcase Mist #fafafa panel with 60px radius, 80px side gutters and around 1450px of height. Centre a cut-out hand holding an iPhone (64px-radius black bezel, 50px-radius Paper screen) that stays in view as the panel scrolls. No border or shadow.

### Scroll Reveal Statement
**Role:** Single-sentence feature explanation

SF Pro Display 78px/599 at 81.9px line-height and -0.78px tracking, centred, five or six lines. Words arrive blurred and grey, then sharpen to Planner Black #000000 as they scroll into view; give each statement its own band with about 120px between them.

### Dot Separated Footer
**Role:** Minimal centred site footer

A centred stack: a pale Joi wordmark at about 10% black, then 20px/599 SF Pro Display links at 22px line-height in Faded Graphite #b3b3b3 separated by bullet characters, then a 16px/599 Crafted in Amsterdam and Lisbon caption at 20% black. No rules or columns.

## Do's and Don'ts

### Do
- Use Paper #ffffff for the whole canvas and Planner Black #000000 for every headline, button fill and icon.
- Set the hero headline in SF Pro Display 96px/599 at 1.05 line-height and -0.96px tracking, centred on three lines.
- Set long statements in SF Pro Display 78px/599 at 1.05 line-height and -0.78px tracking, centred, one sentence per screen.
- Place small solid black glyph icons inline between headline words, sized to the cap height, as part of the sentence.
- Keep the floating navigation as a 9999px Paper capsule with a 1px rgba(34, 34, 34, 0.05) outline, inset 40px from the viewport edges.
- Give the primary Download for iOS button a 20px radius, a Planner Black fill and a 22px Paper label with a leading Apple glyph.
- Hold the product photograph in a Showcase Mist #fafafa panel with 60px corners and 80px side gutters.

### Don't
- Do not introduce a brand hue; the page has no accent colour, and status colours appear only inside the app screenshot.
- Do not set headlines at 700 or 800; the display role is SF Pro Display at its semibold 599 weight.
- Do not left-align sections; every element on the page sits on the centre axis.
- Do not add drop shadows to cards, buttons or the navigation capsule; separate with Showcase Mist #fafafa and the hairline outline instead.
- Do not build grids of feature cards; the story is told by single full-width statements, one after another.
- Do not colour secondary text grey with a new hex; fade Planner Black to 30% (Faded Graphite #b3b3b3) or 20% opacity.
- Do not square off the controls; the navigation download control is a 9999px pill and the hero button keeps its 20px radius.

## Elevation

The page is flat. The only measured shadow is a zero-offset, zero-blur pair on the hero button, a resting state for a hover effect that casts nothing at rest. Depth comes from tonal steps instead: the Showcase Mist #fafafa panel sits one shade off Paper, the navigation capsule is held by a 1px rgba(34, 34, 34, 0.05) hairline, and the phone photograph supplies the only real shading.

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, hero, statements, footer and navigation capsule
- **Showcase Mist** (`#fafafa`) — Rounded 60px panel framing the phone photograph
- **Planner Black** (`#000000`) — Download buttons and the navigation download pill

## Imagery

One photograph does all the visual work: a dark-skinned hand holding an iPhone against a near-white backdrop, cut out so the wrist fades into the Showcase Mist panel. The phone screen shows the real app, a Mon heading with a red dot, a week strip and a dotted-line list of events with small coloured glyphs, so the only colour on the page lives inside the product. Elsewhere imagery is reduced to solid black pictograms set inline in the headline (a dotted calendar tile, a lightning bolt, a brain) and grey laurel wreaths around the Apple award captions. No illustration, gradients or stock photography.

## Layout

A single centred column on a full-bleed white page, with no visible max-width container: the only horizontal structure is the 80px side gutter around the product panel and the 40px inset of the floating navigation capsule. The hero opens with generous empty space above a small Joi Planner label, the three-line 96px headline, one black button and a row of two Apple award laurels. Below it a 1440px-wide Showcase Mist panel with 60px corners runs about 1450px tall, holding a hand-held phone that stays centred as the page scrolls. Then come three 78px statements, each alone in its band with roughly 120px between them, a repeat of the download button, and a tiny centred footer. The navigation capsule appears once the hero scrolls away.

## Similar Brands

- **Apple** — Shares SF Pro Display semibold headlines centred over a white canvas with a single device photograph as the hero object.
- **Things** — Uses a quiet white page around real device screenshots of a calm Apple-only planner, with Apple award recognition as social proof.
