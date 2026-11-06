import fs from 'node:fs';
import path from 'node:path';

function findEmptyDirs(dir) {
  let empty = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  if (entries.length === 0) {
    empty.push(dir);
  } else {
    for (const e of entries) {
      if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') {
        const sub = path.join(dir, e.name);
        const subEmpty = findEmptyDirs(sub);
        empty = empty.concat(subEmpty);
      }
    }
  }
  return empty;
}

const emptyDirs = findEmptyDirs('.');
console.log(`Empty directories found: ${emptyDirs.length}`);
for (const d of emptyDirs) {
  console.log(`- ${d}`);
}

