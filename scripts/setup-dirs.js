import fs from 'node:fs';
import path from 'node:path';

const dirs = [
  'bin', 'cli', 'core', 'mcp', 'brain', 'templates', 'templates/ai-brain', 'templates/ai-brain/skills',
  'templates/agentation', 'integrations', 'integrations/claude-code', 'integrations/cursor',
  'integrations/codex', 'integrations/gemini-cli', 'integrations/github-copilot', 'integrations/generic-agents',
  'integrations/agentation', 'integrations/graphify', 'docs', 'docs/architecture', 'docs/cli', 'docs/mcp',
  'docs/skills', 'docs/memory', 'docs/integrations', 'docs/troubleshooting', 'tests', 'tests/unit',
  'tests/integration', 'tests/fixtures', 'examples', 'skills',
  'skills/ui-ux', 'skills/design-systems', 'skills/animation-motion', 'skills/micro-interactions',
  'skills/components', 'skills/accessibility', 'skills/architecture', 'skills/code-quality',
  'skills/color', 'skills/debugging', 'skills/frontend', 'skills/frontend-frameworks',
  'skills/interaction', 'skills/performance', 'skills/react', 'skills/shadcn-ui',
  'skills/systems', 'skills/testing', 'skills/tooling', 'skills/typography', 'skills/video',
  'skills/3d', 'skills/seo',
  'core/orchestrator', 'core/skill-discovery', 'core/skill-loader', 'core/skill-registry',
  'core/memory-engine', 'core/project-manager', 'core/project-detector', 'core/project-analyzer',
  'core/bootstrapper', 'core/dependency-manager', 'core/agentation-manager', 'core/graphify-manager',
  'core/agent-adapters'
];

for (const dir of dirs) {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
}

console.log(`Successfully created ${dirs.length} directories.`);

