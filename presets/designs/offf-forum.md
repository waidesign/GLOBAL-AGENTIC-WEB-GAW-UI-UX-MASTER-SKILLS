---
id: "offf-forum"
name: "OFFF Forum"
theme: "dark"
category: "developer-tools"
tags: ["offf-forum","dark","developer-tools","api","technical"]
vibe: "stage flash, black stamp. Cut festival photography at full bleed behind a heavy geometric wordmark, then drop to pure white with tight black grotesque and inscribed serif capitals."
liveUrl: "https://www.offforum.com/"
previewUrl: "https://ui.gradientdeck.com/styles/offf-forum"
lastVerified: "2026-11-08"
---

# OFFF Forum — Style Reference
> stage flash, black stamp. Cut festival photography at full bleed behind a heavy geometric wordmark, then drop to pure white with tight black grotesque and inscribed serif capitals.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

OFFF Forum is a festival site in strict black and white, where all colour comes from photographs. The homepage is one full-bleed screen of fast-cutting event photography under a Hero Scrim, with a 768px lockup pairing a solid geometric OFFF against FORUM in the site's own Forvm capitals. Everything after it turns to Paper White #ffffff: Baikal SemiBold at 80px with -3.2px tracking, Black Stamp #000000 title tags, and uppercase Forvm at 76px for statements and 14px for every control. Square hairline boxes, 1px rules and 9999px pills make up the whole kit, and FAQ rows invert to solid black on hover.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper White | `#ffffff` | Canvas for every route after the hero, plus reversed type, ticket pill and the consent card |
| Black Stamp | `#000000` | Wordmark, all type on white, title tags, 1px rules and hover bands — pure black, with no softened ink |
| Hero Scrim | `linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8)), linear-gradient(rgba(0, 0, 0, 0.3) 0px, rgba(0, 0, 0, 0.3) 100%), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 35.62%)` | Three stacked black washes over the hero slideshow — darkens the top and foot so white type holds on any photograph |

## Typography

### Baikal — The working grotesque, named OFFF Baikal in its own file and loaded only as a SemiBold, so even text asking for weight 400 renders from that one cut. It runs 80px statements at -3.2px tracking and 77px line-height, 24px body at -0.96px and 26px, and 18px box text at -0.72px; the tight negative tracking makes running copy feel set, dense and poster-like.
- **Substitute:** Helvetica Neue, Arial, sans-serif
- **Licence:** commercial (the font file names it OFFF Baikal); buy a licence from its foundry, or use the substitute
- **Weights:** 400, 600
- **Sizes:** 10px, 11px, 14px, 18px, 24px, 32px, 80px
- **Line height:** 0.94, 0.96, 0.97, 1.07, 1.08, 1.09, 1.11, 1.50
- **Letter spacing:** -3.2px at 80px; -1.28px at 32px; -0.96px at 24px; -0.72px at 18px; -0.28px at 14px; 0px at 10-11px

### Forvm — FORVM, as its file names it: a flared, inscriptional roman used only in uppercase, also forming FORUM in the logo. It sets the 45px hero statement and 76px About statement at 0.96 line-height, then drops to 14px with -0.28px tracking and a 12px line-height for navigation, pills and radio labels, so controls feel engraved rather than typed.
- **Substitute:** Georgia, serif
- **Licence:** commercial (the font file names it FORVM); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 14px, 45px, 76px
- **Line height:** 0.86, 0.96
- **Letter spacing:** -1.52px at 76px; -0.9px at 45px; -0.28px at 14px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| credit | Baikal | 400 | 10px | 1.5 | 0px |
| small-print | Baikal | 600 | 11px | 1.09 | 0px |
| control | Forvm | 400 | 14px | 0.86 | -0.28px |
| label | Baikal | 600 | 14px | 1.07 | -0.28px |
| info | Baikal | 600 | 18px | 0.94 | -0.72px |
| answer | Baikal | 600 | 18px | 1.11 | -0.72px |
| body | Baikal | 600 | 24px | 1.08 | -0.96px |
| subhead | Baikal | 600 | 32px | 0.97 | -1.28px |
| hero-statement | Forvm | 400 | 45px | 0.96 | -0.9px |
| serif-display | Forvm | 400 | 76px | 0.96 | -1.52px |
| display | Baikal | 600 | 80px | 0.96 | -3.2px |

