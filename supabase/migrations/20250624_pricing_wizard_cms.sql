-- =============================================================================
-- Pricing Wizard CMS — paste this entire file into Supabase SQL Editor and Run
-- Creates: pricing_settings, pricing_services, pricing_features,
--          pricing_timeline_options, pricing_complexity_options
-- Default currency: DZD | Includes RLS + seed data
-- =============================================================================

create extension if not exists "uuid-ossp";

-- ─── 1. pricing_settings (singleton) ─────────────────────────────────────────
create table if not exists public.pricing_settings (
  id int primary key default 1 check (id = 1),
  badge text not null default 'Project Pricing',
  title_prefix text not null default 'Build your',
  title_highlight text not null default 'project estimate',
  subtitle text not null default 'Configure services and receive a live estimate.',
  default_currency text not null default 'DZD',
  updated_at timestamptz not null default now()
);

alter table public.pricing_settings
  add column if not exists usd_to_dzd numeric not null default 135,
  add column if not exists eur_to_dzd numeric not null default 157;

alter table public.pricing_settings enable row level security;

drop policy if exists "Public read pricing settings" on public.pricing_settings;
create policy "Public read pricing settings"
  on public.pricing_settings for select using (true);

drop policy if exists "Admin all pricing settings" on public.pricing_settings;
create policy "Admin all pricing settings"
  on public.pricing_settings for all using (auth.role() = 'authenticated');

insert into public.pricing_settings (id, default_currency, usd_to_dzd, eur_to_dzd)
values (1, 'DZD', 135, 157)
on conflict (id) do update set
  default_currency = excluded.default_currency,
  usd_to_dzd = excluded.usd_to_dzd,
  eur_to_dzd = excluded.eur_to_dzd,
  updated_at = now();

