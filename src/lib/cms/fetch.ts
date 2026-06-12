import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  DashboardStats,
  HeroSettings,
  PortfolioData,
  ProjectRecord,
  SeoSettings,
} from "@/types/cms";
import {
  defaultContactMethods,
  defaultHero,
  defaultProjects,
  defaultSections,
  defaultSeo,
  fallbackPortfolioData,
} from "./defaults";
import { projectStats } from "@/lib/projects-data";

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (!isSupabaseConfigured()) return fallbackPortfolioData;

  try {
    const supabase = await createClient();

    const [
      heroRes,
      projectsRes,
      imagesRes,
      testimonialsRes,
      contactRes,
      cvRes,
      seoRes,
      sectionsRes,
    ] = await Promise.all([
      supabase.from("hero_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("project_images").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").eq("published", true).order("sort_order"),
      supabase.from("contact_methods").select("*").eq("published", true).order("sort_order"),
      supabase.from("cv_files").select("*").eq("is_active", true).maybeSingle(),
      supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("section_content").select("*"),
    ]);

    const imagesByProject = (imagesRes.data ?? []).reduce<Record<string, ProjectRecord["images"]>>(
      (acc, img) => {
        if (!acc[img.project_id]) acc[img.project_id] = [];
        acc[img.project_id]!.push(img);
        return acc;
      },
      {}
    );

    const projects: ProjectRecord[] =
      projectsRes.data && projectsRes.data.length > 0
        ? projectsRes.data.map((p) => ({
            ...p,
            features: p.features as string[],
            technologies: p.technologies as string[],
            images: imagesByProject[p.id] ?? [],
          }))
        : defaultProjects;

    const sections: Record<string, Record<string, unknown>> = { ...defaultSections };
    (sectionsRes.data ?? []).forEach((row) => {
      sections[row.section_key] = row.content as Record<string, unknown>;
    });

    const projectsHeader = sections.projects_header ?? defaultSections.projects_header;
    const stats =
      (projectsHeader.stats as { label: string; icon: string }[]) ??
      projectStats.map((s) => ({ label: s.label, icon: s.icon }));

    return {
      hero: (heroRes.data as HeroSettings) ?? defaultHero,
      projects,
      projectStats: stats,
      testimonials: testimonialsRes.data ?? [],
      contactMethods:
        contactRes.data && contactRes.data.length > 0
          ? contactRes.data
          : defaultContactMethods,
      activeCv: cvRes.data ?? null,
      seo: (seoRes.data as SeoSettings) ?? defaultSeo,
      sections,
      source: "supabase",
    };
  } catch {
    return fallbackPortfolioData;
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalProjects: 0,
    publishedProjects: 0,
    unreadMessages: 0,
    totalMessages: 0,
    testimonials: 0,
    pageViews30d: 0,
    pageViewsToday: 0,
    topPages: [],
    viewsByDay: [],
  };

  if (!isSupabaseConfigured()) return empty;

  try {
    const supabase = await createClient();
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const [projects, messages, testimonials, analytics] = await Promise.all([
      supabase.from("projects").select("id, published"),
      supabase.from("contact_messages").select("id, read, created_at"),
      supabase.from("testimonials").select("id"),
      supabase
        .from("page_analytics")
        .select("path, created_at")
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    const allMessages = messages.data ?? [];
    const views = analytics.data ?? [];

    const pageCounts: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};

    views.forEach((v) => {
      pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1;
      const day = v.created_at.slice(0, 10);
      dayCounts[day] = (dayCounts[day] ?? 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const viewsByDay = Object.entries(dayCounts)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const allProjects = projects.data ?? [];

    return {
      totalProjects: allProjects.length,
      publishedProjects: allProjects.filter((p) => p.published).length,
      unreadMessages: allMessages.filter((m) => !m.read).length,
      totalMessages: allMessages.length,
      testimonials: testimonials.data?.length ?? 0,
      pageViews30d: views.length,
      pageViewsToday: views.filter((v) => v.created_at >= todayStart.toISOString()).length,
      topPages,
      viewsByDay,
    };
  } catch {
    return empty;
  }
}
