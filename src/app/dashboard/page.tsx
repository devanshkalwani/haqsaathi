"use client";

import Link from "next/link";
import { AREAS, CATEGORIES, GENDERS, INCOMES, OCCUPATIONS } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useData } from "@/lib/data-context";
import { findEligible } from "@/lib/eligibility";
import { useLocalData } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { ArrowRight, Award, BadgeCheck, Bookmark, Check, CloudOff, FileCheck2, ListChecks, MapPin, MessagesSquare, Pencil, SearchCheck, UserRound, type LucideIcon } from "lucide-react";

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
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-accent-100 bg-accent-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-slate-800"><CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />{t("dash_guest_banner")}</p>
          <Link href="/login" className="shrink-0 rounded-lg bg-brand-900 px-5 py-2.5 text-center font-semibold text-white hover:bg-brand-800">
            {t("login")}
          </Link>
        </div>
      )}

      {/* Greeting */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-950 p-6 text-white md:p-10">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-700/60 blur-[90px]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-brand-100/80">{t("dash_hello")},</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{displayName || t("guest")}</h1>
            <p className="mt-2 text-brand-100/80">{t("dash_sub")}</p>
          </div>
          {/* Progress ring */}
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <Ring value={doneSteps / steps.length} />
            <div>
              <p className="text-2xl font-extrabold">
                {doneSteps}/{steps.length}
              </p>
              <p className="text-sm text-brand-100/75">{t("dash_next")}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-3">
          <Stat value={eligible.length} label={t("dash_eligible")} icon={BadgeCheck} />
          <Stat value={`${readyCount}/${neededDocs.length}`} label={t("dash_docs")} icon={FileCheck2} />
          <Stat value={saved.length} label={t("dash_saved")} icon={Bookmark} />
        </div>
      </section>

      {!profile ? (
        /* First-time user: one big clear action */
        <section className="mt-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><SearchCheck className="h-8 w-8" strokeWidth={1.8} /></span>
          <h2 className="mt-4 text-2xl font-extrabold">{t("dash_start_title")}</h2>
          <p className="mt-2 max-w-md text-slate-600">{t("dash_start_sub")}</p>
          <Link href="/check" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-400 px-8 py-4 text-lg font-bold text-brand-950 hover:bg-accent-500">
            {t("hero_cta")} <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Top benefits */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-brand-950"><Award className="h-5 w-5 text-accent-500" />{t("dash_top")}</h2>
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
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/50"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        {saved.includes(s.id) ? <Bookmark className="h-5 w-5 fill-current" /> : <Check className="h-5 w-5" strokeWidth={2.5} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">{tr(s.name)}</span>
                        <span className="block truncate text-sm text-gray-600">{tr(s.benefit)}</span>
                      </span>
                      <ArrowRight className="h-5 w-5 text-brand-700 transition group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Next steps */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-brand-950"><ListChecks className="h-5 w-5 text-accent-500" />{t("dash_next")}</h2>
            <ol className="mt-4 space-y-2">
              {steps.map((s, i) => (
                <li key={s.label}>
                  <Link href={s.href} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        s.done ? "bg-emerald-600 text-white" : "border-2 border-slate-200 text-slate-500"
                      }`}
                    >
                      {s.done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className={s.done ? "text-gray-400 line-through" : "font-medium"}>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Profile summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-brand-950"><UserRound className="h-5 w-5 text-accent-500" />{t("dash_profile")}</h2>
              <Link href="/check" className="text-sm font-semibold text-brand-700 hover:underline">
                <Pencil className="mr-1 inline h-3.5 w-3.5" />{t("edit")}
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>
                {profile.age} {t("years")}
              </Chip>
              <Chip>{tr(GENDERS.find((g) => g.id === profile.gender)!.label)}</Chip>
              <Chip>{tr(AREAS.find((a) => a.id === profile.area)!.label)}</Chip>
              <Chip><MapPin className="mr-1 inline h-3.5 w-3.5" />{profile.state}</Chip>
              <Chip>{tr(OCCUPATIONS.find((o) => o.id === profile.occupation)!.label)}</Chip>
              <Chip>{tr(INCOMES.find((x) => x.id === profile.income)!.label)}</Chip>
              <Chip>{tr(CATEGORIES.find((c) => c.id === profile.category)!.label)}</Chip>
            </div>
          </section>

          {/* Ask */}
          <Link
            href="/ask"
            className="group flex flex-col justify-between rounded-2xl bg-brand-900 p-6 text-white transition hover:bg-brand-800"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400 text-brand-950"><MessagesSquare className="h-6 w-6" /></span>
            <span className="mt-4 text-lg font-bold">{t("dash_ask")}</span>
            <span className="mt-2 inline-flex items-center gap-1 font-semibold text-accent-400">{t("nav_ask")} <ArrowRight className="h-4 w-4" /></span>
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, icon: Icon }: { value: number | string; label: string; icon: LucideIcon }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-1.5 text-sm text-brand-100/75">
        <Icon className="h-4 w-4 text-accent-400" /> <span className="hidden sm:inline">{label}</span>
      </p>
      <p className="mt-1 text-2xl font-extrabold md:text-3xl">{value}</p>
      <p className="text-xs text-brand-100/75 sm:hidden">{label}</p>
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
  return <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">{children}</span>;
}
