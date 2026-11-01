"use client";

import Link from "next/link";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useSaved } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Scheme } from "@/lib/types";
import OptionIcon from "./Icon";
import { Bookmark, Check } from "lucide-react";

export default function SchemeCard({ scheme, eligible = false }: { scheme: Scheme; eligible?: boolean }) {
  const { t, tr } = useLang();
  const { isSaved, toggle } = useSaved();
  const cat = SCHEME_CATEGORIES.find((c) => c.id === scheme.category);
  const saved = isSaved(scheme.id);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat?.color}`}>
          {cat && <OptionIcon id={cat.id} className="h-3.5 w-3.5" />} {cat && tr(cat.label)}
        </span>
        {eligible && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><Check className="h-3.5 w-3.5" /> {t("likely_eligible")}</span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{tr(scheme.name)}</h3>
      <p className="mt-1 text-sm text-gray-600">{tr(scheme.summary)}</p>

      <div className="mt-4 border-l-2 border-accent-400 bg-accent-50 px-3 py-2.5 text-sm font-medium text-ink">{tr(scheme.benefit)}</div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <Link
          href={`/schemes/${scheme.id}`}
          className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          {t("view_details")}
        </Link>
        <button
          onClick={() => toggle(scheme.id)}
          aria-pressed={saved}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
            saved ? "border-brand-600 bg-brand-50 text-brand-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="inline-flex items-center gap-1.5"><Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />{saved ? t("saved") : t("save")}</span>
        </button>
      </div>
    </article>
  );
}
