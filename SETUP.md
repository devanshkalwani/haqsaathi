# Connect the database (Supabase)

Takes about 15 minutes. You only do this once.

Until you finish these steps, the app keeps working with the sample data in `src/data/`.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New project**.
   - Name: `haqsaathi`
   - Database password: make a strong one and save it somewhere safe
   - Region: **South Asia (Mumbai)** (closest to your users)
3. Wait 1–2 minutes while it sets up.

## 2. Create the tables

1. In your project, open **SQL Editor** (left menu) → **New query**.
2. Open the file `supabase/schema.sql` from this project, copy everything, paste it in.
3. Click **Run**. You should see "Success. No rows returned".
4. Open **Table Editor**: you should now see `schemes`, `documents` and `error_reports`.

## 3. Add your keys to the app

1. In Supabase, go to **Project Settings → API** (or **API Keys**).
2. In VS Code, copy `.env.example` to a new file called `.env.local` (same folder as `package.json`).
3. Fill it in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the "anon" or "publishable" key>
SUPABASE_SERVICE_ROLE_KEY=<the "service_role" or "secret" key>
ADMIN_PASSWORD=<choose a long password for the admin panel>
```

> ⚠️ **Never share `SUPABASE_SERVICE_ROLE_KEY` or commit `.env.local` to GitHub.** It gives full access to your database. `.env.local` is already in `.gitignore`.

## 4. Load the 20 sample schemes

In the VS Code terminal:

```bash
npm run db:seed
```

You should see:

```
✓ 16 documents saved
✓ 20 schemes saved
```

## 5. Start the app

Stop the app if it's running (Ctrl + C), then:

```bash
npm run dev
```

The site now reads schemes from Supabase.

## 6. Try the admin panel

1. Open http://localhost:3000/admin
2. Log in with your `ADMIN_PASSWORD`.
3. You'll see all schemes, open error reports, and which schemes need re-checking.
4. Click **Edit** on a scheme, change something, click **Save**. Refresh the public scheme page: the change is there.
5. On any public scheme page, click **Report a mistake**, type something and send. It shows up in the admin panel.

---

## How it fits together

```
Browser ──► Next.js pages ──► src/lib/data.ts ──► Supabase (schemes, documents)
                │                     └─ falls back to src/data/ if Supabase isn't set up
                ├─► /api/report ──────────────► Supabase (error_reports)
                └─► /admin (password) ─► server actions ─► Supabase (full access, server only)
```

- **Public visitors** can only read published schemes and send error reports. This is enforced by the database itself (Row Level Security in `schema.sql`).
- **Admin edits** happen on the server with the secret key, so it never reaches the browser.
- **Caching:** scheme data is cached for 1 hour so the site stays fast. Saving in the admin panel refreshes it instantly.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm run db:seed` says "Could not find .env.local" | Create `.env.local` in the same folder as `package.json` |
| Seed fails with "relation does not exist" | You skipped step 2. Run `schema.sql` in the SQL Editor |
| Admin says "database is not connected" | Check all 3 Supabase values in `.env.local`, then restart `npm run dev` |
| Changes in `.env.local` don't apply | Always restart `npm run dev` after editing `.env.local` |
