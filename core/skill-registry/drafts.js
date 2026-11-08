/**
 * AI-drafted gaw.json fields that wait for a person's review (GSS Ranking v1).
 * Drafted fields are listed in the contract's "drafts" array. Until they are
 * approved, ranking and rankability levels ignore them.
 */
import { readSkillFolder, writeSkillFolder } from './gss.js';
import { MAX_KEYWORDS, MAX_KEYWORD_LENGTH } from './rankability.js';

export const DRAFTABLE_FIELDS = ['whenToUse', 'whenNotToUse', 'keywords'];

const isEmpty = (v) => v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
const clean = (list) => [...new Set((Array.isArray(list) ? list : []).map(s => String(s).replace(/\s+/g, ' ').trim()).filter(Boolean))];

/**
 * Add drafted fields to a skill. Only fills fields that are empty (never touches
 * author or derived fields), enforces the anti-gaming caps, and records the
 * field names in "drafts". Returns the list of fields drafted.
 */
export function addDrafts(dir, draft) {
  const skill = readSkillFolder(dir);
  const contract = skill.contract;
  const drafted = [];

  for (const field of DRAFTABLE_FIELDS) {
    if (!draft[field] || !isEmpty(contract[field])) continue;
    let value = clean(draft[field]);
    if (field === 'keywords') value = value.filter(k => k.length <= MAX_KEYWORD_LENGTH).slice(0, MAX_KEYWORDS);
    else value = value.filter(v => v.length <= 240).slice(0, 6);
    if (!value.length) continue;
    contract[field] = value;
    drafted.push(field);
  }

  if (drafted.length) {
    contract.drafts = [...new Set([...(contract.drafts || []), ...drafted])].sort();
    writeSkillFolder(dir, skill);
  }
  return drafted;
}

/** The drafted fields of a skill and their values: { field: value }. */
export function listDrafts(contract) {
  return Object.fromEntries((contract?.drafts || []).filter(f => contract[f] !== undefined).map(f => [f, contract[f]]));
}

/** Approve drafts (all, or the given fields): they become regular fields that count for ranking. */
export function approveDrafts(dir, fields = null) {
  const skill = readSkillFolder(dir);
  const drafts = skill.contract.drafts || [];
  const approved = fields ? drafts.filter(f => fields.includes(f)) : drafts;
  if (!approved.length) return [];
  const rest = drafts.filter(f => !approved.includes(f));
  if (rest.length) skill.contract.drafts = rest;
  else delete skill.contract.drafts;
  writeSkillFolder(dir, skill);
  return approved;
}

/** Reject drafts (all, or the given fields): the drafted values are deleted. */
export function rejectDrafts(dir, fields = null) {
  const skill = readSkillFolder(dir);
  const drafts = skill.contract.drafts || [];
  const rejected = fields ? drafts.filter(f => fields.includes(f)) : drafts;
  if (!rejected.length) return [];
  for (const f of rejected) delete skill.contract[f];
  const rest = drafts.filter(f => !rejected.includes(f));
  if (rest.length) skill.contract.drafts = rest;
  else delete skill.contract.drafts;
  writeSkillFolder(dir, skill);
  return rejected;
}
