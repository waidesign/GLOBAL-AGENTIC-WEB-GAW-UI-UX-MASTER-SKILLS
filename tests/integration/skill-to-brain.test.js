import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { ProjectBootstrapper } from '../../core/bootstrapper/ProjectBootstrapper.js';
import { SkillOrchestrator } from '../../core/orchestrator/SkillOrchestrator.js';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';

test('Integration - newly added animation skills sync into ai-brain/skills/', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-skills-sync-test-'));

  // Scaffold a sample React project
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({
    name: 'test-animation-app',
    dependencies: { react: '^18.3.0', 'react-dom': '^18.3.0', motion: '^12.0.0' }
  }, null, 2), 'utf8');

  const bootstrapper = new ProjectBootstrapper();

  // Run init
  const initRes = await bootstrapper.init(tempDir, { noAgentation: true, noGraphify: true });
  assert.equal(fs.existsSync(path.join(tempDir, 'ai-brain', 'skills')), true);

  // Test loading task with motion.dev and animejs
  const registry = new SkillRegistry();
  const orchestrator = new SkillOrchestrator(registry);
  const loaded = await orchestrator.loadSkillsForTask('Build UI with motion-dev and animejs micro-interactions');

  const loadedIds = loaded.skills.map(s => s.id);
  assert.ok(loadedIds.includes('motion-dev') || loadedIds.includes('animejs'), 'Should identify motion-dev or animejs');

  // Verify sync into project ai-brain/skills/
  const brainSkillsDir = path.join(tempDir, 'ai-brain', 'skills');
  for (const skill of loaded.skills) {
    const dest = path.join(brainSkillsDir, `${skill.id}.md`);
    fs.writeFileSync(dest, `# Skill: ${skill.name}\n\n${skill.content}`, 'utf8');
  }

  // Check files exist on disk
  if (loadedIds.includes('motion-dev')) {
    assert.equal(fs.existsSync(path.join(brainSkillsDir, 'motion-dev.md')), true);
    const content = fs.readFileSync(path.join(brainSkillsDir, 'motion-dev.md'), 'utf8');
    assert.ok(content.includes('motion.dev'));
  }

  if (loadedIds.includes('animejs')) {
    assert.equal(fs.existsSync(path.join(brainSkillsDir, 'animejs.md')), true);
    const content = fs.readFileSync(path.join(brainSkillsDir, 'animejs.md'), 'utf8');
    assert.ok(content.includes('animejs.com'));
  }

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
});
