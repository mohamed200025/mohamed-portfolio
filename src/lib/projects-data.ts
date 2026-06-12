import type { LucideIcon } from "lucide-react";
import { BookOpen, Factory } from "lucide-react";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  technologies: string[];
  primaryButton: { label: string; href: string; external?: boolean };
  secondaryButton: { label: string; href: string };
  featured?: boolean;
  icon: LucideIcon;
  accent: "cyan" | "blue";
}

export const projects: ProjectData[] = [
  {
    id: "eduvera",
    title: "Eduvera",
    category: "Educational Platform",
    description:
      "A complete educational ecosystem built with Flutter and Firebase featuring course management, authentication, student engagement tools, admin dashboards and mobile learning experiences.",
    features: [
      "Flutter Mobile Application",
      "Firebase Backend",
      "Authentication System",
      "Community Platform",
      "Course Management",
      "Admin Dashboard",
    ],
    technologies: ["Flutter", "Firebase", "Node.js"],
    primaryButton: { label: "View Project", href: "#" },
    secondaryButton: { label: "Case Study", href: "#" },
    featured: true,
    icon: BookOpen,
    accent: "cyan",
  },
  {
    id: "muhlentechnik",
    title: "Muhlentechnik",
    category: "Corporate Website & CMS",
    description:
      "Professional multilingual corporate website designed for industrial and agricultural international business operations.",
    features: [
      "Responsive Design",
      "CMS Integration",
      "SEO Optimized",
      "Professional UI",
      "Multi-section Architecture",
    ],
    technologies: ["Next.js", "CMS", "Responsive"],
    primaryButton: { label: "Visit Website", href: "#", external: true },
    secondaryButton: { label: "Project Details", href: "#" },
    icon: Factory,
    accent: "blue",
  },
];

export const projectStats = [
  { label: "2+ Projects Completed", icon: "folder" as const },
  { label: "100% Responsive Design", icon: "monitor" as const },
  { label: "Modern Tech Stack", icon: "rocket" as const },
];
