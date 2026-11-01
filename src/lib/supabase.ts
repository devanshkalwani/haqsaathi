import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase connection.
 * If the keys are not set in .env.local, the app keeps working with the local
 * sample data in src/data/ (handy while learning or working offline).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // "anon" or "publishable" key: safe to expose
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // "service_role" or "secret" key: SERVER ONLY, never expose

export const isDbConfigured = Boolean(url && anonKey);

/** Public client: can only do what Row Level Security allows (read schemes, send reports). */
export function publicDb(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase is not configured. Add keys to .env.local");
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Admin client: full access. Only ever use this in server code (server actions, route handlers). */
export function adminDb(): SupabaseClient {
  if (!url || !serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
