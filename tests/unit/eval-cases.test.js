import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../');

// Keeps the eval honest: every labeled skill must exist, so renames or
// migrations can't silently turn correct picks into misses.
test('eval cases - every expected skill exists and case IDs are unique across sets', async () => {
  const cases = ['skill-selection.json', 'skill-selection-holdout.json']
    .flatMap(f => JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'eval', 'cases', f), 'utf8')).cases);
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });

  const ids = new Set();
  for (const c of cases) {
    assert.ok(!ids.has(c.id), `duplicate case id: ${c.id}`);
    ids.add(c.id);
    assert.ok(c.task && c.domain, `case ${c.id} needs a task and a domain`);
    for (const skillId of c.relevant) {
      assert.ok(await registry.getSkill(skillId), `case ${c.id}: unknown skill "${skillId}"`);
    }
  }
});
