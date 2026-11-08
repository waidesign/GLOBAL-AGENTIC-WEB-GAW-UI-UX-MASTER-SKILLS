---
id: "frama"
name: "FRAMA"
theme: "light"
category: "saas"
tags: ["frama","light","saas","web-app"]
vibe: "walnut apothecary, ruled in black. Let full-bleed film and warm photography carry the colour, and keep every control a square 1px outline in one Univers weight."
liveUrl: "https://framacph.com/"
previewUrl: "https://ui.gradientdeck.com/styles/frama"
lastVerified: "2026-11-08"
---

# FRAMA — Style Reference
> walnut apothecary, ruled in black. Let full-bleed film and warm photography carry the colour, and keep every control a square 1px outline in one Univers weight.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

FRAMA is a Copenhagen design house whose store reads like a printed catalogue laid over a working apothecary. A black #000000 announcement strip and a white nav ruled by one 1px line sit above full-bleed film of walnut cabinets, kraft paper and hands at work. Below that the page turns stark white #ffffff, with cut-out furniture on nothing and photography split edge to edge in pairs. All type is Univers Roman at weight 400, stepping from 12px captions to 47px titles with tight -0.4px tracking, and hierarchy comes from size and capitals alone. Every radius measured is 0px, every control is a black or white hairline box, and colour arrives only through the images.

## Colors

| Name | Value | Role |
|------|-------|------|
| Catalogue Black | `#000000` | Text, 1px rules and outlines, the announcement strip and the solid Add to Cart block: the only interface colour |
| Page White | `#ffffff` | Page, nav, mega menu and product stage, plus text and outlines over film and photographs |
| Wordmark Ink | `#000c00` | Fill of the FRAMA wordmark SVG in the nav, a barely green black beside pure black type |
| Caption Grey | `#636363` | Variant and subtitle line under product names, one step back from the name above it |
| Variant Grey | `#a0a0a0` | The selected variant name beside the Select Variant label, the faintest text on the site |
| Cabinet Brown | `#5b3d27` | Mid walnut sampled from the hero film, the tone white hero type sits on |
| Walnut Shadow | `#402917` | Deep cabinet brown sampled from the hero film, the darkest note in the warm imagery |
| Kraft Film | `#6a4c3d` | Wrapping-paper brown sampled from the film as the shots move across the table |
| Linen Dust | `#726359` | Muted grey-brown sampled from the film edges, where light falls off the paper |
| Warm Ash | `#726861` | Cooler ash brown sampled from the film, a quiet bridge from the browns to the white page |
| Dark Umber | `#473731` | Shadowed umber sampled from the film, close to the tone of the darker wood |

## Typography

### Univers — The only voice on the site: Univers LT Pro 55 Roman at weight 400 everywhere, from 12px menu links to 47px titles. There is no bold anywhere, so hierarchy comes from size and capitals. Tracking stays -0.4px through most sizes, tightening to -1.645px on the 47px hero title.
- **Substitute:** Helvetica Neue, Arial, sans-serif
- **Licence:** commercial (the font file names it Univers LT Pro); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 22px, 30px, 47px
- **Line height:** 1.00, 1.13, 1.25, 1.50
- **Letter spacing:** -1.645px at 47px hero; -0.4px at 16-47px; -0.14px at 14px; -0.12px at 12px

### Helvetica — Only inside the embedded newsletter form in the footer: 16px invitation copy, 13px field label, consent note and Subscribe label, with no tracking. It comes from the form widget and is close enough to Univers that it passes unnoticed.
- **Substitute:** Arial, sans-serif
- **Weights:** 400
- **Sizes:** 13px, 16px
- **Line height:** 1.00, 1.42
- **Letter spacing:** 0 at 13px and 16px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| caption | Univers | 400 | 12px | 1.5 | -0.12px |
| button-small | Univers | 400 | 12px | 1 | -0.12px |
| form-note | Helvetica | 400 | 13px | 1.42 | 0px |
| variant | Univers | 400 | 14px | 1.125 | -0.14px |
| button | Univers | 400 | 16px | 1 | -0.4px |
| product-name | Univers | 400 | 16px | 1.125 | -0.4px |
| body | Univers | 400 | 16px | 1.5 | -0.4px |
| lead | Univers | 400 | 22px | 1.25 | -0.4px |
| section | Univers | 400 | 30px | 1 | -0.4px |
| tile-title | Univers | 400 | 30px | 1.125 | -0.4px |
| hero | Univers | 400 | 47px | 1.125 | -1.645px |
| title | Univers | 400 | 47px | 1.25 | -0.4px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Section gap:** 64px
- **Card padding:** 40px
- **Element gap:** 20px

