import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const skillsToFetch = [
  { slug: 'react-router-framework-mode', category: 'architecture', name: 'React Router Architecture', frameworks: ['react', 'react-router'] },
  { slug: 'rams', category: 'code-quality', name: 'Rams UI Code Quality Review', frameworks: ['react', 'vue', 'svelte'] },
  { slug: 'oklch-skill', category: 'color', name: 'OKLCH Color Systems', frameworks: ['any', 'tailwind'] },
  { slug: 'better-colors', category: 'color', name: 'Better Colors Workflow', frameworks: ['tailwind', 'css'] },
  { slug: 'diagnosing-bugs', category: 'debugging', name: 'Systematic Bug Diagnosis', frameworks: ['any'] },
  { slug: 'react-best-practices', category: 'frontend-frameworks', name: 'React Architecture & Best Practices', frameworks: ['react', 'nextjs'] },
  { slug: 'animation-on-scroll', category: 'interaction', name: 'Scroll-Driven Interaction', frameworks: ['framer-motion', 'react', 'css'] },
  { slug: 'masked-reveal', category: 'micro-interactions', name: 'Masked Reveal Micro-Interactions', frameworks: ['framer-motion', 'tailwind'] },
  { slug: 'vue-testing-best-practices', category: 'testing', name: 'Frontend Component Testing', frameworks: ['vue', 'react', 'any'] },
  { slug: 'swiss-design', category: 'typography', name: 'Swiss Design & Typography Systems', frameworks: ['any'] },
  { slug: 'better-typography', category: 'typography', name: 'Better Web Typography', frameworks: ['any', 'css', 'tailwind'] },
  { slug: 'remotion-best-practices', category: 'video', name: 'Remotion Video Engineering', frameworks: ['react', 'remotion'] },
  { slug: 'company-logos', category: 'components', name: 'Component Layouts & Logo Clouds', frameworks: ['react', 'tailwind'] },
  { slug: 'container-lines', category: 'components', name: 'Container & Border Layout Components', frameworks: ['react', 'tailwind'] },
  { slug: 'create-design-md', category: 'tooling', name: 'Design.md Tooling Generator', frameworks: ['any'] }
];

console.log('Fetching extended skills from upstream registry for empty categories...\n');

for (const item of skillsToFetch) {
  try {
    console.log(`Fetching ${item.slug} -> skills/${item.category}/...`);
    const output = execSync(`npx --yes ui-skills get ${item.slug}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    let content = output.replace(/^npm notice[^\n]*\n/gm, '').trim();

    let name = item.name;
    let description = `Authoritative upstream skill for ${item.category}`;

    if (content.startsWith('---')) {
      const endFm = content.indexOf('---', 3);
      if (endFm !== -1) {
        const fmText = content.slice(3, endFm);
        const nameMatch = fmText.match(/name:\s*(.+)/);
        const descMatch = fmText.match(/description:\s*(.+)/);
        if (nameMatch) name = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
        content = content.slice(endFm + 3).trim();
      }
    }

    const frontmatter = [
      '---',
      `id: "${item.slug}"`,
      `name: "${name}"`,
      `category: "${item.category}"`,
      `description: "${description.replace(/"/g, '\\"')}"`,
      `author: "ui-skills"`,
      `license: "MIT"`,
      `version: "1.0.0"`,
      `tags: [${[item.slug, item.category].map(t => `"${t}"`).join(', ')}]`,
      `frameworks: [${item.frameworks.map(f => `"${f}"`).join(', ')}]`,
      `dependencies: []`,
      `relatedSkills: []`,
      `lastVerified: "${new Date().toISOString().split('T')[0]}"`,
      '---',
      '',
      content
    ].join('\n');

    const destDir = path.resolve('skills', item.category);
    fs.mkdirSync(destDir, { recursive: true });
    const destPath = path.join(destDir, `${item.slug}.md`);
    fs.writeFileSync(destPath, frontmatter, 'utf8');
    console.log(`Saved: ${destPath}`);
  } catch (err) {
    console.error(`Failed to fetch ${item.slug}:`, err.message);
  }
}

console.log('\nExtended skills population complete.');

