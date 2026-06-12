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
import type { AboutSettings, AboutStatistic, CvFile, JourneyEntry } from "@/types/cms";
import { defaultAbout, defaultAboutStatistics, defaultJourney } from "@/lib/cms/defaults";

export function AboutSection({
  about = defaultAbout,
  aboutStatistics = defaultAboutStatistics,
  journey = defaultJourney,
  activeCv = null,
}: {
  about?: AboutSettings;
  aboutStatistics?: AboutStatistic[];
  journey?: JourneyEntry[];
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
            <ProfileCard
              name={about.name}
              title={about.job_title}
              statusBadge={about.status_badge}
              photoUrl={about.profile_photo_url}
            />
            <WhoIAmCard
              title={about.who_i_am_title}
              paragraphs={about.who_i_am_paragraphs}
              cvUrl={activeCv?.public_url}
            />
          </div>

          <div className="flex flex-col gap-6">
            <StatisticsCards statistics={aboutStatistics} />
            <JourneyTimeline journey={journey} />
          </div>
        </div>

        <SkillsGrid />
      </div>
    </section>
  );
}
