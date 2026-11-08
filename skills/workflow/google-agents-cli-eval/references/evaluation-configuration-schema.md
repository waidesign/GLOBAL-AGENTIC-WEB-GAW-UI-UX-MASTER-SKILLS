<!-- Part of the google-agents-cli-eval skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Evaluation Configuration Schema

`agents-cli eval run --config <path>` (and `eval grade --config <path>`) accepts a single configuration file in either **YAML** (`.yaml` / `.yml`) or **JSON** (`.json`). The file declares two parts:

- `metrics_to_run`: the **selection list** of metric names to execute on this run. A name resolves to a `custom_metrics` entry when one matches, otherwise to the built-in metric of that name.
- `custom_metrics` — a **definition pool** of custom metrics available to this project. Defining a metric here does **not** run it; it must also appear in `metrics_to_run` (or be passed via `--metrics name1,name2` on the CLI, which is equivalent to overriding `metrics_to_run` for that invocation).
- `thresholds` (optional) — the minimum **mean score** per metric, in that metric's own scale (built-ins score 0-1, the scaffolded `custom_response_quality` judge 1-5). A run with a metric below its threshold exits 1 and lists the cases scoring below it; `pass_rate` in the results is then the share of cases at or above it, unless the eval service already reported one. `--fail-under METRIC=SCORE` (repeatable, one metric each) overrides them per run. Errored cases fail the run with or without thresholds.

**Minimal example (YAML preferred — human-readable, no JSON escaping for prompts and Python):**

```yaml
metrics_to_run:
  - multi_turn_task_success     # built-in
  - example_llm_metric          # selected from custom_metrics pool below
  - agent_turn_count            # selected from custom_metrics pool below

custom_metrics:
  - name: example_llm_metric
    prompt_template: |
      Rate the agent's response 1-5 for helpfulness and accuracy.
      Prompt: {prompt}
      Final response: {response}
      Full trace (for tool-call and reasoning context): {agent_data}
      Return JSON: {"score": <1|2|3|4|5>, "explanation": "<reason>"}

  - name: agent_turn_count
    custom_function: |
      def evaluate(instance):
          turns = (instance.get("agent_data") or {}).get("turns", [])
          return {'score': len(turns)}

thresholds:
  multi_turn_task_success: 0.8
  example_llm_metric: 4
```

JSON is also accepted (same field names, with `prompt_template` and `custom_function` as escaped strings) — but **always prefer YAML** for human-readable configs.

Dispatch by field: `custom_function` → Python metric; `prompt_template` → `LLMMetric` (LLM-as-judge); neither, on a built-in name → parameterizes that built-in (e.g. `metric_spec_parameters.rubric_group_key`). Field reference: `references/metrics-guide.md`.

**Agent trace field model.** For datasets produced by `agents-cli eval generate` (or `eval dataset synthesize`), each eval case exposes three standard fields to a metric:

- `{prompt}` — the user message (or first user turn).
- `{response}` — the agent's final text response, extracted from the last text-bearing event. In `custom_function` callbacks this is `instance['response']` with shape `{"role": "model", "parts": [{"text": "..."}]}`.
- `{agent_data}` — the full structured `turns`/`events` trace, useful when the judge needs to reason about tool calls or intermediate reasoning.

`reference`, `context`, and `rubric_groups` are yours to author on the case: `eval generate` carries them onto the trace but never invents them, so `{reference}` / `{context}` resolve only where you wrote them. `rubric_groups` is not a placeholder at all: managed rubric metrics read it off the case, and a `custom_function` sees `instance['rubric_groups']`. See `references/dataset_schema.md` (*Per-Case Rubrics*).

Code-based metrics default to **local in-process execution** (no GCP project or region required, but the `evaluate(instance)` function runs with the CLI's privileges). Set `execution: "remote"` on the metric to run it server-side in the `CodeExecutionMetric` sandbox in Gemini platform instead — that path requires a configured GCP project + region.

---

## Common Gotchas

### Use Rubric-Based Tool Evaluation instead of Hardcoded Sequences

Evaluating agent tool usage using strict sequence matching is fragile because agents may call helper tools (like searches or geocoding) in different orders or perform extra proactive steps.

Instead, use **`multi_turn_tool_use_quality`** / **`multi_turn_trajectory_quality`**. These metrics automatically generate content-based and intent-based adaptive rubrics, assessing technical correctness and technical sequence logic semantically using an LLM judge rather than forcing a rigid match.

### App name must match directory name

> **ADK projects.**

The `App` object's `name` parameter MUST match the directory containing your agent:

```python
# CORRECT - matches the "app" directory
app = App(root_agent=root_agent, name="app")

# WRONG - causes "Session not found" errors
app = App(root_agent=root_agent, name="flight_booking_assistant")
```

### Gemini platform eval region

`eval run`, `eval grade`, and `eval submit` **default to the `global` endpoint**. They don't inherit the manifest `region` (the eval services support only a subset of regions), and `eval analyze` is `global`-only. Override these per run with `--region <REGION>` (e.g. data residency); the service rejects an unsupported one:

```
400 FAILED_PRECONDITION: Unsupported region for Vertex Evaluation Service: <region>
```

`eval generate` (without the `--url` flag) and `eval dataset synthesize` run your agent locally, so they honor the agent's own `.env` — notably `GOOGLE_CLOUD_LOCATION`, which selects the model endpoint **when the agent uses Gemini platform** (`GOOGLE_GENAI_USE_ENTERPRISE=true`); it's unused with a `GEMINI_API_KEY` (AI Studio). They take **no** `--region` and never override your `.env` with the manifest `region`; change the model region by editing `.env` — or, better for a single agent, pin it in code with `Gemini(model=…, client_kwargs={"location": …})`, which beats the env var and leaves it free for everything else. One caveat for `synthesize`: its scenario-generation step is a **server-side** eval call at `GOOGLE_CLOUD_LOCATION`, so keep that an eval-supported region (`global` by default) even though the agent itself could run elsewhere.

**No eval region fits your data-residency rules?** Fall back to **local custom metrics** — a `custom_metrics` entry with a `custom_function` (`execution: local`, the default) grades in-process with no GCP region required. You lose the managed built-in metrics, but your `custom_function` can still call an LLM judge in a compliant region itself — so LLM-as-judge grading stays available anywhere.

### The `before_agent_callback` Pattern (State Initialization)

> **ADK projects.**

Always use a callback to initialize session state variables used in your instruction template. This prevents `KeyError` crashes on the first turn:

```python
async def initialize_state(callback_context: CallbackContext) -> None:
    state = callback_context.state
    if "user_preferences" not in state:
        state["user_preferences"] = {}

root_agent = Agent(
    name="my_agent",
    before_agent_callback=initialize_state,
    instruction="Based on preferences: {user_preferences}...",
)
```

### Model thinking mode may bypass tools

Models with "thinking" enabled may skip tool calls. Force tool usage through the model's tool-choice config (**ADK:** `tool_config` with `mode="ANY"`), or switch to a non-thinking model for predictable tool calling.

---
