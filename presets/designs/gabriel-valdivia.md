---
id: "gabriel-valdivia"
name: "Gabriel Valdivia"
theme: "light"
category: "saas"
tags: ["gabriel-valdivia","light","saas","web-app"]
vibe: "gallery wall, quiet ink. Hang large rounded product films on a bare white wall and let thin black display type and gray captions do the talking."
liveUrl: "https://www.gabrielvaldivia.com/"
previewUrl: "https://ui.gradientdeck.com/styles/gabriel-valdivia"
lastVerified: "2026-11-08"
---

# Gabriel Valdivia — Style Reference
> gallery wall, quiet ink. Hang large rounded product films on a bare white wall and let thin black display type and gray captions do the talking.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Gabriel Valdivia is a white-wall portfolio where the only colour comes from the work itself. Ink #000000 headlines in Inter Display run at weight 400 even at 100px, tracked to -3px, so the voice reads calm and assured rather than loud. Below the hero, a rail of 16px-rounded product films carries smoke-glass quote panels and white-outlined mono tags, then the page settles into wide unruled white: a portrait intro, a numbered approach list split by single gray rules, and a Mist Wash #f7f7f7 mail form with a 40px radius. Gray is the whole secondary system: Graphite Muted #666666 for navigation and labels, Body Ink #191919 for paragraphs, and uppercase SF Mono for the footer and tags.

## Colors

| Name | Value | Role |
|------|-------|------|
| Paper | `#ffffff` | The whole page canvas, plus project titles and tag text reversed on hero films |
| Ink | `#000000` | Every display headline, section title and form value — pure black is the site's only identity colour, so the work supplies the hue |
| Body Ink | `#191919` | Long paragraphs in the intro and approach rows — black at 90% so reading text sits a half-step under headlines |
| Graphite Muted | `#666666` | Wordmark, navigation links, form labels, Copy and See all links, footer mono text and social icons (black at 60%) |
| Ash Subtle | `#999999` | Numerals 1–4 in the approach list and other lowest-emphasis marks (black at 40%) |
| Mist Wash | `#f7f7f7` | Black at 3%: the mail-form panel, work-card backgrounds and media placeholders — the only tonal step off white |
| Hairline | `#ebebeb` | 1px black-at-5% borders on work cards and the dividers between mail-form rows |
| Rule Gray | `#cccccc` | The single 1px dividers between numbered approach rows and the Send pill outline (black at 20%) |
| Pebble Button | `#ececec` | Fill of the floating 40px circular menu button that follows the page at top right |
| Smoke Glass | `#c6c6c6` | Black at 20% as the quote-panel tint over hero films; the hex is that tint over white, use rgba(0, 0, 0, 0.2) on media |
| Media Shade | `linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7))` | Bottom scrim on hero project films, so Paper titles, captions and tag pills stay legible over any footage |

## Typography

### Inter Display — Every heading, from the 100px/400 hero at 105px line-height and -3px tracking down to 30px row titles and the wordmark. It never goes above weight 400; scale and tight tracking alone carry hierarchy, which keeps the portfolio's voice quiet and sure. The site loads no webfont, so it renders only where Inter Display is installed and falls back to Inter, then system-ui.
- **Substitute:** Inter, system-ui, sans-serif
- **Weights:** 400
- **Sizes:** 30px, 32px, 48px, 80px, 100px
- **Line height:** 1.05, 1.10, 1.30
- **Letter spacing:** -3px at 100px; -1.6px at 80px; -0.96px at 48px; -0.64px at 32px; -0.2px to -0.9px at 30px

### Inter — Navigation, body copy, form fields, quotes and buttons. Set large and plain: 20px/400 is the interface size and 26px/400 at 36.4px line-height carries the intro and approach paragraphs, all with a flat -0.2px tracking and a single 500 weight for attributions. Not loaded as a webfont; without a local Inter it renders as system-ui (Segoe UI on Windows, SF Pro on Apple).
- **Substitute:** system-ui, sans-serif
- **Licence:** open (Open licence (Google Fonts)); free to use and self-host
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 20px, 26px
- **Line height:** 1.40
- **Letter spacing:** -0.2px at every size (16px to 26px)

### SFMono-Regular — Uppercase 14px/400 utility layer: the footer copyright and ACTIVITY, CHAT, CREDITS links, and the white-outlined category tags on hero films, tracked in to -0.42px. It is the platform mono stack, so it renders as SF Mono on Apple and Consolas or Menlo elsewhere.
- **Substitute:** SF Mono, ui-monospace, Menlo, Monaco, Consolas, monospace
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.40, 1.43
- **Letter spacing:** -0.42px at 14px

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
|------|--------|--------|------|-------------|----------------|
| mono-label | SFMono-Regular | 400 | 14px | 1.43 | -0.42px |
| attribution | Inter | 500 | 16px | 1.4 | -0.2px |
| quote | Inter | 400 | 18px | 1.4 | -0.2px |
| body | Inter | 400 | 20px | 1.4 | -0.2px |
| lead | Inter | 400 | 26px | 1.4 | -0.2px |
| wordmark | Inter Display | 400 | 30px | 1.3 | -0.9px |
| row-title | Inter Display | 400 | 30px | 1.3 | -0.3px |
| project-title | Inter Display | 400 | 32px | 1.3 | -0.64px |
| section-heading | Inter Display | 400 | 48px | 1.3 | -0.96px |
| cta-display | Inter Display | 400 | 80px | 1.1 | -1.6px |
| display | Inter Display | 400 | 100px | 1.05 | -3px |

