# Graphify Codebase Graph Integration

## Overview
GAW uses the official Graphify CLI (optional, recommended; Python 3.10+) to build the project's code graph in `graphify-out/`:
- `graph.json`
- `graph.html`
- `GRAPH_REPORT.md`

GAW runs `graphify extract . --code-only` and `graphify cluster-only . --no-label`. Code-only mode parses code locally, with no LLM calls or API keys.

Helps AI agents locate central hubs (God Nodes) and dependencies with minimal token consumption.

Install it with `gaw setup` (asks before installing anything), or manually with `uv tool install graphifyy`. Without it, GAW skips the code map.

See [docs/integrations/graphify.md](../../docs/integrations/graphify.md) for details.
