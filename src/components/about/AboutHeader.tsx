"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { defaultSections } from "@/lib/cms/defaults";

export function AboutHeader({ about = defaultSections.about }: { about?: Record<string, unknown> }) {
  const badge = (about.badge as string) ?? "ABOUT ME";
  const titlePrefix = (about.title_prefix as string) ?? "Building Digital Products That";
  const titleHighlight = (about.title_highlight as string) ?? "Solve Real Problems";
  const subtitle = (about.subtitle as string) ?? "";

  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center md:mb-20"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.span variants={fadeUp} className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {badge}
      </motion.span>

      <motion.h2 variants={fadeUp} className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
        {titlePrefix.includes("That") ? titlePrefix.replace(" That", "") : titlePrefix}
        <br />
        That{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          {titleHighlight}
        </span>
      </motion.h2>

      {subtitle && (
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-white/50 sm:text-lg">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
