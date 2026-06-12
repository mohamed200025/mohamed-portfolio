import type { HeroSettings, PortfolioData, SeoSettings } from "@/types/cms";
import { projects as staticProjects, projectStats } from "@/lib/projects-data";
import { statistics, journey, services as aboutServices } from "@/lib/about-data";
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

export const defaultSections: Record<string, Record<string, unknown>> = {
  about: {
    badge: "ABOUT ME",
    title_prefix: "Building Digital Products That",
    title_highlight: "Solve Real Problems",
    subtitle:
      "From educational platforms and mobile applications to custom CMS systems and business websites, I focus on creating modern, scalable and user-centered digital experiences.",
    who_i_am: {
      title: "Who I Am",
      paragraphs: [
        "I'm a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.",
        "With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions.",
      ],
    },
    statistics,
    journey,
    skills: aboutServices,
  },
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
  featured: p.featured ?? false,
  accent: p.accent,
  showcase_type: p.id === "eduvera" ? "eduvera" as const : p.id === "muhlentechnik" ? "muhlentechnik" as const : "custom" as const,
  icon_name: p.id === "eduvera" ? "BookOpen" : "Factory",
  sort_order: i,
  published: true,
  images: [],
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
  projects: defaultProjects,
  projectStats: projectStats.map((s) => ({ label: s.label, icon: s.icon })),
  testimonials: [],
  contactMethods: defaultContactMethods,
  activeCv: null,
  seo: defaultSeo,
  sections: defaultSections,
  source: "fallback",
};
