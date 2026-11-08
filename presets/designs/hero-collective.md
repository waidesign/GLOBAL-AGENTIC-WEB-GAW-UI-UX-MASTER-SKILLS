---
id: "hero-collective"
name: "Hero Collective"
theme: "dark"
category: "developer-tools"
tags: ["hero-collective","dark","developer-tools","api","technical"]
vibe: "tabloid headline on a blackout stage. Shout in towering cream and fire-red condensed capitals, stacking full-bleed campaign footage as rounded-top sheets on soot black."
liveUrl: "https://www.herocollective.co/"
previewUrl: "https://ui.gradientdeck.com/styles/hero-collective"
lastVerified: "2026-11-08"
---

# Hero Collective — Style Reference
> tabloid headline on a blackout stage. Shout in towering cream and fire-red condensed capitals, stacking full-bleed campaign footage as rounded-top sheets on soot black.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Hero Collective is a soot-black agency showreel where type is the set: Anton capitals run edge to edge at 166px to 768px with 0.8 line-height, in Cream #f4f3e3 or Hero Red #f51c20. Every block is a full-bleed sheet with 37.5px top corners that slides over the one before it, so case studies, the red LATEST band, a khaki Culture Hack panel and the news collage read as a pile of posters rather than sections. Red display words carry a blurred duplicate behind them that glows like stage light, and white marker scribbles circle and underline words in the hero. Staff, set in 25px uppercase at weight 600, is the only reading voice; there are no shadows, no thin weights and almost no lowercase.

## Colors

| Name | Value | Role |
|------|-------|------|
| Soot Black | `#121212` | Page canvas, case-study sheets and the footer — every rounded-top panel sits on this near-black |
| Cream | `#f4f3e3` | Display capitals, client names, body copy and button labels — the site never uses pure white text |
| Hero Red | `#f51c20` | Giant HEROES and NEWS display words, the LATEST band and filled block buttons — the one loud colour against soot black |
| Bone | `#e6e5ce` | Fill of the secondary block button, carrying a Hero Red label |
| Khaki Panel | `#c7c5ac` | The Culture Hack call-to-action sheet that holds the report and subscribe buttons — the only light section |
| Press Charcoal | `#1f1f1f` | The rounded news-collage panel, a half step up from Soot Black |
| Ember Charcoal | `#292524` | Warm brown-black ground of the PLAY showreel section behind the portrait video |
| Deep Teal | `#102423` | Ground of the culture-driven manifesto section, a dark green-black under the glowing red copy |
| Logo Box Red | `#ec2031` | The square fill behind the HERO wordmark in the header, a touch cooler than Hero Red |
| Rule Bone | `#e2e1d3` | The 1px footer divider and the hand-drawn underline strokes |
| Faded Cream | `#b0afa4` | Cream at 70% for the footer legal line and other low-emphasis small print |

## Typography

### Anton — The whole voice of the site: a narrow, heavy grotesque set only in uppercase at weight 400. Display sizes run from 166px up to 768px at 0.8 line-height, so lines nearly touch and client names fill the full 1600px width. Below that it covers buttons at 51px, the LATEST list at 63px, footer tile labels at 36.64px and news titles at 25px.
- **Substitute:** Arial, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400
- **Sizes:** 25px, 36.64px, 51px, 63.33px, 66.66px, 166.56px, 166.66px, 312.5px, 368px, 447px, 576px, 768px
- **Line height:** 0.80, 0.82, 0.88, 0.90, 1.10
- **Letter spacing:** -17.28px at 768px; -9.2px at 368px; 0 everywhere else

### Staff — The reading face, a plain grotesque that only appears in uppercase. Case-study descriptions are 25px at weight 600 with 1.1 line-height and sit as a dense centred block under each client name. The weight is synthesised from the Regular file, since the page asks Staff-Regular for 600. Slide counters, footer links and the legal line use 14px/400 at 1.2.
- **Substitute:** Archivo
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400, 600
- **Sizes:** 8.4px, 14px, 25px
- **Line height:** 1.10, 1.20

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | Staff | 400 | 14px | 1.2 | 0px |
| body | Staff | 600 | 25px | 1.1 | 0px |
| card-title | Anton | 400 | 25px | 1.1 | 0px |
| nav | Anton | 400 | 36.64px | 1.1 | 0px |
| button | Anton | 400 | 51px | 0.9 | 0px |
| subheading | Anton | 400 | 63.33px | 0.9 | 0px |
| heading | Anton | 400 | 166.66px | 0.8 | 0px |
| section-display | Anton | 400 | 312.5px | 0.82 | 0px |
| panel-display | Anton | 400 | 368px | 0.8 | -9.2px |
| footer-display | Anton | 400 | 576px | 0.8 | 0px |
| display | Anton | 400 | 768px | 0.8 | -17.28px |

