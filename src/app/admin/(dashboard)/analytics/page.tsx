import { fetchDashboardStats } from "@/lib/cms/fetch";
import { ViewsChart } from "@/components/admin/ViewsChart";

export default async function AdminAnalyticsPage() {
  const stats = await fetchDashboardStats();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Analytics</h1>
      <p className="mb-8 text-sm text-white/50">
        {stats.pageViews30d} views in the last 30 days · {stats.pageViewsToday} today
      </p>

      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <ViewsChart data={stats.viewsByDay} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 font-semibold text-white">Top Pages</h2>
        <ul className="space-y-2">
          {stats.topPages.map((p) => (
            <li key={p.path} className="flex justify-between text-sm">
              <span className="text-white/70">{p.path}</span>
              <span className="text-cyan-400">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
