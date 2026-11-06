# Skill Authoring Guide

## Frontmatter Requirements
Every skill markdown file in `skills/<category>/<id>.md` must include YAML frontmatter:
```yaml
---
id: "my-skill-id"
name: "Human Readable Skill Name"
category: "design-systems"
description: "One or two sentences explaining when an agent should use this skill."
author: "author-or-org"
license: "MIT"
version: "1.0.0"
tags: ["tag1", "tag2"]
frameworks: ["react", "nextjs"]
dependencies: []
relatedSkills: []
---
```

## Content Rules
- Begin with clear constraints and usage guidelines.
- Provide concrete fixes, rules, or checklists rather than generic prose.
- Clearly identify forbidden practices (e.g. animating layout properties).

