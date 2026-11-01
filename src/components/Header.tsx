"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, type UIKey } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

const NAV: { href: string; key: UIKey; icon: string }[] = [
  { href: "/", key: "nav_home", icon: "🏠" },
  { href: "/check", key: "nav_check", icon: "✅" },
  { href: "/schemes", key: "nav_schemes", icon: "📚" },
  { href: "/ask", key: "nav_ask", icon: "💬" },
  { href: "/checklist", key: "nav_checklist", icon: "📋" },
];

export default function Header() {
  const { t } = useLang();
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-extrabold tracking-tight text-brand-800">
              Haq<span className="text-accent-500">Saathi</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.slice(1).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive(n.href) ? "bg-brand-100 text-brand-800" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <LanguageToggle />
        </div>
      </header>

      {/* Bottom bar for phones: easy to reach with a thumb */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-black/5 bg-white md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              isActive(n.href) ? "text-brand-700" : "text-gray-500"
            }`}
          >
            <span className="text-lg" aria-hidden>
              {n.icon}
            </span>
            {t(n.key)}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      <rect width="34" height="34" rx="10" fill="#0f766e" />
      <path d="M10 18.5l4.5 4.5L24 12" stroke="#fbbf24" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
