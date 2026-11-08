import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { normalizeLicense, detectLicenseFromText, licenseCategory, resolveSkillLicense } from '../../core/skill-registry/licenses.js';
import { parseGitHubUrl } from '../../core/skill-registry/github.js';
import { convertToGss, planSplit, toSkillName } from '../../core/skill-registry/gss.js';
import { prepareSkill, previewSkill, installSkill, guessCategory } from '../../core/skill-registry/skillImport.js';
import { parseFrontmatter } from '../../core/skill-registry/frontmatter.js';
import { lintSkillFolder } from '../../core/skill-registry/SkillLinter.js';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';

const tmp = (prefix) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

test('licenses - normalize names and read license texts', () => {
  assert.equal(normalizeLicense('MIT'), 'MIT');
  assert.equal(normalizeLicense('Apache 2.0'), 'Apache-2.0');
  assert.equal(normalizeLicense('Apache License 2.0'), 'Apache-2.0');
  assert.equal(normalizeLicense('Proprietary. LICENSE.txt has complete terms'), 'Proprietary');
  assert.equal(normalizeLicense('Complete terms in LICENSE.txt'), null);
  assert.equal(normalizeLicense('NOASSERTION'), null);

  assert.equal(detectLicenseFromText('MIT License\n\nPermission is hereby granted, free of charge, to any person'), 'MIT');
  assert.equal(detectLicenseFromText('                Apache License\n          Version 2.0, January 2004'), 'Apache-2.0');
  assert.equal(detectLicenseFromText('© 2025 Example Inc. All rights reserved.'), 'Proprietary');

  assert.equal(licenseCategory('MIT'), 'open');
  assert.equal(licenseCategory('GPL-3.0'), 'copyleft');
  assert.equal(licenseCategory('Proprietary'), 'restricted');
  assert.equal(licenseCategory(null), 'unknown');
});

test('licenses - evidence order: skill LICENSE file, then SKILL.md, then repository', async () => {
  const files = {
    'skills/a/SKILL.md': '---\nname: a\nlicense: MIT\n---\nbody',
    'skills/a/LICENSE.txt': 'Apache License\nVersion 2.0, January 2004',
    'skills/b/SKILL.md': '---\nname: b\nlicense: MIT\n---\nbody',
    'skills/c/SKILL.md': '---\nname: c\n---\nbody'
  };
  const fake = {
    tree: async () => ({ branch: 'main', blobs: Object.keys(files).map(p => ({ path: p, size: 10 })) }),
    raw: async (_repo, _branch, p) => files[p] ?? null,
    repoLicense: async () => ({ spdx: 'BSD-3-Clause', url: 'https://example/LICENSE', text: '' })
  };
  assert.equal((await resolveSkillLicense(fake, { repo: 'o/r', path: 'skills/a/SKILL.md' })).spdx, 'Apache-2.0');
  assert.equal((await resolveSkillLicense(fake, { repo: 'o/r', path: 'skills/b/SKILL.md' })).evidence, 'declared in original SKILL.md');
  const c = await resolveSkillLicense(fake, { repo: 'o/r', path: 'skills/c/SKILL.md' });
  assert.equal(c.spdx, 'BSD-3-Clause');
  assert.equal(c.evidence, 'repository license');
});

test('github - parse links to repos, folders and SKILL.md files', () => {
  assert.deepEqual(parseGitHubUrl('https://github.com/o/r'), { repo: 'o/r', branch: null, path: '' });
  assert.deepEqual(parseGitHubUrl('https://github.com/o/r/tree/main/skills/pdf'), { repo: 'o/r', branch: 'main', path: 'skills/pdf' });
  assert.deepEqual(parseGitHubUrl('https://github.com/o/r/blob/main/skills/pdf/SKILL.md'), { repo: 'o/r', branch: 'main', path: 'skills/pdf' });
  assert.equal(parseGitHubUrl('./local/folder'), null);
});

test('gss - convert legacy and non-standard skills without losing data', () => {
  const text = '---\nid: "orbits"\nname: "Satellite Orbits"\ncategory: "science"\ndescription: >\n  Compute orbits.\n  Use for orbital mechanics.\ntags: ["orbits", "science"]\ndependencies: ["math"]\nhooks:\n  Stop:\n    - type: command\n---\nBody';
  const { data, content, raw } = parseFrontmatter(text);
  const { data: out, contract, warnings } = convertToGss({ data, content, category: 'science', raw });

  assert.equal(out.name, 'orbits');
  assert.equal(out.description, 'Compute orbits. Use for orbital mechanics.');
  assert.equal(out.metadata['gaw-title'], 'Satellite Orbits');
  assert.equal(out.metadata['gaw-tags'], 'orbits'.includes('orbits') ? undefined : out.metadata['gaw-tags']);
  assert.deepEqual(contract.dependsOn, ['math']);
  assert.equal(contract.extraFrontmatter.hooks, 'hooks:\n  Stop:\n    - type: command');
  assert.ok(warnings.some(w => w.includes('hooks')));
  assert.equal(toSkillName('My Cool Skill!'), 'my-cool-skill');
});

