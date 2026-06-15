import type { AnalyticsVisit } from "@/types/cms";

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function countUniqueVisitors(
  visits: Pick<AnalyticsVisit, "visitor_id" | "created_at">[],
  since?: Date
): number {
  const ids = new Set<string>();
  for (const visit of visits) {
    if (since && new Date(visit.created_at) < since) continue;
    ids.add(visit.visitor_id);
  }
  return ids.size;
}

export function getRangeStart(range: string, now = new Date()): Date | null {
  switch (range) {
    case "today":
      return startOfDay(now);
    case "7d": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case "30d": {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d;
    }
    case "12mo": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    }
    case "all":
      return null;
    default:
      return null;
  }
}

export function filterVisitsByRange<T extends { created_at: string }>(
  visits: T[],
  range: string,
  now = new Date()
): T[] {
  const since = getRangeStart(range, now);
  if (!since) return visits;
  return visits.filter((v) => new Date(v.created_at) >= since);
}

export function aggregateByHour(
  visits: Pick<AnalyticsVisit, "created_at">[],
  hours = 24,
  now = new Date()
): { label: string; visits: number }[] {
  const since = new Date(now);
  since.setHours(since.getHours() - hours);

  const buckets: Record<string, { label: string; visits: number }> = {};
  for (let i = hours - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() - i);
    const bucket = d.toISOString();
    const key = `${String(d.getHours()).padStart(2, "0")}:00`;
    buckets[bucket] = { label: key, visits: 0 };
  }

  for (const visit of visits) {
    const d = new Date(visit.created_at);
    if (d < since) continue;
    d.setMinutes(0, 0, 0);
    const bucket = d.toISOString();
    if (bucket in buckets) buckets[bucket].visits++;
  }

  return Object.values(buckets).map(({ label, visits }) => ({ label, visits }));
}

export function aggregateByDay(
  visits: Pick<AnalyticsVisit, "created_at">[],
  days = 30,
  now = new Date()
): { label: string; visits: number }[] {
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = 0;
  }

  const since = new Date(now);
  since.setDate(since.getDate() - days);

  for (const visit of visits) {
    const d = new Date(visit.created_at);
    if (d < since) continue;
    const key = d.toISOString().slice(0, 10);
    if (key in buckets) buckets[key]++;
  }

  return Object.entries(buckets).map(([label, visits]) => ({ label, visits }));
}

function getWeekKey(date: Date): string {
  const start = startOfWeek(date);
  return start.toISOString().slice(0, 10);
}

export function aggregateByWeek(
  visits: Pick<AnalyticsVisit, "created_at">[],
  weeks = 12,
  now = new Date()
): { label: string; visits: number }[] {
  const buckets: Record<string, number> = {};
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    buckets[getWeekKey(d)] = 0;
  }

  const since = new Date(now);
  since.setDate(since.getDate() - weeks * 7);

  for (const visit of visits) {
    const d = new Date(visit.created_at);
    if (d < since) continue;
    const key = getWeekKey(d);
    if (key in buckets) buckets[key]++;
  }

  return Object.entries(buckets).map(([label, visits]) => ({ label, visits }));
}

export function aggregateByMonth(
  visits: Pick<AnalyticsVisit, "created_at">[],
  months = 12,
  now = new Date()
): { label: string; visits: number }[] {
  const buckets: Record<string, number> = {};
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets[key] = 0;
  }

  const since = new Date(now.getFullYear(), now.getMonth() - months, 1);

  for (const visit of visits) {
    const d = new Date(visit.created_at);
    if (d < since) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (key in buckets) buckets[key]++;
  }

  return Object.entries(buckets).map(([label, visits]) => ({ label, visits }));
}

export function aggregateByYear(
  visits: Pick<AnalyticsVisit, "created_at">[]
): { label: string; visits: number }[] {
  const buckets: Record<string, number> = {};

  for (const visit of visits) {
    const year = String(new Date(visit.created_at).getFullYear());
    buckets[year] = (buckets[year] ?? 0) + 1;
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, visits]) => ({ label, visits }));
}

export function computePeakTraffic(visits: Pick<AnalyticsVisit, "created_at">[]): {
  mostActiveHour: string;
  mostActiveDay: string;
  mostActiveMonth: string;
} {
  const hourCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};
  const monthCounts: Record<string, number> = {};

  for (const visit of visits) {
    const d = new Date(visit.created_at);
    const hour = `${String(d.getHours()).padStart(2, "0")}:00`;
    const day = d.toISOString().slice(0, 10);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
    dayCounts[day] = (dayCounts[day] ?? 0) + 1;
    monthCounts[month] = (monthCounts[month] ?? 0) + 1;
  }

  const peak = (counts: Record<string, number>, fallback: string) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return fallback;
    return entries.sort(([, a], [, b]) => b - a)[0][0];
  };

  return {
    mostActiveHour: peak(hourCounts, "—"),
    mostActiveDay: peak(dayCounts, "—"),
    mostActiveMonth: peak(monthCounts, "—"),
  };
}

export function formatVisitTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function formatVisitDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
