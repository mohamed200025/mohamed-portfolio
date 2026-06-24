"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { PricingCategory } from "./categories";

interface PricingCategoryCardProps {
  category: PricingCategory;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

export function PricingCategoryCard({
  category,
  selected,
  onSelect,
  index,
}: PricingCategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-300 ${
        selected
          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/[0.12] to-violet-600/[0.08] shadow-[0_0_30px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
      }`}
      aria-pressed={selected}
    >
      {selected && (
        <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/10 to-violet-500/20 opacity-80 blur-sm" />
      )}

      <div className="relative flex items-start gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.iconGradient} shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon
            className={`h-5 w-5 transition-colors duration-300 ${
              selected ? "text-cyan-300" : "text-cyan-400/90"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-white">{category.title}</h3>
            {selected && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/25">
                <Check className="h-3 w-3 text-cyan-400" />
              </span>
            )}
          </div>
          <ul className="mt-2 space-y-1">
            {category.examples.map((example) => (
              <li key={example} className="flex items-center gap-1.5 text-[11px] text-white/45">
                <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-400/50" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.button>
  );
}