### Border Radius

- **buttons:** 0px
- **inputs:** 0px
- **cards:** 0px
- **images:** 0px
- **nav:** 0px

## Components

### Announcement Strip
**Role:** Rotating top message

A full-width 40px Catalogue Black #000000 strip with one centred message in 12px/18px Univers at -0.4px in Page White #ffffff. Messages fade from one to the next on a timer, and a small white cross closes it at the far right. Square, no border.

### Nav Row
**Role:** Primary navigation

An 80px Page White #ffffff row with 20px 40px padding, closed by a 1px Catalogue Black #000000 rule. A 74px Wordmark Ink #000c00 SVG sits left, then 16px/24px Univers links at -0.4px with 20px side padding. Hovering underlines the link and opens its panel.

### Mega Menu Panel
**Role:** Shop link directory

Solid Page White #ffffff, opened on hover directly below the nav with no shadow, covering the film without dimming it. Seven columns start at the 40px margin, each with a 12px/18px uppercase head at -0.12px above sentence-case links of the same size. Inspiration swaps in four image thumbnails.

### Film Hero
**Role:** Home opening

A 980px full-bleed autoplaying film under the nav. A 47px/52.88px Univers title at -1.645px in Page White #ffffff sits at the top left, and a 200px outline Discover button sits at bottom left on the 40px margin. No scrim or gradient: the film stays untreated.

### Outline Button
**Role:** Primary link action

A 200px by 40px transparent box with a 1px border, 0px radius and 8px 16px padding. It holds a 16px/16px uppercase Univers label at -0.4px plus a thin arrow. Page White #ffffff over photographs as Discover, Catalogue Black #000000 on white as Read Guide.

### Split Image Tile
**Role:** Edge-to-edge editorial pair

Two 800px image halves, 750px tall on home, touching with no gutter and 0px radius. Each carries a 47px/52.88px Univers uppercase Page White #ffffff title at -1.645px in the top left and a 200px outline Discover button at bottom left, the same treatment as the film hero.

### Most Popular Carousel
**Role:** Product row

A 30px/30px uppercase heading with a View All link opposite, above square cut-outs on Page White #ffffff. Under each: a 16px/18px name, a 14px/15.75px Caption Grey #636363 variant and a right-aligned price. A 40px square Catalogue Black #000000 button with a white arrow advances it.

### Guide Split Block
**Role:** Editorial link on home

A half-width photograph against a half-width Page White #ffffff panel, swapping sides down the page. The panel centres a 47px/58.75px Univers title at -0.4px above a black outline Read Guide button with a 16px/16px uppercase label. A small 16px caption sits under the image.

### Buy Column
**Role:** Product purchase controls

A 480px column at x=880: a 16px/20px uppercase title and price, a 12px label with the variant in Variant Grey #a0a0a0, then swatches. A 50px square quantity box with a 1px Catalogue Black #000000 border sits beside a 410px by 50px solid black Add to Cart with 12px uppercase Page White text.

### Accordion Row
**Role:** Product details

A 480px by 40px row with a single 1px Catalogue Black #000000 top border, 10px 10px 10px 0px padding, a 12px/18px uppercase Univers label at -0.12px and a thin arrow at right. Clicking pushes the rows below down and flips the arrow to reveal a 12px list.

### Product Gallery
**Role:** Product image viewer

A left stage with no border where cut-outs and full-bleed lifestyle shots crossfade inside the same frame on Next. A numbered 1 to 10 text pager sits below with the current number underlined, a cube View in Room link top left in 14px/21px uppercase, and corner brackets for fullscreen.

### Story Text Block
**Role:** Long product narrative

A half-width image beside 22px/27.5px Univers at -0.4px in Catalogue Black #000000 on Page White #ffffff, set directly below a short heading with no card, tint or pull quote. Blocks are divided by full-width 1px rules inside the 40px margins and alternate down the product page.

### Styling Guide Tile
**Role:** Inspiration grid item

An 800px photograph in a gutterless two-column wall, topped by a two-line 30px/33.75px Univers title at -0.4px in Page White #ffffff, the first line uppercase. A 200px outline Discover button sits at bottom left. Nothing but a 0px image edge separates the tiles.

### Shop Sidebar Grid
**Role:** Collection browsing

