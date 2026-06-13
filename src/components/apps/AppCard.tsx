"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Smartphone, Star } from "lucide-react";
import type { AppRecord } from "@/types/cms";
import { appDetailsPath, formatDownloads } from "@/lib/cms/app-utils";
import { fadeUp } from "@/lib/animations";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-white/15"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-white/70">{rating.toFixed(1)}</span>
    </div>
  );
}

interface AppCardProps {
  app: AppRecord;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href={appDetailsPath(app.slug)}
        className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/35 hover:bg-white/[0.05] hover:shadow-[0_8px_32px_rgba(34,211,238,0.12)] sm:p-6"
      >
        <div className="mb-4 flex items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-cyan-500/10 transition-transform duration-300 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
            {app.logo_url ? (
              <Image
                src={app.logo_url}
                alt={app.name}
                fill
                className="object-cover"
                sizes="72px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 to-violet-600/20 text-xl font-bold text-cyan-400">
                {app.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-300 sm:text-xl">
              {app.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/50">
              {app.short_description}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <StarRating rating={app.rating} />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {app.file_size && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/60">
              <Smartphone className="h-3 w-3 text-cyan-400/80" />
              {app.file_size}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/60">
            <Download className="h-3 w-3 text-cyan-400/80" />
            {formatDownloads(app.downloads_count)} downloads
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
            View App
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-400/80">
            Android
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
