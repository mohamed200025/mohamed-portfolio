import type { ProjectImage, ProjectRecord, ProjectResult, ProjectStatistic } from "@/types/cms";

export function normalizeProject(
  row: Record<string, unknown>,
  images: ProjectImage[] = []
): ProjectRecord {
  const websiteUrl = typeof row.website_url === "string" ? row.website_url.trim() : null;
  const liveDemoUrl = typeof row.live_demo_url === "string" ? row.live_demo_url.trim() : null;

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

export function getWebsiteUrl(project: Pick<ProjectRecord, "website_url">): string {
  const url = project.website_url?.trim();
  return url ?? "";
}

export function hasUrl(url?: string | null): boolean {
  return Boolean(url?.trim());
}

export function shouldShowWebsiteButton(project: Pick<ProjectRecord, "website_url">): boolean {
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
