# Agentation Visual Feedback Integration

## Overview
Connects React-based projects to [Agentation](https://agentation.com) for development-time point-and-click visual feedback.

## Rules
- Installed strictly as a dev dependency.
- Injected exclusively with dev runtime guards (`import.meta.env.DEV` or `process.env.NODE_ENV === 'development'`).
- Never installed in non-React applications.

