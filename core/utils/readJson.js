import fs from 'node:fs';

/**
 * Read a JSON file written by people or other tools. Strips a UTF-8 byte-order
 * mark first: Windows editors and PowerShell often add one, and JSON.parse
 * rejects it (which made GAW misread package.json files saved on Windows).
 */
export function readJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
}
