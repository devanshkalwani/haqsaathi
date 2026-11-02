import type { Lang, Profile } from "./types";

/**
 * The user's data on this device (localStorage).
 *
 * - Guests: data stays only on this device.
 * - Logged-in users: AuthProvider (src/lib/auth.tsx) listens for the
 *   "hs-storage-change" event and copies changes to their Supabase profile,
 *   so the same data shows up on any phone they log in from.
 */

const KEYS = {
  name: "hs_name",
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

/** Saves a value and tells the rest of the app (and the cloud sync) that something changed. */
function write(key: string, value: unknown, { fromCloud = false } = {}) {
  if (typeof window === "undefined") return;
  if (value === null) window.localStorage.removeItem(key);
  else window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("hs-storage-change", { detail: { key, fromCloud } }));
  if (key === KEYS.saved) window.dispatchEvent(new Event("hs-saved-change"));
}

export type LocalData = {
  name: string;
  profile: Profile | null;
  saved: string[];
  docsReady: string[];
};

export const storage = {
  getName: () => read<string>(KEYS.name, ""),
  setName: (n: string) => write(KEYS.name, n),

  getProfile: () => read<Profile | null>(KEYS.profile, null),
  setProfile: (p: Profile) => write(KEYS.profile, p),

  getSaved: () => read<string[]>(KEYS.saved, []),
  setSaved: (ids: string[]) => write(KEYS.saved, ids),

  getDocsReady: () => read<string[]>(KEYS.docs, []),
  setDocsReady: (ids: string[]) => write(KEYS.docs, ids),

  getLang: () => read<Lang>(KEYS.lang, "en"),
  setLang: (l: Lang) => write(KEYS.lang, l),

  /** Everything the cloud sync needs, in one object. */
  getAll: (): LocalData => ({
    name: read(KEYS.name, ""),
    profile: read<Profile | null>(KEYS.profile, null),
    saved: read<string[]>(KEYS.saved, []),
    docsReady: read<string[]>(KEYS.docs, []),
  }),

  /** Used after login to load the account's data onto this device. Does not trigger a sync back. */
  loadFromCloud: (d: LocalData) => {
    write(KEYS.name, d.name || null, { fromCloud: true });
    write(KEYS.profile, d.profile, { fromCloud: true });
    write(KEYS.saved, d.saved, { fromCloud: true });
    write(KEYS.docs, d.docsReady, { fromCloud: true });
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("hs-storage-change", { detail: { key: "*", fromCloud: true } }));
    window.dispatchEvent(new Event("hs-saved-change"));
  },
};
