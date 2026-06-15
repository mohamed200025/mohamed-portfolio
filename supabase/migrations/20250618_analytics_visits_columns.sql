-- Add columns expected by the analytics app (safe if table was created manually)

alter table analytics_visits add column if not exists device_type text not null default 'Desktop';
alter table analytics_visits add column if not exists browser text;
alter table analytics_visits add column if not exists timezone text;

-- Ensure anonymous inserts are allowed (insert-only; no public read)
drop policy if exists "Public insert analytics visits" on analytics_visits;
create policy "Public insert analytics visits"
  on analytics_visits for insert to anon, authenticated
  with check (true);

grant insert on analytics_visits to anon, authenticated;
