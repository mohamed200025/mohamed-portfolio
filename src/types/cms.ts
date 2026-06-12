export interface HeroSettings {
  status_badge: string;
  headline_prefix: string;
  headline_highlight: string;
  subheadline_prefix: string;
  subheadline_highlight: string;
  description: string;
  primary_cta_text: string;
  primary_cta_href: string;
  secondary_cta_text: string;
  secondary_cta_href: string;
  tech_stack: TechStackItem[];
  profile_name: string;
  profile_title: string;
}

export interface TechStackItem {
  name: string;
  abbr?: string;
  color?: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  technologies: string[];
  primary_button_label: string;
  primary_button_href: string;
  primary_button_external: boolean;
  secondary_button_label: string;
  secondary_button_href: string;
  featured: boolean;
  accent: "cyan" | "blue";
  showcase_type: "eduvera" | "muhlentechnik" | "custom";
  icon_name: string;
  sort_order: number;
  published: boolean;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  storage_path?: string | null;
  alt_text?: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  avatar_url?: string | null;
  rating?: number | null;
  published: boolean;
  sort_order: number;
}

export interface ContactMethod {
  id: string;
  type: string;
  label: string;
  value: string;
  subtext?: string | null;
  href: string;
  sort_order: number;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface CvFile {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  file_size?: number | null;
  is_active: boolean;
  uploaded_at: string;
}

export interface SeoSettings {
  site_title: string;
  site_description: string;
  keywords: string[];
  og_image_url?: string | null;
  twitter_handle?: string | null;
  canonical_url?: string | null;
}

export interface SectionContent {
  section_key: string;
  content: Record<string, unknown>;
}

export interface PortfolioData {
  hero: HeroSettings;
  projects: ProjectRecord[];
  projectStats: { label: string; icon: string }[];
  testimonials: Testimonial[];
  contactMethods: ContactMethod[];
  activeCv: CvFile | null;
  seo: SeoSettings;
  sections: Record<string, Record<string, unknown>>;
  source: "supabase" | "fallback";
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  unreadMessages: number;
  totalMessages: number;
  testimonials: number;
  pageViews30d: number;
  pageViewsToday: number;
  topPages: { path: string; count: number }[];
  viewsByDay: { date: string; views: number }[];
}
