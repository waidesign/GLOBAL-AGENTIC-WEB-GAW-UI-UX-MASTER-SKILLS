# Graphify Codebase Graph Integration

## Purpose
GAW uses the official [Graphify](https://github.com/safishamsi/graphify) CLI to build a structural relationship graph of a project's code: files, functions, classes, imports and calls. Agents query this graph instead of reading many files, which cuts token use.

## Optional, recommended
Graphify is optional. Without it, GAW works normally and skips the code map.

- `gaw init` explains Graphify and asks whether to install it. If uv is missing, it asks separately before running Astral's official uv install script.
- `gaw setup` installs it at any time.
- `--install-graphify` installs without asking. `--no-graphify` skips the question.
- Non-interactive runs (`--yes`, CI, the MCP server) never install anything.
- `gaw doctor` shows whether it is installed.

Manual install, with [uv](https://docs.astral.sh/uv/getting-started/installation/), which sets up Python 3.10+:
```bash
uv tool install graphifyy
```

GAW finds Graphify on `PATH` or in uv's tool folder (`~/.local/bin`), so it works right after installing, without opening a new terminal.

## How GAW runs it
```bash
graphify extract . --code-only     # local AST parsing, no LLM calls or API keys
graphify cluster-only . --no-label # communities, GRAPH_REPORT.md, graph.html
```

## Outputs (`graphify-out/`)
- `graph.json`: Machine-readable graph of nodes and relationships (`links`).
- `graph.html`: Interactive graph explorer.
- `GRAPH_REPORT.md`: Architecture report summarizing God Nodes and communities.

Add `graphify-out/` to `.gitignore`. Use `.graphifyignore` (same syntax as `.gitignore`) to keep folders out of the graph.
