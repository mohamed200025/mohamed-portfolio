"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionBackground } from "./SectionBackground";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { ProjectShowcase } from "./ProjectShowcase";
import type { AppRecord, ProjectRecord } from "@/types/cms";
import { defaultSections } from "@/lib/cms/defaults";

interface ProjectsSectionProps {
  projects: ProjectRecord[];
  projectStats: { label: string; icon: string }[];
  header?: Record<string, unknown>;
  apps?: AppRecord[];
}

export function ProjectsSection({
  projects,
  projectStats,
  header = defaultSections.projects_header,
  apps = [],
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <SectionBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader header={header} stats={projectStats} />

        <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              reversed={index % 2 === 1}
              showcase={<ProjectShowcase project={project} priority={index === 0} />}
              linkedApp={apps.find((a) => a.id === project.app_id) ?? null}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
