import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Code2,
  Database,
  Globe,
  GraduationCap,
  Settings,
  Smartphone,
  User,
  Users,
} from "lucide-react";

export const statistics = [
  {
    value: 10,
    suffix: "+",
    label: "Projects Completed",
    tag: "Delivered with quality",
    color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    value: 6,
    suffix: "+",
    label: "Technologies",
    tag: "Modern stack mastery",
    color: "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    value: 4,
    suffix: "+",
    label: "Platforms Built",
    tag: "End-to-end solutions",
    color: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    value: 3,
    suffix: "+",
    label: "Countries Served",
    tag: "International clients",
    color: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 border-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
  },
] as const;

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  nodeColor: string;
}

export const journey: TimelineEntry[] = [
  {
    year: "2023",
    title: "Bioanalytical Analyst",
    description:
      "Worked in the pharmaceutical and bioequivalence sector developing analytical, laboratory and problem-solving expertise.",
    icon: Building2,
    nodeColor: "bg-blue-500 shadow-blue-500/50",
  },
  {
    year: "2024",
    title: "Eduvera Development",
    description:
      "Designed and developed Eduvera, an educational platform featuring mobile applications, admin dashboards and community tools.",
    icon: GraduationCap,
    nodeColor: "bg-violet-500 shadow-violet-500/50",
  },
  {
    year: "2025",
    title: "Full Stack Development",
    description:
      "Expanded into full stack web development, CMS solutions and scalable business platforms.",
    icon: Code2,
    nodeColor: "bg-cyan-500 shadow-cyan-500/50",
  },
  {
    year: "2026",
    title: "Freelance & Digital Solutions",
    description:
      "Helping schools, training centers and businesses build powerful digital products.",
    icon: User,
    nodeColor: "bg-emerald-500 shadow-emerald-500/50",
  },
];

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
}

export const services: Service[] = [
  {
    title: "Mobile Applications",
    description:
      "Flutter-based Android and iOS applications with modern UI and excellent performance.",
    icon: Smartphone,
    gradient: "from-blue-500/20 to-blue-600/10",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    title: "Web Development",
    description:
      "Responsive websites built using modern frameworks and best practices.",
    icon: Globe,
    gradient: "from-cyan-500/20 to-cyan-600/10",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    title: "CMS Systems",
    description:
      "Custom content management systems designed for easy administration.",
    icon: Settings,
    gradient: "from-violet-500/20 to-violet-600/10",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    title: "Admin Dashboards",
    description:
      "Powerful dashboards with analytics, reporting and management tools.",
    icon: BarChart3,
    gradient: "from-blue-500/20 to-indigo-600/10",
    glow: "group-hover:shadow-indigo-500/20",
  },
  {
    title: "Firebase & APIs",
    description:
      "Authentication, databases, cloud functions and API integrations.",
    icon: Database,
    gradient: "from-amber-500/20 to-orange-600/10",
    glow: "group-hover:shadow-amber-500/20",
  },
  {
    title: "Educational Platforms",
    description:
      "Learning systems, student portals, online courses and community platforms.",
    icon: Users,
    gradient: "from-fuchsia-500/20 to-purple-600/10",
    glow: "group-hover:shadow-fuchsia-500/20",
  },
];
