import { INCOME_BRACKETS, type Profile, type Rule, type Scheme } from "./types";

/**
 * The eligibility engine. Pure logic, no AI, so results are exact and explainable.
 * A scheme matches if the profile passes ANY one of its rules.
 */

function incomeRank(bracket: string): number {
  return INCOME_BRACKETS.indexOf(bracket as (typeof INCOME_BRACKETS)[number]);
}

export function matchesRule(p: Profile, r: Rule): boolean {
  if (r.ageMin !== undefined && p.age < r.ageMin) return false;
  if (r.ageMax !== undefined && p.age > r.ageMax) return false;
  if (r.genders && !r.genders.includes(p.gender)) return false;
  if (r.areas && !r.areas.includes(p.area)) return false;
  if (r.occupations && !r.occupations.includes(p.occupation)) return false;
  if (r.categories && !r.categories.includes(p.category)) return false;
  if (r.incomeMax && incomeRank(p.income) > incomeRank(r.incomeMax)) return false;
  if (r.needFlags && !r.needFlags.every((f) => p.flags.includes(f))) return false;
  if (r.excludeFlags && r.excludeFlags.some((f) => p.flags.includes(f))) return false;
  return true;
}

export function isEligible(p: Profile, s: Scheme): boolean {
  // Only central schemes, or schemes for the user's own state.
  if (s.level !== "central" && s.state !== p.state) return false;
  return s.rules.some((r) => matchesRule(p, r));
}

/** All schemes the user is likely eligible for, biggest benefit first. */
export function findEligible(p: Profile, schemes: Scheme[]): Scheme[] {
  return schemes.filter((s) => isEligible(p, s)).sort((a, b) => b.benefitValue - a.benefitValue);
}
