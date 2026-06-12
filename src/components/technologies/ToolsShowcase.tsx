"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { tools as defaultTools } from "@/lib/technologies-data";

export function ToolsShowcase({ tools = defaultTools }: { tools?: typeof defaultTools }) {
  return (
    <motion.div
      className="mt-16 md:mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer}
    >
      <motion.div
        variants={fadeUp}
        className="mb-6 flex items-center justify-center gap-2"
      >
        <Terminal className="h-4 w-4 text-white/40" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Tools & Platforms
        </span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 backdrop-blur-md"
            animate={{ y: [0, -3, 0] }}
            transition={{
              y: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
            }}
            whileHover={{ scale: 1.08, y: -4 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 4 + i,
                ease: "easeInOut",
              }}
            />
            <div className="relative flex items-center gap-2">
              <span className={`text-xs font-bold ${tool.color}`}>{tool.abbr}</span>
              <span className="text-sm text-white/70">{tool.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
