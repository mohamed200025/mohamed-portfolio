import type { AboutSettings, HeroSettings, JourneyEntry, PortfolioData, SeoSettings } from "@/types/cms";
import { aboutSettingsToStatistics } from "@/lib/cms/about-utils";
import { projects as staticProjects, projectStats } from "@/lib/projects-data";
import { journey, services as aboutServices } from "@/lib/about-data";
import { services as serviceCards, benefits } from "@/lib/services-data";
import {
  techCategories,
  tools,
  contactMethods as staticContactMethods,
  footerLinks,
} from "@/lib/technologies-data";

export const defaultHero: HeroSettings = {
  status_badge: "Available for new projects",
  headline_prefix: "Full Stack &",
  headline_highlight: "Flutter Developer",
  subheadline_prefix: "Building",
  subheadline_highlight: "Educational Platforms, CMS & Mobile Apps",
  description:
    "I help businesses, schools and training centers build modern websites, custom CMS solutions, admin dashboards and mobile applications.",
  primary_cta_text: "View My Projects",
  primary_cta_href: "#projects",
  secondary_cta_text: "Contact Me",
  secondary_cta_href: "#contact",
  tech_stack: [
    { name: "Flutter" },
    { name: "Firebase" },
    { name: "React" },
    { name: "Next.js" },
    { name: "Node.js" },
  ],
  profile_name: "Mohamed Ournani",
  profile_title: "Full Stack & Flutter Developer",
};

export const defaultSeo: SeoSettings = {
  site_title: "Mohamed Ournani | Full Stack & Flutter Developer",
  site_description:
    "Full Stack & Flutter Developer building educational platforms, CMS solutions, admin dashboards and mobile applications.",
  keywords: [
    "Flutter developer",
    "Full stack developer",
    "CMS",
    "Educational platforms",
  ],
  og_image_url: null,
  twitter_handle: null,
  canonical_url: null,
};

export const defaultAbout: AboutSettings = {
  profile_photo_url: null,
  profile_photo_storage_path: null,
  name: defaultHero.profile_name,
  job_title: defaultHero.profile_title,
  short_bio:
    "From educational platforms and mobile applications to custom CMS systems and business websites, I focus on creating modern, scalable and user-centered digital experiences.",
  status_badge: defaultHero.status_badge,
  section_badge: "ABOUT ME",
  title_prefix: "Building Digital Products That",
  title_highlight: "Solve Real Problems",
  who_i_am_title: "Who I Am",
  who_i_am_paragraphs: [
    "I'm a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.",
    "With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions.",
  ],
  stat_projects_value: 10,
  stat_projects_suffix: "+",
  stat_projects_tag: "Delivered with quality",
  stat_technologies_value: 6,
  stat_technologies_suffix: "+",
  stat_technologies_tag: "Modern stack mastery",
  stat_platforms_value: 4,
  stat_platforms_suffix: "+",
  stat_platforms_tag: "End-to-end solutions",
  stat_countries_value: 3,
  stat_countries_suffix: "+",
  stat_countries_tag: "International clients",
};

export const defaultJourney: JourneyEntry[] = [
  {
    id: "default-j-1",
    year: "2023",
    title: "Bioanalytical Analyst",
    description:
      "Worked in the pharmaceutical and bioequivalence sector developing analytical, laboratory and problem-solving expertise.",
    icon_name: "Building2",
    node_color: "bg-blue-500 shadow-blue-500/50",
    sort_order: 0,
    published: true,
  },
  {
    id: "default-j-2",
    year: "2024",
    title: "Eduvera Development",
    description:
      "Designed and developed Eduvera, an educational platform featuring mobile applications, admin dashboards and community tools.",
    icon_name: "GraduationCap",
    node_color: "bg-violet-500 shadow-violet-500/50",
    sort_order: 1,
    published: true,
  },
  {
    id: "default-j-3",
    year: "2025",
    title: "Full Stack Development",
    description:
      "Expanded into full stack web development, CMS solutions and scalable business platforms.",
    icon_name: "Code2",
    node_color: "bg-cyan-500 shadow-cyan-500/50",
    sort_order: 2,
    published: true,
  },
  {
    id: "default-j-4",
    year: "2026",
    title: "Freelance & Digital Solutions",
    description:
      "Helping schools, training centers and businesses build powerful digital products.",
    icon_name: "User",
    node_color: "bg-emerald-500 shadow-emerald-500/50",
    sort_order: 3,
    published: true,
  },
];

export const defaultAboutStatistics = aboutSettingsToStatistics(defaultAbout);

export const defaultSections: Record<string, Record<string, unknown>> = {
  about: {},
  projects_header: {
    badge: "MY WORK",
    title: "Featured Projects",
    subtitle:
      "Real-world applications, educational platforms, CMS systems and business websites built for performance and scalability.",
    stats: projectStats,
  },
  services: {
    badge: "SERVICES",
    title_prefix: "Services That Help",
    title_highlight: "Businesses Grow",
    subtitle:
      "From mobile applications and business websites to educational platforms and custom CMS solutions, I build digital products that are fast, scalable and designed for long-term success.",
    cards: serviceCards,
    benefits,
    cta: {
      label: "Ready to Get Started?",
      title: "Have a Project in Mind?",
      title_highlight: "Let's Build Something Amazing Together",
      description:
        "I'm available for new projects and exciting opportunities. Let's discuss how we can bring your ideas to life.",
    },
  },
  technologies: {
    badge: "TECHNOLOGIES",
    title_prefix: "Technologies I Use To Build",
    title_highlight: "Modern Products",
    subtitle:
      "A carefully selected technology stack focused on performance, scalability and exceptional user experiences.",
    categories: techCategories,
    tools,
  },
  contact: {
    badge: "LET'S CONNECT",
    title_prefix: "Let's",
    title_highlight: "Work Together",
    subtitle:
      "Have a project in mind or want to discuss an idea? I'm always open to new opportunities and exciting collaborations.",
  },
  footer: { links: footerLinks },
};

