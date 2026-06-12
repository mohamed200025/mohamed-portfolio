"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Rocket } from "lucide-react";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";
import { fadeUp, staggerContainer } from "@/lib/animations";

const avatars = [
  "from-cyan-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-blue-400 to-indigo-500",
  "from-fuchsia-400 to-pink-500",
];

export function CTASection({ cta }: { cta?: Record<string, string> }) {
  const label = cta?.label ?? "Ready to Get Started?";
  const title = cta?.title ?? "Have a Project in Mind?";
  const titleHighlight = cta?.title_highlight ?? "Let's Build Something Amazing Together";
  const description = cta?.description ?? "I'm available for new projects and exciting opportunities. Let's discuss how we can bring your ideas to life.";
  return (
    <motion.div
      className="group relative mt-16 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10 md:mt-20 lg:p-12"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 55%)",
              "radial-gradient(ellipse 60% 80% at 30% 50%, rgba(59,130,246,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 70% 50%, rgba(34,211,238,0.12) 0%, transparent 55%)",
              "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(34,211,238,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 80% 50%, rgba(139,92,246,0.15) 0%, transparent 55%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />
        <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-600/12 blur-[80px]" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Left content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 shadow-lg shadow-cyan-500/10">
              <Rocket className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400">
              {label}
            </span>
          </motion.div>

          <motion.h3
            variants={fadeUp}
            className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            {title}
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </motion.h3>

          <motion.p variants={fadeUp} className="max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            {description}
          </motion.p>
        </motion.div>

        {/* Right CTAs */}
        <motion.div
          className="flex flex-col items-start gap-4 lg:items-end"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeUp} className="flex w-full flex-col gap-3 sm:flex-row lg:justify-end">
            <ShimmerButton>
              <MagneticButton href="#contact" variant="primary" className="w-full sm:w-auto !px-6 !py-3.5">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </ShimmerButton>
            <MagneticButton href="#contact" variant="secondary" className="w-full sm:w-auto !px-6 !py-3.5">
              <Phone className="h-4 w-4" />
              Schedule a Call
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {avatars.map((gradient, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black/50 bg-gradient-to-br ${gradient} text-[10px] font-bold text-white`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40">
              Let&apos;s create something incredible together!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
