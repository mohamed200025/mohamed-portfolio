"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { AboutSettings } from "@/types/cms";
import { defaultAbout } from "@/lib/cms/defaults";

export function AboutHeader({ about = defaultAbout }: { about?: AboutSettings }) {
  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center md:mb-20"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.span variants={fadeUp} className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {about.section_badge}
      </motion.span>

      <motion.h2 variants={fadeUp} className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
        {about.title_prefix.includes("That") ? about.title_prefix.replace(" That", "") : about.title_prefix}
        <br />
        That{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          {about.title_highlight}
        </span>
      </motion.h2>

      {about.short_bio && (
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-white/50 sm:text-lg">
          {about.short_bio}
        </motion.p>
      )}
    </motion.div>
  );
}
