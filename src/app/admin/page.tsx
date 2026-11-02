import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { rowToScheme, type SchemeRow } from "@/lib/mappers";
import { adminDb, isDbConfigured } from "@/lib/supabase";
import { logout, setReportStatus } from "./actions";

type ReportRow = { id: number; scheme_id: string; message: string; status: string; created_at: string };

const DAYS_BEFORE_RECHECK = 60;

/** How many days ago a date was. */
function daysOld(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
}

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;

  if (!isDbConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <Shell>
        <p className="rounded-xl bg-warn-soft p-4 text-warn-fg">
          The database is not connected yet. Follow <b>SETUP.md</b> to add your Supabase keys to <code>.env.local</code>.
        </p>
      </Shell>
    );
  }

  const db = adminDb();
  const [{ data: schemeRows }, { data: reportRows }] = await Promise.all([
    db.from("schemes").select("*").order("updated_at", { ascending: false }),
    db.from("error_reports").select("*").eq("status", "open").order("created_at", { ascending: false }),
  ]);
  const schemes = ((schemeRows ?? []) as SchemeRow[]).map(rowToScheme);
  const reports = (reportRows ?? []) as ReportRow[];

  const stale = schemes.filter((s) => daysOld(s.lastVerified) > DAYS_BEFORE_RECHECK);

  return (
    <Shell>
      {saved && <Notice>✓ Saved “{saved}”. The public site is updated.</Notice>}
      {deleted && <Notice>🗑️ Deleted “{deleted}”.</Notice>}

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Schemes" value={schemes.length} />
        <Stat label="Open error reports" value={reports.length} warn={reports.length > 0} />
        <Stat label={`Need re-check (> ${DAYS_BEFORE_RECHECK} days)`} value={stale.length} warn={stale.length > 0} />
      </div>

      {/* Error reports */}
      <section id="reports" className="mt-8">
        <h2 className="text-xl font-bold">🚩 Open error reports</h2>
        {reports.length === 0 ? (
          <p className="mt-2 text-muted">No open reports. 🎉</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4">
                <div>
                  <Link href={`/admin/schemes/${r.scheme_id}`} className="font-semibold text-link hover:underline">
                    {r.scheme_id}
                  </Link>
                  <p className="mt-1">{r.message}</p>
                  <p className="mt-1 text-xs text-muted">{new Date(r.created_at).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2">
                  {(["fixed", "ignored"] as const).map((status) => (
                    <form key={status} action={setReportStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value={status} />
                      <button className="rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-surface-2">
                        {status === "fixed" ? "✓ Fixed" : "Ignore"}
                      </button>
                    </form>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Schemes table */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📚 Schemes</h2>
          <Link href="/admin/schemes/new" className="rounded-xl bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover">
            + Add scheme
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-fg-2">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Level</th>
                <th className="p-3">Category</th>
                <th className="p-3">Last checked</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s) => {
                const old = daysOld(s.lastVerified) > DAYS_BEFORE_RECHECK;
                return (
                  <tr key={s.id} className="border-t border-line">
                    <td className="p-3">
                      <p className="font-semibold">{s.name.en}</p>
                      <p className="text-xs text-muted">{s.id}</p>
                    </td>
                    <td className="p-3">{s.level === "central" ? "Central" : `${s.level} · ${s.state}`}</td>
                    <td className="p-3">{s.category}</td>
                    <td className={`p-3 ${old ? "font-semibold text-bad" : ""}`}>
                      {s.lastVerified} {old && "⚠️"}
                    </td>
                    <td className="p-3">{s.isPublished ? "🟢 Live" : "⚪ Hidden"}</td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/schemes/${s.id}`} className="font-semibold text-link hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">🛠️ Admin</h1>
        <form action={logout}>
          <button className="text-sm font-semibold text-muted hover:text-bad">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${warn ? "border-rose-100 bg-bad-soft" : "border-line bg-surface"}`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-sm text-fg-2">{label}</p>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 rounded-xl bg-tint p-3 font-semibold text-link">{children}</p>;
}
