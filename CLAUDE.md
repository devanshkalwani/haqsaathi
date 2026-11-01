# HaqSaathi – notes for Claude Code

@AGENTS.md

## Project
Independent (non-government) website helping Indians find and apply for government schemes. Users are often low-income, low-literacy, on cheap Android phones. Keep UI simple, big tap targets, simple words, Hindi + English.

## Rules
- Every user-facing string must exist in both English and Hindi (`L` type `{ en, hi }`). Fixed UI text goes in `src/lib/i18n.tsx`.
- Pages get schemes via `useData()` (client) or `getSchemes()` from `src/lib/data.ts` (server). Never import `src/data/schemes.ts` directly in pages: it is only the offline fallback and seed source.
- Scheme facts (in Supabase, seeded from `src/data/schemes.ts`) each need an official `sourceUrl` and `lastVerified` date. Never invent scheme facts.
- Eligibility is decided by `src/lib/eligibility.ts` (exact logic). AI is only for explaining, never for deciding eligibility.
- Never collect Aadhaar numbers, OTPs, bank PINs or passwords. Never style the site to look like an official government site.
- `SUPABASE_SERVICE_ROLE_KEY` / `adminDb()` only in server code. Every admin server action must call `requireAdmin()` first. After changing schemes, call `updateTag("schemes")`.
- Database changes: edit `supabase/schema.sql` (keep it re-runnable) and keep `src/lib/mappers.ts` in sync.
- Run `npm run lint` and `npm run build` before committing.

## Stack
Next.js 16 App Router (Cache Components on: pages that read URL params must wrap the client part in `<Suspense>`), React 19, TypeScript, Supabase (supabase-js), Tailwind CSS 4 (theme tokens in `src/app/globals.css`).
