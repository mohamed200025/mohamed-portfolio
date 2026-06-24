"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Receipt, Shield, Sparkles, Zap } from "lucide-react";
import { TechnologiesBackground } from "@/components/technologies/TechnologiesBackground";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { PRICING_WIZARD_TOTAL_STEPS } from "./types";
import { usePricingWizard } from "./usePricingWizard";
import { useProposalSubmission } from "./useProposalSubmission";
import { PricingWizardSteps } from "./PricingWizardSteps";
import { DesktopPricingSidebar } from "./DesktopPricingSidebar";
import { PricingConfigGate } from "./PricingConfigGate";

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wizard = usePricingWizard();
  const submission = useProposalSubmission(wizard.flow);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <TechnologiesBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 lg:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400"
          >
            <Receipt className="h-3.5 w-3.5" />
            Project Pricing
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Build your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              project estimate
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-6 max-w-2xl text-base leading-relaxed text-white/50">
            Configure services, requirements, timeline, and optional features — then generate a
            professional proposal and request your final quote.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 text-xs text-white/45">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" /> Live pricing
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" /> PDF proposal
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Secure quote request
            </span>
          </motion.div>
        </motion.div>

        <PricingConfigGate>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={wizard.flow.step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="min-w-0"
            >
              <PricingWizardSteps
                wizard={wizard}
                layout="desktop"
                submission={submission}
              />
            </motion.div>
          </AnimatePresence>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <DesktopPricingSidebar wizard={wizard} submission={submission} />
            </div>
          </aside>
        </div>
        </PricingConfigGate>

        <span className="sr-only" aria-live="polite">
          Pricing wizard step {wizard.flow.step} of {PRICING_WIZARD_TOTAL_STEPS}
        </span>
      </div>
    </section>
  );
}
