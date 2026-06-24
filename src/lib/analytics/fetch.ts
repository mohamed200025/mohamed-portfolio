import { createAuthClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AnalyticsData, AnalyticsRange, AnalyticsVisit } from "@/types/cms";
import {
  aggregateByDay,
  aggregateByHour,
  aggregateByMonth,
  aggregateByWeek,
  aggregateByYear,
  computePeakTraffic,
  countUniqueVisitors,
  filterVisitsByRange,
  formatVisitDate,
  formatVisitTime,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "@/lib/analytics/aggregate";

const emptyAnalytics: AnalyticsData = {
  visitorsToday: 0,
  visitorsThisWeek: 0,
  visitorsThisMonth: 0,
  visitorsThisYear: 0,
  totalVisitors: 0,
  timeline: [],
  visitsByHour: [],
  visitsByDay: [],
  visitsByWeek: [],
  visitsByMonth: [],
  visitsByYear: [],
  peakTraffic: {
    mostActiveHour: "—",
    mostActiveDay: "—",
    mostActiveMonth: "—",
  },
};

function deviceFromUserAgent(userAgent: string | null): string {
  if (!userAgent) return "Desktop";
  const match = userAgent.match(/device=([^;]+)/i);
  return match?.[1]?.trim() ?? "Desktop";
}

export async function fetchAnalyticsData(
  range: AnalyticsRange = "30d"
): Promise<AnalyticsData> {
  if (!isSupabaseConfigured()) return emptyAnalytics;

  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase
      .from("analytics_visits")
      .select(
        "id, created_at, page_path, visitor_id, country, city, referrer, user_agent, session_id"
      )
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error("[analytics] fetchAnalyticsData read failed:", error.message, error.code);
      }
      return emptyAnalytics;
    }

    const visits = data as AnalyticsVisit[];
    const now = new Date();
    const filtered = filterVisitsByRange(visits, range, now);

    const timeline = filtered.slice(0, 100).map((visit) => ({
      id: visit.id,
      visitDate: formatVisitDate(visit.created_at),
      visitTime: formatVisitTime(visit.created_at),
      pagePath: visit.page_path,
      referrer: visit.referrer,
      country: visit.country,
      deviceType: deviceFromUserAgent(visit.user_agent),
    }));

    return {
      visitorsToday: countUniqueVisitors(visits, startOfDay(now)),
      visitorsThisWeek: countUniqueVisitors(visits, startOfWeek(now)),
      visitorsThisMonth: countUniqueVisitors(visits, startOfMonth(now)),
      visitorsThisYear: countUniqueVisitors(visits, startOfYear(now)),
      totalVisitors: countUniqueVisitors(visits),
      timeline,
      visitsByHour: aggregateByHour(visits, 24, now),
      visitsByDay: aggregateByDay(visits, 30, now),
      visitsByWeek: aggregateByWeek(visits, 12, now),
      visitsByMonth: aggregateByMonth(visits, 12, now),
      visitsByYear: aggregateByYear(visits),
      peakTraffic: computePeakTraffic(filtered),
    };
  } catch {
    return emptyAnalytics;
  }
}

export async function fetchVisitCountsForDashboard(): Promise<{
  pageViews30d: number;
  pageViewsToday: number;
  topPages: { path: string; count: number }[];
  viewsByDay: { date: string; views: number }[];
}> {
  const empty = { pageViews30d: 0, pageViewsToday: 0, topPages: [], viewsByDay: [] };

  if (!isSupabaseConfigured()) return empty;

  try {
    const supabase = await createAuthClient();
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const todayStart = startOfDay(now);

    const { data } = await supabase
      .from("analytics_visits")
      .select("page_path, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString());

    const views = data ?? [];
    const pageCounts: Record<string, number> = {};
    const dayCounts: Record<string, number> = {};

    views.forEach((v) => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] ?? 0) + 1;
      const day = v.created_at.slice(0, 10);
      dayCounts[day] = (dayCounts[day] ?? 0) + 1;
    });

    return {
      pageViews30d: views.length,
      pageViewsToday: views.filter((v) => v.created_at >= todayStart.toISOString()).length,
      topPages: Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      viewsByDay: Object.entries(dayCounts)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  } catch {
    return empty;
  }
}
