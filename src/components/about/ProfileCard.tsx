"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export function ProfileCard({
  name = "Mohamed Ournani",
  title = "Full Stack & Flutter Developer",
  statusBadge = "Available for new projects",
  photoUrl,
}: {
  name?: string;
  title?: string;
  statusBadge?: string;
  photoUrl?: string | null;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div
        variants={fadeUp}
        className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-xs text-white/70">{statusBadge}</span>
      </motion.div>

      <motion.div
        className="relative mx-auto mb-6 aspect-[3/4] max-w-[280px] overflow-hidden rounded-xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-violet-500/30 blur-2xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
          {photoUrl ? (
            <Image src={photoUrl} alt={name} fill className="object-cover object-top" sizes="280px" priority />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15)_0%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <div className="relative h-[85%] w-[75%]">
                  <div className="absolute inset-0 rounded-t-[40%] bg-gradient-to-b from-slate-600/80 to-slate-700/40" />
                  <div className="absolute left-1/2 top-[12%] h-[28%] w-[42%] -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-500 to-slate-600" />
                  <div className="absolute left-1/2 top-[38%] h-[62%] w-[80%] -translate-x-1/2 rounded-t-[45%] bg-gradient-to-b from-slate-600/90 to-slate-800/60" />
                </div>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-cyan-500/5" />
        </div>
      </motion.div>

      <div className="relative z-10 text-center">
        <h3 className="text-xl font-bold text-white sm:text-2xl">{name}</h3>
        <p className="mt-1 text-sm text-white/50">{title}</p>

        <motion.svg
          viewBox="0 0 120 30"
          className="mx-auto mt-4 h-6 w-24 text-cyan-400/60"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M5 22 Q30 8 60 18 T115 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}
