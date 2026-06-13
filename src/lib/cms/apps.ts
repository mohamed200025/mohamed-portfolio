import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AppRecord } from "@/types/cms";
import { defaultApps } from "./defaults";
import { normalizeApp } from "./app-utils";

export interface AppPageData {
  app: AppRecord;
  prev: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
}

export function sortApps(apps: AppRecord[]): AppRecord[] {
  return [...apps].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return (a.created_at ?? "").localeCompare(b.created_at ?? "");
  });
}

function adjacentApps(apps: AppRecord[], slug: string): Pick<AppPageData, "prev" | "next"> {
  const sorted = sortApps(apps);
  const index = sorted.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };
  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;
  return {
    prev: prev ? { slug: prev.slug, name: prev.name } : null,
    next: next ? { slug: next.slug, name: next.name } : null,
  };
}

export async function fetchAllPublishedApps(): Promise<AppRecord[]> {
  if (!isSupabaseConfigured()) return defaultApps;

  try {
    const supabase = await createClient();
    const [appsRes, shotsRes] = await Promise.all([
      supabase
        .from("apps")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("app_screenshots").select("*").order("sort_order"),
    ]);

    if (!appsRes.data?.length) return [];

    const shotsByApp = (shotsRes.data ?? []).reduce<Record<string, AppRecord["screenshots"]>>(
      (acc, img) => {
        if (!acc[img.app_id]) acc[img.app_id] = [];
        acc[img.app_id]!.push(img);
        return acc;
      },
      {}
    );

    return sortApps(
      appsRes.data.map((row) =>
        normalizeApp(row as Record<string, unknown>, shotsByApp[row.id] ?? [])
      )
    );
  } catch {
    return defaultApps;
  }
}

export async function fetchAppBySlug(slug: string): Promise<AppPageData | null> {
  const apps = await fetchAllPublishedApps();
  const app = apps.find((a) => a.slug === slug);
  if (!app) return null;
  return { app, ...adjacentApps(apps, slug) };
}

export async function fetchAllAppSlugs(): Promise<string[]> {
  const apps = await fetchAllPublishedApps();
  return apps.map((a) => a.slug);
}

export function resolveDownloadApp(
  hero: { download_app_enabled: boolean; download_app_id: string | null },
  apps: AppRecord[]
): AppRecord | null {
  if (!hero.download_app_enabled || !hero.download_app_id) return null;
  return apps.find((a) => a.id === hero.download_app_id) ?? null;
}

export function resolveProjectApp(
  project: { app_id?: string | null },
  apps: AppRecord[]
): AppRecord | null {
  if (!project.app_id) return null;
  return apps.find((a) => a.id === project.app_id) ?? null;
}
