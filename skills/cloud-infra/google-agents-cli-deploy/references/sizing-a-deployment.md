<!-- Part of the google-agents-cli-deploy skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Sizing a deployment

Defaults (same on Agent Runtime and Cloud Run): `--cpu 1`, `--memory 4Gi`, `--concurrency 8`, `--min-instances 0`, `--max-instances 10`. The generated `service.tf` matches, except it pins `min_instances = 1` so production deployments don't experience cold starts. The recommended values were tuned against Python agents, so treat them as a starting point and tune them with load tests (see below).

`agents-cli deploy` scales to zero by default so idle dev and demo agents don't hold capacity. Pass `--min-instances 1` (or deploy via Terraform) when you need a warm instance.

The params are coupled — scale them together:

- **One process — scale out, not up.** The container runs a single server process handling many requests concurrently, so throughput comes from `--concurrency` and horizontal scale (`--max-instances`), not from extra worker processes. Raise `--cpu` only when profiling shows real CPU saturation rather than time spent waiting on the model.
- **Memory bounds concurrency.** Each concurrent request keeps its full working set (context window, history, RAG chunks, response buffer) in memory while it waits on the model, so peak ≈ base + `concurrency × per-request memory`. Memory — not CPU — is the first limit, so raising `--concurrency` without `--memory` is the main OOM cause.
- **Concurrency default is conservative.** A worker can serve many concurrent requests while it waits on the model, but per-request memory is agent-specific, so `8` protects a memory-heavy (RAG/multimodal) agent. Light agents can raise it to 16–32+ after load-testing. See [Underutilized asynchronous workers](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/optimize-and-scale#underutilized-workers).

```bash
# 4x throughput: scale every param, not just one
agents-cli deploy --cpu 4 --concurrency 16 --memory 16Gi --max-instances 20
```

**Tune with the scaffolded load test** (`tests/load_test/` in a Python project, `e2e/load_test/` in a Go one; run locally or in the CI/CD staging pipeline): drive load, watch *max* latency and memory/OOM restarts, then adjust — high max latency → raise concurrency (+ workers/cpu); OOM → raise memory or lower concurrency.

> On **GKE** these sizing flags are rejected — size via the Terraform manifests + HorizontalPodAutoscaler under `deployment/terraform/`.

---

## Production Deployment — CI/CD Pipeline

For the full CI/CD pipeline setup guide — prerequisites, `infra cicd` flags, runner comparison, WIF authentication, pipeline stages, and production approval — see `references/cicd-pipeline.md`.

---

## Cloud Run Specifics

For detailed infrastructure configuration (scaling defaults, Dockerfile, FastAPI endpoints, session types, networking), see `references/cloud-run.md`. **ADK:** for ADK docs on Cloud Run deployment, fetch `https://adk.dev/deploy/cloud-run/index.md`.

> **ADK projects.** For event-driven / ambient agent deployment on Cloud Run, see the [`ambient-expense-agent`](https://github.com/google/adk-recipes/tree/main/core/python/ambient-expense-agent) recipe and `/google-agents-cli-adk-code` (`references/adk-python.md`, section "12. Event-Driven / Ambient Agents") for the `trigger_sources` pattern.

---

## Agent Runtime specifics

Agent Runtime is a managed Gemini platform service for deploying agents as containers. Uses container-based deployment: `agents-cli deploy` packages your project and Agent Runtime builds the image from your project's `Dockerfile` (required unless you pass a prebuilt `--image`) — the same image that serves Cloud Run and GKE.

> **No `gcloud` CLI exists for Agent Runtime.** Deploy via `agents-cli deploy`. Query via the Python `agentplatform.Client` SDK.

Deployments can take 5-10 minutes. Use `--no-wait` to start a deployment and return immediately, then check on it later with `--status`:

```bash
# Start deployment without blocking
agents-cli deploy --no-wait

# Check on progress later
agents-cli deploy --status
```

When `--status` detects the operation has completed, it writes `deployment_metadata.json`, stores an A2A project's agent card on Agent Runtime (as a normal deploy does), and prints the same success output.

For detailed infrastructure configuration (container deploy flow, the unified FastAPI app and `/api` passthrough, Terraform resource, deployment metadata, session/artifact services, CI/CD differences), see `references/agent-runtime.md`. **ADK:** for ADK docs on Agent Runtime deployment, fetch `https://adk.dev/deploy/agent-runtime/index.md`.

---

## GKE Specifics

For detailed infrastructure configuration (Kubernetes manifests, Terraform resources, Workload Identity, session types, networking), see `references/gke.md`. **ADK:** for ADK docs on GKE deployment, fetch `https://adk.dev/deploy/gke/index.md`.

---
