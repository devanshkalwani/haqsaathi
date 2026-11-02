"use client";

import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { storage, type LocalData } from "./storage";
import type { Profile } from "./types";

/**
 * Login and cloud sync.
 *
 * - Login: Supabase Auth with a 6-digit code sent by email (free, no passwords to forget).
 * - Guests can use everything without logging in. Data stays on the device.
 * - After login, device data and account data are merged, then every change
 *   is copied to the user's row in the `profiles` table.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
function browserDb(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  client ??= createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}

type ProfileRow = { id: string; name: string | null; answers: Profile | null; saved: string[]; docs_ready: string[] };

type AuthCtx = {
  /** false when Supabase isn't configured: login is hidden and the app runs in guest mode */
  available: boolean;
  user: User | null;
  loading: boolean;
  sendCode: (email: string) => Promise<string | null>; // returns an error message or null
  verifyCode: (email: string, code: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = browserDb();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(db));
  const userRef = useRef<User | null>(null);

  /** Upload this device's data to the user's profile row. */
  const push = useCallback(
    async (uid: string) => {
      if (!db) return;
      const d = storage.getAll();
      await db.from("profiles").upsert({ id: uid, name: d.name || null, answers: d.profile, saved: d.saved, docs_ready: d.docsReady });
    },
    [db],
  );

  /** After login: merge device data with account data, keep both the same. */
  const pullAndMerge = useCallback(
    async (uid: string) => {
      if (!db) return;
      const { data } = await db.from("profiles").select("*").eq("id", uid).maybeSingle<ProfileRow>();
      const local = storage.getAll();
      if (data) {
        const merged: LocalData = {
          name: data.name || local.name,
          profile: data.answers ?? local.profile,
          saved: union(data.saved ?? [], local.saved),
          docsReady: union(data.docs_ready ?? [], local.docsReady),
        };
        storage.loadFromCloud(merged);
      }
      await push(uid);
    },
    [db, push],
  );

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      userRef.current = u;
      setUser(u);
      setLoading(false);
      if (u) pullAndMerge(u.id);
    });
    const { data: sub } = db.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      const wasLoggedOut = !userRef.current;
      userRef.current = u;
      setUser(u);
      if (event === "SIGNED_IN" && u && wasLoggedOut) pullAndMerge(u.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [db, pullAndMerge]);

  // Copy every local change to the cloud (waits 0.8s so quick clicks become one save).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onChange = (e: Event) => {
      const { fromCloud } = (e as CustomEvent<{ fromCloud: boolean }>).detail ?? {};
      const u = userRef.current;
      if (!u || fromCloud) return;
      clearTimeout(timer);
      timer = setTimeout(() => push(u.id), 800);
    };
    window.addEventListener("hs-storage-change", onChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hs-storage-change", onChange);
    };
  }, [push]);

  const value: AuthCtx = {
    available: Boolean(db),
    user,
    loading,
    sendCode: async (email) => {
      if (!db) return "Login is not set up yet.";
      const { error } = await db.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      return error?.message ?? null;
    },
    verifyCode: async (email, code) => {
      if (!db) return "Login is not set up yet.";
      const { error } = await db.auth.verifyOtp({ email, token: code, type: "email" });
      return error?.message ?? null;
    },
    signOut: async () => {
      await db?.auth.signOut();
      storage.clearAll(); // so the next person on a shared phone doesn't see this data
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
