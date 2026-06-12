"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  FileText,
  Star,
} from "lucide-react";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";
import { fadeUp } from "@/lib/animations";
import type { ProjectRecord } from "@/types/cms";
import { getIcon } from "@/lib/icons";
import { hasUrl, projectDetailsPath } from "@/lib/cms/project-utils";

function resolveWebsiteUrl(project: ProjectRecord): string {
  const fromCms = project.website_url?.trim();
  if (fromCms) return fromCms;
  const legacy = project.primary_button_href?.trim();
  if (legacy && legacy !== "#") return legacy;
  return "";
}

interface ProjectCardProps {
  project: ProjectRecord;
  reversed?: boolean;
  showcase: React.ReactNode;
  index: number;
}

const accentStyles = {
  cyan: {
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    icon: "from-cyan-500/20 to-blue-500/20 text-cyan-400",
    category: "text-violet-400",
    glow: "from-cyan-500/10 via-blue-500/5 to-violet-500/10",
    border: "hover:border-cyan-500/20",
  },
  blue: {
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    icon: "from-blue-500/20 to-cyan-500/20 text-blue-400",
    category: "text-violet-400",
    glow: "from-blue-500/10 via-cyan-500/5 to-violet-500/10",
    border: "hover:border-blue-500/20",
  },
};

export function ProjectCard({
  project,
  reversed = false,
  showcase,
  index,
}: ProjectCardProps) {
  const styles = accentStyles[project.accent];
  const Icon = getIcon(project.icon_name);
  const websiteUrl = resolveWebsiteUrl(project);
  const showWebsite = hasUrl(websiteUrl);
  const detailsPath = projectDetailsPath(project.slug);

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-colors duration-500 sm:p-8 lg:p-10 ${styles.border}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Card glow */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${styles.glow}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent" />

      <div
        className={`relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${
          reversed ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
        }`}
      >
        {/* Content */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col"
        >
          {project.featured && (
            <motion.div
              variants={fadeUp}
              className={`mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${styles.badge}`}
            >
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-3 w-3 fill-current" />
              </motion.span>
              Featured Project
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${styles.icon}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h3>
              <p className={`text-sm font-medium ${styles.category}`}>
                {project.category}
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mb-6 max-w-lg text-base leading-relaxed text-white/50"
          >
            {project.description}
          </motion.p>

          <motion.div variants={fadeUp} className="mb-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {project.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                  <Check className="h-2.5 w-2.5 text-cyan-400" />
                </div>
                <span className="text-sm text-white/70">{feature}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <motion.span
                key={tech}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: "rgba(34,211,238,0.3)" }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap"
          >
            {showWebsite && (
              <ShimmerButton className="w-full sm:w-auto">
                <MagneticButton
                  href={websiteUrl}
                  variant="primary"
                  className="w-full !px-5 !py-3 sm:w-auto"
                  external
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </MagneticButton>
              </ShimmerButton>
            )}
            <MagneticButton
              href={detailsPath}
              variant="secondary"
              className="w-full !px-5 !py-3 sm:w-auto"
            >
              <FileText className="h-4 w-4" />
              Project Details
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Showcase */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {showcase}
        </motion.div>
      </div>
    </motion.article>
  );
}
