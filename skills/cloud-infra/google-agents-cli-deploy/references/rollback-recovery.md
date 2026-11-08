<!-- Part of the google-agents-cli-deploy skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Rollback & Recovery

The primary rollback mechanism is **git-based**: fix the issue, commit, and push to `main`. The CI/CD pipeline will automatically build and deploy the new version through staging → production.

For immediate Cloud Run rollback without a new commit, use revision traffic shifting:
```bash
gcloud run revisions list --service=SERVICE_NAME --region=REGION
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions=REVISION_NAME=100 --region=REGION
```

Agent Runtime doesn't support revision-based rollback — fix and redeploy via `agents-cli deploy`.

For GKE rollback, use `kubectl rollout undo`:
```bash
kubectl rollout undo deployment/DEPLOYMENT_NAME -n NAMESPACE
kubectl rollout status deployment/DEPLOYMENT_NAME -n NAMESPACE
```

---

## Custom Infrastructure (Terraform)

**CRITICAL**: When your agent requires custom infrastructure (Cloud SQL, Pub/Sub, Eventarc, BigQuery, etc.), you MUST define it in Terraform — never create resources manually via `gcloud` commands. Exception: quick experimentation is fine with `gcloud` or console, but production infrastructure must be in Terraform.

For custom infrastructure patterns, consult `references/terraform-patterns.md` for:
- Where to put custom Terraform files (single-project vs CI/CD)
- Resource examples (Pub/Sub, BigQuery, Eventarc triggers)
- IAM bindings for custom resources
- Terraform state management (remote vs local, importing resources)
- Common infrastructure patterns

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Terraform state locked | `terraform force-unlock -force LOCK_ID` in deployment/terraform/ |
| GitHub Actions auth failed | Re-run `terraform apply` in CI/CD terraform dir; verify WIF pool/provider |
| Cloud Build authorization pending | Use `github_actions` runner instead |
| Resource already exists | `terraform import` (see `references/terraform-patterns.md`) |
| Agent Runtime deploy timeout / hangs | Deployments take 5-10 min; check if engine was created (see Agent Runtime specifics) |
| Secret not available | Verify `secretAccessor` granted to `app_sa` (not the default compute SA), and to the Agent Identity principal (if using Agent Identity) |
| Cloud SQL connection failed / 403 | Grant `roles/cloudsql.client` to the runtime service account when using manual deployments |
| 403 on deploy | Check `deployment/terraform/iam.tf` — `cicd_runner_sa` needs deployment + SA impersonation roles in the target project |
| 403 when testing Cloud Run | Default is `--no-allow-unauthenticated`; include `Authorization: Bearer $(gcloud auth print-identity-token)` header |
| Cold starts too slow | Set `min_instance_count > 0` in Cloud Run Terraform config |
| Cloud Run 503 errors | Check resource limits (memory/CPU), increase `max_instance_count`, or check container crash logs |
| 403 right after granting IAM role | IAM propagation is not instant — wait a couple of minutes before retrying. Don't keep re-granting the same role |
| Resource seems missing but Terraform created it | Run `terraform state list` to check what Terraform actually manages. Resources created via `null_resource` + `local-exec` (e.g., BQ linked datasets) won't appear in `gcloud` CLI output |
| Deployment failed or agent not responding | Check Cloud Logging: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=SERVICE" --project=PROJECT --limit=50 --format="table(timestamp,severity,textPayload)"` for Cloud Run, or `gcloud logging read "resource.type=aiplatform.googleapis.com/ReasoningEngine" --project=PROJECT --limit=50` for Agent Runtime |
| Agent returns errors after deploy | Open Cloud Logging in Console → filter by service name (Cloud Run) or reasoning engine resource (Agent Runtime) → look for stack traces or permission errors in recent log entries |

---

## Platform Registration

For registering deployed agents with Gemini, see `/google-agents-cli-publish`.

---

## Agent Gateway

> **Note:** There are no `agents-cli` commands for creating or managing Agent Gateways or
> Semantic Governance policies — set those up separately (via Terraform or the Cloud Console).
> `agents-cli deploy` is the only gateway-aware command, and its support is a passthrough: it
> binds the agent to an *existing* gateway as part of the Agent Runtime create/update call.

**Agent Gateway** is the networking + security entry/exit point for all agent interactions
(user↔agent, agent↔tool, agent↔agent) — it centralizes access control and governed
connectivity (ingress/egress). It is not a deployment target.

To set up a gateway, follow [Set up an Agent Gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway)
and [Route Agent Runtime traffic through Agent Gateway](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-gateway-runtime-deploy). You may also manage the gateway in Terraform with [`google_network_services_agent_gateway`](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/network_services_agent_gateway) (currently in the `google-beta` provider). For the gateway with its surrounding enterprise infrastructure, use the [genai-factory](https://github.com/GoogleCloudPlatform/genai-factory) blueprints, installed as an extension with `agents-cli extension add GoogleCloudPlatform/genai-factory`.

Once a gateway exists, `agents-cli deploy` binds an agent to it with `--agent-gateway-egress`
and/or `--agent-gateway-ingress`, each taking a full resource name
(`projects/PROJECT/locations/REGION/agentGateways/GATEWAY`). Only Agent Runtime deployment is
supported, and the agent must have Agent Identity.

An egress gateway performs TLS decryption and inspection on outbound agent communications,
so the image must trust the gateway's root CA. That setup is opt-in at scaffold time. If you're
creating a new project, pass `--agent-gateway` flag to `agents-cli create`:

```bash
agents-cli create my-agent --agent adk_python -d agent_runtime --agent-gateway
```

Alternatively, you can pass the same flag to `agents-cli scaffold enhance` to upgrade an
existing project:
```bash
agents-cli scaffold enhance . --agent-gateway
```

Either writes a Dockerfile that consumes the `AGENT_GATEWAY_ROOT_CERTIFICATES` build arg the
platform injects, and records `agent_gateway: true` under `create_params` so `scaffold upgrade`
keeps it. Deploying with `--agent-gateway-egress` against a Dockerfile that lacks the build arg
fails with a pointer to the command above; `--no-agent-gateway` removes the setup again.

Background: [Agent Gateway overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview).
