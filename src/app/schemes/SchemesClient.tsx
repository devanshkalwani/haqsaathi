"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SchemeCard from "@/components/SchemeCard";
import { EmptyState, PageHero } from "@/components/ui";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useData } from "@/lib/data-context";
import { useLang } from "@/lib/i18n";
import { searchSchemes } from "@/lib/search";
import type { SchemeCategory } from "@/lib/types";
import OptionIcon from "@/components/Icon";
import { BookOpenText, Search, SearchX } from "lucide-react";

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
    <div>
      <PageHero icon={BookOpenText} title={t("nav_schemes")} sub={t("schemes_sub")}>
        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_ph")}
            className="w-full rounded-2xl border-2 border-transparent bg-surface py-4 pl-12 pr-4 text-lg text-fg shadow-xl shadow-black/20 outline-none transition placeholder:text-muted focus:border-accent-400"
          />
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Category filter chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            {t("all")}
          </Chip>
          {SCHEME_CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              <OptionIcon id={c.id} className="h-4 w-4" /> {tr(c.label)}
            </Chip>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-muted">
          {t("showing")} {list.length}
        </p>

        {list.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={SearchX} title={t("no_results")} />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
