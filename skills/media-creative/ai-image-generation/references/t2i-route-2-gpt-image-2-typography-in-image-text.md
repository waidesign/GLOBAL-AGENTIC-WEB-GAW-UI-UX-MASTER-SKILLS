<!-- Part of the ai-image-generation skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## t2i Route 2: GPT Image 2 — typography & in-image text

**Model**: `openai/gpt-image-2/text-to-image`
**Catalog**: [runcomfy.com/models/openai/gpt-image-2](https://www.runcomfy.com/models/openai/gpt-image-2/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

### Schema

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `prompt` | string | yes | — | Quote in-image text exactly with `"…"` |
| `size` | enum | no | `1024_1024` | `1024_1024` (1:1), `1024_1536` (2:3 portrait), `1536_1024` (3:2 landscape) — **only these three** |

### Invoke

**Logo / poster with exact headline:**

```bash
runcomfy run openai/gpt-image-2/text-to-image \
  --input '{
    "prompt": "Minimal product poster. Centered bold headline reads exactly \"AURORA — Spring 2026\" in clean white sans-serif on a deep navy background. Below the headline a small line in monospace reads \"runs on water\". 3:2 layout.",
    "size": "1536_1024"
  }' \
  --output-dir ./out
```

**Multilingual:**

```bash
runcomfy run openai/gpt-image-2/text-to-image \
  --input '{
    "prompt": "Japanese magazine cover. Vertical headline reads exactly \"今日のおすすめ\" in bold Japanese kana, right-edge alignment, photoreal portrait of a woman in a kimono.",
    "size": "1024_1536"
  }' \
  --output-dir ./out
```

### Prompting tips

- **Quote in-image text exactly.** `"the sign reads exactly 'CLOSED'"` — without the literal quote the model paraphrases.
- **Name the script for non-Latin text**: `"Japanese kana"`, `"Cyrillic"`, `"Arabic right-to-left"`. Without this it falls back to romanization.
- **Layout language honored**: `"top-left"`, `"centered"`, `"two-line stacked"`, `"baseline aligned"`.
- **Only 3 sizes.** Don't pass arbitrary widths.

---

## t2i Route 3: Nano Banana 2 — speed iteration

**Model**: `google/nano-banana-2/text-to-image`
**Catalog**: [runcomfy.com/models/google/nano-banana-2](https://www.runcomfy.com/models/google/nano-banana-2?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [`nano-banana` collection](https://www.runcomfy.com/models/collections/nano-banana?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

### Schema

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `prompt` | string | yes | — | Subject-first description |
| `num_images` | int | no | 1 | 1–4. Use 4 for ideation rounds |
| `seed` | int | no | 0 | Reuse for reproducibility |
| `aspect_ratio` | enum | no | `auto` | `auto`, `21:9`, `16:9`, `3:2`, `4:3`, `5:4`, `1:1`, `4:5`, `3:4`, `2:3`, `9:16` |
| `resolution` | enum | no | `1K` | `0.5K` (drafts), `1K` (default), `2K` (final), `4K` (max) |
| `output_format` | enum | no | `png` | `png`, `jpeg`, `webp` |
| `safety_tolerance` | int | no | 4 | 1 (strict) – 6 (permissive) |
| `enable_web_search` | bool | no | false | Adds web grounding (extra cost + latency) |

### Invoke

**Default draft:**

```bash
runcomfy run google/nano-banana-2/text-to-image \
  --input '{"prompt": "A coffee mug on marble counter, top-down warm morning light"}' \
  --output-dir ./out
```

**4-up batch for ideation:**

```bash
runcomfy run google/nano-banana-2/text-to-image \
  --input '{
    "prompt": "Three product photos of a ceramic coffee mug on a marble counter, warm morning light, top-down angle, minimal styling",
    "num_images": 4,
    "aspect_ratio": "1:1",
    "resolution": "0.5K"
  }' \
  --output-dir ./out
```

### Prompting tips

- **Subject-first declarative.** "A coffee mug on marble" beats "Generate a creative shot of a mug".
- **`enable_web_search: true`** when the prompt names a real product, place, or person whose appearance must match reality (logos, landmarks).
- **Drop to `0.5K` for ideation, jump to `2K`+ only for finals** — `4K` ~16× the cost of `0.5K`.

---

## t2i Route 4: Seedream 5 / 4-5 — photoreal flagship

**Models**: [`bytedance/seedream-5/lite/text-to-image`](https://www.runcomfy.com/models/bytedance/seedream-5/lite/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation) · [`bytedance/seedream-4-5/text-to-image`](https://www.runcomfy.com/models/bytedance/seedream-4-5/text-to-image?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)
**Collection**: [`seedream`](https://www.runcomfy.com/models/collections/seedream?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-image-generation)

### Invoke

```bash
runcomfy run bytedance/seedream-5/lite/text-to-image \
  --input '{"prompt": "85mm portrait of a woman by a window, soft natural light, shallow depth of field, photoreal"}' \
  --output-dir ./out
```

Field schema is on the model page — pass through the CLI verbatim.

### When to pick Seedream

- **Photoreal portraits / product** — realistic skin tones and natural lighting
- **East Asian aesthetic / fashion** — strong on these subject categories
- **Cinematic frames** — picks up lens and lighting language well
- **vs FLUX 2**: Seedream skews more photoreal; FLUX skews more design/illustration

---
