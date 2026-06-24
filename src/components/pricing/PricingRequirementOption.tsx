"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PricingRequirementOptionProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  index: number;
}

export function PricingRequirementOption({
  label,
  selected,
  onToggle,
  index,
}: PricingRequirementOptionProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      aria-pressed={selected}
      className={`group relative flex min-h-[44px] items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left backdrop-blur-xl transition-all duration-300 ${
        selected
          ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/[0.12] to-violet-600/[0.08] shadow-[0_0_24px_rgba(34,211,238,0.15)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]"
      }`}
    >
      {selected && (
        <span className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-cyan-400/15 via-blue-500/8 to-violet-500/15 opacity-80 blur-sm" />
      )}

      <span
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ${
          selected
            ? "border-cyan-400/60 bg-cyan-500/25"
            : "border-white/15 bg-white/[0.04] group-hover:border-white/25"
        }`}
      >
        {selected && <Check className="h-3 w-3 text-cyan-300" strokeWidth={3} />}
      </span>

      <span
        className={`relative text-[13px] font-medium leading-snug transition-colors duration-300 ${
          selected ? "text-white" : "text-white/65 group-hover:text-white/80"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
