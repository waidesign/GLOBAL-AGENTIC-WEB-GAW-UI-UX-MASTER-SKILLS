---
id: "family"
name: "Family"
theme: "light"
category: "saas"
tags: ["family","light","saas","web-app"]
vibe: "sticker mascots on a linen tray. Keep the page white and quiet with tight 500-weight headlines and black pills, and let candy-coloured characters carry the warmth."
liveUrl: "https://family.co/"
previewUrl: "https://ui.gradientdeck.com/styles/family"
lastVerified: "2026-11-08"
---

# Family — Style Reference
> sticker mascots on a linen tray. Keep the page white and quiet with tight 500-weight headlines and black pills, and let candy-coloured characters carry the warmth.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Family is a white-canvas crypto wallet page that hands its personality to a cast of sticker-style mascots: a sky-blue flower creature, a green blob, a butter-yellow cheese wedge, scattered coins, stars and hearts. Everything around them is restrained. Headlines are set in the custom Family face at 44–68px, weight 500, with roughly -1.35px tracking, so they read soft and friendly rather than loud; body copy is Inter 17px/400 in warm Graphite #474645. Product phones sit in pale Canvas #fbfaf9 panels with 12px corners, and each feature section borrows one accent (Signal Orange #ff3e00, Ether Blue #0086fc, Honey Gold #d48f00, Mint Green #00c978) for its eyebrow and tick list. Conversion lives in Wallet Black #171717 pills.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, header, tweet cards, floating transaction cards and Wallet Black pill labels |
| Ink | `#121212` | Family-face headlines, feature titles, nav pill labels and FAQ questions |
| Graphite | `#474645` | Paragraph copy under every headline and in testimonials — a warm brown-grey rather than a cold neutral |
| Wallet Black | `#171717` | Get Started and Download on iOS pill fills — a soft black that lets the mascots own every bit of colour on the page |
| Canvas | `#fbfaf9` | Phone-mockup panels, article image wells and the closing Explore Family band |
| Oat Pill | `#f6f4ee` | Log In and Watch the Video secondary pills — a warm grey fill that sits one step quieter than Wallet Black |
| Linen Line | `#f2f0ed` | Header hairline, FAQ dividers and the 1px inset ring around tweet cards and demo links |
| Pebble Gray | `#848281` | Published dates, Watch the demo sublabels, tweet handles and other quiet metadata |
| Ether Blue | `#0086fc` | Secure and Details eyebrows, tick lists and the Download for iOS text link — the most-used accent text colour |
| Signal Orange | `#ff3e00` | FAQ plus icons, See More FAQs link, Understandable eyebrow and tick list, plus tomato dots in the illustrations |
| Mint Green | `#00c978` | Onboarding and Receive captions, Back Up Now and Transaction Safe states — the positive, done-it colour |
| Honey Gold | `#d48f00` | Seamless NFT eyebrow and its media-type list (Images, Video, 3D Models), plus coin outlines in the illustrations |
| Mascot Sky | `#64c6ff` | Petals of the flower mascot, clouds and puddles — the largest illustrated colour field on the page |
| Butter Coin | `#ffcd6c` | Coins, stars, padlocks and the cheese-wedge character — the warm yellow sticker fill across the hero clusters |
| Charcoal | `#343433` | Mascot limbs, faces and outline strokes in the illustrations, and the occasional dark interface label |
| Fog Gray | `#a7a7a7` | Footer link lists and the copyright line — the footer deliberately fades almost to nothing |

## Typography

### Family — The brand's own self-hosted display face, used only for headlines. Every instance is weight 500: 68px with 74.8px line-height for the hero and 44px with 48px line-height for section heads, both tracked about -1.35px, so the round, open letterforms pack tightly into friendly, sticker-like word shapes.
- **Substitute:** Plus Jakarta Sans
- **Licence:** commercial (the font file names it Haffer XH); buy a licence from its foundry, or use the substitute
- **Weights:** 500
- **Sizes:** 44px, 68px
- **Line height:** 1.09, 1.10
- **Letter spacing:** -1.36px at 68px; -1.35px at 44px

### Inter — Everything that isn't a headline: 17px body at 26px line-height, 19px lead paragraphs, 15px nav and eyebrow labels, 13–14px metadata. Weights stay at 400–600 with small negative tracking (-0.22px at 17px, -0.13px at 15px), giving a calm, iOS-like reading voice under the expressive display face.
- **Substitute:** -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif
- **Licence:** open (SIL Open Font License); free to use and self-host
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 17px, 19px, 23px
- **Line height:** 1.38, 1.42, 1.43, 1.47, 1.53
- **Letter spacing:** -0.44px at 23px; -0.3px at 19px; -0.22px at 17px; -0.13px at 15px; -0.09px at 14px; -0.13px at 13px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| footer | Inter | 400 | 13px | 1.38 | -0.13px |
| eyebrow | Inter | 600 | 14px | 1.43 | -0.09px |
| label | Inter | 600 | 15px | 1.47 | -0.13px |
| nav | Inter | 500 | 15px | 1.47 | -0.09px |
| body | Inter | 400 | 17px | 1.53 | -0.22px |
| lead | Inter | 400 | 19px | 1.42 | -0.3px |
| card-title | Inter | 500 | 23px | 1.09 | -0.44px |
| heading | Family | 500 | 44px | 1.09 | -1.35px |
| display | Family | 500 | 68px | 1.1 | -1.36px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1072px
- **Section gap:** 104px
- **Card padding:** 32px
- **Element gap:** 16px

