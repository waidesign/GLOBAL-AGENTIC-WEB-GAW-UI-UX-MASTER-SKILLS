<!-- Part of the codex-pet skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## Tuning the micro-animation

The default ImageMagick recipe in step 3 produces a Codex Pet animation similar to the built-in Codex Pets — subtle bob, occasional blink, jumping arc, head tilt. To make the animation more or less perceptible, tweak the deltas:

- **Bigger idle bob**: change `shift:0:-1` to `shift:0:-2` in row 0.
- **Faster running cycle**: increase the horizontal shifts in row 1 (e.g. `shift:3:0` instead of `shift:2:-1`).
- **Higher jump**: change row 4's peak from `shift:0:-8` to `shift:0:-12`.
- **Stronger head tilt** in review: change `rotate:-2` / `rotate:2` to `rotate:-4` / `rotate:4`.

Keep deltas small (≤ 4 px or ≤ 4°) so the Codex Pet doesn't become distracting.

## FAQ — Codex Pet

**What is a Codex Pet?** OpenAI Codex Pets are pixel-art animated companions launched May 2026 that float over your desktop and react to Codex's coding status. Custom Codex Pets live as `pet.json` + `spritesheet.webp` files under `${CODEX_HOME:-$HOME/.codex}/pets/<name>/`.

**Why use this Codex Pet skill instead of `hatch-pet`?** Official `hatch-pet` requires the Codex-internal `$imagegen` system skill (Codex Pro). This skill needs only `RUNCOMFY_TOKEN` and runs the same animation-row spec via the RunComfy CLI, with one GPT Image 2 call total.

**How long does a Codex Pet generation take?** ~2 minutes — 1 GPT Image 2 edit call (~90s) plus a few seconds of ImageMagick atlas assembly.

**Why only one API call?** The Codex Pet animation in the Codex desktop app is intentionally subtle (you can confirm by inspecting any built-in Codex Pet's atlas — 72 cells of nearly-identical poses with tiny variations). One canonical pose plus deterministic ImageMagick micro-transforms produces the same animation feel without burning 72 separate generation calls.

**Can the Codex Pet skill take a non-human subject?** Yes — pets, mascots, objects, foods all work. The base prompt simplifies the source into the Codex Pet house style automatically.

**How do I install my Codex Pet?** Copy `pet.json` and `spritesheet.webp` into `${CODEX_HOME:-$HOME/.codex}/pets/<pet-name>/` and reload Codex.

**What if the canonical Codex Pet drifts off identity?** Re-run step 1 with a tighter identity-preservation prompt (e.g. name specific features: hair color, glasses, accessory). Steps 2-6 are deterministic and don't need to change.

**What size is each Codex Pet frame?** 192x208 px. Each row strip is 1536x208 (8 frames). Final Codex Pet atlas is 1536x1872 (9 stacked rows).

**Can I add custom poses or replace rows?** Yes — modify the `build_row` calls in step 3. The atlas slot count per row must match the Codex contract (idle=6, running-right/left=8, waving=4, jumping=5, failed=8, waiting/running/review=6) for Codex to play them correctly.

## Limitations

- **One canonical pose per Codex Pet** — animation is via ImageMagick transforms, not multi-frame model generation. This matches the built-in Codex Pets' subtle animation but won't produce dramatic motion (e.g. distinct frame-by-frame running cycle).
- **GPT Image 2 doesn't output alpha** — the magenta chroma-key + post-process is a workaround. If the Codex Pet has near-magenta colors (rare for chibi palettes), switch the chroma-key to a different solid (`#00FFFF` cyan or `#00FF00` green) in both the prompt and the post-process.
- **Identity drift** — GPT Image 2 may simplify the source image identity into Codex Pet style; specific small features (e.g. earrings, prop colors) may shift.
- **No audio / voice on Codex Pet** — Codex Pets are visual-only.

## Exit codes

The `runcomfy` CLI uses sysexits-style codes:

| code | meaning |
|---|---|
| 0  | Codex Pet canonical generated successfully |
| 64 | bad CLI args |
| 65 | bad input JSON for the Codex Pet call / schema mismatch (e.g. `size: "1024_1024"` instead of `"1024*1024"`) |
| 69 | upstream 5xx |
| 75 | retryable: timeout / 429 |
| 77 | not signed in or token rejected |

`magick` (ImageMagick) returns 0 on a clean Codex Pet atlas; non-zero indicates a missing input frame or output-path permission issue.

Full reference: [docs.runcomfy.com/cli/troubleshooting](https://docs.runcomfy.com/cli/troubleshooting?utm_source=skills.sh&utm_medium=skill&utm_campaign=codex-pet).

## How it works

1. The skill calls `runcomfy run openai/gpt-image-2/edit` once with the user's source image and a tight chibi-proportion prompt, producing a 1024x1024 canonical Codex Pet on magenta.
2. ImageMagick chroma-keys the magenta to alpha 0, trims the sprite bbox, aspect-fits into a 192x208 cell.
3. ImageMagick programmatically builds 9 row strips by applying micro-transforms (1-2 px translate, blink mask, rotate, mirror) to the canonical cell.
4. The 9 row strips stack into the 1536x1872 Codex Pet atlas; the atlas converts to WebP.
5. A `pet.json` manifest is written; both files are copied into `${CODEX_HOME:-$HOME/.codex}/pets/<name>/` where Codex picks up the custom Codex Pet automatically.
