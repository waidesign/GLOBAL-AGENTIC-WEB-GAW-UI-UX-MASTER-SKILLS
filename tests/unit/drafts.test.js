import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { addDrafts, approveDrafts, rejectDrafts, listDrafts } from '../../core/skill-registry/drafts.js';
import { readSkillFolder, writeSkillFolder } from '../../core/skill-registry/gss.js';
import { rankabilityLevel } from '../../core/skill-registry/rankability.js';

function makeSkill(contract = { gss: 1 }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-drafts-'));
  const dir = path.join(root, 'ui-ux', 'pricing-page');
  writeSkillFolder(dir, {
    data: { name: 'pricing-page', description: 'Design SaaS pricing pages with plan comparison tables and billing toggles.', license: 'MIT' },
    content: '# Pricing',
    contract
  });
  return { root, dir };
}

const asSkill = (dir) => {
  const { data, contract } = readSkillFolder(dir);
  return { id: data.name, name: data.name, description: data.description, tags: [], contract };
};

test('drafts - fill only empty fields, within the caps, and are listed as drafts', () => {
  const { root, dir } = makeSkill({ gss: 1, whenToUse: ['Author wrote this'] });
  const drafted = addDrafts(dir, {
    whenToUse: ['Drafted, should be ignored'],
    keywords: ['subscription', 'plans table', 'x'.repeat(60), 'subscription'],
    whenNotToUse: ['Checkout and payment processing']
  });
  assert.deepEqual(drafted.sort(), ['keywords', 'whenNotToUse']);

  const { contract } = readSkillFolder(dir);
  assert.deepEqual(contract.whenToUse, ['Author wrote this'], 'author field untouched');
  assert.deepEqual(contract.keywords, ['subscription', 'plans table'], 'deduplicated, over-long keyword dropped');
  assert.deepEqual(contract.drafts, ['keywords', 'whenNotToUse']);
  assert.deepEqual(Object.keys(listDrafts(contract)).sort(), ['keywords', 'whenNotToUse']);
  fs.rmSync(root, { recursive: true, force: true });
});

test('drafts - do not count until approved; approve keeps, reject deletes', () => {
  const { root, dir } = makeSkill({ gss: 1, summary: 's', whenToUse: ['Use when building pricing pages'], domains: ['design'] });
  addDrafts(dir, { keywords: ['subscription', 'plans', 'tiers'], whenNotToUse: ['Checkout flows'] });
  assert.equal(rankabilityLevel(asSkill(dir)).level, 1, 'drafted keywords ignored');

  assert.deepEqual(approveDrafts(dir, ['keywords']), ['keywords']);
  assert.equal(rankabilityLevel(asSkill(dir)).level, 2, 'approved keywords count');
  assert.deepEqual(readSkillFolder(dir).contract.drafts, ['whenNotToUse']);

  assert.deepEqual(rejectDrafts(dir), ['whenNotToUse']);
  const { contract } = readSkillFolder(dir);
  assert.equal(contract.whenNotToUse, undefined);
  assert.equal(contract.drafts, undefined);
  fs.rmSync(root, { recursive: true, force: true });
});
