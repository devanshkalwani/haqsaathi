"use client";

import Link from "next/link";
import { AREAS, CATEGORIES, GENDERS, INCOMES, OCCUPATIONS } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
import { findEligible } from "@/lib/eligibility";
import { useLocalData } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";

/** The personal home for each user: what they qualify for, documents, and what to do next. */
export default function DashboardPage() {
  const { t, tr } = useLang();
  const { user, available } = useAuth();
  const { schemes, documents } = useData();
  const local = useLocalData();

  if (!local) return null; // reading from the device

  const { name, profile, saved, docsReady } = local;
  const eligible = profile ? findEligible(profile, schemes) : [];
  // Documents needed for saved schemes (or eligible ones if nothing is saved yet)
  const docSource = saved.length ? schemes.filter((s) => saved.includes(s.id)) : eligible;
  const neededDocs = [...new Set(docSource.flatMap((s) => s.documents))].filter((d) => documents[d]);
  const readyCount = neededDocs.filter((d) => docsReady.includes(d)).length;

  const steps = [
    { label: t("dash_step_profile"), done: Boolean(profile), href: "/check" },
    { label: t("dash_step_save"), done: saved.length > 0, href: profile ? "/results" : "/check" },
    { label: t("dash_step_docs"), done: neededDocs.length > 0 && readyCount === neededDocs.length, href: "/checklist" },
    { label: t("dash_step_apply"), done: false, href: saved[0] ? `/schemes/${saved[0]}` : "/schemes" },
  ];
  const doneSteps = steps.filter((s) => s.done).length;
  const displayName = name || (user?.email?.split("@")[0] ?? "");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Guest banner */}
      {!user && available && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-brand-900">🔐 {t("dash_guest_banner")}</p>
          <Link href="/login" className="shrink-0 rounded-xl bg-brand-700 px-5 py-2.5 text-center font-semibold text-white hover:bg-brand-800">
            {t("login")}
          </Link>
        </div>
      )}

      {/* Greeting */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-6 text-white md:p-10">
        <div className="animate-float-slow pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent-400/25 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white/75">{t("dash_hello")} 👋</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{displayName || t("guest")}</h1>
            <p className="mt-2 text-white/80">{t("dash_sub")}</p>
          </div>
          {/* Progress ring */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <Ring value={doneSteps / steps.length} />
            <div>
              <p className="text-2xl font-extrabold">
                {doneSteps}/{steps.length}
              </p>
              <p className="text-sm text-white/75">{t("dash_next")}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-3">
          <Stat value={eligible.length} label={t("dash_eligible")} icon="✅" />
          <Stat value={`${readyCount}/${neededDocs.length}`} label={t("dash_docs")} icon="📄" />
          <Stat value={saved.length} label={t("dash_saved")} icon="★" />
        </div>
      </section>

      {!profile ? (
        /* First-time user: one big clear action */
        <section className="mt-6 flex flex-col items-center rounded-[2rem] border-2 border-dashed border-brand-200 bg-white p-10 text-center">
          <p className="text-5xl">🔎</p>
          <h2 className="mt-4 text-2xl font-extrabold">{t("dash_start_title")}</h2>
          <p className="mt-2 text-gray-600">{t("dash_start_sub")}</p>
          <Link href="/check" className="mt-6 rounded-2xl bg-accent-400 px-8 py-4 text-lg font-bold text-brand-900 shadow-lg shadow-accent-400/30 hover:bg-accent-500">
            {t("hero_cta")} →
          </Link>
        </section>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Top benefits */}
          <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">🏆 {t("dash_top")}</h2>
              <Link href="/results" className="text-sm font-semibold text-brand-700 hover:underline">
                {t("view_all")} →
              </Link>
            </div>
            {eligible.length === 0 ? (
              <p className="mt-4 text-gray-600">{t("results_none")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {eligible.slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/schemes/${s.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-lg">
                        {saved.includes(s.id) ? "★" : "✓"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">{tr(s.name)}</span>
                        <span className="block truncate text-sm text-gray-600">{tr(s.benefit)}</span>
                      </span>
                      <span className="text-brand-700 transition group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Next steps */}
          <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">🪜 {t("dash_next")}</h2>
            <ol className="mt-4 space-y-2">
              {steps.map((s, i) => (
                <li key={s.label}>
                  <Link href={s.href} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        s.done ? "bg-brand-600 text-white" : "border-2 border-gray-200 text-gray-500"
                      }`}
                    >
                      {s.done ? "✓" : i + 1}
                    </span>
                    <span className={s.done ? "text-gray-400 line-through" : "font-medium"}>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Profile summary */}
          <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">👤 {t("dash_profile")}</h2>
              <Link href="/check" className="text-sm font-semibold text-brand-700 hover:underline">
                ✏️ {t("edit")}
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>
                🎂 {profile.age} {t("years")}
              </Chip>
              <Chip>{tr(GENDERS.find((g) => g.id === profile.gender)!.label)}</Chip>
              <Chip>{tr(AREAS.find((a) => a.id === profile.area)!.label)}</Chip>
              <Chip>📍 {profile.state}</Chip>
              <Chip>{tr(OCCUPATIONS.find((o) => o.id === profile.occupation)!.label)}</Chip>
              <Chip>💰 {tr(INCOMES.find((x) => x.id === profile.income)!.label)}</Chip>
              <Chip>{tr(CATEGORIES.find((c) => c.id === profile.category)!.label)}</Chip>
            </div>
          </section>

          {/* Ask */}
          <Link
            href="/ask"
            className="group flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-accent-400 to-amber-300 p-6 text-brand-900 shadow-sm transition hover:-translate-y-0.5"
          >
            <span className="text-4xl">💬</span>
            <span className="mt-4 text-lg font-bold">{t("dash_ask")}</span>
            <span className="mt-2 font-semibold">{t("nav_ask")} →</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, icon }: { value: number | string; label: string; icon: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <p className="text-sm text-white/75">
        {icon} <span className="hidden sm:inline">{label}</span>
      </p>
      <p className="mt-1 text-2xl font-extrabold md:text-3xl">{value}</p>
      <p className="text-xs text-white/75 sm:hidden">{label}</p>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
      <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
      <circle
        cx="28"
        cy="28"
        r={r}
        stroke="#fbbf24"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        transform="rotate(-90 28 28)"
        className="transition-all duration-700"
      />
    </svg>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">{children}</span>;
}
