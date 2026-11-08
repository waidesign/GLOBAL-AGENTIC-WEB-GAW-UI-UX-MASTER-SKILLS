---
id: "aesop"
name: "Aesop"
theme: "light"
category: "saas"
tags: ["aesop","light","saas","web-app"]
vibe: "apothecary paper, amber glass. Keep every edge square on warm cream and let bottles, films and one quiet flared humanist supply all the feeling."
liveUrl: "https://www.aesop.com/"
previewUrl: "https://ui.gradientdeck.com/styles/aesop"
lastVerified: "2026-11-08"
---

# Aesop — Style Reference
> apothecary paper, amber glass. Keep every edge square on warm cream and let bottles, films and one quiet flared humanist supply all the feeling.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Aesop sells skin care like a well-kept laboratory ledger. The canvas is Apothecary Cream #fffef2, a faintly yellow paper rather than white, and even reversed text and outlined buttons use it. Charcoal Label #333333 is the only strong ink, filling the announcement bar and every Add to cart block. Corners are square throughout; only round media controls break the rule. Zapf-Humanist at 31px, regular weight, is the single display voice, while SuisseIntl handles all interface text between 11px and 18px, so hierarchy stays hushed. Colour comes from photography and film: amber bottles, snow, brick, skin. Amber Glass #945c26 appears only as a small Limited release label. The page breathes through 100px section gaps inside a 1200px container, with full-bleed films opening and closing it.

## Colors

| Name | Value | Role |
|------|-------|------|
| Apothecary Cream | `#fffef2` | Page canvas, open menu panel, field fill, and all reversed text and outlines on film and on the footer |
| Charcoal Label | `#333333` | Announcement bar, Add to cart fill, Submit button and all body ink — the printed-label black that is softer than true black |
| Footer Black | `#252525` | Full-width footer field, also the fill Add to cart darkens to on hover over 0.25s |
| Muted Label | `#666666` | Product descriptions, helper text, and the active segment of carousel pagination |
| Oat Section | `#f6f5e8` | Tinted bands for Certified B Corp and Recommended reading, one quiet step down from the canvas |
| Hairline | `#d6d5cc` | Secondary button outlines and field borders, composited from Charcoal Label at 20% opacity on cream |
| Amber Glass | `#945c26` | The 11px Limited release label above product tiles — the only hue in the interface, echoing the brown bottles |
| Search Rule | `#ebeade` | The 2px base rule under the search cell when the header turns cream for an open menu |
| Inactive Segment | `#cccbc2` | Idle carousel pagination segments, composited from Charcoal Label at 25% opacity on cream |
| Menu Veil | `#999993` | The dim over the cream page while a menu is open, Charcoal Label at 50% opacity composited on the canvas |
| Scrim Black | `#000000` | End stop of the transparent-to-black scrim behind hero copy, and the bookmark icon on product tiles |

## Typography

### SuisseIntl — The working sans for nearly all text: 14px body and descriptions on a 21px line height, 12px utility links and the announcement bar, 16px prices, and 18px footer column heads. Product names and footer heads are set at weight 700. Tracking stays at 0 everywhere, and sizes never go above 18px in visible interface copy.
- **Substitute:** sans-serif
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400, 700
- **Sizes:** 11px, 12px, 14px, 16px, 18px
- **Line height:** 1.08, 1.20, 1.50, 1.70
- **Letter spacing:** 0px at all sizes

### SuisseIntl-Medium — A separate medium file the site declares as its own family, used at CSS weight 400 for buttons, main navigation, hero eyebrows and small badges. Buttons are 14px on a 21px line height; the Limited release badge is 11px. It gives labels slightly more firmness than body text with no change in size.
- **Substitute:** sans-serif
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 400, 700
- **Sizes:** 11px, 14px, 16px
- **Line height:** 1.20, 1.50, 1.70
- **Letter spacing:** 0px at all sizes

### Zapf-Humanist — The only display voice, a flared humanist (the file names itself ZapfHumnst BT) with calligraphic stroke contrast. It appears at one size, 31px weight 400 on a 41.23px line height, for hero titles, section headings and the Ada Lovelace quote. Its restraint carries the brand: headings stay small and rely on the letterforms and surrounding space.
- **Substitute:** sans-serif
- **Licence:** commercial (the font file names it ZapfHumnst BT); buy a licence from its foundry, or use the substitute
- **Weights:** 400
- **Sizes:** 31px
- **Line height:** 1.33
- **Letter spacing:** 0px at 31px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| legal | SuisseIntl | 400 | 11px | 1.2 | 0px |
| utility | SuisseIntl | 400 | 12px | 1.2 | 0px |
| announcement | SuisseIntl | 400 | 12px | 1.5 | 0px |
| product-name | SuisseIntl | 700 | 14px | 1.08 | 0px |
| nav | SuisseIntl-Medium | 400 | 14px | 1.2 | 0px |
| body | SuisseIntl | 400 | 14px | 1.5 | 0px |
| button | SuisseIntl-Medium | 400 | 14px | 1.5 | 0px |
| price | SuisseIntl | 400 | 16px | 1.2 | 0px |
| tile-title | SuisseIntl | 400 | 16px | 1.7 | 0px |
| footer-heading | SuisseIntl | 700 | 18px | 1.5 | 0px |
| display | Zapf-Humanist | 400 | 31px | 1.33 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 0px
- **Element gap:** 8px

