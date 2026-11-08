---
name: "ai-image-generation"
description: "Generate and edit images on RunComfy via the `runcomfy` CLI — a smart router across the full image-model catalog: FLUX 2 (Klein 9B/4B, Pro, Dev, Flash, Turbo, Max), Google Nano Banana 2 / Pro, OpenAI GPT Image 2, ByteDance Seedream 5 / 4-5 / 4-0 and Dreamina 4-0, Alibaba Qwen Image and Z-Image Turbo, Wan 2-7. Covers both text-to-image (t2i) and image-to-image / edit (i2i) endpoints — the skill picks the right model for the user's actual intent (typography precision, photoreal portraits, sub-second iteration, multi-reference brand styling, open-weights workflow) and ships each model's documented prompting patterns plus the minimal `runcomfy run` invoke. Triggers on \"generate image\", \"make a picture\", \"text to image\", \"AI image\", \"make an image of …\", \"image to image\", \"i2i\", or any explicit ask to create or restyle an image."
license: "MIT"
metadata:
  gaw-category: "media-creative"
  gaw-author: "gencraft-labs"
  gaw-version: "1.0.0"
---

# AI Image Generation

Generate and edit images with 11+ AI models via the [RunComfy](https://www.runcomfy.com/?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) CLI — text-to-image and image-to-image, one auth, one command. This skill picks the right model for the user's intent and ships the documented prompt patterns + the exact `runcomfy run` invoke for each.

[runcomfy.com](https://www.runcomfy.com/?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [Browse all models](https://www.runcomfy.com/models?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [CLI docs](https://docs.runcomfy.com/cli/introduction?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

## Powered by the RunComfy CLI

```bash
# 1. Install (one of — see runcomfy-cli skill for details)
npm i -g @runcomfy/cli                              # global install
npx -y @runcomfy/cli --version                      # zero-install

# 2. Sign in (interactive — opens browser)
runcomfy login
# or in CI / containers:
export RUNCOMFY_TOKEN=<token-from-runcomfy.com/profile>

# 3. Generate
runcomfy run <vendor>/<model>/<endpoint> \
  --input '{"prompt": "..."}' \
  --output-dir ./out
```

CLI docs: [Install](https://docs.runcomfy.com/cli/install?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [Quickstart](https://docs.runcomfy.com/cli/quickstart?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [Commands](https://docs.runcomfy.com/cli/commands?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [Auth](https://docs.runcomfy.com/cli/auth?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [Troubleshooting](https://docs.runcomfy.com/cli/troubleshooting?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

## Install this skill

```bash
npx skills add agentspace-so/runcomfy-agent-skills --skill ai-image-generation -g
```

---

## Pick the right model for the user's intent

### Text-to-image (t2i) — newest first

**FLUX 2 Klein 9B** — `blackforestlabs/flux-2-klein/9b/text-to-image` *(default)*
> Step-distilled, 4–25 steps, native multi-reference conditioning, strong photoreal + illustration all-rounder.
> Pick for: intent unclear, fast iteration, multi-ref styling, general-purpose.
> Avoid for: in-image text — use **GPT Image 2**.

**FLUX 2 Klein 4B** — `blackforestlabs/flux-2-klein/4b/text-to-image`
> Sub-second variant of Klein 9B, same field set.
> Pick for: storyboard, moodboard, batch concepting at speed.
> Avoid for: final delivery — slight quality drop vs 9B.

**FLUX 2 Pro / Dev / Flash / Turbo / Max** — `blackforestlabs/flux-2/max`, [`flux-2-dev`](https://www.runcomfy.com/models/blackforestlabs/flux-2-dev/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation), [`flux-2-flash`](https://www.runcomfy.com/models/blackforestlabs/flux-2-flash?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation), [`flux-2-turbo`](https://www.runcomfy.com/models/blackforestlabs/flux-2-turbo?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Higher-fidelity tiers of the FLUX 2 base. Cinematic + brand work, hero shots.
> Pick for: production polish, brand campaigns.
> Avoid for: sub-second speed — use **Klein 4B**.

**Nano Banana Pro** — [`google/nano-banana-pro/text-to-image`](https://www.runcomfy.com/models/google/nano-banana-pro/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Highest-quality Nano Banana tier. Gemini-grounded, optional web search for real-world references (products, landmarks).
> Pick for: NB-style instruction-following at higher fidelity.
> Avoid for: cost-sensitive iteration — drop to **Nano Banana 2**.

**Nano Banana 2** — `google/nano-banana-2/text-to-image`
> Flash-tier latency, predictable framing, `enable_web_search` flag for real-product / real-person grounding.
> Pick for: speed iteration, 4-up batch, real-world grounded prompts.
> Avoid for: long compositional instructions — use **GPT Image 2**.

**GPT Image 2** — `openai/gpt-image-2/text-to-image`
> Best-in-class in-image text rendering (Japanese kana, Cyrillic, Arabic). Layout-precise instruction following.
> Pick for: posters, ads, multi-line copy, multilingual creatives, exact-text headlines.
> Avoid for: photoreal portraits — **Seedream 5** wins on skin tones and lighting.

**Seedream 5 Lite** — [`bytedance/seedream-5/lite/text-to-image`](https://www.runcomfy.com/models/bytedance/seedream-5/lite/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Latest ByteDance Seedream tier. Photoreal skin tones, natural lighting, strong East Asian aesthetic.
> Pick for: photoreal portraits, product shots, fashion / lifestyle.
> Avoid for: typography precision — use **GPT Image 2**.

**Seedream 4-5** — [`bytedance/seedream-4-5/text-to-image`](https://www.runcomfy.com/models/bytedance/seedream-4-5/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Previous Seedream flagship, still strong on photoreal.
> Pick for: identity-stable batches between Seedream-5 generations; cheaper Seedream tier.
> Avoid for: new work — prefer **Seedream 5 Lite**.

**Dreamina 4-0** — [`bytedance/dreamina-4-0/text-to-image`](https://www.runcomfy.com/models/bytedance/dreamina-4-0/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> ByteDance illustration / concept-art lean, stylized characters.
> Pick for: concept art, illustrated heroes, painterly assets.
> Avoid for: photoreal — use **Seedream**.

**Qwen Image 2512** — [`qwen/qwen-image/qwen-image-2512`](https://www.runcomfy.com/models/qwen/qwen-image/qwen-image-2512?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Alibaba Qwen latest, open-weights, LoRA-compatible (`/lora` variant).
> Pick for: open-weights workflow, Qwen-aligned LoRA chains.
> Avoid for: closed-weights polish — use **FLUX 2** or **GPT Image 2**.

**Wan 2-7** — [`wan-ai/wan-2-7/text-to-image`](https://www.runcomfy.com/models/wan-ai/wan-2-7/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation), [`wan-ai/wan-2-7/pro/text-to-image`](https://www.runcomfy.com/models/wan-ai/wan-2-7/pro/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Open-weights, pairs natively with Wan 2-7 video models for unified-stack workflows.
> Pick for: Wan-stack pipelines (image + video same brand), open-weights requirement.
> Avoid for: top-tier image-only quality.

**Z-Image Turbo** — [`tongyi-mai/z-image/turbo`](https://www.runcomfy.com/models/tongyi-mai/z-image/turbo?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Sub-second open-weights, native LoRA `/lora` variant.
> Pick for: LoRA-customized open-weights workflow at speed.
> Avoid for: closed-weights polish.

### Image-to-image / edit (i2i) — newest first

**Nano Banana Pro Edit** — [`google/nano-banana-pro/edit`](https://www.runcomfy.com/models/google/nano-banana-pro/edit?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Highest-quality Nano Banana edit tier. Identity-preserving, multi-ref.
> Pick for: premium NB edit work, identity-locked variants.
> Avoid for: cost-sensitive iteration — drop to **Nano Banana 2 Edit**.

**Nano Banana 2 Edit** — `google/nano-banana-2/edit` *(default i2i)*
> 1–20 input images per call, identity-preserving by default, spatial-language honored ("upper-right", "the left object").
> Pick for: default i2i, batch identity-preserving, background swap, directional object remove/add.
> Avoid for: precise mask region — use the [`image-edit`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/image-edit) skill (Z-Image Inpaint).

**GPT Image 2 Edit** — `openai/gpt-image-2/edit`
> Up to 10 reference images, multilingual in-image text rewrite, layout-precise repositioning.
> Pick for: multilingual headline swap, multi-ref composition, layout repositioning, brand-locked identity across translations.
> Avoid for: mask-driven inpainting — use [`image-edit`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/image-edit) skill.

**Seedream 5 Lite Edit** — [`bytedance/seedream-5/lite/edit`](https://www.runcomfy.com/models/bytedance/seedream-5/lite/edit?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Latest Seedream edit tier, photoreal preservation.
> Pick for: photoreal edits that started from a Seedream t2i (identity holds across the pair).
> Avoid for: multilingual text rewrite.

**Seedream 4-5 Edit** — [`bytedance/seedream-4-5/edit`](https://www.runcomfy.com/models/bytedance/seedream-4-5/edit?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Previous Seedream edit.
> Pick for: identity-stable batches between 4-5 generations.
> Avoid for: new work — prefer **Seedream 5 Lite Edit**.

**Dreamina 4-0 Edit** — [`bytedance/dreamina-4-0/edit`](https://www.runcomfy.com/models/bytedance/dreamina-4-0/edit?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> ByteDance illustration edit.
> Pick for: editing a Dreamina-generated illustration.
> Avoid for: photoreal subjects.

**Qwen Image Edit 2511** — [`qwen/qwen-image/qwen-image-edit-2511`](https://www.runcomfy.com/models/qwen/qwen-image/qwen-image-edit-2511?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Alibaba open-weights edit.
> Pick for: open-weights edit pipeline.
> Avoid for: closed-weights polish.

**Wan 2.6 i2i** — [`wan-ai/wan-v2.6/image-to-image`](https://www.runcomfy.com/models/wan-ai/wan-v2.6/image-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
> Wan ecosystem image-to-image.
> Pick for: Wan-stack pipeline integration.
> Avoid for: new work — older generation; prefer NB or GPT Image 2.

**FLUX Kontext Pro** — `blackforestlabs/flux-1-kontext/pro/edit`
> Single-ref single-instruction, highest preservation fidelity ("keep everything except X").
> Pick for: single-image precise local edit ("change only her umbrella to orange").
> Avoid for: batch work, multi-ref composition, mask-driven inpainting.

> **Need mask-driven inpainting, controlled outpainting, or the full edit treatment?** → use the [`image-edit`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/image-edit) skill.

---

## t2i Route 1: FLUX 2 Klein — default

**Models**: `blackforestlabs/flux-2-klein/9b/text-to-image` (default), `blackforestlabs/flux-2-klein/4b/text-to-image` (sub-second)
**Catalog**: [9B](https://www.runcomfy.com/models/blackforestlabs/flux-2-klein/9b/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [4B](https://www.runcomfy.com/models/blackforestlabs/flux-2-klein/4b/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

### Schema (both variants)

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `prompt` | string | yes | — | Up to ~512 tokens; longer degrades. Subject-first declarative |
| `steps` | int | no | 25 (9B) / 4 (4B) | Step-distilled; 4–8 enough for ideation, ~25 for polish, >25 buys little |
| `width` | int | no | 1024 | 512–1536 typical, max ~2K total. Aspect cap 16:9 |
| `height` | int | no | 1024 | Match width's aspect intent |

Up to **4 reference images** supported on the same endpoint for style transfer / guided composition. Field name documented on the [model page](https://www.runcomfy.com/models/blackforestlabs/flux-2-klein/9b/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation).

### Invoke

**Polish / final (9B):**

```bash
runcomfy run blackforestlabs/flux-2-klein/9b/text-to-image \
  --input '{
    "prompt": "A small purple cat sitting on a moss-covered stone, golden hour rim light, shallow depth of field, photoreal",
    "steps": 25,
    "width": 1536,
    "height": 864
  }' \
  --output-dir ./out
```

**Sub-second concepting (4B):**

```bash
runcomfy run blackforestlabs/flux-2-klein/4b/text-to-image \
  --input '{"prompt": "A small purple cat at sunset, photoreal"}' \
  --output-dir ./out
```

### Prompting tips

- **Subject first, scene second, modifiers last.** "A small purple cat … on a moss stone … golden hour, shallow DoF."
- **Step strategy**: 4–8 for ideation, ~25 for polish. Don't crank past 28 — diminishing returns.
- **9B vs 4B**: default 9B; drop to 4B only when you need sub-second batch concepting.
- **Multi-ref**: 1–4 reference URLs; describe roles in prompt (`"subject from ref 1, palette from ref 2"`).

---

## Detailed references

_GAW moved these sections out of this file to save context; their content is unchanged. Read one only when the task needs it:_

- [t2i Route 2: GPT Image 2 — typography & in-image text; t2i Route 3: Nano Banana 2 — speed iteration; t2i Route 4: Seedream 5 / 4-5 — photoreal flagship](references/t2i-route-2-gpt-image-2-typography-in-image-text.md) (~1257 tokens)
- [t2i Route 5: Open-weights & specialty models; i2i — image-to-image / edit (compact); Common patterns](references/t2i-route-5-open-weights-specialty-models.md) (~1390 tokens)
- [Browse the full catalog; Exit codes; How it works; …](references/browse-the-full-catalog.md) (~1265 tokens)
