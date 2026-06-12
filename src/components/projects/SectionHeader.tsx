"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { StatsCards } from "./StatsCards";
import { defaultSections } from "@/lib/cms/defaults";

interface SectionHeaderProps {
  header?: Record<string, unknown>;
  stats: { label: string; icon: string }[];
}

export function SectionHeader({
  header = defaultSections.projects_header,
  stats,
}: SectionHeaderProps) {
  const badge = (header.badge as string) ?? "MY WORK";
  const title = (header.title as string) ?? "Featured Projects";
  const subtitle = (header.subtitle as string) ?? "";

  return (
    <motion.div
      className="mx-auto mb-16 max-w-3xl text-center md:mb-20"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.span
        variants={fadeUp}
        className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
      >
        {badge}
      </motion.span>

      <motion.h2
        variants={fadeUp}
        className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {title.includes("Projects") ? (
          <>
            {title.replace("Projects", "").trim()}{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Projects
            </span>
          </>
        ) : (
          title
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mb-10 text-base leading-relaxed text-white/50 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div variants={fadeUp}>
        <StatsCards stats={stats} />
      </motion.div>
    </motion.div>
  );
}
