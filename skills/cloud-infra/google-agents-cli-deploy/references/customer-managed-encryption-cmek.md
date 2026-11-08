<!-- Part of the google-agents-cli-deploy skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Customer-managed encryption (CMEK)

An Agent Runtime agent can be encrypted with your Cloud KMS key. The key is fixed at creation,
so set it where the agent is created: `deploy --key` for dev deployments, or the Terraform files
for staging/prod (`infra cicd`) and `infra single-project`; `--key` cannot add a key to an agent
Terraform created. Required key grants and the Terraform edits: `references/cmek.md`.

## Semantic Governance

**Semantic Governance Policies (SGP)** add a natural-language security/compliance layer
that keeps an agent's tool invocations aligned with user intent and organizational
constraints.

- Overview: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/policies/semantic-governance-overview
- Configure: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/policies/configure-semantic-governance

---

## Related Skills

- `/google-agents-cli-workflow` — Development workflow, coding guidelines, and operational rules
- `/google-agents-cli-adk-code` — ADK API quick reference for writing agent code
- `/google-agents-cli-eval` — Evaluation methodology, dataset schema, and the eval-fix loop
- `/google-agents-cli-scaffold` — Project creation and enhancement with `agents-cli scaffold create` / `scaffold enhance`
- `/google-agents-cli-observability` — Cloud Trace, logging, BigQuery Analytics, and third-party integrations
- `/google-agents-cli-publish` — Gemini registration
