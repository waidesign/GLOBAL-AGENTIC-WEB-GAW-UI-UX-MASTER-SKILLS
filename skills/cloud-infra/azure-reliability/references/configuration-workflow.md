<!-- Part of the azure-reliability skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Configuration Workflow

When user wants to **fix** findings from the assessment:

> **⛔ ALWAYS confirm with user before executing changes.** Show what will change, any cost implications, and any destructive actions (e.g., environment recreation).

### Step 1: Present Fix Plan + Choose Path

After assessment, if user says "fix it" / "improve my reliability" / "enable zone redundancy":

1. List each fixable finding with the specific action
2. Flag any cost implications or breaking changes
3. **Ask user which path they want:**

```
I'll start with the quick wins (no downtime, fast):

1. ✏️  Enable zone redundancy on plan-ii5trxva2ark4 (Flex Consumption — no cost change)
2. ✏️  Set health check path to /api/health on func-api-ii5trxva2ark4

Then, separately, I'll ask if you want to upgrade storage:

3. 🕒  Upgrade stii5trxva2ark4 from LRS → ZRS (small cost increase, migration takes hours)
   — Required for full zone redundancy, but I'll confirm with you before starting.

How would you like to apply these changes?

  A) Fix now — Run az CLI commands against your live resources (immediate, one-time)
  B) Patch my IaC — Update your Bicep/Terraform files so changes persist across deploys

(If you use azd or Terraform, option B is recommended so `azd up` won't overwrite changes.)
```

### Path A: Fix Now (CLI)

Run fixes against live resources using `az` CLI commands. **Quick wins first, then ask before the slow storage migration.**

The exact CLI commands per service live in the per-service references — pick the one(s) matching the resources discovered in Phase 2:

| Fix | Reference |
|---|---|
| Enable zone redundancy / configure health probes (Functions) | [references/services/functions/reliability.md](references/services/functions/reliability.md) |
| Enable zone redundancy / configure health probes (App Service) | [references/services/app-service/reliability.md](references/services/app-service/reliability.md) |
| Upgrade storage replication (cross-service) | [references/configure-storage.md](references/configure-storage.md) |
| Set up multi-region (cross-service) | [references/configure-multi-region.md](references/configure-multi-region.md) |
| Platform overview / verification | [references/configure-zone-redundancy.md](references/configure-zone-redundancy.md), [references/configure-health-probes.md](references/configure-health-probes.md) |

**Execution order — always quick wins first:**

