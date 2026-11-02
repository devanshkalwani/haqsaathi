"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import OptionIcon from "@/components/Icon";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useData } from "@/lib/data-context";
import { useLang } from "@/lib/i18n";

/**
 * Horizontal, swipeable row of category cards (scroll-snap). Arrow buttons on desktop.
 * Each card follows the mouse with a soft spotlight and lifts on hover.
 */
export default function CategoryRail({ title, sub, countLabel }: { title: string; sub: string; countLabel: [string, string] }) {
  const { tr } = useLang();
  const { schemes } = useData();
  const rail = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => rail.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  const spotlight = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div>
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-950 md:text-4xl">{title}</h2>
          <p className="mt-2 text-slate-500">{sub}</p>
        </div>
        <div className="hidden gap-2 md:flex">
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => scrollBy(d)}
              aria-label={d < 0 ? "Previous" : "Next"}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-brand-900 transition hover:border-brand-900 hover:bg-brand-900 hover:text-white"
            >
              {d < 0 ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={rail}
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 [scrollbar-width:none] md:px-[max(1rem,calc((100vw_-_72rem)/2_+_1rem))] md:scroll-pl-[max(1rem,calc((100vw_-_72rem)/2_+_1rem))] [&::-webkit-scrollbar]:hidden"
      >
        {SCHEME_CATEGORIES.map((cat, i) => {
          const count = schemes.filter((s) => s.category === cat.id).length;
          return (
            <Link
              key={cat.id}
              href={`/schemes?category=${cat.id}`}
              onMouseMove={spotlight}
              className="group relative flex h-72 w-64 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl bg-brand-950 p-6 text-white transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-900/30 md:w-72"
            >
              {/* spotlight following the mouse */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--x)_var(--y),rgba(242,181,68,0.18),transparent_60%)]" />
              <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[70px] transition-transform duration-700 group-hover:scale-125"
                style={{ background: ["#3d5fae", "#2c4c99", "#5b4bb0", "#1f6f8b"][i % 4], opacity: 0.6 }}
              />
              <div className="relative flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-accent-400 ring-1 ring-white/15 transition duration-500 group-hover:bg-accent-400 group-hover:text-brand-950">
                  <OptionIcon id={cat.id} className="h-7 w-7" />
                </span>
                <ArrowUpRight className="h-6 w-6 text-white/40 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-400" />
              </div>
              <div className="relative">
                <p className="text-sm font-semibold text-brand-100/70">
                  {count} {count === 1 ? countLabel[0] : countLabel[1]}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold leading-tight">{tr(cat.label)}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
