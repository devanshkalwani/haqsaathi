-- HaqSaathi database schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

-- ============ SCHEMES ============
-- Text fields that exist in two languages are stored as JSON: {"en": "...", "hi": "..."}
create table if not exists public.schemes (
  id             text primary key,                  -- e.g. 'pm-kisan' (used in the URL)
  level          text not null default 'central' check (level in ('central', 'state', 'district')),
  state          text,                              -- only for state / district schemes
  district       text,                              -- only for district schemes
  category       text not null,
  name           jsonb not null,
  ministry       jsonb not null,
  summary        jsonb not null,
  benefit        jsonb not null,
  benefit_value  integer not null default 0,        -- rough yearly ₹ value, used only for sorting
  who_can_apply  jsonb not null default '[]',       -- list of {"en","hi"}
  documents      text[] not null default '{}',      -- ids from the documents table
  how_to_apply   jsonb not null default '[]',       -- list of {"en","hi"}
  apply_link     text not null,
  helpline       text,
  keywords       text[] not null default '{}',
  rules          jsonb not null default '[]',       -- eligibility rules, see src/lib/types.ts
  source_url     text not null,
  last_verified  date not null default current_date,
  is_published   boolean not null default true,     -- hide a scheme without deleting it
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists schemes_level_state_idx on public.schemes (level, state);

-- ============ DOCUMENTS ============
create table if not exists public.documents (
  id          text primary key,                     -- e.g. 'aadhaar'
  name        jsonb not null,
  how_to_get  jsonb not null
);

-- ============ ERROR REPORTS ("Report a mistake" button) ============
create table if not exists public.error_reports (
  id          bigint generated always as identity primary key,
  scheme_id   text references public.schemes(id) on delete cascade,
  message     text not null check (char_length(message) between 1 and 1000),
  status      text not null default 'open' check (status in ('open', 'fixed', 'ignored')),
  created_at  timestamptz not null default now()
);

-- Keep updated_at fresh automatically
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists schemes_touch on public.schemes;
create trigger schemes_touch before update on public.schemes
  for each row execute function public.touch_updated_at();

-- ============ SECURITY (Row Level Security) ============
-- The public "anon" key can only READ published schemes and documents,
-- and only INSERT error reports. All editing happens on the server with the
-- secret service_role key (used by the admin panel), which bypasses these rules.
alter table public.schemes       enable row level security;
alter table public.documents     enable row level security;
alter table public.error_reports enable row level security;

drop policy if exists "public can read published schemes" on public.schemes;
create policy "public can read published schemes" on public.schemes
  for select using (is_published);

drop policy if exists "public can read documents" on public.documents;
create policy "public can read documents" on public.documents
  for select using (true);

drop policy if exists "public can report errors" on public.error_reports;
create policy "public can report errors" on public.error_reports
  for insert with check (status = 'open');

-- ============ USER PROFILES (added for login + dashboard) ============
-- One row per logged-in user. Users can only see and change their own row.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text check (char_length(name) <= 80),
  answers     jsonb,                                -- quiz answers (see Profile in src/lib/types.ts)
  saved       text[] not null default '{}',         -- saved scheme ids
  docs_ready  text[] not null default '{}',         -- document ids the user has ready
  language    text not null default 'en' check (language in ('en', 'hi')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "users create own profile" on public.profiles;
create policy "users create own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users delete own profile" on public.profiles;
create policy "users delete own profile" on public.profiles
  for delete using (auth.uid() = id);
