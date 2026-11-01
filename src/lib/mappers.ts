import type { DocumentInfo } from "@/data/documents";
import type { Scheme } from "./types";

/**
 * The database uses snake_case column names (benefit_value), the app uses camelCase (benefitValue).
 * These functions convert between the two.
 */

export type SchemeRow = {
  id: string;
  level: Scheme["level"];
  state: string | null;
  district: string | null;
  category: Scheme["category"];
  name: Scheme["name"];
  ministry: Scheme["ministry"];
  summary: Scheme["summary"];
  benefit: Scheme["benefit"];
  benefit_value: number;
  who_can_apply: Scheme["whoCanApply"];
  documents: string[];
  how_to_apply: Scheme["howToApply"];
  apply_link: string;
  helpline: string | null;
  keywords: string[];
  rules: Scheme["rules"];
  source_url: string;
  last_verified: string;
  is_published: boolean;
};

export function rowToScheme(r: SchemeRow): Scheme {
  return {
    id: r.id,
    level: r.level,
    state: r.state ?? undefined,
    district: r.district ?? undefined,
    category: r.category,
    name: r.name,
    ministry: r.ministry,
    summary: r.summary,
    benefit: r.benefit,
    benefitValue: r.benefit_value,
    whoCanApply: r.who_can_apply,
    documents: r.documents,
    howToApply: r.how_to_apply,
    applyLink: r.apply_link,
    helpline: r.helpline ?? undefined,
    keywords: r.keywords,
    rules: r.rules,
    sourceUrl: r.source_url,
    lastVerified: r.last_verified,
    isPublished: r.is_published,
  };
}

export function schemeToRow(s: Scheme): SchemeRow {
  return {
    id: s.id,
    level: s.level,
    state: s.state ?? null,
    district: s.district ?? null,
    category: s.category,
    name: s.name,
    ministry: s.ministry,
    summary: s.summary,
    benefit: s.benefit,
    benefit_value: s.benefitValue,
    who_can_apply: s.whoCanApply,
    documents: s.documents,
    how_to_apply: s.howToApply,
    apply_link: s.applyLink,
    helpline: s.helpline ?? null,
    keywords: s.keywords,
    rules: s.rules,
    source_url: s.sourceUrl,
    last_verified: s.lastVerified,
    is_published: s.isPublished ?? true,
  };
}

export type DocumentRow = { id: string; name: DocumentInfo["name"]; how_to_get: DocumentInfo["howToGet"] };

export function rowsToDocuments(rows: DocumentRow[]): Record<string, DocumentInfo> {
  return Object.fromEntries(rows.map((r) => [r.id, { name: r.name, howToGet: r.how_to_get }]));
}
