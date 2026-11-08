# Contributing to Global Agentic Web (GAW)

Thank you for your interest in contributing to the Global Agentic Web ecosystem!

## 1. How to Contribute

- **Proposing New Skills**: Submit new UI/UX or engineering skills adhering to the [Skill Authoring Guide](docs/skills/authoring-guide.md). Skills follow the [GAW Skill Standard (GSS)](docs/gss/spec.md): a folder with `SKILL.md` (standard Agent Skills frontmatter) and an optional `gaw.json`. Run `gaw skills lint` and `gaw skills index` before submitting. Imported skills must keep their original author's license.
- **Reporting Issues**: Open a GitHub Issue detailing steps to reproduce, expected vs. actual behavior, and environment (`node -v`, OS).
- **Submitting Pull Requests**: Follow the development workflow below.

## 2. Development Setup

Prerequisites: Node.js >= 18. Graphify is optional: without it, the test that builds a real Graphify code map is skipped. To run every test, install it (with [uv](https://docs.astral.sh/uv/getting-started/installation/), which sets up Python 3.10+):

```bash
uv tool install graphifyy
graphify --version
```

```bash
git clone https://github.com/<your-username>/global-agentic-web.git
cd global-agentic-web
npm install
npm link
```

## 3. Running Tests

Before submitting a PR, make sure all tests pass:
```bash
npm test
```

If your change touches skills, skill search or recommendations, also run the skill selection benchmark and include the before/after scores in your PR:
```bash
npm run eval
```
To add a benchmark case, edit `eval/cases/skill-selection.json`. Cases with an empty `relevant` list check that GAW suggests nothing when no skill fits.

## 4. Code Guidelines

- **No Magic Values**: Never introduce hardcoded styling or magic numbers. Adhere strictly to [`brain/coding-preferences.md`](brain/coding-preferences.md).
- **Anti-Slop Discipline**: Adhere to [`brain/design-principles.md`](brain/design-principles.md).
- **Backward Compatibility**: Preserve existing project configurations and ensure idempotent initialization.
- **Commit Messages**: Use Conventional Commits (e.g. `feat: add oklch color validation`, `fix: prevent duplicate agentation imports`).

## 5. Licensing

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

