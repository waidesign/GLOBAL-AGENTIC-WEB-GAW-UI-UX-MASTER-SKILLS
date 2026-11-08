<!-- Part of the azure-reliability skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Priority Classification

| Priority | Criteria | Action |
|---|---|---|
| Critical | No zone redundancy AND production workload | Fix immediately |
| High | LRS storage on zone-redundant compute | Fix within days |
| Medium | No multi-region (single region but zone-redundant) | Plan for next sprint |
| Low | Missing health probes or monitoring gaps | Track and fix |

## Error Handling

| Error | Message | Remediation |
|---|---|---|
| Authentication required | "Please login" | Run `az login` and retry |
| Access denied | "Forbidden" | Confirm Reader/Contributor role assignment |
| Plan doesn't support ZR | "Upgrade required" | Inform user of plan upgrade path + cost delta |
| Region doesn't support AZ | "Region limitation" | Suggest supported regions |

## Best Practices

- Run reliability assessments after every significant infrastructure change
- Test failover scenarios periodically (at least quarterly)

## Skill Boundaries

| Action | This skill does | Hand off to |
|---|---|---|
| Assess reliability posture | ✅ Yes | — |
| Recommend improvements | ✅ Yes | — |
| Enable zone redundancy (CLI commands) | ✅ Yes | — |
| Patch Bicep/Terraform for reliability | ✅ Yes | — |
| Generate multi-region IaC | ✅ Yes (additions for the secondary region + Front Door) | `azure-prepare` for full new-app IaC scaffolding |
| Deploy IaC for reliability changes | ✅ Yes (runs `azd up` / `terraform apply` / `az deployment` itself, after user confirmation) | `azure-deploy` for general/non-reliability deploys |
| Validate pre-deployment | Reliability checks only | `azure-validate` for full validation |
