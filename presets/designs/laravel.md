---
id: "laravel"
name: "Laravel"
theme: "light"
category: "saas"
tags: ["laravel","light","saas","web-app"]
vibe: "red ink on blueprint paper. Build quiet white engineering sheets framed by dashed rails, then let one signal red mark every action, marker and wordmark."
liveUrl: "https://laravel.com/"
previewUrl: "https://ui.gradientdeck.com/styles/laravel"
lastVerified: "2026-11-08"
---

# Laravel — Style Reference
> red ink on blueprint paper. Build quiet white engineering sheets framed by dashed rails, then let one signal red mark every action, marker and wordmark.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Laravel is a white-canvas framework site drawn like a technical sheet: a 1280px column bounded by dashed #e5e5e5 rails, with small Laravel Red #f53003 square markers pinned where each section rule meets them. Instrument Sans display lines at weight 400 and -0.05em tracking keep 60px and 72px headlines light, compressed and confident rather than shouted. Soft radial red glows bleed up behind sections, code sits on a pale blush panel in IBM Plex Mono, and the same red carries the wordmark, primary buttons, check icons and bracketed eyebrows. Dark #171717 quote cards and a full-bleed event photo carousel are the only heavy moments before a footer that ends in a giant cropped red wordmark.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, navigation bar, outlined buttons, inputs and light quote cards |
| Ink | `#171717` | Headlines, navigation labels, button text and the dark featured quote cards |
| Laravel Red | `#f53003` | Wordmark, Deploy buttons, check icons, bracket eyebrows and rail markers — one hot red-orange carries every signal on a white sheet |
| Rail Gray | `#e5e5e5` | Dashed column rails, section rules, logo-strip dividers and 1px button outlines |
| Stone Gray | `#737373` | Supporting paragraphs, footer links, testimonial roles and inactive tab labels |
| Graphite | `#525252` | Feature-block body copy that needs a step more contrast than Stone Gray |
| Field Line | `#d4d4d4` | Newsletter input borders and secondary illustration strokes |
| Muted Ash | `#a1a1a1` | Keyboard-shortcut hints like the ⌘K key and lowest-emphasis metadata |
| Smoke Fill | `#f5f5f5` | Stay updated newsletter button and the faint bottom stop of illustration tiles |
| Blush Panel | `#ffeeee` | Code-editor panel fill behind the framework tabs — a 7% red tint that keeps code inside the brand temperature |
| Ember Glow | `radial-gradient(45% 100% at 65% 80%, rgba(245, 48, 3, 0.2), rgba(0, 0, 0, 0))` | Radial red haze rising behind feature splits, testimonials and CTAs — atmosphere around content, never a hard fill |
| Cloud Blue | `#2563eb` | Laravel Cloud layer and route lines in the isometric illustrations, and the blue glow on the scaling status pill |

## Typography

### Instrument Sans — The single voice for display, navigation and body. Headlines stay at weight 400 even at 60px and 72px with -3px and -3.6px tracking (-0.05em), so large statements read compressed and calm; 15px/500 navigation and 14px/500 button labels add just enough weight for controls.
- **Substitute:** ui-sans-serif, system-ui, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 20px, 24px, 36px, 60px, 72px
- **Line height:** 1.00, 1.11, 1.25, 1.33, 1.35, 1.40, 1.43, 1.50, 1.56
- **Letter spacing:** -3.6px at 72px; -3px at 60px; -1.8px at 36px; -0.6px at 24px; -0.5px at 20px; -0.4px at 16px; -0.35px at 14px; normal on body copy
- **OpenType features:** `"ss02", "ss09"`

### IBM Plex Mono — Code in the framework panel at 14px/400 with a 22.75px line-height, plus the uppercase technical labels: the 16px logo-strip caption and the red bracketed [ EVENTS ] eyebrow. It turns marketing sections into annotated engineering drawings.
- **Substitute:** SFMono-Regular, Menlo, Consolas, monospace
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.43, 1.50, 1.63
- **Letter spacing:** normal; -0.35px on the 14px ⌘K key hint
- **OpenType features:** `"ss01", "ss02", "ss03"`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | Instrument Sans | 400 | 12px | 1.33 | 0px |
| code | IBM Plex Mono | 400 | 14px | 1.63 | 0px |
| eyebrow | IBM Plex Mono | 400 | 14px | 1.43 | 0px |
| button-label | Instrument Sans | 500 | 14px | 1.43 | -0.35px |
| nav | Instrument Sans | 500 | 15px | 1.5 | -0.38px |
| body | Instrument Sans | 400 | 16px | 1.5 | 0px |
| lead | Instrument Sans | 400 | 20px | 1.4 | -0.5px |
| card-title | Instrument Sans | 500 | 24px | 1.33 | -0.6px |
| quote | Instrument Sans | 400 | 24px | 1.35 | 0px |
| section-heading | Instrument Sans | 400 | 36px | 1.11 | -1.8px |
| section-display | Instrument Sans | 400 | 60px | 1 | -3px |
| hero-display | Instrument Sans | 400 | 72px | 1 | -3.6px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

