import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { lintSkillFolder } from '../../core/skill-registry/SkillLinter.js';
import { ProjectDetector } from '../../core/project-detector/ProjectDetector.js';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { GraphifyManager } from '../../core/graphify-manager/GraphifyManager.js';
import { readLock, selectSkills } from '../../core/project-context/ProjectContext.js';
import { runOnboarding } from '../../cli/interactive.js';
import {
  PACKS_DIR, loadPacks, validatePack, detectPacks, packSkills, addPack, removePack, addedPacks
} from '../../core/packs/packs.js';

class NoGraphify extends GraphifyManager { getCliVersion() { return null; } }

const registry = new SkillRegistry();
const packs = loadPacks();
const byName = new Map(packs.map(p => [p.name, p]));
const globalBrain = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-packs-gb-'));
const bootstrapper = new ProjectBootstrapper({ globalBrainDir: globalBrain, createGraphifyManager: (dir) => new NoGraphify({ projectRoot: dir }) });

function project(pkg) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-packs-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'app', ...pkg }), 'utf8');
  return dir;
}
const react = (extra = {}) => project({ dependencies: { react: '^18', 'react-dom': '^18', ...extra }, devDependencies: { vite: '^5' } });
const cleanup = (dir) => fs.rmSync(dir, { recursive: true, force: true });

