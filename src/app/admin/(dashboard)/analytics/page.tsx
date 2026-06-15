import { fetchAnalyticsData } from "@/lib/analytics/fetch";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { AnalyticsFilterBar } from "@/components/admin/AnalyticsFilterBar";
import { PeakTrafficCard } from "@/components/admin/PeakTrafficCard";
import { StatCard } from "@/components/admin/StatCard";
import { VisitsTimeline } from "@/components/admin/VisitsTimeline";
import type { AnalyticsRange } from "@/types/cms";
import { Calendar, CalendarDays, CalendarRange, Eye, Users } from "lucide-react";

const VALID_RANGES: AnalyticsRange[] = ["today", "7d", "30d", "12mo", "all"];

function parseRange(value: string | string[] | undefined): AnalyticsRange {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && VALID_RANGES.includes(raw as AnalyticsRange)) {
    return raw as AnalyticsRange;
  }
  return "30d";
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = parseRange(params.range);
  const data = await fetchAnalyticsData(range);

  return (
    <div className="min-w-0 w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-white/50">
            Detailed visit statistics and traffic insights
          </p>
        </div>
        <AnalyticsFilterBar current={range} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Visitors Today"
          value={data.visitorsToday}
          icon={Eye}
          color="text-cyan-400"
        />
        <StatCard
          label="Visitors This Week"
          value={data.visitorsThisWeek}
          icon={Calendar}
          color="text-violet-400"
        />
        <StatCard
          label="Visitors This Month"
          value={data.visitorsThisMonth}
          icon={CalendarDays}
          color="text-emerald-400"
        />
        <StatCard
          label="Visitors This Year"
          value={data.visitorsThisYear}
          icon={CalendarRange}
          color="text-amber-400"
        />
        <StatCard
          label="Total Visitors"
          value={data.totalVisitors}
          icon={Users}
          color="text-pink-400"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitsTimeline rows={data.timeline} />
        </div>
        <PeakTrafficCard data={data.peakTraffic} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AnalyticsChart
          title="Visits per Hour (last 24h)"
          data={data.visitsByHour}
          gradientId="visitsHourGradient"
        />
        <AnalyticsChart
          title="Visits per Day (last 30 days)"
          data={data.visitsByDay}
          gradientId="visitsDayGradient"
        />
        <AnalyticsChart
          title="Visits per Week"
          data={data.visitsByWeek}
          gradientId="visitsWeekGradient"
        />
        <AnalyticsChart
          title="Visits per Month"
          data={data.visitsByMonth}
          gradientId="visitsMonthGradient"
        />
        <AnalyticsChart
          title="Visits per Year"
          data={data.visitsByYear}
          gradientId="visitsYearGradient"
        />
      </div>
    </div>
  );
}
