<!-- Part of the microsoft-foundry skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Agent: Agent Types

Agent workflows distinguish four first-class agent types:

| Type | Kind | Description |
|------|------|-------------|
| **Prompt** | `"prompt"` | LLM-based agents backed by a model deployment; managed via Foundry MCP or SDK |
| **Hosted** | `"hosted"` | Container-based agents running custom code; developed and deployed via `azd` |
| **Managed Harness Agent** | `"prompt"` with `harness.type: "microsoft_copilot_preview"` for new authoring | Prompt Agent running on the Foundry-managed Copilot harness; developed and deployed via `azd` |
| **Voice** | `"voice"` | Managed real-time Voice Agent — either **Prompt Voice** (1 agent, `modelType: managed` or `self_deployed`) or **Hosted Voice** (2 agents: `kind: voice` wrapper with `conversationEngine.type: hosted_agent` + `kind: hosted` target over `invocations_ws` `1.0.0` and Voice Live Bridge `1.0`); developed and deployed via `azd` and verified over the `voice` WebSocket endpoint |

Classify an `azure.yaml` service by its definition in this exact order, not by `host` alone:

1. `kind: voice` -> **Voice**. For compatibility, silently classify an existing `kind: prompt-voice` service as Voice, then normalize it when editing its YAML. Classify the subtype:
   - `conversationEngine.type: hosted_agent` -> **Hosted Voice wrapper** (paired with a named `kind: hosted` target service).
   - `modelType: managed` or `modelType: self_deployed` -> **Prompt Voice** (Foundry infers native speech-to-speech vs cascaded STT -> LLM -> TTS from `model.id`).
   - Having **both** `modelType`/`model` and `conversationEngine` is invalid (stop and fix `azure.yaml`); having **neither** is incomplete (do not guess). Never use obsolete `modelType: hosted_agent`, `targetAgent`, or a nested `config:` block.
2. `kind: hosted` -> **Hosted**. When it declares `protocols: [{ protocol: invocations_ws, version: 1.0.0 }]` and `metadata.voiceLiveCompatible: "true"` alongside a `kind: voice` wrapper, it is a **Hosted Voice target**; otherwise treat a standalone `invocations_ws` service as a **custom Hosted real-time/audio agent**.
3. `kind: prompt` plus `harness.type: microsoft_copilot_preview` or legacy `github_copilot_preview` -> **Managed Harness Agent**.
4. `kind: prompt` without that harness -> ordinary **Prompt Agent**.

Use `agent_get` only when the type cannot be resolved from project context. Preserve the harness discriminator already authored on an existing Managed Harness Agent; do not migrate it during ordinary edits or redeploys. Do not convert an existing Agent between Prompt, Hosted, Managed Harness Agent, and Voice types; create a new Agent instead. Before creating any **Voice Agent**, determine the model strategy first per [create-voice](foundry-agent/create/create-voice.md).

## Tool Usage Conventions

- Use the `ask_user` or `askQuestions` tool whenever collecting information from the user
- Use the `task` or `runSubagent` tool to delegate long-running or independent sub-tasks (e.g., env var scanning, status polling, Dockerfile generation)
- Prefer azd for Hosted Agents, Managed Harness Agents, and Voice Agents; prefer Foundry MCP for ordinary Prompt Agents.
- Reference official Microsoft documentation URLs instead of embedding CLI command syntax

## Azure Authentication

- [Azure Authentication Best Practices](references/auth-best-practices.md)

## Additional Resources

- [Foundry Hosted Agents](https://learn.microsoft.com/azure/ai-foundry/agents/concepts/hosted-agents?view=foundry)
- [Foundry Agent Runtime Components](https://learn.microsoft.com/azure/ai-foundry/agents/concepts/runtime-components?view=foundry)

## Network Isolation Errors

Applies to **any** call against a Foundry project or its parent Foundry account — Foundry MCP tools, `azd`, `az` CLI, `curl`, REST, or SDK.

If an error matches `Public access is disabled` / `PublicNetworkAccessDisabled` / `403 Forbidden` from a private endpoint / connection timeout / the project endpoint FQDN resolves to a public IP, this typically means the parent Foundry account has `publicNetworkAccess=Disabled` or `Enabled from selected IP addresses`, and the current shell is outside its VNet.

Only if the error is ambiguous, confirm against the Foundry account using a management-plane call (works from anywhere with reader access):

```bash
az cognitiveservices account show \
  --name <account> --resource-group <rg> \
  --query "properties.{publicNetworkAccess:publicNetworkAccess, networkAcls:networkAcls, privateEndpointConnections:privateEndpointConnections[].properties.privateLinkServiceConnectionState.status}"
```

`publicNetworkAccess: "Disabled"` — or `"Enabled"` together with non-empty `networkAcls.ipRules` / `virtualNetworkRules` — confirms isolation. If `publicNetworkAccess: "Enabled"` and `networkAcls` is empty, the failure is a caller-side network issue (e.g. Private DNS resolving the FQDN to a public IP from inside a VNet with a private endpoint), not an account-config issue.

If it's indeed a network isolation issue, supported connection options are documented in [Choose a secure connection method to Foundry](https://learn.microsoft.com/azure/foundry/how-to/configure-private-link#choose-a-secure-connection-method-to-foundry).

> ℹ️ Foundry MCP tools cannot reach a VNet-isolated project even from inside the VNet.
