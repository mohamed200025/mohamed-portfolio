import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  DashboardStats,
  PortfolioData,
  ProjectRecord,
  SeoSettings,
} from "@/types/cms";
import {
  defaultAbout,
  defaultAboutStatistics,
  defaultContactMethods,
  defaultContactSettings,
  defaultPricingData,
  defaultHero,
  defaultJourney,
  defaultProjects,
  defaultApps,
  defaultSections,
  defaultSeo,
  fallbackPortfolioData,
} from "./defaults";
import { aboutSettingsToStatistics, normalizeAboutSettings } from "./about-utils";
import { contactSettingsToMethods, normalizeContactSettings } from "./contact-utils";
import { buildPricingData } from "./pricing-utils";
import {
  normalizePricingCurrency,
  normalizePricingFeature,
  normalizePricingProjectType,
  normalizePricingSettings,
  normalizePricingTimeline,
} from "./pricing-normalize";
import { normalizeHeroSettings, resolveFeaturedProject } from "./hero-utils";
import { resolveDownloadApp, sortApps } from "./apps";
import { normalizeApp } from "./app-utils";
import { projectStats } from "@/lib/projects-data";
import { normalizeProject } from "./project-utils";
import type {
  JourneyEntry,
  PricingCurrency,
  PricingFeature,
  PricingProjectType,
  PricingSettings,
  PricingTimelineOption,
} from "@/types/cms";

