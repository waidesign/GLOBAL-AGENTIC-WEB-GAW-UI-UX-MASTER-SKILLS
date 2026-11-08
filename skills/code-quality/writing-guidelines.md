---
id: "writing-guidelines"
name: "writing-guidelines"
category: "code-quality"
description: "Review docs/prose for Writing Guidelines compliance. Use when asked to \"review my docs\", \"check writing style\", \"audit prose\", \"review docs voice and tone\", or \"check this page against the writing handbook\"."
author: "vercel"
license: "MIT"
version: "1.0.0"
tags: ["writing-guidelines","code-quality","skills.sh"]
frameworks: ["any"]
dependencies: []
relatedSkills: []
lastVerified: "2026-11-08"
---

# Writing Guidelines

Review files for compliance with Writing Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/writing-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