## Spacing & Layout

**Base unit:** 8px

**Density:** compact

- **Section gap:** 120px
- **Card padding:** 16px
- **Element gap:** 8px

### Border Radius

- **buttons:** 9999px
- **pills:** 9999px
- **images:** 0px
- **cards:** 0px
- **consentCard:** 20px
- **consentButtons:** 40px

## Components

### Lockup Header Link
**Role:** Logo and home link on every route

An SVG lockup 768px by 99px, 16px from the top and left, with a solid geometric OFFF of circle and stacked bars beside FORUM in Forvm capitals. It is #ffffff over the hero and #000000 on Paper White, and has no bar behind it.

### Corner Text Navigation
**Role:** About and language links at top right

Two Forvm 14px/400 uppercase links at 12px line-height and -0.28px tracking, right-aligned 16px from the edge with a 24px gap, in #ffffff or #000000. An underline draws in on hover and marks the current page; there is no fill.

### Hairline Info Box
**Role:** Dates and venue in the hero

A two-cell box 138px high with a 1px #ffffff border, transparent fill and 0px radius; cells have 16px 16px 36px padding. Labels and values use Baikal 18px/600 at 17px line-height and -0.72px tracking.

### Slideshow Hero Stage
**Role:** Full-bleed opening screen

A 1600px by 1000px photograph with cover fit that changes about every 0.5s on its own, beneath a three-layer black Hero Scrim. A Forvm 45px/400 uppercase statement at 43px line-height and -0.9px tracking is centred in #ffffff, 792px wide, above the pill.

### Ticket Pill Button
**Role:** Primary call to action

A #ffffff pill with black Forvm 14px/400 uppercase label, 6px 16px padding, 9999px radius and 26px height. On hover the fill drops out to transparent, with a 1px #ffffff border and white text, and no shadow at any point.

### Black Title Tag
**Role:** Page name on inner routes

A Black Stamp #000000 block hugging its word, with 8px padding and 0px radius, set in #ffffff Baikal 80px/600 at 77px line-height and -3.2px tracking. It sits directly under the lockup at a 16px left margin; About measures 236px by 93px.

### Diagonal Image Staircase
**Role:** Signature About image composition

Square-cornered 4:5 photographs with cover fit, at measured widths of 508px, 272px, 163px and 106px, touch corner to corner in a diagonal across the full viewport. Their inner image sits about 10% larger than the frame, with no gap, border or shadow.

### Ruled Edition Link Row
**Role:** Dated festival link

A 637px row 47px high, with 10px 0px padding, a 1px #000000 bottom rule, Baikal 24px/600 text at 26px line-height and -0.96px tracking, and a small arrow flush right, with no fill or radius at rest and the rule as its only structure.

### Inverting FAQ Row
**Role:** Accordion question

A 776px button 50px high with 12px 0px padding, a 1px #000000 rule, Baikal 24px/600 question and a chevron. Hover makes the band solid #000000 with #ffffff text. An opened answer uses Baikal 18px/600 at 20px line-height with 8px 0px 36px padding.

### Outline Pill Link
**Role:** Social and secondary actions

A transparent pill with a 1px #000000 border, Forvm 14px/400 uppercase label at 12px line-height, 6px 16px padding, 9999px radius and 26px height. Used for IG and IN, and for Become Partner at the end of a partner rule.

### Newsletter Radio Form
**Role:** Audience choice that opens a form

A Baikal 32px/600 heading at 31px line-height and -1.28px tracking, over two radio labels in Forvm 14px/400. Choosing one reveals name and email fields, with 16px 0px 8px padding and a 1px #000000 bottom rule only, and a black 26px Subscribe pill.

### Full Width Footer Wordmark
**Role:** Closing brand statement

