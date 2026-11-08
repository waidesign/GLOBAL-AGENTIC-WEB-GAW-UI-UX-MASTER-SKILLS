<!-- Part of the ai-video-generation skill, moved here from SKILL.md by GAW (content unchanged). Paths below are relative to the skill folder. -->

## i2v Route B: Veo 3-1 — Google's flagship

**Model**: `google-deepmind/veo-3-1/image-to-video` (or `/fast/image-to-video`)
**Catalog**: [veo-3-1 i2v](https://www.runcomfy.com/models/google-deepmind/veo-3-1/image-to-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`veo-3` collection](https://www.runcomfy.com/models/collections/veo-3?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation)

Pick Veo when physics / realism / object permanence matters most. Veo 3-1 supports both 8s clips and longer with the **extend-video** companion endpoint.

### Invoke

```bash
runcomfy run google-deepmind/veo-3-1/image-to-video \
  --input '{
    "image_url": "https://your-cdn.example/product.jpg",
    "prompt": "The bottle slowly rotates 180 degrees on a marble surface, soft daylight, no other motion."
  }' \
  --output-dir ./out
```

### Prompting tips

- **Veo respects physics** — "the bottle rotates 180 degrees" gets exactly 180°.
- **Object permanence is strong** — say "no other motion" and other elements stay locked.
- For audio-enabled i2v, see Route A (HappyHorse) instead — Veo's audio path lives elsewhere in the catalog.

---

## i2v Route C: Kling 3.0 — multi-shot identity, 4K

**Model**: `kling/kling-3.0/{4k,pro,standard}/image-to-video`
**Catalog**: [`kling` collection](https://www.runcomfy.com/models/collections/kling?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation)

Three tiers — pick by quality / cost trade-off:

| Tier | Endpoint | When |
|---|---|---|
| 4K | `kling/kling-3.0/4k/image-to-video` | Hero shots, final delivery at 4K |
| Pro | `kling/kling-3.0/pro/image-to-video` | Default — high quality at lower cost |
| Standard | `kling/kling-3.0/standard/image-to-video` | Concepting, drafts |

### Invoke

```bash
runcomfy run kling/kling-3.0/pro/image-to-video \
  --input '{
    "image_url": "https://your-cdn.example/character.jpg",
    "prompt": "The character walks toward the camera, soft handheld feel, end on a medium close-up."
  }' \
  --output-dir ./out
```

### Prompting tips

- **Multi-shot consistency** — describe a beat sequence ("walks toward camera, then a cut to medium close-up") and Kling holds identity across the cut.
- **Camera language**: "handheld", "Steadicam push", "static tripod" — honored.

---

## Other models in the catalog

| Endpoint | When |
|---|---|
| [`minimax/hailuo-2-3/pro/image-to-video`](https://www.runcomfy.com/models/minimax/hailuo-2-3/pro/image-to-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`/standard/image-to-video`](https://www.runcomfy.com/models/minimax/hailuo-2-3/standard/image-to-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) | MiniMax Hailuo — natural motion, strong on real-world subjects |
| [`bytedance/dreamina-3-0/pro/image-to-video`](https://www.runcomfy.com/models/bytedance/dreamina-3-0/pro/image-to-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) | Dreamina — illustrative / concept art lean |
| [`bytedance/seedance-1-0/pro/fast/image-to-video`](https://www.runcomfy.com/models/bytedance/seedance-1-0/pro/fast/image-to-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) | Seedance 1-0 — cheaper baseline |
| [`kling/kling-video-o1/standard`](https://www.runcomfy.com/models/kling/kling-video-o1/standard?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) | Kling Video O1 — reasoning-style video model |
| [`kling/kling-2-6/motion-control-pro`](https://www.runcomfy.com/models/kling/kling-2-6/motion-control-pro?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) | Transfer motion from a reference video onto a target character |

Schemas live on each model page — pass field set through the CLI verbatim.

---

## Common patterns

### Social-media vertical (TikTok / Reels)
- **HappyHorse 1.0 i2v** with `aspect_ratio: "9:16"`, `duration: 6`, audio described inline

### Brand product spin
- **Veo 3-1 i2v** with `"rotates 180 degrees, no other motion"` — Veo respects physics

### Cinematic ad frame
- **Seedance v2 Pro** with 21:9 aspect, lens + grade language in prompt

### Multi-shot character narrative
- **Kling 3.0 Pro i2v** — describe beats ("walks in → close-up → looks at viewer")

### Dialog lip-sync
- **Wan 2-7** with `audio_url` pointing at your voiceover MP3

### Extend / continue an existing video
- **Veo 3-1 Extend** — see [`video-extend`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/video-extend) skill

### Talking-head / avatar
- See the [`ai-avatar-video`](https://www.skills.sh/agentspace-so/runcomfy-agent-skills/ai-avatar-video) skill for OmniHuman + HappyHorse + Wan composition

---

## Browse the full catalog

- [All video models](https://www.runcomfy.com/models?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) — every endpoint with its API schema tab
- [`kling`](https://www.runcomfy.com/models/collections/kling?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`seedance`](https://www.runcomfy.com/models/collections/seedance?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`veo-3`](https://www.runcomfy.com/models/collections/veo-3?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`hailuo`](https://www.runcomfy.com/models/collections/hailuo?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`wan-models`](https://www.runcomfy.com/models/collections/wan-models?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`dreamina`](https://www.runcomfy.com/models/collections/dreamina?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) brand collections
- [`/models/feature/lip-sync`](https://www.runcomfy.com/models/feature/lip-sync?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`/feature/character-swap`](https://www.runcomfy.com/models/feature/character-swap?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) · [`/feature/upscale-video`](https://www.runcomfy.com/models/feature/upscale-video?utm_source=skills.sh&utm_medium=skill&utm_campaign=ai-video-generation) capability tags

---
