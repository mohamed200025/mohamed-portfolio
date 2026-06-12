-- Seed portfolio CMS with default content (run after schema.sql)

insert into hero_settings (
  id, description, tech_stack
) values (
  1,
  'I help businesses, schools and training centers build modern websites, custom CMS solutions, admin dashboards and mobile applications.',
  '[{"name":"Flutter"},{"name":"Firebase"},{"name":"React"},{"name":"Next.js"},{"name":"Node.js"}]'::jsonb
) on conflict (id) do update set description = excluded.description;

insert into projects (slug, title, category, description, features, technologies, featured, accent, showcase_type, icon_name, sort_order) values
('eduvera', 'Eduvera', 'Educational Platform',
 'A complete educational ecosystem built with Flutter and Firebase featuring course management, authentication, student engagement tools, admin dashboards and mobile learning experiences.',
 '["Flutter Mobile Application","Firebase Backend","Authentication System","Community Platform","Course Management","Admin Dashboard"]'::jsonb,
 '["Flutter","Firebase","Node.js"]'::jsonb, true, 'cyan', 'eduvera', 'BookOpen', 0),
('muhlentechnik', 'Muhlentechnik', 'Corporate Website & CMS',
 'Professional multilingual corporate website designed for industrial and agricultural international business operations.',
 '["Responsive Design","CMS Integration","SEO Optimized","Professional UI","Multi-section Architecture"]'::jsonb,
 '["Next.js","CMS","Responsive"]'::jsonb, false, 'blue', 'muhlentechnik', 'Factory', 1)
on conflict (slug) do nothing;

insert into section_content (section_key, content) values
('about', '{}'::jsonb),
('projects_header', '{}'::jsonb),
('services', '{}'::jsonb),
('technologies', '{}'::jsonb),
('contact', '{}'::jsonb),
('footer', '{}'::jsonb)
on conflict (section_key) do nothing;

insert into contact_methods (type, label, value, subtext, href, sort_order) values
('whatsapp', 'WhatsApp', '+213 XXX XXX XXX', 'Available 24/7', 'https://wa.me/', 0),
('email', 'Email', 'contact@mohamedournani.com', 'I reply within 24h', 'mailto:contact@mohamedournani.com', 1),
('linkedin', 'LinkedIn', 'mohamed-ournani', 'Let''s connect', 'https://linkedin.com', 2),
('github', 'GitHub', 'mohamedournani', 'View my code', 'https://github.com', 3);

-- About & Journey (see also supabase/seed-about.sql)
insert into about_settings (
  id, name, job_title, short_bio, who_i_am_title, who_i_am_paragraphs,
  stat_projects_value, stat_technologies_value, stat_platforms_value, stat_countries_value
) values (
  1, 'Mohamed Ournani', 'Full Stack & Flutter Developer',
  'From educational platforms and mobile applications to custom CMS systems and business websites, I focus on creating modern, scalable and user-centered digital experiences.',
  'Who I Am',
  '["I''m a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.","With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions."]'::jsonb,
  10, 6, 4, 3
) on conflict (id) do nothing;

insert into journey_entries (year, title, description, icon_name, node_color, sort_order) values
('2023', 'Bioanalytical Analyst', 'Worked in the pharmaceutical and bioequivalence sector developing analytical, laboratory and problem-solving expertise.', 'Building2', 'bg-blue-500 shadow-blue-500/50', 0),
('2024', 'Eduvera Development', 'Designed and developed Eduvera, an educational platform featuring mobile applications, admin dashboards and community tools.', 'GraduationCap', 'bg-violet-500 shadow-violet-500/50', 1),
('2025', 'Full Stack Development', 'Expanded into full stack web development, CMS solutions and scalable business platforms.', 'Code2', 'bg-cyan-500 shadow-cyan-500/50', 2),
('2026', 'Freelance & Digital Solutions', 'Helping schools, training centers and businesses build powerful digital products.', 'User', 'bg-emerald-500 shadow-emerald-500/50', 3);
