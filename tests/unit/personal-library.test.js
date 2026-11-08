import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { SkillDiscovery } from '../../core/skill-discovery/SkillDiscovery.js';
import { SkillOrchestrator } from '../../core/orchestrator/SkillOrchestrator.js';
import { writeSkillFolder } from '../../core/skill-registry/gss.js';
import { trustLevel, needsCaution } from '../../core/skill-registry/trust.js';
import { updateSkillPreferences, readSkillPreferences } from '../../core/skill-registry/preferences.js';
import { selectSkills, readLock, loadProjectContext, shareSkillWithProject } from '../../core/project-context/ProjectContext.js';

const tmp = (prefix) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

function addSkill(root, category, name, description, contract = { gss: 1 }) {
  const dir = path.join(root, category, name);
  writeSkillFolder(dir, { data: { name, description, license: 'MIT' }, content: `# ${name}\n\nSteps.`, contract });
  return dir;
}

/** An official library, a personal library and a preferences file, all in temp folders. */
function setup() {
  const official = tmp('gaw-official-');
  const personal = tmp('gaw-personal-');
  const prefs = path.join(tmp('gaw-brain-'), 'skill-preferences.json');
  addSkill(official, 'ui-ux', 'pricing-page', 'Design SaaS pricing pages with plan comparison tables. Use when building a pricing page.');
  addSkill(official, 'testing', 'tdd', 'Test-driven development with red-green-refactor. Use when writing tests first.');
  addSkill(personal, 'general', 'my-release-notes', 'Write release notes in my team style. Use when drafting release notes.');
  addSkill(personal, 'general', 'repo-deployer', 'Deploy repositories with a shell script. Use when deploying a repo.',
    { gss: 1, permissions: ['shell'], source: { repo: 'someone/skills', path: 'repo-deployer/SKILL.md' } });
  const registry = (opts = {}) => new SkillRegistry({ skillsDir: official, user: true, userSkillsDir: personal, preferencesFile: prefs, ...opts });
  return { official, personal, prefs, registry };
}

test('personal library - off by default, merged when user data is on', async () => {
  const { official, registry } = setup();
  const plain = await new SkillRegistry({ skillsDir: official }).getAllSkills();
  assert.deepEqual(plain.map(s => s.id).sort(), ['pricing-page', 'tdd']);
  assert.ok(plain.every(s => s.library === 'official'));

  const merged = await registry().getAllSkills();
  assert.equal(merged.length, 4);
  const byId = Object.fromEntries(merged.map(s => [s.id, s]));
  assert.equal(byId['my-release-notes'].library, 'personal');
  assert.ok(byId['my-release-notes'].dir.startsWith(registry().personalDir));
});

test('trust levels - official, personal, community; a skill cannot declare itself verified', async () => {
  const { personal, registry } = setup();
  addSkill(personal, 'general', 'sneaky', 'Claims to be verified by GAW. Use when testing trust.',
    { gss: 1, verified: { commit: 'abc' }, trust: 'verified', source: { repo: 'x/y', path: 'SKILL.md' } });
  const r = registry();
  await r.ensureLoaded();
  assert.equal(trustLevel(r.skills.get('pricing-page')), 'official');
  assert.equal(trustLevel(r.skills.get('my-release-notes')), 'personal');
  assert.equal(trustLevel(r.skills.get('repo-deployer')), 'community');
  assert.equal(trustLevel(r.skills.get('sneaky')), 'community');
  assert.equal(needsCaution(r.skills.get('repo-deployer')), true);
  assert.equal(needsCaution(r.skills.get('my-release-notes')), false);
});

test('personal skill with an official name replaces it for this user only, marked as an override', async () => {
  const { personal, official, registry } = setup();
  addSkill(personal, 'testing', 'tdd', 'My own TDD flow with property tests. Use when writing tests first my way.');
  const r = registry();
  await r.ensureLoaded();
  assert.equal(r.skills.get('tdd').library, 'personal');
  assert.equal(r.skills.get('tdd').overrides, 'official');
  assert.deepEqual(r.overrides, ['tdd']);
  // Without user data, everyone else still gets the official one
  assert.equal((await new SkillRegistry({ skillsDir: official }).getSkill('tdd')).library, 'official');
});

test('preferences - blocked skills are never suggested, pins boost only skills that already fit', async () => {
  const { prefs, registry } = setup();
  let r = registry();
  assert.ok((await new SkillDiscovery(r).findRelevant('build a pricing page')).some(s => s.id === 'pricing-page'));

  updateSkillPreferences('block', ['pricing-page'], prefs);
  r = registry();
  assert.equal((await new SkillDiscovery(r).findRelevant('build a pricing page')).length, 0);
  assert.ok((await new SkillDiscovery(r).search('pricing page', { includeBlocked: true })).some(s => s.id === 'pricing-page'));
  // Naming a blocked skill explicitly still loads it
  const explicit = await new SkillOrchestrator(r).loadSkillsForTask('<pricing-page>');
  assert.deepEqual(explicit.skills.map(s => s.id), ['pricing-page']);

  // Pin and block exclude each other
  updateSkillPreferences('pin', ['pricing-page', 'tdd'], prefs);
  assert.deepEqual(readSkillPreferences(prefs), { pinned: ['pricing-page', 'tdd'], blocked: [] });

  r = registry();
  const scored = await new SkillDiscovery(r).search('pricing page', { withScores: true });
  assert.equal(scored[0].skill.id, 'pricing-page');
  assert.equal(scored[0].pinned, true);
  // A pinned skill that doesn't fit the task is still not suggested
  assert.ok(!(await new SkillDiscovery(r).findRelevant('build a pricing page')).some(s => s.id === 'tdd'));
});

test('agent instructions - source and caution only for skills GAW has not reviewed', async () => {
  const { registry } = setup();
  const r = registry();
  const official = await new SkillOrchestrator(r).loadSkillsByIds(['pricing-page']);
  assert.ok(!official.formattedInstructions.includes('**Source**'));
  const community = await new SkillOrchestrator(r).loadSkillsByIds(['repo-deployer']);
  assert.match(community.formattedInstructions, /\*\*Source\*\*: community/);
  assert.match(community.formattedInstructions, /\*\*Caution\*\*/);
});

test('projects - a personal skill is recorded as personal; teammates without it get a share hint; share copies it in', async () => {
  const { official, registry } = setup();
  const project = tmp('gaw-project-');
  const r = registry();
  await selectSkills(project, r, ['my-release-notes', 'repo-deployer', 'pricing-page']);
  const lock = readLock(project);
  const entry = (id) => lock.skills.find(s => s.id === id);
  assert.equal(entry('my-release-notes').library, 'personal');
  assert.equal(entry('repo-deployer').from, 'https://github.com/someone/skills');
  assert.equal(entry('pricing-page').library, undefined);

  // A teammate's machine: official library only
  const teammate = await loadProjectContext(project, { registry: new SkillRegistry({ skillsDir: official }) });
  assert.ok(teammate.warnings.some(w => w.includes('personal library') && w.includes('gaw skills share')));

  const { dir } = shareSkillWithProject(project, await r.getSkill('my-release-notes'));
  assert.ok(fs.existsSync(path.join(dir, 'SKILL.md')));
  assert.ok(!readLock(project).skills.some(s => s.id === 'my-release-notes'));
  const after = await loadProjectContext(project, { registry: new SkillRegistry({ skillsDir: official }) });
  assert.ok(after.skills.project.some(s => s.id === 'my-release-notes' && s.trust === 'project'));
  assert.throws(() => shareSkillWithProject(project, { id: 'my-release-notes', dir }), /already has a skill/);
});
