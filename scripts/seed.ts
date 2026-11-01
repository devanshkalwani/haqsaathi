/**
 * Loads the sample schemes and documents from src/data/ into Supabase.
 * Safe to run again: existing rows with the same id are updated, not duplicated.
 *
 * Run:  npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import { DOCUMENTS } from "../src/data/documents";
import { SCHEMES } from "../src/data/schemes";
import { schemeToRow } from "../src/lib/mappers";

try {
  process.loadEnvFile(".env.local");
} catch {
  console.error("Could not find .env.local. Copy .env.example to .env.local and fill in your Supabase keys.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const docs = Object.entries(DOCUMENTS).map(([id, d]) => ({ id, name: d.name, how_to_get: d.howToGet }));
  const r1 = await db.from("documents").upsert(docs);
  if (r1.error) throw new Error("documents: " + r1.error.message);
  console.log(`✓ ${docs.length} documents saved`);

  const r2 = await db.from("schemes").upsert(SCHEMES.map(schemeToRow));
  if (r2.error) throw new Error("schemes: " + r2.error.message);
  console.log(`✓ ${SCHEMES.length} schemes saved`);
}

main().catch((e) => {
  console.error("✗ Seed failed:", e.message);
  console.error("Did you run supabase/schema.sql in the Supabase SQL Editor first?");
  process.exit(1);
});
