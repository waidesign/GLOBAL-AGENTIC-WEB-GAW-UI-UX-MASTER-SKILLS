<!-- Part of the google-agents-cli-deploy skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Service Account Architecture

Scaffolded projects use two service accounts:

- **`app_sa`** (per environment) — Runtime identity for the deployed agent. Roles defined in `deployment/terraform/iam.tf`.
- **`cicd_runner_sa`** (CI/CD project) — CI/CD pipeline identity (GitHub Actions / Cloud Build). Lives in the CI/CD project (defaults to prod project), needs permissions in **both** staging and prod projects.

Check `deployment/terraform/iam.tf` for exact role bindings. Cross-project permissions (Cloud Run service agents, artifact registry access) are also configured there.

**Common 403 errors:**
- "Permission denied on Cloud Run" → `cicd_runner_sa` missing deployment role in the target project
- "Cannot act as service account" → Missing `iam.serviceAccountUser` binding on `app_sa`
- "Secret access denied" → `app_sa` missing `secretmanager.secretAccessor`
- "Cloud SQL connection failed / Not authorized" → Runtime service account missing `roles/cloudsql.client`
- "Artifact Registry read denied" → Cloud Run service agent missing read access in CI/CD project

---

## Required Permissions for CI/CD Setup

- **`roles/secretmanager.admin`** granted to the Cloud Build service account (`service-<PROJECT_NUMBER>@gcp-sa-cloudbuild.iam.gserviceaccount.com`) in the CI/CD project. This allows Cloud Build to access the GitHub token stored in Secret Manager.

---

## Required APIs

The following Google Cloud APIs must be enabled in your project for the skills and deployment to work:

- **`cloudbuild.googleapis.com`** — Required for building container images and running CI/CD pipelines.
- **`secretmanager.googleapis.com`** — Required for managing secrets and API keys.
- **`run.googleapis.com`** — Required for deploying to Cloud Run.

Ensure these are enabled before running deployment or CI/CD setup commands:
```bash
gcloud services enable cloudbuild.googleapis.com secretmanager.googleapis.com run.googleapis.com --project=YOUR_PROJECT_ID
```

---

## Secret Manager (for API Credentials)

Instead of passing sensitive keys as environment variables, use GCP Secret Manager.

```bash
# Create a secret
echo -n "YOUR_API_KEY" | gcloud secrets create MY_SECRET_NAME --data-file=-

# Update an existing secret
echo -n "NEW_API_KEY" | gcloud secrets versions add MY_SECRET_NAME --data-file=-
```

**Grant access:** For Cloud Run, grant `secretmanager.secretAccessor` to the service account the service records (`app_sa` when Terraform created the service, the default compute SA when `agents-cli deploy` created it, or the account a later deploy passed with `--service-account`), even when deploying with Agent Identity -- Cloud Run checks that account when it deploys. For Agent Runtime, grant it to the platform-managed SA (`service-PROJECT_NUMBER@gcp-sa-aiplatform-re.iam.gserviceaccount.com`). For GKE, grant `secretmanager.secretAccessor` to `app_sa`. Access secrets via Kubernetes Secrets or directly via the Secret Manager API with Workload Identity.

**Pass secrets at deploy time (Agent Runtime, Cloud Run):**
```bash
agents-cli deploy --secrets "API_KEY=my-api-key,DB_PASS=db-password:2"
```

Format: `ENV_VAR=SECRET_ID` or `ENV_VAR=SECRET_ID:VERSION` (defaults to latest).

---

## Cloud SQL Permissions (Manual Deployment)

When using Cloud SQL with Cloud Run in a **manual deployment** (e.g., adding `--add-cloudsql-instances` in non-Terraform setups), you must manually grant the `Cloud SQL Client` role to the runtime service account.

Without this, the deployment may succeed but fail at runtime with `cloudsql.instances.get` authorization errors.

```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_RUNTIME_SA_EMAIL" \
  --role="roles/cloudsql.client"
```

> **Note:** In full Terraform-managed setups (`infra cicd` / `infra single-project`), this role is configured and managed automatically.

---

## Observability

See the **agents-cli-observability** skill for observability configuration (Cloud Trace, prompt-response logging, BigQuery Analytics, third-party integrations).

---

## Testing Your Deployed Agent

The quickest way to test a deployed agent is `agents-cli run --url <service-url> --mode a2a "your prompt"` — it handles auth, sessions, and streaming automatically (supports Agent Runtime and Cloud Run). **ADK:** `--mode adk` talks to the ADK streaming API instead.

For advanced testing (custom headers, session reuse, scripting, load tests), see `references/testing-deployed-agents.md`.

---

## Deploying with a UI (IAP)

IAP (Identity-Aware Proxy) secures a Cloud Run service so only authorized Google accounts can access it. Enable it by adding the `--iap` flag when deploying (Cloud Run only): `agents-cli deploy --iap`.

For Agent Runtime with a custom frontend, use a **decoupled deployment** — deploy the frontend separately to Cloud Run or Cloud Storage, connecting to the Agent Runtime backend API.

For more information on IAP with Cloud Run, see the [Cloud Console IAP settings](https://cloud.google.com/run/docs/securing/identity-aware-proxy-cloud-run#manage_user_or_group_access).

---
