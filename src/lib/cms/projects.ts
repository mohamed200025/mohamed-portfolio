import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProjectRecord } from "@/types/cms";
import { defaultProjects } from "./defaults";
import { normalizeProject } from "./project-utils";

export interface ProjectPageData {
  project: ProjectRecord;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
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
  const supabase = await createClient();
  const [projectsRes, imagesRes] = await Promise.all([
    supabase.from("projects").select("*").eq("published", true).order("sort_order"),
    supabase.from("project_images").select("*").order("sort_order"),
  ]);

  const imagesByProject = (imagesRes.data ?? []).reduce<Record<string, ProjectRecord["images"]>>(
    (acc, img) => {
      if (!acc[img.project_id]) acc[img.project_id] = [];
      acc[img.project_id]!.push(img);
      return acc;
    },
    {}
  );

  if (!projectsRes.data?.length) return defaultProjects;

  return projectsRes.data.map((p) =>
    normalizeProject(p as Record<string, unknown>, imagesByProject[p.id] ?? [])
  );
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectPageData | null> {
  if (!isSupabaseConfigured()) {
    const projects = defaultProjects;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return { project, ...adjacentProjects(projects, slug) };
  }

  try {
    const projects = await fetchAllPublishedProjects();
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return { project, ...adjacentProjects(projects, slug) };
  } catch {
    const projects = defaultProjects;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return null;
    return { project, ...adjacentProjects(projects, slug) };
  }
}

export async function fetchAllProjectSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return defaultProjects.map((p) => p.slug);
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("slug")
      .eq("published", true)
      .order("sort_order");
    return data?.length ? data.map((p) => p.slug) : defaultProjects.map((p) => p.slug);
  } catch {
    return defaultProjects.map((p) => p.slug);
  }
}
