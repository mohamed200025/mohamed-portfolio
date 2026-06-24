"use client";

import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";

interface PricingIndustryCardProps {
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

export function PricingIndustryCard({
  title,
  icon: Icon,
  iconGradient,
  selected,
  onSelect,
  index,
}: PricingIndustryCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border p-3.5 text-left backdrop-blur-xl transition-all duration-300 ${
        selected
          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/[0.12] to-violet-600/[0.08] shadow-[0_0_30px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
      }`}
      aria-pressed={selected}
    >
      {selected && (
        <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/10 to-violet-500/20 opacity-80 blur-sm" />
      )}

      <div className="relative flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient} shadow-[0_0_16px_rgba(6,182,212,0.08)] transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon
            className={`h-[18px] w-[18px] transition-colors duration-300 ${
              selected ? "text-cyan-300" : "text-cyan-400/90"
            }`}
          />
        </div>

        <h3 className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-white">{title}</h3>

        {selected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/25">
            <Check className="h-3 w-3 text-cyan-400" />
          </span>
        )}
      </div>
    </motion.button>
  );
}
