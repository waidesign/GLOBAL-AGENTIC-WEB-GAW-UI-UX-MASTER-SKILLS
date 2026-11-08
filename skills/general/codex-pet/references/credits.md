<!-- Part of the codex-pet skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Credits

The 9-row Codex Pet atlas spec — column counts, frame counts, cell dimensions — comes from OpenAI's official [`hatch-pet`](https://github.com/openai/skills/tree/main/skills/.curated/hatch-pet) skill (MIT licensed). The animation-row contract and the chroma-key strategy are documented there. This skill reuses the spec but swaps the visual generator (`$imagegen` → RunComfy GPT Image 2) and the atlas assembly (Python → ImageMagick) so it runs without Codex Pro.

## What this skill is not

Not a Codex client. Not a `hatch-pet` replacement when `$imagegen` is available — official `hatch-pet` is preferable when Codex Pro is in play. Not a self-hosted GPT Image 2 — depends on a working RunComfy account.

## Security & Privacy

- **Token storage**: `runcomfy login` writes the API token to `~/.config/runcomfy/token.json` with mode 0600. Set `RUNCOMFY_TOKEN` env var to bypass the file in CI.
- **Input boundary**: Codex Pet prompts are passed as JSON via `--input`. The CLI does NOT shell-expand. No shell-injection surface.
- **Third-party content**: source image URL is fetched by the RunComfy server. Treat external URLs as untrusted — image-based prompt injection is a known risk for any image-edit model.
- **Outbound endpoints**: only `model-api.runcomfy.net` and `*.runcomfy.net` / `*.runcomfy.com`.
- **Generated-file size cap**: the CLI aborts any single Codex Pet canonical download > 2 GiB.
- **Local install path**: the final Codex Pet writes to `${CODEX_HOME:-$HOME/.codex}/pets/<pet-name>/`. No remote upload.
