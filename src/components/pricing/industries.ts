import {
  Bot,
  Building2,
  CircleEllipsis,
  Clapperboard,
  Dumbbell,
  Factory,
  GraduationCap,
  HardHat,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Plane,
  ShoppingCart,
  Sparkles,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { PricingIndustryId } from "./types";

export interface PricingIndustry {
  id: PricingIndustryId;
  title: string;
  icon: LucideIcon;
  iconGradient: string;
}

export const PRICING_INDUSTRIES: PricingIndustry[] = [
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    iconGradient: "from-cyan-500/25 to-blue-600/20",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    icon: HeartPulse,
    iconGradient: "from-rose-500/25 to-pink-600/20",
  },
  {
    id: "restaurant-food",
    title: "Restaurant & Food",
    icon: UtensilsCrossed,
    iconGradient: "from-orange-500/25 to-amber-600/20",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: Building2,
    iconGradient: "from-violet-500/25 to-purple-600/20",
  },
  {
    id: "finance-banking",
    title: "Finance & Banking",
    icon: Landmark,
    iconGradient: "from-emerald-500/25 to-teal-600/20",
  },
  {
    id: "e-commerce",
    title: "E-commerce",
    icon: ShoppingCart,
    iconGradient: "from-amber-500/25 to-yellow-600/20",
  },
  {
    id: "travel-tourism",
    title: "Travel & Tourism",
    icon: Plane,
    iconGradient: "from-sky-500/25 to-blue-600/20",
  },
  {
    id: "logistics",
    title: "Logistics",
    icon: Truck,
    iconGradient: "from-blue-500/25 to-indigo-600/20",
  },
  {
    id: "sports-fitness",
    title: "Sports & Fitness",
    icon: Dumbbell,
    iconGradient: "from-lime-500/25 to-green-600/20",
  },
  {
    id: "beauty-cosmetics",
    title: "Beauty & Cosmetics",
    icon: Sparkles,
    iconGradient: "from-pink-500/25 to-fuchsia-600/20",
  },
  {
    id: "construction",
    title: "Construction",
    icon: HardHat,
    iconGradient: "from-yellow-500/25 to-orange-600/20",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    icon: Factory,
    iconGradient: "from-slate-500/25 to-zinc-600/20",
  },
  {
    id: "media-content",
    title: "Media & Content",
    icon: Clapperboard,
    iconGradient: "from-violet-500/25 to-indigo-600/20",
  },
  {
    id: "ai-technology",
    title: "AI & Technology",
    icon: Bot,
    iconGradient: "from-cyan-500/20 to-violet-600/25",
  },
  {
    id: "ngo-nonprofit",
    title: "NGO / Non-profit",
    icon: HeartHandshake,
    iconGradient: "from-teal-500/25 to-cyan-600/20",
  },
  {
    id: "other",
    title: "Other",
    icon: CircleEllipsis,
    iconGradient: "from-white/10 to-white/5",
  },
];
