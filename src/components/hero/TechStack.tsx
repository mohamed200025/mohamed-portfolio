"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import type { TechStackItem } from "@/types/cms";
import { defaultHero } from "@/lib/cms/defaults";

const defaultTechnologies = [
  {
    name: "Flutter",
    iconColor: "text-sky-400",
    color: "from-sky-400 to-blue-500",
    glow: "group-hover:shadow-sky-500/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M14.314 0L2.3 12 6 15.7 21.684 0zm.014 11.072l-7.071 7.07 3.515 3.514L22.3 12l-3.686-3.686-3.3 3.3-1.014-1.015 3.3-3.3L14.328 11.072z" />
      </svg>
    ),
  },
  {
    name: "Firebase",
    iconColor: "text-amber-400",
    color: "from-amber-400 to-orange-500",
    glow: "group-hover:shadow-amber-500/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M5.27 2.27L12 22l2.19-6.19L22 12 5.27 2.27z" />
      </svg>
    ),
  },
  {
    name: "React",
    iconColor: "text-cyan-400",
    color: "from-cyan-400 to-blue-400",
    glow: "group-hover:shadow-cyan-500/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.4-1.05-.86-1.58-1.3-.82.28-1.63.43-2.38.46-.66.03-1.22-.04-1.64-.46m12.26 0c-.42.42-.98.49-1.64.46-.75-.03-1.56-.18-2.38-.46-.53.44-1.06.9-1.58 1.3 1.59 1.5 2.97 2.08 3.6 1.7M12 4.58c1.95 0 3.73.17 5.22.45C17.5 3.1 14.9 2 12 2S6.5 3.1 5.78 5.03c1.49-.28 3.27-.45 5.22-.45M4.74 7.17C4.3 8.2 4 9.55 4 11.07c0 1.52.3 2.87.74 3.9.46-.15.96-.33 1.47-.52-.3-.98-.48-2.07-.48-3.38 0-1.31.18-2.4.48-3.38-.51-.19-1.01-.37-1.47-.52m14.52 0c-.46.15-.96.33-1.47.52.3.98.48 2.07.48 3.38 0 1.31-.18 2.4-.48 3.38.51.19 1.01.37 1.47.52.44-1.03.74-2.38.74-3.9 0-1.52-.3-2.87-.74-3.9M12 22c2.9 0 5.46-.96 7.22-2.58-.8-.74-1.77-1.53-2.86-2.32-1.1.57-2.38.9-4.36.9s-3.26-.33-4.36-.9c-1.09.79-2.06 1.58-2.86 2.32C6.54 21.04 9.1 22 12 22" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    iconColor: "text-white",
    color: "from-white to-gray-300",
    glow: "group-hover:shadow-white/20",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.104 8.458c.005.028.01.057.017.086a24.08 24.08 0 0 0 6.697 13.026c.06.053.12.106.183.155a23.97 23.97 0 0 0 3.79 2.563c.217.117.433.229.654.339a23.903 23.903 0 0 0 5.618 1.97a23.94 23.94 0 0 0 6.302.533l.028-.001h.005c.176 0 .353-.002.53-.008l.038-.002.024-.003a25.089 25.089 0 0 0 4.024-.769.243.243 0 0 0 .157-.228V.245C24 .11 23.89 0 23.755 0H11.572zm3.064 20.672V9.345l7.264 10.603a18.67 18.67 0 0 1-7.264 1.724zM11.59.891h11.155v18.36a18.64 18.64 0 0 1-2.756-.737c-.228-.086-.445-.18-.655-.272l-7.744-4.577V.891zm-1.17 19.08c.286.02.573.037.86.05V.94a19.11 19.11 0 0 0-.86.052v19.98zM1.117 9.447a22.194 22.194 0 0 1 7.36-4.402v12.152a22.18 22.18 0 0 1-7.36-7.75z" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    iconColor: "text-green-400",
    color: "from-green-400 to-emerald-500",
    glow: "group-hover:shadow-green-500/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.151-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.921a.283.283 0 0 0-.137-.242l-8.791-5.072a.278.278 0 0 0-.271 0L3.075 6.68a.284.284 0 0 0-.139.241v10.15a.27.27 0 0 0 .139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675a1.856 1.856 0 0 1-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082a1.9 1.9 0 0 1 1.844 0l8.794 5.082c.57.329.924.944.924 1.603v10.15c0 .659-.354 1.265-.924 1.603l-8.794 5.078a1.86 1.86 0 0 1-.922.247z" />
      </svg>
    ),
  },
];

export function TechStack({ items = defaultHero.tech_stack }: { items?: TechStackItem[] }) {
  const technologies = items.map((item) => {
    const match = defaultTechnologies.find(
      (t) => t.name.toLowerCase() === item.name.toLowerCase()
    );
    return match ?? {
      name: item.name,
      iconColor: "text-cyan-400",
      color: "from-cyan-400 to-blue-500",
      glow: "group-hover:shadow-cyan-500/30",
      icon: <span className="text-sm font-bold">{item.name.slice(0, 2)}</span>,
    };
  });

  return (
    <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
      {technologies.map((tech, i) => (
        <motion.div
          key={tech.name}
          className={`group relative flex h-[72px] w-[72px] cursor-default flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-lg ${tech.glow}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          custom={i}
        >
          <div className={`${tech.iconColor} [&>svg]:drop-shadow-sm`}>{tech.icon}</div>
          <span className="mt-1 text-[10px] font-medium text-white/50">{tech.name}</span>

          {/* Hover glow ring */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-10`} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
