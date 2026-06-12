-- Contact settings singleton for /admin/contact

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

alter table contact_settings enable row level security;

create policy "Public read contact settings" on contact_settings for select using (true);
create policy "Admin all contact settings" on contact_settings for all using (auth.role() = 'authenticated');

insert into contact_settings (
  id,
  whatsapp,
  email,
  linkedin_url,
  linkedin_username,
  github_url,
  github_username,
  contact_title,
  contact_subtitle,
  calendly_url
) values (
  1,
  '+213 XXX XXX XXX',
  'contact@mohamedournani.com',
  'https://linkedin.com',
  'mohamed-ournani',
  'https://github.com',
  'mohamedournani',
  'Let''s Work Together',
  'Have a project in mind or want to discuss an idea? I''m always open to new opportunities and exciting collaborations.',
  ''
) on conflict (id) do nothing;
