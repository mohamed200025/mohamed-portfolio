import { Activity, Calendar, Clock } from "lucide-react";
import type { PeakTraffic } from "@/types/cms";

interface PeakTrafficCardProps {
  data: PeakTraffic;
}

export function PeakTrafficCard({ data }: PeakTrafficCardProps) {
  const items = [
    { label: "Most Active Hour", value: data.mostActiveHour, icon: Clock, color: "text-cyan-400" },
    { label: "Most Active Day", value: data.mostActiveDay, icon: Calendar, color: "text-violet-400" },
    { label: "Most Active Month", value: data.mostActiveMonth, icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <h2 className="mb-4 font-semibold text-white">Peak Traffic</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] ${item.color}`}
            >
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/50">{item.label}</p>
              <p className="truncate font-semibold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
