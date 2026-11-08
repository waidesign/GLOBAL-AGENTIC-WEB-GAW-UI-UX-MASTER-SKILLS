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
| `permissions` | string[] | What the skill may do beyond writing text: `shell`, `network`, `filesystem`, `secrets`. Empty means instructions only. `gaw skills add` sets `shell` automatically for skills with hooks, pre-approved shell tools, or scripts. |
| `lastVerified` | string | Date (`YYYY-MM-DD`) the skill was last checked. |
| `source` | object | Where an imported skill came from, and its license check: `licenseVerified`, `licenseStatus` (`open`, `copyleft`, `restricted`, `unknown`), `licenseEvidence`, `licenseUrl`, `licenseCheckedAt`. |
| `extraFrontmatter` | object | Frontmatter fields from the original skill that Agent Skills doesn't allow at the top level, kept so nothing is lost. |
| `domains` | string[] | Fields the skill serves (see Ranking → Domains). |
| `derived` | string[] | Fields GAW filled from the skill's own text. |
| `drafts` | string[] | Fields drafted by AI and not yet reviewed; they don't count for ranking until reviewed. |

## 5. Adding skills: GSS is created automatically

Nobody has to write GSS by hand. Every way of adding a skill produces it:

| Command | What it does |
|---|---|
| `gaw skills add <github-link \| folder \| file.md>` | Converts any skill (Agent Skills `SKILL.md`, old GAW `.md`, plain markdown) to GSS. Checks the license at the source, copies supporting files (up to 300 files / 10 MB), flags `permissions` (hooks or scripts → `shell`), splits it if oversized and the license allows, then lints and indexes it. Shows a preview and asks first (`--yes` to skip). Saves to the personal library; `--project` adds it to `ai-brain/skills/`, `--official` to GAW's library. |
| `gaw skills new "<Title>"` | Creates a ready-to-fill GSS skill from a template. The linter blocks it until the description is written. |
| `scripts/ingest-skills-sh.mjs` | Bulk import from GitHub repos through the same pipeline. |
| `gaw init` | Creates the starter project skills as GSS folders. |

Fields from the original that Agent Skills doesn't allow at the top level are kept, as their original text, in `gaw.json` → `extraFrontmatter`.

### 5a. Libraries and trust levels

`gaw skills add` and `gaw skills new` save to the user's **personal library** (`~/.gaw/skills/`, or `$GAW_HOME/skills`) unless `--project` or `--official` is given. Tools see each skill's **trust level**:

| Level | Where the skill lives | Who checked it |
|---|---|---|
| `official` | GAW's library (`skills/` in the GAW repo) | GAW maintainers, through pull-request review |
| `verified` | Its author's repo, at a pinned version | GAW (reserved: comes with GAW's verified list) |
| `community` | The personal library, added from a GitHub repo (`source.repo` set) | Nobody at GAW |
| `personal` | The personal library, written or added locally | Its owner |
| `project` | A project's `ai-brain/skills/` | The project's team |

A skill never sets its own trust level: nothing in `SKILL.md` or `gaw.json` can make a skill `official` or `verified`. Skills that GAW has not reviewed and that have `permissions: ["shell"]` carry a caution for agents, and adding one needs a deliberate confirmation.

## 6. Licenses

GAW never relabels someone else's work. For skills from GitHub, `gaw skills licenses` (and `gaw skills add`) looks for evidence in this order: a LICENSE file in the skill's own folder, the `license` field of the original `SKILL.md`, then the repository license. It reads the license text, records the SPDX id in `license`, and records the evidence in `gaw.json` → `source` (`licenseStatus`: `open`, `copyleft`, `restricted` or `unknown`). Skills without a found license show a lint warning: get the author's permission before redistributing them.

## 7. Oversized skills

A body over ~5,000 tokens is split losslessly: the opening sections stay in `SKILL.md` (~3,500 tokens), and the rest moves into `references/*.md`, grouped into files of roughly 1,200–3,000 tokens. A "Detailed references" list in `SKILL.md` tells agents what each file covers so they open it only when needed. GAW only splits skills whose license allows changes (open or copyleft). `gaw skills split <name|--all> [--apply]` does this for existing skills; `gaw skills add` does it automatically.

## 8. Ranking (GSS Ranking v1)

GSS defines how skills are ranked, so every skill is ranked by the same published rules and authors know what makes a skill findable. Version: `gss-ranking-1`.

### 8.1 What counts

