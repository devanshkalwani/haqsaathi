"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DOCUMENTS } from "@/data/documents";
import { getScheme } from "@/data/schemes";
import { useSaved } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";
import type { Scheme } from "@/lib/types";

export default function ChecklistPage() {
  const { t, tr } = useLang();
  const { saved, toggle } = useSaved();
  const [ready, setReady] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(storage.getDocsReady());
  }, []);

  const schemes = saved.map(getScheme).filter((s): s is Scheme => Boolean(s));

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
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">📋</p>
        <h1 className="mt-4 text-2xl font-extrabold">{t("list_title")}</h1>
        <p className="mt-2 text-gray-600">{t("list_empty")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/check" className="rounded-2xl bg-brand-700 px-6 py-3 font-bold text-white">
            {t("hero_cta")}
          </Link>
          <Link href="/schemes" className="rounded-2xl border-2 border-gray-200 px-6 py-3 font-semibold">
            {t("nav_schemes")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{t("list_title")}</h1>
          <p className="mt-1 text-gray-600">{t("list_sub")}</p>
        </div>
        <button onClick={() => window.print()} className="no-print rounded-xl border-2 border-gray-200 px-4 py-2 font-semibold hover:bg-gray-50">
          🖨️ {t("print")}
        </button>
      </div>

      {/* Documents */}
      <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📄 {t("list_docs")}</h2>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-800">
            {doneCount}/{docs.length} {t("list_ready")}
          </span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(doneCount / docs.length) * 100}%` }} />
        </div>

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
                    on ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 ${
                      on ? "border-brand-600 bg-brand-600 text-white" : "border-gray-300"
                    }`}
                  >
                    {on && "✓"}
                  </span>
                  <span>
                    <span className={`block font-bold ${on ? "text-gray-500 line-through" : ""}`}>{tr(d.name)}</span>
                    <span className="mt-1 block text-sm text-gray-600">
                      {t("how_to_get")}: {tr(d.howToGet)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
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
      <section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">★ {t("list_saved")}</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {schemes.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-3">
              <Link href={`/schemes/${s.id}`} className="font-semibold text-brand-800 hover:underline">
                {tr(s.name)}
              </Link>
              <button onClick={() => toggle(s.id)} className="no-print text-sm text-gray-500 hover:text-rose-600">
                {t("remove")}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
