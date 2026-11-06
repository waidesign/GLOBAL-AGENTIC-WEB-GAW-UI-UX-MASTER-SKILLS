import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const upstreamSkillsToImport = [
  { slug: 'baseline-ui', category: 'systems', frameworks: ['react', 'nextjs', 'tailwind'], dependencies: [], relatedSkills: ['improve-ui', 'frontend-design'] },
  { slug: 'ui-skills-root', category: 'systems', frameworks: ['any'], dependencies: [], relatedSkills: ['baseline-ui'] },
  { slug: 'create-design-md', category: 'design-systems', frameworks: ['any'], dependencies: [], relatedSkills: ['build-design-system'] },
  { slug: 'fixing-accessibility', category: 'accessibility', frameworks: ['any'], dependencies: [], relatedSkills: ['improve-ui'] },
  { slug: 'fixing-metadata', category: 'seo', frameworks: ['nextjs', 'html', 'react'], dependencies: [], relatedSkills: [] },
  { slug: 'fixing-motion-performance', category: 'performance', frameworks: ['react', 'nextjs', 'framer-motion'], dependencies: [], relatedSkills: ['improve-animations'] },
  { slug: 'tailwindcss', category: 'frontend', frameworks: ['tailwind', 'react', 'nextjs', 'vue'], dependencies: [], relatedSkills: ['baseline-ui'] },
  { slug: 'landing-page', category: 'ui-ux', frameworks: ['react', 'nextjs', 'tailwind'], dependencies: [], relatedSkills: ['frontend-design'] },
  { slug: 'pricing-page', category: 'ui-ux', frameworks: ['react', 'nextjs', 'tailwind'], dependencies: [], relatedSkills: ['landing-page'] },
  { slug: 'animation-systems', category: 'animation-motion', frameworks: ['framer-motion', 'tailwind', 'react'], dependencies: [], relatedSkills: ['improve-animations'] },
  { slug: 'threejs', category: '3d', frameworks: ['threejs', 'react-three-fiber'], dependencies: [], relatedSkills: [] }
];

console.log('Fetching upstream skills from ui-skills registry...');

for (const item of upstreamSkillsToImport) {
  try {
    console.log(`Fetching ${item.slug}...`);
    const output = execSync(`npx --yes ui-skills get ${item.slug}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    // Clean output (strip npm notice if present)
    let content = output.replace(/^npm notice[^\n]*\n/gm, '').trim();
    
    // Extract description & name if present in frontmatter
    let name = item.slug;
    let description = `Upstream UI skill for ${item.slug}`;
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
      `dependencies: [${item.dependencies.map(d => `"${d}"`).join(', ')}]`,
      `relatedSkills: [${item.relatedSkills.map(r => `"${r}"`).join(', ')}]`,
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

console.log('Upstream import complete.');

