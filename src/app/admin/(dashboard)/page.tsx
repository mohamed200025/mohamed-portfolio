import { fetchDashboardStats } from "@/lib/cms/fetch";
import { StatCard } from "@/components/admin/StatCard";
import { ViewsChart } from "@/components/admin/ViewsChart";
import {
  BarChart3,
  Briefcase,
  Eye,
  Mail,
  Star,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Overview of your portfolio website
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={stats.totalProjects} icon={Briefcase} />
        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          icon={Mail}
          color="text-violet-400"
        />
        <StatCard
          label="Testimonials"
          value={stats.testimonials}
          icon={Star}
          color="text-amber-400"
        />
        <StatCard
          label="Views (30 days)"
          value={stats.pageViews30d}
          icon={Eye}
          trend={`${stats.pageViewsToday} today`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h2 className="font-semibold text-white">Page Views</h2>
          </div>
          <ViewsChart data={stats.viewsByDay} />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 font-semibold text-white">Top Pages</h2>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-white/40">No data yet</p>
          ) : (
            <ul className="space-y-3">
              {stats.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                >
                  <span className="truncate text-sm text-white/70">{page.path}</span>
                  <span className="ml-2 text-sm font-medium text-cyan-400">{page.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
