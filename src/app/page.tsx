"use client";

import Link from "next/link";
import SchemeCard from "@/components/SchemeCard";
import { SCHEME_CATEGORIES } from "@/data/options";
import { SCHEMES } from "@/data/schemes";
import { useLang, type UIKey } from "@/lib/i18n";

const STEPS: { icon: string; t: UIKey; d: UIKey }[] = [
  { icon: "🔎", t: "step1_t", d: "step1_d" },
  { icon: "📖", t: "step2_t", d: "step2_d" },
  { icon: "📄", t: "step3_t", d: "step3_d" },
  { icon: "✅", t: "step4_t", d: "step4_d" },
];

const POPULAR = ["ayushman-bharat", "pm-kisan", "e-shram", "pmay-gramin", "post-matric-sc", "atal-pension"];

export default function HomePage() {
  const { t, tr } = useLang();
  const popular = POPULAR.map((id) => SCHEMES.find((s) => s.id === id)!).filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand-200/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium">🤝 {t("tagline")}</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{t("hero_title")}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/check"
                className="rounded-2xl bg-accent-400 px-7 py-4 text-lg font-bold text-brand-900 shadow-lg shadow-black/10 transition hover:bg-accent-500"
              >
                {t("hero_cta")} →
              </Link>
              <Link href="/ask" className="rounded-2xl border border-white/40 px-6 py-4 font-semibold transition hover:bg-white/10">
                💬 {t("hero_ask")}
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/70">⏱️ {t("hero_cta_time")}</p>
          </div>

          {/* Preview card to show what the user gets */}
          <div className="hidden items-center justify-center md:flex">
            <div className="w-full max-w-sm rotate-1 rounded-3xl bg-white p-6 text-ink shadow-2xl">
              <p className="text-sm font-semibold text-gray-500">{t("results_found")} 5 {t("results_schemes")}</p>
              {popular.slice(0, 3).map((s) => (
                <div key={s.id} className="mt-3 flex items-center gap-3 rounded-xl bg-brand-50 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">✓</span>
                  <div>
                    <p className="font-bold leading-tight">{tr(s.name)}</p>
                    <p className="text-xs text-gray-600">{tr(s.summary)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="mx-auto -mt-6 max-w-6xl px-4">
        <div className="relative grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-md sm:grid-cols-3">
          <Stat big={`${SCHEMES.length}+`} small={t("stat_schemes")} />
          <Stat big="₹0" small={t("stat_free")} />
          <Stat big="अ / A" small={t("stat_lang")} />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="text-2xl font-extrabold">{t("how_title")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-bold text-brand-600">0{i + 1}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{t(s.t)}</h3>
              <p className="mt-1 text-sm text-gray-600">{t(s.d)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="text-2xl font-extrabold">{t("browse_title")}</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
          {SCHEME_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/schemes?category=${c.id}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${c.color}`}>{c.icon}</span>
              <span className="text-xs font-semibold leading-tight">{tr(c.label)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular schemes */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">{t("popular_title")}</h2>
          <Link href="/schemes" className="text-sm font-semibold text-brand-700 hover:underline">
            {t("see_all")} →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="rounded-3xl bg-brand-50 p-6 md:p-10">
          <h2 className="text-2xl font-extrabold text-brand-900">{t("trust_title")}</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {(["trust_1", "trust_2", "trust_3"] as const).map((k, i) => (
              <li key={k} className="flex gap-3 rounded-2xl bg-white p-4">
                <span className="text-2xl">{["🔗", "🔒", "📱"][i]}</span>
                <span className="font-medium">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-2">
      <span className="text-2xl font-extrabold text-brand-700">{big}</span>
      <span className="text-sm text-gray-600">{small}</span>
    </div>
  );
}
