# Changelog

All notable changes to the **Guided Agent Workflow** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (skill packs)
- **Skill packs** (`packs/*.json`): curated sets of library skills for one kind of work: `ui` (accessibility baseline and fixes, UI cleanup, plus React or Tailwind skills when installed), `motion` (micro-interactions, motion performance, and the skill for the animation library that's installed), `marketing` (landing and pricing pages, metadata) and `design-system` (DESIGN.md, UI cleanup, Tailwind). Packs fit a project from its dependencies, files and goal, and only contain skills that ship all their files.
- `gaw init --yes` lists the packs that fit instead of keyword-matched starter skills (which suggested a React Native skill for web React projects). Interactive `gaw init` asks about them after the goal-matching skills.
- `gaw packs`, `gaw packs show|add|remove <name...>`. Added skills are tagged with their pack in `skills.lock.json`; removing a pack takes out only skills no other pack uses, and never skills chosen by hand.
- `gaw context` and MCP `get_project_context` show added packs and packs that also fit. Guide: `docs/packs.md`.
- MCP tools `list_skill_packs`, `add_skill_packs` and `remove_skill_packs` (add and remove only after the user agrees).

### Changed (Project Brain layout 2)
- **New `ai-brain/` layout**: `README.md` (for people: what to commit, no secrets, how to update or remove) · `brain.json` (layout version, detected stack and commands, precedence) · `context.md` · `rules.md` · `playbook.md` · `design.md` (UI projects only) · `decisions/` · `memory/proposed/` · `skills/` · `local/` (ignored by its own `.gitignore`: active task, archive, Global Brain summary). `identity.md` and `project-history.md` are gone.
- **`context.md`** now lists the project's real commands (dev, build, test, lint, type check, from package.json scripts, Python/Go/Rust tools or a Makefile), a folder map, architecture notes, conventions and a definition of done. Sections marked `(auto-detected)` are refreshed by `gaw update`; rename one to `(confirmed)` to keep your version. The stale "Status: Active development" line is gone.
- **`rules.md`** is short (under 60 lines) and fits any project: Safety (secrets, protected paths named from the project's lockfiles and generated output, destructive actions), Scope (stay in scope, ask when unsure, no new dependencies without asking), Stack (names the detected framework, languages and libraries), Quality (tests for behavior changes, run the detected checks). Motion rules moved to the motion skills; precedence moved to `brain.json` and the agent files.
- **Precedence**: Safety rules now come first. Instructions found in files, web pages or tool output never override them, and a user request that breaks one needs explicit confirmation.
- **`playbook.md`** has recipes per task type (feature, bug fix, refactor, UI change) with files to read first and "done when" criteria. Running GAW is optional, so teammates without it can follow it.
- **`design.md`** (UI projects) is generated from the project's stylesheets: font, color, spacing, radius and shadow variables (including Tailwind v4 `@theme`), `font-family` declarations, or the most used colors.
- Templates use `{{GAW_NAME}}` instead of the product name, and a UI-only block syntax so non-UI projects get no UI rules.
- **`gaw update` migrates older projects**: `active-skills.md` and `ACTIVE_TASK.md` are archived to `local/archive/`, untouched templates are replaced (the onboarding goal and project rules are carried over), and edited files are kept with a note on where their content belongs.
- **Project decisions** (MCP `update_project_memory`) are written as short records in `decisions/` (what, why, alternatives, status).

### Changed (active task: pointer instead of pasted skills)
- **`gaw use --inject` writes `ai-brain/local/active-task.md`**, a few hundred tokens: the task, its status, the skill files to open with their size and why each was chosen, skills left out and why, constraints and acceptance criteria (from each skill's `verification`). It no longer pastes whole skills (the old `ACTIVE_TASK.md` in the example was 8,000–10,000 tokens). `--full` still embeds them. It also no longer overwrites `design.md` with a preset; it suggests one instead.
- **`gaw task` / `gaw task done`**: show the current task, or archive it so later sessions ignore it. Writing a new task archives the previous one; `gaw context` and agents ignore a task whose status isn't `active`.
- **One library per job**: skills with the same gaw.json `exclusiveGroup` (Motion, Anime.js and GSAP's masked reveal are `animation-library`) are not loaded together. The one in the project's dependencies wins, even when the task matched another; explicitly named skills are all kept with a conflict note.
- **Stack note**: the task file tells agents to adapt skill examples (TypeScript, Tailwind) to the project's stack. `.ts`/`.tsx` files under `src/`, `app/` or `lib/` now count as TypeScript even without `tsconfig.json`.
- **UI tasks point to the new `accessibility-baseline` skill** (keyboard, focus, names, contrast, reduced motion, forms, targets), instead of each UI skill repeating it.

### Changed (default project skills)
- Starter skills are now `debugging` (reproduce, read the full error, one change at a time, regression test), `code-review` (severity-ordered checklist, fixed report format), `implement-feature` (find the existing pattern, stay in scope, no new dependencies without asking), `testing` and `security-basics`. Each is under ~500 tokens with checkable steps and no stack assumptions. `code-generation` (hard-coded React/Tailwind) and `seo` were dropped from the defaults.

### Fixed (skills)
- `micro-interactions-system`: one timing table separating feedback to input (≤100ms to start, ≤300ms to finish), user-triggered transitions, entrance reveals and ambient motion, so it no longer contradicts the reveal and counter skills; a single short error shake with a reduced-motion fallback; destructive actions use a confirm step or Undo instead of a long-press; broken `../animation-motion/…` links replaced by skill names; `$\le$` replaced by `≤`.
- `motion-dev`: removed the 150ms minimum that contradicted the 100ms acknowledge budget; size changes via `layout` (an accordion may animate `height: "auto"`); `MotionConfig reducedMotion="user"`; checked against motion 14.10.
- `animejs`: v4 SVG drawing uses `svg.createDrawable()` and `draw` (the v3 `setDashoffset` example was wrong); the ~3KB WAAPI figure is now attributed to anime.js's docs; checked against animejs 4.5.
- `masked-reveal`: SplitText has been free since GSAP 3.13; it's now the preferred path, with the plugin-free helper as a fallback. Framework list said `framer-motion`; it's GSAP.

### Removed
- `build-design-system` from the official library: it referred to `references/` and `scripts/` files that were never imported, so it couldn't work, and it had no recorded source or license. It can return through `gaw skills add <repo>` as a complete folder once its license is checked.

### Added (linting)
- `gaw skills lint` warns about relative links to files that don't exist, mentions of `references/`, `scripts/` or `assets/` files a skill doesn't include, more than one `#` heading, and LaTeX math like `$\le$`. Project skills get a ~500-token size guideline. New gaw.json fields: `verifiedAgainst`, `packages`, `exclusiveGroup`. On the current library this flags about 30 imported skills with missing supporting files.

### Changed (name and focus)
- **GAW is now "Guided Agent Workflow"** (formerly "Global Agentic Web"): The Universal Intelligence Layer for AI Agents. The CLI header, MCP server name (`guided-agent-workflow-mcp`), package name (`guided-agent-workflow`), agent-file sections and docs use the new name. `gaw update` replaces agent-file sections written under the old name in place; nothing is duplicated.
- **No longer UI-only by default**: the default Global Brain persona and the project `identity.md` template now fit any kind of project; interface rules apply only to projects with a user interface. Existing Global Brains and project files are not changed.

### Removed
- `ui-skills-master.md`: an early working note about importing skills from ui-skills.com. Nothing used it; those skills are in the official library and credited in the README.
- `master-skill.md`: an old-format "master skill" no tool loaded. Its content is covered, and kept current, by the GAW section in each project's agent files, the MCP tool `get_project_context`, the Global Brain's `design-principles.md`, the README and `NEW-PROJECT-MASTER-PROMPT.md`.
- Stale paths to the old `E:\master-skills` folder in the MCP setup guide, the FAQ and the example project.

### Fixed (project detection)
- Any JavaScript project without a known UI framework was labeled "plain-frontend", and every project was assumed to use JavaScript. Languages now come from the project's files (package.json, tsconfig, pyproject/requirements, go.mod, Cargo.toml, Maven/Gradle, .csproj), and stacks are named for what they are: `node`, `express`, `fastify`, `nestjs`, `django`, `fastapi`, `flask`, `python`, ... "plain-frontend" needs real frontend signs (index.html or a bundler).
- `gaw init --yes` suggested unrelated starter skills (a website-design skill for a Node API; an AKS skill because its description mentions Express). Starter skills must now be about the stack by name, tags or keywords; otherwise none are suggested.

### Added (skill libraries and trust)
- **Personal skill library** (`~/.gaw/skills/`, or `$GAW_HOME/skills`): `gaw skills add` and `gaw skills new` now save there by default, so your skills survive GAW updates, never end up in GAW's repository, and every project on your computer can use them. `--official` adds to GAW's own library (for contributors, shared by pull request); `--project` still adds to `ai-brain/skills/`. A personal skill with an official skill's name replaces it for you only, and only with `--override`. `gaw skills mine` lists your skills.
- **Trust levels on every skill**: official, community (from someone's GitHub repo, not reviewed by GAW), personal, project. Shown in `gaw skills`, `search`, `recommend`, `use`, `skills selected`, `gaw context`, the project skill catalog and the MCP tools. Agents get a "Source" line for non-official skills, and a caution for unreviewed skills that can run commands. A skill cannot mark itself verified.
- **Deliberate confirmation for unreviewed skills that run commands**: adding one needs a typed "yes", or `--yes --allow-scripts` without a prompt.
- **Skill preferences in the Global Brain** (`~/.gaw/brain/skill-preferences.json`): `gaw skills pin` gives a skill a small boost when it fits a task (it never adds one that doesn't), `gaw skills block` stops GAW from suggesting it; `unpin`, `unblock`, `prefs`. `gaw recommend` mentions blocked skills that would have fit.
- **Sharing personal skills with a team**: the project lockfile records where each skill came from. A teammate without one of your personal skills gets a clear message, and `gaw skills share <name>` copies it into `ai-brain/skills/` (refused without `--yes` when the skill's license may not allow copies).

### Added (skill review)
- **AI-drafted ranking fields, waiting for review**: 219 skills below Rankable got drafted `whenToUse`, `whenNotToUse` and `keywords` (374 fields), written only into empty fields of `gaw.json` and based only on each skill's own SKILL.md. They are listed in `drafts` and don't count for ranking until a person approves them.
  - Approved (on the maintainer's instruction, after a benchmark check): all drafted `whenToUse` (118) and `whenNotToUse` (38). Benchmark unchanged (tuning 94%, held-out 93%); Incomplete skills 116 → 11.
  - Still drafts: `keywords` for 218 skills. 21 keywords built on general words ("tag", "query", "regression", "word", "report", "theme") were rewritten after they pulled skills into unrelated tasks. Approving all keywords now would lift 216 skills to Rankable and the tuning score to 95%, but lowers held-out onboarding precision (78% → 75%) because many similar media skills compete for the same picks, so they wait for a ranking improvement or a person's review.
- **`gaw skills review`**: shows drafted fields (`--all` or one skill), approves them (`--approve <name|all>`) or rejects and deletes them (`--reject <name|all>`), optionally for one `--field`.
- **`gaw skills enrich --refresh`** recomputes fields GAW derived earlier, after a derivation fix.

### Fixed (skill review)
- "DO NOT USE FOR: …" sentences in skill descriptions were derived as `whenToUse`. They now become `whenNotToUse`, so they exclude a skill instead of matching it.

### Added (project context)
- **Per-project skill selection**: `ai-brain/skills.lock.json` records which library skills a project uses (version, reason, date). Manage it with `gaw skills select`, `gaw skills deselect` and `gaw skills selected`; onboarding fills it from the project goal. Agents read a generated short catalog, `ai-brain/project-skills.md` (~640 tokens for 6 skills in a sample project), and open a full skill only when a task needs it.
- **Shared project context service** (`core/project-context/`): one validated view of a project's stack, goal, rules, skills, code graph and Global Brain. `gaw context` and MCP `get_project_context` return it, and the agent files are built from it.
- **New MCP tools**: `get_project_skills`, `load_project_skills` (only project skills that fit the task, within a token budget), `select_project_skills`.
- **Agent instructions stay current**: the GAW section in CLAUDE.md, .cursorrules, AGENTS.md, GEMINI.md, Copilot and generic instructions is refreshed in place by `gaw update` (previously written once and never updated), and all six now share the same lines.

- **Global Brain reaches every project without being copied**: each project gets `ai-brain/global-brain.md`, a generated, read-only summary of `~/.gaw/brain` for agents that can't read outside the project folder. It's refreshed by `gaw start`, `gaw update` and `gaw brain update`, and added to `.gitignore` because it's personal.

### Fixed (project context)
- **Stale preference copies overrode the Global Brain**: `gaw init` copied 8 Global Brain files (design principles, coding preferences, …) into every project, and as project files they took precedence over the user's live Global Brain, even after a preference changed. Projects now get only project files. `gaw update` removes copies nobody changed in existing projects and keeps edited ones as deliberate project overrides, which `gaw context` lists.
- `package.json` (and other JSON) saved with a byte-order mark, common on Windows, was misread, so React/Next.js projects were detected as plain frontend.

### Changed
- **The Global Brain moved out of the GAW package** into your user folder, `~/.gaw/brain/` (or `$GAW_HOME/brain/`). On first use GAW copies its defaults from `brain/` and never overwrites your files, so updates can't erase your memory and personal decisions never end up in GAW's repository. `gaw brain path` shows the location, and `GAW_HOME` pointed at a synced folder shares one brain across machines. The repository's `decision-history.md` is now an empty template. Global decisions record the project name, not its full local path.

### Added
- **GSS Ranking v1** (`docs/gss/spec.md`, section 8): ranking is now part of the GAW Skill Standard. It publishes which fields count and how much: identity, intent, exclusion via `whenNotToUse`, context via the new `domains` field, and trust only as a tie-breaker. It defines **rankability levels** (Findable, Rankable, Precise), anti-gaming limits, and a versioning rule (changes must not hurt the held-out benchmark).
- **`gaw skills add` rejects skills below Level 1 (Findable)**: a skill must say what it does and when to use it. `--when` and `--description` fix this on the spot.
- **`gaw skills enrich`** fills `summary`, `whenToUse`, `whenNotToUse`, `verification`, `domains` and `permissions` from each skill's own text (never invented, never overwriting authors), and lists them in `derived`. Library: summary 235, domains 229, whenToUse 118, verification 42.
- **`gaw skills lint --levels`** shows each skill's level and what it needs next. Library today: 118 Incomplete, 105 Findable, 12 Rankable. Reaching Rankable mainly needs "when to use" text and search terms (keywords), which need authors or reviewed AI drafts.
- Anti-gaming: limits of 20 keywords (40 characters each) and 15 tags, flags for heavy word repetition and copied descriptions.
- **Automatic GSS for every new skill**: `gaw skills add <github-link | folder | file.md>` converts any skill to GSS, checks its license at the source, copies supporting files, flags skills that can run commands (`permissions: ["shell"]`), splits oversized skills, lints and indexes them, with a preview before saving. `gaw skills new "<title>"` creates a skill from a template. `gaw init` creates its starter project skills as GSS folders. The bulk importer uses the same pipeline.
- **License intelligence** (`gaw skills licenses`): finds each skill's real license from its own LICENSE file, its original `SKILL.md`, or the repository license, and records the evidence. Result for the library: 186 open (138 MIT, 48 Apache-2.0), 19 with no license at the source, 30 with no source on record.
- **Oversized skills split losslessly** (`gaw skills split`): long sections move into grouped `references/` files with an index in `SKILL.md`. All 13 oversized skills split (largest: ~26,000 → ~3,700 tokens). Only done when the license allows changes.
- **`gaw skills repair`**: restores supporting files that imported skills are missing (text files by default).
- **Held-out benchmark set** (`eval/cases/skill-selection-holdout.json`): 22 cases never used for tuning, reported separately by `npm run eval`.
- The skill index updates itself when skills are added or changed.
- **GAW Skill Standard (GSS) v1** (`docs/gss/spec.md`): skills are folders with a standard Agent Skills `SKILL.md` plus an optional `gaw.json` contract (keywords, dependsOn, frameworks, verification, permissions, source). GSS skills work in any tool that supports Agent Skills. All 235 skills migrated.
- **`gaw skills lint`** checks skills against GSS; **`gaw skills index`** rebuilds `skills/index.json`, so commands read skill metadata only and load skill bodies on demand.
- **Explained skill picks**: `gaw use`, `gaw recommend` and onboarding show why each skill was chosen ("Matched "pricing", "page" (name); "SaaS" (description).").
- **`gaw use --budget <tokens>`**: full skill instructions are loaded within a token budget (default 8,000); skills beyond it are listed in short form with a path the agent can open.
- **Incremental code graph**: `gaw update` and `gaw graph --force` refresh an existing Graphify graph with `graphify update` (only changed files are re-parsed). `gaw graph --full` rebuilds from scratch.
- **Skill selection benchmark** (`npm run eval`): 36 labeled tasks across fields, including tasks no skill should match.
- **New `gaw init` onboarding for any kind of project**: (1) what are you building → `ai-brain/context.md`, (2) skills that closely match the goal, picked by number → `ai-brain/active-skills.md`, (3) rules agents must always follow → `ai-brain/rules.md`, (4) Graphify, only if missing. It replaces the old questions (pick skill IDs from all 235, external skills, goal).
- **`SkillDiscovery.findRelevant()`**: returns only close matches for a free-text goal, and nothing for fields the library does not cover.
- **Guided Graphify install**: when Graphify is missing, `gaw init` explains what it does and asks whether to install it. It installs with uv, and asks separately before running Astral's uv install script. Non-interactive runs and the MCP server never install anything.
- **`gaw setup`**: install Graphify at any time (`--yes` also installs uv without asking).
- **`gaw init --install-graphify`**: opt in to installing without questions.
- GAW finds Graphify in uv's tool folder (`~/.local/bin`) as well as on `PATH`, so it works right after installing, without a new terminal.

### Changed
- **The code map now comes only from the official Graphify CLI**, which is optional and recommended. Without it, GAW skips the code map. `gaw doctor` shows its status.
- **Graph location**: the graph now lives in `graphify-out/` (`graph.json`, `graph.html`, `GRAPH_REPORT.md`). Agent adapters (`CLAUDE.md`, `.cursorrules`, `GEMINI.md`, `AGENT_INSTRUCTIONS.md`) point there.
- Graphify runs in code-only mode (`graphify extract . --code-only`, then `graphify cluster-only . --no-label`): local parsing, no LLM calls or API keys.
- A failed Graphify run is reported as a warning and no longer stops `gaw init`.

### Removed
- The "add external skills" onboarding question, which downloaded any URL into `ai-brain/skills/` without checks.
- Copying full skill files into `ai-brain/skills/` during onboarding (chosen skills go to `active-skills.md`, like `gaw use --inject`).
- The built-in regex-based graph generator. Its "God Nodes" counted raw import strings (such as `node:fs`), so it often pointed agents to the wrong hubs.

### Fixed
- **`gaw use` loaded unrelated skills.** It always loaded ~6 skills (~11,000 tokens), and 61% of them didn't fit the task (e.g. an Azure skill for a pricing page). It now loads only close matches: benchmark score 45% → 94%, precision 39% → 83%, ~2,600 tokens per task, and nothing for tasks no skill covers.
- **47 skills had no description** (`description: ">"`): the importer could not read multi-line YAML. 46 were recovered from their source repositories and 1 was derived from the skill text.
- **The importer stamped every imported skill as MIT**, regardless of its real license. 48 skills were really Apache-2.0 and 19 have no license at their source. Licenses are now verified at the source and recorded with evidence.
- **The importer dropped skills' supporting files** (references, scripts, assets) and filed skills by substring ("aria" in "variables"). It now writes GSS folders with supporting files (within limits) and uses whole-word categories. 71 misfiled skills were recategorized, and a duplicate `create-design-md` was removed.
- **Design presets were injected into non-UI tasks** (e.g. `gaw use "Analyze our Azure costs" --inject` wrote a design preset). Presets are now offered only for UI work.
- **`gaw use --inject` overwrote `active-skills.md` with nothing** when no skill matched. It now leaves the file unchanged.
- **Onboarding: accepting the recommended skills saved nothing.** Display names like `"Landing Page (landing-page)"` were looked up as skill IDs.
- **Onboarding: the build goal was never read by agents.** It was saved to `ai-brain/ACTIVE_TASK.md`, which no agent instruction file references. It now goes to `context.md` and `active-skills.md`.
- **Onboarding: piped or typed-ahead answers were lost**, and end of input ended onboarding silently.
- **Skill search matched filler words inside skill IDs** (e.g. "on" inside "animation", "a" almost everywhere), which surfaced unrelated skills for `gaw use`, `gaw search` and `gaw recommend`. Search now ignores filler words and matches whole words or word starts.
- GAW called `graphify .`, which fails when run non-interactively, and looked for output in the project root instead of `graphify-out/`, so the Graphify graph was never used.
- `gaw start` always reported a graph as present.

## [1.0.0] - 2026-11-06

### Added
- **Universal Project Bootstrapper (`gaw init`)**: Single command initialization supporting React, Next.js, Vite, Remix, Vue, Svelte, Angular, and HTML/CSS.
- **Skill Registry & Discovery Engine**: 34 authoritative skills indexed across 23 taxonomy categories with full-text scoring, category filtering, and dependency resolution.
- **Progressive Skill Loading (Levels 1–6)**: Low token consumption orchestrator packaging targeted instructions for AI coding assistants.
- **Two-Tier Memory Engine**: Global Brain (`brain/`) and Project Brain (`ai-brain/`) with strict precedence hierarchy and traceable decision history logging.
- **Codebase Graph Intelligence (Graphify)**: Deterministic code dependency and AST relationship analysis outputting `graph.json`, `graph.html`, and `GRAPH_REPORT.md`.
- **Visual Feedback Integration (Agentation)**: Framework-safe development-only component injector strictly excluded from production bundles.
- **Multi-Agent Adapters**: Non-destructive integration adapters for Claude Code (`CLAUDE.md`), Cursor (`.cursorrules`), OpenAI Codex (`AGENTS.md`), Gemini CLI (`GEMINI.md`), GitHub Copilot (`.github/copilot-instructions.md`), and generic markdown agents.
- **Model Context Protocol (MCP) Server**: Full stdio-based MCP server (`mcp/server.js`) exposing 12 tools for Claude Code, Cursor, and MCP clients.
- **Automated Test Suite**: 7 test suites covering unit and integration testing with 100% pass rate.

