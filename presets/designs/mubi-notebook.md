---
id: "mubi-notebook"
name: "MUBI Notebook"
theme: "light"
category: "editorial"
tags: ["mubi-notebook","light","editorial","publishing"]
vibe: "poster wall, broadsheet column. One sans in medium weight sets film criticism on white paper, while square-cut stills and posters supply all the colour."
liveUrl: "https://mubi.com/en/notebook"
previewUrl: "https://ui.gradientdeck.com/styles/mubi-notebook"
lastVerified: "2026-11-08"
---

# MUBI Notebook — Style Reference
> poster wall, broadsheet column. One sans in medium weight sets film criticism on white paper, while square-cut stills and posters supply all the colour.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

MUBI Notebook is a daily film publication that reads like a printed broadsheet with a cinema lobby attached. Paper #ffffff pages carry a four-column grid of square-cornered stills, each under a Riforma 24px/500 headline at -0.6px tracking, and every word on the site is Riforma. Colour belongs to the films: posters and stills are saturated while the interface stays Ink #000000, Screening Gray #323232 and Byline Gray #9b9b9b. Marquee Blue #001489 is kept to the newsletter button and inline article links, and Issue Red #d71b1d appears only on the print magazine page. Tag pages shift to a Wall Gray #eaeaea field hung with split poster cards, and the Explore index opens as a dark Screening Gray panel.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | Page canvas, poster-card text panels, card badges and type over images |
| Ink | `#000000` | Article H1, home card headlines, wordmark and bylines — pure black reserved for the loudest words |
| Screening Gray | `#323232` | Article body text, the Notebook masthead, poster-card titles, the 4px quote bar and the Explore overlay field |
| Byline Gray | `#9b9b9b` | Dates, poster-card authors, article decks and the Notebook half of two-tone page headings |
| Nav Gray | `#7d7d7d` | Now Showing and Log In labels, search and menu icons in the top bar |
| Control Gray | `#666666` | Outlined Show More button and pager numerals — quiet controls that stay behind the editorial text |
| Wall Gray | `#eaeaea` | Tag-page field behind poster cards, the footer block and 1px hairlines under the nav and article header |
| Newsletter Mist | `#f6f6f6` | The single 224px full-width newsletter band that breaks the home grid |
| Marquee Blue | `#001489` | Join button and inline article links — a deep ink blue that marks the few things to act on inside gray prose |
| Issue Red | `#d71b1d` | Subscribe Now button and 15px borders around issue numerals on the magazine page — print sales get their own colour |
| Image Well | `#111111` | Fill behind the 732x374px Featured stills while they load, so a slow image reads as a dark frame |
| Field Rule | `#c8c8c8` | The 1px outline of search and email inputs, a touch darker than the page rules |
| Badge Scrim | `linear-gradient(rgba(0, 0, 0, 0.376) 0%, rgba(0, 0, 0, 0) 50%)` | Top wash on card images so the white category badge holds on any still |
| Lead Caption Scrim | `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)` | Foot wash under the lead feature capitals, darkest at the bottom edge |

## Typography

