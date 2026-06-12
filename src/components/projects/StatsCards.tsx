"use client";

import { motion } from "framer-motion";
import { FolderKanban, Monitor, Rocket } from "lucide-react";
import { fadeUp } from "@/lib/animations";
const iconMap = {
  folder: FolderKanban,
  monitor: Monitor,
  rocket: Rocket,
};

const accentMap = {
  folder: "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20",
  monitor: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
  rocket: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
};

export function StatsCards({
  stats,
}: {
  stats: { label: string; icon: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? FolderKanban;
        const accent = accentMap[stat.icon as keyof typeof accentMap] ?? accentMap.folder;

        return (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`flex items-center gap-3 rounded-xl border bg-gradient-to-br px-5 py-3 backdrop-blur-md ${accent}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-white/80">{stat.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
