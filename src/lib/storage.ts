import type { Lang, Profile } from "./types";

/**
 * Everything is saved only in the user's own browser (localStorage).
 * Nothing is sent to a server. Later, accounts can sync this to Supabase.
 */

const KEYS = {
  profile: "hs_profile",
  saved: "hs_saved_schemes",
  docs: "hs_docs_ready",
  lang: "hs_lang",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProfile: () => read<Profile | null>(KEYS.profile, null),
  setProfile: (p: Profile) => write(KEYS.profile, p),

  getSaved: () => read<string[]>(KEYS.saved, []),
  setSaved: (ids: string[]) => write(KEYS.saved, ids),

  getDocsReady: () => read<string[]>(KEYS.docs, []),
  setDocsReady: (ids: string[]) => write(KEYS.docs, ids),

  getLang: () => read<Lang>(KEYS.lang, "en"),
  setLang: (l: Lang) => write(KEYS.lang, l),

  clearAll: () => {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  },
};
