---
id: "rainmaker"
name: "Rainmaker"
theme: "dark"
category: "saas"
tags: ["rainmaker","dark","saas","web-app"]
vibe: "storm front over a pine forest. Build cinematic, full-viewport panels in deep forest green where a single hi-vis lime pill cuts through condensed serif headlines."
liveUrl: "https://www.rainmaker.com/"
previewUrl: "https://ui.gradientdeck.com/styles/rainmaker"
lastVerified: "2026-11-08"
---

# Rainmaker — Style Reference
> storm front over a pine forest. Build cinematic, full-viewport panels in deep forest green where a single hi-vis lime pill cuts through condensed serif headlines.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Rainmaker operates as a cinematic field report: full-viewport panels of Forest Canvas #1c2c26 and Pine Field #103d1d alternate with full-bleed drone and storm footage, broken once by a pale Cloud #e0ded7 split panel. Flecha, a tall condensed high-contrast serif, carries every headline at 72-96px weight 400 with -0.02em tracking, so statements read like a period almanac rather than a tech launch. Founders Grotesk at weight 300 keeps body copy, uppercase eyebrows and footer links light and dry. Hi-Vis Lime #e5ff42 is the one loud colour, reserved for pill CTAs and deco corner ornaments; Wheat Gilt #daba89 plays the same ornamental role on the pledge panel. Everything is square-cornered except the 9999px pills, and depth comes from video and frosted glass rather than shadows.

## Colors

| Name | Value | Role |
|------|-------|------|
| Forest Canvas | `#1c2c26` | Default page canvas for the hero and text-led panels, and label colour on Hi-Vis pills |
| Hi-Vis Lime | `#e5ff42` | Pill CTA fills, research eyebrows, highlighted headlines and deco corner ornaments — a safety-vest signal against the forest greens |
| Mist | `#f5f5f1` | Headlines, body copy and footer links on every dark panel — a warm off-white rather than pure white |
| Pine Field | `#103d1d` | Footer field and deco ornament fills — a deeper, greener floor beneath the Forest Canvas panels |
| Cloud | `#e0ded7` | The light split-panel canvas for the technology story and the secondary pill fill |
| Canopy Green | `#275f4b` | Active tab headline on the Cloud panel and the giant cropped footer wordmark — a mid green that reads as tone-on-tone |
| Wheat Gilt | `#daba89` | Pledge-panel headline, eyebrow and gilt corner ornaments — a harvest tone that marks the trust and transparency story |
| Sage | `#628c7d` | Footer column labels, language switcher, muted metadata and the 1px footer rule |
| Obsidian | `#030200` | Backdrop behind full-bleed film and drone video sections |
| Bark Gray | `#716d6a` | The 1px dashed and dotted survey-grid lines laid over the careers image |
| Paper White | `#ffffff` | Hero headline and supporting line over the opening video |

## Typography

### Flecha — Every headline, the centered RAINMAKER header wordmark and the 404px footer logotype. The file names the face Flecha Bronzea M: a tall, condensed high-contrast serif set at weight 400 from 63px to 96px with 1.04 line-height and -0.02em tracking; the narrow, almanac-like letterforms give cloud seeding a weathered, historic authority instead of startup gloss.
- **Substitute:** Instrument Serif
- **Licence:** commercial (the font file names it Flecha Bronzea M); buy a licence from its foundry, or use the substitute
- **Weights:** 400, 500
- **Sizes:** 33px, 63px, 72px, 96px, 404px
- **Line height:** 0.90, 0.97, 1.04, 1.50
- **Letter spacing:** -1.92px at 96px; -1.44px at 72px; -1.26px at 63px; 0 at 33px and 404px

### Founders Grotesk — Body copy, uppercase eyebrows, pill labels, the newsletter tab and footer links. Almost always weight 300 (37 of 38 measured uses): 20-24px paragraphs sit at a tight 1.05 line-height with -0.01em tracking, while uppercase button labels open up to +0.1em, so the grotesque reads light and technical against the dense serif.
- **Substitute:** Hanken Grotesk
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 300, 400
- **Sizes:** 16px, 18px, 20px, 24px, 28px
- **Line height:** 1.00, 1.05, 1.17, 1.25, 1.40, 1.50
- **Letter spacing:** -0.24px at 24px; -0.2px at 20px; +1.8px at 18px uppercase; +1.6px at 16px uppercase buttons; +0.16px at 16px eyebrows

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| eyebrow | Founders Grotesk | 300 | 16px | 1.05 | 0.16px |
| button | Founders Grotesk | 300 | 18px | 1 | 1.8px |
| body | Founders Grotesk | 300 | 20px | 1.05 | -0.2px |
| nav | Founders Grotesk | 300 | 24px | 1.17 | 0px |
| lead | Founders Grotesk | 300 | 28px | 1.05 | 0px |
| heading | Flecha | 400 | 63px | 1.04 | -1.26px |
| section-display | Flecha | 400 | 72px | 1.04 | -1.44px |
| display | Flecha | 400 | 96px | 1.04 | -1.92px |
| wordmark | Flecha | 500 | 404px | 0.9 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1600px
- **Section gap:** 72px
- **Card padding:** 40px
- **Element gap:** 6px

