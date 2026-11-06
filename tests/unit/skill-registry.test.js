import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SkillRegistry, parseFrontmatter } from '../../core/skill-registry/SkillRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

test('SkillRegistry - frontmatter parsing', () => {
  const sample = `---
id: "test-skill"
name: "Test Skill"
category: "testing"
tags: ["unit", "ci"]
dependencies: ["base-skill"]
---

# Test Skill Content
This is the markdown body.`;

  const parsed = parseFrontmatter(sample);
  assert.equal(parsed.data.id, 'test-skill');
  assert.equal(parsed.data.name, 'Test Skill');
  assert.deepEqual(parsed.data.tags, ['unit', 'ci']);
  assert.deepEqual(parsed.data.dependencies, ['base-skill']);
  assert.ok(parsed.content.includes('# Test Skill Content'));
});

test('SkillRegistry - loads and indexes skills from directory', async () => {
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const skills = await registry.getAllSkills();

  assert.ok(skills.length > 0, 'Registry should load at least 1 skill');
  
  // Verify specific core skills
  const baseline = await registry.getSkill('baseline-ui');
  assert.ok(baseline, 'baseline-ui skill should exist');
  assert.equal(baseline.id, 'baseline-ui');
  assert.ok(baseline.content.length > 50);

  const categories = await registry.getCategories();
  assert.ok(categories.includes('systems') || categories.includes('design-systems'));
});

test('SkillRegistry - skill validation', async () => {
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const valid = await registry.validateSkill('baseline-ui');
  assert.equal(valid.valid, true);

  const invalid = await registry.validateSkill('non-existent-skill');
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors, ['Skill not found']);
});

