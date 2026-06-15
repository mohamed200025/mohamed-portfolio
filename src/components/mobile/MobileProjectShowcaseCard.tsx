"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import type { ProjectRecord } from "@/types/cms";
import { projectDetailsPath } from "@/lib/cms/project-utils";

interface MobileProjectShowcaseCardProps {
  project: ProjectRecord;
  fullWidth?: boolean;
}

export function MobileProjectShowcaseCard({ project, fullWidth }: MobileProjectShowcaseCardProps) {
  const coverImage = project.images?.find((img) => img.is_cover)?.url ?? project.images?.[0]?.url;

  return (
    <article
      className={fullWidth ? "w-full" : "w-[min(88vw,340px)] shrink-0 snap-center"}
    >
      <Link
        href={projectDetailsPath(project.slug)}
        className="group flex gap-3 rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-3.5 backdrop-blur-xl transition-all duration-300 active:scale-[0.98] active:border-violet-500/20 active:bg-white/[0.05] active:shadow-[0_8px_32px_rgba(139,92,246,0.12)]"
      >
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[14px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-600/10">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="52px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Layers className="h-5 w-5 text-cyan-400/50" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold leading-tight text-white">
              {project.title}
            </h3>
            <span className="shrink-0 rounded-full border border-violet-500/25 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
              {project.category}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/45">
            {project.description}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/45"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex justify-end">
            <span className="flex min-h-[32px] items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 text-[11px] font-semibold text-cyan-300">
              View Project
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
