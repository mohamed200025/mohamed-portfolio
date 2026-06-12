import {
  BookOpen,
  Briefcase,
  Building2,
  Code2,
  Factory,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Rocket,
  Smartphone,
  User,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Factory,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Smartphone,
  Building2,
  Code2,
  User,
  Briefcase,
  Rocket,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}
