# Skill Authoring Guide

GAW skills follow the **GAW Skill Standard (GSS)**, an extension of the open Agent Skills `SKILL.md` format. You don't need to write GSS by hand: the commands below create it. The full spec is in [docs/gss/spec.md](../gss/spec.md).

## Add an existing skill

```bash
gaw skills add https://github.com/owner/repo/tree/main/skills/my-skill   # from GitHub
gaw skills add ./my-skill/                                               # a folder with SKILL.md
gaw skills add ./my-notes.md --category writing                          # a single markdown file
```

GAW shows a preview (name, category, license, size, permissions, warnings) and asks before saving. It then:

- converts the skill to GSS (`SKILL.md` + `gaw.json`),
- finds the real license at the source and records it,
- copies supporting files (scripts, references, assets) within limits,
- marks skills that can run commands (`permissions: ["shell"]`),
- splits oversized skills into `references/` when the license allows,
- checks the result and updates the skill index.

Add `--project` to put the skill in your project's `ai-brain/skills/` instead of the GAW library.

## Write a new skill

```bash
gaw skills new "Pricing Page" --category ui-ux
```

This creates `skills/ui-ux/pricing-page/` with a template. Then:

1. Replace the `description` in `SKILL.md` with what the skill does **and when to use it**, using the words people search for. The linter blocks the template text.
2. Write the instructions in the body.
3. In `gaw.json`, add `keywords`: words people use that aren't in the description (for example "Excel" for a spreadsheet skill).

## Content rules

- Begin with clear constraints and usage guidelines.
- Provide concrete fixes, rules, or checklists rather than generic prose.
- Clearly identify forbidden practices (e.g. animating layout properties).
- Keep the body under ~5,000 tokens. Longer skills are split into `references/` automatically.

## Check

```bash
gaw skills lint skills/<category>/<skill-name>   # GSS rules
npm run eval                                      # make sure skill selection didn't get worse
```