## Spacing & Layout

**Base unit:** 4px

**Density:** spacious

- **Page max-width:** 1400px
- **Section gap:** 160px
- **Card padding:** 40px
- **Element gap:** 16px

### Border Radius

- **media:** 12px
- **cards:** 16px
- **panels:** 24px
- **forms:** 40px
- **pills:** 9999px

## Components

### Wordmark Header Bar
**Role:** Top-level site navigation

A 114px transparent bar with 0 40px padding, no border and no shadow. Set the Gabriel Valdivia wordmark in Inter Display 30px/400 at 39px line-height and -0.9px tracking in Graphite Muted #666666; put About, Work, Notes and More at right in Inter 20px/400, 28px line-height, -0.2px tracking, same gray.

### Display Hero Headline
**Role:** Opening statement

Two lines of Ink #000000 Inter Display at 100px/400 with 105px line-height and -3px tracking, flush left on the 40px gutter, about 120px below the header. No eyebrow, no subhead, no button: the project rail follows directly underneath.

### Project Film Card
**Role:** Hero portfolio carousel slide

A wide 16px-radius video or photo frame with no border and no shadow, with the Media Shade scrim in its lower part. Bottom-left, a Paper Inter Display 32px/400 title at -0.64px tracking, a 20px caption in white at 70%, and a row of Mono Tag Pills. The next card peeks in 40px to the right.

### Mono Tag Pill
**Role:** Project category label on media

A transparent 9999px pill with a 1px solid rgba(255, 255, 255, 0.45) border and Paper text in SFMono-Regular 14px/400, uppercase, 19.6px line-height, -0.42px tracking. Group the tags in a row with about 8px between them; never fill them.

### Smoke Glass Quote Panel
**Role:** Client testimonial over a project film

A 480px-wide panel filled with rgba(0, 0, 0, 0.2), a 24px radius and 24px padding, with no border and no shadow, sitting at the bottom right of a film. Set the quote in Paper Inter 18px/400 at 25.2px line-height, then the attribution in Inter 16px/500 in white at 70%.

### Portrait Intro Block
**Role:** About summary

A 360x480 portrait with a 16px radius in the left column, then a 48px/400 Inter Display statement at 62.4px line-height and -0.96px tracking in Ink. Under it, Body Ink #191919 Inter 26px/400 paragraphs at 36.4px line-height and a Graphite Muted 20px Read more link with a chevron.

### Numbered Approach Row
**Role:** Process and principles list

Three columns: an Ash Subtle #999999 Inter Display 30px/400 numeral, a 30px/400 Ink title at -0.3px tracking, and a Body Ink Inter 26px/400 paragraph at 36.4px line-height. Divide the rows with a single 1px Rule Gray #cccccc line and roughly 64px of vertical padding; no cards, no icons.

### Work Card Rail
**Role:** Selected work strip

A section heading in Inter Display 48px/400 with a Graphite Muted 20px See all link at right, above a horizontal row of 16px-radius Mist Wash #f7f7f7 cards with a 1px Hairline rgba(0, 0, 0, 0.05) border. Inset screenshots under 12px top corners, or let photos fill the card. The row bleeds off both page edges.

### Closing Display Headline
**Role:** Contact call to action

A centered two-line Ink Inter Display headline at 80px/400 with 88px line-height and -1.6px tracking, about 64px above the mail form. It is the only centered type on the page.

### Mist Mail Form Panel
**Role:** Contact form styled as an email

A 720px Mist Wash #f7f7f7 panel with a 40px radius, 40px padding and no shadow. Rows read To, From, Subject, Message: Graphite Muted Inter 20px/400 labels in a narrow left column, borderless 0px-radius transparent inputs, and 1px Hairline #ebebeb rules between rows. A 16px Graphite Muted Copy text button sits beside the address.

### Outline Send Pill
**Role:** Form submit button

A transparent 50px-high button with a 9999px radius, a 1px solid rgba(0, 0, 0, 0.2) border and 10px 20px padding. Ink Inter 20px/400 label at 28px line-height and -0.2px tracking, with no fill and no shadow; hover only changes the colour, over 0.15s.

### Floating Menu Disc
**Role:** Persistent quick-menu trigger

