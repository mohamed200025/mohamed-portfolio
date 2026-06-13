"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import type { AppRecord } from "@/types/cms";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AppCard } from "./AppCard";
import { SitePageNav } from "@/components/layout/SitePageNav";

interface AppsMarketplaceProps {
  apps: AppRecord[];
}

export function AppsMarketplace({ apps }: AppsMarketplaceProps) {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <SitePageNav active="apps" />

      <main className="pt-24">
        <section className="relative overflow-hidden pb-12 md:pb-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.14),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(99,102,241,0.08),transparent)]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-cyan-400">
                <Smartphone className="h-3.5 w-3.5" />
                App Store
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                  Mobile Applications
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
              >
                Browse and download all published applications
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="relative pb-24 md:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {apps.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
              >
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-14 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <Smartphone className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-semibold text-white">No apps published yet</h2>
                <p className="mt-2 text-sm text-white/45">
                  Check back soon — new applications will appear here when they are published.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
