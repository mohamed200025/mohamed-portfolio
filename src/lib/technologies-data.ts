import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Code2,
  Link,
  Mail,
  MessageCircle,
  Monitor,
  Server,
  Smartphone,
} from "lucide-react";

export interface OrbitalTech {
  name: string;
  color: string;
  glow: string;
  abbr: string;
}

export const orbitalTechnologies: OrbitalTech[] = [
  { name: "Flutter", color: "from-sky-400 to-blue-500", glow: "shadow-sky-500/40", abbr: "F" },
  { name: "React", color: "from-cyan-400 to-blue-400", glow: "shadow-cyan-500/40", abbr: "R" },
  { name: "Next.js", color: "from-white to-gray-300", glow: "shadow-white/20", abbr: "N" },
  { name: "Node.js", color: "from-green-400 to-emerald-500", glow: "shadow-green-500/40", abbr: "Nd" },
  { name: "TypeScript", color: "from-blue-400 to-blue-600", glow: "shadow-blue-500/40", abbr: "TS" },
  { name: "Firebase", color: "from-amber-400 to-orange-500", glow: "shadow-amber-500/40", abbr: "Fb" },
  { name: "Tailwind", color: "from-cyan-400 to-teal-500", glow: "shadow-cyan-500/40", abbr: "Tw" },
];

export interface TechCategory {
  title: string;
  icon: LucideIcon;
  accent: string;
  border: string;
  items: { name: string; abbr: string; color: string }[];
}

export const techCategories: TechCategory[] = [
  {
    title: "Frontend",
    icon: Monitor,
    accent: "from-blue-500/15 to-cyan-500/5",
    border: "group-hover:border-blue-500/30",
    items: [
      { name: "Next.js", abbr: "N", color: "bg-white/10 text-white" },
      { name: "React", abbr: "R", color: "bg-cyan-500/20 text-cyan-400" },
      { name: "TypeScript", abbr: "TS", color: "bg-blue-500/20 text-blue-400" },
      { name: "Tailwind CSS", abbr: "Tw", color: "bg-teal-500/20 text-teal-400" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    accent: "from-violet-500/15 to-purple-500/5",
    border: "group-hover:border-violet-500/30",
    items: [
      { name: "Node.js", abbr: "Nd", color: "bg-green-500/20 text-green-400" },
      { name: "Express.js", abbr: "Ex", color: "bg-gray-500/20 text-gray-300" },
      { name: "REST APIs", abbr: "API", color: "bg-blue-500/20 text-blue-400" },
      { name: "Authentication", abbr: "Auth", color: "bg-violet-500/20 text-violet-400" },
    ],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    accent: "from-sky-500/15 to-blue-500/5",
    border: "group-hover:border-sky-500/30",
    items: [
      { name: "Flutter", abbr: "F", color: "bg-sky-500/20 text-sky-400" },
      { name: "Dart", abbr: "D", color: "bg-blue-500/20 text-blue-400" },
      { name: "Android", abbr: "A", color: "bg-emerald-500/20 text-emerald-400" },
      { name: "iOS", abbr: "iOS", color: "bg-gray-500/20 text-gray-300" },
    ],
  },
  {
    title: "Database & Cloud",
    icon: Cloud,
    accent: "from-amber-500/15 to-orange-500/5",
    border: "group-hover:border-amber-500/30",
    items: [
      { name: "Firebase", abbr: "Fb", color: "bg-amber-500/20 text-amber-400" },
      { name: "Firestore", abbr: "Fs", color: "bg-orange-500/20 text-orange-400" },
      { name: "Supabase", abbr: "Sb", color: "bg-emerald-500/20 text-emerald-400" },
      { name: "Storage", abbr: "St", color: "bg-cyan-500/20 text-cyan-400" },
    ],
  },
];

export const tools = [
  { name: "Git", abbr: "Git", color: "text-orange-400" },
  { name: "GitHub", abbr: "GH", color: "text-white" },
  { name: "VS Code", abbr: "VS", color: "text-blue-400" },
  { name: "Cursor", abbr: "Cu", color: "text-violet-400" },
  { name: "Figma", abbr: "Fg", color: "text-fuchsia-400" },
  { name: "Postman", abbr: "Pm", color: "text-orange-400" },
  { name: "Vercel", abbr: "V", color: "text-white" },
];

export const contactMethods = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+213 XXX XXX XXX",
    sub: "Available 24/7",
    href: "https://wa.me/",
    icon: MessageCircle,
    color: "from-green-500/20 to-emerald-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "email",
    label: "Email",
    value: "contact@mohamedournani.com",
    sub: "I reply within 24h",
    href: "mailto:contact@mohamedournani.com",
    icon: Mail,
    color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "mohamed-ournani",
    sub: "Let's connect",
    href: "https://linkedin.com",
    icon: Link,
    color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "github",
    label: "GitHub",
    value: "mohamedournani",
    sub: "View my code",
    href: "https://github.com",
    icon: Code2,
    color: "from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/20",
  },
];

export const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Contact", href: "#contact" },
];
