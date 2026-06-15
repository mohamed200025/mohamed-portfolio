-- Detailed visit analytics (replaces page_analytics for new tracking)

create table if not exists analytics_visits (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  page_path text not null default '/',
  visitor_id text not null,
  country text,
  city text,
  device_type text not null default 'Desktop',
  browser text,
  referrer text,
  user_agent text,
  timezone text
);

create index if not exists analytics_visits_created_at_idx on analytics_visits (created_at desc);
create index if not exists analytics_visits_visitor_id_idx on analytics_visits (visitor_id);
create index if not exists analytics_visits_page_path_idx on analytics_visits (page_path);

alter table analytics_visits enable row level security;

create policy "Public insert analytics visits"
  on analytics_visits for insert with check (true);

create policy "Admin read analytics visits"
  on analytics_visits for select using (auth.role() = 'authenticated');
