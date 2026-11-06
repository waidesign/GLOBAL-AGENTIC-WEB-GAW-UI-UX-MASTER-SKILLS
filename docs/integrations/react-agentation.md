# React & Agentation Visual Feedback Integration

## Purpose
Agentation enables interactive visual feedback directly on running development web applications.

## Behavior
- Automatically installed on React, Next.js, and Remix projects.
- Injected with development-only runtime guards (`import.meta.env.DEV` or `process.env.NODE_ENV === 'development'`).
- Strictly excluded from production bundles.

