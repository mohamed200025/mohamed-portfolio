import type { AppRecord, AppScreenshot } from "@/types/cms";

export function appDetailsPath(slug: string): string {
  return `/apps/${slug}`;
}

export function normalizeApp(
  row: Record<string, unknown>,
  screenshots: AppScreenshot[] = []
): AppRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    short_description: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    logo_url: row.logo_url ? String(row.logo_url) : null,
    logo_storage_path: row.logo_storage_path ? String(row.logo_storage_path) : null,
    apk_url: row.apk_url ? String(row.apk_url) : null,
    apk_storage_path: row.apk_storage_path ? String(row.apk_storage_path) : null,
    play_store_url: row.play_store_url ? String(row.play_store_url) : null,
    version: String(row.version ?? "1.0.0"),
    file_size: String(row.file_size ?? ""),
    last_updated: String(row.last_updated ?? ""),
    downloads_count: Number(row.downloads_count) || 0,
    technologies: (row.technologies as string[]) ?? [],
    features: (row.features as string[]) ?? [],
    rating: Number(row.rating) || 4.5,
    sort_order: Number(row.sort_order) || 0,
    published: Boolean(row.published ?? true),
    created_at: row.created_at ? String(row.created_at) : undefined,
    screenshots: [...screenshots].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export function buildAppPayload(app: Partial<AppRecord>) {
  return {
    slug: app.slug?.trim() ?? "",
    name: app.name?.trim() ?? "",
    short_description: app.short_description?.trim() ?? "",
    description: app.description?.trim() ?? "",
    logo_url: app.logo_url?.trim() || null,
    logo_storage_path: app.logo_storage_path || null,
    apk_url: app.apk_url?.trim() || null,
    apk_storage_path: app.apk_storage_path || null,
    play_store_url: app.play_store_url?.trim() || null,
    version: app.version?.trim() || "1.0.0",
    file_size: app.file_size?.trim() || "",
    last_updated: app.last_updated?.trim() || "",
    downloads_count: Number(app.downloads_count) || 0,
    technologies: app.technologies ?? [],
    features: app.features ?? [],
    rating: Number(app.rating) || 4.5,
    sort_order: Number(app.sort_order) || 0,
    published: app.published ?? true,
    updated_at: new Date().toISOString(),
  };
}

export function parseCommaList(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function parseLinesList(value: string): string[] {
  return value.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M+`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K+`;
  return count.toLocaleString();
}
