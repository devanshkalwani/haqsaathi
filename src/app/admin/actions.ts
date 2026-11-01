"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endAdminSession, passwordIsCorrect, requireAdmin, startAdminSession } from "@/lib/admin-auth";
import { schemeToRow } from "@/lib/mappers";
import { adminDb } from "@/lib/supabase";
import type { L, Rule, Scheme } from "@/lib/types";

/* ---------------- Login / logout ---------------- */

export async function login(formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  if (!passwordIsCorrect(pw)) redirect("/admin/login?error=1");
  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin/login");
}

/* ---------------- Schemes ---------------- */

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const bi = (f: FormData, k: string): L => ({ en: str(f, `${k}_en`), hi: str(f, `${k}_hi`) });
const list = (f: FormData, k: string) =>
  str(f, k)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

/** Textarea with one item per line, written as:  English text | Hindi text */
const lines = (f: FormData, k: string): L[] =>
  str(f, k)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en, hi] = line.split("|").map((x) => x.trim());
      return { en: en ?? "", hi: hi || en || "" };
    });

export async function saveScheme(formData: FormData) {
  await requireAdmin();
  const originalId = str(formData, "original_id");
  const back = (msg: string) => redirect(`/admin/schemes/${originalId || "new"}?error=${encodeURIComponent(msg)}`);

  const id = str(formData, "id").toLowerCase();
  if (!/^[a-z0-9-]+$/.test(id)) back("ID can only have small letters, numbers and dashes, e.g. pm-kisan");

  let rules: Rule[] = [];
  try {
    rules = JSON.parse(str(formData, "rules") || "[]");
    if (!Array.isArray(rules)) throw new Error();
  } catch {
    back("Eligibility rules must be valid JSON: a list like [ { ... } ]");
  }

  const level = str(formData, "level") as Scheme["level"];
  const scheme: Scheme = {
    id,
    level,
    state: level === "central" ? undefined : str(formData, "state") || undefined,
    district: level === "district" ? str(formData, "district") || undefined : undefined,
    category: str(formData, "category") as Scheme["category"],
    name: bi(formData, "name"),
    ministry: bi(formData, "ministry"),
    summary: bi(formData, "summary"),
    benefit: bi(formData, "benefit"),
    benefitValue: Number(str(formData, "benefit_value")) || 0,
    whoCanApply: lines(formData, "who_can_apply"),
    documents: list(formData, "documents"),
    howToApply: lines(formData, "how_to_apply"),
    applyLink: str(formData, "apply_link"),
    helpline: str(formData, "helpline") || undefined,
    keywords: list(formData, "keywords"),
    rules,
    sourceUrl: str(formData, "source_url"),
    lastVerified: formData.get("mark_verified") ? new Date().toISOString().slice(0, 10) : str(formData, "last_verified"),
    isPublished: formData.get("is_published") === "on",
  };

  if (!scheme.name.en || !scheme.applyLink || !scheme.sourceUrl) back("Name (English), apply link and official source are required");
  if (level !== "central" && !scheme.state) back("State and district schemes need a state");

  const db = adminDb();
  // If the ID was changed, remove the old row after saving the new one.
  const { error } = await db.from("schemes").upsert(schemeToRow(scheme));
  if (error) back(error.message);
  if (originalId && originalId !== id) await db.from("schemes").delete().eq("id", originalId);

  updateTag("schemes"); // the public site shows the change straight away
  redirect(`/admin?saved=${id}`);
}

export async function deleteScheme(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const { error } = await adminDb().from("schemes").delete().eq("id", id);
  if (error) redirect(`/admin/schemes/${id}?error=${encodeURIComponent(error.message)}`);
  updateTag("schemes");
  redirect("/admin?deleted=" + id);
}

/* ---------------- Error reports ---------------- */

export async function setReportStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = str(formData, "status");
  if (!["open", "fixed", "ignored"].includes(status)) return;
  await adminDb().from("error_reports").update({ status }).eq("id", id);
  redirect("/admin#reports");
}
