# GAW Skill Standard (GSS) v1

GSS is how Global Agentic Web packages skills. It **extends the open [Agent Skills](https://agentskills.io/specification) format** instead of replacing it:

- Every GSS skill is a valid Agent Skill. Copy its folder into any tool that supports `SKILL.md` and it works.
- Every Agent Skill is a valid GSS skill. GAW-specific data is optional.
- GAW-only data lives where the Agent Skills spec allows extensions: `metadata` (string values) and extra files in the skill folder.

## 1. Folder layout

```
skills/<category>/<skill-name>/
├── SKILL.md      # required: Agent Skills frontmatter + instructions
├── gaw.json      # optional: GSS contract (ignored by other tools)
├── references/   # optional: long documentation, loaded only when needed
├── scripts/      # optional: executable helpers
└── assets/       # optional: templates, data, images
```

The folder name must equal `name`. `<category>` groups skills in the GAW library; it is not part of the Agent Skills spec.

## 2. `SKILL.md` frontmatter

Only the six Agent Skills fields are allowed at the top level. Strict validators reject anything else.

| Field | Required | Rules |
|---|---|---|
| `name` | Yes | 1–64 chars, lowercase `a-z`, `0-9` and single hyphens, no leading/trailing hyphen. Must match the folder name. |
| `description` | Yes | 1–1024 chars. Say what the skill does **and when to use it**, with the words people will search for. |
| `license` | No | License name (e.g. `MIT`, `Apache-2.0`) or a bundled license file. Must match the original author's license. |
| `compatibility` | No | Max 500 chars. Environment needs (runtimes, network). |
| `allowed-tools` | No | Space-separated pre-approved tools (experimental in Agent Skills). |
| `metadata` | No | Map of **string** keys to **string** values. GSS keys use the `gaw-` prefix (below). |

### GSS `metadata` keys

| Key | Meaning |
|---|---|
| `gaw-title` | Display name, if it differs from `name` (e.g. `"Pricing Page"`). |
| `gaw-category` | Library category (should match the parent folder). |
| `gaw-author` | Author or organization. |
| `gaw-version` | Skill version, semver as a string (`"1.2.0"`). |
| `gaw-tags` | Comma-separated search tags (`"pricing, plans, saas"`). Don't repeat the name or category. |

Example:

```yaml
---
name: pricing-page
description: "Design or rewrite a high-converting SaaS pricing page: plan structure, comparison, billing toggles, FAQs. Use for pricing, plans or subscription pages."
license: "MIT"
metadata:
  gaw-title: "Pricing Page"
  gaw-category: "ui-ux"
  gaw-author: "ui-skills"
  gaw-version: "1.0.0"
  gaw-tags: "pricing, plans, subscriptions, saas"
---
```

## 3. `SKILL.md` body

- Plain Markdown instructions for the agent.
- Keep it under **~5,000 tokens and 500 lines** (Agent Skills guidance). Move long reference material into `references/` and link it with a relative path, one level deep.
- GAW loads the body only when a task needs the skill. When a body doesn't fit the user's token budget, agents get the description and the file path instead.

## 4. `gaw.json`: the skill contract (optional)

Structured data that helps GAW choose skills well and helps agents use them. Every field is optional.

```json
{
  "gss": 1,
  "summary": "Two sentences GAW can show before loading the full skill.",
  "keywords": ["pull request", "PR description"],
  "whenToUse": ["Pricing or plan comparison pages"],
  "whenNotToUse": ["Checkout and payment processing"],
  "inputs": ["Plan names, prices and features"],
  "outputs": ["Accessible pricing section"],
  "constraints": ["No layout animation"],
  "dependsOn": ["landing-page"],
  "related": ["landing-page"],
  "frameworks": ["react", "nextjs"],
  "verification": ["The billing toggle updates every price", "Works with keyboard only"],
  "permissions": [],
  "lastVerified": "2026-11-08",
  "source": {
    "repo": "owner/repo",
    "path": "skills/pricing-page/SKILL.md",
    "licenseVerified": false
  }
}
```

| Field | Type | Purpose |
|---|---|---|
| `gss` | number | GSS version (`1`). |
| `summary` | string | Short form shown before loading the body. |
| `keywords` | string[] | Synonyms people use that aren't in the description ("Excel" for `xlsx`). Used for matching. |
| `whenToUse` / `whenNotToUse` | string[] | Selection guidance for GAW and agents. |
| `inputs` / `outputs` | string[] | What the skill needs and produces. |
| `constraints` | string[] | Rules the skill must respect. |
| `dependsOn` | string[] | Skill names loaded together with this one. |
| `related` | string[] | Skills worth suggesting alongside. |
| `frameworks` | string[] | Frameworks the skill targets (omit for "any"). |
| `verification` | string[] | Checks that confirm the skill's output is correct. |
| `permissions` | string[] | What the skill may do beyond writing text: `shell`, `network`, `filesystem`, `secrets`. Empty means instructions only. |
| `lastVerified` | string | Date (`YYYY-MM-DD`) the skill was last checked. |
| `source` | object | Where an imported skill came from. `licenseVerified: false` means the license has not been checked against the original. |

## 5. Validation

```bash
gaw skills lint            # whole library
gaw skills lint <folder>   # one skill
```

**Errors** (must fix): missing or invalid `name`/`description`, `name` not matching the folder, unknown top-level frontmatter fields, non-string `metadata` values, `compatibility` over 500 chars, invalid `gaw.json`, `dependsOn` pointing to unknown skills.

**Warnings** (should fix): body over ~5,000 tokens or 500 lines, placeholder descriptions, `source.licenseVerified: false`.

## 6. Index

`skills/index.json` holds every skill's metadata, `gaw.json` contract and a token estimate, so GAW can search without reading every skill body. Rebuild it after adding or editing skills:

```bash
gaw skills index
```

The test suite fails if the index is out of date.
