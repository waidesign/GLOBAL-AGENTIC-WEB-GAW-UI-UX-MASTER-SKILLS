---
name: "microsoft-foundry"
description: "Build, deploy, evaluate, optimize, fine-tune, and manage Microsoft Foundry agents, models, and resources end to end. USE FOR: foundry, azd ai agent, azd provision/deploy, hosted agent scaffold/develop/run/deploy/troubleshoot, prompt agent, managed harness agent, Copilot harness, voice agent, create/update/invoke/evaluate agent, add tool to agent, agent insights, batch/continuous eval, continuous monitoring, agent CI/CD, optimize/improve prompt, optimize agent instructions, Agent Optimizer, dataset curation from traces, deploy model, model fine-tuning (SFT/DPO/RFT), Foundry project, RBAC, role assignment, permissions, quota, capacity, region, deployment failure, AI Services, create Foundry resource, knowledge index, customize deployment, onboard, availability, training-data, grader, distillation, large file upload. DO NOT USE FOR: Azure Functions, App Service, general Azure deploy (use azure-deploy), general Azure prep (use azure-prepare)."
license: "MIT"
metadata:
  gaw-category: "cloud-infra"
  gaw-author: "Microsoft"
  gaw-version: "1.0.0"
---

# Microsoft Foundry Skill

This skill helps developers work with Microsoft Foundry resources, covering model discovery and deployment, complete dev lifecycle of AI agent, evaluation workflows, and troubleshooting.

## Pre-Execution Requirements

Follow each applicable subsection below before starting its corresponding action or workflow.

### Dependency Check and Setup

**MANDATORY:** As the first step after this skill loads, run the dependency check and setup script below from this skill's root and wait for it to finish before continuing. The script checks first and installs only missing dependencies; it does not reinstall dependencies that are already available.

**You MUST complete this check before reading or entering any sub-skill, workflow, or workflow-specific reference.**

```bash
./scripts/check-and-setup-dependencies.sh     # macOS / Linux
./scripts/check-and-setup-dependencies.ps1    # Windows (pwsh)
```

Strictly follow the script output for subsequent actions.

### Workflow Guidance

**MANDATORY:** Before executing ANY workflow-specific steps, you MUST read the corresponding sub-skill document. Do not call workflow-specific MCP tools for a workflow without reading its skill document. This applies even if you already know the MCP tool parameters — the skill document contains required workflow steps, pre-checks, and validation logic that must be followed. This rule applies on every new user message that triggers a different workflow, even if the skill is already loaded.

### Foundry MCP

**MANDATORY:** Before using Foundry MCP operations, call the Azure MCP `foundry` tool and inspect the available Foundry MCP tools and related parameters. Treat this as the discovery/help step for MCP-based workflows.

### azd

**MANDATORY:** Before executing ANY azd command, you MUST read [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) and strictly follow the shared rules defined in it, especially the `AZURE_DEV_USER_AGENT` setting rules.

## Sub-Skills

This skill includes specialized sub-skills for specific workflows. **When a sub-skill matches the task, strictly follow its workflow:**

