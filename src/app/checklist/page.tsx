"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useData } from "@/lib/data-context";
import { useSaved } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";
import type { Scheme } from "@/lib/types";
import { ArrowRight, Bookmark, Check, ClipboardCheck, ClipboardList, FileText, Printer } from "lucide-react";
import { EmptyState, PageHero, btn, card } from "@/components/ui";

export default function ChecklistPage() {
  const { t, tr } = useLang();
  const { saved, toggle } = useSaved();
  const { documents: DOCUMENTS, getScheme } = useData();
  const [ready, setReady] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(storage.getDocsReady());
  }, []);

  const schemes = saved.map((id) => getScheme(id)).filter((s): s is Scheme => Boolean(s));

  // Combine documents from all saved schemes, without repeats.
  const docMap = new Map<string, Scheme[]>();
  for (const s of schemes) for (const d of s.documents) docMap.set(d, [...(docMap.get(d) ?? []), s]);
  const docs = [...docMap.entries()];

  const toggleReady = (id: string) => {
    const next = ready.includes(id) ? ready.filter((x) => x !== id) : [...ready, id];
    setReady(next);
    storage.setDocsReady(next);
  };

  const doneCount = docs.filter(([id]) => ready.includes(id)).length;

  if (schemes.length === 0) {
    return (
      <div>
        <PageHero icon={ClipboardCheck} title={t("list_title")} sub={t("list_sub")} narrow />
        <div className="px-4 pt-10">
          <EmptyState icon={ClipboardList} title={t("list_title")} sub={t("list_empty")}>
            <Link href="/check" className={btn.accent}>
              {t("hero_cta")} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/schemes" className={btn.ghost}>
              {t("nav_schemes")}
            </Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  const pct = docs.length ? Math.round((doneCount / docs.length) * 100) : 0;

  return (
    <div>
      <PageHero icon={ClipboardCheck} title={t("list_title")} sub={t("list_sub")} narrow>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-56 flex-1 max-w-md">
            <div className="flex justify-between text-sm font-semibold text-brand-100/80">
              <span>
                {doneCount}/{docs.length} {t("list_ready")}
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-accent-400 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            <Printer className="h-4 w-4" /> {t("print")}
          </button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl px-4">
        {/* Documents */}
        <section className={`${card} mt-6 p-6`}>
          <h2 className="flex items-center gap-3 text-xl font-bold text-fg">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-link">
              <FileText className="h-5 w-5" />
            </span>
            {t("list_docs")}
          </h2>

          <ul className="mt-5 space-y-3">
            {docs.map(([id, forSchemes]) => {
              const d = DOCUMENTS[id];
              const on = ready.includes(id);
              return (
                <li key={id}>
                  <button
                    onClick={() => toggleReady(id)}
                    aria-pressed={on}
                    className={`flex w-full gap-4 rounded-2xl border-2 p-4 text-left transition ${
                      on ? "border-ok/40 bg-ok-soft" : "border-line hover:border-line-strong hover:bg-surface-2"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                        on ? "border-ok bg-ok text-white dark:text-brand-950" : "border-line-strong"
                      }`}
                    >
                      {on && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                    <span>
                      <span className={`block font-bold ${on ? "text-muted line-through" : "text-fg"}`}>{tr(d.name)}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-fg-2">
                        {t("how_to_get")}: {tr(d.howToGet)}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {t("list_needed_for")}: {forSchemes.map((s) => tr(s.name)).join(", ")}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Saved schemes */}
        <section className={`${card} mt-6 p-6`}>
          <h2 className="flex items-center gap-3 text-xl font-bold text-fg">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-link">
              <Bookmark className="h-5 w-5" />
            </span>
            {t("list_saved")}
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {schemes.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/schemes/${s.id}`} className="font-semibold text-link hover:underline">
                  {tr(s.name)}
                </Link>
                <button onClick={() => toggle(s.id)} className="no-print text-sm font-semibold text-muted transition hover:text-bad">
                  {t("remove")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