| Signal | Fields | Effect |
|---|---|---|
| Identity | `name`, `gaw-title` | Strongest: the task names the skill |
| Intent | `description`, `keywords`, `gaw-tags`, `gaw-category` | The main match. Weights: name ×3 (ID) / ×2 (title), tags and keywords ×2, description ×1.5, category ×1 |
| Exclusion | `whenNotToUse` | A skill is not suggested when a task matches one of its items (2+ of the item's words, covering half of them) |
| Context | `domains` | ×1.1 when they match the project's domains; never excludes |
| Relations | `dependsOn`, `related` | Required skills load together; related ones may be suggested |
| Trust | `source.licenseStatus`, `lastVerified` | Only breaks exact ties (verified open license, then most recently checked) |

Rules:

- Words that few skills use count more than common ones (inverse document frequency).
- A skill must cover at least a third of the task's meaning, or half of one part of a multi-part task through its name, tags, keywords or category. It must also score at least 40% of the best match.
- When nothing fits, nothing is suggested.
- Every suggestion comes with a reason ("Matched "pricing", "page" (name)").
- Matching reads metadata only, never skill bodies.

`summary` and `whenToUse` are **not scored** in v1. Measured with the benchmark, scoring them gave no gain: the summary repeats the description, and `whenToUse` copied from skill bodies is often a broad trigger list. They count toward rankability levels and are shown to users and agents. v2 may score author-written `whenToUse`.

### 8.2 Rankability levels

| Level | Name | Requires |
|---|---|---|
| 0 | Incomplete | Lint errors, or the skill doesn't say when to use it |
| 1 | **Findable** | Valid GSS, a description of 40+ characters, and a "when to use" (a "Use when…" sentence in the description, or `whenToUse`) |
| 2 | **Rankable** | Level 1 + `summary`, `whenToUse`, `domains`, and 3+ search terms (`keywords`, `gaw-tags`, `frameworks`) |
| 3 | **Precise** | Level 2 + `whenNotToUse` and `verification` |

- `gaw skills add` **rejects skills below Level 1**. Authors can supply the missing part with `--when "<when to use it>"` or `--description`.
- **Level 2 is the target** for every skill in the GAW library.
- `gaw skills lint` shows the distribution, and `--levels` shows what each skill needs next.

### 8.3 Filling the contract

`gaw skills enrich` (and `gaw skills add`) fill empty contract fields **from the skill's own text only**, never overwriting what an author wrote:

| Field | Taken from |
|---|---|
| `summary` | First sentences of the description |
| `whenToUse` | "Use when…" sentences in the description, or a "When to use" section |
| `whenNotToUse` | A "When not to use" section |
| `verification` | A checklist / checks / verification section |
| `domains` | The category, plus clear words in the description |
| `permissions` | Bundled scripts or hooks (`shell`) |

Filled fields are listed in `derived`. `keywords` are never derived, because synonyms must come from people. AI-drafted fields are listed in `drafts` and only count once a person approves them with `gaw skills review --approve <name|all>` (`--reject` deletes them). Drafts only fill empty fields; they never replace author or derived values.

### 8.4 Domains

`domains` is a list of lowercase words describing the field a skill serves. Recommended: `software`, `web`, `design`, `cloud`, `data`, `ai`, `security`, `documents`, `writing`, `media`, `education`, `research`, `business`, `finance`, `health`, `science`, `legal`, `engineering`. Any other lowercase word is allowed.

### 8.5 Anti-gaming

- **Hard limits** (lint errors): at most 20 `keywords`, each at most 40 characters, and at most 15 `gaw-tags`. Search ignores anything beyond these limits.
- Each word counts once per field, so repeating words never raises a rank. The linter flags a word used 6+ times that makes up 10%+ of a description.
- The linter flags descriptions copied from another skill.

### 8.6 Changing the rules

A ranking change ships only if `npm run eval` does not get worse on the held-out set, which is never used for tuning. Each change bumps the ranking version.

## 9. Validation

```bash
gaw skills lint            # whole library
gaw skills lint <folder>   # one skill
```

**Errors** (must fix): missing or invalid `name`/`description`, `name` not matching the folder, unknown top-level frontmatter fields, non-string `metadata` values, `compatibility` over 500 chars, invalid `gaw.json`, `dependsOn` pointing to unknown skills.

**Warnings** (should fix): body over ~5,000 tokens or 500 lines, placeholder descriptions, `source.licenseVerified: false`.

## 10. Index

`skills/index.json` holds every skill's metadata, `gaw.json` contract and a token estimate, so GAW can rank skills without reading every skill body. It updates itself: whenever GAW notices skills were added or changed, it rebuilds the index. `gaw skills index` rebuilds it on demand.
