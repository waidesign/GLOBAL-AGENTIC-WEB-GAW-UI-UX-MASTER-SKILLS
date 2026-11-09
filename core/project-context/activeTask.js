/**
 * The current task: ai-brain/local/active-task.md. A small pointer file
 * (task, status, which skill files to open and why, what was left out and why,
 * acceptance criteria). It never contains skill bodies unless `gaw use --full`
 * asks for them. It lives in local/, so it is never committed, and is archived
 * when the task is done or replaced, so a stale task can't mislead a later session.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ACTIVE_TASK_FILE, TASK_ARCHIVE_DIR, ensureLocalDir } from './brainLayout.js';

export const TASK_STATUSES = ['active', 'done', 'replaced'];

const activePath = (projectDir) => path.join(projectDir, 'ai-brain', ACTIVE_TASK_FILE);
const slug = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'task';

/** { file, task, status, started } for the current task, or null. */
export function readActiveTask(projectDir) {
  const file = activePath(projectDir);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  const field = (name) => (text.match(new RegExp(`^- \\*\\*${name}\\*\\*: (.+)$`, 'm')) || [])[1]?.trim() || null;
  return {
    file: `ai-brain/${ACTIVE_TASK_FILE}`,
    task: field('Task'),
    status: (field('Status') || 'active').split(/\s/)[0].toLowerCase(),
    started: field('Started')
  };
}

/** Move the current task to local/archive/ with a final status. Returns the archive path or null. */
export function archiveActiveTask(projectDir, status = 'done') {
  const file = activePath(projectDir);
  if (!fs.existsSync(file)) return null;
  const current = readActiveTask(projectDir);
  const text = fs.readFileSync(file, 'utf8').replace(/^- \*\*Status\*\*: .+$/m, `- **Status**: ${status} (${new Date().toISOString().split('T')[0]})`);
  const archiveDir = path.join(projectDir, 'ai-brain', TASK_ARCHIVE_DIR);
  fs.mkdirSync(archiveDir, { recursive: true });
  let dest = path.join(archiveDir, `${current?.started || 'undated'}-${slug(current?.task)}.md`);
  for (let n = 2; fs.existsSync(dest); n++) dest = dest.replace(/(-\d+)?\.md$/, `-${n}.md`);
  fs.writeFileSync(dest, text, 'utf8');
  fs.unlinkSync(file);
  return path.relative(projectDir, dest).replace(/\\/g, '/');
}

/** Write a new active task. An existing one is archived as "replaced" first. Returns { file, archived }. */
export function writeActiveTask(projectDir, markdown) {
  ensureLocalDir(projectDir);
  const archived = archiveActiveTask(projectDir, 'replaced');
  fs.writeFileSync(activePath(projectDir), markdown, 'utf8');
  return { file: `ai-brain/${ACTIVE_TASK_FILE}`, archived };
}
