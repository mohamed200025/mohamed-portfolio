import type { ProjectImage, ProjectRecord, ProjectResult, ProjectStatistic } from "@/types/cms";

function readUrlField(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function resolveWebsiteUrlFromRow(row: Record<string, unknown>): string {
  const fromWebsite = readUrlField(row.website_url);
  if (fromWebsite) return fromWebsite;
  const legacy = readUrlField(row.primary_button_href);
  if (legacy && legacy !== "#") return legacy;
  return "";
}

export function normalizeProject(
  row: Record<string, unknown>,
  images: ProjectImage[] = []
): ProjectRecord {
  const websiteUrl = resolveWebsiteUrlFromRow(row);
  const liveDemoUrl = readUrlField(row.live_demo_url);

  return {
    ...(row as unknown as ProjectRecord),
    website_url: websiteUrl || null,
    live_demo_url: liveDemoUrl || null,
    features: (row.features as string[]) ?? [],
    technologies: (row.technologies as string[]) ?? [],
    statistics: (row.statistics as ProjectStatistic[]) ?? [],
    results: (row.results as ProjectResult[]) ?? [],
    challenges: (row.challenges as string[]) ?? [],
    solutions: (row.solutions as string[]) ?? [],
    gallery_images: (row.gallery_images as string[]) ?? [],
    images,
  };
}

export function getWebsiteUrl(
  project: Pick<ProjectRecord, "website_url" | "primary_button_href">
): string {
  const fromWebsite = readUrlField(project.website_url);
  if (fromWebsite) return fromWebsite;
  const legacy = readUrlField(project.primary_button_href);
  if (legacy && legacy !== "#") return legacy;
  return "";
}

export function hasUrl(url?: string | null): boolean {
  return Boolean(url?.trim());
}

export function shouldShowWebsiteButton(
  project: Pick<ProjectRecord, "website_url" | "primary_button_href">
): boolean {
  return hasUrl(getWebsiteUrl(project));
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function projectDetailsPath(slug: string): string {
  return `/projects/${slug}`;
}

/** First uploaded image = desktop, second = mobile (by sort_order). */
export function getProjectScreenshotUrls(project: ProjectRecord): {
  desktop?: string;
  mobile?: string;
} {
  const sorted = [...(project.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const urls = sorted.map((img) => img.url).filter(Boolean);
  return {
    desktop: urls[0],
    mobile: urls[1],
  };
}

export function hasProjectScreenshots(project: ProjectRecord): boolean {
  return Boolean(getProjectScreenshotUrls(project).desktop);
}

export function parseStatisticsInput(raw: string): ProjectStatistic[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value, icon] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", value: value ?? "", icon: icon || "chart" };
    })
    .filter((s) => s.label && s.value);
}

export function formatStatisticsInput(stats: ProjectStatistic[]): string {
  return stats.map((s) => `${s.label} | ${s.value} | ${s.icon ?? "chart"}`).join("\n");
}

export function parseResultsInput(raw: string): ProjectResult[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value, description] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", value: value ?? "", description: description || undefined };
    })
    .filter((r) => r.label && r.value);
}

export function formatResultsInput(results: ProjectResult[]): string {
  return results
    .map((r) => `${r.label} | ${r.value}${r.description ? ` | ${r.description}` : ""}`)
    .join("\n");
}

export function parseLinesInput(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Columns present after base schema + URL migration — always safe to write. */
export function buildCoreProjectPayload(project: ProjectRecord) {
  const websiteUrl = readUrlField(project.website_url);

  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    features: project.features,
    technologies: project.technologies,
    primary_button_label: project.primary_button_label,
    primary_button_href: websiteUrl || project.primary_button_href || "#",
    primary_button_external: websiteUrl ? true : project.primary_button_external,
    secondary_button_label: project.secondary_button_label,
    secondary_button_href: project.secondary_button_href,
    website_url: websiteUrl || null,
    details_url: project.details_url?.trim() || null,
    featured: project.featured,
    accent: project.accent,
    showcase_type: project.showcase_type,
    icon_name: project.icon_name,
    sort_order: project.sort_order,
    published: project.published,
    updated_at: new Date().toISOString(),
  };
}

/** Case study columns — require 20250612_project_case_study_fields.sql migration. */
export function buildCaseStudyPayload(project: ProjectRecord) {
  return {
    live_demo_url: project.live_demo_url?.trim() || null,
    project_overview: project.project_overview?.trim() || null,
    problem_statement: project.problem_statement?.trim() || null,
    solution: project.solution?.trim() || null,
    business_impact: project.business_impact?.trim() || null,
    project_year: project.project_year?.trim() || null,
    project_duration: project.project_duration?.trim() || null,
    client_name: project.client_name?.trim() || null,
    industry: project.industry?.trim() || null,
    gallery_images: project.gallery_images ?? [],
    statistics: project.statistics ?? [],
    results: project.results ?? [],
    challenges: project.challenges ?? [],
    solutions: project.solutions ?? [],
  };
}

export function isMissingColumnError(error: { code?: string; message?: string } | null) {
  return error?.code === "PGRST204" || Boolean(error?.message?.includes("Could not find the"));
}

export function isSingleRowCoercionError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST116" ||
    Boolean(error?.message?.includes("Cannot coerce the result to a single JSON object"))
  );
}

/** Use after .update().select() / .insert().select() — never chain .single(). */
export function pickSavedProjectRow(
  rows: Record<string, unknown>[] | null | undefined,
  projectId?: string
): Record<string, unknown> | null {
  if (!rows?.length) return null;
  if (projectId) {
    const match = rows.find((row) => row.id === projectId);
    if (match) return match;
  }
  return rows[0] ?? null;
}
