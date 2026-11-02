"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Light / dark switch. The choice is kept in localStorage ("hs-theme").
 * A tiny script in app/layout.tsx applies it before the page paints, so there is no flash.
 * With no saved choice, the phone's own setting is followed.
 */
export default function ThemeToggle() {
  const { t } = useLang();
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => false);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hs-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("theme_light") : t("theme_dark")}
      title={dark ? t("theme_light") : t("theme_dark")}
      className="flex h-9 w-9 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-line bg-surface text-fg-2 transition hover:bg-surface-2 hover:text-fg"
    >
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

/** Runs in <head> before first paint. Keep it tiny and dependency-free. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("hs-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
