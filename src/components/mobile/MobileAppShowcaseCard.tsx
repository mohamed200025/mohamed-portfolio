"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Star } from "lucide-react";
import type { AppRecord } from "@/types/cms";
import { appDetailsPath, formatDownloads } from "@/lib/cms/app-utils";

interface MobileAppShowcaseCardProps {
  app: AppRecord;
  fullWidth?: boolean;
}

export function MobileAppShowcaseCard({ app, fullWidth }: MobileAppShowcaseCardProps) {
  const category = app.technologies[0] ?? "Mobile App";

  return (
    <article
      className={fullWidth ? "w-full" : "w-[min(88vw,340px)] shrink-0 snap-center"}
    >
      <Link
        href={appDetailsPath(app.slug)}
        className="group flex gap-3.5 rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition-all duration-300 active:scale-[0.98] active:border-cyan-500/20 active:bg-white/[0.05] active:shadow-[0_8px_32px_rgba(6,182,212,0.12)]"
      >
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[14px] border border-white/10 shadow-lg shadow-cyan-500/5">
          {app.logo_url ? (
            <Image src={app.logo_url} alt={app.name} fill className="object-cover" sizes="52px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-lg font-bold text-cyan-300">
              {app.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold leading-tight text-white">
              {app.name}
            </h3>
            <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-amber-400">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {app.rating.toFixed(1)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/45">
            {app.short_description}
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="truncate rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
              {category}
            </span>
            <span className="flex min-h-[32px] shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 text-[11px] font-semibold text-white shadow-[0_2px_12px_rgba(6,182,212,0.3)]">
              <Download className="h-3 w-3" />
              Install
            </span>
          </div>

          <p className="mt-1.5 text-[10px] text-white/30">{formatDownloads(app.downloads_count)} downloads</p>
        </div>
      </Link>
    </article>
  );
}
