"use client";

import { motion } from "framer-motion";

interface TimelineBadgeProps {
  badge: string;
  className?: string;
}

export function TimelineBadge({ badge, className = "" }: TimelineBadgeProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex shrink-0 items-center rounded-full border border-white/[0.1] bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-sm ${className}`}
    >
      {badge}
    </motion.span>
  );
}
