"use client";

import Link from "next/link";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useSaved } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Scheme } from "@/lib/types";
import OptionIcon from "./Icon";
import { ArrowRight, Bookmark, Check } from "lucide-react";

export default function SchemeCard({ scheme, eligible = false }: { scheme: Scheme; eligible?: boolean }) {
  const { t, tr } = useLang();
  const { isSaved, toggle } = useSaved();
  const cat = SCHEME_CATEGORIES.find((c) => c.id === scheme.category);
  const saved = isSaved(scheme.id);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl hover:shadow-brand-950/5 dark:hover:shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cat?.color}`}>
          {cat && <OptionIcon id={cat.id} className="h-3.5 w-3.5" />} {cat && tr(cat.label)}
        </span>
        {eligible && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-bold text-ok">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> {t("likely_eligible")}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-fg">{tr(scheme.name)}</h3>
      <p className="mt-1 text-sm leading-relaxed text-fg-2">{tr(scheme.summary)}</p>

      <div className="mt-4 rounded-r-lg border-l-[3px] border-accent-400 bg-warn-soft px-3 py-2.5 text-sm font-semibold text-fg">{tr(scheme.benefit)}</div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <Link
          href={`/schemes/${scheme.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition hover:bg-primary-hover"
        >
          {t("view_details")} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        <button
          onClick={() => toggle(scheme.id)}
          aria-pressed={saved}
          aria-label={saved ? t("saved") : t("save")}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
            saved ? "border-link bg-tint text-link" : "border-line-strong text-fg-2 hover:bg-surface-2"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          {saved ? t("saved") : t("save")}
        </button>
      </div>
    </article>
  );
}
