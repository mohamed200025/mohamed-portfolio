import {
  Activity,
  BarChart3,
  BookOpen,
  DollarSign,
  Globe,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  book: BookOpen,
  revenue: DollarSign,
  uptime: Shield,
  performance: Activity,
  globe: Globe,
  chart: BarChart3,
};

export function getStatIcon(name?: string): LucideIcon {
  return iconMap[name ?? "chart"] ?? BarChart3;
}
