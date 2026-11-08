import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { ProjectDetector } from '../../core/project-detector/ProjectDetector.js';

function project(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gaw-detect-'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), content, 'utf8');
  return dir;
}
const pkg = (deps = {}) => JSON.stringify({ name: 'demo', dependencies: deps });

test('detector - JavaScript projects without UI signals are not called frontend', () => {
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg() })).framework, 'node');
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg({ express: '^4' }) })).framework, 'express');
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg({ '@nestjs/core': '^10' }) })).framework, 'nestjs');
});

test('detector - frontend and UI frameworks are still recognized', () => {
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg(), 'index.html': '<html></html>' })).framework, 'plain-frontend');
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg({ react: '^18', vite: '^5' }) })).framework, 'react-vite');
  assert.equal(ProjectDetector.detect(project({ 'package.json': pkg({ next: '^14' }) })).framework, 'nextjs');
});

test('detector - languages come from the project files, not assumed', () => {
  const py = ProjectDetector.detect(project({ 'requirements.txt': 'fastapi==0.110\nuvicorn' }));
  assert.deepEqual(py.languages, ['Python']);
  assert.equal(py.framework, 'fastapi');
  assert.deepEqual(ProjectDetector.detect(project({ 'go.mod': 'module demo' })).languages, ['Go']);
  assert.deepEqual(ProjectDetector.detect(project({ 'tsconfig.json': '{}', 'package.json': pkg() })).languages, ['TypeScript']);
  const empty = ProjectDetector.detect(project({ 'notes.md': '# Notes' }));
  assert.deepEqual(empty.languages, []);
  assert.equal(empty.framework, 'unknown');
});
