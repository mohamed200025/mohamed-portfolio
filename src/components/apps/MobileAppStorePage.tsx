"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Cloud,
  Database,
  Download,
  Globe,
  Lock,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AppPageData } from "@/lib/cms/apps";
import { appDetailsPath, formatDownloads } from "@/lib/cms/app-utils";
import type { AppRecord } from "@/types/cms";

type StoreTab = "overview" | "features" | "technologies";

interface DeveloperInfo {
  name: string;
  title: string;
  photoUrl?: string | null;
}

interface MobileAppStorePageProps {
  data: AppPageData;
  developer: DeveloperInfo;
}

const FEATURE_ICONS: LucideIcon[] = [Sparkles, Shield, Zap, Users, Bell, Lock, Cloud, Globe, Database, Smartphone];

const TECH_STYLES: Record<string, string> = {
  Flutter: "from-blue-500/25 to-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Firebase: "from-amber-500/25 to-orange-500/20 text-amber-300 border-amber-500/30",
  "Node.js": "from-emerald-500/25 to-green-500/20 text-emerald-300 border-emerald-500/30",
  Supabase: "from-emerald-500/25 to-teal-500/20 text-teal-300 border-teal-500/30",
  PostgreSQL: "from-sky-500/25 to-blue-500/20 text-sky-300 border-sky-500/30",
  React: "from-cyan-500/25 to-blue-500/20 text-cyan-300 border-cyan-500/30",
  "Next.js": "from-white/10 to-white/5 text-white/80 border-white/20",
  Dart: "from-blue-500/25 to-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starClass = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textClass = size === "sm" ? "text-[11px]" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${starClass} ${
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                  ? "fill-amber-400/50 text-amber-400/50"
                  : "text-white/15"
            }`}
          />
        ))}
      </div>
      <span className={`${textClass} font-semibold text-white/90`}>{rating.toFixed(1)}</span>
    </div>
  );
}

function PhoneScreenshot({ url, alt }: { url: string; alt: string }) {
  return (
    <div className="w-[200px] shrink-0 snap-center snap-always">
      <div className="relative rounded-[28px] border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <div className="absolute left-1/2 top-3 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-black/60" />
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[22px] bg-black">
          <Image src={url} alt={alt} fill className="object-cover object-top" sizes="200px" />
        </div>
      </div>
    </div>
  );
}

function SimilarAppCard({ app }: { app: AppRecord }) {
  return (
    <Link
      href={appDetailsPath(app.slug)}
      className="w-[148px] shrink-0 snap-center snap-always active:scale-[0.97]"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl transition-colors active:border-cyan-500/25 active:bg-white/[0.06]">
        <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-[16px] border border-white/10 shadow-lg">
          {app.logo_url ? (
            <Image src={app.logo_url} alt={app.name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/30 to-violet-600/30 text-lg font-bold text-cyan-300">
              {app.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="mt-2.5 truncate text-center text-[12px] font-semibold text-white">{app.name}</h3>
        <p className="mt-0.5 truncate text-center text-[10px] text-white/40">{app.technologies[0] ?? "Mobile App"}</p>
        <div className="mt-1.5 flex items-center justify-center gap-0.5">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-medium text-amber-400">{app.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

const tabs: { id: StoreTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "technologies", label: "Technologies" },
];

export function MobileAppStorePage({ data, developer }: MobileAppStorePageProps) {
  const router = useRouter();
  const { app, relatedApps } = data;
  const screenshots = app.screenshots ?? [];
  const [activeTab, setActiveTab] = useState<StoreTab>("overview");
  const [shareLabel, setShareLabel] = useState("Share");

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

  const handleInstall = () => {
    if (app.apk_url) {
      trackDownload();
      window.open(app.apk_url, "_blank", "noopener,noreferrer");
      return;
    }
    if (app.play_store_url) {
      window.open(app.play_store_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: app.name, text: app.short_description, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied!");
        setTimeout(() => setShareLabel("Share"), 2000);
      }
    } catch {
      /* user cancelled */
    }
  };

  const canInstall = Boolean(app.apk_url || app.play_store_url);

  return (
    <div className="relative min-h-[100dvh] bg-[#07070d] text-white lg:hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/[0.08] blur-[100px]" />
        <div className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-violet-600/[0.07] blur-[90px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 active:bg-white/[0.08]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{app.name}</p>
            <p className="truncate text-[11px] text-white/40">{developer.name}</p>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-lg pb-10">
        {/* Hero */}
        <section className="px-5 pt-6">
          <div className="flex gap-4">
            <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[26px] border border-white/[0.1] bg-white/[0.04] shadow-[0_12px_40px_rgba(6,182,212,0.15)]">
              {app.logo_url ? (
                <Image src={app.logo_url} alt={app.name} fill className="object-cover" sizes="120px" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/25 to-violet-600/25 text-4xl font-bold text-cyan-300">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">{app.name}</h1>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-cyan-400/90">{app.short_description}</p>
              <p className="mt-2 text-[12px] font-medium text-emerald-400">{developer.name}</p>
            </div>
          </div>

          {/* Meta row — Play Store style */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1 px-2">
              <StarRating rating={app.rating} size="sm" />
              <span className="text-[10px] text-white/35">Rating</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-sm font-bold text-white">{formatDownloads(app.downloads_count)}</span>
              <span className="text-[10px] text-white/35">Downloads</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-sm font-bold text-white">v{app.version}</span>
              <span className="text-[10px] text-white/35">Version</span>
            </div>
          </div>
        </section>

        {/* Install */}
        <section className="mt-5 px-5">
          <div className="flex gap-3">
            {canInstall ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={handleInstall}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-[15px] font-bold text-white shadow-[0_8px_32px_rgba(6,182,212,0.35)]"
              >
                <Download className="h-5 w-5" />
                Install
              </motion.button>
            ) : (
              <div className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/40">
                Coming soon
              </div>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04] text-white/70 backdrop-blur-sm active:bg-white/[0.08]"
              aria-label="Share app"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
          </div>
          {shareLabel !== "Share" && (
            <p className="mt-2 text-center text-[11px] text-cyan-400">{shareLabel}</p>
          )}
        </section>

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <section className="mt-7">
            <h2 className="mb-3 px-5 text-[15px] font-bold text-white">Screenshots</h2>
            <div className="overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex snap-x snap-mandatory gap-4 py-1">
                {screenshots.map((shot) => (
                  <PhoneScreenshot
                    key={shot.id}
                    url={shot.url}
                    alt={shot.alt_text ?? `${app.name} screenshot`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tabs */}
        <section className="mt-6 border-b border-white/[0.06]">
          <nav className="flex px-5" aria-label="App details tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative min-h-[44px] flex-1 pb-3 text-[13px] font-semibold transition-colors ${
                    isActive ? "text-cyan-400" : "text-white/40"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="app-store-tab-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </section>

        {/* Tab content */}
        <section className="px-5 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm">
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-white/40">About this app</h3>
                    <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-white/65">
                      {app.description || app.short_description}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/[0.06] to-violet-600/[0.04] p-4 backdrop-blur-sm">
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-cyan-400/80">Purpose</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/60">{app.short_description}</p>
                    <h3 className="mt-4 text-[13px] font-bold uppercase tracking-wider text-cyan-400/80">Target users</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                      Built for users who need a modern, reliable mobile experience — students, professionals, and
                      organizations looking for polished digital tools.
                    </p>
                  </div>
                  {(app.file_size || app.last_updated) && (
                    <div className="flex flex-wrap gap-2">
                      {app.file_size && (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/50">
                          Size: {app.file_size}
                        </span>
                      )}
                      {app.last_updated && (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/50">
                          Updated: {app.last_updated}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-3">
                  {app.features.length > 0 ? (
                    app.features.map((feature, index) => {
                      const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
                      return (
                        <article
                          key={feature}
                          className="flex items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                            <Icon className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-[14px] font-medium leading-snug text-white/85">{feature}</p>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-white/40">
                      No features listed yet.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "technologies" && (
                <div className="flex flex-wrap gap-2.5">
                  {app.technologies.length > 0 ? (
                    app.technologies.map((tech) => {
                      const style =
                        TECH_STYLES[tech] ?? "from-white/8 to-white/4 text-white/70 border-white/15";
                      return (
                        <span
                          key={tech}
                          className={`rounded-xl border bg-gradient-to-br px-4 py-2.5 text-[13px] font-semibold shadow-sm backdrop-blur-sm ${style}`}
                        >
                          {tech}
                        </span>
                      );
                    })
                  ) : (
                    <p className="w-full rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-white/40">
                      No technologies listed yet.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Developer */}
        <section className="mt-8 px-5">
          <h2 className="mb-3 text-[15px] font-bold text-white">About the developer</h2>
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-cyan-500/30">
              {developer.photoUrl ? (
                <Image src={developer.photoUrl} alt={developer.name} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/30 to-violet-600/30 text-lg font-bold text-white">
                  {developer.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-semibold text-white">{developer.name}</p>
                <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-400" />
              </div>
              <p className="mt-0.5 text-[12px] text-white/45">{developer.title}</p>
            </div>
          </div>
        </section>

        {/* Similar apps */}
        {relatedApps.length > 0 && (
          <section className="mt-8 pb-4">
            <h2 className="mb-3 px-5 text-[15px] font-bold text-white">More apps to try</h2>
            <div className="overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex snap-x snap-mandatory gap-3 py-1">
                {relatedApps.map((related) => (
                  <SimilarAppCard key={related.id} app={related} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
