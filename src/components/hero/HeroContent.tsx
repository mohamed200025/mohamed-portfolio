"use client";

import { motion } from "framer-motion";
import { Briefcase, Download, MessageCircle } from "lucide-react";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";
import { TechStack } from "./TechStack";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { AppRecord, HeroSettings } from "@/types/cms";
import { appDetailsPath } from "@/lib/cms/app-utils";
import { defaultHero } from "@/lib/cms/defaults";

export function HeroContent({
  hero = defaultHero,
  downloadApp,
}: {
  hero?: HeroSettings;
  downloadApp?: AppRecord | null;
}) {
  return (
    <motion.div
      className="flex flex-col items-start"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeUp}
        className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-sm text-white/70">{hero.status_badge}</span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
      >
        {hero.headline_prefix}{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
          {hero.headline_highlight}
        </span>
      </motion.h1>

      <motion.p variants={fadeUp} className="mb-4 text-lg sm:text-xl lg:text-2xl">
        <span className="text-white/60">{hero.subheadline_prefix} </span>
        <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text font-semibold text-transparent">
          {hero.subheadline_highlight}
        </span>
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mb-8 max-w-lg text-base leading-relaxed text-white/50 sm:text-lg"
      >
        {hero.description}
      </motion.p>

      <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-4">
        <ShimmerButton>
          <MagneticButton href={hero.primary_cta_href} variant="primary">
            <Briefcase className="h-4 w-4" />
            {hero.primary_cta_text}
          </MagneticButton>
        </ShimmerButton>
        <MagneticButton href={hero.secondary_cta_href} variant="secondary">
          <MessageCircle className="h-4 w-4" />
          {hero.secondary_cta_text}
        </MagneticButton>
        {downloadApp && (
          <MagneticButton href={appDetailsPath(downloadApp.slug)} variant="secondary">
            <Download className="h-4 w-4" />
            Download App
          </MagneticButton>
        )}
      </motion.div>

      <motion.div variants={fadeUp}>
        <TechStack items={hero.tech_stack} />
      </motion.div>
    </motion.div>
  );
}
