import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { enrichContract, rankabilityLevel, splitSentences } from '../../core/skill-registry/rankability.js';
import { SkillDiscovery } from '../../core/skill-discovery/SkillDiscovery.js';
import { lintLibrary, lintSkillFolder } from '../../core/skill-registry/SkillLinter.js';
import { writeSkillFolder } from '../../core/skill-registry/gss.js';
import { prepareSkill, previewSkill } from '../../core/skill-registry/skillImport.js';

const skill = (over = {}) => ({
  id: 'pricing-page',
  name: 'Pricing Page',
  category: 'ui-ux',
  description: 'Design SaaS pricing pages with plan comparison. Use when building pricing or plan pages.',
  tags: [],
  content: '# Pricing\n\n## When not to use\n- Checkout and payment processing flows\n\n## Checklist\n- [ ] Toggle updates every price\n- [ ] Works with keyboard only',
  contract: { gss: 1 },
  ...over
});

test('rankability - sentences keep "Three.js" and "e.g." intact', () => {
  assert.deepEqual(splitSentences('Build scenes with Three.js and WebGL. Use when making 3D.'), ['Build scenes with Three.js and WebGL.', 'Use when making 3D.']);
});

test('rankability - enrich fills fields from the skill text only, never overwriting authors', () => {
  const { contract, filled } = enrichContract(skill({ contract: { gss: 1, summary: 'Author summary.' } }));
  assert.equal(contract.summary, 'Author summary.', 'author field kept');
  assert.deepEqual(contract.whenToUse, ['Use when building pricing or plan pages.']);
  assert.deepEqual(contract.whenNotToUse, ['Checkout and payment processing flows']);
  assert.deepEqual(contract.verification, ['Toggle updates every price', 'Works with keyboard only']);
  assert.deepEqual(contract.domains, ['design', 'web']);
  assert.ok(!filled.includes('summary'));
  assert.deepEqual(contract.derived, ['domains', 'verification', 'whenNotToUse', 'whenToUse']);
  assert.equal(contract.keywords, undefined, 'keywords are never derived');
});

test('rankability - levels follow GSS Ranking v1', () => {
  assert.equal(rankabilityLevel(skill({ description: 'Pricing pages.' })).level, 0, 'too short, no "when"');
  assert.equal(rankabilityLevel(skill()).level, 1, 'findable');

  const rankable = skill({ tags: ['pricing', 'plans'], contract: { gss: 1, summary: 's', whenToUse: ['w'], domains: ['design'], keywords: ['subscription'] } });
  assert.equal(rankabilityLevel(rankable).level, 2);

  const precise = skill({ ...rankable, contract: { ...rankable.contract, whenNotToUse: ['checkout'], verification: ['v'] } });
  assert.equal(rankabilityLevel(precise).level, 3);

  const drafted = skill({ ...rankable, contract: { ...rankable.contract, drafts: ['keywords'] } });
  assert.equal(rankabilityLevel(drafted).level, 1, 'unreviewed draft keywords do not count');
});

test('ranking - whenNotToUse keeps a skill out of matching tasks', async () => {
  const skills = [
    skill({ contract: { gss: 1, whenNotToUse: ['Checkout and payment processing flows'] } }),
    skill({ id: 'checkout-flow', name: 'Checkout Flow', description: 'Build checkout and payment processing flows. Use when taking payments.' })
  ];
  const discovery = new SkillDiscovery({ getAllSkills: async () => skills });
  const ids = (await discovery.findRelevant('Build a checkout with payment processing for pricing plans')).map(s => s.id);
  assert.ok(ids.includes('checkout-flow'));
  assert.ok(!ids.includes('pricing-page'), 'excluded by whenNotToUse');
  assert.ok((await discovery.findRelevant('Design a SaaS pricing page')).some(s => s.id === 'pricing-page'));
});

test('anti-gaming - caps on keywords and tags, copied descriptions flagged', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-gaming-'));
  const description = 'Spreadsheet automation for budgets and reports. Use when working with spreadsheets.';
  writeSkillFolder(path.join(root, 'general', 'one'), {
    data: { name: 'one', description, license: 'MIT', metadata: { 'gaw-tags': Array.from({ length: 16 }, (_, i) => `t${i}`).join(', ') } },
    content: 'Body',
    contract: { gss: 1, keywords: [...Array.from({ length: 21 }, (_, i) => `k${i}`)] }
  });
  writeSkillFolder(path.join(root, 'general', 'two'), { data: { name: 'two', description, license: 'MIT' }, content: 'Body', contract: { gss: 1 } });

  const one = lintSkillFolder(path.join(root, 'general', 'one'));
  assert.ok(one.errors.some(e => e.includes('21 keywords')));
  assert.ok(one.errors.some(e => e.includes('16 tags')));
  const { results } = lintLibrary(root);
  assert.ok(results.find(r => r.name === 'two').warnings.some(w => w.includes('Same description as one')));
  fs.rmSync(root, { recursive: true, force: true });
});

test('skills add - previews grade the skill; below Findable is reported as Incomplete', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-level-'));
  const file = path.join(dir, 'notes.md');
  fs.writeFileSync(file, '---\nname: orbit-notes\ndescription: Kepler orbit calculations and orbital elements reference.\nlicense: MIT\n---\nBody', 'utf8');

  const prepared = await prepareSkill(file);
  assert.equal(previewSkill(prepared, { root: dir }).level, 0);
  const withWhen = previewSkill(prepared, { root: dir, when: 'Use when computing satellite orbits' });
  assert.equal(withWhen.level, 1);
  assert.equal(withWhen.name, 'orbit-notes', 'a lone file keeps its declared name');
  fs.rmSync(dir, { recursive: true, force: true });
});
