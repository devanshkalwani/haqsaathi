"use client";

import { useLang } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex rounded-lg border border-line bg-surface-2 p-0.5 text-sm font-semibold" role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 transition ${lang === l ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"}`}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}
