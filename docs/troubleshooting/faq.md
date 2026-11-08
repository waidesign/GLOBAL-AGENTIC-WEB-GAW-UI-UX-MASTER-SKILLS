# GAW Troubleshooting & FAQ

### 1. `gaw` command not recognized
Run `npm link` inside the folder where you cloned GAW. Ensure your global npm bin directory is in your system's `PATH`.

### 2. Can I use GAW without installing the CLI globally?
Yes:
1. Run commands via `node ./bin/gaw.js <command>`.
2. Connect agents via the MCP server at `node ./mcp/server.js`.
3. Copy and paste `NEW-PROJECT-MASTER-PROMPT.md` directly into your AI assistant.

### 3. Does Agentation get bundled in production?
No. Agentation is installed strictly as a development dependency and guarded with `import.meta.env.DEV` or `process.env.NODE_ENV === 'development'`, ensuring it is completely tree-shaken from production builds.

### 4. Do I need Graphify?
No, it is optional but recommended. Graphify builds a code map that AI agents can query instead of reading whole files, which usually saves tokens. Without it, GAW works normally and skips the code map. `gaw doctor` shows whether it is installed.

To add it, run `gaw setup`. It installs Graphify with [uv](https://docs.astral.sh/uv/), which also sets up Python 3.10+, and asks before installing uv if uv is missing. To install it yourself: `uv tool install graphifyy` (or, with Python 3.10+, `pip install graphifyy`). Then run `gaw graph` in your project.

### 5. Does GAW install anything without asking?
No. `gaw init` explains Graphify and asks first, and asks again before running the uv install script. Non-interactive runs (`--yes`, CI, the MCP server) never install anything, unless you pass `gaw init --install-graphify` or `gaw setup --yes`.

### 6. Graphify is installed but `graphify` is not found in my terminal
uv puts tools in `~/.local/bin` (Windows: `%USERPROFILE%\.local\bin`), which reaches your `PATH` only in new terminals. GAW looks in that folder directly, so `gaw` commands work right away. For the `graphify` command itself, open a new terminal.

### 7. Graphify failed to build the graph
GAW reports a warning and continues. Update Graphify with `uv tool upgrade graphifyy` (or `pip install -U graphifyy`): GAW relies on its `extract --code-only` and `cluster-only` commands. Also check that your source folders are not excluded by `.gitignore` or `.graphifyignore`.