1. **Zone redundancy on compute** (fast, in-place property update on the App's plan).
2. **Health probes** (Premium / Dedicated only — in-place; for FC1 / Consumption, follow the consent gate in [configure-health-probes.md](references/configure-health-probes.md)).
3. **Verify** the compute changes succeeded before doing anything else.
4. **⛔ STOP — Ask about storage upgrade.** Compute is now zone-redundant, but storage may still be LRS or GRS. Ask the user explicitly:

   ```
   ✅ Compute is now zone-redundant.

   To be **fully zone-redundant**, your storage account also needs to be upgraded:
     • stii5trxva2ark4: currently `Standard_LRS` → needs `Standard_ZRS`

   ⚠️  This is a live storage redundancy conversion:
      • Takes hours to days depending on data volume
      • Small ongoing cost increase (~$0.01/GB/month more)
      • Only supported for Standard general-purpose v2 accounts

   Do you want me to start the storage migration now? (yes / no / later)
   ```

   - **yes** → run `az storage account update --sku Standard_ZRS` (or `migration start` if needed); poll `az storage account show --query sku.name` until it reports `Standard_ZRS`.
   - **no / later** → leave storage as-is; note in the re-assessment that ZR storage remains a gap.

5. **Multi-region** — do NOT auto-run. Handled in **Step 3** below as an explicit follow-up after re-assessment.

> **⚠️ Warning:** If the user uses `azd up` or `terraform apply` later, CLI-only changes may be overwritten by the IaC definitions. Recommend also patching IaC after CLI fixes.

### Path B: Patch IaC

Update the user's Bicep or Terraform files so reliability settings are persistent.

**Step 1: Detect IaC type**
1. Look for `infra/` folder in project root
2. If not found, check project root for `*.bicep` or `*.tf` files
3. If still not found, ask user: "Where are your IaC files located?"
4. Check for `*.bicep` files → use Bicep patching
5. Check for `*.tf` files → use Terraform patching
6. If both exist, ask user which to patch
7. If no IaC exists, fall back to Path A (CLI) and inform user

**Step 2: Classify each fix by risk level**

| Fix | Risk Level | What Happens |
|-----|-----------|--------------|
| Zone redundancy (App plan) | 🟢 Safe patch | In-place property update on next deploy |
| Storage LRS → ZRS | 🟡 Pre-migration required | Live storage migration must complete before the IaC SKU change can deploy. **Never bundle with safe patches** — use the two-deploy flow in Steps 3–5. |
| Health check path (Basic/Standard/Premium / Dedicated) | 🟢 Safe patch | In-place update, but causes app restart |
| Health check path (FC1 / Consumption) | ⚪ Code-only — ask first | `healthCheckPath` is unsupported. Adding a health endpoint requires adding an HTTP-triggered `/api/health` function to **app code**. **Always ask the user for explicit consent before touching source code.** Do **not** patch IaC. |

**Step 3: Apply patches in two deploys (quick wins first)**

The IaC patching framework (detection, AVM-module guidance, deploy-order rule, storage SKU patch) lives in:

| IaC Type | Framework reference |
|---|---|
| Bicep | [references/iac-patching-bicep.md](references/iac-patching-bicep.md) |
| Terraform | [references/iac-patching-terraform.md](references/iac-patching-terraform.md) |

The actual **per-service compute patches** (Function App plan ZR, App Service Plan ZR, etc.) live in the per-service references — load the matching service file from Phase 2 for the exact Bicep / Terraform / AVM snippets. Only Azure Functions and App Service have per-service references in this skill version; Container Apps is out of scope.

**Deploy 1 — Quick wins only.** Patch the 🟢 Safe items (zone redundancy on the App Service/Function App plan, health probes on Basic/Standard/Premium / Dedicated). Do **NOT** include the storage SKU patch in this deploy.

After patching, **the skill runs the deploy itself** (do not stop and tell the user to run it). Detect the deployment tool and confirm once before executing:

```
📦 Patches applied to your IaC. Ready to deploy:
   Tool detected: azd (found azure.yaml)
   Command:       azd up

Proceed with deployment? (yes / no)
```

On **yes**, run the appropriate command, stream output back to the user, and continue to the next step on success:
- AZD project (has `azure.yaml`): `azd up`
- Bicep-only: `az deployment group create --resource-group <rg> --template-file infra/main.bicep --parameters @infra/main.parameters.json`
- Terraform: `terraform plan -out tfplan` → (show plan summary) → `terraform apply tfplan`

On **no**, stop and report the patched files; do not proceed to Step 4 / Re-Assess.

If deployment fails, surface the error and stop — do not continue to the storage step.

**⛔ STOP — Ask about storage upgrade before Deploy 2.** After Deploy 1 succeeds, ask the user explicitly:

```
✅ Quick-win patches deployed. Compute is now zone-redundant.

To be **fully zone-redundant**, your storage account also needs to be upgraded:
  • stii5trxva2ark4: currently `Standard_LRS` → needs `Standard_ZRS`

⚠️  This is a two-part change:
   1. Live storage migration (`az storage account migration start`) — takes hours to days
   2. A second deploy to update your IaC's storage SKU to match

Do you want me to start the storage migration now? (yes / no / later)
```

- **yes** → the skill runs the migration command itself, polls until complete, then patches the storage SKU in IaC and runs **Deploy 2** (now a no-op confirmation). The user does not need to run anything manually.
- **no / later** → leave the storage SKU patch unapplied. Note in the re-assessment that ZR storage remains a gap; suggest revisiting later.

**Step 4: Storage migration (only if user said yes in Step 3)**

The skill runs these commands itself — do not ask the user to run them. Show progress as you go:

```
🔄 Starting storage migration (this can take up to 72 hours)...

   az storage account migration start --name stii5trxva2ark4 \
     --resource-group rg-example --sku Standard_ZRS --no-wait

   Polling: az storage account show --name stii5trxva2ark4 --query sku.name
   ...
   ✅ Migration complete: sku.name = Standard_ZRS
```

For very long migrations, you may surface a checkpoint to the user ("this is still running, check back later") rather than blocking the entire conversation.

**Step 5: Deploy 2 — storage SKU patch**

After the migration completes, the skill patches the storage SKU in IaC and runs the same deploy command as Step 3 (e.g. `azd up`). This deploy is a no-op confirmation that the IaC matches the live state. Confirm once with the user before executing, then run it directly.

### Step 2 (both paths): Re-Assess

After changes are applied (CLI) or deployed (IaC), automatically re-run the assessment and show the **same feature-pivoted table** as Phase 3, with each feature row's status updated to reflect the new state. Briefly call out what changed since the previous run.

```
🔄 Reliability Re-Assessment — rg-eventhubs-python-jan13 (eastus)
───────────────────────────────────────────────────────────────────────────────────────
Reliability Feature              Status      Resources
───────────────────────────────────────────────────────────────────────────────────────
Zone redundancy — compute        🟢 ON       • plan-ii5trxva2ark4 (FC1)              — now ON
                                             • plan-web-ii5trxva2ark4 (P1v3)         — now ON

Zone-redundant storage           🟢 ZRS      • stii5trxva2ark4                       — GRS → ZRS

Health probes                    🟡 PARTIAL  • func-api-ii5trxva2ark4                — still off (FC1, code change declined)
                                             • app-web-ii5trxva2ark4                 — now ON

Multi-region failover            🔴 OFF      • Single region (eastus) only
───────────────────────────────────────────────────────────────────────────────────────

What changed: Function App and App Service plan zone redundancy, storage replication and health probes on App Service.
(Multi-region offered next — see Step 3.)
```

### Step 3 (both paths): Multi-region follow-up — ASK and WAIT

Multi-region is a significant cost/complexity step. Do **NOT** start it automatically. After re-assessment, only if **all core single-region reliability features are 🟢 ON** (zone-redundant compute, ZRS/GZRS storage, health probes), explicitly ask the user and **wait for their response** before doing anything:

```
🟢 Your app is now fully zone-redundant in {region}.

The next step (optional) is multi-region failover with Azure Front Door:
   • Deploys compute + storage in a second region (paired region recommended)
   • Adds Azure Front Door for global load balancing with health-probe-driven failover
   • Protects against full region outages
   • Estimated additional cost: ~2x compute (active-passive); Front Door ~$35/month base

Do you want me to set up multi-region failover now? (yes / no / later)
```

- **yes** → proceed with [references/configure-multi-region.md](references/configure-multi-region.md). Confirm secondary region choice with the user, then:
  1. Generate the multi-region IaC (Bicep / Terraform additions for the secondary region + Front Door).
  2. Confirm once with the user: `📦 Multi-region IaC generated. Ready to deploy with \`azd up\`. Proceed? (yes / no)`
  3. On **yes**, **the skill runs the deploy itself** (`azd up` / `az deployment group create` / `terraform apply`) and streams output. Do not stop and tell the user to run it.
  4. After successful deploy, run a final re-assessment so the user sees Multi-region failover flip to 🟢 ON.
- **no / later** → leave the deployment as-is. Note that single-region zone-redundant is a reliable end state; multi-region can be revisited anytime.

> **⛔ Do not skip the wait.** Do not generate multi-region IaC, deploy a Front Door, or modify any files until the user has explicitly said yes. If core reliability is not yet all 🟢, do **not** ask about multi-region — finish the core gaps first.
