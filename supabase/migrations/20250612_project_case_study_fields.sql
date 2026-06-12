-- Case study fields for /projects/[slug] pages

alter table projects add column if not exists project_overview text;
alter table projects add column if not exists problem_statement text;
alter table projects add column if not exists solution text;
alter table projects add column if not exists business_impact text;
alter table projects add column if not exists project_year text;
alter table projects add column if not exists project_duration text;
alter table projects add column if not exists client_name text;
alter table projects add column if not exists industry text;
alter table projects add column if not exists live_demo_url text;
alter table projects add column if not exists project_details_url text;
alter table projects add column if not exists gallery_images text[] default '{}';
alter table projects add column if not exists statistics jsonb not null default '[]';
alter table projects add column if not exists results jsonb not null default '[]';
alter table projects add column if not exists challenges text[] default '{}';
alter table projects add column if not exists solutions text[] default '{}';

-- Copy legacy details_url into project_details_url when empty
update projects
set project_details_url = details_url
where coalesce(project_details_url, '') = ''
  and details_url is not null
  and details_url not in ('', '#');
