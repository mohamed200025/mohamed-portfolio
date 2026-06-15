import type { AnalyticsTimelineRow } from "@/types/cms";

interface VisitsTimelineProps {
  rows: AnalyticsTimelineRow[];
}

export function VisitsTimeline({ rows }: VisitsTimelineProps) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
      <h2 className="mb-4 font-semibold text-white">Visits Timeline</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-white/40">No visits recorded yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="pb-3 pr-4 font-medium">Visit Date</th>
                <th className="pb-3 pr-4 font-medium">Visit Time</th>
                <th className="pb-3 pr-4 font-medium">Page Visited</th>
                <th className="pb-3 pr-4 font-medium">Referrer</th>
                <th className="pb-3 pr-4 font-medium">Country</th>
                <th className="pb-3 font-medium">Device</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 text-white/70 last:border-0"
                >
                  <td className="py-2.5 pr-4 whitespace-nowrap">{row.visitDate}</td>
                  <td className="py-2.5 pr-4 font-mono text-cyan-400/80 whitespace-nowrap">
                    {row.visitTime}
                  </td>
                  <td className="py-2.5 pr-4 max-w-[200px] truncate">{row.pagePath}</td>
                  <td className="py-2.5 pr-4 max-w-[180px] truncate text-white/50">
                    {row.referrer || "—"}
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    {row.country || "—"}
                  </td>
                  <td className="py-2.5 whitespace-nowrap">{row.deviceType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