### Border Radius

- **controls:** 9999px

## Components

### Announcement Bar
**Role:** Slim promotional line above the header

A full-width 57px band in Charcoal Label #333333 with one centred line of SuisseIntl 12px/400 on an 18px line height in Apothecary Cream #fffef2, such as complimentary shipping over $51. No close button, icon or link styling; it scrolls away with the page.

### Transparent Header
**Role:** Two-row navigation laid over the hero

Lay a transparent header over the hero film with cream #fffef2 text: SuisseIntl 12px utility links at both sides, a centred 140×44 wordmark, then a navigation row of SuisseIntl-Medium 14px links with 17px padding and 51px height, ending in a 140×52 search cell with a 1px #fffef2 outline.

### Hover Mega Menu
**Role:** Cream panel that opens from a nav link

On hover the header turns Apothecary Cream #fffef2 with Charcoal Label #333333 text, and a full-width panel drops below it holding columns of 14px links on a 200px pitch plus two image tiles. Shadow it with rgba(0, 0, 0, 0.02) 0px 0px 6px 0px, rgba(0, 0, 0, 0.08) 0px 2px 4px 0px and veil the page at rgba(51, 51, 51, 0.5).

### Film Hero Slide
**Role:** Full-bleed carousel of films and stills

Fill the width at 800px tall with a playing film and the scrim linear-gradient(rgba(0, 0, 0, 0), rgb(0, 0, 0)). Centre cream #fffef2 copy near the base: a SuisseIntl-Medium 14px eyebrow, a Zapf-Humanist 31px/400 title on 41.23px, a SuisseIntl 14px line, then a button. Side arrows change between three slides.

### Outlined Hero Button
**Role:** Wide reversed call to action on film

A 390×48 transparent button with a 1px solid Apothecary Cream #fffef2 border, 0px radius and 13px 24px 12px padding, centred under hero copy. Label in SuisseIntl-Medium 14px/400 on a 21px line height, in cream, with a thin arrow to the right of the word Discover.

### Add to Cart Block
**Role:** Primary purchase button on product tiles

A full-tile-width 376×48 button filled Charcoal Label #333333 with a 1px transparent border, 0px radius and 13px 24px 12px padding. Label in SuisseIntl-Medium 14px/400 in Apothecary Cream #fffef2. On hover it darkens to Footer Black #252525 over background-color 0.25s ease-out.

### Outlined Read Button
**Role:** Secondary action on light sections

A 48px tall transparent button sized to its text, such as the 239px Consult The Gift Finder, with a 1px rgba(51, 51, 51, 0.2) outline composited to Hairline #d6d5cc and 0px radius. Label in SuisseIntl-Medium 14px/400 in Charcoal Label #333333, followed by a thin arrow.

### Product Tile
**Role:** Unboxed product in a three-across carousel

A 376px column with no border, fill or padding, spaced 20px apart. Stack an Amber Glass #945c26 11px Limited release label and a bookmark, a packshot on bare cream, a centred SuisseIntl 14px/700 name, a Muted Label #666666 14px description on 21px, a 16px price and an Add to Cart block.

### Segmented Carousel Pagination
**Role:** Thin bar pagination under product rows

A centred row of thin horizontal segments with 30px wide hit areas and 6px margins. Idle segments use rgba(51, 51, 51, 0.25), composited to Inactive Segment #cccbc2; the current segment is longer at 45px and darker in Muted Label #666666. Square ends and no dots.

### Category Tile
**Role:** Image and label in Browse by category

A 222×173 square-cornered photograph with no frame, followed by a SuisseIntl 16px/400 label on a 27.2px line height in Charcoal Label #333333. Tiles sit 15px apart in a horizontally paged row beneath a left-aligned Zapf-Humanist 31px/400 heading on Apothecary Cream #fffef2.

### Edge Bleed Split
**Role:** Editorial image against a narrow column

Run a 954×537 image to one viewport edge with square corners, and set a narrow copy column on the other side: a SuisseIntl-Medium 14px label, a Zapf-Humanist 31px/400 title on 41.23px, Muted Label #666666 14px text and a 48px outlined button. Alternate sides between sections.

### Oat Certification Band
**Role:** Two-column statement on a tinted band

A full-width 218px band in Oat Section #f6f5e8 with two centred columns, each a SuisseIntl-Medium 14px heading on 23.8px with 5px bottom margin, above a line of 14px text in Charcoal Label #333333. No logos or dividers; it is a quiet interruption between images.

### Round Film Controls
**Role:** Play and mute buttons on hero films

Two 40×40 circles at the lower left of a film, 20px from the edge, with 9999px radius and a 5px right margin. Fill with Charcoal Label #333333, use a cream glyph and add rgba(51, 51, 51, 0.2) 0px 0px 4px 0px. These and back-to-top are the only rounded parts of the interface.

