# Agentation Integration Templates

These templates illustrate the safe, dev-only integration of the [Agentation](https://agentation.com) visual feedback toolbar into React applications.

## Safety Principles
- **Dev-Only Execution**: The Agentation overlay must NEVER be included in production bundles.
- **Tree-Shaking**: Controlled via `import.meta.env.DEV` (Vite) or `process.env.NODE_ENV === 'development'` (Next.js/Webpack).
- **Framework Detection**: Agentation is installed exclusively in React environments.

