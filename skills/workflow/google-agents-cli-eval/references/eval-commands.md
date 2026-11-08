<!-- Part of the google-agents-cli-eval skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Eval Commands

`agents-cli eval <subcommand> --help` is the authoritative flag list; the examples below are the common invocations.

### `eval run` (default)

Runs the agent over the dataset and grades the traces in one command.

```bash
# Basic: dataset from tests/eval/datasets/, results to artifacts/grade_results/,
# metrics from tests/eval/eval_config.yaml
agents-cli eval run

# Advanced: pick the dataset, metrics, and output dir
agents-cli eval run --dataset tests/eval/datasets/custom.json --metrics final_response_quality,safety --output ./out/

# Gate: exit 1 if the 1-5 judge averages below 4
agents-cli eval run --fail-under custom_response_quality=4
```

### `eval generate`

Runs an agent over an evaluation dataset and writes traces to disk.

By default, runs the agent locally and records a trace per evaluation case. You can generate traces from an already-running agent by passing its HTTP endpoint and app name to `--url` and `--app-name`.

> **ADK projects.** The built-in generator serves the agent over HTTP and drives it over ADK's `/apps/...` and `/run_sse` routes — the same shape `--url` / `--app-name` expect. What it launches depends on the project's language: Python uses the project's `fast_api_app.py` if it exists, else `adk api_server`; Go runs `go run ...`. Extensions for other frameworks replace `eval generate` with their own generator, which may not serve HTTP at all; `--url` and `--app-name` are then unsupported.

```bash
# Basic — uses tests/eval/datasets/, writes to artifacts/traces/
agents-cli eval generate

# Advanced — custom dataset and output dir
agents-cli eval generate --dataset tests/eval/datasets/custom.json -o ./custom_traces/

# Against a deployed agent (or one you started manually)
agents-cli eval generate --url https://my-agent.run.app --app-name app

# Live agent — stream each case over ADK's /run_live WebSocket
agents-cli eval generate --mode adk_live
```

#### Evaluating Live agents

Live agents run over a WebSocket, not `/run_sse`: add `--mode adk_live` to `generate` or `run`. The dataset, the traces, and grading are unchanged, and the audio reply is transcribed so the transcript is what gets graded. Two things must already be true or the socket connects and *then* fails mid-session: the agent uses a Live model (the scaffold default is not one), and on Gemini platform its region is pinned on the model rather than left to `GOOGLE_CLOUD_LOCATION`. Both, plus dataset authoring rules: `references/live-eval.md`.

### `eval grade`

Scores traces (from `eval generate`, `eval dataset synthesize`, or hand-authored) against built-in or custom metrics. Writes timestamped `results_<YYYYMMDD_HHMMSS>.json` (consumed by `eval compare`) and `.html` (open in a browser) into the output dir, and prints a summary table to the console. The output ends with a `RESULT: PASS|FAIL (...)` line; the command exits 1 when a metric's mean score is below its threshold (`thresholds` in the config, or `--fail-under`) or any case errored, so CI can gate on the exit code.

```bash
# Basic — defaults: traces from artifacts/traces/, results to artifacts/grade_results/,
# metrics from tests/eval/eval_config.yaml's metrics_to_run
agents-cli eval grade

# Advanced 1 — grade traces from a non-default location (the canonical
# pairing for `eval generate --output custom_traces/`)
agents-cli eval grade --traces custom_traces/

# Advanced 2: load metrics to run from a config file (YAML or JSON) on a specified trace file.
agents-cli eval grade --traces ./artifacts/traces/trace_1.json --config tests/eval/eval_config.yaml

# Advanced 3: dispatch rate, 15 metric computations per second by default. Lower it when the
# judge model or the eval service rate-limits you, raise it when they have headroom.
agents-cli eval grade --qps 5
```

See *Evaluation Configuration Schema* below for the config file format.

### `eval compare`

Diffs two `results_*.json` files from an eval run. Run it after a fix to confirm the target metric improved without regressing others.

```bash
agents-cli eval compare baseline.json candidate.json
```

### `eval dataset synthesize`

> **ADK projects.** It loads and runs the agent through ADK, so it is unavailable on other frameworks.

Generates user scenarios from your agent's tools and instructions, plays each against an LLM-backed user simulator, and writes graded-ready traces to `artifacts/traces/` (feed straight to `eval grade`, skip `eval generate`). Invocations, flags, and compatible metrics: `references/user-simulation.md`.

### Advanced commands

`eval analyze` (cluster failure modes), `eval optimize` (GEPA prompt tuning), and `eval submit` / `eval results` (managed cloud-side runs for CI or large datasets) are documented in `references/advanced-commands.md`.

---

## Evaluation Dataset Format

An `EvaluationDataset` is a JSON file with an `eval_cases` array. Cases come in two shapes depending on how they're used:

- **Inference input** (what you give to `eval generate`) — a single user prompt, or a multi-turn set of **user turns** (for live) / a continuation ending in a user turn (for SSE). The agent runs and produces traces. Don't pre-author agent replies for live inference.
- **Grading input** (what you give to `eval grade`) — a complete trace including the agent's responses and tool calls. Normally produced by `eval generate` or `eval dataset synthesize`; you don't write these by hand.

See `references/dataset_schema.md` for the full canonical schema, all field types, and common mistakes.

### Inference input format

Two shapes are supported.

**(a) Simple single-turn prompt** — what the scaffolded `tests/eval/datasets/basic-dataset.json` uses. The agent runs from scratch.

```json
{
  "eval_cases": [
    {
      "eval_case_id": "greeting",
      "prompt": {
        "role": "user",
        "parts": [{"text": "Hello, what can you help me with?"}]
      }
    }
  ]
}
```

**(b) Multi-turn via `agent_data`** — the shape depends on the transport:

- **Live (`--mode adk_live`):** author **user-only** turns; the agent generates every reply over one live session (authored agent turns are ignored, with a warning).
- **SSE:** continuation form — prior turns are seeded as history and only the trailing user turn is answered.

See `references/dataset_schema.md` (*Multi-Turn / Multi-Agent Dataset*) for the JSON shapes.

### Grading input format (traces)

A complete trace — agent responses plus `function_call` / `function_response` parts — normally produced by `eval generate` / `eval dataset synthesize` (you don't write these by hand). Authors are `"user"`, an agent ID from the `agents` map, or `"tool"`. See `references/dataset_schema.md` for the trace shape, multi-agent examples, and the full type reference.

---
