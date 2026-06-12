import {
  BookOpen,
  Factory,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Factory,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Smartphone,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}
