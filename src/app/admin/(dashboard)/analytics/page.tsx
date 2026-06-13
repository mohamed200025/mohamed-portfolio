import { fetchDashboardStats } from "@/lib/cms/fetch";
import { ViewsChart } from "@/components/admin/ViewsChart";

export default async function AdminAnalyticsPage() {
  const stats = await fetchDashboardStats();

  return (
    <div className="min-w-0 w-full">
      <h1 className="mb-2 text-2xl font-bold text-white">Analytics</h1>
      <p className="mb-8 text-sm text-white/50">
        {stats.pageViews30d} views in the last 30 days · {stats.pageViewsToday} today
      </p>

      <div className="mb-8 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <ViewsChart data={stats.viewsByDay} />
      </div>

      <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <h2 className="mb-4 font-semibold text-white">Top Pages</h2>
        <ul className="space-y-2">
          {stats.topPages.map((p) => (
            <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-white/70">{p.path}</span>
              <span className="shrink-0 text-cyan-400">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