### Border Radius

- **buttons:** 8px
- **cards:** 8px
- **inputs:** 6px
- **tags:** 4px
- **images:** 2px
- **code-panel:** 20px
- **pills:** 9999px
- **event-buttons:** 0px

## Components

### Dashed Rail Frame
**Role:** Page-wide drafting grid

Bound the 1280px column with 1px dashed Rail Gray #e5e5e5 vertical rails, split sections with solid 1px #e5e5e5 horizontal rules, and pin a tiny solid Laravel Red #f53003 square at every rail-rule intersection. No fills, no shadow.

### Announcement Strip
**Role:** Top-of-page notice

A 44px bar washed with a faint left-to-right blush-to-white gradient. Centre a Laravel Red 14px/500 Instrument Sans notice at 20px line-height beside a Read Now tag: Paper fill, 1px #e5e5e5 border, 4px radius, 4px 10px padding, 12px/400 Ink at -0.3px.

### Site Navigation Bar
**Role:** Top-level site navigation

A 64px Paper bar with a 1px Rail Gray bottom rule, the red Laravel wordmark at left and 15px/500 Ink links at 22.5px line-height and -0.38px tracking with red chevrons, 0 12px padding and 8px hover radius. At right: GitHub count, then 32px outlined Sign in and Search docs buttons.

### Laravel Red Button
**Role:** Primary conversion action

Fill #f53003 with Paper text, 8px radius, 48px height and 0 24px padding; label Instrument Sans 18px/400 at 28px line-height and -0.45px tracking plus a → arrow. The compact version is 40px, 0 16px, 14px/500 at -0.35px. Add only the hairline lift shadow.

### Outlined Paper Button
**Role:** Secondary action and section link

Paper fill, 1px Rail Gray #e5e5e5 border, 8px radius, Ink text and the hairline lift shadow. Hero size is 48px with 0 24px padding and 18px/400 type; in feature blocks use 32px height, 0 12px padding and 14px/500 at -0.35px with a red ↗ arrow.

### Ticket Square Button
**Role:** Event conversion over photography

A square-cornered 0px-radius Laravel Red #f53003 block, 48px high with 0 24px padding, Paper 14px/500 uppercase label at -0.35px tracking and a ↗ arrow. Use it only on top of the event photo carousel.

### Mono Logo Strip
**Role:** Customer trust row

A 128px row between 1px Rail Gray rules: a first cell with 40px padding holding an IBM Plex Mono 16px/400 uppercase two-line caption in Ink, then equal logo cells divided by 1px #e5e5e5 vertical lines, each with one centred brand mark.

### Bracket Mono Eyebrow
**Role:** Section category label

IBM Plex Mono 14px/400 uppercase at 20px line-height in Laravel Red #f53003, wrapped in spaced square brackets like [ EVENTS ]. Place it 16px above a 60px/400 Ink display heading; no background or border.

### Inline Toggle Headline
**Role:** Centered statement with a live switch

A centred Instrument Sans 60px/400 Ink headline at 60px line-height and -3px tracking, with a Laravel Red 9999px toggle switch carrying a white knob set inline between words and the Ember Toggle Glow shadow (red 44px and 8px glows).

### Feature Split Block
**Role:** Two-column product explainer

Two columns divided by a 1px Rail Gray vertical rule. Each holds a 24px/500 Ink heading at -0.6px, 16px/400 Stone Gray copy at 24px line-height, red-check bullet items at 16px/400 -0.4px, a 32px Outlined Paper Button, then a product visual over an Ember Glow haze.

### Code Tab Panel
**Role:** Framework code showcase

A Blush Panel #ffeeee surface with a 20px top-left radius only, 1px Paper top and left border and 8px inset. File tabs carry the red Laravel glyph; code is IBM Plex Mono 14px/400 at 22.75px line-height in VS Code-light syntax colours. Above sits a 9999px tab strip with a raised white active tab.

### Quote Card
**Role:** Customer testimonial

A translucent rgba(255, 255, 255, 0.6) card over the ember haze with a 1px Paper border, 8px radius, 24px 20px 20px padding and the Quote Card Lift shadow. Quote in 16px/400 Ink at 24px line-height; name 14px/500 Ink, role 14px/400 Stone Gray, 40px avatar with 2px radius.

### Featured Ink Quote Card
**Role:** Highlighted testimonial

An Ink #171717 card spanning two grid rows, 8px radius, 24px padding and the Featured Quote Lift shadow. Put a white company logo at top, the quote in Instrument Sans 24px/400 Paper at 32.4px line-height, and the author pinned to the bottom.

### Event Photo Carousel
**Role:** Full-bleed Laracon promotion

A 540px full-bleed photo slider: the active slide is full colour, neighbours are grayscale, with a linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent 50%) scrim. Set the event in 24px/700 uppercase Paper, dates and city in IBM Plex Mono 16px uppercase, Ticket Square Button at right.

### Newsletter Field
**Role:** Footer email signup

