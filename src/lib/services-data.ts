import type { LucideIcon } from "lucide-react";
import {
  Globe,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Palette,
  Rocket,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

export interface Service {
  number: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  accent: {
    gradient: string;
    glow: string;
    iconBg: string;
    border: string;
    number: string;
  };
}

export const services: Service[] = [
  {
    number: "01",
    title: "Mobile App Development",
    description:
      "Cross-platform mobile applications built with Flutter for Android and iOS with beautiful UI and powerful backend integration.",
    features: [
      "Flutter Development",
      "Android & iOS Apps",
      "Firebase Integration",
      "Authentication Systems",
      "Push Notifications",
    ],
    icon: Smartphone,
    accent: {
      gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
      glow: "group-hover:shadow-violet-500/20",
      iconBg: "from-violet-500/30 to-purple-600/20",
      border: "group-hover:border-violet-500/30",
      number: "text-violet-400/60",
    },
  },
  {
    number: "02",
    title: "Website Development",
    description:
      "Modern responsive websites designed to help businesses establish a powerful online presence and generate more leads.",
    features: [
      "Responsive Design",
      "SEO Optimized",
      "Business Websites",
      "Landing Pages",
      "Fast Performance",
    ],
    icon: Globe,
    accent: {
      gradient: "from-blue-500/15 via-cyan-500/10 to-transparent",
      glow: "group-hover:shadow-blue-500/20",
      iconBg: "from-blue-500/30 to-cyan-600/20",
      border: "group-hover:border-blue-500/30",
      number: "text-blue-400/60",
    },
  },
  {
    number: "03",
    title: "Custom CMS & Admin Dashboards",
    description:
      "Powerful content management systems and administration dashboards built for complete business control.",
    features: [
      "Content Management",
      "User Management",
      "Analytics & Reports",
      "Role Permissions",
      "Dashboard Systems",
    ],
    icon: LayoutDashboard,
    accent: {
      gradient: "from-cyan-500/15 via-teal-500/10 to-transparent",
      glow: "group-hover:shadow-cyan-500/20",
      iconBg: "from-cyan-500/30 to-teal-600/20",
      border: "group-hover:border-cyan-500/30",
      number: "text-cyan-400/60",
    },
  },
  {
    number: "04",
    title: "Educational Platforms",
    description:
      "Complete LMS and educational ecosystems for schools, training centers and online academies.",
    features: [
      "LMS Systems",
      "Student Portals",
      "Online Courses",
      "Community Features",
      "Exams & Certificates",
    ],
    icon: GraduationCap,
    accent: {
      gradient: "from-fuchsia-500/15 via-violet-500/10 to-transparent",
      glow: "group-hover:shadow-fuchsia-500/20",
      iconBg: "from-fuchsia-500/30 to-violet-600/20",
      border: "group-hover:border-fuchsia-500/30",
      number: "text-fuchsia-400/60",
    },
  },
];

export const benefits = [
  {
    title: "Fast Performance",
    description: "Optimized for speed",
    icon: Zap,
    color: "text-cyan-400",
    bg: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    title: "Modern UI/UX",
    description: "Beautiful interfaces",
    icon: Palette,
    color: "text-violet-400",
    bg: "from-violet-500/20 to-violet-600/10",
  },
  {
    title: "Fully Responsive",
    description: "All devices supported",
    icon: Smartphone,
    color: "text-blue-400",
    bg: "from-blue-500/20 to-blue-600/10",
  },
  {
    title: "Secure Architecture",
    description: "Enterprise-grade security",
    icon: Shield,
    color: "text-emerald-400",
    bg: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    title: "Scalable Solutions",
    description: "Built to grow with you",
    icon: Rocket,
    color: "text-fuchsia-400",
    bg: "from-fuchsia-500/20 to-fuchsia-600/10",
  },
  {
    title: "Long-Term Support",
    description: "Ongoing maintenance",
    icon: Headphones,
    color: "text-amber-400",
    bg: "from-amber-500/20 to-amber-600/10",
  },
];
