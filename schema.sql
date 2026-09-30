-- LinkDonkey: run once in Supabase > SQL Editor.
-- One row per account holding the app state. Row-level security limits every row to its owner.
create table if not exists public.ld_state (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  doc        jsonb not null,
  rev        bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint ld_state_doc_size check (octet_length(doc::text) < 2000000)
);

alter table public.ld_state enable row level security;

create policy "ld_state select own" on public.ld_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "ld_state insert own" on public.ld_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "ld_state update own" on public.ld_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update on public.ld_state to authenticated;
revoke all on public.ld_state from anon;
