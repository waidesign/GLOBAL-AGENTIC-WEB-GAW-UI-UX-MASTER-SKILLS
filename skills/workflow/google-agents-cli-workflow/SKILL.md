---
name: "google-agents-cli-workflow"
description: "This skill should be used when the user wants to \"develop an agent\", \"build an agent using ADK\", \"run the agent locally\", \"debug agent code\", \"test an agent\", \"deploy an agent\", \"publish an agent\", \"monitor an agent\", or needs the ADK (Agent Development Kit) development lifecycle and coding guidelines. Entrypoint for building ADK agents. Always active — provides the full workflow (scaffold, build, evaluate, deploy, publish, observe), code preservation rules, model selection guidance, and troubleshooting steps for ADK or any agent development."
license: "Apache-2.0"
metadata:
  gaw-category: "workflow"
  gaw-author: "Google"
  gaw-version: "1.0.0"
---

# Agent Development Workflow & Guidelines

**agents-cli** is a CLI and skills toolkit for building, evaluating, and deploying agents on Google Cloud. It works with any coding agent — Antigravity CLI, Claude Code, Codex, or others — and with the agent framework of your choice (the [Agent Development Kit (ADK)](https://adk.dev/) by default). Install with `uvx google-agents-cli setup`.

> **Before writing agent code, make sure a scaffolded project exists (see Phase 2).** Skipping scaffolding loses eval boilerplate, CI/CD config, and project conventions.


> Requires: google-agents-cli ~= 1.13.0
> If version is behind, run: uv tool install "google-agents-cli~=1.13.0"

> Check version: agents-cli info
> [Install uv](https://docs.astral.sh/uv/getting-started/installation/index.md) first if needed.

## Session Continuity & Skill Cross-References

Re-read the relevant skill **before** each phase — not after you've already started and hit a problem. Context compaction may have dropped earlier skill content. If skills are not available, run `uvx google-agents-cli setup` to install them.

| Phase | Skill | When to load |
|-------|-------|--------------|
| 0 — Understand | — | No skill needed — read `.agents-cli-spec.md` if present, else clarify goals with the user |
| 1 — Study recipes | `/google-agents-cli-adk-code` | **Load it during design**, before scaffolding. Python: the `references/recipes.md` topic index maps a need to the recipe that implements it. Go: the upstream [examples/](https://github.com/google/adk-go/tree/main/examples) are the equivalent. Yes, load this early. |
| 2 — Scaffold | `/google-agents-cli-scaffold` | Before creating or enhancing a project |
| 3 — Build | `/google-agents-cli-adk-code` | Before writing agent code — API patterns, tools, callbacks, state |
| 4 — Evaluate | `/google-agents-cli-eval` | Before running any eval — dataset schema, metrics, eval-fix loop |
| 5 — Deploy | `/google-agents-cli-deploy` | Before deploying — target selection, troubleshooting 403/timeouts |
| 6 — Publish | `/google-agents-cli-publish` | After deploying, if registering with Gemini (optional) |
| 7 — Observe | `/google-agents-cli-observability` | After deploying — traces, logging, monitoring setup |

---

## Setup

If `agents-cli` is not installed:
```bash
uv tool install google-agents-cli
```

### `uv` command not found

Install `uv` following the [official installation guide](https://docs.astral.sh/uv/getting-started/installation/index.md).

### Product name mapping

Users name products inconsistently (Vertex AI or Agent Platform → Gemini platform, Agent Engine or Agent Runtime → Agent Runtime in Gemini platform, etc.). Map user terms to CLI values using `references/terminology.md`.

---

## Phase 0: Understand

Before writing or scaffolding anything, understand what you're building — through a **design dialogue**, not a checklist. Load `references/brainstorming.md` and follow it: ask **one question at a time**, propose 2–3 architecture approaches for non-trivial agents, and validate the design before any scaffolding.

If `.agents-cli-spec.md` exists in the current directory, read it — it is your primary source of truth. Otherwise:

Do NOT proceed to planning, scaffolding, or coding until the user approves the spec. Do not assume, research, or fill in the blanks yourself — the user's intent drives everything.

**Scale the ceremony to complexity:** a trivial agent (single tool, fixed persona) needs only a couple of questions, a 2–3 sentence spec, and one approval; a complex agent (multi-agent, RAG, external APIs/auth, safety-critical) gets the full treatment in `references/brainstorming.md`.

**Topics to cover** (one question at a time, adapting to the user — see the playbook):

1. **What problem will the agent solve?** — Core purpose and capabilities
2. **External APIs or data sources needed?** — Tools, integrations, auth requirements
3. **Safety constraints?** — What the agent must NOT do, guardrails
4. **Deployment preference?** — Prototype first (recommended) or full deployment? If deploying: Agent Runtime, Cloud Run, or GKE?

**Ask based on context:**

- If the agent needs a **capability the scaffold doesn't ship** — retrieval over your data, sandboxed code execution, memory across sessions, OAuth consent, safety guardrails, event-driven triggers — that capability comes from a **clone-and-study recipe**, not a scaffold flag. Look the need up in the topic index in `/google-agents-cli-adk-code` → `references/recipes.md` and study the matching recipe in Phase 1.
- If the agent is a **live or voice agent** (Live API, spoken conversation, barge-in, telephony) → load `/google-agents-cli-adk-code` (`references/adk-python-live.md`) **before writing the spec**. Live rules out A2A, the Gemini app, and the default model.
- If agent should be **available to other agents** → **A2A protocol** is built into every Python agent scaffolded by agents-cli; no separate choice needed — just scaffold normally.
- If **full deployment** chosen → **CI/CD runner?** GitHub Actions (default) or Google Cloud Build?
- If agent should **remember user preferences or facts across sessions** → long-term memory across conversations. Load `/google-agents-cli-adk-code` — it has both the recipe (in `references/recipes.md`) and the ADK memory API details.
- If **Cloud Run** or **GKE** chosen → **Session storage?** In-memory (default), Cloud SQL (persistent), or Sessions in Gemini platform (managed).
- If **deployment with CI/CD** chosen → **Git repository?** Does one already exist, or should one be created? If creating, public or private?

Once the design is agreed, write the spec to `.agents-cli-spec.md` using the template in `references/spec-template.md`, self-review it, then get the user's approval. See `/google-agents-cli-scaffold` for how these choices map to CLI flags.

Once you have a clear understanding, proceed to **Phase 1**.

## Phase 1: Study Reference Recipes

> **Trigger.** If the request involves any of: searching your
> own documents · running shell or Python code on a user's behalf · a sandboxed or isolated per-user
> environment · loading skills the agent picks up at runtime · work that spans days, resumes, or runs
> unattended · remembering across conversations · approving a risky action before it executes ·
> blocking harmful content or moderating what agents say · acting with a user's own API keys or
> credentials · OAuth consent to reach a user's own data · delegating to sub-agents with isolated
> context · speaking A2A to other agents · reacting to events or a schedule · researching a topic
> online and reporting it with citations · generating images or video · monitoring a deployed
> agent's quality from its production traces · talking to the agent by voice in real time — then a recipe already
> implements it. Look it up **before you commit to an implementation.**
>
> This list covers the same capabilities as the topic index in `/google-agents-cli-adk-code` → `references/recipes.md`. If you extend one, extend the other.

**Load `/google-agents-cli-adk-code` now**.Load it even though nothing is scaffolded and you are not writing code yet; "wrong phase for the code skill" is the rationalisation that makes agents skip this step, and that skill's *Prerequisites for writing code* does not apply to you.

Look up each capability the design calls for. **ADK Python:** the **topic index** in
`references/recipes.md` maps needs (retrieval, sandboxed execution, memory, approval gates,
guardrails, per-user credentials, scheduling) to the recipe that teaches them and shows how to
clone one. **ADK Go:** there is no references catalog — read `references/adk-go.md` for the API and
the upstream [`examples/`](https://github.com/google/adk-go/tree/main/examples).

Multiple recipes can match — clone and study all that are relevant, starting with each one's `AGENTS.md`.

If no recipe matches, proceed to Phase 2. But first — are you sure? Re-read the user's request and re-check the topic index for your language. Skipping a matching recipe means rebuilding patterns that already exist, usually worse.

> **IMPORTANT — Exit criteria:** After studying a recipe, ask yourself: can I apply anything from it to help me deliver the design? Note what you'll reuse before moving on. Do NOT proceed until you've answered this.

> **This catalog is useful at any phase** — revisit it when you hit deployment, publishing, or infrastructure questions. A recipe's Terraform or registration pattern may be exactly what you need later.

## Phase 2: Scaffold (if needed)

First check whether a project already exists: run `agents-cli info` from the project root. If one was already created or enhanced by agents-cli, skip this phase.

Otherwise, scaffold **before writing any code**:
- **No project yet** → `agents-cli scaffold create <name> --agent <template> --deployment-target <target>`
- **Existing code to import** → `agents-cli scaffold enhance .` (adds the agents-cli structure)

Use `/google-agents-cli-scaffold` for the full workflow — it covers architecture choices (deployment target, agent type, session storage) and project creation or enhancement.

## Phase 3: Build and Implement

Implement the agent logic:

1. Write/modify code in the agent directory (check `GEMINI.md` / `CLAUDE.md` for directory name)
2. **Quick smoke test**: Use `agents-cli run "your prompt"` to verify the agent works after changes — this is the fastest way to check behavior without leaving the terminal
3. Iterate on the implementation based on user feedback

If the user asks for interactive testing, suggest `agents-cli playground` — it opens a web-based playground for manual conversation with the agent.

For ADK API patterns and code examples, use `/google-agents-cli-adk-code`.

> **Smoke-test only here — do not write behavioral unit tests.** LLM output is non-deterministic; behavioral checks belong in eval (Phase 4), not in `pytest` or `go test`. Use `agents-cli run "prompt"` for quick checks.

### Provision recipe infrastructure (if you adapted one)

A recipe that needs backing infrastructure (a datastore, an index, a sandbox, a queue) ships its own
provisioning: follow its `Makefile` (e.g. `make setup-infra`, `make data-ingestion`) and its
`AGENTS.md` / `README.md`, adapting the recipe's `infra/terraform/` and `.env` into your project.
`agents-cli` has no command for this.

## Phase 4: Evaluate

**This is the most important phase.** Evaluation validates agent behavior end-to-end.

**MANDATORY:** Activate `/google-agents-cli-eval` before running evaluation.
It contains the dataset schema, config format, and critical gotchas. Do NOT skip this.

**Do NOT skip this phase.** After building the agent, you MUST proceed to evaluation.

**Unit tests vs `agents-cli eval` — know the difference:**
- **Unit tests** (`uv run pytest` for Python, `go test ./...` for Go) — Tests *code correctness*: imports work, functions return expected types, API contracts hold. Does NOT test whether the agent behaves well.
- **`agents-cli eval`** — Tests *agent behavior*: response quality, tool usage, persona consistency, safety compliance. This is what validates your agent actually works.
- **`agents-cli run "prompt"`** — Quick one-off smoke test during development. If testing multiple prompts use the `--start-server` option to persist the local server, which reduces overhead for repeated calls and allows resuming local sessions via `--session-id`. Use this for fast iteration, not unit tests.

**NEVER write unit tests that check LLM response content** (e.g., asserting pirate keywords appear, checking if the agent mentions allergies). LLM outputs are non-deterministic. Use eval with LLM-as-judge criteria instead.

1. **Start small**: Begin with 1-2 sample eval cases, not a full suite
2. Run evaluations: `agents-cli eval run` (chains `generate` + `grade`). For debugging or custom trace locations, use the two-step form: `agents-cli eval generate` then `agents-cli eval grade`.
3. Discuss results with the user
4. Fix issues and iterate on the core cases first
5. Only after core cases pass, add edge cases and new scenarios
6. Repeat until every case meets the bar you agreed with the user. Record that bar as `thresholds` in the eval config: `eval run` then ends with `RESULT: PASS` or `RESULT: FAIL (...)` and exits 1 on a miss or an errored case

**Expect 5-10+ iterations here.**

## Phase 5: Deploy

Once the user agrees the eval scores are good enough:

1. Check if the project has a deployment target configured — run `agents-cli info` to see current config
2. If the project is a prototype (no deployment target), add deployment support first:
   ```bash
   agents-cli scaffold enhance . --deployment-target <target>
   ```
   See `/google-agents-cli-deploy` for the deployment target decision matrix (Agent Runtime vs Cloud Run vs GKE).
3. Deploy when ready: `agents-cli deploy`

**IMPORTANT**: Never deploy without explicit human approval.

## Phase 6: Publish (optional)

Not all agents require this — currently supporting registration with Gemini. See `/google-agents-cli-publish` for registration modes, flags, and troubleshooting.

## Phase 7: Observe

After deploying, use observability tools to monitor agent behavior in production. See `/google-agents-cli-observability` for Cloud Trace, prompt-response logging, BigQuery Analytics, and third-party integrations.

---

# Operational Guidelines for Coding Agents

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Common Shortcuts to Resist; Principle 1: Code Preservation & Isolation; Principle 2: Execution Best Practices](references/common-shortcuts-to-resist.md) (~1613 tokens)
- [Using a Temporary Scaffold as Reference; Reference Files; Development Commands; …](references/using-a-temporary-scaffold-as-reference.md) (~401 tokens)
