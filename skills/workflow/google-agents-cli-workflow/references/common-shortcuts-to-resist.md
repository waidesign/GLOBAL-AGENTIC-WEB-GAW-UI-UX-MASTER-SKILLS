<!-- Part of the google-agents-cli-workflow skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Common Shortcuts to Resist

Agents routinely skip steps with plausible-sounding excuses. Recognize these and push back:

| Shortcut | Why it fails |
|----------|-------------|
| "The user's request is clear enough, no need to clarify" | You're guessing at requirements. Phase 0 exists to confirm intent before scaffolding — even one question can prevent a full rework. |
| "The agent responded correctly in `agents-cli run`, so eval isn't needed" | One prompt is not a test suite. Eval catches regressions, edge cases, and tool trajectory issues that a single run never will. |
| "I'll use a newer/better model" | The scaffolded model was chosen deliberately. Changing it without being asked violates code preservation (Principle 1) and often breaks things — wrong location, deprecated version, or 404. Your training data is likely out of date — rely on the skills and the model listing command, not your knowledge of model names. |
| "I already know how to build this — sandbox, memory, approval gates" | You are about to reinvent a recipe, worse. These capabilities are already implemented and battle-tested in `/google-agents-cli-adk-code` → `references/recipes.md`; check the topic index and open the matching recipe's `AGENTS.md` before designing anything custom. |
| "I can skip the scaffold and set up manually" | Manual setup misses eval boilerplate, CI/CD config, and project configuration manifest conventions. Use `agents-cli create` even for quick experiments. |

## Principle 1: Code Preservation & Isolation

Code modifications require surgical precision — alter only the code segments directly targeted by the user's request and strictly preserve all surrounding and unrelated code.

**Mandatory Pre-Execution Verification:**

Before finalizing any code replacement, verify the following:

1. **Target Identification:** Clearly define the exact lines or expressions to change, based *solely* on the user's explicit instructions.
2. **Preservation Check:** Confirm that all code, configuration values (e.g., `model`, `version`, `api_key`), comments, and formatting *outside* the identified target remain identical.

**Example:**

- **User Request:** "Change the agent's instruction to be a recipe suggester."
- **Incorrect (VIOLATION):**
  ```python
  root_agent = Agent(
      name="recipe_suggester",
      model="gemini-1.5-flash",  # UNINTENDED - model was not requested to change
      instruction="You are a recipe suggester."
  )
  ```
- **Correct (COMPLIANT):**
  ```python
  root_agent = Agent(
      name="recipe_suggester",  # OK, related to new purpose
      model="gemini-3.8-flash",  # PRESERVED
      instruction="You are a recipe suggester."  # OK, the direct target
  )
  ```

## Principle 2: Execution Best Practices

- **Model Selection — CRITICAL:**
  - **NEVER change the model unless explicitly asked.**
  - When creating NEW agents (not modifying existing), use the latest Gemini model. List what is available in the location your agent actually uses (`GOOGLE_CLOUD_LOCATION`; `global` by default) — not every model is served from every location:
    ```bash
    uv run --with google-genai python -c "
    from google import genai
    # Use your GOOGLE_CLOUD_LOCATION ('global', or a region such as 'us-east1')
    client = genai.Client(vertexai=True, location='global')
    for m in client.models.list(): print(m.name)
    "
    ```
  - Do NOT use older models unless explicitly requested. For model docs, fetch `https://adk.dev/agents/models/google-gemini/index.md`. See also [stable model versions](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions) and [model endpoint locations](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/locations#google-models).

- **Running Python Commands:**
  - Always use `uv` to execute Python commands (e.g., `uv run python script.py`)
  - Run `uv sync` before executing scripts

- **Breaking Infinite Loops:**
  - **Stop immediately** if you see the same error 3+ times in a row
  - **RED FLAGS**: Lock IDs incrementing, names appending v5→v6→v7, "I'll try one more time" repeatedly
  - **State conflicts** (Error 409): Use `terraform import` instead of retrying creation
  - **When stuck**: Run underlying commands directly (e.g., `terraform` CLI)

- **Troubleshooting:**
  - Check `/google-agents-cli-adk-code` first — it covers most common patterns
  - Use WebFetch on URLs from the ADK docs index (`curl https://adk.dev/llms.txt`) for deep dives
  - When encountering persistent errors, a targeted web search often finds solutions faster
  - **CLI command failures:** run `agents-cli <command> --help` — the output ends with a `Source:` line pointing to the exact source file implementing that command. Read it to understand the logic and diagnose failures. Use `agents-cli info` to get the full CLI install path if you need to browse across multiple files.

### Systematic Debugging

When something breaks, follow this sequence — don't skip steps or shotgun fixes:

1. **Reproduce** — Run the exact command that failed. Save the full error output. If you can't reproduce it, you can't fix it.
2. **Localize** — Narrow the cause: is it the agent code, a tool, the config, or the environment? Use `agents-cli run "prompt"` to isolate agent behavior from deployment issues. Add `-v` (`--verbose`) to print the full JSON event payloads — useful for inspecting tool calls, intermediate steps, and silent failures.
3. **Fix one thing** — Change one variable at a time. If you change the instruction AND the tool AND the config simultaneously, you won't know what fixed it (or what broke something else).
4. **Verify** — Rerun the exact reproduction command. Don't assume the fix worked.
5. **Guard** — If it was a non-obvious bug, add an eval case to catch regressions.

**Stop-the-line rule:** If a change breaks something that was working, stop feature work and fix the regression first. Don't push forward hoping to circle back — regressions compound.

- **Environment Variables:**
  - `.env` files and env var assignments (e.g., `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`) are typically required for the agent to function — never remove or modify them unless the user explicitly asks
  - If a `.env` file exists in the project root, treat it as essential configuration
  - For secrets and API keys, prefer GCP Secret Manager over plain `.env` entries — see `/google-agents-cli-deploy` for secret management guidance

---
