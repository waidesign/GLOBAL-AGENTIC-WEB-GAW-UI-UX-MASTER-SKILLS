# GAW Skills Taxonomy

Guided Agent Workflow organizes its official skills into categories that span many fields, not only interfaces. A skill's category is a folder under `skills/` and the `gaw-category` in its `SKILL.md`; browse one with `gaw skills <category>`.

## Engineering & delivery
- `architecture`: system design, specs, tickets, domain modeling, implementation planning.
- `code-quality`: code review, guardrails, linting, writing standards.
- `testing`: test-driven development, unit, integration and end-to-end testing.
- `debugging`: reproducing, isolating and fixing hard bugs and regressions.
- `database`: Postgres and Supabase schema, queries, security and performance.
- `cloud-infra`: Azure, Kubernetes (AKS), Vercel and Google Cloud deployment, diagnostics and cost.
- `workflow`: agent workflows, handoffs, triage, planning and agent frameworks.

## Content & media
- `documents`: Word, PDF, PowerPoint and Excel files.
- `media-creative`: image, video and music generation, programmatic video (HyperFrames, Remotion).
- `general`: writing, teaching, communication and other cross-field skills.

## Interfaces (for projects with a UI)
- `ui-ux`: user flows, landing pages, pricing pages, UI audits.
- `frontend`, `frontend-frameworks`, `react`: frontend implementation and React/Next.js practices.
- `design-systems`: design tokens, governance and migrations.
- `components`, `systems`, `shadcn-ui`: component patterns, baseline UI rules, Radix/shadcn.
- `typography`, `color`: type scales, font choices, OKLCH palettes and contrast.
- `animation-motion`, `micro-interactions`, `interaction`: motion systems, feedback and scroll behavior.
- `accessibility`: WCAG compliance, ARIA and keyboard navigation.
- `performance`: rendering and animation performance.
- `seo`: metadata, Open Graph and structured data.
- `3d`: Three.js and WebGL scenes.

New categories can be added with `gaw skills add --category <name>`; keep names short, lowercase and hyphenated.
