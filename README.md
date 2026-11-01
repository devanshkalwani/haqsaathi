# HaqSaathi

**Your companion for every benefit you deserve.**

HaqSaathi helps people in India find the government schemes they are eligible for, understand them in simple Hindi or English, and know exactly which documents they need and how to apply.

> HaqSaathi is an independent project. It is **not** a government website.

---

## Run it on your computer

You need **Node.js 20 or newer** ([download](https://nodejs.org)).

```bash
npm install        # install packages (first time only)
npm run dev        # start the app
```

Open http://localhost:3000 in your browser.

### Connect the database (Supabase)

Follow **[SETUP.md](SETUP.md)** (about 15 minutes). Without it, the app uses the sample data in `src/data/`.

### Optional: turn on real AI answers in the chat

Without a key, the chat still works: it answers from the scheme data with a simple template.
To use Claude for natural answers, copy `.env.example` to `.env.local` and add your key:

```
ANTHROPIC_API_KEY=your-key-here
```

---

## What's inside

| Page | Path | What it does |
|---|---|---|
| Home | `/` | Hero, how it works, categories, popular schemes |
| Check Benefits | `/check` | 8-step quiz, one question per screen |
| Results | `/results` | Schemes the user is likely eligible for |
| All Schemes | `/schemes` | Search (English + Hindi) and category filters |
| Scheme detail | `/schemes/[id]` | Benefit, who can apply, documents, steps, listen aloud |
| Ask Saathi | `/ask` | Chat with voice input (mic) and read-aloud answers |
| My List | `/checklist` | Saved schemes + combined document checklist (printable) |
| About / Privacy | `/about`, `/privacy` | Mission, disclaimer, delete-my-data button |
| Admin | `/admin` | Password login, edit schemes, see error reports and schemes that need re-checking |

## Folder structure

```
src/
  app/                 Pages (Next.js App Router). Each folder = one URL.
    api/chat/route.ts  Chat backend: finds matching schemes, optionally asks Claude
    api/report/        Saves "Report a mistake" messages
    admin/             Admin panel (login, dashboard, scheme editor, server actions)
  components/          Reusable UI pieces (Header, Footer, SchemeCard, ...)
  data/
    schemes.ts         ⭐ All scheme data (edit here to add schemes)
    documents.ts       Documents and how to get each one
    options.ts         Quiz choices, categories, states
  lib/
    types.ts           Data shapes (Scheme, Profile, Rule)
    eligibility.ts     ⭐ The eligibility engine (pure logic, no AI)
    i18n.tsx           Hindi/English text and language switch
    search.ts          Keyword search used by search box and chat
    storage.ts         Saves data in the browser (localStorage)
    data.ts            ⭐ Loads schemes from Supabase (or local files), cached
    data-context.tsx   Shares scheme data with all client pages (useData)
    supabase.ts        Database connection
    mappers.ts         Converts database rows ⇄ app objects
    admin-auth.ts      Admin password login
    hooks.ts           Saved schemes, voice input, read aloud
supabase/schema.sql    Database tables and security rules
scripts/seed.ts        Loads src/data/ into Supabase (npm run db:seed)
```

## How to add a new scheme

**With the database connected:** use the admin panel at `/admin` → **+ Add scheme**.

**Without the database:**

1. Open `src/data/schemes.ts`.
2. Copy an existing scheme block and change the fields.
3. Write `rules`: the user is eligible if they match **any one** rule. Every field inside a rule must match.
4. Add any new documents to `src/data/documents.ts`.
5. Always set `sourceUrl` to the official page and update `lastVerified`.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Postgres) · Web Speech API (voice) · Claude API (optional)

## Next steps (from the SRS)

- [ ] Verify all 20 sample schemes against official sources (two people each)
- [x] Move scheme data to Supabase + build an admin panel
- [x] Save "Report a mistake" to the database
- [ ] Separate admin accounts (Supabase Auth) instead of one shared password
- [ ] Better voice in Indian languages with Bhashini or Sarvam
- [ ] Mobile OTP login, application tracker, alerts
- [ ] Add your home state's schemes
- [ ] Vector search (embeddings) for the chat
- [ ] WhatsApp channel (Phase 4)
