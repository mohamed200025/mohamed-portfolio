"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TechnologiesBackground } from "./TechnologiesBackground";
import { TechnologiesHeader } from "./TechnologiesHeader";
import { OrbitSystem } from "./OrbitSystem";
import { TechCategoryCard } from "./TechCategoryCard";
import { ToolsShowcase } from "./ToolsShowcase";
import { techCategories as defaultCategories } from "@/lib/technologies-data";
import { staggerContainer } from "@/lib/animations";
import { defaultSections } from "@/lib/cms/defaults";
interface TechnologiesSectionProps {
  technologies?: Record<string, unknown>;
}

export function TechnologiesSection({
  technologies = defaultSections.technologies,
}: TechnologiesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const categories = defaultCategories;
  const [frontend, backend, mobile, database] = categories;
  const tools = technologies.tools as Parameters<typeof ToolsShowcase>[0]["tools"];

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <TechnologiesBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <TechnologiesHeader technologies={technologies} />

        <div className="relative grid items-center gap-8 overflow-visible lg:grid-cols-[1fr_auto_1fr] lg:gap-6 xl:gap-10">
          <motion.div
            className="relative z-10 flex flex-col gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {frontend && <TechCategoryCard category={frontend} />}
            {mobile && <TechCategoryCard category={mobile} />}
          </motion.div>

          <div className="relative z-20 order-first overflow-visible lg:order-none">
            <OrbitSystem />
          </div>

          <motion.div
            className="relative z-10 flex flex-col gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {backend && <TechCategoryCard category={backend} />}
            {database && <TechCategoryCard category={database} />}
          </motion.div>
        </div>

        <ToolsShowcase tools={tools} />
      </div>
    </section>
  );
}
