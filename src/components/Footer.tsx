"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Brand } from "./Logo";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-20 border-t border-line bg-surface pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Brand size={32} />
            <p className="mt-3 text-fg-2">{t("tagline")}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-fg-2">
            <Link href="/schemes" className="transition hover:text-fg">{t("nav_schemes")}</Link>
            <Link href="/check" className="transition hover:text-fg">{t("nav_check")}</Link>
            <Link href="/about" className="transition hover:text-fg">{t("about")}</Link>
            <Link href="/about#faq" className="transition hover:text-fg">FAQ</Link>
            <Link href="/privacy" className="transition hover:text-fg">{t("privacy")}</Link>
          </nav>
        </div>
        <p className="mt-8 flex gap-3 rounded-xl border border-line bg-surface-2 p-4 leading-relaxed text-fg-2">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
          {t("disclaimer")}
        </p>
        <p className="mt-4 text-xs text-muted">{t("sample_data")}</p>
      </div>
    </footer>
  );
}
