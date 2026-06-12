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
