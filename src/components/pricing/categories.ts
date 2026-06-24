import {
  Code2,
  Globe,
  LayoutDashboard,
  Layers,
  PenTool,
  ShoppingBag,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { PricingCategoryId } from "./types";

export interface PricingCategory {
  id: PricingCategoryId;
  title: string;
  examples: string[];
  icon: LucideIcon;
  iconGradient: string;
}

export const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: "website",
    title: "Website",
    examples: ["Business websites", "Landing pages", "Corporate websites"],
    icon: Globe,
    iconGradient: "from-cyan-500/25 to-blue-600/20",
  },
  {
    id: "web-application",
    title: "Web Application",
    examples: ["SaaS platforms", "Dashboards", "CRM systems", "LMS platforms"],
    icon: Layers,
    iconGradient: "from-violet-500/25 to-purple-600/20",
  },
  {
    id: "mobile-application",
    title: "Mobile Application",
    examples: ["Android apps", "iOS apps", "Flutter apps"],
    icon: Smartphone,
    iconGradient: "from-emerald-500/25 to-cyan-500/20",
  },
  {
    id: "e-commerce",
    title: "E-Commerce Store",
    examples: ["Online stores", "Marketplaces", "Digital products"],
    icon: ShoppingBag,
    iconGradient: "from-amber-500/25 to-orange-500/20",
  },
  {
    id: "admin-dashboard",
    title: "Admin Dashboard",
    examples: ["Internal management systems", "Analytics dashboards"],
    icon: LayoutDashboard,
    iconGradient: "from-blue-500/25 to-indigo-600/20",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    examples: ["Figma design", "Prototypes", "Design systems"],
    icon: PenTool,
    iconGradient: "from-pink-500/25 to-violet-500/20",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    examples: ["Tailored business solutions", "Automation tools"],
    icon: Code2,
    iconGradient: "from-cyan-500/20 to-violet-600/25",
  },
];