## Spacing & Layout

**Base unit:** 7.5px

**Density:** spacious

- **Section gap:** 52.5px
- **Card padding:** 37.5px
- **Element gap:** 30px

### Border Radius

- **sheets:** 37.5px 37.5px 0px 0px
- **panels:** 37.5px
- **buttons:** 24px
- **images:** 0px

## Components

### Overlay Header Bar
**Role:** Fixed top navigation over the hero

An 80px transparent bar with 15px 0 padding inside 37.5px gutters. On the left is a Logo Box Red #ec2031 square holding a Cream HERO wordmark, followed by COLLECTIVE in Cream capitals; on the right is a two-line Cream hamburger. No background, border or shadow.

### Glowing Display Hero
**Role:** Opening statement

On Soot Black #121212, centre one line of Cream Anton at 166.56px/400, 0.9 line-height, uppercase. Below it, set a single Hero Red Anton word that spans the full width and bleeds off the bottom, with a blurred red duplicate behind it as a glow. Add white marker circles and underlines on key words.

### Marker Scribble Mark
**Role:** Hand-drawn emphasis

Rough Cream #f4f3e3 or Hero Red #f51c20 marker strokes, about 6px thick, laid over Anton type: a loose ellipse round one word, a wavy underline, arrows pointing at letters and small spark marks. Keep them as SVG strokes, never as filled shapes, and use one or two per screen.

### Hero Red Latest Band
**Role:** Section index panel

A full-bleed Hero Red #f51c20 sheet with 37.5px 37.5px 0 0 corners. Centre LATEST in Cream Anton 312.5px/400 at 0.82 line-height, with a stacked list of WORK, TRENDSSS and NEWS in Cream Anton 63.33px at 0.9 below it.

### Case Study Sheet
**Role:** Client work showcase

A 1360px full-bleed sheet with 37.5px 37.5px 0 0 corners over a full-bleed campaign photo or video. Put the client name in Cream Anton 447 to 720px, 0.8 line-height, uppercase. Under it, centre Staff 25px/600 uppercase copy at 1.1, then a hairline, a Staff 14px 1 / 07 counter and a framed video.

### Hero Red Block Button
**Role:** Primary call to action

A half-width, 166px-tall Hero Red #f51c20 block with a 24px radius and 60px 37.5px padding. Centre a Cream #f4f3e3 Anton 51px/400 uppercase label at 0.9 line-height. No border or shadow. The full-width CHECK ALL NEWS bar uses the same fill and radius.

### Bone Block Button
**Role:** Secondary call to action

The same 166px block as the primary button: 24px radius and 60px 37.5px padding, filled with Bone #e6e5ce. The Anton 51px/400 uppercase label is Hero Red #f51c20 at 0.9 line-height. Place it beside the red button with a 37.5px gap.

### Culture Hack Panel
**Role:** Report and newsletter prompt

A Khaki Panel #c7c5ac sheet with 37.5px top corners. Set CULTURE in Cream Anton 368px/400, 0.8 line-height and -9.2px tracking above split HA and CK capitals, with Hero Red marker arrows pointing into the gap. The red and Bone block buttons sit below.

### News Collage Panel
**Role:** Editorial news feed

A Press Charcoal #1f1f1f panel with a 37.5px radius. A blurred Hero Red NEWS fills it in Anton 768px/400, 0.8 line-height and -17.28px tracking. Over it, scatter tilted paper-frame cards with illustrated art, Cream Anton 25px/400 titles at 1.1 and a red handwritten learn-more link.

### Showreel Play Block
**Role:** Brand film teaser

An Ember Charcoal #292524 sheet with a centred portrait video. PLAY is spelled across the full width in Cream Anton capitals with wide gaps between the letters. A Hero Red Anton 66.66px/400 THE POWER OF CULTURE lockup at 0.88 line-height sits beside a circled play icon.

### Video Tile Footer
**Role:** Site footer and navigation

