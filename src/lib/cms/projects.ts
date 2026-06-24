import { unwrapList } from "@/lib/cms/query-utils";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { AppRecord, ProjectRecord } from "@/types/cms";
import { defaultProjects } from "./defaults";
import { fetchAllPublishedApps, resolveProjectApp } from "./apps";
import { normalizeProject } from "./project-utils";

export interface ProjectPageData {
  project: ProjectRecord;
  linkedApp: AppRecord | null;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

function logDiagnostics(context: string, details: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production" && !process.env.CMS_FETCH_DEBUG) return;
  console.error(`[fetchProject] ${context}`, details);
}

function sortProjects(projects: ProjectRecord[]): ProjectRecord[] {
  return [...projects].sort((a, b) => a.sort_order - b.sort_order);
}

function adjacentProjects(
  projects: ProjectRecord[],
  slug: string
): Pick<ProjectPageData, "prev" | "next"> {
  const sorted = sortProjects(projects);
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index < sorted.length - 1 ? sorted[index + 1] : null;
  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}

async function fetchAllPublishedProjects(): Promise<ProjectRecord[]> {
  if (!isSupabaseConfigured()) return defaultProjects;

  try {
    const supabase = createPublicClient();
    const [projectsRes, imagesRes] = await Promise.all([
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("project_images").select("*").order("sort_order"),
    ]);

    const projectRows = unwrapList(
      projectsRes,
      defaultProjects,
      "projects",
      logDiagnostics
    );
    const imageRows = unwrapList(imagesRes, [], "project_images", logDiagnostics, false);

    const imagesByProject = imageRows.reduce<Record<string, ProjectRecord["images"]>>(
      (acc, img) => {
        if (!acc[img.project_id]) acc[img.project_id] = [];
        acc[img.project_id]!.push(img);
        return acc;
      },
      {}
    );

    return projectRows.map((p) =>
      normalizeProject(p as Record<string, unknown>, imagesByProject[p.id] ?? [])
    );
  } catch {
    return defaultProjects;
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectPageData | null> {
  if (!isSupabaseConfigured()) {
    const projects = defaultProjects;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return {
      project,
      linkedApp: resolveProjectApp(project, []),
      ...adjacentProjects(projects, slug),
    };
  }

  try {
    const [projects, apps] = await Promise.all([
      fetchAllPublishedProjects(),
      fetchAllPublishedApps(),
    ]);
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return {
      project,
      linkedApp: resolveProjectApp(project, apps),
      ...adjacentProjects(projects, slug),
    };
  } catch {
    const projects = defaultProjects;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return {
      project,
      linkedApp: resolveProjectApp(project, []),
      ...adjacentProjects(projects, slug),
    };
  }
}

export async function fetchAllProjectSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return defaultProjects.map((p) => p.slug);
  }
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("slug")
      .eq("published", true)
      .order("sort_order");

    if (error || !data?.length) {
      return defaultProjects.map((p) => p.slug);
    }
    return data.map((p) => p.slug);
  } catch {
    return defaultProjects.map((p) => p.slug);
  }
}
