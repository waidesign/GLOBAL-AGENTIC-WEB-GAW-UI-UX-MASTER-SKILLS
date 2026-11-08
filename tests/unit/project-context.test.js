import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import {
  readLock, selectSkills, deselectSkills, writeCatalog, loadProjectContext, loadProjectSkillsForTask
} from '../../core/project-context/ProjectContext.js';
import { ClaudeCodeAdapter } from '../../integrations/claude-code/ClaudeCodeAdapter.js';
import { writeSkillFolder } from '../../core/skill-registry/gss.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registry = new SkillRegistry({ skillsDir: path.resolve(__dirname, '../../skills') });

function makeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-ctx-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'shop', dependencies: { react: '^18.0.0' } }), 'utf8');
  fs.mkdirSync(path.join(dir, 'ai-brain'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'ai-brain', 'context.md'), '# Project Context\n\n## Product Overview\nAn online shop for handmade ceramics.\n\n## Architecture & Codebase Hubs\nx\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'ai-brain', 'rules.md'), '# Rules\n\n## Project-Specific Rules\n- Prices are stored in cents\n- Support Safari 15+\n', 'utf8');
  return dir;
}

test('lockfile - select records version and reason; unknown and duplicate IDs are reported', async () => {
  const dir = makeProject();
  const res = await selectSkills(dir, registry, ['pricing-page', 'not-a-skill'], 'Plan page for the shop');
  assert.deepEqual(res.added, ['pricing-page']);
  assert.deepEqual(res.unknown, ['not-a-skill']);
  assert.deepEqual((await selectSkills(dir, registry, ['pricing-page'])).already, ['pricing-page']);

  const lock = readLock(dir);
  assert.equal(lock.skills.length, 1);
  assert.equal(lock.skills[0].reason, 'Plan page for the shop');
  assert.ok(lock.skills[0].version);

  assert.deepEqual(deselectSkills(dir, ['pricing-page']), ['pricing-page']);
  assert.equal(readLock(dir).skills.length, 0);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('catalog - short entries with a path, not full skill text', async () => {
  const dir = makeProject();
  await selectSkills(dir, registry, ['pricing-page'], 'Plan page');
  writeSkillFolder(path.join(dir, 'ai-brain', 'skills', 'shop-rules'), {
    data: { name: 'shop-rules', description: 'House rules for the shop. Use when changing checkout code.', license: 'MIT' },
    content: '# Shop rules\n\nSecret detailed body.',
    contract: { gss: 1 }
  });
  await writeCatalog(dir, registry);

  const catalog = fs.readFileSync(path.join(dir, 'ai-brain', 'project-skills.md'), 'utf8');
  assert.ok(catalog.includes('(`pricing-page`)'));
  assert.ok(catalog.includes('**Why chosen**: Plan page'));
  assert.ok(catalog.includes('(`shop-rules`)'));
  assert.ok(catalog.includes('ai-brain/skills/shop-rules/SKILL.md'));
  assert.ok(!catalog.includes('Secret detailed body'), 'bodies are not copied into the catalog');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('context - one validated object for CLI, MCP and agents', async () => {
  const dir = makeProject();
  await selectSkills(dir, registry, ['pricing-page']);
  fs.writeFileSync(path.join(dir, 'ai-brain', 'skills.lock.json'),
    JSON.stringify({ gss: 1, skills: [...readLock(dir).skills, { id: 'removed-skill', version: '1.0.0' }] }), 'utf8');

  const ctx = await loadProjectContext(dir, { registry });
  assert.equal(ctx.project.name, 'shop');
  assert.equal(ctx.goal, 'An online shop for handmade ceramics.');
  assert.deepEqual(ctx.rules, ['Prices are stored in cents', 'Support Safari 15+']);
  assert.deepEqual(ctx.skills.selected.map(s => s.id), ['pricing-page']);
  assert.ok(ctx.warnings.some(w => w.includes('removed-skill')), 'missing selections are reported');
  assert.equal(ctx.graph.available, false);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('load_project_skills - only the project skills that fit the task', async () => {
  const dir = makeProject();
  await selectSkills(dir, registry, ['pricing-page', 'fixing-accessibility']);

  const pricing = await loadProjectSkillsForTask(dir, registry, 'Design a SaaS pricing page with plans');
  assert.deepEqual(pricing.skills.map(s => s.id), ['pricing-page']);

  const none = await loadProjectSkillsForTask(dir, registry, 'Set up Kubernetes on Azure');
  assert.equal(none.skills.length, 0, 'library skills outside the selection are never loaded');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('agent files - the GAW section is refreshed in place, other content kept', () => {
  const dir = makeProject();
  const claudeMd = path.join(dir, 'CLAUDE.md');
  fs.writeFileSync(claudeMd, '<!-- GLOBAL AGENTIC WEB — CLAUDE CODE CONFIGURATION -->\n# Old\n- Old line\n<!-- END GLOBAL AGENTIC WEB -->\n\n# My own notes\nKeep me.\n', 'utf8');

  assert.equal(ClaudeCodeAdapter.configure(dir, { framework: 'react' }).action, 'updated');
  const text = fs.readFileSync(claudeMd, 'utf8');
  assert.ok(text.includes('project-skills.md'));
  assert.ok(!text.includes('- Old line'));
  assert.ok(text.includes('# My own notes\nKeep me.'));
  assert.equal(text.split('GLOBAL AGENTIC WEB — CLAUDE CODE CONFIGURATION').length - 1, 1, 'no duplicate section');
  assert.equal(ClaudeCodeAdapter.configure(dir, { framework: 'react' }).action, 'unchanged');
  fs.rmSync(dir, { recursive: true, force: true });
});
