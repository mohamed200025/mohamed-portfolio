-- Pricing calculator tables (CMS-driven)
-- Run in Supabase SQL Editor or via: npx supabase db push

create extension if not exists "uuid-ossp";

-- ─── Settings (singleton) ───────────────────────────────────────────────────
create table if not exists pricing_settings (
  id int primary key default 1 check (id = 1),
  badge text not null default 'PROJECT CALCULATOR',
  title_prefix text not null default 'Calculate Your',
  title_highlight text not null default 'Project Cost',
  subtitle text not null default 'Get an instant estimate for your project. Customize your requirements and receive a price range in real-time.',
  default_currency text not null default 'EUR',
  updated_at timestamptz not null default now()
);

-- ─── Currencies ─────────────────────────────────────────────────────────────
create table if not exists pricing_currencies (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  symbol text not null,
  exchange_rate numeric not null default 1,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Project types ──────────────────────────────────────────────────────────
create table if not exists pricing_project_types (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  min_price numeric not null default 0,
  max_price numeric not null default 0,
  icon text not null default 'Globe',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Features ───────────────────────────────────────────────────────────────
create table if not exists pricing_features (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  min_price numeric not null default 0,
  max_price numeric not null default 0,
  icon text not null default 'Code2',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Timeline options ───────────────────────────────────────────────────────
create table if not exists pricing_timeline_options (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  percentage_modifier numeric not null default 0,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Leads ──────────────────────────────────────────────────────────────────
create table if not exists pricing_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  whatsapp text,
  project_type text not null default '',
  estimated_min numeric not null default 0,
  estimated_max numeric not null default 0,
  currency text not null default 'EUR',
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table pricing_settings enable row level security;
alter table pricing_currencies enable row level security;
alter table pricing_project_types enable row level security;
alter table pricing_features enable row level security;
alter table pricing_timeline_options enable row level security;
alter table pricing_leads enable row level security;

drop policy if exists "Public read pricing settings" on pricing_settings;
drop policy if exists "Public read enabled currencies" on pricing_currencies;
drop policy if exists "Public read published project types" on pricing_project_types;
drop policy if exists "Public read published features" on pricing_features;
drop policy if exists "Public read published timeline options" on pricing_timeline_options;
drop policy if exists "Public insert pricing leads" on pricing_leads;
drop policy if exists "Admin all pricing settings" on pricing_settings;
drop policy if exists "Admin all pricing currencies" on pricing_currencies;
drop policy if exists "Admin all pricing project types" on pricing_project_types;
drop policy if exists "Admin all pricing features" on pricing_features;
drop policy if exists "Admin all pricing timeline options" on pricing_timeline_options;
drop policy if exists "Admin read pricing leads" on pricing_leads;
drop policy if exists "Admin update pricing leads" on pricing_leads;
drop policy if exists "Admin delete pricing leads" on pricing_leads;

create policy "Public read pricing settings" on pricing_settings for select using (true);
create policy "Public read enabled currencies" on pricing_currencies for select using (enabled = true);
create policy "Public read published project types" on pricing_project_types for select using (published = true);
create policy "Public read published features" on pricing_features for select using (published = true);
create policy "Public read published timeline options" on pricing_timeline_options for select using (published = true);
create policy "Public insert pricing leads" on pricing_leads for insert with check (true);

create policy "Admin all pricing settings" on pricing_settings for all using (auth.role() = 'authenticated');
create policy "Admin all pricing currencies" on pricing_currencies for all using (auth.role() = 'authenticated');
create policy "Admin all pricing project types" on pricing_project_types for all using (auth.role() = 'authenticated');
create policy "Admin all pricing features" on pricing_features for all using (auth.role() = 'authenticated');
create policy "Admin all pricing timeline options" on pricing_timeline_options for all using (auth.role() = 'authenticated');
create policy "Admin read pricing leads" on pricing_leads for select using (auth.role() = 'authenticated');
create policy "Admin update pricing leads" on pricing_leads for update using (auth.role() = 'authenticated');
create policy "Admin delete pricing leads" on pricing_leads for delete using (auth.role() = 'authenticated');

-- ─── Seed data ──────────────────────────────────────────────────────────────
insert into pricing_settings (id, badge, title_prefix, title_highlight, subtitle, default_currency)
values (
  1,
  'PROJECT CALCULATOR',
  'Calculate Your',
  'Project Cost',
  'Get an instant estimate for your project. Customize your requirements and receive a price range in real-time.',
  'EUR'
) on conflict (id) do nothing;

insert into pricing_currencies (code, symbol, exchange_rate, enabled, sort_order) values
  ('EUR', '€', 1, true, 0),
  ('USD', '$', 1.12, true, 1),
  ('DZD', 'DA', 250, true, 2)
on conflict (code) do nothing;

insert into pricing_project_types (title, description, min_price, max_price, icon, sort_order) values
  ('Landing Page', 'Single page website', 300, 600, 'Monitor', 0),
  ('Business Website', 'Multi-page business website', 600, 1200, 'Globe', 1),
  ('LMS Platform', 'Learning management platform', 1500, 5000, 'Layers', 2),
  ('Mobile App', 'iOS / Android application', 2500, 8000, 'Smartphone', 3)
on conflict do nothing;

insert into pricing_features (title, description, min_price, max_price, icon, sort_order) values
  ('Authentication', 'User login and registration', 150, 300, 'User', 0),
  ('Admin Dashboard', 'Back-office management panel', 200, 400, 'LayoutDashboard', 1),
  ('CMS', 'Content management system', 150, 350, 'BookOpen', 2),
  ('Payment System', 'Stripe or payment gateway', 200, 500, 'CreditCard', 3),
  ('Multi-language', 'i18n support', 100, 250, 'Globe', 4),
  ('API Integration', 'Third-party API connections', 150, 400, 'Code2', 5),
  ('AI Features', 'AI-powered functionality', 300, 1000, 'Sparkles', 6),
  ('Push Notifications', 'Mobile/web notifications', 100, 200, 'Bell', 7),
  ('SEO Optimization', 'Search engine optimization', 100, 200, 'Search', 8)
on conflict do nothing;

insert into pricing_timeline_options (title, percentage_modifier, sort_order) values
  ('Urgent', 30, 0),
  ('Standard', 0, 1),
  ('Flexible', -10, 2)
on conflict do nothing;
