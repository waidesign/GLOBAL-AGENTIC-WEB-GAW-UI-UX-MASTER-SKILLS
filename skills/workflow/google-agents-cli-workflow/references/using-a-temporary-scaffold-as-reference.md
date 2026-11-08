<!-- Part of the google-agents-cli-workflow skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Using a Temporary Scaffold as Reference

When you need specific infrastructure files (Terraform, CI/CD, Dockerfile) but don't want to modify the current project, use `/google-agents-cli-scaffold` to create a temporary project in `/tmp/` and copy over what you need.

---

## Reference Files

| File | Contents |
|------|----------|
| `references/internals.md` | Underlying tools and commands that `agents-cli` wraps, per language (Python: adk, uv, ruff; Go: adk-go, go, golangci-lint) |
| `references/spec-template.md` | `.agents-cli-spec.md` template and optional sections |
| `references/brainstorming.md` | Phase 0 design-dialogue playbook (one-at-a-time Q&A, approaches, gates) |
| `references/terminology.md` | Product-name → CLI-value mapping |
| `references/commands.md` | Per-phase `agents-cli` command index |
| `references/extension.md` | Author an ad-hoc extension or adopt an existing one (override or add commands) |

## Development Commands

Run `agents-cli --help` or `agents-cli <command> --help` for the authoritative flag list. A per-phase command index lives in `references/commands.md`; per-phase usage is in the phase sections above.

To **override** a built-in command (e.g. wrap `deploy` with compliance checks) or **add a new one**, agents-cli has an extension system. To author an ad-hoc extension for this repo, or adopt an existing one, load `references/extension.md`.

---

## Skills Version

> **Troubleshooting hint:** If skills seem outdated or incomplete, reinstall:
> ```
> agents-cli setup --skip-auth
> ```
> Only do this when you suspect stale skills are causing problems.