test('gss - split oversized skills losslessly, never inside code blocks', () => {
  // 16 short sections (~500 tokens each): the moved ones should be grouped, not one file each
  const section = (n) => `## Section ${n}\n\n${'Detail sentence for this part. '.repeat(64)}`;
  const body = `# Big Skill\n\nIntro paragraph.\n\n\`\`\`md\n## Not a heading (inside code)\n\`\`\`\n\n${Array.from({ length: 16 }, (_, i) => section(i + 1)).join('\n\n')}`;
  const plan = planSplit(body, { skillName: 'big-skill' });

  assert.ok(plan.after < 5000);
  const movedSections = plan.references.reduce((n, r) => n + r.headings.length, 0);
  assert.ok(plan.references.length < movedSections, 'groups small sections into fewer files');
  assert.ok(plan.main.includes('## Detailed references'));
  assert.ok(plan.main.includes('## Not a heading (inside code)'), 'code block stays intact');

  const combined = [plan.main, ...plan.references.map(r => r.content)].join('\n');
  // Every line survives (trailing whitespace aside)
  for (const line of body.split('\n').filter(l => l.trim())) assert.ok(combined.includes(line.trimEnd()), `lost: ${line.slice(0, 40)}`);
  assert.equal(planSplit('small body'), null);
});

test('skills add - local folder becomes a GSS skill with license, permissions and split', async () => {
  const src = tmp('gaw-add-src-');
  const big = `# Tool\n\nIntro.\n\n${[1, 2, 3, 4, 5].map(n => `## Part ${n}\n\n${'Words of guidance. '.repeat(400)}`).join('\n\n')}`;
  fs.writeFileSync(path.join(src, 'SKILL.md'), `---\nname: my-tool\ndescription: Do the tool thing. Use when tooling.\nlicense: MIT\n---\n${big}`, 'utf8');
  fs.mkdirSync(path.join(src, 'scripts'));
  fs.writeFileSync(path.join(src, 'scripts', 'run.sh'), 'echo hi', 'utf8');

  const root = tmp('gaw-add-lib-');
  const prepared = await prepareSkill(src);
  const preview = previewSkill(prepared, { root, category: 'workflow' });
  assert.equal(preview.name, path.basename(src).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  assert.deepEqual(preview.contract.permissions, ['shell']);
  assert.ok(preview.split, 'MIT allows splitting');

  const { dir, copied } = await installSkill(prepared, preview);
  assert.equal(copied, 1);
  assert.ok(fs.existsSync(path.join(dir, 'scripts', 'run.sh')));
  assert.ok(fs.readdirSync(path.join(dir, 'references')).length >= 1);
  assert.equal(lintSkillFolder(dir).errors.length, 0);
  fs.rmSync(src, { recursive: true, force: true });
  fs.rmSync(root, { recursive: true, force: true });
});

test('skills add - unlicensed oversized skills are not modified', async () => {
  const src = tmp('gaw-add-nolic-');
  const file = path.join(src, 'big-notes.md');
  fs.writeFileSync(file, `# Notes\n\n${[1, 2, 3, 4].map(n => `## Part ${n}\n\n${'Text. '.repeat(1200)}`).join('\n\n')}`, 'utf8');
  const preview = previewSkill(await prepareSkill(file), { root: tmp('gaw-add-lib2-') });
  assert.equal(preview.split, null);
  assert.ok(preview.oversizedNotSplit);
  assert.ok(preview.warnings.some(w => w.includes('not split')));
  assert.ok(preview.warnings.some(w => w.includes('No license')));
  fs.rmSync(src, { recursive: true, force: true });
});

test('skills - categories are guessed from whole words', () => {
  assert.equal(guessCategory('Fill PDF forms'), 'documents');
  assert.equal(guessCategory('Theme variables for buttons'), 'general', '"aria" inside "variables" must not mean accessibility');
  assert.equal(guessCategory('Deploy to Kubernetes'), 'cloud-infra');
});

test('registry - refreshes skills/index.json automatically when skills change', async () => {
  const root = tmp('gaw-autoindex-');
  const dir = path.join(root, 'general', 'one');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: one\ndescription: First skill for testing.\n---\nBody', 'utf8');
  await new SkillRegistry({ skillsDir: root }).loadSkills();
  assert.ok(fs.existsSync(path.join(root, 'index.json')), 'index written on first load');

  const dir2 = path.join(root, 'general', 'two');
  fs.mkdirSync(dir2, { recursive: true });
  fs.writeFileSync(path.join(dir2, 'SKILL.md'), '---\nname: two\ndescription: Second skill for testing.\n---\nBody', 'utf8');
  const registry = new SkillRegistry({ skillsDir: root });
  await registry.loadSkills();
  assert.equal(registry.loadedFromIndex, false, 'stale index detected');
  const index = JSON.parse(fs.readFileSync(path.join(root, 'index.json'), 'utf8'));
  assert.equal(index.skills.length, 2, 'index refreshed');
  fs.rmSync(root, { recursive: true, force: true });
});
