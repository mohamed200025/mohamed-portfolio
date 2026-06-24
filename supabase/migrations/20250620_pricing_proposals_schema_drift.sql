-- Repair schema drift on existing public.pricing_proposals (no table recreate, no data loss)

alter table public.pricing_proposals
  add column if not exists client_full_name text,
  add column if not exists phone_number text,
  add column if not exists company_name text,
  add column if not exists country text,
  add column if not exists category_id text,
  add column if not exists industry_id text,
  add column if not exists target_audience text,
  add column if not exists number_of_pages text,
  add column if not exists complexity_level text,
  add column if not exists complexity_score numeric,
  add column if not exists price_breakdown jsonb not null default '[]'::jsonb,
  add column if not exists pdf_storage_path text,
  add column if not exists pdf_public_url text,
  add column if not exists client_metadata jsonb not null default '{}'::jsonb,
  add column if not exists read boolean not null default false;

alter table public.pricing_proposals enable row level security;

drop policy if exists "Public can submit pricing proposals" on public.pricing_proposals;
create policy "Public can submit pricing proposals"
  on public.pricing_proposals
  for insert
  to anon, public
  with check (true);

drop policy if exists "Admin can read pricing proposals" on public.pricing_proposals;
create policy "Admin can read pricing proposals"
  on public.pricing_proposals
  for select
  to authenticated
  using (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
