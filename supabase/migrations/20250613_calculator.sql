-- Calculator pricing settings + quote leads

create table if not exists calculator_settings (
  id int primary key default 1 check (id = 1),
  badge text not null default 'PROJECT CALCULATOR',
  title_prefix text not null default 'Calculate Your',
  title_highlight text not null default 'Project Cost',
  subtitle text not null default 'Get an instant estimate for your project. Customize your requirements and receive a price range in real-time.',
  project_types jsonb not null default '[]',
  features jsonb not null default '[]',
  timelines jsonb not null default '[]',
  trust_items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

create table if not exists quote_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  whatsapp text,
  project_description text,
  project_type_id text not null,
  project_type_label text not null,
  selected_features jsonb not null default '[]',
  timeline_id text not null,
  timeline_label text not null,
  estimate_min numeric not null,
  estimate_max numeric not null,
  complexity text not null,
  time_estimate text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table calculator_settings enable row level security;
alter table quote_leads enable row level security;

create policy "Public read calculator settings" on calculator_settings for select using (true);
create policy "Admin all calculator settings" on calculator_settings for all using (auth.role() = 'authenticated');

create policy "Public insert quote leads" on quote_leads for insert with check (true);
create policy "Admin read quote leads" on quote_leads for select using (auth.role() = 'authenticated');
create policy "Admin update quote leads" on quote_leads for update using (auth.role() = 'authenticated');
create policy "Admin delete quote leads" on quote_leads for delete using (auth.role() = 'authenticated');

insert into calculator_settings (
  id, badge, title_prefix, title_highlight, subtitle,
  project_types, features, timelines, trust_items
) values (
  1,
  'PROJECT CALCULATOR',
  'Calculate Your',
  'Project Cost',
  'Get an instant estimate for your project. Customize your requirements and receive a price range in real-time.',
  '[
    {"id":"landing_page","label":"Landing Page","description":"Single page website","price_min":300,"price_max":600,"weeks_min":1,"weeks_max":2,"complexity":"low"},
    {"id":"business_website","label":"Business Website","description":"Multi-page website","price_min":600,"price_max":1200,"weeks_min":3,"weeks_max":5,"complexity":"medium"},
    {"id":"ecommerce","label":"E-commerce","description":"Online store","price_min":1200,"price_max":2500,"weeks_min":4,"weeks_max":8,"complexity":"high"},
    {"id":"lms_platform","label":"LMS Platform","description":"Learning platform","price_min":1500,"price_max":3000,"weeks_min":6,"weeks_max":10,"complexity":"high"},
    {"id":"saas_platform","label":"SaaS Platform","description":"Software as a service","price_min":2000,"price_max":5000,"weeks_min":8,"weeks_max":14,"complexity":"high"},
    {"id":"mobile_app","label":"Mobile App","description":"iOS / Android app","price_min":2500,"price_max":6000,"weeks_min":8,"weeks_max":16,"complexity":"high"},
    {"id":"custom_dashboard","label":"Custom Dashboard","description":"Admin & analytics","price_min":800,"price_max":2000,"weeks_min":3,"weeks_max":6,"complexity":"medium"},
    {"id":"other","label":"Other / Custom","description":"Unique requirements","price_min":500,"price_max":8000,"weeks_min":4,"weeks_max":12,"complexity":"medium"}
  ]'::jsonb,
  '[
    {"id":"authentication","label":"Authentication","price_min":150,"price_max":300},
    {"id":"admin_dashboard","label":"Admin Dashboard","price_min":200,"price_max":400},
    {"id":"cms","label":"CMS","price_min":150,"price_max":350},
    {"id":"payment_system","label":"Payment System","price_min":200,"price_max":500},
    {"id":"multi_language","label":"Multi-language","price_min":100,"price_max":250},
    {"id":"api_integration","label":"API Integration","price_min":150,"price_max":400},
    {"id":"ai_features","label":"AI Features","price_min":300,"price_max":1000},
    {"id":"push_notifications","label":"Push Notifications","price_min":100,"price_max":200},
    {"id":"seo_optimization","label":"SEO Optimization","price_min":100,"price_max":200}
  ]'::jsonb,
  '[
    {"id":"urgent","label":"Urgent","description":"1-2 weeks","multiplier":1.3,"weeks_label":"1-2 weeks"},
    {"id":"standard","label":"Standard","description":"3-6 weeks","multiplier":1.0,"weeks_label":"3-6 weeks"},
    {"id":"flexible","label":"Flexible","description":"6-12+ weeks","multiplier":0.9,"weeks_label":"6-12+ weeks"}
  ]'::jsonb,
  '[
    {"title":"Transparent Pricing","description":"No hidden costs"},
    {"title":"Quality Guaranteed","description":"High-quality code"},
    {"title":"On-Time Delivery","description":"Respecting deadlines"},
    {"title":"Support Included","description":"30 days of free support"}
  ]'::jsonb
) on conflict (id) do nothing;
