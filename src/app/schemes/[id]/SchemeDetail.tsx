"use client";

import Link from "next/link";
import { useState } from "react";
import { useData } from "@/lib/data-context";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useSaved, useSpeak } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Scheme } from "@/lib/types";
import OptionIcon from "@/components/Icon";
import { PageHero } from "@/components/ui";
import { ArrowRight, Bookmark, Check, ExternalLink, FileText, Flag, IndianRupee, Link2, ListOrdered, MessagesSquare, Phone, Square, Users, Volume2 } from "lucide-react";

export default function SchemeDetail({ scheme: s }: { scheme: Scheme }) {
  const { t, tr, lang } = useLang();
  const { isSaved, toggle } = useSaved();
  const { documents: DOCUMENTS } = useData();
  const { speaking, speak, stop } = useSpeak();
  const [reported, setReported] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const cat = SCHEME_CATEGORIES.find((c) => c.id === s.category);
  const saved = isSaved(s.id);

  // Text read aloud by the "Listen" button.
  const spoken = [tr(s.name), tr(s.summary), t("what_you_get"), tr(s.benefit), t("who_can_apply"), ...s.whoCanApply.map(tr)].join(". ");

  return (
    <div>
      <PageHero
        narrow
        back={{ href: "/schemes", label: t("nav_schemes") }}
        title={tr(s.name)}
        sub={tr(s.summary)}
        eyebrow={tr(s.ministry)}
      >
        <div className="flex flex-wrap gap-2">
          {cat && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">
              <OptionIcon id={cat.id} className="h-3.5 w-3.5 text-accent-400" /> {tr(cat.label)}
            </span>
          )}
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/15">{t("central")}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={s.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-3 font-bold text-brand-950 transition hover:bg-accent-500"
          >
            {t("apply_official")} <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => toggle(s.id)}
            aria-pressed={saved}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
              saved ? "border-accent-400 bg-accent-400/15 text-accent-400" : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {saved ? t("saved") : t("save")}
          </button>
          <button
            onClick={() => (speaking ? stop() : speak(spoken, lang))}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {speaking ? t("stop") : t("listen")}
          </button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-4xl px-4">
        {/* Benefit */}
        <Section icon={<IndianRupee className="h-5 w-5" aria-hidden />} title={t("what_you_get")} tone="amber">
          <p className="text-lg font-semibold leading-relaxed text-fg">{tr(s.benefit)}</p>
        </Section>

        {/* Who can apply */}
        <Section icon={<Users className="h-5 w-5" aria-hidden />} title={t("who_can_apply")}>
          <ul className="space-y-3">
            {s.whoCanApply.map((w, i) => (
              <li key={i} className="flex gap-3 text-fg-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span>{tr(w)}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Documents */}
        <Section icon={<FileText className="h-5 w-5" aria-hidden />} title={t("documents_needed")}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.documents.map((id) => {
              const d = DOCUMENTS[id];
              if (!d) return null;
              return (
                <li key={id} className="rounded-xl border border-line bg-surface-2 p-4">
                  <p className="font-bold text-fg">{tr(d.name)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg-2">
                    <span className="font-semibold">{t("how_to_get")}:</span> {tr(d.howToGet)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* How to apply */}
        <Section icon={<ListOrdered className="h-5 w-5" aria-hidden />} title={t("how_to_apply")}>
          <ol className="relative space-y-5">
            {s.howToApply.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">{i + 1}</span>
                <span className="pt-1 text-fg-2">{tr(step)}</span>
              </li>
            ))}
          </ol>
          {s.helpline && (
            <p className="mt-6 flex items-center gap-2 rounded-xl bg-tint p-3 text-sm text-fg-2">
              <Phone className="h-4 w-4 text-link" />
              {t("helpline")}:
              <a href={`tel:${s.helpline}`} className="font-bold text-link">
                {s.helpline}
              </a>
            </p>
          )}
        </Section>

        {/* Ask */}
        <div className="relative isolate mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl bg-brand-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
          <p className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400 text-brand-950">
              <MessagesSquare className="h-5 w-5" />
            </span>
            {t("ask_about")}
          </p>
          <Link
            href={`/ask?q=${encodeURIComponent(tr(s.name))}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-brand-950 transition hover:bg-brand-100"
          >
            {t("nav_ask")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Source + report */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p className="flex flex-wrap items-center gap-1">
            <Link2 className="h-4 w-4" />
            {t("source")}:
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-link underline underline-offset-2">
              {s.sourceUrl.replace(/^https?:\/\//, "")}
            </a>
            <span>· {t("last_verified")}: {s.lastVerified}</span>
          </p>
          {!reportOpen && (
            <button
              onClick={() => setReportOpen(true)}
              disabled={reported}
              className="inline-flex items-center gap-1.5 font-semibold text-bad hover:underline disabled:text-muted disabled:no-underline"
            >
              {reported ? (
                t("report_thanks")
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  {t("report_error")}
                </>
              )}
            </button>
          )}
        </div>

        {/* "Report a mistake" box: saved to the error_reports table */}
        {reportOpen && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!reportText.trim()) return;
              await fetch("/api/report", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ schemeId: s.id, message: reportText }),
              }).catch(() => null);
              setReported(true);
              setReportOpen(false);
            }}
            className="mt-3 rounded-2xl border border-bad/30 bg-bad-soft p-4"
          >
            <label htmlFor="report" className="text-sm font-semibold text-fg">
              {t("report_what")}
            </label>
            <textarea
              id="report"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={3}
              maxLength={1000}
              className="mt-2 w-full rounded-xl border border-line-strong bg-surface p-3 text-fg outline-none focus:border-bad"
            />
            <div className="mt-2 flex gap-2">
              <button type="submit" className="rounded-xl bg-bad px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 dark:text-brand-950">
                {t("ask_send")}
              </button>
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-fg-2 hover:bg-surface-2">
                {t("cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone?: "amber";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`mt-6 rounded-3xl border p-6 md:p-8 ${tone === "amber" ? "border-accent-400/40 bg-warn-soft" : "border-line bg-surface"}`}
    >
      <h2 className="mb-5 flex items-center gap-3 text-xl font-bold text-fg">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone === "amber" ? "bg-accent-400 text-brand-950" : "bg-tint text-link"}`}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
