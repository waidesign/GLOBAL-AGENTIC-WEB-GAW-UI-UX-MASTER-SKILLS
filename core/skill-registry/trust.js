/**
 * Trust levels: where a skill comes from and who has checked it. Shown wherever
 * GAW shows a skill, so people and agents know how far to trust its instructions.
 *
 *   official   in GAW's own library, reviewed by GAW maintainers
 *   verified   in its author's repo, checked and approved by GAW (reserved: comes with GAW's verified list)
 *   community  from someone's GitHub repo, not reviewed by GAW
 *   personal   written or added locally by you
 *   project    in this project's ai-brain/skills/ folder
 */
export const TRUST_LEVELS = {
  official: { label: 'official', note: 'reviewed by GAW' },
  verified: { label: 'verified', note: 'checked by GAW at a pinned version' },
  community: { label: 'community', note: 'from GitHub, not reviewed by GAW' },
  personal: { label: 'personal', note: 'your own skill, not reviewed by GAW' },
  project: { label: 'project', note: "this project's own skill" }
};

/**
 * A skill's trust level. `library` is set by the registry: 'official' (GAW's
 * library), 'personal' (~/.gaw/skills) or 'project' (ai-brain/skills).
 */
export function trustLevel(skill) {
  if (!skill) return 'community';
  if (skill.library === 'project') return 'project';
  // A skill can never declare itself verified: that will come only from GAW's own
  // list of verified repos and versions, not from anything inside the skill.
  if (skill.library === 'personal') return skill.contract?.source?.repo ? 'community' : 'personal';
  return 'official';
}

/** True when a person should look before an agent follows the skill: not reviewed by GAW and able to run commands. */
export function needsCaution(skill) {
  const level = trustLevel(skill);
  return (level === 'community' || level === 'personal') && (skill.contract?.permissions || []).includes('shell');
}

/** "community — from GitHub, not reviewed by GAW" */
export function describeTrust(skill) {
  const t = TRUST_LEVELS[trustLevel(skill)];
  return `${t.label} — ${t.note}`;
}
