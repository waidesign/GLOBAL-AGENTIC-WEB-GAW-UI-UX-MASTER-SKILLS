import fs from 'node:fs';
import { readJsonFile } from '../utils/readJson.js';
import path from 'node:path';
import { execSync } from 'node:child_process';

/**
 * DependencyManager
 * Cross-platform package manager abstraction supporting npm, pnpm, yarn, and bun.
 */
export class DependencyManager {
  static detectPackageManager(projectDir = process.cwd()) {
    if (fs.existsSync(path.join(projectDir, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(projectDir, 'bun.lockb')) || fs.existsSync(path.join(projectDir, 'bun.lock'))) return 'bun';
    if (fs.existsSync(path.join(projectDir, 'yarn.lock'))) return 'yarn';
    return 'npm';
  }

  static getAddDevCommand(pkgName, packageManager = 'npm') {
    switch (packageManager) {
      case 'pnpm': return `pnpm add -D ${pkgName}`;
      case 'yarn': return `yarn add -D ${pkgName}`;
      case 'bun': return `bun add -d ${pkgName}`;
      case 'npm':
      default: return `npm install ${pkgName} -D`;
    }
  }

  static getInstallCommand(packageManager = 'npm') {
    switch (packageManager) {
      case 'pnpm': return 'pnpm install';
      case 'yarn': return 'yarn install';
      case 'bun': return 'bun install';
      case 'npm':
      default: return 'npm install';
    }
  }

  static addDevDependency(projectDir, pkgName, dryRun = false) {
    const pkgJsonPath = path.join(projectDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) {
      return { success: false, reason: 'package.json not found' };
    }

    try {
      const pkg = readJsonFile(pkgJsonPath);
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps[pkgName]) {
        return { success: true, alreadyInstalled: true };
      }

      const pm = DependencyManager.detectPackageManager(projectDir);
      const cmd = DependencyManager.getAddDevCommand(pkgName, pm);

      if (dryRun) {
        return { success: true, dryRun: true, command: cmd };
      }

      execSync(cmd, { cwd: projectDir, stdio: 'ignore' });
      return { success: true, command: cmd };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export default DependencyManager;

