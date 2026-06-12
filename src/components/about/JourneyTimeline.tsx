"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { journey as defaultJourney } from "@/lib/about-data";
import type { TimelineEntry } from "@/lib/about-data";

export function JourneyTimeline({ journey = defaultJourney }: { journey?: TimelineEntry[] }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="mb-8 text-lg font-bold text-white sm:text-xl">My Journey</h3>

      <motion.div
        className="relative"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* Animated timeline line */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px overflow-hidden sm:left-[13px]">
          <div className="h-full w-full bg-white/10" />
          <motion.div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-cyan-400 via-violet-500 to-emerald-400"
            initial={{ height: "0%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>

        <div className="space-y-8">
          {journey.map((entry, i) => (
            <motion.div
              key={entry.year}
              variants={fadeUp}
              className="relative flex gap-5 pl-0 sm:gap-6"
            >
              {/* Glowing node */}
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <motion.div
                  className={`flex h-6 w-6 items-center justify-center rounded-full sm:h-7 sm:w-7 ${entry.nodeColor} shadow-lg`}
                  animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0)", "0 0 12px 2px rgba(255,255,255,0.15)", "0 0 0 0 rgba(255,255,255,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  <div className="h-2 w-2 rounded-full bg-white sm:h-2.5 sm:w-2.5" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="group min-w-0 flex-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.04] sm:p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400">{entry.year}</span>
                    <h4 className="mt-0.5 text-sm font-bold text-white sm:text-base">
                      {entry.title}
                    </h4>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] opacity-60 transition-opacity group-hover:opacity-100">
                    <entry.icon className="h-4 w-4 text-white/60" />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-white/45 sm:text-sm">
                  {entry.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