### Riforma — The only face in use, from page furniture to headlines: a crisp contemporary grotesk by Lineto. Headlines sit at 500 with slight negative tracking, reading text and dates at a computed 300. No 300 face is served, so those render from the RiformaLLWeb-Regular file, and computed 600 renders from Bold. The italic is used for pull quotes and film titles in prose.
- **Substitute:** Helvetica, Arial
- **Licence:** commercial; buy a licence from its foundry, or use the substitute
- **Weights:** 300, 400, 500, 600
- **Sizes:** 10px, 12px, 13px, 14px, 16px, 17px, 18px, 20px, 22px, 24px, 30px, 40px, 41px, 42px, 153px
- **Line height:** 1.00, 1.07, 1.21, 1.22, 1.27, 1.31, 1.33, 1.36, 1.40, 1.47, 1.60, 1.64, 1.80
- **Letter spacing:** -0.7px at 42px and 24px mastheads; -0.6px at 41px, 30px and 24px headlines; -0.2px at 14px titles; +0.4px at 14px and 12px uppercase labels
- **OpenType features:** `normal`

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| date | Riforma | 300 | 12px | 1.4 | 0px |
| label | Riforma | 500 | 12px | 1.4 | 0px |
| small | Riforma | 300 | 14px | 1.4 | 0px |
| poster-title | Riforma | 500 | 14px | 1.4 | -0.2px |
| overlay-link | Riforma | 500 | 14px | 1.64 | 0px |
| button | Riforma | 500 | 14px | 1.5 | 0px |
| article-body | Riforma | 300 | 17px | 1.8 | 0px |
| article-deck | Riforma | 300 | 17px | 1.47 | 0px |
| newsletter-head | Riforma | 600 | 18px | 1.4 | 0px |
| card-headline | Riforma | 500 | 24px | 1.17 | -0.6px |
| lead-capitals | Riforma | 500 | 30px | 1.27 | 0px |
| article-title | Riforma | 500 | 41px | 1.22 | -0.6px |
| masthead | Riforma | 500 | 42px | 1.07 | -0.7px |
| issue-numeral | Riforma | 500 | 153px | 1.4 | 0px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1510px
- **Section gap:** 20px
- **Card padding:** 12px
- **Element gap:** 16px

### Border Radius

- **outlined-buttons:** 2px
- **images:** 0px
- **cards:** 0px
- **inputs:** 0px

## Components

### Publication Top Bar
**Role:** Site navigation

A 51px Paper #ffffff bar with a 1px Wall Gray #eaeaea bottom rule. Black MUBI wordmark with nine-dot grid at left, then Now Showing in Riforma 14px/500 uppercase at +0.4px, Nav Gray #7d7d7d, 12px 15px 0 padding. Search, Log In and menu sit at right. It hides on scroll down and returns on scroll up.

### Notebook Masthead
**Role:** Home page title and search

Centred Riforma 42px/500/45px Notebook at -0.7px in Screening Gray #323232, with a 13px/400/18px Byline Gray #9b9b9b line below. Under it a 500x38px search input, 1px Field Rule #c8c8c8 border, 0px radius, 0 30px 0 8px padding, 16px/400 placeholder. A small 13px/400 Explore link sits at far right.

### Lead Feature Banner
**Role:** Top story

A 1510x450px cover-cropped still at 0px radius. A 113px caption block at the bottom holds centred Paper #ffffff text 1000px wide: Riforma 30px/500/38px capitals and a 14px/300/21px deck, over linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%). The whole banner is one link.

### Print Promo Strip
**Role:** Magazine advertisement in the feed

A 1510x183px image link 20px below the lead feature, square-cut, with type baked into the artwork: a barcode-marked NOTEBOOK logotype at left and In Print, Subscribe Now at right. It reads like a printed advertisement between editorial rows and has no live text or button.

### Stacked Story Card
**Role:** Home grid item

A 366px column on Paper, 8px side padding and 44px below. A 366x183px cover still at 0px radius, 12px/500 Paper badge at top left over a soft top wash, then a Riforma 24px/500/28px Ink #000000 headline at -0.6px with 10px 0 7px padding, a 14px/300/19.6px deck, author and 12px/300 uppercase date, closed by a 1px Wall Gray rule.

### Newsletter Band
**Role:** Email signup

A full-width 224px Newsletter Mist #f6f6f6 band with 50px top padding. Centred Riforma 18px/600/25.2px uppercase in Screening Gray #323232, a 13px/300/18.2px line, then a joined email input with a 1px Ink #000000 border and an 88x40px Marquee Blue #001489 Join button in 14px/500/21px white uppercase, radius 0px.

### Featured Still Card
**Role:** Large story tile

