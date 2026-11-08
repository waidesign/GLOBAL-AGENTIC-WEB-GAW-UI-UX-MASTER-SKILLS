<!-- Part of the ai-image-generation skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## t2i Route 5: Open-weights & specialty models

For workflows that want open-weights / LoRA support, or alternative aesthetics:

| Model | Endpoint | When |
|---|---|---|
| [`wan-ai/wan-2-7/text-to-image`](https://www.runcomfy.com/models/wan-ai/wan-2-7/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) | `wan-ai/wan-2-7/text-to-image` | Wan ecosystem; pair with Wan 2-7 video models |
| [`wan-ai/wan-2-7/pro/text-to-image`](https://www.runcomfy.com/models/wan-ai/wan-2-7/pro/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) | `wan-ai/wan-2-7/pro/text-to-image` | Wan Pro tier |
| [`tongyi-mai/z-image/turbo`](https://www.runcomfy.com/models/tongyi-mai/z-image/turbo?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) | `tongyi-mai/z-image/turbo` | Sub-second, supports LoRA via `/lora` endpoint |
| [`qwen/qwen-image/qwen-image-2512`](https://www.runcomfy.com/models/qwen/qwen-image/qwen-image-2512?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) | `qwen/qwen-image/qwen-image-2512` | Qwen Image, open-weights, also has `/lora` variant |
| [`bytedance/dreamina-4-0/text-to-image`](https://www.runcomfy.com/models/bytedance/dreamina-4-0/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) | `bytedance/dreamina-4-0/text-to-image` | Illustration / concept art lean |

Schemas live on each model page — pass field set through the CLI verbatim.

---

## i2i — image-to-image / edit (compact)

For one-shot edits, this skill ships three core routes; for the full edit treatment (mask-driven inpainting, batch-edit, all the side schemas), use the dedicated [`image-edit`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/image-edit) skill.

### i2i Route A: Nano Banana 2 Edit — default

```bash
runcomfy run google/nano-banana-2/edit \
  --input '{
    "prompt": "Keep the subject identity, pose, and clothing unchanged. Convert the background into a rainy neon cyberpunk street.",
    "image_urls": ["https://.../portrait.jpg"]
  }' \
  --output-dir ./out
```

Schema: `prompt`, `image_urls` (1–20), `number_of_images` (1–4), `aspect_ratio` (`auto` default), `resolution`, `output_format`, `seed`, `enable_web_search`. Lead the prompt with preservation goals, end with the change.

### i2i Route B: GPT Image 2 Edit — multilingual + multi-ref

```bash
runcomfy run openai/gpt-image-2/edit \
  --input '{
    "prompt": "Keep the photo and layout exactly as in the input. Replace only the headline with \"今日のおすすめ\" in bold Japanese kana.",
    "images": ["https://.../poster-en.jpg"],
    "size": "auto"
  }' \
  --output-dir ./out
```

Schema: `prompt`, `images` (up to 10 HTTPS refs; image 1 is primary), `size` (`auto` / `1024_1024` / `1024_1536` / `1536_1024`). `size: "auto"` preserves input ratio.

### i2i Route C: FLUX Kontext Pro — single-shot precise

```bash
runcomfy run blackforestlabs/flux-1-kontext/pro/edit \
  --input '{
    "prompt": "Keep the person'\''s face, pose, and clothing unchanged. Add an orange umbrella in her left hand and a slight smile.",
    "image": "https://.../portrait.jpg"
  }' \
  --output-dir ./out
```

Schema: `prompt`, `image` (single URL only — no array), `aspect_ratio`, `seed`. One declarative instruction per call; iterate compound edits in passes.

### Other i2i endpoints in the catalog

Same-brand t2i→i2i pairs let you generate then refine without leaving the brand:

| Brand | t2i endpoint | i2i / edit endpoint |
|---|---|---|
| Seedream 5 Lite | `bytedance/seedream-5/lite/text-to-image` | `bytedance/seedream-5/lite/edit` |
| Seedream 4-5 | `bytedance/seedream-4-5/text-to-image` | `bytedance/seedream-4-5/edit` |
| Dreamina 4-0 | `bytedance/dreamina-4-0/text-to-image` | `bytedance/dreamina-4-0/edit` |
| Nano Banana Pro | `google/nano-banana-pro/text-to-image` | `google/nano-banana-pro/edit` |
| Qwen Image | `qwen/qwen-image/qwen-image-2512` | `qwen/qwen-image/qwen-image-edit-2511` |
| Wan 2-7 / 2.6 | `wan-ai/wan-2-7/text-to-image` | `wan-ai/wan-v2.6/image-to-image` |

For the full "best image-editing models" curated list with side-by-side capability notes, see the [`best-image-editing-models` collection](https://www.runcomfy.com/models/collections/best-image-editing-models?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation).

---

## Common patterns

### Brand campaign poster
- Headline must read exactly X → **Route 2 (GPT Image 2)**, `size: "1536_1024"` for landscape
- Use form: `"the headline reads exactly '…' in [font weight] [font family]"`

### Photoreal portrait
- **Route 4 (Seedream 5 Lite)** for skin tones; or **Route 1 (FLUX 2 Klein 9B)** with `steps: 25` and explicit lens/lighting language

### Storyboard frame batch (10+ concepts)
- **Route 1 (FLUX 2 Klein 4B)**, `steps: 6`, fixed `seed` per character to keep identity drift low

### Multilingual launch creatives (same layout, multiple languages)
- **Route 2 (GPT Image 2)**, one call per language, identical layout phrasing, swap only the quoted headline string

### Concept moodboard (10 quick variants)
- **Route 3 (Nano Banana 2)**, `resolution: "0.5K"`, `num_images: 4`, vary `seed` across runs

### Generate then refine (same brand)
- **Route 4 (Seedream 5 Lite t2i)** → **Seedream 5 Lite edit** for follow-up tweaks. Identity stays consistent across the pair.

### Logo with locked brand colors
- **Route 2 (GPT Image 2)** for the headline, then **Nano Banana 2 Edit** (i2i Route A) for color-correction passes if the hex isn't exact

---
