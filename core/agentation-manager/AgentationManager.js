import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { execSync } from 'node:child_process';

export class AgentationManager {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
  }

  getInstallCommand(packageManager = 'npm') {
    switch (packageManager) {
      case 'pnpm': return 'pnpm add -D agentation';
      case 'yarn': return 'yarn add -D agentation';
      case 'bun': return 'bun add -d agentation';
      case 'npm':
      default: return 'npm install agentation -D';
    }
  }

  installDependency(projectPath = this.projectRoot, packageManager = 'npm', dryRun = false) {
    const pkgPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      return { installed: false, reason: 'No package.json found' };
    }

    try {
      const pkg = readJsonFile(pkgPath);
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps['agentation']) {
        return { installed: true, alreadyPresent: true, reason: 'agentation already in package.json' };
      }

      if (dryRun) {
        return { installed: true, dryRun: true, command: this.getInstallCommand(packageManager) };
      }

      const cmd = this.getInstallCommand(packageManager);
      execSync(cmd, { cwd: projectPath, stdio: 'ignore' });
      return { installed: true, command: cmd };
    } catch (err) {
      return { installed: false, error: err.message };
    }
  }

  findRootComponent(projectPath = this.projectRoot, framework = 'react') {
    const candidates = [
      'src/App.tsx',
      'src/App.jsx',
      'src/app/layout.tsx',
      'src/app/layout.jsx',
      'app/layout.tsx',
      'app/layout.jsx',
      'pages/_app.tsx',
      'pages/_app.jsx',
      'src/main.tsx',
      'src/main.jsx',
      'src/index.tsx',
      'src/index.jsx'
    ];

    for (const rel of candidates) {
      const full = path.join(projectPath, rel);
      if (fs.existsSync(full)) {
        return { path: full, relativePath: rel };
      }
    }
    return null;
  }

  injectComponent(projectPath = this.projectRoot, framework = 'react', dryRun = false) {
    let target = this.findRootComponent(projectPath, framework);
    if (!target) {
      // If no root component exists in a React project, scaffold a starter App.tsx
      const srcDir = path.join(projectPath, 'src');
      const candidatePath = path.join(srcDir, 'App.tsx');
      if (!dryRun) {
        fs.mkdirSync(srcDir, { recursive: true });
        const devGuard = framework === 'react-vite' ? 'import.meta.env.DEV' : 'process.env.NODE_ENV === "development"';
        const starterContent = `import React from 'react';
import { Agentation } from 'agentation';

export function App() {
  return (
    <div className="app-container">
      <h1>Welcome to your Application</h1>
      {${devGuard} && <Agentation />}
    </div>
  );
}

export default App;
`;
        fs.writeFileSync(candidatePath, starterContent, 'utf8');
        return { injected: true, createdFile: 'src/App.tsx', file: 'src/App.tsx', guard: devGuard };
      } else {
        return { injected: true, dryRun: true, file: 'src/App.tsx (would scaffold)' };
      }
    }

    const content = fs.readFileSync(target.path, 'utf8');

    // Check if already injected
    if (content.includes('agentation') || content.includes('<Agentation')) {
      return { injected: true, alreadyPresent: true, file: target.relativePath };
    }

    const isVite = framework === 'react-vite' || content.includes('import.meta.env');
    const importStmt = `import { Agentation } from 'agentation';\n`;
    const devGuard = isVite ? `import.meta.env.DEV` : `process.env.NODE_ENV === 'development'`;
    const componentSnippet = `\n      {${devGuard} && <Agentation />}`;

    // Insertion strategy: add import at top, inject snippet before the last closing JSX tag
    let updated = content;

    // Add import after the last import statement or at top
    const lastImportIndex = updated.lastIndexOf('\nimport ');
    if (lastImportIndex !== -1) {
      const endOfImportLine = updated.indexOf('\n', lastImportIndex + 1);
      updated = updated.slice(0, endOfImportLine + 1) + importStmt + updated.slice(endOfImportLine + 1);
    } else {
      updated = importStmt + updated;
    }

    // Find return statement and last closing tag
    const lastClosingTag = updated.lastIndexOf('</');
    if (lastClosingTag !== -1) {
      updated = updated.slice(0, lastClosingTag) + componentSnippet + '\n      ' + updated.slice(lastClosingTag);
    } else {
      return { injected: false, reason: 'Could not safely locate JSX closing tag in ' + target.relativePath };
    }

    if (dryRun) {
      return { injected: true, dryRun: true, file: target.relativePath };
    }

    fs.writeFileSync(target.path, updated, 'utf8');
    return { injected: true, file: target.relativePath, guard: devGuard };
  }

  configure(projectInfo, options = {}) {
    if (!projectInfo.isReact) {
      return { configured: false, skipped: true, reason: 'Non-React project; Agentation not applicable.' };
    }

    const dryRun = Boolean(options.dryRun);
    const installRes = this.installDependency(projectInfo.projectPath, projectInfo.packageManager, dryRun);
    const injectRes = this.injectComponent(projectInfo.projectPath, projectInfo.framework, dryRun);

    return {
      configured: true,
      install: installRes,
      injection: injectRes
    };
  }
}

export default AgentationManager;

