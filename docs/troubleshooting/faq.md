# GAW Troubleshooting & FAQ

### 1. `gaw` command not recognized
Run `npm link` inside the `e:/master-skills` repository directory. Ensure your global npm bin directory is in your system's `PATH`.

### 2. Can I use GAW without installing the CLI globally?
Yes:
1. Run commands via `node ./bin/gaw.js <command>`.
2. Connect agents via the MCP server at `node ./mcp/server.js`.
3. Copy and paste `NEW-PROJECT-MASTER-PROMPT.md` directly into your AI assistant.

### 3. Does Agentation get bundled in production?
No. Agentation is installed strictly as a development dependency and guarded with `import.meta.env.DEV` or `process.env.NODE_ENV === 'development'`, ensuring it is completely tree-shaken from production builds.

### 4. What if Graphify is not installed on my system?
GAW features a built-in deterministic AST/import dependency graph generator that creates `graph.json`, `graph.html`, and `GRAPH_REPORT.md` locally with zero external network or API dependencies.

