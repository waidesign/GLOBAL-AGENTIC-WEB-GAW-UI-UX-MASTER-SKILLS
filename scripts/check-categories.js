import { execSync } from 'node:child_process';

const targetCategories = [
  'architecture', 'code-quality', 'color', 'components', 'debugging',
  'frameworks', 'interaction', 'motion', 'testing', 'tooling', 'typography', 'video'
];

console.log('Inspecting upstream ui-skills for each category...\n');

for (const cat of targetCategories) {
  try {
    const out = execSync(`npx --yes ui-skills list --category ${cat}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = out.split('\n')
      .map(l => l.trim())
      .filter(l => l.includes('—') && !l.startsWith('npm notice'));
    console.log(`[${cat}] -> ${lines.length} skills found in registry`);
    for (const l of lines.slice(0, 3)) {
      console.log(`   • ${l}`);
    }
    console.log('');
  } catch (err) {
    console.log(`[${cat}] -> error: ${err.message}`);
  }
}

