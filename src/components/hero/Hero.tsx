"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { Navbar } from "./Navbar";
import { HeroContent } from "./HeroContent";
import { HeroShowcase } from "./HeroShowcase";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import type { AppRecord, HeroSettings, ProjectRecord } from "@/types/cms";
import { defaultHero } from "@/lib/cms/defaults";

export function Hero({
  hero = defaultHero,
  featuredProject,
  downloadApp,
}: {
  hero?: HeroSettings;
  featuredProject?: ProjectRecord | null;
  downloadApp?: AppRecord | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      <HeroBackground />
      <Navbar />

      <motion.div style={{ opacity }} className="relative z-10">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-24 pt-28 lg:px-8 lg:pb-20 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <motion.div style={{ y: contentY }}>
              <HeroContent hero={hero} downloadApp={downloadApp} />
            </motion.div>

            <motion.div style={{ y: showcaseY }} className="relative">
              {featuredProject ? <HeroShowcase project={featuredProject} /> : null}
            </motion.div>
          </div>
        </div>

        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
