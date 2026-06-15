"use client";

import { motion } from "framer-motion";

export type MobileSegment = "apps" | "projects" | "services";

interface MobileSegmentTabsProps {
  active: MobileSegment;
  onChange: (segment: MobileSegment) => void;
}

const tabs: { id: MobileSegment; label: string }[] = [
  { id: "apps", label: "Apps" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
];

export function MobileSegmentTabs({ active, onChange }: MobileSegmentTabsProps) {
  return (
    <nav className="px-5 pb-5" aria-label="Content sections">
      <div className="relative flex rounded-2xl border border-white/[0.09] bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="relative z-10 min-h-[44px] flex-1 rounded-xl text-[13px] font-semibold tracking-wide transition-colors"
              aria-current={isActive ? "true" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-segment-indicator"
                  className="absolute inset-0 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20 shadow-[0_0_20px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/38"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