A 732x374px Image Well #111111 tile holding a cover still at 0px radius, with Riforma 30px/500/38px white capitals at -0.6px over a linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.376) 100%) foot wash. Two columns repeat under a centred Featured on Notebook heading in 16px/500/22.4px uppercase Byline Gray #9b9b9b with 30px 0 padding.

### Outlined Show More Button
**Role:** Secondary action

A 124x51px transparent button with a 1px Control Gray #666666 border, 2px radius and 14px 16px padding. Riforma 14px/500/21px uppercase in Control Gray #666666. It sits centred under the home grid to load more stories, with no fill and no shadow at rest.

### Explore Overlay Panel
**Role:** Publication index

A full-width Screening Gray #323232 panel opening below the nav, 33px 0 padding. Centred two-tone 24px/500/24px Notebook Explore heading, then three 14px/500 columns: Byline Gray #9b9b9b labels over Paper #ffffff links at 23px line-height that underline on hover. A 109x51px Close button has a 1px white border, 2px radius and 14px 30px padding.

### Split Poster Card
**Role:** Tag page grid item

A 366x177px card on Wall Gray #eaeaea, split into a 183px poster crop and a 183px Paper #ffffff panel with 12px padding, both 0px radius. Riforma 14px/500/19.6px Screening Gray #323232 title at -0.2px, 12px/500/16.8px Byline Gray #9b9b9b author, and a 12px/300 uppercase date pinned low. 8px side padding and 12px below.

### Tag Page Pager
**Role:** Pagination

A centred row of 28x34px buttons with 7px 0 padding at the foot of the Wall Gray #eaeaea field. Riforma 16px/400 numerals in Control Gray #666666; the current page gets a Paper #ffffff fill while the rest stay transparent. No borders, and no rounding at 0px.

### Article Header Block
**Role:** Article title and metadata

In the 661px column under a two-tone page heading: Riforma 41px/500/50px Ink #000000 H1 at -0.6px, a 17px/300/25px Byline Gray #9b9b9b deck with 12px 0 28px margin, then a 14px/500/19.6px Ink author, a small bullet and a 12px/300/18px uppercase date at +0.4px, closed by a 1px Wall Gray #eaeaea rule.

### Reading Column
**Role:** Article body

A 661px column of Riforma 17px/300/30.6px Screening Gray #323232 paragraphs with 21px vertical margins. Inline links take Marquee Blue #001489 with no underline at rest, film titles run italic, and posters fill the full column width at 0px radius, 661px wide and often taller than the viewport.

### Pull Quote Bar
**Role:** Quoted passage

A 661px blockquote with 23px left padding and 21px vertical margins, in Riforma 17px/300 italic at 27.2px line-height, Screening Gray #323232. An absolutely positioned 4px Screening Gray #323232 bar runs down the left edge, inset 6px at the top and 5px at the bottom. No fill, no border and no quotation glyph.

### Related Films Sidebar
**Role:** Article film reference

A 189px column 94px right of the reading column, led by a 188px search input with a 1px Field Rule #c8c8c8 border. Below, a 14px/500 Byline Gray #9b9b9b Related Films label, a square-cut still 189x106px, a 14px/500/19px uppercase film title in Screening Gray #323232 and a 12px/300/16.8px capitalised director.

### Magazine Subscribe Button
**Role:** Print sales action

A 169x44px Issue Red #d71b1d button with 2px radius, no border and 12px 16px padding, with Riforma 16px/500 uppercase white text. It sits centred on the full-bleed magazine page, the single place a filled red control appears, below a 20px/500/28px white offer. Measured on the magazine page, which the cover does not film.

### Subscribe Nudge Card
**Role:** Promotional corner card

A 347x109px Paper #ffffff card fixed at bottom left, 20px 14px 16px padding, 0px radius, shadow rgba(0, 0, 0, 0.2) -10px 10px 17px 0px. It holds a Riforma 14px/500/16px uppercase line and a close control. MUBI shows it to visitors; it is closed off camera in the cover, so it never covers the content.

