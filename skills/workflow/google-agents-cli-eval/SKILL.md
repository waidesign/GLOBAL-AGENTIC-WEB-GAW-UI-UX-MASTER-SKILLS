---
name: "google-agents-cli-eval"
description: "This skill should be used when the user wants to \"run an evaluation\", \"evaluate my agent\", \"evaluate my ADK agent\", \"write an eval dataset\", \"analyze eval failures\", \"compare eval results\", \"optimize agent\", or needs guidance on the Gemini platform eval methodology and the Quality Flywheel. Covers eval metrics, dataset schema, LLM-as-judge scoring, and common failure causes. Applies to any agents-cli project, whatever framework the agent is written in. Do NOT use for agent API code patterns (ADK: use google-agents-cli-adk-code), deployment (use google-agents-cli-deploy), or project scaffolding (use google-agents-cli-scaffold)."
license: "Apache-2.0"
metadata:
  gaw-category: "workflow"
  gaw-author: "Google"
  gaw-version: "1.0.0"
---

# Agent Evaluation Guide

> **Requires:** `agents-cli` (`uv tool install google-agents-cli`) — [install uv](https://docs.astral.sh/uv/getting-started/installation/index.md) first if needed.

> **Scaffolded project?** If you used `/google-agents-cli-scaffold`, dataset and a custom metric are already scaffolded in `tests/eval/` (Python projects) or `eval/` (Go projects). For simplicity, this skill and its references use the Python directory layout; adjust accordingly if you've scaffolded a Go agent.
> You already have `agents-cli eval run` (chains `generate` + `grade`), `tests/eval/datasets/`, and `tests/eval/eval_config.yaml`. Start with executing `eval run` and iterate from there.

## Reference Files

| File | Contents |
|------|----------|
| `references/dataset_schema.md` | Canonical EvaluationDataset schema — all field types, JSON examples for single-turn / multi-turn / multi-agent, common mistakes |
| `references/metrics-guide.md` | Complete metrics reference — all built-in metrics, match types, custom metrics, judge model config |
| `references/user-simulation.md` | Dynamic conversation testing — `eval dataset synthesize` flags, what scenarios are, compatible metrics |
| `references/builtin-tools-eval.md` | google_search and model-internal tools — trajectory behavior, metric compatibility |
| `references/advanced-commands.md` | Opt-in commands: `eval analyze`, `eval optimize`, `eval submit` / `eval results` |
| `references/multimodal-eval.md` | Multimodal inputs — eval dataset schema, built-in metric limitations, custom evaluator pattern |
| `references/live-eval.md` | Live and voice agents — `--mode adk_live`, what gets graded, user-only turn authoring, the Live-model and region traps |

---

## The Quality Flywheel

Improving agent quality is iterative. The 4 stages below describe the loop. Each stage has a Default path (you, the coding agent, do the work directly) and an Opt-in CLI command that delegates to the Eval Service in Gemini platform for better quality and scale.

### 1. Prepare Data

**Default:** Use or edit the scaffolded `tests/eval/datasets/basic-dataset.json` to define single-turn eval inputs. Start with 1–2 cases.

**Opt-in (ADK projects):** `agents-cli eval dataset synthesize`: user-simulate multi-turn datasets when you lack data; its output already includes traces, so Stage 2 collapses to `agents-cli eval grade` alone. See *Eval Commands* and `references/user-simulation.md`.

### 2. Run the Eval (always run)

**Default:** `agents-cli eval run` runs the agent over the dataset and grades the traces, writing `results_<ts>.{json,html}` to `artifacts/grade_results/`. Its last line is the verdict, e.g. `RESULT: FAIL (custom_response_quality 3.20 < 4.00; custom_response_quality: 1 case errored)`, and it exits 1 when a metric misses its threshold or a case errored. Agree the thresholds with the user and record them in the eval config (see *Evaluation Configuration Schema*).

**Decoupled form:** `eval generate` then `eval grade`, for a custom traces location, re-grading without re-running the agent, or traces from `synthesize` (`eval grade` alone).

### 3. Analyze Failures

**Default:** Start from the `Failures:` list above the `RESULT:` line, which names each metric that missed its threshold, the cases below it, and the cases that errored. Then open the latest `artifacts/grade_results/results_<ts>.html` (or `.json`) for those cases' scores and judge rationales — see *What to fix when scores fail* below for the fix table.

**Opt-in:** `agents-cli eval analyze`, LLM-based failure clustering; prefer when you have 10+ failing cases and want categorized failure modes. See `references/advanced-commands.md`.

### 4. Optimize & Code Fix

**Default:** Edit the agent — adjust prompts, tool descriptions, instructions, or eval dataset based on the failure analysis. See *What to fix when scores fail* below for the failure → fix mapping.

**Opt-in (ADK projects):** `agents-cli eval optimize` runs ADK GEPA prompt optimization against a target metric (see `references/advanced-commands.md`). Suitable for prompt-only failures. The optimized prompt appears in the command output; capture it and apply it to the agent. For the full per-iteration trace, set `print_detailed_results: true` in your optimization config file.

> **Long-running and expensive.** GEPA optimization makes many LLM calls and can take a long time. Do not run it unless the user explicitly asks for prompt optimization. When you do run it, iterate as far as possible with manual fixes first, then run a **single** final `eval optimize` — never loop on this command.

### Running the loop

Iterate stages 2 → 3 → 4 → 2 (with `synthesize`, re-run Stage 1 each pass, then `eval grade`). After each fix, run `agents-cli eval compare <prev_results>.json <new_results>.json` to confirm the target metric improved without regressing others. Expect 5–10+ iterations per case before it passes, which is normal. Only after a case passes should you expand coverage with more eval cases.

When doing 5+ iterations, maintain a task list of which cases are fixed, which are still failing, and what fixes you've tried. Prevents re-attempting the same fix.

**Hold cases back.** Keep a slice of cases out of the loop and grade them only when you think you're done — otherwise you can't tell a fix that generalizes from one fitted to the cases you iterated against.

### Shortcuts That Waste Time

Recognize these rationalizations and push back — they always cost more time than they save:

| Shortcut | Why it fails |
|----------|-------------|
| "I'll lower the bar so it passes" | Lowering the bar hides real failures. If the agent can't meet the bar, fix the agent, don't move the bar. |
| "This eval case is flaky, I'll skip it" | Flaky evals reveal non-determinism in your agent. Fix with `temperature=0`, rubric-based metrics, or more specific instructions — don't delete the signal. |
| "I just need to fix the eval dataset, not the agent" | If you're always adjusting expected outputs, your agent has a behavior problem. Fix the instructions or tool logic first. |
| "I'll iterate until every case I have passes" | Nothing is left to detect overfitting to your own cases. See *Hold cases back* above. |

## Choosing the Right Metrics

Pick built-in metrics by what you want to measure. Only `multi_turn_task_success`, `multi_turn_trajectory_quality`, and `multi_turn_tool_use_quality` accept multi-turn traces; every other built-in 400s on one. When no built-in fits, write a custom metric (see *Evaluation Configuration Schema* below).

| Goal | Recommended built-in metrics |
|------|------------------------------|
| **Did the agent achieve the user's goal?** (catch-all for multi-turn agents) | `multi_turn_task_success` |
| **Was the agent's reasoning path logical and efficient?** | `multi_turn_trajectory_quality` |
| **Quality of tool / function calling across turns** | `multi_turn_tool_use_quality` |
| **Final response quality** (no ground-truth reference needed) | `final_response_quality` |
| **Factual grounding** (catch hallucinated claims, e.g., RAG agents) | `hallucination`, or `grounding` when the case carries a `context` field |
| **Safety policy compliance** | `safety` |
| **Match against a golden answer** | `final_response_match` (needs `reference` on the case) |
| **Different pass/fail criteria per case** | Put them on the case as `rubric_groups` and grade with a managed rubric metric. See `references/dataset_schema.md` (*Per-Case Rubrics*). |
| **Domain-specific check no built-in covers** | Write a custom `LLMMetric` (LLM-judge) or `CodeExecutionMetric` (deterministic Python). See *Evaluation Configuration Schema* below. |

Run `agents-cli eval metric list` to see all available built-ins. For full metric definitions and rubric details, see the [Gemini platform metric docs](https://cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) and `references/metrics-guide.md`.

---

## What to fix when scores fail

After `agents-cli eval run` completes, inspect the latest `artifacts/grade_results/results_<timestamp>.json` (or open the `.html` file) for per-case scores and judge rationales, the input to every fix decision below.

| Failure | What to change |
|---------|---------------|
| `multi_turn_task_success` low | The agent isn't completing the user's goal — fix orchestration, missing tool calls, premature termination, or wrong tool selection |
| `multi_turn_trajectory_quality` low | The agent reaches the goal inefficiently or takes wrong steps — refine planning prompts, tighten instruction order, or remove redundant tool calls |
| `multi_turn_tool_use_quality` low | Fix tool descriptions, parameter docstrings, or agent instructions for tool selection |
| `final_response_quality` low | Read the auto-generated rubric verdicts; refine agent instructions to address the worst-scoring criterion (often clarity, completeness, or instruction-following) |
| `hallucination` low | Tighten agent instructions to stay grounded in tool output; verify the tool actually returned the data the agent claimed |
| `safety` low | Add safety guardrails to instructions; review the violating content category in the rubric verdict |
| Agent calls wrong tools | Fix tool descriptions, agent instructions, or the model's tool-choice config (**ADK:** `tool_config`) |
| Agent calls extra tools | Add strict stop instructions, or switch to `multi_turn_tool_use_quality` |

After applying a fix, rerun `agents-cli eval run` and use `agents-cli eval compare <prev_results>.json <new_results>.json` to confirm the fix improved the target metric without regressing others.

---

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Eval Commands; Evaluation Dataset Format](references/eval-commands.md) (~1687 tokens)
- [Evaluation Configuration Schema; Common Gotchas](references/evaluation-configuration-schema.md) (~1853 tokens)
- [Common Eval Failure Causes; Proving Your Work; Related Skills](references/common-eval-failure-causes.md) (~399 tokens)