A Soot Black #121212 sheet with 37.5px 37.5px 0 0 corners and 52.5px 37.5px 0 padding. HERO runs in Cream Anton 576px at 0.8 line-height above five equal video tiles labelled in Cream Anton 36.64px at 1.1. A 1px Rule Bone #e2e1d3 divider sits over Staff 14px uppercase links and Faded Cream legal text.

## Do's and Don'ts

### Do
- Use Soot Black #121212 as the canvas and Cream #f4f3e3 for all type on it; never pure white.
- Set every headline in Anton 400 uppercase at 0.8 line-height, scaling client names until they span the full width (447px to 720px at 1600px).
- Apply 37.5px 37.5px 0 0 corners to each full-bleed section sheet and overlap it onto the previous sheet.
- Reserve Hero Red #f51c20 for one shouting display word per screen, the LATEST band and the primary block button.
- Set case-study copy in Staff 25px/600 uppercase at 1.1 line-height, centred under the client name, with a Staff 14px counter like 1 / 07 below.
- Use 24px-radius block buttons with 60px 37.5px padding and 51px Anton labels, paired as Hero Red and Bone #e6e5ce halves.
- Keep the 7.5px rhythm: 37.5px page gutters, 30px and 22.5px inner spacing, 52.5px top padding on the footer.

### Don't
- Do not set headlines in mixed case or bold weights; Anton stays 400 and uppercase at every size.
- Do not add drop shadows to sheets, buttons or cards; separate them with rounded top edges and colour changes.
- Do not use Hero Red #f51c20 for running text or small links; it belongs to display words and filled blocks.
- Do not use lowercase sentence-case body copy; Staff paragraphs are uppercase 25px/600.
- Do not box content into a centred max-width column; sheets and display words run full bleed inside 37.5px gutters.
- Do not use pill buttons or tiny radii; filled buttons use 24px and section sheets 37.5px.
- Do not leave line-height at normal on Anton; keep 0.8 to 0.9 so capitals stack tight.

## Elevation

Nothing has a shadow. Depth comes from stacking: each full-bleed section is a sheet with 37.5px top corners, pulled up so it overlaps the one above and slides over it while you scroll. The other source of depth is light: red display words such as HEROES and NEWS have a blurred duplicate behind them, which glows on Soot Black like a neon sign.

## Surfaces

- **Soot Black** (`#121212`) — Page canvas, case-study sheets and the footer sheet.
- **Press Charcoal** (`#1f1f1f`) — Rounded news-collage panel.
- **Ember Charcoal** (`#292524`) — PLAY showreel section ground.
- **Deep Teal** (`#102423`) — Culture-driven manifesto section.
- **Hero Red** (`#f51c20`) — LATEST band and primary block buttons.
- **Khaki Panel** (`#c7c5ac`) — Culture Hack call-to-action sheet.
- **Bone** (`#e6e5ce`) — Secondary block button fill.

## Imagery

The imagery is cinematic campaign footage and stills: musicians in studios, athletes and portraits under saturated purple, teal and magenta stage light, run full-bleed behind the type with no radius. Twenty-four looping videos keep the page moving, from the hero background to the footer tiles. Hand-made texture sits on top of the footage: white and red marker scribbles, circles, underlines, arrows and spark marks, plus scrawled lines like "we turn brands into heroes". News items are collage cards, tilted paper frames with taped edges holding retro-illustrated editorial art. Type always outranks the image, and client names are laid over faces and products at full width.

## Layout

A full-bleed, single-column scroll of stacked sheets inside a fixed scroll container, with 37.5px side gutters and no max-width. An 80px transparent header floats over everything, with the red-box HERO wordmark at the left and a cream hamburger at the right. The hero centres one line of Cream Anton at 166.56px above a red HEROES that fills the whole width and bleeds off the bottom edge. Below it, a Deep Teal manifesto section and a PLAY showreel with a giant spaced word lead into a red LATEST band. Seven case-study sheets follow, one per client, each a 1360px-tall photo or video ground with the client name in giant Cream capitals, centred uppercase copy, a slide counter and a framed video. A khaki Culture Hack sheet with two half-width block buttons and a rounded news collage come next, and the footer closes the page with a giant HERO and a row of five video tiles.

## Similar Brands

- **Supreme** — Shares the white-on-red box logo device as the whole brand mark.
- **Nike** — Uses towering condensed uppercase headlines laid over full-bleed athlete and campaign photography.
