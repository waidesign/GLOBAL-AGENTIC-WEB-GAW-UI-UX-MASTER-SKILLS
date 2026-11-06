# Contributing to Global Agentic Web (GAW)

Thank you for your interest in contributing to the Global Agentic Web ecosystem!

## 1. How to Contribute

- **Proposing New Skills**: Submit new UI/UX or engineering skills adhering to the [Skill Authoring Guide](docs/skills/authoring-guide.md). Every skill must have complete frontmatter metadata (`id`, `name`, `category`, `description`, `author`, `license`, `version`, `tags`, `frameworks`).
- **Reporting Issues**: Open a GitHub Issue detailing steps to reproduce, expected vs. actual behavior, and environment (`node -v`, OS).
- **Submitting Pull Requests**: Follow the development workflow below.

## 2. Development Setup

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

## 4. Code Guidelines

- **No Magic Values**: Never introduce hardcoded styling or magic numbers. Adhere strictly to [`brain/coding-preferences.md`](brain/coding-preferences.md).
- **Anti-Slop Discipline**: Adhere to [`brain/design-principles.md`](brain/design-principles.md).
- **Backward Compatibility**: Preserve existing project configurations and ensure idempotent initialization.
- **Commit Messages**: Use Conventional Commits (e.g. `feat: add oklch color validation`, `fix: prevent duplicate agentation imports`).

## 5. Licensing

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

