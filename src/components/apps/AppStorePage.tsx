"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Star,
  X,
} from "lucide-react";
import type { AppPageData } from "@/lib/cms/apps";
import { formatDownloads } from "@/lib/cms/app-utils";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { SitePageNav } from "@/components/layout/SitePageNav";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";

function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-white/80">{rating.toFixed(1)}</span>
    </div>
  );
}

export function AppStorePage({ data }: { data: AppPageData }) {
  const { app, prev, next } = data;
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const screenshots = app.screenshots ?? [];

  const trackDownload = useCallback(async () => {
    try {
      await fetch("/api/apps/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: app.slug }),
      });
    } catch {
      /* non-blocking */
    }
  }, [app.slug]);

  const handleApkDownload = () => {
    if (!app.apk_url) return;
    trackDownload();
    window.open(app.apk_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <SitePageNav active="apps" />

      <main className="pt-24">
        <section className="relative overflow-hidden pb-16 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.14),transparent)]" />
          <div className="relative mx-auto max-w-md px-4 md:max-w-7xl md:px-6 lg:px-8">
            <div className="mb-8 flex justify-center md:justify-start">
              <Link
                href="/apps"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" />
                All Apps
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-10 text-center md:text-left lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14"
            >
              {/* Left: app identity + meta + download */}
              <div className="flex flex-col items-center md:items-stretch">
                <motion.div
                  variants={fadeUp}
                  className="mb-6 flex w-full flex-col items-center gap-5 md:flex-row md:items-start"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-cyan-500/10 sm:h-28 sm:w-28">
                    {app.logo_url ? (
                      <Image src={app.logo_url} alt={app.name} fill className="object-cover" sizes="112px" priority />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 to-violet-600/20 text-2xl font-bold text-cyan-400">
                        {app.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{app.name}</h1>
                    <p className="mt-2 text-base text-white/55 sm:text-lg">{app.short_description}</p>
                    <div className="mt-4 flex justify-center md:justify-start">
                      <StarRating rating={app.rating} />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mb-8 grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-3"
                >
                  {[
                    { label: "Version", value: app.version },
                    { label: "Size", value: app.file_size || "—" },
                    { label: "Updated", value: app.last_updated || "—" },
                    { label: "Downloads", value: formatDownloads(app.downloads_count) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-center"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-white/40">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="flex w-full flex-col items-center gap-3 md:flex-row md:flex-wrap md:items-stretch"
                >
                  {app.apk_url && (
                    <ShimmerButton className="w-full max-w-md md:w-auto md:max-w-none">
                      <MagneticButton
                        variant="primary"
                        className="mx-auto w-full max-w-md !px-6 !py-3.5 md:mx-0 md:w-auto md:max-w-none"
                        onClick={handleApkDownload}
                      >
                        <Download className="h-4 w-4" />
                        Download APK
                      </MagneticButton>
                    </ShimmerButton>
                  )}
                  {app.play_store_url && (
                    <MagneticButton
                      href={app.play_store_url}
                      variant="secondary"
                      className="mx-auto w-full max-w-md !px-6 !py-3.5 md:mx-0 md:w-auto md:max-w-none"
                      external
                    >
                      <ExternalLink className="h-4 w-4" />
                      Get on Google Play
                    </MagneticButton>
                  )}
                </motion.div>

                {app.technologies.length > 0 && (
                  <motion.div variants={fadeUp} className="mt-8 w-full">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Technologies</p>
                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                      {app.technologies.map((tech) => (
                        <span key={tech} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right: screenshot gallery */}
              <motion.div variants={fadeUp} className="w-full">
                {screenshots.length > 0 ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
                    <div className="relative aspect-[9/16] max-h-[520px] w-full overflow-hidden rounded-xl bg-black/40 sm:max-h-[600px]">
                      <Image
                        src={screenshots[galleryIndex]?.url ?? screenshots[0].url}
                        alt={screenshots[galleryIndex]?.alt_text ?? `${app.name} screenshot`}
                        fill
                        className="cursor-zoom-in object-contain"
                        sizes="(max-width: 1024px) 100vw, 480px"
                        onClick={() => setLightbox(galleryIndex)}
                        priority
                      />
                    </div>
                    {screenshots.length > 1 && (
                      <>
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                          {screenshots.map((shot, i) => (
                            <button
                              key={shot.id}
                              type="button"
                              onClick={() => setGalleryIndex(i)}
                              className={`relative h-16 w-10 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                                i === galleryIndex ? "border-cyan-500/50" : "border-white/10 opacity-70 hover:opacity-100"
                              }`}
                            >
                              <Image src={shot.url} alt="" fill className="object-cover" sizes="40px" />
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setGalleryIndex((i) => (i - 1 + screenshots.length) % screenshots.length)}
                            className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-xs text-white/40">
                            {galleryIndex + 1} / {screenshots.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGalleryIndex((i) => (i + 1) % screenshots.length)}
                            className="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-[9/16] max-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-white/40">
                    No screenshots yet
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Description + features */}
        <section className="border-t border-white/[0.06] py-16 md:py-20">
          <div className="mx-auto max-w-md px-4 text-center md:max-w-7xl md:px-6 md:text-left lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white">About this app</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/55">{app.description}</p>
              </div>
              {app.features.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Features</h2>
                  <ul className="space-y-3">
                    {app.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                          <Check className="h-3 w-3 text-cyan-400" />
                        </span>
                        <span className="text-sm text-white/75">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Prev / next */}
        {(prev || next) && (
          <section className="border-t border-white/[0.06] py-10">
            <div className="mx-auto max-w-md px-4 text-center md:max-w-7xl md:px-6 md:text-left lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              {prev ? (
                <Link href={`/apps/${prev.slug}`} className="text-sm text-white/50 hover:text-cyan-400">
                  ← {prev.name}
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`/apps/${next.slug}`} className="text-sm text-white/50 hover:text-cyan-400">
                  {next.name} →
                </Link>
              ) : <span />}
              </div>
            </div>
          </section>
        )}
      </main>

      {lightbox !== null && screenshots[lightbox] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button type="button" className="absolute right-4 top-4 rounded-lg border border-white/20 p-2 text-white" onClick={() => setLightbox(null)}>
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[85vh] w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <Image src={screenshots[lightbox].url} alt="" fill className="object-contain" sizes="400px" />
          </div>
        </div>
      )}
    </div>
  );
}
