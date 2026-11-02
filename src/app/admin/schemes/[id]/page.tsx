import Link from "next/link";
import { notFound } from "next/navigation";
import { SCHEME_CATEGORIES, STATES } from "@/data/options";
import { requireAdmin } from "@/lib/admin-auth";
import { rowToScheme, type SchemeRow } from "@/lib/mappers";
import { adminDb } from "@/lib/supabase";
import type { L, Scheme } from "@/lib/types";
import { deleteScheme, saveScheme } from "../../actions";

/** Add a new scheme (/admin/schemes/new) or edit one (/admin/schemes/pm-kisan). */
export default async function EditScheme({ params, searchParams }: PageProps<"/admin/schemes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  let s: Scheme | null = null;
  if (!isNew) {
    const { data } = await adminDb().from("schemes").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    s = rowToScheme(data as SchemeRow);
  }

  const toLines = (items?: L[]) => (items ?? []).map((x) => `${x.en} | ${x.hi}`).join("\n");

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-link hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold">{isNew ? "Add scheme" : `Edit: ${s!.name.en}`}</h1>
      {error && <p className="mt-4 rounded-xl bg-bad-soft p-3 font-semibold text-bad">⚠️ {error}</p>}

      <form action={saveScheme} className="mt-6 space-y-6">
        <input type="hidden" name="original_id" value={isNew ? "" : s!.id} />

        <Box title="Basics">
          <Grid>
            <Field label="ID (used in the URL, e.g. pm-kisan)">
              <input name="id" required defaultValue={s?.id} pattern="[a-z0-9\-]+" className={input} />
            </Field>
            <Field label="Category">
              <select name="category" defaultValue={s?.category ?? "money"} className={input}>
                {SCHEME_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label.en}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Level">
              <select name="level" defaultValue={s?.level ?? "central"} className={input}>
                <option value="central">Central</option>
                <option value="state">State</option>
                <option value="district">District</option>
              </select>
            </Field>
            <Field label="State (for state / district schemes)">
              <select name="state" defaultValue={s?.state ?? ""} className={input}>
                <option value="">—</option>
                {STATES.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </Field>
            <Field label="District (for district schemes)">
              <input name="district" defaultValue={s?.district} className={input} />
            </Field>
            <Field label="Rough yearly value in ₹ (for sorting)">
              <input name="benefit_value" type="number" min={0} defaultValue={s?.benefitValue ?? 0} className={input} />
            </Field>
          </Grid>
        </Box>

        <Box title="Text (English and Hindi)">
          <TwoLang name="name" label="Name" value={s?.name} />
          <TwoLang name="ministry" label="Ministry / department" value={s?.ministry} />
          <TwoLang name="summary" label="One-line summary (very simple)" value={s?.summary} />
          <TwoLang name="benefit" label="What you get" value={s?.benefit} textarea />
        </Box>

        <Box title="Lists">
          <p className="text-sm text-muted">
            One item per line, written as <code>English | Hindi</code>
          </p>
          <Field label="Who can apply">
            <textarea name="who_can_apply" rows={4} defaultValue={toLines(s?.whoCanApply)} className={input} />
          </Field>
          <Field label="How to apply (steps in order)">
            <textarea name="how_to_apply" rows={5} defaultValue={toLines(s?.howToApply)} className={input} />
          </Field>
          <Grid>
            <Field label="Document IDs (comma separated, e.g. aadhaar, bank_passbook)">
              <input name="documents" defaultValue={s?.documents.join(", ")} className={input} />
            </Field>
            <Field label="Search keywords (comma separated, English and Hindi)">
              <input name="keywords" defaultValue={s?.keywords.join(", ")} className={input} />
            </Field>
          </Grid>
        </Box>

        <Box title="Links">
          <Grid>
            <Field label="Apply link (official)">
              <input name="apply_link" type="url" required defaultValue={s?.applyLink} className={input} />
            </Field>
            <Field label="Official source (where you checked the facts)">
              <input name="source_url" type="url" required defaultValue={s?.sourceUrl} className={input} />
            </Field>
            <Field label="Helpline number">
              <input name="helpline" defaultValue={s?.helpline} className={input} />
            </Field>
          </Grid>
        </Box>

        <Box title="Eligibility rules (JSON)">
          <p className="text-sm text-muted">
            A list of rules. The user is eligible if they match <b>any one</b> rule. Fields: ageMin, ageMax, genders, areas, occupations,
            categories, incomeMax, needFlags, excludeFlags. See <code>src/lib/types.ts</code>.
          </p>
          <textarea
            name="rules"
            rows={8}
            defaultValue={JSON.stringify(s?.rules ?? [{ ageMin: 18 }], null, 2)}
            className={`${input} font-mono text-sm`}
          />
        </Box>

        <Box title="Verification">
          <Grid>
            <Field label="Last checked against official source">
              <input name="last_verified" type="date" defaultValue={s?.lastVerified ?? new Date().toISOString().slice(0, 10)} className={input} />
            </Field>
            <div className="space-y-3 pt-6">
              <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" name="mark_verified" className="h-5 w-5" /> I checked this today (sets date to today)
              </label>
              <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" name="is_published" defaultChecked={s?.isPublished ?? true} className="h-5 w-5" /> Show on public site
              </label>
            </div>
          </Grid>
        </Box>

        <div className="flex gap-3">
          <button className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary hover:bg-primary-hover">💾 Save</button>
          <Link href="/admin" className="rounded-xl border-2 border-line px-6 py-3 font-semibold">
            Cancel
          </Link>
        </div>
      </form>

      {!isNew && (
        <form action={deleteScheme} className="mt-10 border-t pt-6">
          <input type="hidden" name="id" value={s!.id} />
          <p className="text-sm text-muted">Tip: to hide a scheme, untick “Show on public site” instead of deleting.</p>
          <button className="mt-2 text-sm font-semibold text-bad hover:underline">Delete this scheme permanently</button>
        </form>
      )}
    </div>
  );
}

const input = "w-full rounded-xl border-2 border-line-strong bg-surface px-3 py-2 text-fg outline-none focus:border-link";

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-fg-2">{label}</span>
      {children}
    </label>
  );
}

function TwoLang({ name, label, value, textarea }: { name: string; label: string; value?: L; textarea?: boolean }) {
  return (
    <Grid>
      {(["en", "hi"] as const).map((l) => (
        <Field key={l} label={`${label} (${l === "en" ? "English" : "हिंदी"})`}>
          {textarea ? (
            <textarea name={`${name}_${l}`} rows={3} defaultValue={value?.[l]} required={l === "en"} className={input} />
          ) : (
            <input name={`${name}_${l}`} defaultValue={value?.[l]} required={l === "en"} className={input} />
          )}
        </Field>
      ))}
    </Grid>
  );
}
