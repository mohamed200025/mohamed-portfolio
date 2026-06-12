"use client";

import { motion } from "framer-motion";
import { BarChart3, Clock, Info } from "lucide-react";
import type { PricingEstimate } from "@/types/cms";
import { formatPriceRange } from "@/lib/cms/pricing-utils";

export function CalculatorEstimatePanel({ estimate }: { estimate: PricingEstimate }) {
  const complexityColor = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  }[estimate.complexity];

  const { currency } = estimate;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Live Estimate</p>
          <p className="text-sm text-white/60">{currency.code} · Updates as you configure</p>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs text-white/40">Base Price</p>
            <p className="text-sm font-medium text-white">{estimate.projectTypeTitle}</p>
            <p className="text-sm text-cyan-400">{formatPriceRange(estimate.baseMin, estimate.baseMax, currency)}</p>
          </div>

          {estimate.selectedFeatures.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-white/40">Selected Features</p>
              <ul className="space-y-1.5">
                {estimate.selectedFeatures.map((f) => (
                  <li key={f.id} className="flex justify-between text-xs">
                    <span className="text-white/70">{f.title}</span>
                    <span className="text-white/50">{formatPriceRange(f.minPrice, f.maxPrice, currency)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="font-medium text-white">
                {formatPriceRange(estimate.subtotalMin, estimate.subtotalMax, currency)}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-white/40">Timeline ({estimate.timelineTitle})</span>
              <span className="text-white/50">×{estimate.timelineMultiplier.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <p className="text-xs text-white/50">Estimated Price Range</p>
            <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              {formatPriceRange(estimate.estimateMin, estimate.estimateMax, currency)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <Clock className="mb-1 h-4 w-4 text-emerald-400" />
              <p className="text-[10px] uppercase text-white/40">Est. Time</p>
              <p className="text-sm font-medium text-white">{estimate.timeEstimate}</p>
            </div>
            <div className={`rounded-xl border p-3 ${complexityColor}`}>
              <BarChart3 className="mb-1 h-4 w-4" />
              <p className="text-[10px] uppercase opacity-70">Complexity</p>
              <p className="text-sm font-medium">{estimate.complexityLabel}</p>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p className="text-xs leading-relaxed text-white/50">
              This is an estimate. Final pricing may vary based on detailed requirements.
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
