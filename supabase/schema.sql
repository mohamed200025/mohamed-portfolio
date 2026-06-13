-- Portfolio CMS schema for Supabase
-- Run in SQL Editor after creating your project

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Hero ───────────────────────────────────────────────────────────────────
create table if not exists hero_settings (
  id int primary key default 1 check (id = 1),
  status_badge text not null default 'Available for new projects',
  headline_prefix text not null default 'Full Stack &',
  headline_highlight text not null default 'Flutter Developer',
  subheadline_prefix text not null default 'Building',
  subheadline_highlight text not null default 'Educational Platforms, CMS & Mobile Apps',
  description text not null,
  primary_cta_text text not null default 'View My Projects',
  primary_cta_href text not null default '#projects',
  secondary_cta_text text not null default 'Contact Me',
  secondary_cta_href text not null default '#contact',
  tech_stack jsonb not null default '[]',
  profile_name text not null default 'Mohamed Ournani',
  profile_title text not null default 'Full Stack & Flutter Developer',
  featured_project_id uuid references projects(id) on delete set null,
  download_app_enabled boolean not null default false,
  download_app_id uuid,
  updated_at timestamptz not null default now()
);

-- ─── Projects ───────────────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  category text not null,
  description text not null,
  features jsonb not null default '[]',
  technologies jsonb not null default '[]',
  primary_button_label text not null default 'View Project',
  primary_button_href text not null default '#',
  primary_button_external boolean not null default false,
  secondary_button_label text not null default 'Case Study',
  secondary_button_href text not null default '#',
  website_url text,
  details_url text,
  project_details_url text,
  live_demo_url text,
  project_overview text,
  problem_statement text,
  solution text,
  business_impact text,
  project_year text,
  project_duration text,
  client_name text,
  industry text,
  gallery_images text[] default '{}',
  statistics jsonb not null default '[]',
  results jsonb not null default '[]',
  challenges text[] default '{}',
  solutions text[] default '{}',
  featured boolean not null default false,
  accent text not null default 'cyan' check (accent in ('cyan', 'blue')),
  showcase_type text not null default 'custom' check (showcase_type in ('eduvera', 'muhlentechnik', 'custom')),
  icon_name text not null default 'BookOpen',
  sort_order int not null default 0,
  published boolean not null default true,
  app_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text,
  sort_order int not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Apps (App Store) ───────────────────────────────────────────────────────
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

alter table hero_settings
  add constraint hero_settings_download_app_id_fkey
  foreign key (download_app_id) references apps(id) on delete set null;

alter table projects
  add constraint projects_app_id_fkey
  foreign key (app_id) references apps(id) on delete set null;

-- ─── About ──────────────────────────────────────────────────────────────────
create table if not exists about_settings (
  id int primary key default 1 check (id = 1),
  profile_photo_url text,
  profile_photo_storage_path text,
  name text not null default 'Mohamed Ournani',
  job_title text not null default 'Full Stack & Flutter Developer',
  short_bio text,
  status_badge text not null default 'Available for new projects',
  section_badge text not null default 'ABOUT ME',
  title_prefix text not null default 'Building Digital Products That',
  title_highlight text not null default 'Solve Real Problems',
  who_i_am_title text not null default 'Who I Am',
  who_i_am_paragraphs jsonb not null default '[]',
  stat_projects_value int not null default 10,
  stat_projects_suffix text not null default '+',
  stat_projects_tag text not null default 'Delivered with quality',
  stat_technologies_value int not null default 6,
  stat_technologies_suffix text not null default '+',
  stat_technologies_tag text not null default 'Modern stack mastery',
  stat_platforms_value int not null default 4,
  stat_platforms_suffix text not null default '+',
  stat_platforms_tag text not null default 'End-to-end solutions',
  stat_countries_value int not null default 3,
  stat_countries_suffix text not null default '+',
  stat_countries_tag text not null default 'International clients',
  updated_at timestamptz not null default now()
);

