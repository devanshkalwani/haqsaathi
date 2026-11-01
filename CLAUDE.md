# HaqSaathi – notes for Claude Code

@AGENTS.md

## Project
Independent (non-government) website helping Indians find and apply for government schemes. Users are often low-income, low-literacy, on cheap Android phones. Keep UI simple, big tap targets, simple words, Hindi + English.

## Rules
- Every user-facing string must exist in both English and Hindi (`L` type `{ en, hi }`). Fixed UI text goes in `src/lib/i18n.tsx`.
- Scheme facts live only in `src/data/schemes.ts`, each with an official `sourceUrl` and `lastVerified` date. Never invent scheme facts.
- Eligibility is decided by `src/lib/eligibility.ts` (exact logic). AI is only for explaining, never for deciding eligibility.
- Never collect Aadhaar numbers, OTPs, bank PINs or passwords. Never style the site to look like an official government site.
- Run `npm run lint` and `npm run build` before committing.

## Stack
Next.js 16 App Router (Cache Components on: pages that read URL params must wrap the client part in `<Suspense>`), React 19, TypeScript, Tailwind CSS 4 (theme tokens in `src/app/globals.css`).
