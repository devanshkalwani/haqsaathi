"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t border-black/5 bg-white pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">{t("disclaimer")}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-semibold text-brand-800">
            HaqSaathi · <span className="font-normal text-gray-500">{t("tagline")}</span>
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-brand-700">
              {t("about")}
            </Link>
            <Link href="/privacy" className="hover:text-brand-700">
              {t("privacy")}
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400">{t("sample_data")}</p>
      </div>
    </footer>
  );
}
