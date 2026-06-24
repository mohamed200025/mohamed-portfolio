import { Calendar, Clock, Rocket, Zap, type LucideIcon } from "lucide-react";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import { getTimelineMultiplier as getCatalogTimelineMultiplier } from "@/lib/pricing/catalog";

export type WizardTimelineId = "flexible" | "standard" | "fast" | "urgent";

export interface WizardTimelineOption {
  id: WizardTimelineId;
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  iconGradient: string;
}

export const WIZARD_TIMELINE_OPTIONS: WizardTimelineOption[] = [
  {
    id: "flexible",
    title: "Flexible Timeline",
    description: "No rush, best value for planned projects",
    badge: "🌱 Flexible",
    icon: Calendar,
    iconGradient: "from-emerald-500/25 to-teal-600/20",
  },
  {
    id: "standard",
    title: "Standard Delivery",
    description: "Balanced schedule for most projects",
    badge: "📅 Standard",
    icon: Clock,
    iconGradient: "from-cyan-500/25 to-blue-600/20",
  },
  {
    id: "fast",
    title: "Fast Delivery",
    description: "Priority development",
    badge: "⚡ Fast",
    icon: Zap,
    iconGradient: "from-amber-500/25 to-orange-600/20",
  },
  {
    id: "urgent",
    title: "Urgent Delivery",
    description: "Maximum priority",
    badge: "🚀 Urgent",
    icon: Rocket,
    iconGradient: "from-rose-500/25 to-violet-600/20",
  },
];

export const DEFAULT_WIZARD_TIMELINE: WizardTimelineId = "standard";

export function getTimelineMultiplier(catalog: PricingCatalog, id: WizardTimelineId): number {
  return getCatalogTimelineMultiplier(catalog, id);
}

export function getTimelineOption(id: WizardTimelineId): WizardTimelineOption {
  return WIZARD_TIMELINE_OPTIONS.find((t) => t.id === id) ?? WIZARD_TIMELINE_OPTIONS[1];
}

export function mergeTimelineFromCatalog(
  catalog: PricingCatalog,
  option: WizardTimelineOption,
): WizardTimelineOption {
  const row = catalog.timelines.find((t) => t.id === option.id);
  if (!row) return option;
  return {
    ...option,
    title: row.name || option.title,
    description: row.description || option.description,
    badge: row.badge || option.badge,
  };
}
