-- Migration criada automaticamente pelo LOV3 em 2026-09-01T22:51:23.096Z
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Qualquer um pode se inscrever" on public.newsletter_subscribers;
create policy "Qualquer um pode se inscrever"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Ninguem pode ler inscritos" on public.newsletter_subscribers;
create policy "Ninguem pode ler inscritos"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (false);