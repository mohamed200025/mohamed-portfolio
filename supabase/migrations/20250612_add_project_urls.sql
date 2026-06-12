-- Add CMS-managed project link URLs (run in Supabase SQL Editor on existing projects)

alter table projects add column if not exists website_url text;
alter table projects add column if not exists details_url text;

-- Migrate legacy button hrefs when new columns are empty
update projects
set website_url = primary_button_href
where coalesce(website_url, '') = ''
  and primary_button_href is not null
  and primary_button_href not in ('', '#');

update projects
set details_url = secondary_button_href
where coalesce(details_url, '') = ''
  and secondary_button_href is not null
  and secondary_button_href not in ('', '#');