| Sub-Skill | When to Use | Reference |
|-----------|-------------|-----------|
| **deploy** | Deploy hosted agents to Foundry, smoke-test a deployment, create or update prompt agents, and manage agent versions and multi-environment deploys. | [deploy](foundry-agent/deploy/deploy.md) |
| **cicd** | Set up a CI/CD deployment pipeline for a Foundry agent. | [cicd](foundry-agent/cicd/cicd.md) |
| **invoke** | Send messages to an agent, single or multi-turn conversations | [invoke](foundry-agent/invoke/invoke.md) |
| **routine** | Schedule or event-trigger Foundry agents with routines; use `azd` for CRUD, enable/disable, manual dispatch, and viewing past runs, or define routines in `azure.yaml`. | [routine](foundry-agent/routine/routine.md) |
| **invocations-ws** | Build, deploy, and connect to custom Hosted agents that use developer-defined duplex real-time or media streams over `invocations_ws`. | [invocations-ws](foundry-agent/invocations-ws/invocations-ws.md) |
| **observe** | Evaluate agent quality, run batch evals, analyze failures, optimize prompts, improve agent instructions, compare versions, set up CI/CD monitoring, and enable continuous production evaluation | [observe](foundry-agent/observe/observe.md) |
| **insights** | Pull generated agent insights, evidence, and recommendations from an existing monitor; read-only retrieval, not a new analysis run | [insights](foundry-agent/insights/insights.md) |
| **trace** | Query traces, analyze latency/failures, correlate eval results to specific responses via App Insights `customEvents` | [trace](foundry-agent/trace/trace.md) |
| **troubleshoot** | View hosted agent logs, query telemetry, diagnose failures | [troubleshoot](foundry-agent/troubleshoot/troubleshoot.md) |
| **validate** | Use only when the user explicitly asks to use this validation sub-skill or to validate Microsoft Foundry hosted-agent code against best practices. Never invoke it proactively or add it to another workflow. | [validate](foundry-agent/validate/validate.md) |
| **create (quick start)** | Create a new hosted Foundry agent from scratch end-to-end — scaffold, provision or use an existing Foundry project, deploy, and smoke-test. Do not use for any work on existing code. For anything not covered by the quickstart, use **create**. | [create/quick-start-hosted.md](foundry-agent/create/quick-start-hosted.md) |
| **create** | Use when the standard end-to-end happy path (quick start) doesn't fit. Create a new Foundry agent, update code of an existing agent, continue development of an existing agent, wire connections at scaffold time, use advanced setup or A2A (Agent2Agent), or recover from a failed quickstart run. | [create](foundry-agent/create/create-hosted.md) |
| **create managed harness** | Create or continue developing a Prompt Agent that explicitly uses the Foundry-managed Copilot harness. Uses `azd` and `azure.yaml`, not the ordinary Prompt Agent MCP workflow. | [create-managed-harness](foundry-agent/create/create-managed-harness.md) |
| **create voice** | Create, configure, or extend a Foundry Voice Agent, defaulting generic requests to managed Prompt Voice and supporting self-deployed Prompt Voice or two-agent Hosted Voice. | [create-voice](foundry-agent/create/create-voice.md) |
| **agent-optimizer** | Make existing Python hosted-agent code optimization-ready, configure eval.yaml, run Agent Optimizer jobs, apply candidates locally, and deploy through azd after review. | [agent-optimizer](foundry-agent/agent-optimizer/agent-optimizer.md) |
| **eval-datasets** | Harvest production traces into evaluation datasets, manage dataset versions and splits, track evaluation metrics over time, detect regressions, and maintain full lineage from trace to deployment. Use for: create dataset from traces, dataset versioning, evaluation trending, regression detection, dataset comparison, eval lineage. | [eval-datasets](foundry-agent/eval-datasets/eval-datasets.md) |
| **project/create** | Creating a new Microsoft Foundry project for hosting agents and models. Use when onboarding to Foundry or setting up new infrastructure. | [project/create/create-foundry-project.md](project/create/create-foundry-project.md) |
| **resource/create** | Creating Azure AI Services multi-service resource (Foundry resource) using Azure CLI. Use when manually provisioning AI Services resources with granular control. | [resource/create/create-foundry-resource.md](resource/create/create-foundry-resource.md) |
| **private-network** | Answer questions about Foundry network isolation **and** deploy Foundry with VNet isolation (BYO VNet, Managed VNet, hybrid). Covers architecture concepts, template selection, deployment, and post-deployment validation. | [resource/private-network/private-network.md](resource/private-network/private-network.md) |
| **models/deploy-model** | Unified model deployment with intelligent routing. Handles quick preset deployments, fully customized deployments (version/SKU/capacity/RAI), and capacity discovery across regions. Routes to sub-skills: `preset` (quick deploy), `customize` (full control), `capacity` (find availability). | [models/deploy-model/SKILL.md](models/deploy-model/SKILL.md) |
| **quota** | Managing quotas and capacity for Microsoft Foundry resources. Use when checking quota usage, troubleshooting deployment failures due to insufficient quota, requesting quota increases, or planning capacity. | [quota/quota.md](quota/quota.md) |
| **rbac** | Managing RBAC permissions, role assignments, managed identities, and service principals for Microsoft Foundry resources. Use for access control, auditing permissions, and CI/CD setup. | [rbac/rbac.md](rbac/rbac.md) |
| **finetuning** | Fine-tune models on Microsoft Foundry — SFT distillation, DPO preference optimization, RFT with graders and tool calling. Dataset preparation, grader calibration, training, checkpoint selection, deployment, evaluation. Use for: fine-tune, SFT, DPO, RFT, training data, grader, distillation, fine-tuned model, large file upload. | [finetuning/SKILL.md](finetuning/SKILL.md) |
| **azd-guidance** | Provide shared azd knowledge and guidance for managing Foundry agents. Read this first for any workflows related to azd. | [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) |

