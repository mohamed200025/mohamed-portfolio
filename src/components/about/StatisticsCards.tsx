"use client";

import { motion } from "framer-motion";
import { FolderKanban, Globe2, Layers, Wrench } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { fadeUp } from "@/lib/animations";
import { statistics as defaultStatistics } from "@/lib/about-data";

const icons = [FolderKanban, Wrench, Layers, Globe2];

type StatItem = (typeof defaultStatistics)[number];

export function StatisticsCards({ statistics = defaultStatistics }: { statistics?: readonly StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {statistics.map((stat, i) => {
        const Icon = icons[i];

        return (
          <motion.div
            key={stat.label}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md sm:p-5 ${stat.color}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            {/* Border glow on hover */}
            <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Floating particle accent */}
            <motion.div
              className="absolute right-3 top-3 h-1 w-1 rounded-full bg-white/30"
              animate={{ y: [0, -6, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>

              <p className="text-2xl font-bold text-white sm:text-3xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-0.5 text-[10px] text-white/40 sm:text-xs">
                {stat.tag}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
