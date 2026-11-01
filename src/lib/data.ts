import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { DOCUMENTS, type DocumentInfo } from "@/data/documents";
import { SCHEMES } from "@/data/schemes";
import { rowToScheme, rowsToDocuments, type DocumentRow, type SchemeRow } from "./mappers";
import { isDbConfigured, publicDb } from "./supabase";
import type { Scheme } from "./types";

/**
 * Where the app gets its data. Server-only.
 *
 * - Supabase configured → reads from the database.
 * - Not configured (or database error) → uses local sample data from src/data/.
 *
 * Results are cached for an hour. When an admin saves a change, the admin panel
 * calls updateTag("schemes") so the site shows it straight away.
 */

export async function getSchemes(): Promise<Scheme[]> {
  "use cache";
  cacheTag("schemes");
  cacheLife("hours");

  if (!isDbConfigured) return SCHEMES;

  const { data, error } = await publicDb().from("schemes").select("*").eq("is_published", true).order("id");
  if (error) {
    console.error("Could not load schemes from Supabase, using local data:", error.message);
    return SCHEMES;
  }
  return (data as SchemeRow[]).map(rowToScheme);
}

export async function getDocuments(): Promise<Record<string, DocumentInfo>> {
  "use cache";
  cacheTag("documents");
  cacheLife("hours");

  if (!isDbConfigured) return DOCUMENTS;

  const { data, error } = await publicDb().from("documents").select("*");
  if (error) {
    console.error("Could not load documents from Supabase, using local data:", error.message);
    return DOCUMENTS;
  }
  return rowsToDocuments(data as DocumentRow[]);
}

export async function getSchemeById(id: string): Promise<Scheme | undefined> {
  return (await getSchemes()).find((s) => s.id === id);
}
