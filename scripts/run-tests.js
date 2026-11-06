import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function findTestFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findTestFiles(full));
    } else if (item.isFile() && item.name.endsWith('.test.js')) {
      results.push(full);
    }
  }
  return results;
}

const testFiles = findTestFiles('tests');
console.log(`Found ${testFiles.length} test files to execute.\n`);

let passed = 0;
let failed = 0;

for (const file of testFiles) {
  console.log(`▶ Running: ${file}`);
  const res = spawnSync('node', ['--test', file], { stdio: 'inherit' });
  if (res.status === 0) {
    passed++;
  } else {
    failed++;
  }
  console.log('--------------------------------------------------');
}

console.log(`\nTest Run Summary: ${passed} passed, ${failed} failed out of ${testFiles.length} suites.`);
if (failed > 0) {
  process.exit(1);
}

