import type { AboutSettings, AboutStatistic } from "@/types/cms";

const STAT_META = [
  {
    label: "Projects Completed",
    color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
    iconColor: "text-blue-400",
    iconKey: "folder",
    valueKey: "stat_projects_value",
    suffixKey: "stat_projects_suffix",
    tagKey: "stat_projects_tag",
  },
  {
    label: "Technologies",
    color: "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20",
    iconColor: "text-violet-400",
    iconKey: "wrench",
    valueKey: "stat_technologies_value",
    suffixKey: "stat_technologies_suffix",
    tagKey: "stat_technologies_tag",
  },
  {
    label: "Platforms Built",
    color: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
    iconColor: "text-cyan-400",
    iconKey: "layers",
    valueKey: "stat_platforms_value",
    suffixKey: "stat_platforms_suffix",
    tagKey: "stat_platforms_tag",
  },
  {
    label: "Countries Served",
    color: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 border-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
    iconKey: "globe",
    valueKey: "stat_countries_value",
    suffixKey: "stat_countries_suffix",
    tagKey: "stat_countries_tag",
  },
] as const;

export function aboutSettingsToStatistics(about: AboutSettings): AboutStatistic[] {
  return STAT_META.map((meta) => ({
    label: meta.label,
    color: meta.color,
    iconColor: meta.iconColor,
    iconKey: meta.iconKey,
    value: about[meta.valueKey as keyof AboutSettings] as number,
    suffix: about[meta.suffixKey as keyof AboutSettings] as string,
    tag: about[meta.tagKey as keyof AboutSettings] as string,
  }));
}

export function normalizeAboutSettings(row: Record<string, unknown>): AboutSettings {
  return {
    profile_photo_url: (row.profile_photo_url as string) ?? null,
    profile_photo_storage_path: (row.profile_photo_storage_path as string) ?? null,
    name: (row.name as string) ?? "Mohamed Ournani",
    job_title: (row.job_title as string) ?? "Full Stack & Flutter Developer",
    short_bio: (row.short_bio as string) ?? "",
    status_badge: (row.status_badge as string) ?? "Available for new projects",
    section_badge: (row.section_badge as string) ?? "ABOUT ME",
    title_prefix: (row.title_prefix as string) ?? "Building Digital Products That",
    title_highlight: (row.title_highlight as string) ?? "Solve Real Problems",
    who_i_am_title: (row.who_i_am_title as string) ?? "Who I Am",
    who_i_am_paragraphs: (row.who_i_am_paragraphs as string[]) ?? [],
    stat_projects_value: Number(row.stat_projects_value ?? 10),
    stat_projects_suffix: (row.stat_projects_suffix as string) ?? "+",
    stat_projects_tag: (row.stat_projects_tag as string) ?? "Delivered with quality",
    stat_technologies_value: Number(row.stat_technologies_value ?? 6),
    stat_technologies_suffix: (row.stat_technologies_suffix as string) ?? "+",
    stat_technologies_tag: (row.stat_technologies_tag as string) ?? "Modern stack mastery",
    stat_platforms_value: Number(row.stat_platforms_value ?? 4),
    stat_platforms_suffix: (row.stat_platforms_suffix as string) ?? "+",
    stat_platforms_tag: (row.stat_platforms_tag as string) ?? "End-to-end solutions",
    stat_countries_value: Number(row.stat_countries_value ?? 3),
    stat_countries_suffix: (row.stat_countries_suffix as string) ?? "+",
    stat_countries_tag: (row.stat_countries_tag as string) ?? "International clients",
  };
}

export const JOURNEY_ICON_OPTIONS = [
  "Building2",
  "GraduationCap",
  "Code2",
  "User",
  "Briefcase",
  "Rocket",
  "Globe",
  "Smartphone",
] as const;

export const JOURNEY_NODE_COLORS = [
  { label: "Blue", value: "bg-blue-500 shadow-blue-500/50" },
  { label: "Violet", value: "bg-violet-500 shadow-violet-500/50" },
  { label: "Cyan", value: "bg-cyan-500 shadow-cyan-500/50" },
  { label: "Emerald", value: "bg-emerald-500 shadow-emerald-500/50" },
  { label: "Amber", value: "bg-amber-500 shadow-amber-500/50" },
  { label: "Fuchsia", value: "bg-fuchsia-500 shadow-fuchsia-500/50" },
] as const;
