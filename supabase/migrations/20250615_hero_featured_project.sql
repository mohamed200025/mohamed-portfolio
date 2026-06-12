-- Add CMS-controlled featured project to hero_settings

alter table hero_settings
  add column if not exists featured_project_id uuid references projects(id) on delete set null;

-- Seed with first published project (by sort_order)
update hero_settings
set featured_project_id = (
  select id from projects where published = true order by sort_order asc, created_at asc limit 1
)
where id = 1
  and featured_project_id is null;
