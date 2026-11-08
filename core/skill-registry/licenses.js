/**
 * License intelligence for skills: find a skill's real license from its source
 * and classify it, so GAW never relabels someone else's work.
 *
 * Categories:
 *   open        permissive (MIT, Apache-2.0, BSD, ISC, CC-BY-4.0, ...): may be shared and modified
 *   copyleft    may be shared and modified, but changes must keep the same license (GPL, MPL, CC-BY-SA)
 *   restricted  proprietary / source-available: may not be redistributed or modified without permission
 *   unknown     no license found
 */
const OPEN = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense', 'CC0-1.0', 'CC-BY-4.0', '0BSD']);
const COPYLEFT = new Set(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'CC-BY-SA-4.0']);

export function licenseCategory(spdx) {
  if (!spdx) return 'unknown';
  if (OPEN.has(spdx)) return 'open';
  if (COPYLEFT.has(spdx) || /^(A|L)?GPL/.test(spdx)) return 'copyleft';
  if (spdx === 'Proprietary') return 'restricted';
  return 'unknown';
}

/** Map a short license string ("MIT", "Apache 2.0", "Proprietary") to an SPDX id, or null. */
export function normalizeLicense(value) {
  const v = String(value || '').trim();
  if (!v || /^(unknown|none|n\/a|noassertion|other)$/i.test(v)) return null;
  const rules = [
    [/^mit\b/i, 'MIT'],
    [/^apache([ -]?(license)?)?[ -]?(version )?2(\.0)?\b/i, 'Apache-2.0'],
    [/^bsd[ -]?3/i, 'BSD-3-Clause'],
    [/^bsd[ -]?2/i, 'BSD-2-Clause'],
    [/^isc\b/i, 'ISC'],
    [/^unlicense\b/i, 'Unlicense'],
    [/^cc0/i, 'CC0-1.0'],
    [/^cc[ -]?by[ -]?sa/i, 'CC-BY-SA-4.0'],
    [/^cc[ -]?by\b/i, 'CC-BY-4.0'],
    [/^mpl[ -]?2/i, 'MPL-2.0'],
    [/^agpl/i, 'AGPL-3.0'],
    [/^lgpl/i, 'LGPL-3.0'],
    [/^gpl[ -]?2/i, 'GPL-2.0'],
    [/^gpl/i, 'GPL-3.0'],
    [/proprietary|all rights reserved|source[- ]available/i, 'Proprietary']
  ];
  for (const [re, spdx] of rules) if (re.test(v)) return spdx;
  return null;
}

/** Identify a license from the text of a LICENSE file. Returns an SPDX id or null. */
export function detectLicenseFromText(text) {
  const t = String(text || '');
  if (!t.trim()) return null;
  if (/Permission is hereby granted, free of charge/i.test(t)) return 'MIT';
  if (/Apache License[\s,]*Version 2\.0/i.test(t)) return 'Apache-2.0';
  if (/GNU AFFERO GENERAL PUBLIC LICENSE/i.test(t)) return 'AGPL-3.0';
  if (/GNU LESSER GENERAL PUBLIC LICENSE/i.test(t)) return 'LGPL-3.0';
  if (/GNU GENERAL PUBLIC LICENSE/i.test(t)) return /Version 2/i.test(t) ? 'GPL-2.0' : 'GPL-3.0';
  if (/Mozilla Public License,? (Version|v\.?) ?2\.0/i.test(t)) return 'MPL-2.0';
  if (/Redistribution and use in source and binary forms/i.test(t)) {
    return /Neither the name/i.test(t) ? 'BSD-3-Clause' : 'BSD-2-Clause';
  }
  if (/Permission to use, copy, modify, and\/or distribute this software for any\s+purpose/i.test(t)) return 'ISC';
  if (/free and unencumbered software released into the public domain/i.test(t)) return 'Unlicense';
  if (/CC0 1\.0 Universal/i.test(t)) return 'CC0-1.0';
  if (/Attribution-ShareAlike 4\.0/i.test(t)) return 'CC-BY-SA-4.0';
  if (/Attribution 4\.0 International/i.test(t)) return 'CC-BY-4.0';
  if (/all rights reserved|proprietary|source[- ]available|may not (copy|modify|distribute|reproduce)/i.test(t)) return 'Proprietary';
  return null;
}

const LICENSE_FILE = /^(LICEN[CS]E|COPYING)(\.(txt|md))?$/i;

/**
 * Resolve the license of a skill that came from GitHub.
 * Evidence, most specific first:
 *   1. a LICENSE file in the skill's own folder
 *   2. the `license` field of the original SKILL.md (unless it only points to a file)
 *   3. the repository license
 * Returns { spdx, category, evidence, url } (spdx null when nothing was found).
 */
export async function resolveSkillLicense(github, source, upstreamFrontmatter = null) {
  const { repo, path: skillPath = '' } = source;
  const tree = await github.tree(repo);
  const skillDir = skillPath.endsWith('SKILL.md') ? skillPath.slice(0, -'SKILL.md'.length).replace(/\/$/, '') : skillPath;
  const blobBase = tree ? `https://github.com/${repo}/blob/${tree.branch}` : `https://github.com/${repo}`;

  // 1. LICENSE file next to SKILL.md
  if (tree) {
    const own = tree.blobs.find(b => {
      const dir = b.path.includes('/') ? b.path.slice(0, b.path.lastIndexOf('/')) : '';
      return dir === skillDir && LICENSE_FILE.test(b.path.split('/').pop());
    });
    if (own) {
      const text = await github.raw(repo, tree.branch, own.path);
      const spdx = detectLicenseFromText(text);
      if (spdx) return { spdx, category: licenseCategory(spdx), evidence: 'skill license file', url: `${blobBase}/${own.path}` };
    }
  }

  // 2. Declared in the original SKILL.md
  let frontmatter = upstreamFrontmatter;
  if (!frontmatter && tree && skillPath) {
    const { parseFrontmatter } = await import('./frontmatter.js');
    const file = skillPath.endsWith('SKILL.md') ? skillPath : `${skillDir}/SKILL.md`;
    const text = await github.raw(repo, tree.branch, file);
    frontmatter = text ? parseFrontmatter(text).data : null;
  }
  const declared = normalizeLicense(frontmatter?.license);
  if (declared) {
    const file = skillPath.endsWith('SKILL.md') ? skillPath : `${skillDir}/SKILL.md`;
    return { spdx: declared, category: licenseCategory(declared), evidence: 'declared in original SKILL.md', url: `${blobBase}/${file}` };
  }

  // 3. Repository license
  const repoLicense = await github.repoLicense(repo);
  if (repoLicense) {
    const spdx = normalizeLicense(repoLicense.spdx) || detectLicenseFromText(repoLicense.text);
    if (spdx) return { spdx, category: licenseCategory(spdx), evidence: 'repository license', url: repoLicense.url };
  }

  return { spdx: null, category: 'unknown', evidence: 'no license found', url: `https://github.com/${repo}` };
}
