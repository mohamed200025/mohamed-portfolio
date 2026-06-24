-- Wizard quote requests (Request Final Quote workflow)

create table if not exists pricing_proposals (
  id uuid primary key default uuid_generate_v4(),
  proposal_id text unique not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewing', 'approved', 'rejected', 'completed')),
  client_full_name text not null,
  phone_number text,
  email text,
  company_name text,
  country text,
  project_name text not null default '',
  project_description text not null default '',
  category_id text,
  industry_id text,
  target_audience text,
  selected_services jsonb not null default '[]'::jsonb,
  optional_features jsonb not null default '[]'::jsonb,
  number_of_pages text,
  complexity_level text,
  complexity_score int not null default 0,
  timeline text,
  estimated_duration text,
  currency text not null default 'EUR',
  price_breakdown jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  final_price numeric not null default 0,
  pdf_storage_path text,
  pdf_public_url text,
  client_metadata jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pricing_proposals_proposal_id_idx on pricing_proposals (proposal_id);
create index if not exists pricing_proposals_status_idx on pricing_proposals (status);
create index if not exists pricing_proposals_created_at_idx on pricing_proposals (created_at desc);

alter table pricing_proposals enable row level security;

drop policy if exists "Public can submit pricing proposals" on pricing_proposals;
create policy "Public can submit pricing proposals"
  on pricing_proposals for insert
  with check (true);

drop policy if exists "Admin can read pricing proposals" on pricing_proposals;
create policy "Admin can read pricing proposals"
  on pricing_proposals for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admin can update pricing proposals" on pricing_proposals;
create policy "Admin can update pricing proposals"
  on pricing_proposals for update
  using (auth.role() = 'authenticated');

-- Storage bucket for generated proposal PDFs
insert into storage.buckets (id, name, public)
values ('proposal-pdfs', 'proposal-pdfs', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read proposal PDFs" on storage.objects;
create policy "Public read proposal PDFs"
  on storage.objects for select
  using (bucket_id = 'proposal-pdfs');

drop policy if exists "Public upload proposal PDFs" on storage.objects;
create policy "Public upload proposal PDFs"
  on storage.objects for insert
  with check (bucket_id = 'proposal-pdfs');
