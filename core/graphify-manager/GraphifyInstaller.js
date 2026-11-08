import { execSync } from 'node:child_process';
import { findTool } from './toolLocator.js';

export const GRAPHIFY_PACKAGE = 'graphifyy';

const INSTALL_TIMEOUT_MS = 10 * 60 * 1000;

/** Astral's official uv install command for the current platform. */
export function uvInstallCommand(platform = process.platform) {
  return platform === 'win32'
    ? 'powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://astral.sh/uv/install.ps1 | iex"'
    : 'curl -LsSf https://astral.sh/uv/install.sh | sh';
}

function runVisible(command) {
  execSync(command, { stdio: 'inherit', timeout: INSTALL_TIMEOUT_MS });
}

/**
 * Installs Graphify with uv (uv also provides Python 3.10+).
 * Never asks questions itself: callers get consent first.
 */
export class GraphifyInstaller {
  constructor(options = {}) {
    this.platform = options.platform || process.platform;
    this.run = options.run || runVisible;
    this.locate = options.locate || findTool;
  }

  /** The uv command, or null when uv is not installed. */
  findUv() {
    return this.locate('uv')?.command || null;
  }

  uvInstallCommand() {
    return uvInstallCommand(this.platform);
  }

  /** Install uv with Astral's official script. Returns the uv command, or null if it can't be found afterwards. */
  installUv() {
    this.run(this.uvInstallCommand());
    return this.findUv();
  }

  graphifyInstallCommand(uvCommand = 'uv') {
    return `"${uvCommand}" tool install ${GRAPHIFY_PACKAGE}`;
  }

  installGraphify(uvCommand) {
    this.run(this.graphifyInstallCommand(uvCommand));
  }
}

export default GraphifyInstaller;