test('shipped packs - valid, every skill exists and is complete (no missing files or broken links)', async () => {
  const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
  assert.equal(packs.length, files.length, 'every pack file loads');
  assert.deepEqual(packs.map(p => p.name).sort(), ['design-system', 'marketing', 'motion', 'ui']);

  const known = new Set((await registry.getAllSkills()).map(s => s.id));
  for (const pack of packs) {
    assert.deepEqual(validatePack(pack, known), [], pack.name);
    const ids = [...pack.skills, ...(pack.when || []).flatMap(w => w.skills)];
    for (const id of ids) {
      const skill = await registry.getSkill(id);
      const { errors, warnings } = lintSkillFolder(skill.dir);
      assert.deepEqual(errors, [], `${pack.name}/${id}`);
      assert.ok(!warnings.some(w => /Broken link|doesn't include/.test(w)), `${pack.name}/${id} ships all its files: ${warnings.join('; ')}`);
    }
  }
});

test('validatePack - rejects packs without signals or skills', () => {
  assert.ok(validatePack({ name: 'x', title: 'X', description: 'd', signals: {}, skills: ['a'] }).some(p => p.includes('signals')));
  assert.ok(validatePack({ name: 'x', title: 'X', description: 'd', signals: { always: true } }).some(p => p.includes('no skills')));
  assert.ok(validatePack({ name: 'X Y', title: 'X', description: 'd', signals: { always: true }, skills: ['a'] }).some(p => p.includes('name')));
});

test('detect - from dependencies, files and goal; nothing UI-only for an API', () => {
  const dir = react({ motion: '^12' });
  fs.writeFileSync(path.join(dir, 'components.json'), '{}', 'utf8');
  const info = ProjectDetector.detect(dir);
  const found = new Map(detectPacks(packs, info, { projectDir: dir }).map(p => [p.pack.name, p.reasons]));
  assert.deepEqual([...found.keys()].sort(), ['design-system', 'motion', 'ui']);
  assert.ok(found.get('motion')[0].includes('motion is in package.json'));
  assert.ok(found.get('design-system').some(r => r.includes('components.json')));

  const withGoal = detectPacks(packs, info, { projectDir: dir, goal: 'Landing page for a bakery' }).map(p => p.pack.name);
  assert.ok(withGoal.includes('marketing'), 'goal words count');
  assert.ok(!detectPacks(packs, info, { projectDir: dir, goal: 'islanding' }).some(p => p.pack.name === 'marketing'), 'whole words only');

  const api = project({ dependencies: { express: '^4' } });
  assert.deepEqual(detectPacks(packs, ProjectDetector.detect(api), { projectDir: api, goal: 'pricing API' }), [], 'UI packs need a UI');
  cleanup(dir); cleanup(api);
});

test('pack skills - stack-specific extras and the installed animation library only', async () => {
  const motionDir = react({ motion: '^12' });
  const motion = (await packSkills(byName.get('motion'), ProjectDetector.detect(motionDir), registry)).skills.map(s => s.id);
  assert.ok(motion.includes('motion-dev'));
  assert.ok(!motion.includes('animejs') && !motion.includes('masked-reveal'), 'never a second library');

  const animeDir = project({ dependencies: { animejs: '^4' }, devDependencies: { vite: '^5' } });
  const anime = (await packSkills(byName.get('motion'), ProjectDetector.detect(animeDir), registry)).skills.map(s => s.id);
  assert.ok(anime.includes('animejs') && !anime.includes('motion-dev'));

  const ui = (await packSkills(byName.get('ui'), ProjectDetector.detect(motionDir), registry)).skills.map(s => s.id);
  assert.ok(ui.includes('react-best-practices'), 'React project gets the React skill');
  assert.ok(!ui.includes('tailwindcss'), 'no Tailwind skill without Tailwind');
  cleanup(motionDir); cleanup(animeDir);
});

test('add / remove - shared skills stay while another pack uses them; hand-picked skills are never removed', async () => {
  const dir = react({ tailwindcss: '^4' });
  fs.mkdirSync(path.join(dir, 'ai-brain'));
  const info = ProjectDetector.detect(dir);
  await selectSkills(dir, registry, ['fixing-accessibility'], 'Chosen by hand');

  const ui = await addPack(dir, registry, byName.get('ui'), info);
  assert.ok(ui.added.includes('tailwindcss'));
  assert.ok(ui.already.includes('fixing-accessibility'));
  const ds = await addPack(dir, registry, byName.get('design-system'), info);
  assert.deepEqual(ds.tagged.sort(), ['baseline-ui', 'tailwindcss']);
  assert.deepEqual(addedPacks(dir), ['design-system', 'ui']);

  const { removed, kept } = removePack(dir, 'ui');
  assert.ok(removed.includes('accessibility-baseline'));
  assert.deepEqual(kept.sort(), ['baseline-ui', 'tailwindcss']);
  const lock = readLock(dir).skills;
  assert.ok(lock.some(s => s.id === 'fixing-accessibility' && !s.packs), 'hand-picked skill kept and untagged');
  assert.equal(lock.find(s => s.id === 'tailwindcss').reason, 'Pack "design-system"', 'reason follows the pack that keeps it');
  assert.deepEqual(addedPacks(dir), ['design-system']);
  cleanup(dir);
});

test('init - suggests packs for a React project, none for an API (and no React Native skill)', async () => {
  const web = react({ motion: '^12' });
  const report = await bootstrapper.init(web, { noAgentation: true, noGraphify: true });
  assert.deepEqual(report.packsSuggested.map(p => p.name).sort(), ['motion', 'ui']);
  assert.ok(!report.skillsRecommended.includes('react-native-skills'));
  assert.equal(readLock(web).skills.length, 0, 'nothing added without asking');

  const api = project({ dependencies: { express: '^4' } });
  assert.deepEqual((await bootstrapper.init(api, { noAgentation: true, noGraphify: true })).packsSuggested, []);
  cleanup(web); cleanup(api);
});

test('onboarding - offers fitting packs (goal included) and adds the chosen ones', async () => {
  const dir = react({ motion: '^12' });
  await bootstrapper.init(dir, { noAgentation: true, noGraphify: true });
  const answers = ['Marketing site with a pricing page', 'n', '', ''];
  const asked = [];
  const logs = [];
  await runOnboarding({ bootstrapper, projectDir: dir, ask: async (q) => { asked.push(q); return answers.shift() ?? ''; }, log: (m) => logs.push(m) });

  assert.ok(asked.some(q => q.includes('Add these packs?')));
  assert.ok(logs.join('\n').includes('marketing: Marketing pages'), 'goal brings in the marketing pack');
  assert.deepEqual(addedPacks(dir), ['marketing', 'motion', 'ui']);
  assert.ok(fs.readFileSync(path.join(dir, 'ai-brain', 'project-skills.md'), 'utf8').includes('motion-dev'));
  cleanup(dir);
});

test.after(() => cleanup(globalBrain));
