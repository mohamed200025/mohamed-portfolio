import type { HeroSettings, ProjectRecord } from "@/types/cms";
import { getProjectScreenshotUrls } from "./project-utils";
import { defaultHero } from "./defaults";

export function normalizeHeroSettings(row: Record<string, unknown>): HeroSettings {
  const techStack = row.tech_stack;
  return {
    status_badge: String(row.status_badge ?? defaultHero.status_badge),
    headline_prefix: String(row.headline_prefix ?? defaultHero.headline_prefix),
    headline_highlight: String(row.headline_highlight ?? defaultHero.headline_highlight),
    subheadline_prefix: String(row.subheadline_prefix ?? defaultHero.subheadline_prefix),
    subheadline_highlight: String(row.subheadline_highlight ?? defaultHero.subheadline_highlight),
    description: String(row.description ?? defaultHero.description),
    primary_cta_text: String(row.primary_cta_text ?? defaultHero.primary_cta_text),
    primary_cta_href: String(row.primary_cta_href ?? defaultHero.primary_cta_href),
    secondary_cta_text: String(row.secondary_cta_text ?? defaultHero.secondary_cta_text),
    secondary_cta_href: String(row.secondary_cta_href ?? defaultHero.secondary_cta_href),
    tech_stack: Array.isArray(techStack)
      ? (techStack as HeroSettings["tech_stack"])
      : defaultHero.tech_stack,
    profile_name: String(row.profile_name ?? defaultHero.profile_name),
    profile_title: String(row.profile_title ?? defaultHero.profile_title),
    featured_project_id: row.featured_project_id ? String(row.featured_project_id) : null,
  };
}

/** Resolve CMS-selected showcase project; falls back to first published project. */
export function resolveFeaturedProject(
  hero: HeroSettings,
  projects: ProjectRecord[]
): ProjectRecord | null {
  if (projects.length === 0) return null;
  if (hero.featured_project_id) {
    const selected = projects.find((p) => p.id === hero.featured_project_id);
    if (selected) return selected;
  }
  return projects[0] ?? null;
}

/** Image #1 = laptop, image #2 = phone; duplicate #1 when only one image exists. */
export function resolveHeroShowcaseImages(
  project: ProjectRecord
): { desktopUrl: string; mobileUrl: string } | null {
  const { desktop, mobile } = getProjectScreenshotUrls(project);
  const desktopUrl = desktop ?? project.gallery_images?.[0];
  if (!desktopUrl) return null;
  return {
    desktopUrl,
    mobileUrl: mobile ?? desktopUrl,
  };
}
