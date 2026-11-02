"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SchemeCard from "@/components/SchemeCard";
import { EmptyState, PageHero, btn } from "@/components/ui";
import { useData } from "@/lib/data-context";
import { findEligible } from "@/lib/eligibility";
import { useLang } from "@/lib/i18n";
import { storage } from "@/lib/storage";
import type { Profile } from "@/lib/types";
import { ArrowRight, BadgeCheck, ClipboardList, Info, MessagesSquare, Pencil } from "lucide-react";

export default function ResultsPage() {
  const { t } = useLang();
  const { schemes: SCHEMES } = useData();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(storage.getProfile());
  }, []);

  if (profile === undefined) return null; // still loading from the browser

  if (profile === null) {
    return (
      <div className="px-4 py-16">
        <EmptyState icon={ClipboardList} title={t("results_title")} sub={t("results_no_profile")}>
          <Link href="/check" className={btn.accent}>
            {t("hero_cta")} <ArrowRight className="h-5 w-5" />
          </Link>
        </EmptyState>
      </div>
    );
  }

  const matches = findEligible(profile, SCHEMES);

  return (
    <div>
      <PageHero
        icon={BadgeCheck}
        eyebrow={t("results_title")}
        title={
          <>
            {t("results_found")} <span className="text-accent-400">{matches.length}</span> {t("results_schemes")}
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/checklist" className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-3 font-bold text-brand-950 transition hover:bg-accent-500">
            <ClipboardList className="h-5 w-5" /> {t("nav_checklist")}
          </Link>
          <Link href="/check" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
            <Pencil className="h-4 w-4" /> {t("edit_answers")}
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 pt-8">
        <p className="flex gap-2.5 rounded-xl border border-accent-400/30 bg-warn-soft p-4 text-sm leading-relaxed text-warn-fg">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> {t("results_note")}
        </p>

        {matches.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={MessagesSquare} title={t("results_none")}>
              <Link href="/ask" className={btn.primary}>
                <MessagesSquare className="h-5 w-5" /> {t("nav_ask")}
              </Link>
            </EmptyState>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((s) => (
              <SchemeCard key={s.id} scheme={s} eligible />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
