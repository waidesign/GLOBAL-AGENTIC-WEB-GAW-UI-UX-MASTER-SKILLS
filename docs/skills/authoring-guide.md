# Skill Authoring Guide

GAW skills follow the **GAW Skill Standard (GSS)**, an extension of the open Agent Skills `SKILL.md` format. The full spec is in [docs/gss/spec.md](../gss/spec.md). This page is the quick version.

## 1. Create the folder

```
skills/<category>/<skill-name>/
├── SKILL.md      # required
└── gaw.json      # optional
```

`<skill-name>` is lowercase letters, digits and hyphens, and must equal `name` in `SKILL.md`.

## 2. Write `SKILL.md`

```yaml
---
name: "my-skill"
description: "What the skill does and when to use it, with the words people search for."
license: "MIT"
metadata:
  gaw-title: "My Skill"
  gaw-category: "design-systems"
  gaw-author: "author-or-org"
  gaw-version: "1.0.0"
  gaw-tags: "tokens, theming"
---

# My Skill

Instructions for the agent...
```

- Only `name`, `description`, `license`, `compatibility`, `metadata` and `allowed-tools` are allowed at the top level.
- `metadata` values are strings.
- The description is what GAW searches. Say what the skill does **and when to use it**.

## 3. Add `gaw.json` (optional)

```json
{
  "gss": 1,
  "keywords": ["synonyms people use"],
  "whenToUse": ["..."],
  "whenNotToUse": ["..."],
  "dependsOn": [],
  "frameworks": ["react"],
  "verification": ["How to check the result is correct"]
}
```

`keywords` is the quickest way to make a skill easier to find: add the words people use that aren't in the description (for example "Excel" for a spreadsheet skill).

## 4. Content rules

- Begin with clear constraints and usage guidelines.
- Provide concrete fixes, rules, or checklists rather than generic prose.
- Clearly identify forbidden practices (e.g. animating layout properties).
- Keep the body under ~5,000 tokens. Put long reference material in `references/` and link to it.

## 5. Check and publish

```bash
gaw skills lint skills/<category>/<skill-name>   # GSS rules
gaw skills index                                  # update skills/index.json
npm run eval                                      # make sure skill selection didn't get worse
```
