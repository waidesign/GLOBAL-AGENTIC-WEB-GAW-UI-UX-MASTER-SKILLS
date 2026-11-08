---
name: "taste-skill"
description: "tasteskill 2.5.1, the anti-slop frontend skill. Builds professional company websites at the level of figma.com and x.ai: plain copy in a voice of its own, one system, one section per screen, equal edges, real photographs and real product UI (licensed stand-in photographs when the client has none; a product render only when the brief asks for 3D), a hero entrance and one or two dealt moments on every page, shader effects and scenes only on tech, gaming and software pages, quiet micro-interactions, and a checker and finish gate that enforce it in a real browser. Use this whenever you build, design, redesign, restyle, polish or review a landing page, company, product, shop, cafe, hotel, studio, SaaS, AI, developer-tool or game site, as static HTML/CSS or inside an existing React, Next.js, Vue, Svelte, Astro or Tailwind project, or when the user says a page looks generic, templated or \"AI-made\"."
license: "MIT"
metadata:
  gaw-title: "design-taste-frontend"
  gaw-category: "ui-ux"
  gaw-author: "leonxlnx"
  gaw-version: "1.0.0"
---

# tasteskill 2.5

Build the website a good company would ship: it says plainly what is sold, shows the real thing on
every screen, and looks made for this client, not from a template and not like an art piece.
figma.com and x.ai are the bar (in words: `layout-v4.md` section 1).

`<skill>` is this folder. It needs Node 22+ and Chrome, Edge or Chromium (ffmpeg optional).

## House rules

These nine win over everything else in this skill.

1. **No caption or description under any image, render or visual.** Licence credits go in one
   footer line.
2. **Every visual renders, never an empty ground,** at 1440, 1024, 768 and 390.
3. **One section per screen:** the hero alone on the first screen, every section exactly one or
   two screens tall at 1440x900, no second section heading peeking in. The one exception is a
   live `photo-chapters` section, three or four screens, set by the moment.
4. **Equal left and right content edges.**
5. **Hover micro-animations:** a linked card lifts 2px, a photo zooms 1.02-1.03 inside its frame,
   buttons step on hover and press on click, underlines draw, card loops cycle in 2.5-4 s, repeat
   and restart on hover. The motion layer does it; never strip or override it. No tilt, carousels
   or timed tabs. Every hero enters once on load (`data-enter`), and every page carries one dealt
   moment, two on a long page (the gate holds both).
6. **More and better real photographs where they fit;** nicer backgrounds; better heroes, layouts
   and fonts.
7. **Real full-colour icons** (a known product's real icon, never a drawn one); small diagram
   visuals in cards (a hub with branches; one input, a main processor, three parallel lanes;
   pulses running along the lines).
8. **The big award-site scenes and creative moments are part of the skill:** every page deals its
   moments (photo- and type-led off tech), but shader effects and scenes only where the trade has a
   technical subject (tech, AI, developer tools, gaming, fintech, hardware), never on a local cafe,
   bakery, guesthouse or shop: those get photographs.
9. **Addresses:** street and district only (no street given: the district), no house number, postcode or coordinates; no register
   or VAT numbers; no phone in a real format; contacts on `.example`.

## 1. The kind of business decides everything

Write the kind on the plan's first line and declare it on the page: the page type on
`<html data-type>` and `<meta name="page-type">` (the same value), and `<meta name="site-kind">`;
a place adds `<meta name="page-kind" content="place">`. The dealers take the last column
(`start.mjs --page`, `moments.mjs --page`), the hero dealer the page type; `consistency.mjs` reads
the metas.

| Brief | page type | site-kind | kind |
|---|---|---|---|
| App, SaaS, AI, developer tool, fintech or banking app, a studio selling its own software | software | software | software |
| A game, a studio launching its game | software | gaming | gaming |
| Hardware or a tech device (a drone, a robot arm, a keyboard) | product | tech | tech |
| Any other physical product or brand (a chair, a bike, coffee beans sold online) | product | other | product |
| People are hired: clinic, law firm, agency, creative studio, trade | service | other | service |
| People come to it: cafe, bar, bakery, restaurant, guesthouse, small hotel, shop, florist, bike shop, gym, local studio | place | other | place |

A maker that also opens its door or teaches (a ceramics studio, a bakery with a web shop) is a
**place**; its web shop becomes the goods section. It is a product only when nothing happens at the door.

"Tech" below means site-kind software, gaming or tech; "other" is everything else. Effects,
scenes, loops, counts, CSS grounds, dark pages and dark heroes are tech only. An other page is
photographs, flat colour, type, real icons, the hero's entrance, its dealt moment (photo- or
type-led, `moments.md`) and the hover layer.

## 2. The page plan by kind

The full plans, deal lists and section order: `references/sections.md`.

