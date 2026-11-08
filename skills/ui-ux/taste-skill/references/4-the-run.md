<!-- Part of the taste-skill skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## 4. The run

0. **The stack.** An empty folder builds a static page: copy `<skill>/assets` into `assets` and
   start from `assets/starter.html`. An existing project builds in its own stack, its components
   taking the starter's markup and classes, with the kit copied into its public folder
   (`public/assets`) and loaded from there as plain files. A brief that asks for Next.js builds a
   static export (`output: 'export'`), checked on its built page (`--root out`).

1. **Read the brief.** Write down the kind (section 1), what is sold, who buys it, the one main
   action (the transaction: Book a room, Order a cake, Start a free trial; a place with neither:
   Get directions) and the real material: logo, screens, photographs, prices, address, hours.
   Then arm the finish gate, before any page exists:

   ```bash
   node <skill>/scripts/gate.mjs --start index.html --kind <kind> --category "<what is sold>" --primary "<main action>"
   ```

   A framework build names its dev server's URL (`--start http://localhost:5173/`) or its built page
   (`--start dist/index.html --root dist`; a Next.js export: `out`) in place of `index.html`, and
   rebuilds before every gate run.

2. **Write all the copy first,** with the copy layer (`copy-voice.md`: the fact sheet, the voice
   card on the plan, the page's shape, the device budget; a register from `copy-registers.md`, the
   moves of `copy-moves.md`) within the rules of `copy.md`: the h1 names the category and the buyer or the place (a game: its name and genre),
   one hard fact on the first screen, a noun in every heading, buttons as a verb and an object.
   Nothing is invented but a coined brand name (searched first, the result kept in `names.json`
   beside the page) and, on a place, plausible hours and prices, each marked `data-assumed`
   (`copy.md`, What may be assumed). A draft kept in a `.md` file lints the same way as the page
   (the voice card and part labels are skipped).

3. **Plan the page as screens.** Line 1: the kind. Line 2: the deal (step 4), with one sentence on
   why the palette fits the trade. Then one line per
   section: its id, its one idea, its picture and its kind (object, use, parts, world, slot, diagram, type; three object lines at most), its
   screens (1 or 2, from its content height, `layout-v4.md` section 2), which section holds a
   moment and why it moves (on tech also the effect or the scene). Pick the photographs now (`photos.md`); their count,
   stand-ins included, sets a place's length (section 2). Then read `cards.md` and the recipe of
   every id you use in `sections-library.md`.