### Border Radius

- **panels:** 12px
- **cards:** 10px
- **floating-cards:** 17px
- **buttons:** 32px
- **nav-links:** 6px
- **avatars:** 40px

## Components

### Transparent Header Bar
**Role:** Top-level site navigation

A 94px transparent bar across the 1024px content width with a Linen Line #f2f0ed hairline below. Wordmark left, then Inter 15px/500 links in Ink with 11px 10px padding and a 6px hover radius; Log In Oat Pill and Get Started Wallet Black pill at right, both 32px tall.

### Wallet Black Pill Button
**Role:** Primary download and sign-up action

Fill Wallet Black #171717 with a Paper label, 32px radius, 48px height and 0 24px 0 22px padding; Inter 17px/500 at -0.22px tracking with a leading Apple glyph. The header version is 32px tall with 0 14px padding and 15px/500 text. No shadow.

### Oat Pill Button
**Role:** Secondary action beside the primary pill

Fill Oat Pill #f6f4ee with an Ink #121212 label, 32px radius, 48px height and 0 20px 0 19px padding; Inter 17px/500 at -0.22px tracking with a leading play triangle. Same 32px-tall, 15px/500 header variant for Log In. No border, no shadow.

### Mascot Hero Block
**Role:** Opening statement

Centre a two-line Ink headline in Family 68px/500, 74.8px line-height, -1.36px tracking, then Graphite #474645 Inter 17px/400 body at 26px line-height and a pair of 48px pills 16px apart. Flank it edge to edge with sticker mascot clusters; no background colour or panel.

### Canvas Phone Panel
**Role:** Product feature showcase

A Canvas #fbfaf9 panel with 12px radius and no shadow holding a black-framed iPhone cropped at the bottom edge. Set three across in a 1024px row; under each, an icon plus Inter 17px/500 caption in that feature's accent (Ether Blue, Mint Green, Honey Gold or Signal Orange).

### Accent Eyebrow
**Role:** Section category label

Inter 14px/600 at 20px line-height and -0.09px tracking, set in the section's single accent colour such as Signal Orange #ff3e00 or Ether Blue #0086fc, sitting about 12px above a Family 44px/500 headline in Ink.

### Accent Tick List
**Role:** Feature benefits list

Two columns of short benefits, each a thin check glyph plus Inter 17px/500 text at -0.22px tracking, both in the section's accent (for example Ether Blue #0086fc for Secure). Rows sit about 16px apart under a 19px/400 Graphite lead paragraph.

### Demo Thumbnail Link
**Role:** Inline video demo launcher

A transparent 68px-tall row with 12px radius and 12px 32px 12px 12px padding: a small photo thumbnail, an Ink Inter 15px/500 title and a Pebble Gray #848281 13px/500 Watch the demo line. On hover a 1px inset Linen Line ring grows in over 0.2s.

### Floating Transaction Card
**Role:** Live product-state illustration

A Paper #ffffff card with 17px radius, 12px padding and the soft rgba(0, 0, 0, 0.04) 0 1px 6px plus rgba(0, 0, 0, 0.05) 0 0 24px glow, floating inside a Canvas panel. Token icon left, Pebble Gray 13px sending line over an Ink 15px/500 asset name, amount right.

### Tweet Testimonial Card
**Role:** Social proof marquee item

Paper #ffffff card, 10px radius, 32px padding and a 1px inset Linen Line ring, no drop shadow. A 40px round avatar, Ink 15px/500 name over a Pebble Gray 14px/400 handle, an X glyph at right, then Graphite 17px/400 tweet text at 26px line-height. Rows scroll sideways with white edge fades.

### Article Preview Card
**Role:** Latest-news entry

A Canvas #fbfaf9 image well with 12px radius above Pebble Gray Inter 15px/400 Published date, an Ink 23px/500 title at 25px line-height and -0.44px tracking, and a three-line Graphite 17px/400 excerpt. Two cards share the 1024px row with about 36px between them.

### FAQ Accordion Row
**Role:** Expandable question list

