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
    const hasTypeScript = has('tsconfig.json') || Object.keys(allDependencies).some(d => d.includes('typescript'))
      || ProjectDetector.hasSourceFiles(dir, /\.(ts|tsx|mts|cts)$/i);
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

    const commands = ProjectDetector.detectCommands(dir, { pkg, packageManager, languages, pythonFiles, has });
    const lockfiles = LOCKFILES.filter(has);
    const hasUi = UI_FRAMEWORKS.has(framework) || uiLibraries.length > 0;

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
      hasUi,
      testingFrameworks,
      commands,
      lockfiles,
      dependencies: Object.keys(allDependencies),
      aiConfigs,
      hasProjectBrain,
      hasAgentation,
      hasGraphify
    };
  }

  /** True when src/, app/ or lib/ (two levels deep) has a file matching `pattern`. Type declarations don't count. */
  static hasSourceFiles(dir, pattern) {
    const look = (folder, depth) => {
      let entries = [];
      try { entries = fs.readdirSync(folder, { withFileTypes: true }); } catch { return false; }
      for (const e of entries) {
        if (e.isFile() && pattern.test(e.name) && !e.name.endsWith('.d.ts')) return true;
        if (e.isDirectory() && depth < 2 && !e.name.startsWith('.') && e.name !== 'node_modules' && look(path.join(folder, e.name), depth + 1)) return true;
      }
      return false;
    };
    return ['src', 'app', 'lib'].some(f => look(path.join(dir, f), 0));
  }

  /**
   * The project's own commands for dev, build, test, lint and typecheck, from
   * package.json scripts or the usual tool for the language. Missing ones are null.
   */
  static detectCommands(dir, { pkg, packageManager, languages, pythonFiles, has }) {
    const commands = { dev: null, build: null, test: null, lint: null, typecheck: null };
    const scripts = pkg?.scripts || {};
    const run = (name) => {
      if (packageManager === 'npm') return name === 'test' ? 'npm test' : `npm run ${name}`;
      return packageManager === 'bun' ? `bun run ${name}` : `${packageManager} ${name}`;
    };
    const pick = (names) => names.find(n => typeof scripts[n] === 'string' && !NPM_PLACEHOLDER_TEST.test(scripts[n]));
    const scriptFor = {
      dev: pick(['dev', 'start', 'serve']),
      build: pick(['build']),
      test: pick(['test', 'test:unit']),
      lint: pick(['lint']),
      typecheck: pick(['typecheck', 'type-check', 'check-types', 'tsc'])
    };
    for (const [key, name] of Object.entries(scriptFor)) if (name) commands[key] = run(name);

    if (languages.includes('Python')) {
      const text = pythonFiles.map(f => { try { return fs.readFileSync(path.join(dir, f), 'utf8').toLowerCase(); } catch { return ''; } }).join('\n');
      if (!commands.test && (text.includes('pytest') || has('tests') || has('pytest.ini'))) commands.test = 'pytest';
      if (!commands.lint && text.includes('ruff')) commands.lint = 'ruff check .';
      if (!commands.typecheck && text.includes('mypy')) commands.typecheck = 'mypy .';
    }
    if (languages.includes('Go')) {
      commands.build ??= 'go build ./...';
      commands.test ??= 'go test ./...';
      commands.lint ??= 'go vet ./...';
    }
    if (languages.includes('Rust')) {
      commands.build ??= 'cargo build';
      commands.test ??= 'cargo test';
      commands.lint ??= 'cargo clippy';
    }

    // Makefile targets fill what is still missing
    if (has('Makefile')) {
      let makefile = '';
      try { makefile = fs.readFileSync(path.join(dir, 'Makefile'), 'utf8'); } catch { /* unreadable */ }
      for (const key of Object.keys(commands)) {
        if (!commands[key] && new RegExp(`^${key}\\s*:`, 'm').test(makefile)) commands[key] = `make ${key}`;
      }
    }
    return commands;
  }
}

// `npm init` writes a test script that only fails; it is not a real test command
const NPM_PLACEHOLDER_TEST = /no test specified/i;
const LOCKFILES = [
  'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'bun.lock',
  'poetry.lock', 'Pipfile.lock', 'uv.lock', 'Cargo.lock', 'go.sum', 'composer.lock', 'Gemfile.lock'
];
export const UI_FRAMEWORKS = new Set(['nextjs', 'remix', 'react-vite', 'react', 'vue', 'nuxt', 'svelte', 'angular', 'plain-frontend']);

export default ProjectDetector;