4. **Deal, never choose by taste.** Each command keeps a history, so pages differ:

   ```bash
   node <skill>/assets/layout/deal.mjs --type <page type> --has <photo,ui,film,object,setting> --history .taste-skill/layout-history.json   # the hero; a game adds --kind gaming, hardware --kind tech
   node <skill>/scripts/start.mjs deal --page <kind> --trade <trade> --history .taste-skill/history.json    # three palettes made for the trade, three pairings: take the first; add --axis after a word or editorial hero
   node <skill>/scripts/start.mjs css --page <kind> --palette <id> --type <id> --radius soft --history .taste-skill/history.json
   node <skill>/scripts/start.mjs brand --page place --bg "#.." --ink "#.." --accent "#.." [--surface "#.."] [--muted "#.."] --type <id> --radius soft   # the client's own colours (a logo, a painted shopfront), in place of css
   node <skill>/scripts/moments.mjs pick --page <kind> --count 1|2 --fits section,statement --photo --history .taste-skill/history.json   # every kind
   node -e "for(const l of process.argv.slice(1)){const o=l.split('|');console.log(o[Math.floor(Math.random()*o.length)])}" <the kind's lists, below>
   ```

   Run every command from the project folder (the deal arms the gate in the folder it runs in, or
   joins the build already open one or two folders up). The
   lists, in order nav, footer, close, rhythm, buttons, mark (`sections.md` sections 2 and 3):
   - software: `"nav-mega|nav-cards|nav-centre" "footer-dark|footer-statement|footer-columns" "close-type|close-word" "dark-band|surface-pairs|space" "solid|pill|tonal|arrow" "wordmark|initial|arc|ring|stack|dots"`
   - gaming: `"nav-mega|nav-centre|nav-cards" "footer-dark|footer-statement" "close-word|close-type" "dark-band|media-band|space" "solid|pill|block" "wordmark|initial|arc|ring|stack|dots"`
   - product and hardware: `"nav-cards|nav-split|nav-mega" "footer-columns|footer-dark" "close-photo|close-type|close-word" "dark-band|brand-band" "arrow|solid|block|pill" "wordmark|initial|arc|ring|stack|dots"`
   - service: `"nav-mega|nav-split|nav-centre" "footer-visit|footer-dark|footer-columns" "close-type|close-photo" "surface-pairs|dark-band|space" "solid|tonal|block|arrow" "wordmark|initial|arc|ring|stack|dots"`
   - place: the whole line in `sections.md` section 4, Place (The deal), read in its order.

   A product or hardware with no photographs deals with `--has photo` for its stand-ins;
   `--has object` only for a cut-out or a render the brief asks for (always the `product` hero, its
   widest view across the wrap, no box); a game without art files passes `--has setting` (the
   `photo` hero, its name over a stand-in of its setting; a game always passes `--has`). A product
   page is dealt only the product, photo and film heroes. A place's hero is printed, never dealt (`--type
   place`). A dealt part that needs a photograph the page lacks is dealt again (`sections.md` section 2). Take the
   first palette and the first pairing printed (the next only when the first clashes with the
   client's own logo or photographs, or the pairing fails `hero-lines`, said on plan line 2); the client's own colours go through
   `start.mjs brand` instead (`sections.md` section 4, Look); never violet: deal again. Keep the `:root` block as printed. Radius: `sharp` for fintech and developer tools, `soft` by default,
   `round` for consumer apps, square on a place. On tech only: the lit ground (`<html data-ground>`:
   `sand|sky|sage` through the one-liner), the CSS grounds (`backgrounds.md`) and the one effect
   (`effects-usage.md`). Write every result on plan line 2 and in
   the comment at the top of `<body>`, and build exactly that (a short page drops what it has no section for: `sections.md` section 4).

5. **Build.** In `starter.html`: set `<html lang data-type data-radius data-buttons data-motion>`
   (lang: the brief's language), the three metas, the head block (title, description, og, icon,
   theme-color: `system.md`, Head) and the nav class; keep the skip link and the `m-enter` head
   line; copy only the `<section class="hero …" data-enter>` of
   `assets/layout/hero-<id>.html` (never its nav, other sections, footer or credit line; every word
   and picture becomes the client's); move the dealt close and footer out of their `<template>`s
   and delete the rest. Every section is `main > section` with
   one `.wrap`, its h2 first, `--h: 1` or `2`. Build each to its recipe with the system's classes
   and tokens; write page CSS only where a reference says page CSS (inside a visual, `--p-h`,
   `.wall`, `.rail`, `.device`). Paste UI from `assets/ui/<name>/fragment.html` and rewrite every
   name, number and logo to the client's (kit icons become `data-icon`, `cards.md`); a diagram card is `data-diagram="<preset>"`
   with the client's labels; run `icons.mjs scan index.html --out assets/icons --colour` last, so every icon
   the page names is a local file. Mount an effect, object, moment or scene exactly as its
   reference says, never from your own script. A moment's section is copied from
   `assets/moments/_demo/in-page.html` (place: photo-chapters, word-highlight) or
   `in-page-service.html` (pinned-chapters, picture-develops film); a moment's own `demo.html` shows
   it alone and is not a page model. A form is the starter's `booking-form` (`system.md`,
   Forms). Credits: the one footer line from `photos.mjs credits`, once the markup uses the
   photographs (it reads the page). Copy the hero's tile from `shoot.mjs` beside the page as `share.jpg`.

6. **Check and look.** Only the skill's scripts, each running one headless Chrome with WebGL on the
   CPU, closed by its own PID, one at a time in the foreground with a 10-minute timeout; never in
   the background, a windowed browser or a browser tool.
   Each serves the page file itself over http on 127.0.0.1 (never `file://`), so no server is needed;
   for a built page whose links start at the site root (`/_astro/page.css`), pass `--root` with the build folder (`dist`).
   `--profile <dir>` is the Chrome profile: a folder of its own in the OS temp folder or in the
   project's `.taste-skill` folder (`.taste-skill/chrome-check`), never outside the project (no
   `../`); a relative one that leads out of it is replaced by `.taste-skill/chrome-<script>`. Then:

   ```bash
   node <skill>/scripts/copy-lint.mjs index.html --kind <kind>
   node <skill>/scripts/consistency.mjs index.html --widths 1440,1024,820,768,390 --rhythm-widths 1440,820,768,390 --profile <dir> --page <kind> --category "<what is sold>" --primary "<main action>"
   node <skill>/assets/layout/check.mjs --url index.html --profile <dir> --sizes 1440x900,1024x768,820x1180,768x1024,390x844 --shots shots/layout
   node <skill>/scripts/shoot.mjs --url index.html --w 1440 --out shots/1440.png --profile <dir>
   node <skill>/scripts/perf.mjs index.html --profile <dir>
   ```

   Shoot 1024, 820x1180, 768x1024 and 390 as well. Every `check.mjs` finding fails the page (no `--no-stress`).
   copy-lint opens no browser and takes under a second. Fix every FAIL (a copy-lint WARN too, or say
   why it stays) and read the copy aloud (`copy-voice.md` section 6); shoot again and read every
   screenshot against the checklist. In the fix rounds run `consistency.mjs --quick --widths
   1440,390`. Then the gate, which runs the checker at 1440 and 390 every time, walks the page at 320
   for overflow, collide and tap-size, and runs copy-lint, whose FAILs block like the checker's:

   ```bash
   node <skill>/scripts/gate.mjs index.html
   ```

   Fix what it lists and run it again until its last line is `GATE: PASS` or `GATE: OPEN`, three
   rounds at most (in Claude Code it also runs when you finish; a stop before your first gate run is
   no round, and to ask the user something after a block, just stop again). When the user tells you
   to stop, or to ship the page as it is, run `gate.mjs --done "<what they said>"` (`GATE: DONE`)
   and report the open FAILs.
   `GATE: SETUP` (no page yet, a framework's source shell, a page that is not local): arm what a
   browser can open (step 1) and run it again. `GATE: ERROR` (the checks could not run) or
   `GATE: OFF`: put the line in the report and finish; do not rerun. Never edit
   the kit's files or hide anything from the checker. A FAIL you judge false is waived in
   `.taste-skill/waivers.json` with its reason, never fixed by gaming the check (`references/gate.md`);
   a word from the client's own copy that copy-lint FAILs is waived hit by hit, the brief as the reason
   (a word inside the client's name, as the logo or the title writes it, is not counted: one WARN).

7. **Report:** the `GATE:` line first, then every waiver with its reason and every open FAIL; the
   kind, the deal (palette and why it fits, pairing, hero, grounds, effect, moments, scene); the
   voice card in one line and every copy-lint WARN kept, with why; the checker, layout and perf
   results; what you could not check; every assumed fact (the checker's `assumed` list) and the
   coined name's search; the form's `.example` stand-in and the canonical domain still to come; the photographs and art the client must supply, every
   stand-in frame among them (library and live search); every client slot, its file and its stand-in.
