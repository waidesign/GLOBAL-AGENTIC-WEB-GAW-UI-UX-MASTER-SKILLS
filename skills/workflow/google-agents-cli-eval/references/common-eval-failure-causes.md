<!-- Part of the google-agents-cli-eval skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Common Eval Failure Causes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Score fluctuates between runs | Non-deterministic model | Set `temperature=0` or use rubric-based eval with multiple samples |
| LLM judge ignores image/audio in eval | `get_text_from_content()` skips non-text parts | Use custom metric with vision-capable judge (see `references/multimodal-eval.md`) |

---

## Proving Your Work

Don't assert that eval passes — show the evidence. Concrete output prevents false confidence and catches issues early.

- **After running eval:** Paste the scores table output so the user can see exactly what passed and failed.
- **After fixing a failure:** Show before/after scores for the specific case you fixed, and confirm no other cases regressed.
- **Before deploy:** Rerun `agents-cli eval run` and show the scores for every case, not just the one you fixed, plus the final `RESULT:` line. The exit code gates only on the `thresholds` you set (and errored cases), so confirm they match the bar you agreed with the user.

---

## Related Skills

- `/google-agents-cli-workflow` — Development workflow and the spec-driven build-evaluate-deploy lifecycle
- `/google-agents-cli-adk-code` — ADK API quick reference for writing agent code (ADK projects only)
- `/google-agents-cli-scaffold` — Project creation and enhancement with `agents-cli scaffold create` / `scaffold enhance`
- `/google-agents-cli-deploy` — Deployment targets, CI/CD pipelines, and production workflows
- `/google-agents-cli-observability` — Cloud Trace, logging, and monitoring for debugging agent behavior
