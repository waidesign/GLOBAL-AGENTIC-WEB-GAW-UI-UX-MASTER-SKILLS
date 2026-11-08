import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import os from 'node:os';
import { GraphifyManager } from '../graphify-manager/GraphifyManager.js';

export class ProjectDetector {
  static detect(targetDir = process.cwd()) {
    const dir = path.resolve(targetDir);
    const osType = os.platform();
    const projectName = path.basename(dir);

    // Read package.json if present
    const pkgPath = path.join(dir, 'package.json');
    let pkg = null;
    if (fs.existsSync(pkgPath)) {
      try {
        pkg = readJsonFile(pkgPath);
      } catch (err) {
        pkg = null;
      }
    }

    const allDependencies = {
      ...(pkg?.dependencies || {}),
      ...(pkg?.devDependencies || {})
    };

    // Detect package manager
    let packageManager = 'npm';
    if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) packageManager = 'pnpm';
    else if (fs.existsSync(path.join(dir, 'bun.lockb')) || fs.existsSync(path.join(dir, 'bun.lock'))) packageManager = 'bun';
    else if (fs.existsSync(path.join(dir, 'yarn.lock'))) packageManager = 'yarn';
    else if (fs.existsSync(path.join(dir, 'package-lock.json'))) packageManager = 'npm';

    // Detect languages from the project's own files (not assumed: GAW works for any kind of project)
    const has = (file) => fs.existsSync(path.join(dir, file));
    let rootFiles = [];
    try { rootFiles = fs.readdirSync(dir); } catch { /* unreadable folder */ }
    const hasTypeScript = has('tsconfig.json') || Object.keys(allDependencies).some(d => d.includes('typescript'));
    const languages = [];
    if (hasTypeScript) languages.push('TypeScript');
    else if (pkg || has('jsconfig.json')) languages.push('JavaScript');
    const pythonFiles = ['pyproject.toml', 'requirements.txt', 'setup.py', 'Pipfile'].filter(has);
    if (pythonFiles.length) languages.push('Python');
    if (has('go.mod')) languages.push('Go');
    if (has('Cargo.toml')) languages.push('Rust');
    if (has('pom.xml') || has('build.gradle') || has('build.gradle.kts')) languages.push('Java/Kotlin');
    if (rootFiles.some(f => /\.(csproj|sln)$/i.test(f))) languages.push('C#');

    // Detect framework. UI frameworks first; then frontend signs; then server and other stacks.
    let framework = 'unknown';
    let isReact = false;

    if (allDependencies['next']) {
      framework = 'nextjs';
      isReact = true;
    } else if (allDependencies['@remix-run/react']) {
      framework = 'remix';
      isReact = true;
    } else if (allDependencies['react'] || allDependencies['react-dom']) {
      if (allDependencies['vite'] || fs.existsSync(path.join(dir, 'vite.config.ts')) || fs.existsSync(path.join(dir, 'vite.config.js'))) {
        framework = 'react-vite';
      } else {
        framework = 'react';
      }
      isReact = true;
    } else if (allDependencies['nuxt'] || allDependencies['vue']) {
      framework = allDependencies['nuxt'] ? 'nuxt' : 'vue';
    } else if (allDependencies['@sveltejs/kit'] || allDependencies['svelte']) {
      framework = 'svelte';
    } else if (allDependencies['@angular/core']) {
      framework = 'angular';
    } else if (has('index.html') || allDependencies['vite'] || allDependencies['webpack'] || allDependencies['parcel']
      || has('vite.config.js') || has('vite.config.ts') || has('webpack.config.js')) {
      framework = 'plain-frontend';
    } else if (pkg) {
      const server = ['@nestjs/core', 'express', 'fastify', 'koa', 'hono'].find(d => allDependencies[d]);
      framework = server ? server.replace('@nestjs/core', 'nestjs') : 'node';
    } else if (pythonFiles.length) {
      const text = pythonFiles.map(f => { try { return fs.readFileSync(path.join(dir, f), 'utf8').toLowerCase(); } catch { return ''; } }).join('\n');
      framework = ['django', 'fastapi', 'flask'].find(f => text.includes(f)) || 'python';
    } else if (languages.length) {
      framework = languages[0].toLowerCase();
    }

    // Detect build system
    let buildSystem = 'unknown';
    if (framework === 'nextjs') buildSystem = 'next';
    else if (fs.existsSync(path.join(dir, 'vite.config.ts')) || fs.existsSync(path.join(dir, 'vite.config.js')) || allDependencies['vite']) buildSystem = 'vite';
    else if (fs.existsSync(path.join(dir, 'webpack.config.js')) || allDependencies['webpack']) buildSystem = 'webpack';

    // Detect design systems & UI libs
    const uiLibraries = [];
    if (allDependencies['tailwindcss'] || fs.existsSync(path.join(dir, 'tailwind.config.js')) || fs.existsSync(path.join(dir, 'tailwind.config.ts'))) {
      uiLibraries.push('tailwindcss');
    }
    if (fs.existsSync(path.join(dir, 'components.json')) || allDependencies['@radix-ui/react-slot']) {
      uiLibraries.push('shadcn-ui');
    }
    if (allDependencies['framer-motion'] || allDependencies['motion']) {
      uiLibraries.push('motion');
    }
    if (allDependencies['three'] || allDependencies['@react-three/fiber']) {
      uiLibraries.push('threejs');
    }

    // Detect testing framework
    const testingFrameworks = [];
    if (allDependencies['vitest']) testingFrameworks.push('vitest');
    if (allDependencies['jest']) testingFrameworks.push('jest');
    if (allDependencies['@playwright/test']) testingFrameworks.push('playwright');
    if (allDependencies['cypress']) testingFrameworks.push('cypress');

    // Existing AI configs
    const aiConfigs = [];
    if (fs.existsSync(path.join(dir, 'CLAUDE.md'))) aiConfigs.push('claude-code');
    if (fs.existsSync(path.join(dir, '.cursorrules')) || fs.existsSync(path.join(dir, '.cursor'))) aiConfigs.push('cursor');
    if (fs.existsSync(path.join(dir, 'AGENTS.md'))) aiConfigs.push('codex');
    if (fs.existsSync(path.join(dir, 'GEMINI.md'))) aiConfigs.push('gemini-cli');
    if (fs.existsSync(path.join(dir, '.github', 'copilot-instructions.md'))) aiConfigs.push('github-copilot');

    // Integrations status
    const hasProjectBrain = fs.existsSync(path.join(dir, 'ai-brain'));
    const hasAgentation = Boolean(allDependencies['agentation']);
    const hasGraphify = GraphifyManager.locateGraph(dir) !== null;
    const hasGit = fs.existsSync(path.join(dir, '.git'));

    return {
      projectPath: dir,
      projectName: pkg?.name || projectName,
      os: osType,
      hasGit,
      packageManager,
      languages,
      framework,
      isReact,
      buildSystem,
      uiLibraries,
      testingFrameworks,
      dependencies: Object.keys(allDependencies),
      aiConfigs,
      hasProjectBrain,
      hasAgentation,
      hasGraphify
    };
  }
}

export default ProjectDetector;