Each row is an Ink Inter 19px/500 question at 27px line-height led by a thin Signal Orange #ff3e00 plus icon, separated by 1px Linen Line #f2f0ed dividers and about 32px vertical padding; close with a Signal Orange See More FAQs link and arrow.

### Canvas Closing Band
**Role:** Final download prompt

A full-width Canvas #fbfaf9 band with no radius: Family 44px/500 Explore Family headline, two lines of Graphite 17px/400 copy, and an Ether Blue #0086fc Inter 17px/500 Download for iOS link with arrow; a mascot meadow illustration sits to the right.

### Faded Footer
**Role:** Site map and legal

A transparent footer with 68px top and 96px bottom padding: the logo mark at left, three columns with Ink Inter 13px/500 headings over Fog Gray #a7a7a7 13px/400 links at 18px line-height, and a Fog Gray copyright and icon row at right.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the page canvas and Canvas #fbfaf9 for 12px-radius media panels that hold phone mockups.
- Set headlines in Family 500 with -1.35px tracking: 68px/74.8px for the hero and 44px/48px for section heads.
- Set body copy in Inter 17px/400 at 26px line-height and -0.22px tracking in Graphite #474645, not black.
- Use Wallet Black #171717 pills with 32px radius for the primary action, 48px tall with 0 24px 0 22px padding in the hero.
- Give each feature section exactly one accent for its 14px/600 eyebrow and tick list: Signal Orange, Ether Blue, Honey Gold or Mint Green.
- Reserve the soft 0 1px 6px plus 0 0 24px shadow for small white 17px-radius transaction cards floating inside Canvas panels.
- Keep content inside a 1072px max width with roughly 104px between sections and 32px padding inside tweet cards.

### Don't
- Do not set headlines in bold 700; the Family face is used only at weight 500 with tight -1.35px tracking.
- Do not mix several accent colours inside one section; each feature block commits to a single accent.
- Do not fill buttons with Signal Orange #ff3e00 or Ether Blue #0086fc; filled actions are Wallet Black or Oat Pill #f6f4ee.
- Do not draw grey 1px borders around cards; outline tweet cards with the 1px inset Linen Line #f2f0ed ring.
- Do not use pure black for text; headings are Ink #121212 and paragraphs Graphite #474645.
- Do not replace the sticker mascots with stock 3D coins, gradients or photography; illustration is flat, outlined and smiling.
- Do not use sharp corners on panels or buttons; keep 10–17px corners on surfaces and 32px on pills.

## Elevation

- **Linen Ring:** `color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 1px inset`
- **Floating Card Glow:** `rgba(0, 0, 0, 0.04) 0px 1px 6px 0px, rgba(0, 0, 0, 0.05) 0px 0px 24px 0px`
- **Device Halo:** `rgba(0, 0, 0, 0.15) 0px 0px 24px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, header and tweet cards.
- **Canvas** (`#fbfaf9`) — Phone panels, article image wells and the closing band.
- **Oat Pill** (`#f6f4ee`) — Secondary Log In and Watch the Video pills.
- **Wallet Black** (`#171717`) — Primary Get Started and Download on iOS pills.

## Imagery

Two kinds of image do all the work. The first is a flat, sticker-like illustration system: chubby characters (a sky-blue flower with a square face, a green blob, a yellow cheese wedge, a red flower, a bee) with thin Charcoal limbs and simple smiling or sleeping faces, surrounded by coins, stars, hearts, padlocks, chat bubbles and sparkles in Mascot Sky, Butter Coin, Mint Green and Signal Orange, often over pale beige circles. The second is real iOS product UI in black-framed iPhones, cropped at the panel bottom inside Canvas wells and often playing short looping videos. Small inline demo thumbnails are photographs of a hand holding the phone. Icons are thin line glyphs tinted the section's accent colour.

## Layout

A centred 1072px column (1024px of content) runs the full page under a transparent 94px header with the wordmark left, three text links, and two pills right, closed by a Linen Line hairline. The hero is symmetric: a centred two-line 68px headline, two lines of body and two pills, flanked edge to edge by dense clusters of sticker mascots. Below, sections alternate between three-up rows of Canvas phone panels with coloured captions underneath and two-column splits where a phone or mascot sits left and an eyebrow, 44px headline, 19px lead and two-column tick list sit right. Later blocks are a sticky left heading beside stacked detail panels, two article cards, two marquee rows of tweet cards that bleed off both edges with white edge fades, a split FAQ, a full-width Canvas closing band and a sparse four-column footer. Spacing is generous, around 100px between sections.

## Similar Brands

- **Rainbow** — Same playful, colour-forward take on an Ethereum wallet, with friendly rounded type and pill-shaped download buttons.
- **Duolingo** — Uses a cast of flat, smiling mascot characters as the main carrier of personality around otherwise simple layouts.
- **Arc** — Shares a warm, whimsical consumer-software tone with soft rounded surfaces and illustration-led storytelling.