### Border Radius

- **buttons:** 9999px
- **pills:** 9999px
- **tabs:** 6px
- **cards:** 0px
- **images:** 0px

## Components

### Centered Wordmark Header
**Role:** Transparent top navigation over the hero

A 104px-high transparent bar with no fill or border: a white blackletter R monogram at left, a centered Flecha 33px/400 uppercase RAINMAKER wordmark in Mist, and a hatched diagonal-line menu icon at right. Do not add visible links or a background.

### Dimming Display Hero
**Role:** Opening statement over full-bleed video

A full-viewport video panel on Forest Canvas #1c2c26 with a centered Paper White Flecha 96px/400 headline at 99.84px line-height and -1.92px tracking over a Founders Grotesk 28px/300 subline. The copy shows at full strength, dims to about 0.1 opacity over the playing video with a 1s opacity transition, and returns on scroll.

### Hi-Vis Pill Button
**Role:** Primary call to action

Hi-Vis Lime #e5ff42 fill, Forest Canvas #1c2c26 label, 9999px radius, 44px height and 0 16px 0 28px padding; uppercase Founders Grotesk 18px/300 at 18px line-height with +1.8px tracking and a trailing arrow. The compact 37px version uses 16px/300 with +1.6px tracking and 0 12px 0 24px padding. No shadow, no border.

### Cloud Pill Button
**Role:** Secondary call to action on dark panels

Cloud #e0ded7 fill with a black uppercase Founders Grotesk 16px/400 label at 24px line-height, 9999px radius, 8px 16px padding, 34px height and a trailing arrow. Center it at the foot of a text-only panel; no shadow.

### Arrow Text Link
**Role:** Inline section link

Uppercase Founders Grotesk 16px/300 text in Mist #f5f5f1 at 24px line-height followed by a thin right arrow, with no underline, fill or border. Sits below body copy on Forest Canvas panels, as in MORE ON RESEARCH and YOUR QUESTIONS ANSWERED.

### Split Story Panel
**Role:** Half text, half media section

An 800px by 1000px flat text half on Cloud #e0ded7 or Forest Canvas #1c2c26 with 70px 94.4px padding and 0px radius: an eyebrow with a small glyph at top, a Flecha 72px/400 headline at 1.04 line-height and -1.44px tracking, Founders Grotesk 20-24px/300 body, then a pill or arrow link. The other half is full-bleed media.

### Glyph Eyebrow
**Role:** Section label above headlines

A small deco glyph followed by uppercase Founders Grotesk 16px/300 text at 16.8px line-height and +0.16px tracking, with a 6px gap. Colour it to match the panel headline: Hi-Vis Lime on research, Wheat Gilt #daba89 on the pledge, Forest Canvas on Cloud.

### Deco Corner Frame
**Role:** Ornamental image framing

Four thin art-deco line ornaments, about 85px square, set inside the corners of a full-bleed image with roughly 40px inset. Stroke them in Hi-Vis Lime #e5ff42, Wheat Gilt #daba89 or Pine Field #103d1d to match the adjacent panel; no frame line between corners.

### Display Word Tabs
**Role:** Product pillar switcher

A row of three Flecha 72px/400 words (Target, Deliver, Validate) each with an uppercase Founders Grotesk 16px/300 eyebrow and -0.16px tracking above. The active word is Canopy Green #275f4b with a small arrow after its eyebrow; inactive words fade to low opacity.

### Glass Career Panel
**Role:** Frosted text card over imagery

A transparent card with a 1px solid rgba(255, 255, 255, 0.4) border, 0px radius, 32px 40px padding, backdrop blur and the Glass Panel shadow. Holds a 16px/300 uppercase eyebrow and a Flecha 63px/400 Mist headline, or 24px/300 body and a compact Hi-Vis Pill Button.

### Survey Grid Overlay
**Role:** Technical texture over imagery

A full-bleed grid of 1px dashed and 1px dotted Bark Gray #716d6a lines on a 9-column, 81-cell rhythm laid over a blurred landscape image. Keep it purely decorative under the glass panels; no fill.

### Newsletter Tab
**Role:** Fixed sign-up prompt

Fixed bottom-right: an rgba(0, 0, 0, 0.35) translucent fill with a 6px 6px 0 0 radius and 12px 16px padding holding uppercase Founders Grotesk 16px/300 Mist text at 24px line-height. It sits flush on the viewport bottom edge.

### Cinematic Film Block
**Role:** Documentary feature section

A full-viewport Obsidian #030200 video section with a Flecha 72px/400 Mist headline at bottom-left and a Hi-Vis Pill Button at bottom-right, both aligned to the 94.4px side padding. No overlay panel or gradient scrim.