> 💡 **Tip:** For a complete onboarding flow: `project/create` (public) or `private-network` (VNet isolation) → `models/deploy-model` → agent workflows (`create` → `deploy` → `invoke`).

> 💡 **Fine-Tuning:** Use `finetuning` for all model customization — SFT distillation, DPO preference optimization, and RFT with graders. Includes quickstart, grader calibration, and training curve analysis.

> 💡 **Model Deployment:** Use `models/deploy-model` for all deployment scenarios — it intelligently routes between quick preset deployment, customized deployment with full control, and capacity discovery across regions.

> 💡 **Prompt Optimization:** For requests like "optimize my prompt" or "improve my agent instructions," load [observe](foundry-agent/observe/observe.md) and use the `prompt_optimize` MCP tool through that eval-driven workflow.

## Infrastructure Lifecycle

Match user intent to the correct infrastructure workflow.

| User Intent | Workflow |
|-------------|---------|
| "Create Foundry" / "Set up Foundry" (ambiguous) | Use `AskUserQuestion`: (a) just an AI Services resource, (b) a project with public access, or (c) a project with network isolation? Route: (a) → [resource/create](resource/create/create-foundry-resource.md), (b) → [project/create](project/create/create-foundry-project.md), (c) → [private-network](resource/private-network/private-network.md) |
| Set up Foundry with VNet isolation | [private-network](resource/private-network/private-network.md) |
| Create a Foundry project (public) | [project/create](project/create/create-foundry-project.md) |
| Create a bare Foundry resource | [resource/create](resource/create/create-foundry-resource.md) |

## Agent Development Lifecycle

Match user intent to the correct agent workflow. Read each sub-skill in order before executing.

| User Intent | Workflow (read in order) |
|-------------|------------------------|
| Create or develop a Voice Agent (Prompt Voice or Hosted Voice) | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → [create-voice](foundry-agent/create/create-voice.md) → [deploy](foundry-agent/deploy/deploy.md) → [invoke](foundry-agent/invoke/invoke.md) |
| Create or develop an explicitly requested Managed Harness Agent / Copilot harness agent | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → [create-managed-harness](foundry-agent/create/create-managed-harness.md) → [deploy](foundry-agent/deploy/deploy.md) → [invoke](foundry-agent/invoke/invoke.md) |
| Create a new hosted agent end-to-end (scaffold + deploy + test) | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → [quick-start-hosted](foundry-agent/create/quick-start-hosted.md) (self-contained end-to-end) |
| Anything beyond the standard quickstart (existing code, migration, re-hosting, deployment customization, scaffold-time connections, A2A (Agent2Agent), recovery) | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → [create](foundry-agent/create/create-hosted.md) → [deploy](foundry-agent/deploy/deploy.md) → [invoke](foundry-agent/invoke/invoke.md) |
| Optimize existing Python hosted agent | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → [agent-optimizer](foundry-agent/agent-optimizer/agent-optimizer.md) → scaffold/review → eval.yaml → optimize → apply candidate → deploy → invoke |
| Deploy an agent (code already exists) | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → deploy (includes eval-suite setup) → invoke → observe (evaluate/optimize) |
| Update/redeploy an agent after code changes | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → deploy (includes eval-suite setup) → invoke → observe (evaluate/optimize) |
| Set up a CI/CD deployment pipeline for a hosted agent | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → cicd |
| Invoke/test/chat with an agent | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → invoke |
| Schedule/event-trigger an agent, or CRUD/enable/disable/dispatch a routine | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → routine |
| Optimize / improve agent prompt or instructions | observe (Step 4: Optimize) |
| Evaluate and optimize agent (full loop) | observe |
| Enable continuous evaluation monitoring | observe (Step 6: CI/CD & Monitoring) |
| Pull agent insights / list generated issues and recommendations | [dependency check and setup](#dependency-check-and-setup) → [insights](foundry-agent/insights/insights.md) (all pages with expanded evidence; read-only) |
| Troubleshoot an agent issue | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → invoke → troubleshoot |
| Fix a broken agent (troubleshoot + redeploy) | [dependency check and setup](#dependency-check-and-setup) → [azd-guidance](foundry-agent/azd-guidance/azd-guidance.md) → invoke → troubleshoot → apply fixes → deploy → invoke |

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Agent: .foundry Workspace Standard; Agent: Setup References; Agent: Common Project Context Resolution](references/agent-foundry-workspace-standard.md) (~2658 tokens)
- [Agent: Agent Types; Tool Usage Conventions; Azure Authentication; …](references/agent-agent-types.md) (~1326 tokens)
