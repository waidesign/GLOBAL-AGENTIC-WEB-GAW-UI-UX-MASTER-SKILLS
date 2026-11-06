import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SkillRegistry } from '../../core/skill-registry/SkillRegistry.js';
import { SkillOrchestrator } from '../../core/orchestrator/SkillOrchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../');

test('SkillOrchestrator - task analysis and recommendations', async () => {
  const registry = new SkillRegistry({ skillsDir: path.join(REPO_ROOT, 'skills') });
  const orchestrator = new SkillOrchestrator(registry);

  const task = 'Build a responsive SaaS dashboard with a sidebar, data table, and smooth animations.';
  const recs = await orchestrator.recommend(task, { framework: 'react' });

  assert.ok(recs.primarySkills.length > 0, 'Should recommend primary skills');
  assert.ok(recs.executionOrder.length > 0, 'Should provide an execution order');

  const loadedContext = await orchestrator.loadSkillsForTask(task, { framework: 'react' });
  assert.ok(loadedContext.formattedInstructions.includes('GLOBAL AGENTIC WEB — ACTIVE SKILL CONTEXT'));
  assert.ok(loadedContext.skills.length > 0);
});

