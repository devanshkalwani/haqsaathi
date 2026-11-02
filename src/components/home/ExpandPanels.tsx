"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export type Panel = { icon: LucideIcon; title: string; short: string; body: string };

/**
 * Four panels side by side on desktop; the one you hover (or tap) opens wide and tells its story.
 * On phones they stack and are all open, so nothing is hidden behind a hover.
 */
export default function ExpandPanels({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4 lg:h-[26rem] lg:flex-row">
      {panels.map((p, i) => {
        const open = active === i;
        const Icon = p.icon;
        return (
          <button
            key={p.title}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-expanded={open}
            className={`group relative overflow-hidden rounded-3xl text-left transition-[flex-grow,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:min-w-0 ${
              open ? "bg-brand-950 text-white shadow-2xl shadow-brand-900/30 ring-1 ring-white/5 lg:flex-[3.2]" : "bg-surface text-fg ring-1 ring-line hover:ring-line-strong lg:flex-1"
            }`}
          >
            {/* glow + grid only on the open panel */}
            <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}>
              <div className="bg-grid absolute inset-0" />
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/50 blur-[90px]" />
              <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-indigo-500/30 blur-[80px]" />
            </div>

            <div className="relative flex h-full flex-col justify-between gap-8 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                    open ? "bg-accent-400 text-brand-950" : "bg-tint text-link"
                  }`}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <span className={`text-sm font-bold tabular-nums ${open ? "text-accent-400" : "text-muted"}`}>0{i + 1}</span>
              </div>

              <div>
                <h3 className={`font-extrabold transition-all duration-500 ${open ? "text-2xl md:text-3xl" : "text-2xl lg:text-lg"}`}>{p.title}</h3>
                <p className={`mt-1 ${open ? "text-brand-100/80" : "text-muted lg:text-sm"}`}>{p.short}</p>
                {/* body: always shown on phones, fades in on desktop when open */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-700 lg:grid-rows-[0fr] lg:opacity-0 ${
                    open ? "lg:grid-rows-[1fr] lg:opacity-100" : ""
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className={`mt-4 max-w-md text-lg leading-relaxed ${open ? "text-white" : "text-fg-2 lg:text-white"}`}>{p.body}</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