create table if not exists journey_entries (
  id uuid primary key default uuid_generate_v4(),
  year text not null,
  title text not null,
  description text not null,
  icon_name text not null default 'Building2',
  node_color text not null default 'bg-blue-500 shadow-blue-500/50',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Section content (about, services, technologies, contact, projects header) ─
create table if not exists section_content (
  section_key text primary key,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ─── Testimonials ───────────────────────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  company text,
  content text not null,
  avatar_url text,
  rating int check (rating between 1 and 5),
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Contact ────────────────────────────────────────────────────────────────
create table if not exists contact_methods (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  label text not null,
  value text not null,
  subtext text,
  href text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists contact_settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '',
  email text not null default '',
  linkedin_url text not null default '',
  linkedin_username text not null default '',
  github_url text not null default '',
  github_username text not null default '',
  contact_title text not null default 'Let''s Work Together',
  contact_subtitle text not null default '',
  calendly_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists pricing_settings (
  id int primary key default 1 check (id = 1),
  badge text not null default 'PROJECT CALCULATOR',
  title_prefix text not null default 'Calculate Your',
  title_highlight text not null default 'Project Cost',
  subtitle text not null default '',
  default_currency text not null default 'EUR',
  updated_at timestamptz not null default now()
);

create table if not exists pricing_currencies (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  symbol text not null,
  exchange_rate numeric not null default 1,
  enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

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

create table if not exists pricing_timeline_options (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  percentage_modifier numeric not null default 0,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

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

-- ─── CV ─────────────────────────────────────────────────────────────────────
create table if not exists cv_files (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null,
  public_url text not null,
  file_size bigint,
  is_active boolean not null default false,
  uploaded_at timestamptz not null default now()
);

-- ─── SEO ────────────────────────────────────────────────────────────────────
create table if not exists seo_settings (
  id int primary key default 1 check (id = 1),
  site_title text not null default 'Mohamed Ournani | Full Stack & Flutter Developer',
  site_description text not null,
  keywords jsonb not null default '[]',
  og_image_url text,
  twitter_handle text,
  canonical_url text,
  updated_at timestamptz not null default now()
);

-- ─── Analytics ──────────────────────────────────────────────────────────────
create table if not exists page_analytics (
  id uuid primary key default uuid_generate_v4(),
  path text not null default '/',
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz not null default now()
);

-- ─── Storage buckets ────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('cv-files', 'cv-files', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('app-assets', 'app-assets', true) on conflict do nothing;

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table hero_settings enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table section_content enable row level security;
alter table testimonials enable row level security;
alter table contact_methods enable row level security;
alter table contact_messages enable row level security;
alter table contact_settings enable row level security;
alter table pricing_settings enable row level security;
alter table pricing_currencies enable row level security;
alter table pricing_project_types enable row level security;
alter table pricing_features enable row level security;
alter table pricing_timeline_options enable row level security;
alter table pricing_leads enable row level security;
alter table cv_files enable row level security;
alter table seo_settings enable row level security;
alter table page_analytics enable row level security;
alter table about_settings enable row level security;
alter table journey_entries enable row level security;
alter table apps enable row level security;
alter table app_screenshots enable row level security;

-- Public read for published content
create policy "Public read hero" on hero_settings for select using (true);
create policy "Public read published projects" on projects for select using (published = true);
create policy "Public read project images" on project_images for select using (true);
create policy "Public read sections" on section_content for select using (true);
create policy "Public read published testimonials" on testimonials for select using (published = true);
create policy "Public read contact methods" on contact_methods for select using (published = true);
create policy "Public read contact settings" on contact_settings for select using (true);
create policy "Public read pricing settings" on pricing_settings for select using (true);
create policy "Public read enabled currencies" on pricing_currencies for select using (enabled = true);
create policy "Public read published project types" on pricing_project_types for select using (published = true);
create policy "Public read published features" on pricing_features for select using (published = true);
create policy "Public read published timeline options" on pricing_timeline_options for select using (published = true);
create policy "Public read active cv" on cv_files for select using (is_active = true);
create policy "Public read seo" on seo_settings for select using (true);
create policy "Public read about" on about_settings for select using (true);
create policy "Public read published journey" on journey_entries for select using (published = true);
create policy "Public read published apps" on apps for select using (published = true);
create policy "Public read app screenshots" on app_screenshots for select using (true);

-- Anyone can submit contact + analytics
create policy "Public insert contact messages" on contact_messages for insert with check (true);
create policy "Public insert pricing leads" on pricing_leads for insert with check (true);
create policy "Public insert analytics" on page_analytics for insert with check (true);

-- Authenticated admin full access
create policy "Admin all hero" on hero_settings for all using (auth.role() = 'authenticated');
create policy "Admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "Admin all project images" on project_images for all using (auth.role() = 'authenticated');
create policy "Admin all sections" on section_content for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin all contact methods" on contact_methods for all using (auth.role() = 'authenticated');
create policy "Admin all contact settings" on contact_settings for all using (auth.role() = 'authenticated');
create policy "Admin all pricing settings" on pricing_settings for all using (auth.role() = 'authenticated');
create policy "Admin all pricing currencies" on pricing_currencies for all using (auth.role() = 'authenticated');
create policy "Admin all pricing project types" on pricing_project_types for all using (auth.role() = 'authenticated');
create policy "Admin all pricing features" on pricing_features for all using (auth.role() = 'authenticated');
create policy "Admin all pricing timeline options" on pricing_timeline_options for all using (auth.role() = 'authenticated');
create policy "Admin read pricing leads" on pricing_leads for select using (auth.role() = 'authenticated');
create policy "Admin update pricing leads" on pricing_leads for update using (auth.role() = 'authenticated');
create policy "Admin delete pricing leads" on pricing_leads for delete using (auth.role() = 'authenticated');
create policy "Admin read messages" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Admin update messages" on contact_messages for update using (auth.role() = 'authenticated');
create policy "Admin delete messages" on contact_messages for delete using (auth.role() = 'authenticated');
create policy "Admin all cv" on cv_files for all using (auth.role() = 'authenticated');
create policy "Admin all seo" on seo_settings for all using (auth.role() = 'authenticated');
create policy "Admin read analytics" on page_analytics for select using (auth.role() = 'authenticated');
create policy "Admin all about" on about_settings for all using (auth.role() = 'authenticated');
create policy "Admin all journey" on journey_entries for all using (auth.role() = 'authenticated');
create policy "Admin all apps" on apps for all using (auth.role() = 'authenticated');
create policy "Admin all app screenshots" on app_screenshots for all using (auth.role() = 'authenticated');

-- Storage policies
create policy "Public read project images storage" on storage.objects for select using (bucket_id = 'project-images');
create policy "Public read cv storage" on storage.objects for select using (bucket_id = 'cv-files');
create policy "Admin upload project images" on storage.objects for insert with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
create policy "Admin upload cv" on storage.objects for insert with check (bucket_id = 'cv-files' and auth.role() = 'authenticated');
create policy "Admin delete storage" on storage.objects for delete using (auth.role() = 'authenticated');
create policy "Public read profile photos storage" on storage.objects for select using (bucket_id = 'profile-photos');
create policy "Admin upload profile photos" on storage.objects for insert with check (bucket_id = 'profile-photos' and auth.role() = 'authenticated');
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

-- ─── Seed default content ───────────────────────────────────────────────────
insert into hero_settings (description) values (
  'I help businesses, schools and training centers build modern websites, custom CMS solutions, admin dashboards and mobile applications.'
) on conflict (id) do nothing;

insert into seo_settings (site_description) values (
  'Full Stack & Flutter Developer building educational platforms, CMS solutions, admin dashboards and mobile applications.'
) on conflict (id) do nothing;

insert into about_settings (
  short_bio, who_i_am_paragraphs
) values (
  'From educational platforms and mobile applications to custom CMS systems and business websites, I focus on creating modern, scalable and user-centered digital experiences.',
  '["I''m a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.","With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions."]'::jsonb
) on conflict (id) do nothing;

insert into pricing_settings (id, default_currency) values (1, 'EUR') on conflict (id) do nothing;

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