Paper inputs with a 1px Field Line #d4d4d4 border, 6px radius, 10px 12px padding, 14px/400 type and the hairline lift shadow, in a two-up name row above a full-width email field. Submit is a full-width Smoke Fill #f5f5f5 6px-radius button with 14px Ink label.

### Wordmark Footer
**Role:** Site footer and sign-off

A Laravel Red 20px/500 statement at 28px line-height beside four link columns: 16px/500 Ink headings, 16px/400 Stone Gray links on a 24px rhythm. Close the page with a giant Laravel Red wordmark spanning the full column and cropped by the page bottom edge.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the whole page canvas and frame the 1280px content column with 1px dashed Rail Gray #e5e5e5 rails.
- Set headlines in Instrument Sans 400 at 72px/72px or 60px/60px with -3.6px or -3px tracking (-0.05em).
- Reserve Laravel Red #f53003 for the primary Deploy button, check icons, the wordmark, bracket eyebrows and section-corner markers.
- Apply 8px radius to buttons and cards, 6px to inputs, and 9999px only to the toggle and tab-strip pills.
- Pair each filled Laravel Red button with an outlined Paper button: 1px #e5e5e5 border, Ink text and a small red ↗ arrow.
- Set code and technical labels in IBM Plex Mono 14px/400 at 22.75px line-height, with eyebrows uppercase and wrapped in [ brackets ].
- Keep section rhythm on the 4px base: 80px section gaps, 24px card padding and 8px element gaps.

### Don't
- Do not set display headlines in 600-700 weights; keep Instrument Sans 400 with tight negative tracking.
- Do not flood sections with solid Laravel Red #f53003; use the Ember Glow radial haze for warmth behind content.
- Do not round primary buttons into pills; they use 8px radius, and the ticket button over photography is square.
- Do not use heavy drop shadows on controls; use the 0 1px 2px rgba(0, 0, 0, 0.06) hairline lift.
- Do not let Cloud Blue #2563eb become an action colour; it belongs to the Laravel Cloud illustration layer only.
- Do not put card borders on feature splits; separate them with 1px Rail Gray #e5e5e5 rules and the dashed rails.
- Do not replace IBM Plex Mono labels with Instrument Sans uppercase; the mono layer is the engineering annotation.

## Elevation

- **Control Hairline Lift:** `rgba(0, 0, 0, 0.03) 0px 0px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px`
- **Quote Card Lift:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- **Featured Quote Lift:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Ember Toggle Glow:** `rgba(0, 0, 0, 0.25) 0px 0px 4px 0px inset, rgba(245, 48, 3, 0.5) 0px 0px 44px 0px, rgba(245, 48, 3, 0.5) 0px 0px 8px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, navigation, quote cards, buttons and inputs
- **Blush Panel** (`#ffeeee`) — Code-editor panel behind the framework file tabs
- **Smoke Fill** (`#f5f5f5`) — Newsletter submit button and pale illustration tiles
- **Ink** (`#171717`) — Featured dark testimonial cards in the quote grid
- **Laravel Red** (`#f53003`) — Primary buttons, inline toggle and the footer wordmark

## Imagery

Imagery is mostly drawn product: isometric illustrations of stacked Laravel, Nightwatch and Cloud layers in red, black and Cloud Blue, connected by thin red, blue and black route lines with pill-shaped domain labels floating on a faint diagonal grid. Product UI appears as cropped, flat dashboards and file-tab stacks on white with hairline borders, plus a VS Code-light code panel. Photography is limited to 40px square customer avatars with 2px corners and the Laracon event carousel, where the active slide is full colour and neighbours are desaturated to grayscale under a bottom-up 50% black gradient. Logos in the trust strip are monochrome-to-native marks on white; icons are thin line glyphs, with red check marks and red ↗ arrows as the only coloured icon set.

## Layout

A single 1280px column sits centered on white, bounded left and right by 1px dashed Rail Gray rails that run the full page height; wherever a horizontal section rule meets a rail, a tiny Laravel Red square marks the joint, so the page reads like a drafted sheet. A 44px blush announcement strip and a 64px white navigation bar sit above a left-aligned hero: a two-line 72px headline, a 20px Stone Gray lead and a red-plus-outlined button pair on the left, an isometric product stack on the right. A 128px logo strip with a mono caption cell follows, then a centered 60px statement with an inline red toggle. Feature content runs as two-column splits divided by vertical 1px rules, each with heading, checklist and outlined button above a product visual. A centered CTA, a masonry grid of three quote-card columns, an events intro and a full-bleed photo carousel lead into a four-column footer that ends in a giant cropped red wordmark.

## Similar Brands

- **Tailwind CSS** — Shares a white technical canvas with hairline grid rules, tightly tracked large sans headlines and code panels presented as the hero proof.
- **Vercel** — Uses thin bordered grid cells and crosshair-like markers to frame marketing sections as a precise engineering layout.
- **Supabase** — Same developer-platform rhythm of feature splits with product UI crops, code tabs and a single saturated brand colour for actions.
- **Prisma** — Pairs light-weight display type with code samples and isometric-style product diagrams on a calm light canvas.
