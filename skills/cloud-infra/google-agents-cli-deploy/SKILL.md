---
name: "google-agents-cli-deploy"
description: "This skill should be used when the user wants to \"deploy an agent\", \"deploy my ADK agent\", \"set up CI/CD\", \"configure secrets\", \"troubleshoot a deployment\", or needs guidance on Agent Runtime, Cloud Run, or GKE deployment targets, or binding an agent to an Agent Gateway. Covers deployment workflows, service accounts, rollback, and production infrastructure. Applies to any framework agents-cli deploys (ADK, LangChain, ...). Part of the agents-cli skills suite. Do NOT use for agent API code patterns (ADK: use google-agents-cli-adk-code), evaluation (use google-agents-cli-eval), or project scaffolding (use google-agents-cli-scaffold)."
license: "Apache-2.0"
metadata:
  gaw-category: "cloud-infra"
  gaw-author: "Google"
  gaw-version: "1.0.0"
---

# Deployment Guide

> **Requires:** `agents-cli` (`uv tool install google-agents-cli`) — [install uv](https://docs.astral.sh/uv/getting-started/installation/index.md) first if needed.

> Prefer using the `agents-cli` commands throughout this guide — they wrap Terraform, Docker, and deployment into a tested pipeline. If your project isn't scaffolded yet, see `/google-agents-cli-scaffold` to add deployment support first.

### Reference Files

For deeper details, consult these reference files in `references/`:

- **`cloud-run.md`** — Scaling defaults, Dockerfile, session types, networking
- **`agent-runtime.md`** — container-based deploy, unified FastAPI app, the `/api` passthrough, Terraform resource, deployment metadata, CI/CD differences
- **`gke.md`** — GKE Autopilot cluster, Kubernetes manifests, Workload Identity, session types, networking
- **`terraform-patterns.md`** — Custom infrastructure, IAM, state management, importing resources
- **`batch-inference.md`** — BigQuery Remote Function trigger; for Pub/Sub / Eventarc on ADK see `/google-agents-cli-adk-code`
- **`cicd-pipeline.md`** — Full CI/CD pipeline setup, `infra cicd` flags, runner comparison, WIF auth, pipeline stages
- **`testing-deployed-agents.md`** — Testing instructions per deployment target, curl examples, load tests
- **`cmek.md`** — Customer-managed encryption keys on Agent Runtime in Gemini platform: key grants, `deploy --key` for dev, Terraform edits for staging/prod

> **Observability:** See the `/google-agents-cli-observability` skill for Cloud Trace, prompt-response logging, BigQuery Analytics, and third-party integrations.

---

## Deployment Target Decision Matrix

Choose the right deployment target based on your requirements:

| Criteria | Agent Runtime | Cloud Run | GKE |
|----------|-------------|-----------|-----|
| **Scaling** | Managed auto-scaling (configurable min/max, concurrency) | Fully configurable (min/max instances, concurrency, CPU allocation) | Full Kubernetes scaling (HPA, VPA, node auto-provisioning) |
| **Networking** | VPC-SC and PSC-I supported (private VPC connectivity via network attachments) | Full VPC support, direct VPC egress, IAP, ingress rules | Full Kubernetes networking |
| **Session state** | Sessions in Gemini platform (ADK wires `VertexAiSessionService` automatically) | In-memory (dev), Cloud SQL, or a managed sessions backend | In-memory (dev), Cloud SQL, or a managed sessions backend |
| **Batch/event processing** | Trigger endpoints reachable via the Agent Runtime `/api` passthrough | Native trigger endpoints (Pub/Sub, Eventarc); ADK: see `/google-agents-cli-adk-code` | Custom (Kubernetes Jobs, Pub/Sub) |
| **Cost model** | vCPU-hours + memory-hours (not billed when idle) | Per-instance-second + min instance costs | Node pool costs (always-on or auto-provisioned) |
| **Setup complexity** | Lower (managed, purpose-built for agents) | Medium (Dockerfile, Terraform, networking) | Higher (Kubernetes expertise required) |
| **Best for** | Managed infrastructure, minimal ops | Custom infra, full networking control | Full Kubernetes control |

**Ask the user** which deployment target fits their needs. Each is a valid production choice with different trade-offs.

All three targets are container-based, so any language works.

> **Product name mapping:** users may say "Agent Engine", "Vertex AI Agent Engine", or "Agent Runtime"; all mean Agent Runtime. Use `--deployment-target agent_runtime`.

> **Ambient / scheduled / event-driven agents (ADK projects):** ADK's `trigger_sources` registers `/apps/{app}/trigger/*` endpoints on the same FastAPI app for **all** targets. On **Cloud Run** / **GKE** these are public HTTP routes you point a Pub/Sub push subscription or Eventarc trigger at; on **Agent Runtime** the same routes are reachable through its `/api` passthrough (e.g. `.../reasoningEngines/v1/{resource}/api/apps/{app}/trigger/pubsub`). Cloud Run remains the simplest target for unauthenticated trigger sources. See `/google-agents-cli-adk-code` (`references/adk-python.md`, section "12. Event-Driven / Ambient Agents") for the `trigger_sources` pattern.

> **OAuth / user consent agents:** Use **Agent Runtime**, registered with Gemini, for agents that need OAuth 2.0 user consent (e.g., accessing Google Drive, Calendar, or other user-scoped APIs). Cloud Run does not currently support managed OAuth flows. For a worked ADK example, look up OAuth user consent in the topic index in `/google-agents-cli-adk-code` → `references/recipes.md`.

> **Live and voice agents:** pass **`--timeout 3600`** on Cloud Run so a session outlives the 300s default, and **`--min-instances 1`** on Cloud Run or Agent Runtime so the first caller after idle does not hear a cold start. GKE sizes pods in Terraform. URL shapes and session caps: `/google-agents-cli-adk-code` (`references/adk-python-live.md`).

---

## Deploying to Dev

### Deploy Workflow

**Task tracking:** Deployment involves multiple sequential steps (infra setup, CI/CD configuration, deploy, verification). Use a task list to track progress through these steps — skipping one often causes failures in later steps that are hard to trace back.

1. If prototype (no deployment target), first enhance: `agents-cli scaffold enhance . --deployment-target <target>`
2. **Notify the human**: paste the eval scores and test results, then ask "Ready to deploy to dev?"
3. **Wait for explicit approval**
4. Once approved: `agents-cli deploy`

> **Agent Runtime timeout recovery:** Agent Runtime deploys can take 5-10 minutes and may exceed command timeouts. If the deploy command is cancelled or times out, the deployment continues server-side. Run `agents-cli deploy --status` to check progress — poll every 60 seconds until it reports completion or failure.

**IMPORTANT**: Never run `agents-cli deploy` without explicit human approval.

> **Not a prerequisite.** `agents-cli deploy` works on its own. One exception: if the user wants Terraform-managed observability (prompt-response logging, BigQuery analytics), run `agents-cli infra single-project --apply` first, see `/google-agents-cli-observability`.

### Single-Project Infrastructure Setup (Optional — Advanced)

`agents-cli infra single-project --apply` runs `terraform apply` in `deployment/terraform/single-project/`. Use this to **provision single-project GCP infrastructure without CI/CD** (service accounts, IAM bindings, telemetry resources, Artifact Registry). It is required before deployment only when Terraform will manage observability; basic Agent Runtime and Cloud Run deployments do not need it, while GKE deploy handles its own targeted Terraform.

```bash
# Optional — provision infrastructure in a single GCP project
agents-cli infra single-project --apply
```

> **Note:** `agents-cli deploy` doesn't automatically use the Terraform-created `app_sa`. Pass the service account explicitly: `agents-cli deploy --service-account SA_EMAIL`. With Agent Identity, `--service-account` is ignored.

### Deploy Flag Reference

| Flag | Description | Targets |
|------|-------------|---------|
| `--project` | GCP project ID | All |
| `--region` | GCP region | All |
| `--service-account` | Service account email for the deployed agent | All |
| `--service-name` | Override the deployed service name (Cloud Run service or Agent Runtime display name); defaults to the project name. If you override it, consider updating your Terraform and CI (if present) — they name resources from the project name. Not supported for GKE, whose names are fully owned by Terraform. | Agent Runtime, Cloud Run |
| `--secrets` / `--update-secrets` | Comma-separated `ENV=SECRET` or `ENV=SECRET:VERSION` pairs. Cloud Run adds them to the service's existing secrets; Agent Runtime replaces the agent's existing secrets with the ones you pass. | Agent Runtime, Cloud Run |
| `--env-vars` / `--update-env-vars` | Comma-separated `KEY=VALUE` environment variables | All |
| `--agent-identity` | Enable [Agent Identity](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity) | Agent Runtime, Cloud Run |
| `--no-agent-identity` | Disable Agent Identity. Passing neither `--agent-identity` nor `--no-agent-identity` follows the project's identity default in `agents-cli-manifest.yaml` when the agent is created, or keeps the current identity type on later deploys. On Cloud Run, Agent Identity can't be turned off: for a service that already has it, the deploy stops and asks you to delete the service and redeploy. | Agent Runtime, Cloud Run |
| `--network-attachment` | Network attachment resource name for [PSC interface](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/private-service-connect-interface) (enables private VPC connectivity) | Agent Runtime |
| `--dns-peering-domain` | DNS peering domain suffix, e.g. `my-internal.corp.` (requires `--network-attachment`) | Agent Runtime |
| `--dns-peering-project` | Project ID hosting the Cloud DNS managed zone for DNS peering (requires `--network-attachment`) | Agent Runtime |
| `--dns-peering-network` | VPC network name in the target project for DNS peering (requires `--network-attachment`) | Agent Runtime |
| `--agent-gateway-egress` | Bind the agent to an [Agent Gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview) governing outbound traffic. Full resource name of a gateway with `governedAccessPath=AGENT_TO_ANYWHERE`. Empty value unbinds; omit to leave unchanged. See [Agent Gateway](#agent-gateway) | Agent Runtime |
| `--agent-gateway-ingress` | Bind the agent to an Agent Gateway governing inbound traffic. Full resource name of a gateway with `governedAccessPath=CLIENT_TO_AGENT`. Empty value unbinds; omit to leave unchanged | Agent Runtime |
| `--key` | Cloud KMS key for customer-managed encryption (CMEK), as a full `projects/PROJECT/locations/REGION/keyRings/RING/cryptoKeys/KEY` name. Set on create only; for dev deployments (staging/prod set the key in Terraform). See [Customer-managed encryption](#customer-managed-encryption-cmek) | Agent Runtime |
| `--memory` | Memory limit (default: `4Gi`) | Agent Runtime, Cloud Run |
| `--cpu` | CPU limit (default: `1`) | Agent Runtime, Cloud Run |
| `--min-instances` | Minimum number of instances (default: `0`, i.e. scale to zero; the generated Terraform uses `1`) | Agent Runtime, Cloud Run |
| `--max-instances` | Maximum number of instances (default: `10`) | Agent Runtime, Cloud Run |
| `--concurrency` | Concurrent requests per container (default: `8`; see [Sizing a deployment](#sizing-a-deployment)) | Agent Runtime, Cloud Run |
| `--timeout` | Request timeout in seconds, up to `3600` (Cloud Run default: `300`). Applied on create and update; unset leaves the service's current value | Cloud Run |
| `--port` | Container port | Cloud Run, Agent Runtime |
| `--build-args` | Comma-separated `KEY=VALUE` Docker build args | Agent Runtime |
| `--labels` / `--update-labels` | Comma-separated `KEY=VALUE` resource labels to add or update. Additive: adds/updates the labels you name; labels you don't name are preserved. | Agent Runtime, Cloud Run |
| `--remove-labels` | Comma-separated label `KEY`s to remove. Keys that don't exist are ignored. Can be combined with `--labels`, but a key can't appear in both. Cannot be combined with `--clear-labels`. | Agent Runtime, Cloud Run |
| `--clear-labels` | Remove all resource labels (Cloud Run keeps its reserved `created-by` label). Combine with `--labels` to replace the label set; the clear is applied first. Cannot be combined with `--remove-labels`. | Agent Runtime, Cloud Run |
| `--framework` | Framework the deployed container implements (defaults to `framework:` in `agents-cli-manifest.yaml`, which the template sets; `google-adk` when absent). Sets `agent_framework` on the deployment, which picks the Google Cloud console playground and the runtime contract the deployment declares. The API owns the accepted values ([reference](https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/rest/v1/projects.locations.reasoningEngines#ReasoningEngineSpec)) | Agent Runtime |
| `--iap` | Enable Identity-Aware Proxy | Cloud Run |
| `--image` | Prebuilt container image URI (skips source build). On Agent Runtime the image must be in Artifact Registry and readable by the Agent Runtime service agent (`roles/artifactregistry.reader`); can't be combined with `--build-args` | All |
| `--no-wait` | Start deployment and return immediately | Agent Runtime, Cloud Run |
| `--status` | Check the status of a pending `--no-wait` deployment | Agent Runtime, Cloud Run |
| `--list` | List existing deployments and exit | All |
| `--dry-run` / `-n` | Print what would be executed without running it. For Agent Runtime, Cloud Run and GKE, it first runs read-only checks on Google Cloud. | All |
| `--no-confirm-project` | Skip project confirmation prompt | All |

Run `agents-cli deploy --help` for the full flag reference.

> **Advanced Cloud Run Deploys:** If you need features not exposed via `agents-cli` flags, use `--dry-run` (or `-n`) to print the full `gcloud` command, copy it, and add additional arguments as needed.

> **Project Confirmation:** If the project is resolved automatically (not passed via `--project`), the command will prompt for confirmation in interactive mode. Since agents typically run in non-interactive mode, you MUST pass `--no-confirm-project` to proceed if you are relying on automatic project resolution.

---

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Sizing a deployment; Production Deployment — CI/CD Pipeline; Cloud Run Specifics; …](references/sizing-a-deployment.md) (~1200 tokens)
- [Service Account Architecture; Required Permissions for CI/CD Setup; Required APIs; …](references/service-account-architecture.md) (~1270 tokens)
- [Rollback & Recovery; Custom Infrastructure (Terraform); Troubleshooting; …](references/rollback-recovery.md) (~1679 tokens)
- [Customer-managed encryption (CMEK); Semantic Governance; Related Skills](references/customer-managed-encryption-cmek.md) (~360 tokens)
