import fs from 'node:fs';
import path from 'node:path';

const localSkillsSource = 'E:/skills';

const skillMappings = [
  {
    file: 'build-design-system-arla6ka.md',
    id: 'build-design-system',
    name: 'Build a Design System',
    category: 'design-systems',
    author: 'arla6ka',
    license: 'MIT',
    version: '1.0.0',
    description: 'Ground up construction of an evidence-based design system with tokens, primitives, states, allowlists, and pixel-diff testing.',
    tags: ['design-system', 'tokens', 'components', 'playwright', 'testing'],
    frameworks: ['react', 'nextjs', 'vue', 'svelte', 'html'],
    dependencies: [],
    relatedSkills: ['design-system-boss', 'migrate-to-a-design-system', 'baseline-ui']
  },
  {
    file: 'design-system-boss-arla6ka.md',
    id: 'design-system-boss',
    name: 'Design System Boss',
    category: 'design-systems',
    author: 'arla6ka',
    license: 'MIT',
    version: '1.0.0',
    description: 'Executive governance, token contracts, and zero-tolerance design system compliance audits for frontend surfaces.',
    tags: ['design-system', 'governance', 'tokens', 'audit', 'compliance'],
    frameworks: ['react', 'nextjs', 'vue', 'svelte', 'any'],
    dependencies: [],
    relatedSkills: ['build-design-system', 'migrate-to-a-design-system', 'baseline-ui']
  },
  {
    file: 'migrate-to-a-design-system-arla6ka.md',
    id: 'migrate-to-a-design-system',
    name: 'Migrate to a Design System',
    category: 'design-systems',
    author: 'arla6ka',
    license: 'MIT',
    version: '1.0.0',
    description: 'Structured migration of legacy surfaces to design system tokens, primitives, and component architecture without visual regression.',
    tags: ['design-system', 'migration', 'refactoring', 'tokens', 'clean-code'],
    frameworks: ['react', 'nextjs', 'vue', 'svelte'],
    dependencies: ['build-design-system'],
    relatedSkills: ['build-design-system', 'design-system-boss', 'improve-ui']
  },
  {
    file: 'design-lab.md',
    id: 'design-lab',
    name: 'Design Lab',
    category: 'ui-ux',
    author: 'ui-skills',
    license: 'MIT',
    version: '1.0.0',
    description: 'Interactive experimental design sandbox, creative UI/UX prototyping, and advanced layout exploration.',
    tags: ['ui-ux', 'prototyping', 'creative', 'experimentation', 'interaction'],
    frameworks: ['react', 'html', 'vue', 'svelte'],
    dependencies: [],
    relatedSkills: ['frontend-design', 'improve-ui']
  },
  {
    file: 'improve-ui-ibelick.md',
    id: 'improve-ui',
    name: 'Improve UI',
    category: 'ui-ux',
    author: 'ibelick',
    license: 'MIT',
    version: '1.0.0',
    description: 'Evidence-based audit of a product surface against its governing design system, eliminating interface slop without breaking functionality.',
    tags: ['ui-ux', 'audit', 'polish', 'visual-hierarchy', 'clean-ui'],
    frameworks: ['react', 'nextjs', 'vue', 'svelte', 'tailwind'],
    dependencies: [],
    relatedSkills: ['baseline-ui', 'frontend-design', 'design-system-boss']
  },
  {
    file: 'frontend-design-anthropic.md',
    id: 'frontend-design',
    name: 'Frontend Design',
    category: 'frontend',
    author: 'anthropic',
    license: 'MIT',
    version: '1.0.0',
    description: 'Build distinctive, production-grade frontend interfaces with high aesthetic fidelity, unique visual voice, and anti-slop principles.',
    tags: ['frontend', 'visual-design', 'typography', 'creative', 'craft'],
    frameworks: ['react', 'nextjs', 'vue', 'svelte', 'tailwind'],
    dependencies: [],
    relatedSkills: ['improve-ui', 'design-lab', 'baseline-ui']
  },
  {
    file: 'improve-animations-emilkowalski.md',
    id: 'improve-animations',
    name: 'Improve Animations',
    category: 'animation-motion',
    author: 'emilkowalski',
    license: 'MIT',
    version: '1.0.0',
    description: 'Expert motion design principles, fluid physics-based transitions, micro-interactions, and 60fps compositor optimization.',
    tags: ['motion', 'animation', 'micro-interactions', 'framer-motion', 'performance'],
    frameworks: ['react', 'nextjs', 'framer-motion', 'tailwind'],
    dependencies: [],
    relatedSkills: ['frontend-design', 'improve-ui']
  },
  {
    file: 'improve-react-millionco.md',
    id: 'improve-react',
    name: 'Improve React Performance',
    category: 'react',
    author: 'millionco',
    license: 'MIT',
    version: '1.0.0',
    description: 'Deep React rendering optimization, eliminating re-renders, optimizing virtual DOM reconciliation, and bundle size reduction.',
    tags: ['react', 'performance', 'rendering', 'virtual-dom', 'optimization'],
    frameworks: ['react', 'nextjs', 'remix', 'vite'],
    dependencies: [],
    relatedSkills: ['frontend-design', 'improve-shadcn']
  },
  {
    file: 'improve-shadcn.md',
    id: 'improve-shadcn',
    name: 'Improve shadcn/ui Architecture',
    category: 'shadcn-ui',
    author: 'ui-skills',
    license: 'MIT',
    version: '1.0.0',
    description: 'Best practices for installing, configuring, theming, and extending shadcn/ui and Radix UI primitives in modern web applications.',
    tags: ['shadcn-ui', 'radix-ui', 'tailwind', 'components', 'theming'],
    frameworks: ['react', 'nextjs', 'vite'],
    dependencies: [],
    relatedSkills: ['build-design-system', 'improve-ui', 'baseline-ui']
  }
];

for (const mapping of skillMappings) {
  const srcPath = path.join(localSkillsSource, mapping.file);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source file missing: ${srcPath}`);
    continue;
  }
  const originalContent = fs.readFileSync(srcPath, 'utf8');

  // Strip existing frontmatter if any
  let bodyContent = originalContent;
  if (originalContent.startsWith('---')) {
    const endFm = originalContent.indexOf('---', 3);
    if (endFm !== -1) {
      bodyContent = originalContent.slice(endFm + 3).trim();
    }
  }

  const frontmatter = [
    '---',
    `id: "${mapping.id}"`,
    `name: "${mapping.name}"`,
    `category: "${mapping.category}"`,
    `description: "${mapping.description.replace(/"/g, '\\"')}"`,
    `author: "${mapping.author}"`,
    `license: "${mapping.license}"`,
    `version: "${mapping.version}"`,
    `tags: [${mapping.tags.map(t => `"${t}"`).join(', ')}]`,
    `frameworks: [${mapping.frameworks.map(f => `"${f}"`).join(', ')}]`,
    `dependencies: [${mapping.dependencies.map(d => `"${d}"`).join(', ')}]`,
    `relatedSkills: [${mapping.relatedSkills.map(r => `"${r}"`).join(', ')}]`,
    `lastVerified: "${new Date().toISOString().split('T')[0]}"`,
    '---',
    '',
    bodyContent
  ].join('\n');

  const destDir = path.resolve('skills', mapping.category);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, `${mapping.id}.md`);
  fs.writeFileSync(destPath, frontmatter, 'utf8');
  console.log(`Imported skill: ${mapping.id} -> ${destPath}`);
}

