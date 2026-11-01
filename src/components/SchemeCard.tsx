"use client";

import Link from "next/link";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useSaved } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Scheme } from "@/lib/types";

export default function SchemeCard({ scheme, eligible = false }: { scheme: Scheme; eligible?: boolean }) {
  const { t, tr } = useLang();
  const { isSaved, toggle } = useSaved();
  const cat = SCHEME_CATEGORIES.find((c) => c.id === scheme.category);
  const saved = isSaved(scheme.id);

  return (
    <article className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat?.color}`}>
          <span aria-hidden>{cat?.icon}</span> {cat && tr(cat.label)}
        </span>
        {eligible && (
          <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-800">✓ {t("likely_eligible")}</span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{tr(scheme.name)}</h3>
      <p className="mt-1 text-sm text-gray-600">{tr(scheme.summary)}</p>

      <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
        <span className="font-semibold">💰 </span>
        {tr(scheme.benefit)}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <Link
          href={`/schemes/${scheme.id}`}
          className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          {t("view_details")} →
        </Link>
        <button
          onClick={() => toggle(scheme.id)}
          aria-pressed={saved}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
            saved ? "border-brand-600 bg-brand-50 text-brand-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {saved ? `★ ${t("saved")}` : `☆ ${t("save")}`}
        </button>
      </div>
    </article>
  );
}
