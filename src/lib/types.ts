// Shared types used across the app.

/** Text in both languages. Every user-facing string uses this. */
export type L = { en: string; hi: string };

export type Lang = "en" | "hi";

export type Gender = "male" | "female" | "other";
export type Area = "rural" | "urban";
export type Category = "general" | "obc" | "sc" | "st" | "ews";

export type Occupation =
  | "farmer"
  | "labourer" // construction or daily wage worker
  | "domestic_worker"
  | "street_vendor"
  | "artisan" // carpenter, tailor, potter, cobbler, etc.
  | "small_business"
  | "student"
  | "salaried"
  | "homemaker"
  | "unemployed"
  | "retired";

/** Yearly family income ranges. Ordered from lowest to highest. */
export const INCOME_BRACKETS = ["upto_1l", "1l_2_5l", "2_5l_5l", "5l_9l", "above_9l"] as const;
export type IncomeBracket = (typeof INCOME_BRACKETS)[number];

/** Yes/no facts about the family, picked in the last quiz step. */
export type Flag =
  | "owns_farmland"
  | "pays_income_tax"
  | "has_bank_account"
  | "has_pucca_house"
  | "has_lpg"
  | "daughter_under_10"
  | "pregnant_or_new_mother"
  | "has_disability"
  | "has_bpl_card";

/** Everything we learn about the user from the quiz. */
export type Profile = {
  age: number;
  gender: Gender;
  area: Area;
  state: string;
  occupation: Occupation;
  income: IncomeBracket;
  category: Category;
  flags: Flag[];
};

/**
 * One way to qualify for a scheme. Every field that is set must match.
 * A scheme has a list of rules; matching ANY one rule means eligible.
 */
export type Rule = {
  ageMin?: number;
  ageMax?: number;
  genders?: Gender[];
  areas?: Area[];
  occupations?: Occupation[];
  categories?: Category[];
  incomeMax?: IncomeBracket; // income must be this bracket or lower
  needFlags?: Flag[]; // user must have all of these
  excludeFlags?: Flag[]; // user must have none of these
};

export type SchemeCategory =
  | "farmers"
  | "health"
  | "housing"
  | "money"
  | "workers"
  | "women"
  | "students"
  | "elderly"
  | "business";

export type Scheme = {
  id: string;
  level: "central" | "state" | "district";
  state?: string; // only for state/district schemes
  category: SchemeCategory;
  name: L;
  ministry: L;
  summary: L; // one line, very simple
  benefit: L; // what you get
  benefitValue: number; // rough yearly ₹ value, only used for sorting
  whoCanApply: L[];
  documents: string[]; // ids from documents.ts
  howToApply: L[];
  applyLink: string;
  helpline?: string;
  keywords: string[]; // extra words to help search and chat
  rules: Rule[];
  sourceUrl: string;
  lastVerified: string; // YYYY-MM-DD
};
