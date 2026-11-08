import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { lintLibrary, lintSkillFolder } from '../../core/skill-registry/SkillLinter.js';
import { stringifyFrontmatter } from '../../core/skill-registry/frontmatter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.resolve(__dirname, '../../skills');

function makeLibrary() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-gss-test-'));
  const dir = path.join(root, 'ui-ux', 'pricing-page');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), stringifyFrontmatter({
    name: 'pricing-page',
    description: 'Design SaaS pricing pages with plan comparison and billing toggles.',
    license: 'MIT',
    metadata: { 'gaw-title': 'Pricing Page', 'gaw-category': 'ui-ux', 'gaw-tags': 'pricing, plans' }
  }, '# Pricing\n\nInstructions.'), 'utf8');
  fs.writeFileSync(path.join(dir, 'gaw.json'), JSON.stringify({ gss: 1, keywords: ['subscription'], frameworks: ['react'] }), 'utf8');
  // A legacy single-file skill still loads
  fs.writeFileSync(path.join(root, 'ui-ux', 'old-skill.md'), '---\nid: "old-skill"\nname: "Old Skill"\ndescription: "A legacy skill file."\n---\nBody', 'utf8');
  return root;
}

test('GSS - the shipped library has no lint errors', () => {
  const { errorCount, results } = lintLibrary(SKILLS_DIR);
  const failing = results.filter(r => r.errors.length).map(r => `${r.name}: ${r.errors.join('; ')}`);
  assert.equal(errorCount, 0, failing.join('\n'));
});

test('GSS - skills/index.json is up to date (run: gaw skills index)', () => {
  const registry = new SkillRegistry({ skillsDir: SKILLS_DIR });
  const saved = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, 'index.json'), 'utf8'));
  assert.deepEqual(saved, JSON.parse(JSON.stringify(registry.buildIndex())));
});

test('GSS - registry maps SKILL.md + gaw.json and loads legacy files', async () => {
  const root = makeLibrary();
  const registry = new SkillRegistry({ skillsDir: root });
  const skill = await registry.getSkill('pricing-page');

  assert.equal(skill.name, 'Pricing Page');
  assert.equal(skill.category, 'ui-ux');
  assert.deepEqual(skill.tags, ['pricing', 'plans']);
  assert.deepEqual(skill.keywords, ['subscription']);
  assert.deepEqual(skill.frameworks, ['react']);
  assert.equal(skill.format, 'gss');
  assert.ok(skill.content.includes('Instructions.'));

  const legacy = await registry.getSkill('old-skill');
  assert.equal(legacy.format, 'legacy');
  assert.equal(legacy.name, 'Old Skill');
  fs.rmSync(root, { recursive: true, force: true });
});

test('GSS - with a fresh index, skill bodies load only when read', async () => {
  const root = makeLibrary();
  new SkillRegistry({ skillsDir: root }).writeIndex();

  const registry = new SkillRegistry({ skillsDir: root });
  await registry.loadSkills();
  assert.equal(registry.loadedFromIndex, true);

  // Change the body without changing its size: an index-backed registry has not read it yet
  const file = path.join(root, 'ui-ux', 'pricing-page', 'SKILL.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Instructions.', 'Lazy-loaded.'), 'utf8');
  const skill = await registry.getSkill('pricing-page');
  assert.ok(skill.content.includes('Lazy-loaded.'));
  fs.rmSync(root, { recursive: true, force: true });
});

test('GSS - linter catches spec violations', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-gss-lint-'));
  const dir = path.join(root, 'general', 'Bad_Name');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: Bad_Name\ndescription: ">"\ncategory: general\nmetadata:\n  gaw-version: "1"\n---\nBody', 'utf8');
  fs.writeFileSync(path.join(dir, 'gaw.json'), JSON.stringify({ gss: 1, keywords: 'not-a-list', dependsOn: ['missing-skill'] }), 'utf8');

  const { errors } = lintSkillFolder(dir, new Set(['bad-name']));
  const text = errors.join('\n');
  assert.ok(text.includes('Unknown frontmatter field "category"'));
  assert.ok(text.includes('lowercase letters'));
  assert.ok(text.includes('placeholder'));
  assert.ok(text.includes('"keywords" must be string[]'));
  assert.ok(text.includes('dependsOn "missing-skill"'));
  fs.rmSync(root, { recursive: true, force: true });
});
