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

-- ─── RLS ────────────────────────────────────────────────────────────────────
alter table hero_settings enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table section_content enable row level security;
alter table testimonials enable row level security;
alter table contact_methods enable row level security;
alter table contact_messages enable row level security;
alter table cv_files enable row level security;
alter table seo_settings enable row level security;
alter table page_analytics enable row level security;
alter table about_settings enable row level security;
alter table journey_entries enable row level security;

-- Public read for published content
create policy "Public read hero" on hero_settings for select using (true);
create policy "Public read published projects" on projects for select using (published = true);
create policy "Public read project images" on project_images for select using (true);
create policy "Public read sections" on section_content for select using (true);
create policy "Public read published testimonials" on testimonials for select using (published = true);
create policy "Public read contact methods" on contact_methods for select using (published = true);
create policy "Public read active cv" on cv_files for select using (is_active = true);
create policy "Public read seo" on seo_settings for select using (true);
create policy "Public read about" on about_settings for select using (true);
create policy "Public read published journey" on journey_entries for select using (published = true);

-- Anyone can submit contact + analytics
create policy "Public insert contact messages" on contact_messages for insert with check (true);
create policy "Public insert analytics" on page_analytics for insert with check (true);

-- Authenticated admin full access
create policy "Admin all hero" on hero_settings for all using (auth.role() = 'authenticated');
create policy "Admin all projects" on projects for all using (auth.role() = 'authenticated');
create policy "Admin all project images" on project_images for all using (auth.role() = 'authenticated');
create policy "Admin all sections" on section_content for all using (auth.role() = 'authenticated');
create policy "Admin all testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin all contact methods" on contact_methods for all using (auth.role() = 'authenticated');
create policy "Admin read messages" on contact_messages for select using (auth.role() = 'authenticated');
create policy "Admin update messages" on contact_messages for update using (auth.role() = 'authenticated');
create policy "Admin delete messages" on contact_messages for delete using (auth.role() = 'authenticated');
create policy "Admin all cv" on cv_files for all using (auth.role() = 'authenticated');
create policy "Admin all seo" on seo_settings for all using (auth.role() = 'authenticated');
create policy "Admin read analytics" on page_analytics for select using (auth.role() = 'authenticated');
create policy "Admin all about" on about_settings for all using (auth.role() = 'authenticated');
create policy "Admin all journey" on journey_entries for all using (auth.role() = 'authenticated');

-- Storage policies
create policy "Public read project images storage" on storage.objects for select using (bucket_id = 'project-images');
create policy "Public read cv storage" on storage.objects for select using (bucket_id = 'cv-files');
create policy "Admin upload project images" on storage.objects for insert with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
create policy "Admin upload cv" on storage.objects for insert with check (bucket_id = 'cv-files' and auth.role() = 'authenticated');
create policy "Admin delete storage" on storage.objects for delete using (auth.role() = 'authenticated');
create policy "Public read profile photos storage" on storage.objects for select using (bucket_id = 'profile-photos');
create policy "Admin upload profile photos" on storage.objects for insert with check (bucket_id = 'profile-photos' and auth.role() = 'authenticated');

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
