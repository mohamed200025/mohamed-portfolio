"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CurrencySelector } from "./CurrencySelector";
import { formatWizardCurrency } from "./pricing-calculator";
import type { PriceBreakdownItem, WizardCurrency } from "./types";

interface LivePricingSummaryProps {
  totalUsd: number;
  breakdown: PriceBreakdownItem[];
  currency: WizardCurrency;
  onCurrencyChange: (currency: WizardCurrency) => void;
}

export function LivePricingSummary({
  totalUsd,
  breakdown,
  currency,
  onCurrencyChange,
}: LivePricingSummaryProps) {
  const [expanded, setExpanded] = useState(true);
  const hasBreakdown = breakdown.length > 0;
  const displayKey = `${currency}-${totalUsd}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0c0c14]/95 via-[#0a0a12]/95 to-[#08080f]/95 shadow-[0_0_40px_rgba(6,182,212,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.04] via-transparent to-violet-500/[0.04]" />

      <div className="relative p-3.5">
        <CurrencySelector value={currency} onChange={onCurrencyChange} />

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Estimated Price
            </p>
            <AnimatePresence mode="popLayout">
              <motion.p
                key={displayKey}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-0.5 bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent"
              >
                {formatWizardCurrency(totalUsd, currency)}
              </motion.p>
            </AnimatePresence>
          </div>

          {hasBreakdown && (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60"
              aria-expanded={expanded}
            >
              Breakdown
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        <AnimatePresence>
          {hasBreakdown && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Price Breakdown
                </p>
                <ul className="space-y-1.5">
                  <AnimatePresence mode="popLayout">
                    {breakdown.map((item) => (
                      <motion.li
                        key={`${currency}-${item.id}`}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-baseline gap-2 text-[12px]"
                      >
                        <span className="shrink-0 text-white/55">{item.label}</span>
                        <span className="min-w-[12px] flex-1 border-b border-dotted border-white/15" />
                        <span className="shrink-0 font-medium tabular-nums text-cyan-300/90">
                          {formatWizardCurrency(item.amount, currency)}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-2.5 flex items-baseline gap-2 border-t border-white/[0.06] pt-2.5 text-[13px] font-bold">
                  <span className="text-white/70">Total</span>
                  <span className="min-w-[12px] flex-1 border-b border-dotted border-white/20" />
                  <motion.span
                    key={displayKey}
                    initial={{ scale: 1.05, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="shrink-0 tabular-nums text-white"
                  >
                    {formatWizardCurrency(totalUsd, currency)}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
