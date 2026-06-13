-- App Store: CMS-managed Android apps with product pages at /apps/[slug]

-- ─── Apps ───────────────────────────────────────────────────────────────────
create table if not exists apps (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  logo_url text,
  logo_storage_path text,
  apk_url text,
  apk_storage_path text,
  play_store_url text,
  version text not null default '1.0.0',
  file_size text not null default '',
  last_updated text not null default '',
  downloads_count int not null default 0,
  technologies jsonb not null default '[]',
  features jsonb not null default '[]',
  rating numeric(2,1) not null default 4.5 check (rating >= 0 and rating <= 5),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists app_screenshots (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid not null references apps(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Hero: optional Download App CTA ────────────────────────────────────────
alter table hero_settings
  add column if not exists download_app_enabled boolean not null default false;

alter table hero_settings
  add column if not exists download_app_id uuid references apps(id) on delete set null;

-- ─── Projects: optional link to app page ────────────────────────────────────
alter table projects
  add column if not exists app_id uuid references apps(id) on delete set null;

-- ─── Storage bucket ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('app-assets', 'app-assets', true) on conflict do nothing;

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table apps enable row level security;
alter table app_screenshots enable row level security;

drop policy if exists "Public read published apps" on apps;
drop policy if exists "Public read app screenshots" on app_screenshots;
drop policy if exists "Admin all apps" on apps;
drop policy if exists "Admin all app screenshots" on app_screenshots;
drop policy if exists "Public read app assets storage" on storage.objects;
drop policy if exists "Admin upload app assets" on storage.objects;

create policy "Public read published apps" on apps for select using (published = true);
create policy "Public read app screenshots" on app_screenshots for select using (true);

create policy "Admin all apps" on apps for all using (auth.role() = 'authenticated');
create policy "Admin all app screenshots" on app_screenshots for all using (auth.role() = 'authenticated');

create policy "Public read app assets storage" on storage.objects for select using (bucket_id = 'app-assets');
create policy "Admin upload app assets" on storage.objects for insert with check (bucket_id = 'app-assets' and auth.role() = 'authenticated');

create or replace function increment_app_downloads(app_slug text)
returns void
language plpgsql
security definer
as $$
begin
  update apps set downloads_count = downloads_count + 1 where slug = app_slug and published = true;
end;
$$;

grant execute on function increment_app_downloads(text) to anon, authenticated;
