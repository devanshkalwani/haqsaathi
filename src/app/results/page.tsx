"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SchemeCard from "@/components/SchemeCard";
import { SCHEMES } from "@/data/schemes";
import { findEligible } from "@/lib/eligibility";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export default function ResultsPage() {
  const { t } = useLang();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(storage.getProfile());
  }, []);

  if (profile === undefined) return null; // still loading from the browser

  if (profile === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">📝</p>
        <p className="mt-4 text-lg">{t("results_no_profile")}</p>
        <Link href="/check" className="mt-6 inline-block rounded-2xl bg-brand-700 px-6 py-3 font-bold text-white">
          {t("hero_cta")} →
        </Link>
      </div>
    );
  }

  const matches = findEligible(profile, SCHEMES);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 p-6 text-white md:p-8">
        <p className="text-white/80">{t("results_title")}</p>
        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
          {t("results_found")} {matches.length} {t("results_schemes")} 🎉
        </h1>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/check" className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
            ✏️ {t("edit_answers")}
          </Link>
          <Link href="/checklist" className="rounded-xl bg-accent-400 px-4 py-2 text-sm font-bold text-brand-900 hover:bg-accent-500">
            📋 {t("nav_checklist")}
          </Link>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">ℹ️ {t("results_note")}</p>

      {matches.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-gray-600">{t("results_none")}</p>
          <Link href="/ask" className="mt-4 inline-block rounded-2xl bg-brand-700 px-6 py-3 font-bold text-white">
            💬 {t("nav_ask")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((s) => (
            <SchemeCard key={s.id} scheme={s} eligible />
          ))}
        </div>
      )}
    </div>
  );
}
