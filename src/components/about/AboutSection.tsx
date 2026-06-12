"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BackgroundEffects } from "./BackgroundEffects";
import { AboutHeader } from "./AboutHeader";
import { ProfileCard } from "./ProfileCard";
import { WhoIAmCard } from "./WhoIAmCard";
import { StatisticsCards } from "./StatisticsCards";
import { JourneyTimeline } from "./JourneyTimeline";
import { SkillsGrid } from "./SkillsGrid";
import type { CvFile, HeroSettings } from "@/types/cms";
import { defaultHero, defaultSections } from "@/lib/cms/defaults";

export function AboutSection({
  about = defaultSections.about,
  hero = defaultHero,
  activeCv = null,
}: {
  about?: Record<string, unknown>;
  hero?: HeroSettings;
  activeCv?: CvFile | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <BackgroundEffects />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <AboutHeader about={about} />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="flex flex-col gap-6">
            <ProfileCard name={hero.profile_name} title={hero.profile_title} />
            <WhoIAmCard whoIAm={about.who_i_am as Record<string, unknown>} cvUrl={activeCv?.public_url} />
          </div>

          <div className="flex flex-col gap-6">
            <StatisticsCards />
            <JourneyTimeline />
          </div>
        </div>

        <SkillsGrid />
      </div>
    </section>
  );
}