## Do's and Don'ts

### Do
- Set every word in Riforma, using weight 500 for headlines, labels and buttons and computed 300 for reading text.
- Set home stories in four 366px columns with 16px gutters, each a 366x183px square-cut still over a 24px/500/28px Ink #000000 headline at -0.6px.
- Set article body at 17px/300 with a generous 30.6px line-height in Screening Gray #323232 inside a 661px column.
- Use two tones for page headings: Byline Gray #9b9b9b for Notebook, then Ink #000000 for the section name, at 24px/500.
- Set tag pages on a Wall Gray #eaeaea field, with 366x177px cards split evenly into a poster crop and a 12px-padded Paper #ffffff panel.
- Use pull quotes with a 4px Screening Gray #323232 bar and 23px indent, in 17px/300 italic at 27.2px line-height.
- Keep outlined buttons 51px high with a 1px border, 2px radius and uppercase 14px/500 labels.

### Don't
- Do not add a second typeface; contrast comes from weight, size and gray level within Riforma alone.
- Do not round images or cards; every still, poster and panel stays at 0px, and only outlined buttons take a 2px radius.
- Do not spread Marquee Blue #001489 across headings or panels; it belongs to the Join button and inline article links.
- Do not use Issue Red #d71b1d on editorial pages; it stays on the print magazine page with the Subscribe Now button.
- Do not put shadows on story cards; separate them with white space or the Wall Gray #eaeaea field.
- Do not centre article text; only the masthead and page headings centre, and the 661px reading column runs left-aligned beside a 189px film sidebar.
- Do not underline links in article prose at rest; Marquee Blue #001489 alone signals them, and underlines appear on hover in the Explore overlay.

## Elevation

- **Subscribe Nudge:** `rgba(0, 0, 0, 0.2) -10px 10px 17px 0px`

## Surfaces

- **Paper** (`#ffffff`) — Page canvas, navigation, reading column and poster-card text panels.
- **Newsletter Mist** (`#f6f6f6`) — Single full-width newsletter band on the home page.
- **Wall Gray** (`#eaeaea`) — Tag-page field behind poster cards, and the footer.
- **Screening Gray** (`#323232`) — Full-width Explore overlay below the nav.
- **Image Well** (`#111111`) — Dark fill behind large Featured stills while they load.

## Imagery

The content is the art direction: film stills and movie posters from across cinema history, shown large with no treatment beyond the crop. Expect a stop-motion Pinocchio against painted scenery, sepia silent-film portraits, black-and-white production stills, and a wall of graphic posters from bronze-foil Faust to a riotous red woodcut. Images are cut square at 0px with object-fit cover, and articles show posters at full column width of 661px. White category badges sit over a soft top wash. Icons are thin gray line glyphs for search, menu and comment counts, and the MUBI wordmark with its nine-dot grid stays black.

## Layout

Every page hangs from a 51px white nav with a 1px rule, then a centred masthead. The home page stacks a 1510x450px lead feature with overlaid capitals, a 1510x183px print banner, four-column rows of 366px story cards, a 224px newsletter band and a Featured section of 732x374px stills. Tag pages replace this with a 1268px Wall Gray field holding four columns of split poster cards above a pager. Articles use a 661px reading column at left of centre with a 189px Related Films sidebar 94px to its right. The nav hides on scroll down and returns on scroll up. At 390px the home grid becomes one column, the article H1 falls to 36px/42px and the sidebar no longer sits beside the text.

## Similar Brands

- **The Criterion Collection** — Shares a film-first editorial design where posters and stills carry the colour on a very plain page.
- **Sight and Sound** — Also a serious film publication pairing critical essays with a strong grid of cinema imagery.
- **Film Comment** — Same mix of long-form criticism, festival coverage and restrained, type-led article pages.
- **Little White Lies** — Comparable independent film magazine presence with print issues promoted beside daily online articles.
