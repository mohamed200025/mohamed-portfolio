"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calculator, Shield, Sparkles, Zap } from "lucide-react";
import { TechnologiesBackground } from "@/components/technologies/TechnologiesBackground";
import { defaultPricingData } from "@/lib/cms/defaults";
import { calculatePricingEstimate, formatPriceRange } from "@/lib/cms/pricing-utils";
import type { PricingData } from "@/types/cms";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CalculatorForm } from "./CalculatorForm";

export function CalculatorSection({ data = defaultPricingData }: { data?: PricingData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const defaultCurrency =
    data.currencies.find((c) => c.code === data.settings.default_currency && c.enabled) ??
    data.currencies.find((c) => c.enabled) ??
    data.currencies[0];

  const [projectTypeId, setProjectTypeId] = useState(data.projectTypes[0]?.id ?? "");
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [timelineId, setTimelineId] = useState(
    data.timelineOptions.find((t) => t.title === "Standard")?.id ?? data.timelineOptions[0]?.id ?? ""
  );
  const [currencyCode, setCurrencyCode] = useState(defaultCurrency?.code ?? "EUR");

  const preview = calculatePricingEstimate(data, projectTypeId, featureIds, timelineId, currencyCode);

  return (
    <section id="calculator" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <TechnologiesBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mb-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.span variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              <Calculator className="h-3.5 w-3.5" />
              {data.settings.badge}
            </motion.span>
            <motion.h2 variants={fadeUp} className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {data.settings.title_prefix}{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                {data.settings.title_highlight}
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-6 max-w-lg text-base leading-relaxed text-white/50">{data.settings.subtitle}</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 text-xs text-white/45">
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-cyan-400" /> Instant Estimate</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-violet-400" /> Fully Customizable</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400" /> No Obligation</span>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} className="relative flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1117] to-[#161b2e] p-8 shadow-2xl">
              <p className="text-xs text-white/40">Estimated Price ({preview.currency.code})</p>
              <p className="mt-1 text-3xl font-bold text-white">{formatPriceRange(preview.estimateMin, preview.estimateMax, preview.currency)}</p>
            </div>
          </motion.div>
        </motion.div>

        <CalculatorForm
          data={data}
          projectTypeId={projectTypeId}
          featureIds={featureIds}
          timelineId={timelineId}
          currencyCode={currencyCode}
          onProjectTypeChange={setProjectTypeId}
          onFeatureToggle={(id) => setFeatureIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))}
          onTimelineChange={setTimelineId}
          onCurrencyChange={setCurrencyCode}
        />

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.settings.trust_items.map((item) => (
            <motion.div key={item.title} variants={fadeUp} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-center">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-white/45">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
