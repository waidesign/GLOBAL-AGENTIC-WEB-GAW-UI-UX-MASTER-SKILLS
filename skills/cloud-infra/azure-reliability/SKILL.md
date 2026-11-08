---
name: "azure-reliability"
description: "Assess and improve the reliability posture of PaaS Applications (Azure Functions and Azure App Service). Scans deployed resources for zone redundancy, ZRS storage, health probes, and multi-region failover. Presents a feature-pivoted checklist, then drives staged remediation (CLI or IaC patches) end-to-end with user confirmation. WHEN: \\\"assess reliability\\\", \\\"check reliability\\\", \\\"zone redundant\\\", \\\"multi-region failover\\\", \\\"high availability\\\", \\\"disaster recovery\\\", \\\"single points of failure\\\", \\\"reliability posture\\\", \\\"resiliency\\\"."
license: "MIT"
metadata:
  gaw-category: "cloud-infra"
  gaw-author: "Microsoft"
  gaw-version: "1.0.0"
---

# Azure Reliability Assessment & Configuration

## Quick Reference

| Property | Details |
|---|---|
| Best for | Reliability posture assessment, zone redundancy enablement, multi-region failover setup |
| Primary capabilities | Reliability assessment table, Zone Redundancy Configuration, Multi-Region IaC Generation |
| Supported services | Azure Functions, App Service (Container Apps planned for a future version) |
| MCP tools | Azure Resource Graph queries, Azure CLI commands |

## When to Use This Skill

Activate this skill when user wants to:
- "Assess my Function app's reliability"
- "Assess my Web app's reliability"
- "Check the reliability of my resource group" (App Service and Functions resources only)
- "Is my app zone redundant?" (App Service and Functions resources only)
- "Is my app service plan zone redundant?" 
- "Make my app zone redundant" (App Service and Functions resources only)
- "Make my app service plan zone redundant"
- "Set up multi-region failover for my app" (App Service and Functions resources only)
- "Check my reliability posture"
- "Find single points of failure" (App Service and Functions resources only)
- "Enable high availability for my app" (App Service and Functions resources only)
- "Check disaster recovery readiness"
- "Improve my app's resilience" (App Service and Functions resources only)

> **Scope note:** This skill currently covers **Azure Functions and Azure App Service** only. If the user asks about Azure Container Apps reliability, acknowledge that support is planned but not yet available, and only proceed with the parts that apply to App Service and Functions resources in scope.

## Prerequisites

- Authentication: user is logged in to Azure via `az login`
- Permissions: Reader access on target subscription/resource group (for assessment)
- Permissions: Contributor access (for configuration changes)
- Azure Resource Graph extension: `az extension add --name resource-graph`

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp_azure_mcp_extension_cli_generate` | Generate `az` CLI commands for resource queries and configuration |
| `mcp_azure_mcp_subscription_list` | List available subscriptions |
| `mcp_azure_mcp_group_list` | List resource groups |

Primary query method: Azure Resource Graph via `az graph query` (requires `az extension add --name resource-graph`).

## Assessment Workflow

### Phase 1: Discover Resources

1. **Identify scope** — Ask user for resource group, subscription, or app name
2. **Query Azure Resource Graph** to discover all resources in scope
3. **Classify resources** by service type (Functions, Storage, etc.). If Container Apps is found, **note it but do not deep-dive**.

**Important:** Always scope queries to the user's specified resource group or subscription. Add these filters to every Resource Graph query:
- Resource group: `| where resourceGroup =~ '<rg-name>'`
- Subscription: Use `--subscriptions <sub-id>` flag on `az graph query`
- App name: `| where name =~ '<app-name>'`

### Phase 2: Assess Reliability

Two-step assessment: **platform-level discovery first, then per-service deep dive.**

**Step 1 — Platform discovery (find what's there).** Use these to enumerate resources in scope and detect cross-cutting reliability gaps:

| Platform check | Reference |
|---|---|
| Zone redundancy — discovery | [references/zone-redundancy-checks.md](references/zone-redundancy-checks.md) |
| Storage redundancy (cross-service) | [references/storage-redundancy-checks.md](references/storage-redundancy-checks.md) |
| Multi-region & global load balancers | [references/multi-region-checks.md](references/multi-region-checks.md) |
| Front Door / Traffic Manager / App Insights probes | [references/health-probe-checks.md](references/health-probe-checks.md) |

**Step 2 — Per-service deep dive.** For each compute resource discovered in Step 1, load the matching service reference. The service reference is the single source of truth for that service's plan/SKU rules, assessment queries, CLI commands, IaC patches (Bicep + Terraform + AVM), and reporting hints.

This skill version ships **only the Azure Functions and App Service** per-service references. Other compute services are listed below explicitly so the dispatch logic is unambiguous: if a resource matches an unsupported row, do **not** attempt to load a reference, fabricate CLI commands, or generate IaC patches for it.

| Service detected | Reference |
|---|---|
| Azure Functions (`microsoft.web/serverfarms` with `kind contains 'functionapp'`) | [references/services/functions/reliability.md](references/services/functions/reliability.md) |
| Azure App Service (non-Functions sites: `microsoft.web/sites` without `kind contains 'functionapp'`, `microsoft.web/serverfarms` without `kind contains 'functionapp'`) | [references/services/app-service/reliability.md](references/services/app-service/reliability.md) |
| Azure Container Apps (`microsoft.app/containerapps`, `microsoft.app/managedenvironments`) | ⚪ Not yet shipped — planned for a future version |

> **Handling unsupported services:** If a resource matches an unsupported row above, surface it in the discovery summary, mark it as `⚪ not assessed (planned)` in the Phase 3 table, and skip the per-service remediation steps for it. Do **not** attempt to fabricate CLI commands or IaC patches for those services.

### Phase 3: Generate Reliability Checklist

Present findings as a **feature-pivoted** table: one row per reliability feature (Zone redundancy on compute, Zone-redundant storage, Health probes, Multi-region failover), with a single status indicator and the **specific resources** that are relevant to that feature. This avoids the noise of one-row-per-resource with mostly `n/a` cells. Do **not** assign numeric scores or grades.

```
🔍 Reliability Assessment — {scope}
─────────────────────────────────────────────────────────────────────────────────────────────
Reliability Feature              Status      Resources
─────────────────────────────────────────────────────────────────────────────────────────────
Zone redundancy — compute        🔴 OFF      • plan-web-ii5trxva2ark4 (P1v3)
                                              • plan-ii5trxva2ark4 (FC1)

