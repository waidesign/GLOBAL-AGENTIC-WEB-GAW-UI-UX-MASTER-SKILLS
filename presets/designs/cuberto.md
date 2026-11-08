---
id: "cuberto"
name: "Cuberto"
theme: "dark"
category: "fintech"
tags: ["cuberto","dark","fintech","banking"]
vibe: "showreel on a black slab, cue cards on white. Alternate Paper pages with 80px-rounded Studio Black slabs, and let medium Suisse headlines and pills do the talking."
liveUrl: "https://cuberto.com/"
previewUrl: "https://ui.gradientdeck.com/styles/cuberto"
lastVerified: "2026-11-08"
---

# Cuberto — Style Reference
> showreel on a black slab, cue cards on white. Alternate Paper pages with 80px-rounded Studio Black slabs, and let medium Suisse headlines and pills do the talking.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Cuberto is a monochrome agency site that swaps between a white Paper #ffffff canvas and huge Studio Black #000000 slabs whose top corners round off at 80px, so each dark section feels like a sheet sliding up over the last. Colour is borrowed from the work itself: rendered product videos and 3D covers carry the hue while the chrome stays black and white, with only pale Mint Wash #e3f5f3 and Periwinkle Wash #f1f3fa tiles softening the proof sections. Suisse Intl does everything at just two weights; 90px and 80px medium headlines with light negative tracking read as calm and engineered rather than shouty. Everything interactive is a 9999px pill or a circle, and nothing casts a shadow.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, header, text and outline-pill borders on black slabs, the Get in touch pill and the 4px testimonial frames |
| Studio Black | `#000000` | Contacts pill, active service cards, the 80px-rounded work, insights, FAQ and footer slabs — pure black is the brand's only loud colour |
| Service Gray | `#eeeeee` | Resting fill of the 20px-radius service accordion cards before scroll turns the active one black |
| Mint Wash | `#e3f5f3` | Alternate testimonial cards and the 15+ and 300+ stat tiles — a cool pastel that keeps the proof section gentle beside black |
| Periwinkle Wash | `#f1f3fa` | The other half of the testimonial deck and the award and partnership stat tiles, alternating with Mint Wash |
| Smoke Disc | `#1a1a1a` | 60px circular social buttons in the footer, measured as 10% white over Studio Black |
| Fog | `#f8f8f8` | Occasional off-white headings and copy on black panels and a small circular icon chip |

## Typography

### Suisse Intl — The only typeface on the page, self-hosted in 300 to 700 but used at just 400 and 500. Medium 500 carries the 90px hero and 80px section titles with -0.9px and -1.6px tracking; regular 400 handles 80px CTA lines at -2.4px, 42px service titles, 24-25.6px leads with slightly open +0.26 to +0.48px tracking, 20px nav and body, and 16px uppercase eyebrows. The neutral Swiss grotesk lets the work supply the personality.
- **Substitute:** Inter, Helvetica Neue, Arial, sans-serif
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 20px, 24px, 25.6px, 28px, 32px, 42px, 80px, 90px
- **Line height:** 1.00, 1.10, 1.20, 1.30, 1.40, 1.50
- **Letter spacing:** -0.9px at 90px; -1.6px at 80px/500 and -2.4px at 80px/400; -0.84px at 28px and 16px uppercase stat labels; +0.26px at 25.6px; +0.48px at 24px; +0.4px at 20px body; -0.18px at 18px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| eyebrow | Suisse Intl | 400 | 16px | 1.1 | 0px |
| testimonial | Suisse Intl | 400 | 18px | 1.4 | -0.18px |
| nav | Suisse Intl | 400 | 20px | 1.2 | 0px |
| body | Suisse Intl | 400 | 20px | 1.4 | 0.4px |
| button | Suisse Intl | 500 | 20px | 1 | 0px |
| lead | Suisse Intl | 400 | 24px | 1.2 | 0.48px |
| intro | Suisse Intl | 400 | 25.6px | 1.3 | 0.26px |
| stat-statement | Suisse Intl | 400 | 28px | 1.2 | -0.84px |
| service-title | Suisse Intl | 400 | 42px | 1.1 | 0px |
| cta-heading | Suisse Intl | 400 | 80px | 1.1 | -2.4px |
| section-display | Suisse Intl | 500 | 80px | 1 | -1.6px |
| hero-display | Suisse Intl | 500 | 90px | 1 | -0.9px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1600px
- **Section gap:** 120px
- **Card padding:** 40px
- **Element gap:** 16px

### Border Radius

- **buttons:** 9999px
- **cards:** 20px
- **images:** 20px
- **testimonials:** 8px
- **sections:** 80px

