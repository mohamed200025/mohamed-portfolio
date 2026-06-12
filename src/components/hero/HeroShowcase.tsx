"use client";

import { motion } from "framer-motion";
import type { ProjectRecord } from "@/types/cms";
import { resolveHeroShowcaseImages } from "@/lib/cms/hero-utils";
import { ProjectScreenshotShowcase } from "@/components/projects/ProjectScreenshotShowcase";
import { slideInRight } from "@/lib/animations";

interface HeroShowcaseProps {
  project: ProjectRecord;
}

export function HeroShowcase({ project }: HeroShowcaseProps) {
  const images = resolveHeroShowcaseImages(project);
  if (!images) return null;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[580px] lg:max-w-none"
      variants={slideInRight}
      initial="hidden"
      animate="visible"
    >
      <ProjectScreenshotShowcase
        desktopUrl={images.desktopUrl}
        mobileUrl={images.mobileUrl}
        alt={project.title}
        priority
        size="large"
      />
    </motion.div>
  );
}
