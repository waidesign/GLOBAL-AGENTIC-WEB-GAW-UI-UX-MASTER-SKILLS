# Skill packs

A pack is a small, curated set of library skills for one kind of work. `gaw init` offers the packs that fit a project, judged from its dependencies, files and goal, so a project starts with a few skills that match its stack instead of keyword guesses.

| Pack | Fits when | Adds |
|---|---|---|
| `ui` | The project has a user interface | `accessibility-baseline`, `fixing-accessibility`, `baseline-ui`; `react-best-practices` with React/Next.js; `tailwindcss` with Tailwind |
| `motion` | `motion`, `framer-motion`, `animejs` or `gsap` is installed, or the goal mentions animation | `micro-interactions-system`, `fixing-motion-performance`, and the skill for the animation library that is installed (never a second one) |
| `marketing` | The goal mentions landing, marketing, pricing, SEO…, or an SEO/sitemap package is installed | `landing-page`, `pricing-page`, `fixing-metadata` |
| `design-system` | Radix, Storybook, vanilla-extract, Stitches, style-dictionary or `components.json` is found, or the goal mentions a design system | `create-design-md`, `baseline-ui`; `tailwindcss` with Tailwind |

Packs only contain skills that ship all their files (a test checks this), so incomplete imported skills stay out until they are repaired.

## Commands

```bash
gaw packs                         # which packs fit this project, and which are added
gaw packs show motion             # the skills a pack would add here, and why
gaw packs add ui motion           # add them to ai-brain/skills.lock.json
gaw packs remove ui               # take out what the pack added
```

Adding a pack records its skills in `ai-brain/skills.lock.json` with a `packs` tag. Removing a pack removes only skills that no other pack uses; skills someone selected by hand (`gaw skills select`) are never claimed or removed by a pack. Agents still open each skill only when a task needs it.

`gaw init --yes` lists fitting packs without adding anything. Interactive `gaw init` asks after the goal-matching skills. `gaw context` and the MCP tool `get_project_context` show added packs and packs that also fit.

## Writing a pack

One JSON file in `packs/`:

```json
{
  "name": "motion",
  "title": "Motion & micro-interactions",
  "description": "What the pack is for, in a sentence or two.",
  "requires": { "hasUi": true },
  "signals": {
    "dependencies": ["motion", "gsap"],
    "dependencyPrefixes": ["@radix-ui/"],
    "files": ["components.json"],
    "goalWords": ["animation"]
  },
  "skills": ["micro-interactions-system"],
  "when": [{ "dependencies": ["react"], "skills": ["react-best-practices"] }],
  "fromGroup": "animation-library"
}
```

- `requires`: all must hold (currently `hasUi`).
- `signals`: the pack fits when any one matches; `"always": true` makes it fit every project that meets `requires`. Goal words match whole words.
- `skills`: always added. `when`: added only when one of the packages is installed. `fromGroup`: adds the skill from that gaw.json `exclusiveGroup` whose `packages` the project has.
