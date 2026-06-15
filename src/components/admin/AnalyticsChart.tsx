"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsChartPoint } from "@/types/cms";

interface AnalyticsChartProps {
  title: string;
  data: AnalyticsChartPoint[];
  dataKey?: string;
  gradientId: string;
}

export function AnalyticsChart({
  title,
  data,
  dataKey = "visits",
  gradientId,
}: AnalyticsChartProps) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
      <h3 className="mb-4 font-semibold text-white">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-52 items-center justify-center text-sm text-white/40">
          No data yet
        </div>
      ) : (
        <div className="min-w-0 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={220} minWidth={0}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#0a0a12",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#22d3ee"
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
