import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';
import { readLock } from '../../core/project-context/ProjectContext.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.resolve(__dirname, '../../mcp/server.js');

class NoGraphify extends GraphifyManager { getCliVersion() { return null; } }

test('MCP - list, add and remove skill packs through the server', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-mcp-packs-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { react: '^18', motion: '^12' }, devDependencies: { vite: '^5' } }), 'utf8');
  await new ProjectBootstrapper({ createGraphifyManager: (d) => new NoGraphify({ projectRoot: d }) }).init(dir, { noAgentation: true, noGraphify: true });

  const client = new Client({ name: 'gaw-test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [SERVER], env: { ...process.env } }));
  try {
    const tools = (await client.listTools()).tools.map(t => t.name);
    for (const t of ['list_skill_packs', 'add_skill_packs', 'remove_skill_packs']) assert.ok(tools.includes(t), t);

    const call = async (name, args) => {
      const res = await client.callTool({ name, arguments: { projectPath: dir, ...args } });
      return { ...res, data: res.isError ? null : JSON.parse(res.content[0].text) };
    };

    const { data: listed } = await call('list_skill_packs', {});
    const motion = listed.packs.find(p => p.name === 'motion');
    assert.ok(motion.fits.length && !motion.added);
    assert.ok(motion.skills.some(s => s.id === 'motion-dev'));
    assert.equal(listed.packs.find(p => p.name === 'marketing').fits.length, 0);

    const { data: added } = await call('add_skill_packs', { names: ['motion'] });
    assert.ok(added.motion.added.includes('motion-dev'));
    assert.ok(readLock(dir).skills.every(s => s.packs?.includes('motion')));

    const { data: removed } = await call('remove_skill_packs', { names: ['motion'] });
    assert.ok(removed.motion.removed.includes('motion-dev'));
    assert.equal(readLock(dir).skills.length, 0);

    const bad = await call('add_skill_packs', { names: ['nope'] });
    assert.equal(bad.isError, true);
  } finally {
    await client.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
