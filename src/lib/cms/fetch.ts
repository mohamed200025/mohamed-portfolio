import { unwrapList, unwrapQuery } from "@/lib/cms/query-utils";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/server";
import { fetchVisitCountsForDashboard } from "@/lib/analytics/fetch";
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
import type { JourneyEntry } from "@/types/cms";

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
    const supabase = createPublicClient();

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

    const heroRow = unwrapQuery(heroRes, null, "hero_settings", logFetchDiagnostics);
    const aboutRow = unwrapQuery(aboutRes, null, "about_settings", logFetchDiagnostics);
    const journeyRows = unwrapList(journeyRes, defaultJourney, "journey_entries", logFetchDiagnostics);
    const projectRows = unwrapList(projectsRes, defaultProjects, "projects", logFetchDiagnostics);
    const imageRows = unwrapList(imagesRes, [], "project_images", logFetchDiagnostics, false);
    const testimonialRows = unwrapList(
      testimonialsRes,
      [],
      "testimonials",
      logFetchDiagnostics,
      false
    );
    const contactMethodRows = unwrapList(
      contactRes,
      defaultContactMethods,
      "contact_methods",
      logFetchDiagnostics
    );
    const contactSettingsRow = unwrapQuery(
      contactSettingsRes,
      null,
      "contact_settings",
      logFetchDiagnostics
    );
    const pricingSettingsRow = unwrapQuery(
      pricingSettingsRes,
      null,
      "pricing_settings",
      logFetchDiagnostics
    );
    const pricingCurrencyRows = unwrapList(
      pricingCurrenciesRes,
      defaultPricingData.currencies,
      "pricing_currencies",
      logFetchDiagnostics
    );
    const pricingTypeRows = unwrapList(
      pricingProjectTypesRes,
      defaultPricingData.projectTypes,
      "pricing_project_types",
      logFetchDiagnostics
    );
    const pricingFeatureRows = unwrapList(
      pricingFeaturesRes,
      defaultPricingData.features,
      "pricing_features",
      logFetchDiagnostics
    );
    const pricingTimelineRows = unwrapList(
      pricingTimelinesRes,
      defaultPricingData.timelineOptions,
      "pricing_timeline_options",
      logFetchDiagnostics
    );
    const cvRow = unwrapQuery(cvRes, null, "cv_files", logFetchDiagnostics);
    const seoRow = unwrapQuery(seoRes, null, "seo_settings", logFetchDiagnostics);
    const sectionRows = unwrapList(sectionsRes, [], "section_content", logFetchDiagnostics, false);
    const appRows = unwrapList(appsRes, defaultApps, "apps", logFetchDiagnostics);
    const screenshotRows = unwrapList(
      appScreenshotsRes,
      [],
      "app_screenshots",
      logFetchDiagnostics,
      false
    );

    logFetchDiagnostics("Supabase query results", {
      hasUrl,
      hasKey,
      projectsCount: projectRows.length,
      appsCount: appRows.length,
      projectsError: projectsRes.error?.message ?? null,
      appsError: appsRes.error?.message ?? null,
    });

    const imagesByProject = imageRows.reduce<Record<string, ProjectRecord["images"]>>(
      (acc, img) => {
        if (!acc[img.project_id]) acc[img.project_id] = [];
        acc[img.project_id]!.push(img);
        return acc;
      },
      {}
    );

    const projects: ProjectRecord[] = projectRows.map((p) =>
      normalizeProject(
        p as Record<string, unknown>,
        imagesByProject[(p as { id: string }).id] ?? []
      )
    );

    const sections: Record<string, Record<string, unknown>> = { ...defaultSections };
    sectionRows.forEach((row) => {
      sections[row.section_key] = row.content as Record<string, unknown>;
    });

    const projectsHeader = sections.projects_header ?? defaultSections.projects_header;
    const stats =
      (projectsHeader.stats as { label: string; icon: string }[]) ??
      projectStats.map((s) => ({ label: s.label, icon: s.icon }));

    const about = aboutRow
      ? normalizeAboutSettings(aboutRow as Record<string, unknown>)
      : defaultAbout;

    const journey: JourneyEntry[] = journeyRows;

    const contactSettings = contactSettingsRow
      ? normalizeContactSettings(contactSettingsRow as Record<string, unknown>)
      : defaultContactSettings;

    const contactMethods = contactSettingsRow
      ? contactSettingsToMethods(contactSettings)
      : contactMethodRows.length > 0
        ? contactMethodRows
        : defaultContactMethods;

    const pricingSettings = pricingSettingsRow
      ? normalizePricingSettings(pricingSettingsRow as Record<string, unknown>)
      : defaultPricingData.settings;

    const pricingData = buildPricingData(
      pricingSettings,
      pricingCurrencyRows.length
        ? pricingCurrencyRows
            .map((c) => normalizePricingCurrency(c as Record<string, unknown>))
            .filter((c) => c.enabled)
        : defaultPricingData.currencies,
      pricingTypeRows.length
        ? pricingTypeRows.map((t) => normalizePricingProjectType(t as Record<string, unknown>))
        : defaultPricingData.projectTypes,
      pricingFeatureRows.length
        ? pricingFeatureRows.map((f) => normalizePricingFeature(f as Record<string, unknown>))
        : defaultPricingData.features,
      pricingTimelineRows.length
        ? pricingTimelineRows.map((t) => normalizePricingTimeline(t as Record<string, unknown>))
        : defaultPricingData.timelineOptions
    );

    const shotsByApp = screenshotRows.reduce<
      Record<string, import("@/types/cms").AppScreenshot[]>
    >((acc, img) => {
      if (!acc[img.app_id]) acc[img.app_id] = [];
      acc[img.app_id]!.push(img);
      return acc;
    }, {});

    const apps = sortApps(
      appRows.map((row) =>
        normalizeApp(row as Record<string, unknown>, shotsByApp[row.id] ?? [])
      )
    );

    const hero = heroRow
      ? normalizeHeroSettings(heroRow as Record<string, unknown>)
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
      testimonials: testimonialRows,
      contactSettings,
      contactMethods,
      pricingData,
      activeCv: cvRow,
      seo: (seoRow as SeoSettings) ?? defaultSeo,
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
    const supabase = await createAuthClient();

    const [projects, messages, leads, testimonials, visitStats] = await Promise.all([
      supabase.from("projects").select("id, published"),
      supabase.from("contact_messages").select("id, read, created_at"),
      supabase.from("pricing_leads").select("id, read"),
      supabase.from("testimonials").select("id"),
      fetchVisitCountsForDashboard(),
    ]);

    const allMessages = messages.data ?? [];
    const allLeads = leads.data ?? [];
    const allProjects = projects.data ?? [];

    return {
      totalProjects: allProjects.length,
      publishedProjects: allProjects.filter((p) => p.published).length,
      unreadMessages: allMessages.filter((m) => !m.read).length,
      totalMessages: allMessages.length,
      unreadLeads: allLeads.filter((l) => !l.read).length,
      totalLeads: allLeads.length,
      testimonials: testimonials.data?.length ?? 0,
      pageViews30d: visitStats.pageViews30d,
      pageViewsToday: visitStats.pageViewsToday,
      topPages: visitStats.topPages,
      viewsByDay: visitStats.viewsByDay,
    };
  } catch {
    return empty;
  }
}
