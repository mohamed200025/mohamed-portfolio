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
  featured_project_id: string | null;
}

export interface TechStackItem {
  name: string;
  abbr?: string;
  color?: string;
}

export interface ProjectStatistic {
  label: string;
  value: string;
  icon?: string;
}

export interface ProjectResult {
  label: string;
  value: string;
  description?: string;
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
  website_url?: string | null;
  details_url?: string | null;
  project_details_url?: string | null;
  live_demo_url?: string | null;
  project_overview?: string | null;
  problem_statement?: string | null;
  solution?: string | null;
  business_impact?: string | null;
  project_year?: string | null;
  project_duration?: string | null;
  client_name?: string | null;
  industry?: string | null;
  gallery_images?: string[];
  statistics?: ProjectStatistic[];
  results?: ProjectResult[];
  challenges?: string[];
  solutions?: string[];
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

export interface ContactSettings {
  id: number;
  whatsapp: string;
  email: string;
  linkedin_url: string;
  linkedin_username: string;
  github_url: string;
  github_username: string;
  contact_title: string;
  contact_subtitle: string;
  calendly_url: string;
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

export interface AboutSettings {
  profile_photo_url?: string | null;
  profile_photo_storage_path?: string | null;
  name: string;
  job_title: string;
  short_bio: string;
  status_badge: string;
  section_badge: string;
  title_prefix: string;
  title_highlight: string;
  who_i_am_title: string;
  who_i_am_paragraphs: string[];
  stat_projects_value: number;
  stat_projects_suffix: string;
  stat_projects_tag: string;
  stat_technologies_value: number;
  stat_technologies_suffix: string;
  stat_technologies_tag: string;
  stat_platforms_value: number;
  stat_platforms_suffix: string;
  stat_platforms_tag: string;
  stat_countries_value: number;
  stat_countries_suffix: string;
  stat_countries_tag: string;
}

export interface AboutStatistic {
  value: number;
  suffix: string;
  label: string;
  tag: string;
  color: string;
  iconColor: string;
  iconKey: string;
}

export interface JourneyEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  icon_name: string;
  node_color: string;
  sort_order: number;
  published: boolean;
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

export interface PricingSettings {
  id: number;
  badge: string;
  title_prefix: string;
  title_highlight: string;
  subtitle: string;
  default_currency: string;
  trust_items: { title: string; description: string }[];
}

export interface PricingCurrency {
  id: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  enabled: boolean;
  sort_order: number;
}

export interface PricingProjectType {
  id: string;
  title: string;
  description: string;
  min_price: number;
  max_price: number;
  icon: string;
  sort_order: number;
  published: boolean;
}

export interface PricingFeature {
  id: string;
  title: string;
  description: string;
  min_price: number;
  max_price: number;
  icon: string;
  sort_order: number;
  published: boolean;
}

export interface PricingTimelineOption {
  id: string;
  title: string;
  percentage_modifier: number;
  sort_order: number;
  published: boolean;
}

export interface PricingData {
  settings: PricingSettings;
  currencies: PricingCurrency[];
  projectTypes: PricingProjectType[];
  features: PricingFeature[];
  timelineOptions: PricingTimelineOption[];
}

export interface PricingEstimate {
  currency: PricingCurrency;
  baseMin: number;
  baseMax: number;
  featureMin: number;
  featureMax: number;
  subtotalMin: number;
  subtotalMax: number;
  estimateMin: number;
  estimateMax: number;
  timelineMultiplier: number;
  timeEstimate: string;
  complexity: "low" | "medium" | "high";
  complexityLabel: string;
  projectTypeTitle: string;
  timelineTitle: string;
  selectedFeatures: { id: string; title: string; minPrice: number; maxPrice: number }[];
}

export interface PricingLead {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  project_type: string;
  estimated_min: number;
  estimated_max: number;
  currency: string;
  message?: string | null;
  read: boolean;
  created_at: string;
}

export interface PortfolioData {
  hero: HeroSettings;
  featuredProject: ProjectRecord | null;
  about: AboutSettings;
  aboutStatistics: AboutStatistic[];
  journey: JourneyEntry[];
  projects: ProjectRecord[];
  projectStats: { label: string; icon: string }[];
  testimonials: Testimonial[];
  contactSettings: ContactSettings;
  contactMethods: ContactMethod[];
  pricingData: PricingData;
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
  unreadLeads: number;
  totalLeads: number;
  testimonials: number;
  pageViews30d: number;
  pageViewsToday: number;
  topPages: { path: string; count: number }[];
  viewsByDay: { date: string; views: number }[];
}