const caseStudyDefaults: Record<string, Record<string, unknown>> = {
  eduvera: {
    project_overview:
      "Eduvera is a complete educational ecosystem designed to modernize how schools and training centers deliver courses, manage students, and engage communities. Built with Flutter and Firebase, it combines mobile learning, admin dashboards, and real-time collaboration in one scalable platform.",
    problem_statement:
      "Educational institutions struggled with fragmented tools — separate apps for courses, messaging, and administration — leading to poor student engagement and operational overhead.",
    solution:
      "We delivered a unified Flutter mobile app with Firebase backend, custom admin dashboards, authentication, course management, and community features tailored for educators and learners.",
    business_impact:
      "Reduced administrative workload, increased student engagement, and provided a scalable foundation for multi-campus expansion.",
    project_year: "2024",
    project_duration: "6 Months",
    client_name: "Eduvera Inc.",
    industry: "Education / EdTech",
    statistics: [
      { label: "Total Students", value: "2,847+", icon: "users" },
      { label: "Active Courses", value: "48", icon: "book" },
      { label: "Total Revenue", value: "$84.2K+", icon: "revenue" },
      { label: "System Uptime", value: "99.9%", icon: "uptime" },
    ],
    results: [
      { label: "Student Engagement", value: "+62%", description: "Increase in daily active learners" },
      { label: "Admin Efficiency", value: "3x", description: "Faster course publishing workflow" },
      { label: "App Store Rating", value: "4.8★", description: "Average user satisfaction" },
    ],
    challenges: [
      "Real-time sync across mobile and web admin panels",
      "Secure multi-role authentication for students, teachers, and admins",
      "Video streaming performance on low-bandwidth networks",
      "Scalable Firebase data architecture for growing enrollments",
    ],
    solutions: [
      "Implemented Firestore listeners with optimistic UI updates",
      "Role-based access control with Firebase Auth custom claims",
      "Adaptive video quality and CDN-backed media delivery",
      "Normalized collections with composite indexes and pagination",
    ],
  },
  muhlentechnik: {
    project_overview:
      "Muhlentechnik is a professional multilingual corporate website for an international industrial and agricultural business, featuring CMS integration, SEO optimization, and a polished brand presence.",
    problem_statement:
      "The client needed a modern digital presence to reach international markets with professional credibility and easy content management.",
    solution:
      "Built a responsive Next.js website with CMS integration, multi-section architecture, and SEO-first structure for global visibility.",
    business_impact:
      "Strengthened international brand presence and enabled the marketing team to update content without developer dependency.",
    project_year: "2025",
    project_duration: "3 Months",
    client_name: "Muhlentechnik",
    industry: "Industrial / Agriculture",
    statistics: [
      { label: "Page Speed", value: "95+", icon: "performance" },
      { label: "Languages", value: "3", icon: "globe" },
      { label: "SEO Score", value: "98%", icon: "chart" },
      { label: "Uptime", value: "99.9%", icon: "uptime" },
    ],
    results: [
      { label: "Organic Traffic", value: "+120%", description: "Growth within first quarter" },
      { label: "Lead Inquiries", value: "+45%", description: "Via contact forms" },
    ],
    challenges: [
      "Multilingual content structure",
      "CMS workflow for non-technical editors",
      "Industrial brand aesthetics with modern UX",
    ],
    solutions: [
      "Structured content models per locale",
      "Intuitive admin panel with preview",
      "Premium dark corporate design system",
    ],
  },
};

export const defaultProjects = staticProjects.map((p, i) => ({
  id: p.id,
  slug: p.id,
  title: p.title,
  category: p.category,
  description: p.description,
  features: p.features,
  technologies: p.technologies,
  primary_button_label: p.primaryButton.label,
  primary_button_href: p.primaryButton.href,
  primary_button_external: p.primaryButton.external ?? false,
  secondary_button_label: p.secondaryButton.label,
  secondary_button_href: p.secondaryButton.href,
  website_url: "",
  details_url: "",
  live_demo_url: "",
  ...(caseStudyDefaults[p.id] ?? {}),
  featured: p.featured ?? false,
  accent: p.accent,
  showcase_type: p.id === "eduvera" ? "eduvera" as const : p.id === "muhlentechnik" ? "muhlentechnik" as const : "custom" as const,
  icon_name: p.id === "eduvera" ? "BookOpen" : "Factory",
  sort_order: i,
  published: true,
  images: [],
  gallery_images: [] as string[],
  challenges: (caseStudyDefaults[p.id]?.challenges as string[]) ?? [],
  solutions: (caseStudyDefaults[p.id]?.solutions as string[]) ?? [],
}));

export const defaultContactMethods = staticContactMethods.map((m, i) => ({
  id: m.id,
  type: m.id,
  label: m.label,
  value: m.value,
  subtext: m.sub,
  href: m.href,
  sort_order: i,
  published: true,
}));

export const fallbackPortfolioData: PortfolioData = {
  hero: defaultHero,
  about: defaultAbout,
  aboutStatistics: defaultAboutStatistics,
  journey: defaultJourney,
  projects: defaultProjects,
  projectStats: projectStats.map((s) => ({ label: s.label, icon: s.icon })),
  testimonials: [],
  contactMethods: defaultContactMethods,
  activeCv: null,
  seo: defaultSeo,
  sections: defaultSections,
  source: "fallback",
};
