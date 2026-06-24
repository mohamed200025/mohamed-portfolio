"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CurrencySelector } from "./CurrencySelector";
import { formatWizardCurrency } from "./pricing-calculator";
import { getTimelinePercentLabel } from "./complexity-engine";
import type { WizardCurrency } from "./types";

interface PriorityPricingSummaryProps {
  baseUsd: number;
  adjustmentUsd: number;
  finalUsd: number;
  timelineTitle: string;
  timelineMultiplier: number;
  currency: WizardCurrency;
  onCurrencyChange: (currency: WizardCurrency) => void;
}

export function PriorityPricingSummary({
  baseUsd,
  adjustmentUsd,
  finalUsd,
  timelineTitle,
  timelineMultiplier,
  currency,
  onCurrencyChange,
}: PriorityPricingSummaryProps) {
  const displayKey = `${currency}-${finalUsd}-${timelineMultiplier}`;
  const percentLabel = getTimelinePercentLabel(timelineMultiplier);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0c0c14]/95 via-[#0a0a12]/95 to-[#08080f]/95 shadow-[0_0_40px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.04] via-transparent to-violet-500/[0.04]" />

      <div className="relative p-3.5">
        <CurrencySelector value={currency} onChange={onCurrencyChange} />

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Priority Summary
        </p>

        <div className="mt-2 space-y-2">
          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="text-white/55">Base Price</span>
            <span className="font-medium tabular-nums text-white/80">
              {formatWizardCurrency(baseUsd, currency)}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="text-white/55">
              {timelineTitle}
              {percentLabel ? ` (${percentLabel})` : ""}
            </span>
            <motion.span
              key={`adj-${displayKey}`}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              className={`font-medium tabular-nums ${
                adjustmentUsd > 0
                  ? "text-amber-400"
                  : adjustmentUsd < 0
                    ? "text-emerald-400"
                    : "text-white/50"
              }`}
            >
              {adjustmentUsd === 0
                ? formatWizardCurrency(0, currency)
                : `${adjustmentUsd > 0 ? "+" : ""}${formatWizardCurrency(adjustmentUsd, currency)}`}
            </motion.span>
          </div>

          <div className="border-t border-white/[0.08] pt-2">
            <div className="flex items-end justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80">
                Final Estimated Price
              </span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={displayKey}
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-xl font-bold tabular-nums text-transparent"
                >
                  {formatWizardCurrency(finalUsd, currency)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