function logFetchDiagnostics(context: string, details: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production" && !process.env.CMS_FETCH_DEBUG) return;
  console.error(`[fetchPortfolioData] ${context}`, details);
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!isSupabaseConfigured()) {
    logFetchDiagnostics("using full fallback — Supabase env not configured", {
      hasUrl,
      hasKey,
      urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 32) ?? null,
    });
    return fallbackPortfolioData;
  }

  try {
    const supabase = await createClient();

    const [
      heroRes,
      aboutRes,
      journeyRes,
      projectsRes,
      imagesRes,
      testimonialsRes,
      contactRes,
      contactSettingsRes,
      pricingSettingsRes,
      pricingCurrenciesRes,
      pricingProjectTypesRes,
      pricingFeaturesRes,
      pricingTimelinesRes,
      cvRes,
      seoRes,
      sectionsRes,
      appsRes,
      appScreenshotsRes,
    ] = await Promise.all([
      supabase.from("hero_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("about_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("journey_entries").select("*").eq("published", true).order("sort_order"),
      supabase.from("projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("project_images").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").eq("published", true).order("sort_order"),
      supabase.from("contact_methods").select("*").eq("published", true).order("sort_order"),
      supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("pricing_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("pricing_currencies").select("*").order("sort_order"),
      supabase.from("pricing_project_types").select("*").eq("published", true).order("sort_order"),
      supabase.from("pricing_features").select("*").eq("published", true).order("sort_order"),
      supabase.from("pricing_timeline_options").select("*").eq("published", true).order("sort_order"),
      supabase.from("cv_files").select("*").eq("is_active", true).maybeSingle(),
      supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("section_content").select("*"),
      supabase
        .from("apps")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("app_screenshots").select("*").order("sort_order"),
    ]);

    const projectsCount = projectsRes.data?.length ?? 0;
    logFetchDiagnostics("Supabase query results", {
      hasUrl,
      hasKey,
      projectsCount,
      projectsError: projectsRes.error?.message ?? null,
      projectsStatus: projectsRes.status,
      imagesError: imagesRes.error?.message ?? null,
      heroError: heroRes.error?.message ?? null,
    });

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
        ? projectsRes.data.map((p) =>
            normalizeProject(p as Record<string, unknown>, imagesByProject[p.id] ?? [])
          )
        : (() => {
            logFetchDiagnostics("using defaultProjects — no published rows from Supabase", {
              projectsCount,
              projectsError: projectsRes.error?.message ?? null,
              dataIsNull: projectsRes.data === null,
            });
            return defaultProjects;
          })();

    const sections: Record<string, Record<string, unknown>> = { ...defaultSections };
    (sectionsRes.data ?? []).forEach((row) => {
      sections[row.section_key] = row.content as Record<string, unknown>;
    });

    const projectsHeader = sections.projects_header ?? defaultSections.projects_header;
    const stats =
      (projectsHeader.stats as { label: string; icon: string }[]) ??
      projectStats.map((s) => ({ label: s.label, icon: s.icon }));

    const about = aboutRes.data
      ? normalizeAboutSettings(aboutRes.data as Record<string, unknown>)
      : defaultAbout;

    const journey: JourneyEntry[] =
      journeyRes.data && journeyRes.data.length > 0 ? journeyRes.data : defaultJourney;

    const contactSettings = contactSettingsRes.data
      ? normalizeContactSettings(contactSettingsRes.data as Record<string, unknown>)
      : defaultContactSettings;

    const contactMethods = contactSettingsRes.data
      ? contactSettingsToMethods(contactSettings)
      : contactRes.data && contactRes.data.length > 0
        ? contactRes.data
        : defaultContactMethods;

    const pricingSettings = pricingSettingsRes.data
      ? normalizePricingSettings(pricingSettingsRes.data as Record<string, unknown>)
      : defaultPricingData.settings;

    const pricingData = buildPricingData(
      pricingSettings,
      (pricingCurrenciesRes.data?.length
        ? (pricingCurrenciesRes.data as Record<string, unknown>[]).map(normalizePricingCurrency).filter((c) => c.enabled)
        : defaultPricingData.currencies),
      (pricingProjectTypesRes.data?.length
        ? (pricingProjectTypesRes.data as Record<string, unknown>[]).map(normalizePricingProjectType)
        : defaultPricingData.projectTypes),
      (pricingFeaturesRes.data?.length
        ? (pricingFeaturesRes.data as Record<string, unknown>[]).map(normalizePricingFeature)
        : defaultPricingData.features),
      (pricingTimelinesRes.data?.length
        ? (pricingTimelinesRes.data as Record<string, unknown>[]).map(normalizePricingTimeline)
        : defaultPricingData.timelineOptions)
    );

    const shotsByApp = (appScreenshotsRes.data ?? []).reduce<Record<string, import("@/types/cms").AppScreenshot[]>>(
      (acc, img) => {
        if (!acc[img.app_id]) acc[img.app_id] = [];
        acc[img.app_id]!.push(img);
        return acc;
      },
      {}
    );

    const apps =
      appsRes.data && appsRes.data.length > 0
        ? sortApps(
            appsRes.data.map((row) =>
              normalizeApp(row as Record<string, unknown>, shotsByApp[row.id] ?? [])
            )
          )
        : defaultApps;

    const hero = heroRes.data
      ? normalizeHeroSettings(heroRes.data as Record<string, unknown>)
      : defaultHero;

    const featuredProject = resolveFeaturedProject(hero, projects);
    const downloadApp = resolveDownloadApp(hero, apps);

    return {
      hero,
      featuredProject,
      downloadApp,
      apps,
      about,
      aboutStatistics: aboutSettingsToStatistics(about),
      journey,
      projects,
      projectStats: stats,
      testimonials: testimonialsRes.data ?? [],
      contactSettings,
      contactMethods,
      pricingData,
      activeCv: cvRes.data ?? null,
      seo: (seoRes.data as SeoSettings) ?? defaultSeo,
      sections,
      source: "supabase",
    };
  } catch (error) {
    logFetchDiagnostics("using full fallback — exception in fetch", {
      error: error instanceof Error ? error.message : String(error),
    });
    return fallbackPortfolioData;
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalProjects: 0,
    publishedProjects: 0,
    unreadMessages: 0,
    totalMessages: 0,
    unreadLeads: 0,
    totalLeads: 0,
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

    const [projects, messages, leads, testimonials, analytics] = await Promise.all([
      supabase.from("projects").select("id, published"),
      supabase.from("contact_messages").select("id, read, created_at"),
      supabase.from("pricing_leads").select("id, read"),
      supabase.from("testimonials").select("id"),
      supabase
        .from("page_analytics")
        .select("path, created_at")
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    const allMessages = messages.data ?? [];
    const allLeads = leads.data ?? [];
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
      unreadLeads: allLeads.filter((l) => !l.read).length,
      totalLeads: allLeads.length,
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
