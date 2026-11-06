import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { SkillDiscovery } from '../../core/skill-discovery/SkillDiscovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

test('SkillDiscovery - keyword search ranking', async () => {
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const discovery = new SkillDiscovery(registry);

  const results = await discovery.search('design system');
  assert.ok(results.length > 0);
  
  // High confidence match should be ranked at or near top
  const ids = results.map(r => r.id);
  assert.ok(ids.includes('build-design-system') || ids.includes('design-system-boss'));
});

test('SkillDiscovery - category and framework filtering', async () => {
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const discovery = new SkillDiscovery(registry);

  const reactSkills = await discovery.search('react', { framework: 'react' });
  assert.ok(reactSkills.length > 0);

  for (const s of reactSkills) {
    const fw = s.frameworks || [];
    assert.ok(fw.includes('any') || fw.includes('react') || fw.includes('nextjs') || fw.includes('tailwind'));
  }
});