## Components

### Wordmark Navigation Bar
**Role:** Top-level site navigation

A Paper bar about 80px tall with 120px side gutters: lowercase cuberto wordmark at left, Studio Black Suisse Intl 20px/400 links (Services, Projects, About, Blog) at 24px line-height and no tracking, then a Studio Black Contacts pill at right. No border, no shadow.

### Studio Black Pill Button
**Role:** Primary contact action

Studio Black #000000 fill, Paper #ffffff label in Suisse Intl 20px/500 at 20px line-height, 9999px radius, 0 28px padding, 58px height. No border and no shadow; the inverted Paper fill with black label is used on dark backgrounds.

### Paper Outline Pill Button
**Role:** Secondary link on black slabs

Transparent fill with a 1px solid #ffffff border and 9999px radius; Paper Suisse Intl 24px/400 label at 24px line-height (Visit blog, View all projects). Sits right-aligned beside an 80px heading or centred under a grid. No shadow.

### Centered Display Hero
**Role:** Landing statement and showreel

Centred Studio Black Suisse Intl 90px/500 headline at 90px line-height and -0.9px tracking over two lines, a 24px/400 lead at 28.8px line-height and +0.48px tracking, then a full-width 20px-radius autoplaying showreel video with 120px side gutters.

### Eyebrow Split Block
**Role:** Section introduction

Under a 1px solid #000000 rule, a 16px/400 uppercase eyebrow (WHAT WE DO, WHY CUBERTO) sits in the left column at 17.6px line-height; the right column holds a Suisse Intl 25.6px/400 paragraph at 33.28px line-height and +0.26px tracking, max about 650px wide.

### Service Accordion Card
**Role:** Scroll-activated service list

Full-column Service Gray #eeeeee card, 20px radius, 60px padding, 10px gap between cards. Suisse Intl 42px/400 title at 46.2px line-height with a muted two-digit index at right. The active card turns Studio Black with Paper text, a 20px/400 paragraph at 28px line-height and +0.4px tracking, an Explore link with a white circle arrow and indigo triangle art.

### Client Logo Grid
**Role:** Social proof

A four-column, three-row grid of flat black client wordmarks on Paper inside the 1110px column, roughly 180px row pitch, no frames, no dividers and no shadows, introduced by a centred 32px/400 heading at 35.2px line-height.

### Rounded Black Work Slab
**Role:** Case-study showcase section

A Studio Black #000000 section with 80px 80px 0 0 corners overlapping the white page. Paper Suisse Intl 80px/500 Selected work heading at 80px line-height and -1.6px tracking, then a staggered two-column grid of project covers with a centred Paper outline pill at the end.

### Project Cover Card
**Role:** Individual case study teaser

A 500px-wide autoplaying video or 3D render, 675px tall or square at 500px, with 20px radius and no border or shadow; a short two-line Paper caption sits below. Right-column cards start about 150px lower to create the stagger.

### Scattered Testimonial Card
**Role:** Client quote in a tossed deck

Mint Wash #e3f5f3 or Periwinkle Wash #f1f3fa card with a 4px solid #ffffff border, 8px radius and 50px padding, rotated a few degrees and overlapping its neighbours. Large pale quote marks, then Suisse Intl 18px/400 quote at 25.2px line-height and -0.18px tracking, a hairline and the client logo.

### Pastel Stat Tile
**Role:** Experience and award proof

Mint Wash or Periwinkle Wash tile, 20px radius, 40px padding, 300px tall, 16px gaps. Thin line icon top-left; bottom-aligned either an 80px/400 numeral (15+, 300+) at -0.84px tracking over a 16px uppercase label at -0.84px, or a 28px/400 statement at 33.6px line-height.

### Insight Article Card
**Role:** Blog teaser on black

A square 3D illustration with 20px radius on the Studio Black slab, then a muted 16px/400 uppercase category at 20.8px line-height, a Paper Suisse Intl 24px/400 title at 33.6px line-height, and a muted 16px/500 date. Three across with 20px gaps; no card fill, no shadow.

### Hairline FAQ Row
**Role:** Expandable question list

Full-column rows on Studio Black separated by 1px low-opacity Paper hairlines, about 110px tall. Paper Suisse Intl 24px/400 question at left, a thin plus icon at the right edge; no fills, no radius, no shadow.

### Triangle Glow CTA Band
**Role:** Closing conversion block

A black band with nested translucent indigo triangle artwork. Centred Paper Suisse Intl 80px/400 heading at 88px line-height and -2.4px tracking, a 20px/400 subline at 28px line-height, and a Paper pill (Studio Black 20px/500 label, 9999px radius, 0 28px padding, 58px tall).