A narrow left sidebar of 12px/18px uppercase Univers group labels that expand in place on Page White #ffffff, with no rail, tint or divider, beside a borderless product grid. Each cell repeats the cut-out, a 16px/18px name, a Caption Grey #636363 variant and a price, with lifestyle images breaking the rhythm.

### Newsletter Footer
**Role:** Sign-up and links

Page White #ffffff with 48px 40px 24px padding. Left: a 16px Helvetica invitation, a 1px Catalogue Black #000000 email field and a 46px solid black Subscribe bar with a 13px label. Right: 16px/20px uppercase Univers column heads above 12px/18px links.

## Do's and Don'ts

### Do
- Use a single Univers Roman at weight 400 for every line, separating levels through size and capitals: 12px, 16px, 22px, 30px and 47px.
- Set every control square with a 0px radius and a 1px Catalogue Black #000000 border, switching to Page White #ffffff outlines over photographs.
- Keep the header as a 40px Catalogue Black strip above an 80px Page White row, closed by one 1px Catalogue Black rule.
- Let full-bleed film and photography bring all colour, with Cabinet Brown #5b3d27 and Walnut Shadow #402917 tones against Page White product sections.
- Pair images edge to edge in two 800px halves with no gutter, each with a 47px white title top left and an outline Discover button bottom left.
- Reserve the solid Catalogue Black fill for buying: a 50px-high Add to Cart block with 12px uppercase Page White text, beside a 50px outlined quantity box.
- Hold page margins at 40px and stack product details as 40px accordion rows, each topped by a 1px rule, with 12px/18px uppercase labels.

### Don't
- Do not introduce a bold or medium weight; no heading or button on the site goes above 400, and adding one would break the catalogue voice.
- Do not round anything; every radius across 24 measured states is 0px, including buttons, inputs, swatches and the 40px carousel arrow.
- Do not add shadows to cards or menus; only the shipping modal casts one, and the mega menu sits flat over the film in solid Page White #ffffff.
- Do not place an interface accent colour on buttons or links; the chrome stays Catalogue Black #000000 and Page White, and warmth belongs to the imagery.
- Do not put product cut-outs on tinted cards; they stand on the bare Page White stage, with only a name, a Caption Grey #636363 variant line and a price.
- Do not enlarge the small copy; descriptions, menu links and accordion labels stay 12px/18px, however long the text, so the images stay dominant.
- Do not use stock interiors or cool light; photographs are warm, low-sun rooms and tactile close-ups with natural materials in the frame.

## Elevation

- **Shipping Modal:** `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`

## Surfaces

- **Page White** (`#ffffff`) — Page, nav, product stage and mega menu panel
- **Cabinet Brown** (`#5b3d27`) — Full-bleed hero film, sampled from rendered frames
- **Catalogue Black** (`#000000`) — Announcement strip and the solid Add to Cart block

## Imagery

Two registers carry everything. Lifestyle work is warm, grainy and film-like: a hero video of an antique walnut apothecary, hands cutting kraft paper and sorting postcards, then low-sun rooms with stone floors, linen curtains and birch chairs casting long shadows. Products, by contrast, are clean cut-outs on pure white, shot from a slight angle with no floor or shadow beyond their own. Colour is earthy throughout: walnut, kraft, oat and olive. Images are square-cornered and run edge to edge with no frames or overlays. Icons are thin linear glyphs: a small arrow, plus a cube for View in Room and corner brackets for fullscreen.

## Layout

A full-width storefront with 40px side margins and no max width: content spans 1520px at a 1600px viewport. A 40px black strip and an 80px white nav row sit on top, with the wordmark at left, five links beside it and Search, currency, Login and Cart at right. Home runs a 980px film hero, then edge-to-edge image pairs in 800px halves, a white Most Popular carousel, alternating half-image guide blocks with centred 47px titles, and a three-part footer. Product pages split into a left gallery and a 480px buy column starting at x=880, followed by a full-width In Situ image row and alternating image and 22px story text blocks. Inspiration is a centred 47px title above a gutterless two-column wall of tiles. The Shop view pairs a thin collapsible sidebar with a product grid.

## Similar Brands

- **Aesop** — Same apothecary-rooted restraint, pairing warm material photography with quiet, unadorned interface type.
- **Hay** — Shares the furniture storefront built on product cut-outs set directly on a white page beside lifestyle photography.
- **Muuto** — Uses a clean Scandinavian catalogue layout where large room photographs alternate with plain product grids.
- **Audo Copenhagen** — Same Copenhagen design-house approach of warm interior photography framed by minimal black type on white.
