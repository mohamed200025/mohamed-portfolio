"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, User } from "lucide-react";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function WhoIAmCard({
  whoIAm,
  cvUrl,
}: {
  whoIAm?: Record<string, unknown>;
  cvUrl?: string;
}) {
  const title = (whoIAm?.title as string) ?? "Who I Am";
  const paragraphs = (whoIAm?.paragraphs as string[]) ?? [
    "I'm a passionate Full Stack & Flutter Developer focused on building scalable digital products, educational platforms, custom CMS systems and modern business applications.",
    "With experience in web development, mobile applications and administrative dashboards, I transform ideas into professional and user-friendly digital solutions.",
  ];
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md sm:p-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div variants={fadeUp} className="relative mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          <User className="h-5 w-5 text-cyan-400" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </motion.div>

      {paragraphs.map((p, i) => (
        <motion.p key={i} variants={fadeUp} className={`relative text-sm leading-relaxed text-white/50 sm:text-base ${i === paragraphs.length - 1 ? "mb-6" : "mb-4"}`}>
          {p}
        </motion.p>
      ))}

      <motion.div variants={fadeUp} className="relative">
        <ShimmerButton className="w-full">
          <MagneticButton href={cvUrl ?? "#"} variant="primary" className="w-full !justify-between !px-5 !py-4">
            <span className="flex items-center gap-3">
              <Download className="h-4 w-4" />
              <span className="text-left">
                <span className="block text-sm font-medium">Download CV</span>
                <span className="block text-[11px] font-normal text-white/60">
                  Get my resume in PDF format
                </span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </MagneticButton>
        </ShimmerButton>
      </motion.div>
    </motion.div>
  );
}
