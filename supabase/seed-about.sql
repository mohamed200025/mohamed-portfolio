-- Seed About section & Journey (run after schema.sql / about migration)

insert into about_settings (
  id, name, job_title, short_bio, status_badge, section_badge,
  title_prefix, title_highlight, who_i_am_title, who_i_am_paragraphs,
  stat_projects_value, stat_projects_suffix, stat_projects_tag,
  stat_technologies_value, stat_technologies_suffix, stat_technologies_tag,
  stat_platforms_value, stat_platforms_suffix, stat_platforms_tag,
  stat_countries_value, stat_countries_suffix, stat_countries_tag
) values (
  1,
  'Mohamed Ournani',
  'Full Stack & Flutter Developer',
  'From educational platforms and mobile applications to custom CMS systems and business websites, I focus on creating modern, scalable and user-centered digital experiences.',
  'Available for new projects',
  'ABOUT ME',
  'Building Digital Products That',
  'Solve Real Problems',
  'Who I Am',
  '["I''m a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.","With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions."]'::jsonb,
  10, '+', 'Delivered with quality',
  6, '+', 'Modern stack mastery',
  4, '+', 'End-to-end solutions',
  3, '+', 'International clients'
) on conflict (id) do update set
  short_bio = excluded.short_bio,
  who_i_am_paragraphs = excluded.who_i_am_paragraphs;

insert into journey_entries (year, title, description, icon_name, node_color, sort_order) values
('2023', 'Bioanalytical Analyst',
 'Worked in the pharmaceutical and bioequivalence sector developing analytical, laboratory and problem-solving expertise.',
 'Building2', 'bg-blue-500 shadow-blue-500/50', 0),
('2024', 'Eduvera Development',
 'Designed and developed Eduvera, an educational platform featuring mobile applications, admin dashboards and community tools.',
 'GraduationCap', 'bg-violet-500 shadow-violet-500/50', 1),
('2025', 'Full Stack Development',
 'Expanded into full stack web development, CMS solutions and scalable business platforms.',
 'Code2', 'bg-cyan-500 shadow-cyan-500/50', 2),
('2026', 'Freelance & Digital Solutions',
 'Helping schools, training centers and businesses build powerful digital products.',
 'User', 'bg-emerald-500 shadow-emerald-500/50', 3);