### Pine Footer
**Role:** Site footer with cropped logotype

Pine Field #103d1d field with a Canopy Green monogram at left, two link columns at right with Sage 16px/300 uppercase labels and Mist Founders Grotesk 24px/300 links at 28px line-height, a 1px Sage #628c7d rule, 20px/300 Sage meta, and a Canopy Green Flecha 404px/500 RAINMAKER cropped at the bottom edge.

## Do's and Don'ts

### Do
- Use Forest Canvas #1c2c26 as the default full-viewport panel and Pine Field #103d1d for the footer floor.
- Set headlines in Flecha 72px/400 at 1.04 line-height and -1.44px tracking, rising to 96px/400 with -1.92px for the hero.
- Set body copy in Founders Grotesk 20px/300 at 1.05 line-height and -0.2px tracking, and 24px/300 for lead paragraphs.
- Reserve Hi-Vis Lime #e5ff42 for 9999px pill CTAs with Forest Canvas text, 0 16px 0 28px padding and a trailing arrow.
- Apply uppercase Founders Grotesk 18px/300 with +1.8px tracking to pill labels, and +0.16px for 16px eyebrows.
- Pair every text panel with a full-bleed photo or video half at 800px each, padded 70px 94.4px on the text side.
- Use thin deco corner ornaments to frame key images in Hi-Vis Lime, Wheat Gilt #daba89 or Pine Field, one per corner.

### Don't
- Do not round panels, cards or images; everything is 0px except 9999px pills and the 6px newsletter tab.
- Do not use pure black or pure white panels as the default canvas; use Forest Canvas #1c2c26 and Mist #f5f5f1 text.
- Do not bold the headlines; Flecha stays at weight 400 and gains presence from size and condensed letterforms.
- Do not set body copy at 400 or 500; Founders Grotesk runs at 300 almost everywhere.
- Do not spread Hi-Vis Lime #e5ff42 into backgrounds or body text; it is a CTA and ornament signal only.
- Do not lift cards with drop shadows; the only shadow is the frosted Glass Panel over imagery.
- Do not substitute a wide or geometric serif for Flecha; the display face must be tall and condensed.

## Elevation

- **Glass Panel:** `rgba(0, 0, 0, 0.15) 0px 0px 2px 1px inset, rgba(0, 0, 0, 0.1) 0px 0px 10px 4px inset, rgba(17, 17, 26, 0.05) 0px 4px 16px 0px, rgba(17, 17, 26, 0.05) 0px 8px 24px 0px, rgba(17, 17, 26, 0.05) 0px 16px 56px 0px`

## Surfaces

- **Obsidian** (`#030200`) — Backdrop behind full-bleed film and drone video sections.
- **Forest Canvas** (`#1c2c26`) — Default canvas for the hero and dark text panels.
- **Pine Field** (`#103d1d`) — Footer field beneath the last story panel.
- **Cloud** (`#e0ded7`) — Light split panel for the technology story.

## Imagery

Imagery is cinematic and atmospheric: full-bleed video of storm clouds, rain columns, drones in flight and a drone standing in night rain, plus painterly landscape renders of farmland under virga and sunlit cumulus. Footage is graded cool and desaturated in the sky and olive-green on the ground, with photographic depth of field (a blurred figure in the hero foreground). Product moments appear as real hardware and a laptop running the radar software, never as UI mockups. Images run square-cornered and edge to edge on their half of the viewport, framed by thin art-deco corner ornaments in Hi-Vis Lime, Wheat Gilt or Pine Field. Iconography is minimal: a blackletter R monogram, small deco eyebrow glyphs and thin arrows.

## Layout

The page is a stack of full-viewport 1000px panels at a 1600px maximum width, on a 9-column grid with 5.9vw by 7vh section padding. The opening panel is a full-bleed video with a transparent header: blackletter monogram at left, a centered Flecha RAINMAKER wordmark and a hatched menu icon at right, and a centered 96px headline that dims while the footage plays. Story sections split the viewport 50/50: one half is a flat Cloud or Forest Canvas text panel with an eyebrow at the top, a 72px headline and body at mid-height, and a link or pill below; the other half is full-bleed media framed by deco corner ornaments. A centered text panel, a full-bleed film block with the headline bottom-left and a Hi-Vis pill bottom-right, and a careers image overlaid with a dashed survey grid and two glass panels follow. The Pine Field footer pins link columns top-right and crops a 404px wordmark along the bottom edge.

## Similar Brands

- **Anduril** — Uses full-bleed cinematic hardware video on dark canvases with sparse, restrained interface chrome.
- **Varda Space Industries** — Shares a dark, film-led presentation of real flight hardware with large display headlines over footage.
- **Hadrian** — Same El Segundo industrial storytelling through cinematic full-viewport photography and video sections.