The lockup enlarged to 1568px by 202px in #000000 between 16px margins, closed by small print in Baikal 11px/600 at left and a 10px/400 credit at right, on a Paper White page with no background band.

### Consent Card
**Role:** First-visit cookie prompt

A #ffffff card 375px wide, 16px from the corner, with 20px radius, 24px padding and a rgba(0, 0, 0, 0.15) 0 0 50px shadow. Stacked 40px-high outline buttons with 40px radius hold Baikal 11px/600 labels. It is the only rounded, raised surface on the site.

## Do's and Don'ts

### Do
- Use only Black Stamp #000000 and Paper White #ffffff in the interface, and let photographs bring all the colour.
- Set statements in Baikal 80px/600 with 77px line-height and -3.2px tracking, flush left at a 16px margin.
- Reserve Forvm for uppercase: 45px and 76px statements at 0.96 line-height, and 14px controls at -0.28px tracking.
- Keep every pill at 9999px radius with 6px 16px padding and a 1px border, 26px high.
- Apply a solid #000000 fill to page title tags with 8px padding and white Baikal 80px/600 type.
- Hold images at square corners in a 4:5 ratio, stepping them diagonally in sizes from 106px to 508px wide.
- Reserve the inverted band for hover: rows go solid #000000 with #ffffff text, with no shadow or radius.

### Don't
- Do not add a brand colour or tinted surface; the interface stays pure #000000 and #ffffff.
- Do not use Forvm in lowercase, or Baikal for navigation and pill labels.
- Do not round images or info boxes; only pills and the consent prompt carry a radius.
- Do not add drop shadows to cards or images; the 50px shadow belongs to the consent card alone.
- Do not loosen tracking on display type; Baikal stays at -3.2px at 80px and -0.96px at 24px.
- Do not place white type over a photograph without the three-layer Hero Scrim beneath it.
- Do not shrink the footer wordmark; it runs the full 1568px between 16px margins.

## Elevation

The design itself is flat: images, boxes and rows have square corners, and structure comes from 1px black or white lines and full inversions. The only shadow measured on any state, rgba(0, 0, 0, 0.15) 0 0 50px, belongs to the 20px-radius consent card, which floats above the page until it is answered. Hero depth comes from a stacked Hero Scrim over the photography, not from raised surfaces.

## Surfaces

- **Paper White** (`#ffffff`) — Page canvas for the footer and all inner routes.
- **Black Stamp** (`#000000`) — Title tags, subscribe pill and inverted hover bands.

## Imagery

Photography is candid, close and flash-lit event reportage: speakers mid-gesture with microphones, crowds in the street, merchandise and stage screens, often deep black with saturated blue, green or red stage light. On the homepage it fills the whole viewport and cuts quickly with no crossfade, so the page feels like a contact sheet being flipped. On About, square-cornered 4:5 crops at 508px, 272px, 163px and 106px wide step diagonally with a slight inner scale, and images arrive through soft blurred placeholders. Partner logos sit in plain monochrome rows. The geometric OFFF mark of solid circle and stacked bars is the only graphic device; there is no illustration, and icons are limited to small chevrons and arrows.

## Layout

The homepage is one 1000px full-bleed stage followed by a white footer. A 768px by 99px lockup sits 16px from the top left, above a hairline info box, with About and FR at top right and the statement and ticket pill centred at the foot. The footer runs a 32px newsletter heading, link columns and social pills on a 1px rule, then a 1568px by 202px wordmark filling the width. Inner routes start with the same lockup and a black title tag, on a 16px margin and 12-column rhythm with no maximum width. About sets an 80px statement at left, a diagonal staircase of 4:5 images rising to the right across the full width, then a 76px serif statement in the right half with labelled two-column text below, separated by 120px gaps. FAQ puts group titles in the left half and a 776px accordion in the right. Density is high within blocks, with large white gaps between them.

## Similar Brands

- **OFFF Barcelona** — Shares the festival brand this Montréal edition extends, which the site says was founded in Barcelona in 2001.
