"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { defaultSections } from "@/lib/cms/defaults";

export function TechnologiesHeader({
  technologies = defaultSections.technologies,
}: {
  technologies?: Record<string, unknown>;
}) {
  const badge = (technologies.badge as string) ?? "TECHNOLOGIES";
  const titlePrefix = (technologies.title_prefix as string) ?? "Technologies I Use To Build";
  const titleHighlight = (technologies.title_highlight as string) ?? "Modern Products";
  const subtitle = (technologies.subtitle as string) ?? "";
  return (
    <motion.div
      className="mx-auto mb-14 max-w-3xl text-center md:mb-20"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.span
        variants={fadeUp}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
      >
        <Zap className="h-3.5 w-3.5" />
        {badge}
      </motion.span>

      <motion.h2
        variants={fadeUp}
        className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {titlePrefix}{" "}
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
