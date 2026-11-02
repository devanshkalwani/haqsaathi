"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, ClipboardCheck, LayoutDashboard, MessagesSquare, SearchCheck, type LucideIcon } from "lucide-react";
import { useLang, type UIKey } from "@/lib/i18n";
import AccountButton from "./AccountButton";
import LanguageToggle from "./LanguageToggle";
import Logo, { Wordmark } from "./Logo";

const NAV: { href: string; key: UIKey; icon: LucideIcon; short?: UIKey }[] = [
  { href: "/dashboard", key: "nav_dashboard", icon: LayoutDashboard, short: "nav_home" },
  { href: "/check", key: "nav_check", icon: SearchCheck },
  { href: "/schemes", key: "nav_schemes", icon: BookOpenText },
  { href: "/ask", key: "nav_ask", icon: MessagesSquare },
  { href: "/checklist", key: "nav_checklist", icon: ClipboardCheck },
];

export default function Header() {
  const { t } = useLang();
  const path = usePathname();
  const isActive = (href: string) => path.startsWith(href);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden min-[360px]:inline">
              <Wordmark />
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  isActive(n.href) ? "text-brand-900" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {t(n.key)}
                {isActive(n.href) && <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-accent-400" />}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <AccountButton />
          </div>
        </div>
      </header>

      {/* Bottom bar for phones: easy to reach with a thumb */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map((n) => {
          const on = isActive(n.href);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center gap-1 py-2 text-[11px] font-semibold leading-tight ${on ? "text-brand-900" : "text-slate-500"}`}
            >
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${on ? "bg-accent-100 text-brand-900" : ""}`}>
                <Icon className="h-5 w-5" strokeWidth={on ? 2.2 : 1.8} aria-hidden />
              </span>
              <span className="text-center">{t(n.short ?? n.key)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
