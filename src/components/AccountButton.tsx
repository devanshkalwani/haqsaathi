"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth";
import { useLocalData } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { LayoutDashboard, LogOut } from "lucide-react";

/** Top-right account control: "Log in" for guests, an avatar with a small menu for logged-in users. */
export default function AccountButton() {
  const { t } = useLang();
  const { available, user, loading, signOut } = useAuth();
  const local = useLocalData();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // false while the page hydrates, so the server HTML and the first client render match
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const box = useRef<HTMLDivElement>(null);

  // Close the menu when tapping outside it
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!hydrated || !available || loading) return null;

  if (!user) {
    return (
      <Link href="/login" className="whitespace-nowrap rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800">
        {t("login")}
      </Link>
    );
  }

  const label = local?.name || user.email?.split("@")[0] || "";
  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-base font-bold uppercase text-accent-400 ring-2 ring-brand-100"
      >
        {label.charAt(0) || "U"}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate font-bold text-ink">{label}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
            <LayoutDashboard className="mr-2 inline h-4 w-4" />{t("nav_dashboard")}
          </Link>
          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.push("/");
            }}
            className="block w-full px-4 py-3 text-left font-semibold text-rose-700 hover:bg-rose-50"
          >
            <LogOut className="mr-2 inline h-4 w-4" />{t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}

const noop = () => () => {};
