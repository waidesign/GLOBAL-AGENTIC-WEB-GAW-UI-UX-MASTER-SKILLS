import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ensureGraphify } from '../../cli/graphify-setup.js';
import { GraphifyInstaller, uvInstallCommand } from '../../core/graphify-manager/GraphifyInstaller.js';

// Fake Graphify detection: reports installed once `installGraphify` has run.
function fakeManager({ installed = false } = {}) {
  const state = { installed };
  return {
    state,
    getCliVersion: () => (state.installed ? 'graphify 0.0.0-test' : null)
  };
}

// Records commands instead of running them.
function fakeInstaller(manager, { hasUv = true, uvInstallWorks = true } = {}) {
  const ran = [];
  let uvPresent = hasUv;
  const installer = new GraphifyInstaller({
    platform: 'linux',
    locate: (name) => (name === 'uv' && uvPresent ? { command: '/home/u/.local/bin/uv', version: 'uv 0.0.0' } : null),
    run: (cmd) => {
      ran.push(cmd);
      if (cmd === uvInstallCommand('linux') && uvInstallWorks) uvPresent = true;
      if (cmd.includes('tool install graphifyy')) manager.state.installed = true;
    }
  });
  return { installer, ran };
}

// Answers questions in order and records them.
function scriptedAsk(...answers) {
  const asked = [];
  const ask = async (question) => {
    asked.push(question);
    return answers.shift() ?? false;
  };
  return { ask, asked };
}

const silent = () => {};

test('ensureGraphify - does nothing when Graphify is already installed', async () => {
  const manager = fakeManager({ installed: true });
  const { installer, ran } = fakeInstaller(manager);
  const { ask, asked } = scriptedAsk();

  const res = await ensureGraphify({ manager, installer, ask, log: silent });

  assert.equal(res.available, true);
  assert.equal(res.installed, false);
  assert.equal(asked.length, 0);
  assert.equal(ran.length, 0);
});

test('ensureGraphify - user says no: nothing is installed', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager);
  const { ask, asked } = scriptedAsk(false);
  const logs = [];

  const res = await ensureGraphify({ manager, installer, ask, log: (m) => logs.push(m) });

  assert.equal(res.available, false);
  assert.equal(res.declined, true);
  assert.equal(asked.length, 1);
  assert.equal(ran.length, 0);
  assert.ok(logs.join('\n').includes('saves tokens'), 'explains why Graphify helps before asking');
});

test('ensureGraphify - user says yes and uv exists: installs Graphify with uv', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager, { hasUv: true });
  const { ask } = scriptedAsk(true);

  const res = await ensureGraphify({ manager, installer, ask, log: silent });

  assert.equal(res.available, true);
  assert.equal(res.installed, true);
  assert.deepEqual(ran, ['"/home/u/.local/bin/uv" tool install graphifyy']);
});

test('ensureGraphify - uv missing: asks separately before running the uv install script', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager, { hasUv: false });
  const { ask, asked } = scriptedAsk(true, true);

  const res = await ensureGraphify({ manager, installer, ask, log: silent });

  assert.equal(asked.length, 2);
  assert.ok(asked[1].includes('uv'));
  assert.equal(ran[0], uvInstallCommand('linux'));
  assert.ok(ran[1].includes('tool install graphifyy'));
  assert.equal(res.available, true);
});

test('ensureGraphify - uv missing and user declines uv: nothing is installed', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager, { hasUv: false });
  const { ask } = scriptedAsk(true, false);

  const res = await ensureGraphify({ manager, installer, ask, log: silent });

  assert.equal(res.available, false);
  assert.equal(ran.length, 0);
});

test('ensureGraphify - nobody can answer (no ask function): never installs', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager, { hasUv: false });

  const res = await ensureGraphify({ manager, installer, ask: null, confirmGraphify: false, log: silent });

  assert.equal(res.available, false);
  assert.equal(ran.length, 0, 'must not run the remote uv script without consent');
});

test('ensureGraphify - explicit opt-in (--install-graphify) installs uv and Graphify without asking', async () => {
  const manager = fakeManager();
  const { installer, ran } = fakeInstaller(manager, { hasUv: false });
  const { ask, asked } = scriptedAsk();

  const res = await ensureGraphify({ manager, installer, ask, confirmGraphify: false, confirmUv: false, log: silent });

  assert.equal(asked.length, 0);
  assert.equal(ran.length, 2);
  assert.equal(res.available, true);
});

test('ensureGraphify - reports a failed install without throwing', async () => {
  const manager = fakeManager();
  const installer = new GraphifyInstaller({
    platform: 'linux',
    locate: () => ({ command: 'uv', version: 'uv 0.0.0' }),
    run: () => { throw new Error('network down'); }
  });

  const res = await ensureGraphify({ manager, installer, ask: async () => true, log: silent });

  assert.equal(res.available, false);
  assert.equal(res.error, 'network down');
});

test('uvInstallCommand - uses the official Astral script for each platform', () => {
  assert.ok(uvInstallCommand('win32').includes('https://astral.sh/uv/install.ps1'));
  assert.ok(uvInstallCommand('darwin').includes('https://astral.sh/uv/install.sh'));
  assert.ok(uvInstallCommand('linux').includes('https://astral.sh/uv/install.sh'));
});
