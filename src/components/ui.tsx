import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

/**
 * Shared building blocks so every page looks the same in light and dark mode.
 * Colours come from the semantic tokens in app/globals.css (surface, fg, line, ...).
 */

const BTN = "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-40";
export const btn = {
  /** Main action on a page */
  primary: `${BTN} bg-primary px-5 py-3 text-on-primary hover:bg-primary-hover`,
  /** The one big "Check my benefits" style call to action */
  accent: `${BTN} bg-accent-400 px-6 py-3.5 text-brand-950 shadow-lg shadow-accent-400/20 hover:-translate-y-0.5 hover:bg-accent-500`,
  /** Secondary action */
  ghost: `${BTN} border border-line-strong bg-surface px-5 py-3 font-semibold text-fg hover:bg-surface-2`,
};

export const card = "rounded-2xl border border-line bg-surface";
export const input =
  "w-full rounded-xl border-2 border-line-strong bg-surface px-5 py-4 text-lg text-fg outline-none transition placeholder:text-muted focus:border-link";

/** Navy band at the top of every inner page, matching the home page hero. */
export function PageHero({
  icon: Icon,
  eyebrow,
  title,
  sub,
  back,
  children,
  narrow = false,
  width,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  back?: { href: string; label: string };
  children?: React.ReactNode;
  narrow?: boolean;
  /** Match the width of the content below (overrides `narrow`) */
  width?: "2xl" | "4xl" | "6xl";
}) {
  const w = { "2xl": "max-w-2xl", "4xl": "max-w-4xl", "6xl": "max-w-6xl" }[width ?? (narrow ? "4xl" : "6xl")];
  return (
    <section className="relative isolate overflow-hidden border-b border-white/5 bg-brand-950 text-white print:border-0 print:bg-transparent print:text-black">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="animate-aurora pointer-events-none absolute -left-32 -top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-brand-600/40 blur-[110px]" />
      <div className="animate-aurora pointer-events-none absolute -bottom-40 right-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[110px] [animation-delay:-9s]" />
      <div className={`mx-auto px-4 pb-12 pt-8 md:pb-16 md:pt-12 ${w}`}>
        {back && (
          <Link href={back.href} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-100/80 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> {back.label}
          </Link>
        )}
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent-400 ring-1 ring-white/15 sm:flex">
              <Icon className="h-7 w-7" strokeWidth={1.8} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-400">{eyebrow}</p>}
            <h1 className={`text-3xl font-extrabold leading-tight md:text-4xl ${eyebrow ? "mt-2" : ""}`}>{title}</h1>
            {sub && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-brand-100/85">{sub}</p>}
          </div>
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

/** Centered empty state used when a page has nothing to show yet. */
export function EmptyState({ icon: Icon, title, sub, children }: { icon: LucideIcon; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className={`${card} mx-auto flex max-w-xl flex-col items-center p-10 text-center`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-link">
        <Icon className="h-8 w-8" strokeWidth={1.7} />
      </span>
      <h2 className="mt-4 text-2xl font-extrabold text-fg">{title}</h2>
      {sub && <p className="mt-2 max-w-md text-fg-2">{sub}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
