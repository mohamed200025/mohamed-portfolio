"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ResolvedTimelineOption } from "./complexity-engine";

interface TimelineOptionCardProps {
  option: ResolvedTimelineOption;
  selected: boolean;
  onSelect: () => void;
  index: number;
}

export function TimelineOptionCard({ option, selected, onSelect, index }: TimelineOptionCardProps) {
  const Icon = option.icon;
  const isPremium = option.multiplier > 1;
  const isDiscount = option.multiplier < 1;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selected ? 1.02 : 1,
      }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: selected ? 1.01 : 0.98 }}
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative w-full rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-300 ${
        selected
          ? "border-cyan-400/60 bg-gradient-to-br from-cyan-500/[0.14] to-violet-600/[0.1] shadow-[0_0_40px_rgba(34,211,238,0.22)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
      }`}
    >
      {selected && (
        <>
          <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/30 via-blue-500/15 to-violet-500/25 opacity-90 blur-[2px]" />
          <span className="pointer-events-none absolute -inset-[3px] rounded-[18px] bg-gradient-to-r from-cyan-400/15 via-transparent to-violet-500/15 opacity-60 blur-md" />
        </>
      )}

      <div className="relative flex items-start gap-3.5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${option.iconGradient} transition-transform duration-300 ${
            selected ? "scale-105 shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "group-hover:scale-105"
          }`}
        >
          <Icon className={`h-5 w-5 ${selected ? "text-cyan-300" : "text-cyan-400/90"}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-white">{option.title}</h3>
              <motion.p
                key={option.duration}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="mt-0.5 text-[12px] font-semibold text-cyan-300/90"
              >
                {option.duration}
              </motion.p>
            </div>
            {selected && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/25 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
              >
                <Check className="h-3.5 w-3.5 text-cyan-300" strokeWidth={2.5} />
              </motion.span>
            )}
          </div>

          <p className="mt-1.5 text-[12px] leading-snug text-white/45">{option.description}</p>

          <span
            className={`mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
              isPremium
                ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-400/20"
                : isDiscount
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/20"
                  : "bg-white/[0.05] text-white/40 ring-1 ring-white/[0.06]"
            }`}
          >
            {option.adjustmentLabel}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
