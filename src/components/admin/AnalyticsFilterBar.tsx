"use client";

import Link from "next/link";
import type { AnalyticsRange } from "@/types/cms";

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "12mo", label: "Last 12 Months" },
  { value: "all", label: "All Time" },
];

interface AnalyticsFilterBarProps {
  current: AnalyticsRange;
}

export function AnalyticsFilterBar({ current }: AnalyticsFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGES.map((range) => {
        const active = current === range.value;
        return (
          <Link
            key={range.value}
            href={`/admin/analytics?range=${range.value}`}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              active
                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {range.label}
          </Link>
        );
      })}
    </div>
  );
}