Zone-redundant storage           🔴 GRS      • stii5trxva2ark4 (defaulted; no SKU set in IaC)

Health probes                    🔴 OFF      • func-api-ii5trxva2ark4 — needs code change (FC1)
                                              • app-web-ii5trxva2ark4 — no health check path

Multi-region failover            🔴 OFF      • Single region (eastus) only — Front Door not configured
─────────────────────────────────────────────────────────────────────────────────────────────

Want me to fix the 🔴 items? I'll do the quick wins first (App
plan zone redundancy + health checks on supported plans), then ask before
storage migration and multi-region setup. (yes/no)
```

**Rules for the table:**

- **Four feature rows, in this order:** Zone redundancy — compute · Zone-redundant storage · Health probes · Multi-region failover. Omit a row entirely only if no resource in scope could ever apply to it.
- **Status column** is one symbol + one short word, no other characters:
  - `🟢 ON` — feature is fully enabled across all relevant resources in scope
  - `🟡 PARTIAL` — some resources have it, some don't (or partial config like liveness-only)
  - `🔴 OFF` — feature is missing on all relevant resources
  - For storage, replace `OFF` with the current SKU when relevant (`🔴 LRS`, `🔴 GRS`, `🟢 ZRS`, `🟢 GZRS`). When no SKU is set in IaC, label as `🔴 GRS` (ARM/AVM default) and note that in the resource line.
- **Resources column** lists only what's relevant to that feature, one bullet per resource:
  - For "needs fixing" resources, include a short inline reason (`(FC1)`, `(defaulted; no SKU set)`, `liveness only`, `needs code change (FC1)`).
  - For resources that are **already ON** for that feature, mention them on the same row with `— already ON` so the user sees credit for what's right.
- **Do not** include `n/a`, `—`, or empty cells. If a feature doesn't apply to any resource in scope, drop the row.
- **Do not** include numeric scores, grades, or point totals.
- End the assessment with a **single yes/no question** that kicks off the staged remediation flow. Do not enumerate the per-resource fix list here — the user will see it after they say yes (Configuration Workflow Step 1).

> **UX Note:** If the assessment finds the app **already has** all core reliability features (zone redundancy, ZRS/GZRS storage, health probes), skip the fix-it question and jump straight to Configuration Workflow [Step 3](#step-3-both-paths-multi-region-followup--ask-and-wait) (Multi-region follow-up). Do **NOT** start any multi-region work without explicit consent.

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [Configuration Workflow](references/configuration-workflow.md) (~3116 tokens)
- [Priority Classification; Error Handling; Best Practices; …](references/priority-classification.md) (~401 tokens)
