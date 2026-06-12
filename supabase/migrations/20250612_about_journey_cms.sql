-- About section & journey timeline CMS

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

insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true) on conflict do nothing;

alter table about_settings enable row level security;
alter table journey_entries enable row level security;

create policy "Public read about" on about_settings for select using (true);
create policy "Public read published journey" on journey_entries for select using (published = true);
create policy "Admin all about" on about_settings for all using (auth.role() = 'authenticated');
create policy "Admin all journey" on journey_entries for all using (auth.role() = 'authenticated');

create policy "Public read profile photos storage" on storage.objects for select using (bucket_id = 'profile-photos');
create policy "Admin upload profile photos" on storage.objects for insert with check (bucket_id = 'profile-photos' and auth.role() = 'authenticated');