### Footer Newsletter Field
**Role:** Cream input on the dark footer

A 370×40 input filled Apothecary Cream #fffef2 on Footer Black #252525, with a 1px rgba(51, 51, 51, 0.2) border, 0px radius, 0px 16px padding and SuisseIntl 14px/400 text in Charcoal Label #333333. Stack with long legal copy at 12px and a 97×48 Charcoal Label #333333 Submit button.

### Footer Link Column
**Role:** Dark footer navigation

On Footer Black #252525, head each 200px column with SuisseIntl 18px/700 on a 27px line height in Apothecary Cream #fffef2, with 15px bottom padding and a 1px cream rule below. List SuisseIntl 14px/400 links on 16.8px with 8px bottom padding, in the same cream.

## Do's and Don'ts

### Do
- Use Apothecary Cream #fffef2 as the page canvas and as the reversed text colour, so paper and print stay one warm family.
- Set Charcoal Label #333333 as the body ink and primary fill, with Footer Black #252525 reserved for the footer and button hover.
- Keep every button, tile, image and field at 0px radius; only 40px round film controls and back-to-top take 9999px.
- Use Zapf-Humanist at 31px weight 400 on a 41.23px line height for every heading, at the same size on hero and section alike.
- Keep interface text in SuisseIntl between 11px and 18px with 0px tracking, and SuisseIntl-Medium 14px for buttons and navigation.
- Hold content to a 1200px container with 1170px of live width, and separate sections with 100px of empty space.
- Build buttons 48px tall with 13px 24px 12px padding, filled Charcoal Label #333333 for purchase and 1px outlined for everything else.

### Don't
- Do not use pure white; the cream #fffef2 tint is what keeps the page from looking clinical.
- Do not enlarge headings for impact; no visible heading exceeds 31px, and scale belongs to the photography and film.
- Do not round product tiles, images or buttons, and do not add card borders or shadows around tiles.
- Do not introduce brand colour into buttons or links; Amber Glass #945c26 stays on the 11px Limited release label.
- Do not bold Zapf-Humanist or set it in uppercase; it runs at weight 400 in sentence case.
- Do not place hero text directly on film without the transparent-to-black scrim; cream copy depends on it.
- Do not use illustrations, icons as decoration or gradients on surfaces; the scrim is the only gradient measured.

## Elevation

- **Media Control:** `rgba(51, 51, 51, 0.2) 0px 0px 4px 0px`
- **Menu Panel:** `rgba(0, 0, 0, 0.02) 0px 0px 6px 0px, rgba(0, 0, 0, 0.08) 0px 2px 4px 0px`
- **Back To Top:** `rgba(255, 254, 242, 0.2) 0px 2px 4px 0px`

## Surfaces

- **Apothecary Cream** (`#fffef2`) — The page canvas behind product tiles, copy columns and packshots
- **Oat Section** (`#f6f5e8`) — Tinted full-width bands for certification and reading lists
- **Charcoal Label** (`#333333`) — Announcement bar and the film placeholder before video paints
- **Footer Black** (`#252525`) — The closing footer field with reversed cream text
- **Menu Veil** (`#999993`) — The dim laid over the cream page while a menu is open

## Imagery

Imagery does the emotional work. Hero and store sections are slow, tactile films: a train cart of Aesop bottles, a pen on a card, a shopfront with hand-painted French Cleaners signage on brick. Stills show formulations in amber glass and pale tubes, with monochrome black-and-white labels and carton graphics. Campaign scenes place products on a snowy mountain and beside figures pushing a giant white sphere through snow, so humour sits inside the calm. Category tiles crop close on hands, skin and warm interiors. Product packshots sit directly on cream with soft contact shadows and no container. Images have square corners. Icons are thin line glyphs, kept to search, bookmark and arrows.

## Layout

A 57px Charcoal Label announcement bar sits above a transparent two-row header laid over an 800px full-bleed hero: utility links at the sides, a 140×44 centred wordmark, then a 51px navigation row with a 140×52 outlined search cell. The header scrolls away with the page and is not sticky. Below, content runs in a 1200px container with 1170px of live width from x=215, and sections are 100px apart. Festive Gift Kits and Curated Sets are three-across product carousels with 376px tiles and 20px gaps. Browse by category is five 222×173 tiles with 15px gaps. Gift Finder and Library are mirrored splits: a 954×537 image bleeding to one viewport edge against a narrow copy column. A store film runs full bleed, Recommended reading is three 377×251 images, and a 1027px dark footer ends the 7952px page. At 390px wide, the header reduces to wordmark, search, store, cart and menu icons, the hero becomes a 390×693 portrait film, and headings fall to 25px.

## Similar Brands

- **Le Labo** — Shares the apothecary label language, restrained monochrome interface and products presented as laboratory goods.
- **Byredo** — Also sets fragrance and body care on quiet pale pages with small type and large art-directed imagery.
- **Diptyque** — Comparable heritage fragrance retail with labelled glass products on calm editorial pages.
- **Kinfolk** — Shares the slow pace, generous white space and small, refined headings beside full-bleed photography.