- **Place** (a cafe, bakery, guesthouse, shop). Photographs lead: 12 to 20 on the full page, 8 to
  12 compact, under 8 frames the 3-screen short page, whatever the trade; no client photographs:
  the draft path and a live search (`photos.md`), then count; the palette dealt by trade. The hero
  a photograph whenever a frame fits (a remote place: its region's landscape), the visit block on
  screen two, the offer, the place, orders or booking.
  **Variety without effects** (`sections.md` section 4): the offer and the place deal different
  compositions, never two sections round one picture; one type moment (the address or name set large); one main action a screen; list text 16px. Flat grounds, square
  photographs, one button style, the phone bar, the dealt moments; no effect, ground, loop,
  fragment, diagram or tab.
- **Product and service** (site-kind other). Photographs lead: the product, the people, the rooms,
  the work, two or more a screen on a product page. Real icons for the tools a studio uses; one
  still diagram at most; flat grounds and one brand band. No shader effect, print, grain, gradient,
  scene or loop (the dealt moments only); WebGL only for a product render the brief asks for. **A
  physical product with no photographs is shown in photographs:** stand-ins of the same kind of
  thing from `photos.mjs search`, each listed in the report, on the full product page; a render
  (`assets/objects/product-render`, stills) only when the brief asks for 3D or a render; never a
  drawing, mood stock or a set of props (`sections.md`, Product).
- **Every product page** (photographed, in stand-ins or rendered on a 3D ask, hardware too; the bar is Figure and 1X;
  `sections.md`, Product): the product **big** where it stands
  whole (most of its frame, or on the ground at anchor scale), never mid-size in a grey rounded
  panel on a grey ground; **a different picture each section**, never one view twice; **every headline promise pictured** (a family bike shows the child bench); dealt
  compositions, no structure twice, one contrasting ground; the **swatch changes the picture**,
  every colour shown once; **no fact twice**; buttons step and press (rule 5).
- **Tech** (software, gaming, hardware). The client's own subject leads at true size. Software: its
  own UI as live HTML showing what it works on (a code-review tool: a red and green diff with its
  Accept action) in one `app-frame`, never a generic dashboard or only fragments on panels; cards:
  fragments on lit panels, pulsing diagrams, real icons. Hardware: its photographs, else stand-in
  photographs of its kind (a render only when the brief asks for 3D), never a split hero of only
  an order form or a drawn SVG. A game: its name in the h1, a launch line, its world as full-bleed
  key art (else its name set large over stand-in photographs of its setting), an effect never in
  its place (`sections.md`, Gaming). **60 to 80 words a screen** outside UI mocks (`copy.md`). By
  deal: **one effect** (a shader ground in the hero or the one `[data-visual]` frame, a WebGL
  part, an object or one big scene) and **one or two moments** in their own sections; four live
  WebGL contexts at most; no card moves with the scroll (`effects-usage.md`).
- **One object never carries the page.** The product or hero object whole leads the hero and **two more sections at
  most**; another kind of visual the brief supports carries the rest (`sections.md` section 1,
  its table): a game's world and crew; hardware's use at the bench, its parts close up; a still
  diagram card, a type moment, a context photograph where the trade allows.
- **The client's own assets get slots.** A trailer, key art, screenshots, CAD renders or a motion
  video the brief names each get a frame that reads finished now (a real `<video>` with a stand-in
  poster, a play control only when there is a page or file to play, three to five stand-in
  photographs of the world, a CAD frame), named in a comment for the client's file, never empty
  (`sections-library.md`, client-slots).

## 3. What serves which page

Open the reference of every asset family the page uses first. A dash means never.

| Need | Asset | Software, gaming | Hardware | Product, service | Place | Reference |
|---|---|---|---|---|---|---|
| Heights, edges, heroes, type | `system.css`, `assets/layout` | dealt hero | dealt hero | dealt hero | place hero | `layout-v4.md` |
| Sections and recipes | `starter.html` | its plan | product plan | its plan | place plan | `sections.md`, `sections-library.md` |
| Tokens, grid, buttons, nav, footer, colour | `system.css`, `system.js` | yes | yes | yes | place tokens | `system.md` |
| Forms, keyboard, head and share tags | `starter.html`, `system.css`, `system.js` | yes | yes | yes | yes | `system.md` |
| Copy, contacts, credits | `scripts/copy-lint.mjs` | yes | yes | yes | yes | `copy.md`, `copy-voice.md` |
| Hero entrance, hover, press, focus, nav, tabs | `assets/motion` | yes | yes | yes | yes | `motion.md` |
| Card loops, a count | `assets/motion`, `assets/ui` | yes | yes | - | - | `motion.md`, `cards.md` |
| Photographs | `scripts/photos.mjs` | people, customers; a game's art, else stand-ins of its setting | lead | lead | lead, 12-20 | `photos.md` |
| Real tool, app and file icons | `scripts/icons.mjs` | yes | yes | tools really used | - | `icons.md` |
| Feature cards, UI fragments | `assets/ui` | lead (gaming: none) | its app | an app the client runs | - | `cards.md` |
| Diagram cards (hub, lanes, pulses) | `assets/diagrams` | 0-2, pulsing | 0-2, pulsing | 0-1, still | - | `diagrams.md` |
| CSS grounds | `assets/backgrounds` | 0-2 dealt | 0-2 dealt | flat tokens | flat tokens | `backgrounds.md` |
| Shader grounds | `assets/effects` | the one effect | the one effect | - | - | `effects-usage.md` |
| Creative parts (`fx-*`) | `assets/components` | yes | yes | `fx-photo` plain, `fx-map` still | `fx-map` still | `effects-creative.md` |
| Objects and prints | `assets/objects` | one, as the effect; a render when the brief asks for 3D | its render when the brief asks for 3D | its render when the brief asks for 3D | - | `effects-objects.md` |
| Award-site moments | `assets/moments` | 1-2 | 1-2 | 1-2 (photo, type) | 1-2 (photo, type) | `moments.md` |
| Big scenes | `assets/scenes` | 0-1 | 0-1 | - | - | `scenes.md` |
| Speed and weight | `scripts/perf.mjs` | yes | yes | yes | yes | `perf.md` |

Read `copy.md`, `copy-voice.md`, `system.md`, `layout-v4.md` and `sections.md` in full before the first page.

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [4. The run](references/4-the-run.md) (~2981 tokens)
- [5. Checklist](references/5-checklist.md) (~1359 tokens)
- [6. Never; References](references/6-never.md) (~231 tokens)
