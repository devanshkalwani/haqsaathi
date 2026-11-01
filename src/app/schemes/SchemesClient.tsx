"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SchemeCard from "@/components/SchemeCard";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useData } from "@/lib/data-context";
import { useLang } from "@/lib/i18n";
import { searchSchemes } from "@/lib/search";
import type { SchemeCategory } from "@/lib/types";

export default function SchemesClient() {
  const initialCat = (useSearchParams().get("category") as SchemeCategory | null) ?? null;

  const { t, tr } = useLang();
  const { schemes: SCHEMES } = useData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SchemeCategory | null>(initialCat);

  const list = useMemo(() => {
    let items = query.trim() ? searchSchemes(query, SCHEMES, 50) : SCHEMES;
    if (category) items = items.filter((s) => s.category === category);
    return items;
  }, [query, category, SCHEMES]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">{t("nav_schemes")}</h1>

      {/* Search */}
      <div className="relative mt-5">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔎</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_ph")}
          className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 text-lg outline-none focus:border-brand-600"
        />
      </div>

      {/* Category filter chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <Chip active={category === null} onClick={() => setCategory(null)}>
          {t("all")}
        </Chip>
        {SCHEME_CATEGORIES.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            {c.icon} {tr(c.label)}
          </Chip>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {t("showing")} {list.length}
      </p>

      {list.length === 0 ? (
        <p className="mt-10 text-center text-gray-600">{t("no_results")}</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-brand-700 bg-brand-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