### Contact Pill Footer
**Role:** Contacts, offices and site links

Studio Black footer with 120px vertical padding. Email and phone sit in 1px Paper outline 9999px pills at 24px/400; muted uppercase office labels precede 18px/500 addresses at 27px line-height; 24px link columns at right; 60px Smoke Disc #1a1a1a circular social buttons below.

## Do's and Don'ts

### Do
- Use Paper #ffffff and Studio Black #000000 as the whole chrome palette, alternating full-width white sections with black slabs.
- Set the hero in Suisse Intl 90px/500 at 90px line-height and -0.9px tracking, centred, with a 24px/400 lead at +0.48px tracking beneath.
- Give every dark section 80px 80px 0 0 corners so it reads as a sheet rising over the previous one.
- Keep all buttons as 9999px pills 58px tall with 0 28px padding and 20px/500 labels: black on white, white on black, or a 1px Paper outline.
- Apply a 20px radius to service cards, stat tiles, project covers and insight images, with 40px or 60px inner padding.
- Reserve Mint Wash #e3f5f3 and Periwinkle Wash #f1f3fa for the proof sections, alternating tile by tile.
- Let project videos and 3D renders supply the colour; keep captions and chrome strictly monochrome.

### Don't
- Do not add box shadows to cards, pills or covers; separate with tone, the 4px Paper testimonial frame, or overlap.
- Do not use Suisse Intl at 600 or 700 for headlines; the display roles stop at 500.
- Do not introduce a saturated brand accent for buttons or links; the action colour is Studio Black #000000 or Paper #ffffff.
- Do not square off the buttons; every control is a 9999px pill or a 60px circle.
- Do not tighten the 24px and 25.6px lead copy; it runs at +0.48px and +0.26px tracking.
- Do not put Mint Wash or Periwinkle Wash behind full sections; they live only inside 20px tiles and 8px testimonial cards.
- Do not crowd sections together; keep around 120px of vertical padding between major blocks.

## Elevation

There are no box shadows anywhere on the page. Depth comes from tone and overlap instead: Studio Black slabs with 80px top corners slide over the white page, service cards step from Service Gray to black as they activate, and the testimonial deck fakes a physical stack with rotated Mint Wash and Periwinkle Wash cards separated only by 4px Paper borders.

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, header, hero, logo grid, testimonials and stat section.
- **Service Gray** (`#eeeeee`) — Resting service accordion cards on the white canvas.
- **Mint Wash** (`#e3f5f3`) — Alternate testimonial cards and stat tiles.
- **Periwinkle Wash** (`#f1f3fa`) — Other testimonial cards and stat tiles.
- **Studio Black** (`#000000`) — Rounded work, insights, FAQ and footer slabs; active service card.
- **Smoke Disc** (`#1a1a1a`) — Circular social buttons sitting on the black footer.

## Imagery

Imagery is the agency's own work, almost all of it moving: a dark showreel in the hero, autoplaying case-study videos and polished 3D renders of phones, laptops, kiosks and characters on soft studio backdrops. Covers are cropped tall (500x675) or square (500x500) with 20px corners and short white captions below. Colour comes from these renders (violet, lemon, sky, pink) and never leaks into the UI. Insight articles use glossy 3D illustration squares with the same 20px radius. The services and CTA blocks use nested translucent indigo triangle artwork on black. Iconography is thin monochrome line icons in the stat tiles, plus-sign toggles in the FAQ and small arrows inside white circles; client logos are flat black wordmarks.

## Layout

The page sits in a 1600px frame: the header and hero media use 120px side gutters, while most content narrows to a 1110px column with 240px gutters. The hero is centred type (90px headline, 24px lead) above a full-width 20px-radius showreel video. Below it, a two-column editorial split puts a 16px uppercase eyebrow at left and a 25.6px intro paragraph from about 550px across, under a 1px black rule. Services stack as full-column 20px-radius accordion cards. A 4x3 monochrome client-logo grid leads into a black Selected work slab with a staggered two-column grid of tall 500x675 and square 500x500 covers. Then come white testimonials and stat tiles, black Insights (three columns) and FAQ (hairline rows), a gradient-image CTA band and a black footer. Sections breathe on roughly 120px vertical padding.

## Similar Brands

- **Locomotive** — Shares a strictly black-and-white agency chrome with smooth-scrolled, motion-led reveals and work imagery supplying all the colour.
- **Dogstudio** — Uses a motion-first agency homepage where large neutral type frames autoplaying case-study media.
- **Ramotion** — Same agency formula of a centred large-type hero, client logo wall and grid of rendered product case studies.
