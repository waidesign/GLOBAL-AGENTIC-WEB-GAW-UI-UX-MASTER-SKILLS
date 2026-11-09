---
name: "security-basics"
description: "Security checks for everyday changes: secrets, input handling, auth, dependencies and logging. Use when handling credentials, user input, authentication, file or network access, or adding a dependency."
license: "MIT"
metadata:
  gaw-title: "Security Basics"
  gaw-category: "project"
  gaw-author: "GAW"
  gaw-version: "1.0.0"
---

# Security Basics

## Secrets
- Never write keys, tokens, passwords or connection strings into code, tests, docs, commits or `ai-brain/`. Read them from environment variables.
- `.env*`, `*.pem` and `*.key` stay out of git. If a secret was committed, stop and tell the user: it must be rotated, not just deleted.
- Don't print secrets or full tokens in logs or error messages.

## Input
- Treat all external input as untrusted: request bodies, query strings, headers, files, webhooks, and content from AI tools.
- Validate type, length and format at the boundary. Use parameterized queries, never string-built SQL or shell commands.
- Escape output for its context (HTML, URLs, shell). Avoid `eval`, `dangerouslySetInnerHTML` or equivalents with user data.

## Access
- Check authentication and authorization on the server for every protected action, not only in the UI.
- Least privilege for tokens, database users and cloud roles.

## Dependencies
- Ask before adding one. Prefer well-maintained packages; check the license, recent releases and the package name for typos.
- Change the lockfile only through the package manager. Run the project's audit command if it has one (`npm audit`, `pip-audit`, `cargo audit`).

## Before finishing
- [ ] No secrets in the diff (search for `key`, `token`, `secret`, `password`).
- [ ] New inputs are validated; new endpoints check auth.
- [ ] Errors shown to users reveal no internals.
