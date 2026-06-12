"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import type { TechCategory } from "@/lib/technologies-data";

interface TechCategoryCardProps {
  category: TechCategory;
  index?: number;
}

export function TechCategoryCard({ category }: TechCategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      variants={fadeUp}
      className={`group relative z-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 ${category.border} hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${category.accent}`}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
            <Icon className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/80">
            {category.title}
          </h3>
        </div>

        <ul className="space-y-2">
          {category.items.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 transition-colors group-hover:border-white/[0.08]"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${item.color}`}
              >
                {item.abbr}
              </div>
              <span className="text-sm text-white/70">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