A 40px circle with a 9999px radius filled Pebble Button #ececec (rgba(213, 213, 213, 0.451)), pinned 40px from the top right and holding a small two-line Ink glyph. It stays put while the page scrolls under it; no border, no shadow.

### Mono Footer Strip
**Role:** Site footer

An 80px transparent strip with 20px 0 40px padding across the 40px gutters. Put © COPYRIGHT 2026 at left and ACTIVITY, CHAT and CREDITS at right in Graphite Muted SFMono-Regular 14px/400, uppercase, 20px line-height, -0.42px tracking; center four small #666666 social icons.

## Do's and Don'ts

### Do
- Use Paper #ffffff as the only page canvas and Mist Wash #f7f7f7 as the single raised tone for the mail form and work cards.
- Set the hero in Inter Display 100px/400 with 105px line-height and -3px tracking, left-aligned on the 40px gutter.
- Keep every heading at weight 400; step hierarchy through size alone (100px, 80px, 48px, 32px, 30px).
- Set navigation, form text and buttons in Inter 20px/400 at 28px line-height and -0.2px tracking, in Graphite Muted #666666 for links and labels.
- Give project films and portraits a 16px radius, the quote panel 24px and the mail form 40px.
- Reserve uppercase SFMono-Regular 14px with -0.42px tracking for the footer and white-outlined 9999px tags on media.
- Apply the Media Shade scrim, linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.7)), under any Paper text placed on a film.

### Don't
- Do not introduce a brand hue for buttons or links; the palette is Ink #000000 and grays, and colour comes only from the work.
- Do not bold the display roles to 600 or 700; Inter Display stays at 400 even at 100px.
- Do not add drop shadows to cards, panels or the form; use Mist Wash #f7f7f7 and 1px Hairline #ebebeb borders.
- Do not fill the Send button; it is a transparent 9999px pill with a 1px rgba(0, 0, 0, 0.2) outline and 10px 20px padding.
- Do not box the form inputs; they are borderless 0px-radius fields on the Mist Wash panel, separated by Hairline rules.
- Do not shrink body copy to 14–16px; reading text is 20px, and intro and approach paragraphs are 26px at 36.4px line-height.
- Do not crowd sections; keep 160px between major blocks and 40px page gutters inside the 1400px frame.

## Elevation

The page is flat. Nothing casts a shadow; the only measured box-shadow is a 1px black ring around a device mock inside a work card. Separation comes from one tonal step (Mist Wash #f7f7f7 panels and cards on Paper), 1px Hairline borders at black 5%, single Rule Gray dividers in the approach list, and the photography itself, whose 16px corners frame it against the white wall.

## Surfaces

- **Paper** (`#ffffff`) — The full page canvas, header and footer.
- **Mist Wash** (`#f7f7f7`) — Mail-form panel, work cards and media placeholders.
- **Pebble Button** (`#ececec`) — The floating circular menu button.
- **Smoke Glass** (`#c6c6c6`) — Black-at-20% quote panels laid over project films.

## Imagery

The imagery is the portfolio. The hero rail plays full-colour product films and stills: hands holding phones with app screens, a child's toy camera on grass, fitness app art. Each sits in a 16px-rounded frame with a black bottom scrim, a Paper title, a gray caption and white-outlined mono tags. A testimonial can sit over the film in a 24px smoke-glass panel. Lower down, work cards mix photography, bright illustrated brand art (Twinsi's pink-orange poster) and device mockups on Mist Wash, with screenshots cropped under 12px top corners. The one portrait is a natural-light studio photo with 16px corners. There is no illustration system or decorative graphics; icons are small monochrome gray social marks in the footer and a two-line menu glyph.

## Layout

A single 1400px frame with 40px gutters and 40px grid gaps on an unbroken white page, with 160px between major sections. The header is a 114px transparent bar: the wordmark at left and four 20px gray links at right, with a 40px Pebble Button circle that floats at the top right while scrolling. The hero is a two-line 100px headline set flush left, then a horizontal rail of large 16px-rounded project films (about 1350px wide) whose next card peeks in at the right edge. The page then narrows to inset columns: a 360x480 portrait beside a 48px statement and 26px paragraphs; an Approach list of four numbered rows in three columns (numeral, 30px title, paragraph) divided by single gray rules; a Work rail of Mist Wash cards that bleeds off both edges; and a centered 80px closing headline over a 720px Mist Wash mail form. The footer is one 80px mono line with copyright, centered social icons, and three links.

## Similar Brands

- **Paco Coursey** — Shares a near-monochrome personal site on white, with gray secondary text and no brand colour beyond the work shown.
- **Rauno Freiberg** — Uses the same quiet light canvas, small gray metadata and restrained hover motion for a designer's portfolio.
- **Emil Kowalski** — Same personal-portfolio restraint: black and gray type on white, letting embedded product work supply the colour.
