"use client";

import Link from "next/link";
import { useState } from "react";
import { useData } from "@/lib/data-context";
import { SCHEME_CATEGORIES } from "@/data/options";
import { useSaved, useSpeak } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Scheme } from "@/lib/types";

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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/schemes" className="text-sm font-semibold text-brand-700 hover:underline">
        ← {t("nav_schemes")}
      </Link>

      {/* Title block */}
      <div className="mt-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cat?.color}`}>
            {cat?.icon} {cat && tr(cat.label)}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">🏛️ {t("central")}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">{tr(s.name)}</h1>
        <p className="mt-1 text-sm text-gray-500">{tr(s.ministry)}</p>
        <p className="mt-4 text-lg text-gray-700">{tr(s.summary)}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={s.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-800"
          >
            {t("apply_official")} ↗
          </a>
          <button
            onClick={() => toggle(s.id)}
            className={`rounded-2xl border-2 px-5 py-3 font-semibold transition ${
              saved ? "border-brand-600 bg-brand-50 text-brand-800" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            {saved ? `★ ${t("saved")}` : `☆ ${t("save")}`}
          </button>
          <button
            onClick={() => (speaking ? stop() : speak(spoken, lang))}
            className="rounded-2xl border-2 border-gray-200 px-5 py-3 font-semibold hover:bg-gray-50"
          >
            {speaking ? `⏹ ${t("stop")}` : `🔊 ${t("listen")}`}
          </button>
        </div>
      </div>

      {/* Benefit */}
      <Section icon="💰" title={t("what_you_get")} tone="amber">
        <p className="text-lg font-medium">{tr(s.benefit)}</p>
      </Section>

      {/* Who can apply */}
      <Section icon="👥" title={t("who_can_apply")}>
        <ul className="space-y-2">
          {s.whoCanApply.map((w, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 text-brand-600">✔</span>
              <span>{tr(w)}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Documents */}
      <Section icon="📄" title={t("documents_needed")}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {s.documents.map((id) => {
            const d = DOCUMENTS[id];
            if (!d) return null;
            return (
              <li key={id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="font-semibold">{tr(d.name)}</p>
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">{t("how_to_get")}:</span> {tr(d.howToGet)}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* How to apply */}
      <Section icon="🪜" title={t("how_to_apply")}>
        <ol className="space-y-4">
          {s.howToApply.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 font-bold text-white">
                {i + 1}
              </span>
              <span className="pt-1">{tr(step)}</span>
            </li>
          ))}
        </ol>
        {s.helpline && (
          <p className="mt-5 rounded-xl bg-brand-50 p-3 text-sm">
            📞 {t("helpline")}:{" "}
            <a href={`tel:${s.helpline}`} className="font-bold text-brand-800">
              {s.helpline}
            </a>
          </p>
        )}
      </Section>

      {/* Ask + source */}
      <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-brand-900">💬 {t("ask_about")}</p>
        <Link
          href={`/ask?q=${encodeURIComponent(tr(s.name))}`}
          className="rounded-xl bg-brand-700 px-5 py-2.5 text-center font-semibold text-white hover:bg-brand-800"
        >
          {t("nav_ask")} →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
        <p>
          🔗 {t("source")}:{" "}
          <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
            {s.sourceUrl.replace(/^https?:\/\//, "")}
          </a>{" "}
          · {t("last_verified")}: {s.lastVerified}
        </p>
        {!reportOpen && (
          <button onClick={() => setReportOpen(true)} disabled={reported} className="font-semibold text-rose-600 hover:underline disabled:text-gray-500">
            {reported ? `✓ ${t("report_thanks")}` : `🚩 ${t("report_error")}`}
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
          className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 p-4"
        >
          <label className="text-sm font-semibold text-rose-900">{t("report_what")}</label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows={3}
            maxLength={1000}
            className="mt-2 w-full rounded-xl border border-rose-200 bg-white p-3 outline-none focus:border-rose-400"
          />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              {t("ask_send")}
            </button>
            <button type="button" onClick={() => setReportOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600">
              {t("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  tone,
  children,
}: {
  icon: string;
  title: string;
  tone?: "amber";
  children: React.ReactNode;
}) {
  return (
    <section
      className={`mt-6 rounded-3xl border p-6 md:p-8 ${tone === "amber" ? "border-amber-100 bg-amber-50" : "border-black/5 bg-white"}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}
