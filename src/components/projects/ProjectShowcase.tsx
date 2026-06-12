"use client";

import type { ProjectRecord } from "@/types/cms";
import { getProjectScreenshotUrls, hasProjectScreenshots } from "@/lib/cms/project-utils";
import { EduveraShowcase } from "./EduveraShowcase";
import { MuhlentechnikShowcase } from "./MuhlentechnikShowcase";
import { ProjectScreenshotShowcase } from "./ProjectScreenshotShowcase";

interface ProjectShowcaseProps {
  project: ProjectRecord;
  priority?: boolean;
  size?: "default" | "large";
}

function DefaultMockup({ project }: { project: ProjectRecord }) {
  if (project.showcase_type === "muhlentechnik") return <MuhlentechnikShowcase />;
  return <EduveraShowcase />;
}

export function ProjectShowcase({ project, priority = false, size = "default" }: ProjectShowcaseProps) {
  if (hasProjectScreenshots(project)) {
    const { desktop, mobile } = getProjectScreenshotUrls(project);
    if (desktop) {
      return (
        <ProjectScreenshotShowcase
          desktopUrl={desktop}
          mobileUrl={mobile}
          alt={project.title}
          priority={priority}
          size={size}
        />
      );
    }
  }

  return <DefaultMockup project={project} />;
}
