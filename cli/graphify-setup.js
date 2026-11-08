import readline from 'node:readline/promises';
import { GraphifyManager } from '../core/graphify-manager/GraphifyManager.js';
import { GraphifyInstaller, GRAPHIFY_PACKAGE } from '../core/graphify-manager/GraphifyInstaller.js';

export const GRAPHIFY_PITCH = `
Graphify: code map for AI agents (recommended, optional)

Graphify builds a map of how your files and functions connect.
AI agents can look things up in the map instead of reading whole
files, which usually saves tokens on questions about your code.

  • Runs locally: no AI calls, no API keys, free
  • Needs Python 3.10+, set up automatically by uv
  • You can skip now and add it later with: gaw setup
`;

function manualSteps(installer) {
  return [
    'To install Graphify yourself:',
    `  1. Install uv:       ${installer.uvInstallCommand()}`,
    `  2. Install Graphify: uv tool install ${GRAPHIFY_PACKAGE}   (or with Python 3.10+: pip install ${GRAPHIFY_PACKAGE})`,
    '  3. Build the map:    gaw graph',
    ''
  ].join('\n');
}

/** Ask a yes/no question in the terminal. Enter means yes. */
export async function askYesNo(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(question)).trim().toLowerCase();
    return answer === '' || answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

/**
 * A deliberate confirmation: only typing the word itself (e.g. "yes") counts.
 * Enter alone means no. Used before installing skills that can run commands.
 */
export async function askTyped(question, word = 'yes') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim().toLowerCase() === word;
  } finally {
    rl.close();
  }
}

/**
 * Make Graphify available, asking for consent before installing anything.
 *
 * - confirmGraphify: explain Graphify and ask before installing it
 * - confirmUv: ask before running Astral's uv install script (only needed when uv is missing)
 * - ask: async (question) => boolean, or null when nobody can answer (treated as "no")
 *
 * Returns { available, version, installed, declined, error }.
 */
export async function ensureGraphify(options = {}) {
  const {
    manager = new GraphifyManager(),
    installer = new GraphifyInstaller(),
    ask = null,
    confirmGraphify = true,
    confirmUv = true,
    log = console.log
  } = options;

  const confirm = async (question) => (ask ? ask(question) : false);

  const existing = manager.getCliVersion();
  if (existing) return { available: true, version: existing, installed: false };

  if (confirmGraphify) {
    log(GRAPHIFY_PITCH);
    if (!(await confirm('Install Graphify now? (Y/n) '))) {
      log('Skipped Graphify. You can add it later with: gaw setup\n');
      return { available: false, declined: true };
    }
  }

  let uv = installer.findUv();
  if (!uv) {
    log(`\nGraphify is installed with uv, Astral's installer for Python tools (it also sets up Python 3.10+).`);
    log(`uv is not installed yet. GAW can install it with Astral's official script:\n  ${installer.uvInstallCommand()}\n`);
    if (confirmUv && !(await confirm('Install uv now? (Y/n) '))) {
      log(`\nSkipped Graphify.\n${manualSteps(installer)}`);
      return { available: false, declined: true };
    }
    try {
      uv = installer.installUv();
    } catch (err) {
      log(`\nCould not install uv: ${err.message}\n${manualSteps(installer)}`);
      return { available: false, error: err.message };
    }
    if (!uv) {
      log('\nuv was installed, but GAW cannot find it yet. Open a new terminal and run: gaw setup\n');
      return { available: false, error: 'uv not found after install' };
    }
  }

  log(`\nInstalling Graphify: ${installer.graphifyInstallCommand(uv)}`);
  try {
    installer.installGraphify(uv);
  } catch (err) {
    log(`\nCould not install Graphify: ${err.message}\n${manualSteps(installer)}`);
    return { available: false, error: err.message };
  }

  const version = manager.getCliVersion({ refresh: true });
  if (!version) {
    log('\nGraphify was installed, but GAW cannot find it yet. Open a new terminal and run: gaw graph\n');
    return { available: false, installed: true, error: 'graphify not found after install' };
  }

  log(`✓ Graphify installed (${version})\n`);
  return { available: true, version, installed: true };
}
