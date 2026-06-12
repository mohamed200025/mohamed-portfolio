import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  Code2,
  CreditCard,
  Factory,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Monitor,
  Rocket,
  Search,
  ShoppingCart,
  Smartphone,
  Sparkles,
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
  Monitor,
  ShoppingCart,
  Layers,
  Sparkles,
  Calculator,
  CreditCard,
  Bell,
  Search,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Globe;
}