-- ─── 2. pricing_services ─────────────────────────────────────────────────────
create table if not exists public.pricing_services (
  id text primary key,
  name text not null,
  category_id text not null,
  section_id text not null,
  section_title text not null default '',
  price_dzd numeric not null default 0,
  price_eur numeric not null default 0,
  price_usd numeric not null default 0,
  complexity_score int not null default 1,
  active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.pricing_services enable row level security;

drop policy if exists "Public read active pricing services" on public.pricing_services;
create policy "Public read active pricing services"
  on public.pricing_services for select using (active = true);

drop policy if exists "Admin all pricing services" on public.pricing_services;
create policy "Admin all pricing services"
  on public.pricing_services for all using (auth.role() = 'authenticated');

-- ─── 3. pricing_features (wizard — replaces legacy calculator features) ───────
drop table if exists public.pricing_wizard_features cascade;

drop policy if exists "Public read published features" on public.pricing_features;
drop policy if exists "Admin all pricing features" on public.pricing_features;
drop table if exists public.pricing_features cascade;

create table public.pricing_features (
  id text primary key,
  name text not null,
  category_ids text[] not null default '{}',
  section_id text not null default 'features',
  section_title text not null default 'Features',
  price_dzd numeric not null default 0,
  price_eur numeric not null default 0,
  price_usd numeric not null default 0,
  complexity_score int not null default 1,
  active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.pricing_features enable row level security;

drop policy if exists "Public read active pricing features" on public.pricing_features;
create policy "Public read active pricing features"
  on public.pricing_features for select using (active = true);

drop policy if exists "Admin all pricing features" on public.pricing_features;
create policy "Admin all pricing features"
  on public.pricing_features for all using (auth.role() = 'authenticated');

-- ─── 4. pricing_timeline_options (wizard) ────────────────────────────────────
drop table if exists public.pricing_timeline_settings cascade;

drop policy if exists "Public read published timeline options" on public.pricing_timeline_options;
drop policy if exists "Admin all pricing timeline options" on public.pricing_timeline_options;
drop table if exists public.pricing_timeline_options cascade;

create table public.pricing_timeline_options (
  id text primary key,
  name text not null,
  description text not null default '',
  badge text not null default '',
  multiplier numeric not null default 1,
  active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.pricing_timeline_options enable row level security;

drop policy if exists "Public read active timeline options" on public.pricing_timeline_options;
create policy "Public read active timeline options"
  on public.pricing_timeline_options for select using (active = true);

drop policy if exists "Admin all timeline options" on public.pricing_timeline_options;
create policy "Admin all timeline options"
  on public.pricing_timeline_options for all using (auth.role() = 'authenticated');

-- ─── 5. pricing_complexity_options ───────────────────────────────────────────
drop table if exists public.pricing_complexity_settings cascade;

create table if not exists public.pricing_complexity_options (
  id text primary key,
  name text not null,
  price_multiplier numeric not null default 1,
  score_min int not null default 0,
  score_max int not null default 5,
  duration_flexible text not null default '',
  duration_standard text not null default '',
  duration_fast text not null default '',
  duration_urgent text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.pricing_complexity_options enable row level security;

drop policy if exists "Public read complexity options" on public.pricing_complexity_options;
create policy "Public read complexity options"
  on public.pricing_complexity_options for select using (true);

drop policy if exists "Admin all complexity options" on public.pricing_complexity_options;
create policy "Admin all complexity options"
  on public.pricing_complexity_options for all using (auth.role() = 'authenticated');

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists pricing_services_category_idx
  on public.pricing_services (category_id, sort_order);
create index if not exists pricing_features_active_idx
  on public.pricing_features (active, sort_order);

-- =============================================================================
-- SEED DATA
-- =============================================================================

insert into public.pricing_timeline_options (id, name, description, badge, multiplier, sort_order) values
  ('flexible', 'Flexible Timeline', 'No rush, best value for planned projects', '🌱 Flexible', 0.9, 0),
  ('standard', 'Standard Delivery', 'Balanced schedule for most projects', '📅 Standard', 1.0, 1),
  ('fast', 'Fast Delivery', 'Priority development', '⚡ Fast', 1.2, 2),
  ('urgent', 'Urgent Delivery', 'Maximum priority', '🚀 Urgent', 1.5, 3)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  badge = excluded.badge,
  multiplier = excluded.multiplier,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.pricing_complexity_options
  (id, name, price_multiplier, score_min, score_max, duration_flexible, duration_standard, duration_fast, duration_urgent, sort_order)
values
  ('simple', 'Simple', 1.0, 0, 5, '4 Weeks', '3 Weeks', '2 Weeks', '7 Days', 0),
  ('medium', 'Medium', 1.3, 6, 10, '6 Weeks', '4 Weeks', '3 Weeks', '10 Days', 1),
  ('complex', 'Advanced', 1.8, 11, 999, '8 Weeks', '6 Weeks', '4 Weeks', '14 Days', 2)
on conflict (id) do update set
  name = excluded.name,
  price_multiplier = excluded.price_multiplier,
  score_min = excluded.score_min,
  score_max = excluded.score_max,
  duration_flexible = excluded.duration_flexible,
  duration_standard = excluded.duration_standard,
  duration_fast = excluded.duration_fast,
  duration_urgent = excluded.duration_urgent,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.pricing_services
  (id, name, category_id, section_id, section_title, price_dzd, price_eur, price_usd, complexity_score, sort_order)
values
  ('pages-1-5', '1–5 Pages', 'website', 'pages', 'Pages', 40500, 255, 300, 1, 0),
  ('pages-5-10', '5–10 Pages', 'website', 'pages', 'Pages', 81000, 510, 600, 2, 1),
  ('pages-10-plus', '10+ Pages', 'website', 'pages', 'Pages', 135000, 850, 1000, 3, 2),
  ('platform-android', 'Android', 'mobile-application', 'platforms', 'Platforms', 108000, 680, 800, 2, 0),
  ('platform-ios', 'iOS', 'mobile-application', 'platforms', 'Platforms', 121500, 765, 900, 2, 1),
  ('platform-both', 'Both', 'mobile-application', 'platforms', 'Platforms', 202500, 1275, 1500, 3, 2)
on conflict (id) do update set
  name = excluded.name,
  price_dzd = excluded.price_dzd,
  price_eur = excluded.price_eur,
  price_usd = excluded.price_usd,
  complexity_score = excluded.complexity_score,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.pricing_features
  (id, name, category_ids, section_id, section_title, price_dzd, price_eur, price_usd, complexity_score, sort_order)
values
  ('contact-form', 'Contact Form', array['website'], 'features', 'Features', 6750, 43, 50, 1, 0),
  ('blog', 'Blog', array['website'], 'features', 'Features', 27000, 170, 200, 2, 1),
  ('cms-admin', 'CMS/Admin Panel', array['website','web-application','mobile-application','e-commerce','admin-dashboard','custom-software'], 'features', 'Features', 67500, 425, 500, 2, 2),
  ('user-accounts', 'User Accounts', array['website'], 'features', 'Features', 54000, 340, 400, 3, 3),
  ('multi-language', 'Multi-language', array['website','web-application'], 'features', 'Features', 33750, 213, 250, 2, 4),
  ('online-booking', 'Online Booking', array['website'], 'features', 'Features', 47250, 298, 350, 3, 5),
  ('payment-integration', 'Payment Integration', array['website'], 'features', 'Features', 67500, 425, 500, 4, 6),
  ('seo-setup', 'SEO Setup', array['website'], 'features', 'Features', 27000, 170, 200, 1, 7),
  ('file-uploads', 'File Uploads', array['website','web-application','mobile-application'], 'features', 'Features', 40500, 255, 300, 1, 8),
  ('analytics', 'Analytics', array['website','web-application','mobile-application'], 'features', 'Features', 20250, 128, 150, 1, 9),
  ('authentication', 'Authentication', array['web-application','mobile-application','admin-dashboard','custom-software'], 'features', 'Features', 54000, 340, 400, 3, 10),
  ('roles-permissions', 'Roles & Permissions', array['web-application'], 'features', 'Features', 47250, 298, 350, 2, 11),
  ('admin-dashboard', 'Admin Dashboard', array['web-application','mobile-application','e-commerce'], 'features', 'Features', 67500, 425, 500, 4, 12),
  ('payments', 'Payments', array['web-application','mobile-application'], 'features', 'Features', 67500, 425, 500, 4, 13),
  ('messaging-chat', 'Messaging / Chat', array['web-application'], 'features', 'Features', 54000, 340, 400, 2, 14),
  ('notifications', 'Notifications', array['web-application'], 'features', 'Features', 33750, 213, 250, 1, 15),
  ('api-integrations', 'API Integrations', array['web-application'], 'features', 'Features', 47250, 298, 350, 4, 16),
  ('reports', 'Reports', array['web-application'], 'features', 'Features', 40500, 255, 300, 2, 17),
  ('ai-features', 'AI Features', array['web-application','mobile-application'], 'features', 'Features', 108000, 680, 800, 4, 18),
  ('push-notifications', 'Push Notifications', array['mobile-application'], 'features', 'Features', 33750, 213, 250, 1, 19),
  ('chat', 'Chat', array['mobile-application'], 'features', 'Features', 54000, 340, 400, 2, 20),
  ('maps-location', 'Maps & Location', array['mobile-application'], 'features', 'Features', 47250, 298, 350, 2, 21),
  ('camera-access', 'Camera Access', array['mobile-application'], 'features', 'Features', 27000, 170, 200, 1, 22),
  ('offline-mode', 'Offline Mode', array['mobile-application'], 'features', 'Features', 60750, 383, 450, 3, 23),
  ('product-catalog', 'Product Catalog', array['e-commerce'], 'features', 'Features', 54000, 340, 400, 2, 24),
  ('shopping-cart', 'Shopping Cart', array['e-commerce'], 'features', 'Features', 40500, 255, 300, 2, 25),
  ('checkout', 'Checkout', array['e-commerce'], 'features', 'Features', 60750, 383, 450, 3, 26),
  ('payment-gateway', 'Payment Gateway', array['e-commerce'], 'features', 'Features', 67500, 425, 500, 4, 27),
  ('inventory-management', 'Inventory Management', array['e-commerce'], 'features', 'Features', 54000, 340, 400, 3, 28),
  ('coupons-discounts', 'Coupons & Discounts', array['e-commerce'], 'features', 'Features', 27000, 170, 200, 1, 29),
  ('multi-vendor', 'Multi-vendor Marketplace', array['e-commerce'], 'features', 'Features', 108000, 680, 800, 4, 30),
  ('customer-accounts', 'Customer Accounts', array['e-commerce'], 'features', 'Features', 47250, 298, 350, 3, 31),
  ('order-tracking', 'Order Tracking', array['e-commerce'], 'features', 'Features', 33750, 213, 250, 2, 32),
  ('wireframes', 'Wireframes', array['ui-ux-design'], 'deliverables', 'Deliverables', 40500, 255, 300, 1, 33),
  ('ui-design', 'UI Design', array['ui-ux-design'], 'deliverables', 'Deliverables', 81000, 510, 600, 2, 34),
  ('prototype', 'Interactive Prototype', array['ui-ux-design'], 'deliverables', 'Deliverables', 67500, 425, 500, 2, 35),
  ('design-system', 'Design System', array['ui-ux-design'], 'deliverables', 'Deliverables', 94500, 595, 700, 3, 36),
  ('user-flows', 'User Flows', array['ui-ux-design'], 'deliverables', 'Deliverables', 33750, 213, 250, 1, 37),
  ('responsive-screens', 'Mobile & Desktop Screens', array['ui-ux-design'], 'deliverables', 'Deliverables', 54000, 340, 400, 2, 38)
on conflict (id) do update set
  name = excluded.name,
  category_ids = excluded.category_ids,
  section_id = excluded.section_id,
  section_title = excluded.section_title,
  price_dzd = excluded.price_dzd,
  price_eur = excluded.price_eur,
  price_usd = excluded.price_usd,
  complexity_score = excluded.complexity_score,
  sort_order = excluded.sort_order,
  updated_at = now();

notify pgrst, 'reload schema';
