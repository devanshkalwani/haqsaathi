"use client";

import { useLang } from "@/lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex rounded-full bg-gray-100 p-1 text-sm font-semibold" role="group" aria-label="Language">
      {(["en", "hi"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1.5 transition ${lang === l ? "bg-white text-brand-800 shadow-sm" : "text-gray-500"}`}
        >
          {l === "en" ? "English" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
