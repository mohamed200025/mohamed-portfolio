"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";
import {
  getComplexityBadge,
  getTimelineAdjustmentLabel,
  getTimelinePercentLabel,
} from "./complexity-engine";
import {
  formatClientPhone,
  getContactMethodLabel,
  hasClientSummaryData,
} from "./client-info";
import { CurrencySelector } from "./CurrencySelector";
import {
  applyComplexityMultiplier,
  applyTimelineMultiplier,
  getComplexityPriceMultiplier,
} from "@/lib/pricing/catalog";
import { formatWizardCurrency } from "./pricing-calculator";
import { getTimelineOption } from "./timelines";
import { TimelineBadge } from "./TimelineBadge";
import { WIZARD_CHROME_BOTTOM, WIZARD_CHROME_Z, WIZARD_DRAWER_BOTTOM } from "./wizard-layout";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import type {
  ClientInformation,
  ComplexityLevel,
  PriceBreakdownItem,
  PricingFlowStep,
  WizardCurrency,
  WizardTimelineId,
} from "./types";

interface WizardPriceDrawerProps {
  catalog: PricingCatalog;
  step: PricingFlowStep;
  displayTotalUsd: number;
  baseUsd: number;
  breakdown: PriceBreakdownItem[];
  timelineId: WizardTimelineId;
  timelineMultiplier: number;
  complexityLevel: ComplexityLevel;
  complexityScore: number;
  deliveryDuration: string;
  client: ClientInformation;
  currency: WizardCurrency;
  onCurrencyChange: (currency: WizardCurrency) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function WizardPriceDrawer({
  catalog,
  step,
  displayTotalUsd,
  baseUsd,
  breakdown,
  timelineId,
  timelineMultiplier,
  complexityLevel,
  complexityScore,
  deliveryDuration,
  client,
  currency,
  onCurrencyChange,
  expanded,
  onExpandedChange,
}: WizardPriceDrawerProps) {
  const timeline = getTimelineOption(timelineId);
  const complexityMult = getComplexityPriceMultiplier(catalog, complexityLevel);
  const afterComplexity = applyComplexityMultiplier(baseUsd, complexityMult);
  const { adjustmentAmount } = applyTimelineMultiplier(afterComplexity, timelineMultiplier);
  const percentLabel = getTimelinePercentLabel(timelineMultiplier);
  const adjustmentLabel = getTimelineAdjustmentLabel(timelineMultiplier);
  const displayKey = `${currency}-${displayTotalUsd}-${deliveryDuration}-${complexityLevel}`;
  const showClientSummary = step >= 5;
  const clientPhone = formatClientPhone(client);

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  return (
    <>
      <div
        className="fixed inset-x-0 mx-auto max-w-lg px-3"
        style={{ bottom: WIZARD_DRAWER_BOTTOM, zIndex: WIZARD_CHROME_Z - 1 }}
      >
        <div className="w-full rounded-t-2xl border border-b-0 border-white/[0.1] bg-[#0a0a12]/92 backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => onExpandedChange(!expanded)}
            className="w-full px-3.5 py-2 transition-colors active:bg-[#0d0d16]/95"
            aria-expanded={expanded}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                Estimated Price
              </p>
              <CurrencySelector variant="compact" value={currency} onChange={onCurrencyChange} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <motion.p
                  key={displayKey}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="truncate text-[17px] font-bold tabular-nums text-white"
                >
                  {formatWizardCurrency(displayTotalUsd, currency)}
                </motion.p>
                <TimelineBadge badge={timeline.badge} />
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-cyan-400/90">
                {expanded ? (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Hide Breakdown
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    View Breakdown
                  </>
                )}
              </span>
            </div>
            <motion.div
              key={`meta-${complexityLevel}-${deliveryDuration}-${client.fullName}`}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 space-y-0.5 text-left"
            >
              {!showClientSummary && (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                      Complexity
                    </span>
                    <span className="text-[11px] font-medium text-white/60">
                      {getComplexityBadge(complexityLevel)}
                      <span className="text-white/30"> · {complexityScore} pts</span>
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                      Delivery Time
                    </span>
                    <span className="text-[11px] font-medium text-white/60">{deliveryDuration}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                      Adjustment
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        timelineMultiplier > 1
                          ? "text-amber-400/90"
                          : timelineMultiplier < 1
                            ? "text-emerald-400/90"
                            : "text-white/50"
                      }`}
                    >
                      {percentLabel}
                    </span>
                  </div>
                </>
              )}
              {showClientSummary && (
                <div className="space-y-0.5 border-t border-white/[0.06] pt-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                    Client
                  </p>
                  {client.fullName.trim() ? (
                    <p className="truncate text-[11px] font-medium text-white/75">
                      {client.fullName.trim()}
                    </p>
                  ) : (
                    <p className="text-[11px] text-white/30">Name not entered</p>
                  )}
                  {clientPhone && (
                    <p className="truncate text-[11px] text-white/55">{clientPhone}</p>
                  )}
                  {client.email.trim() && (
                    <p className="truncate text-[11px] text-white/55">{client.email.trim()}</p>
                  )}
                  {client.companyName.trim() && (
                    <p className="truncate text-[11px] text-white/55">{client.companyName.trim()}</p>
                  )}
                  {client.country && (
                    <p className="truncate text-[11px] text-white/55">{client.country}</p>
                  )}
                  <p className="text-[11px] text-cyan-400/80">
                    {getContactMethodLabel(client.preferredContactMethod)}
                  </p>
                </div>
              )}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.button
              type="button"
              aria-label="Close breakdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-0 bg-black/55 backdrop-blur-[2px]"
              style={{ bottom: WIZARD_CHROME_BOTTOM, zIndex: WIZARD_CHROME_Z + 1 }}
              onClick={() => onExpandedChange(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Price breakdown"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-x-0 mx-auto flex max-h-[70vh] max-w-lg flex-col rounded-t-3xl border border-white/[0.1] bg-[#0a0a12]/98 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              style={{ bottom: WIZARD_DRAWER_BOTTOM, zIndex: WIZARD_CHROME_Z + 2 }}
            >
              <div className="shrink-0 border-b border-white/[0.06] px-4 py-3">
                <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/15" />
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">Price Breakdown</h3>
                  <button
                    type="button"
                    onClick={() => onExpandedChange(false)}
                    className="flex items-center gap-1 text-[11px] font-medium text-cyan-400"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                    Hide Breakdown
                  </button>
                </div>
                <div className="mt-3">
                  <CurrencySelector value={currency} onChange={onCurrencyChange} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                {hasClientSummaryData(client) && (
                  <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11px]">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/35">
                      Client Information
                    </p>
                    <div className="space-y-1">
                      {client.fullName.trim() && (
                        <p>
                          <span className="text-white/35">Name · </span>
                          <span className="text-white/75">{client.fullName.trim()}</span>
                        </p>
                      )}
                      {clientPhone && (
                        <p>
                          <span className="text-white/35">Phone · </span>
                          <span className="text-white/75">{clientPhone}</span>
                        </p>
                      )}
                      {client.email.trim() && (
                        <p>
                          <span className="text-white/35">Email · </span>
                          <span className="text-white/75">{client.email.trim()}</span>
                        </p>
                      )}
                      {client.companyName.trim() && (
                        <p>
                          <span className="text-white/35">Company · </span>
                          <span className="text-white/75">{client.companyName.trim()}</span>
                        </p>
                      )}
                      {client.country && (
                        <p>
                          <span className="text-white/35">Country · </span>
                          <span className="text-white/75">{client.country}</span>
                        </p>
                      )}
                      <p>
                        <span className="text-white/35">Contact · </span>
                        <span className="text-cyan-300/90">
                          {getContactMethodLabel(client.preferredContactMethod)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11px]">
                  <div>
                    <p className="text-white/35">Complexity</p>
                    <p className="mt-0.5 font-medium text-white/70">
                      {getComplexityBadge(complexityLevel)} ({complexityScore} pts)
                    </p>
                  </div>
                  <div>
                    <p className="text-white/35">Delivery</p>
                    <p className="mt-0.5 font-medium text-cyan-300/90">{deliveryDuration}</p>
                  </div>
                </div>

                {breakdown.length > 0 ? (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/35">
                      Selected Features
                    </p>
                    <ul className="space-y-2">
                      {breakdown.map((item) => (
                        <li key={item.id} className="flex items-baseline gap-2 text-[12px]">
                          <span className="shrink-0 text-white/55">{item.label}</span>
                          <span className="min-w-[8px] flex-1 border-b border-dotted border-white/12" />
                          <span className="shrink-0 tabular-nums text-cyan-300/90">
                            {formatWizardCurrency(item.amount, currency)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="py-4 text-center text-[12px] text-white/35">
                    Select requirements to see a detailed breakdown.
                  </p>
                )}

                <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3">
                  <div className="flex items-baseline justify-between gap-2 text-[12px]">
                    <span className="text-white/50">Subtotal</span>
                    <span className="tabular-nums text-white/75">
                      {formatWizardCurrency(baseUsd, currency)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 text-[12px]">
                    <span className="text-white/50">
                      Timeline — {timeline.title} ({deliveryDuration}) · {adjustmentLabel}
                    </span>
                    <span
                      className={`tabular-nums ${
                        adjustmentAmount > 0
                          ? "text-amber-400"
                          : adjustmentAmount < 0
                            ? "text-emerald-400"
                            : "text-white/40"
                      }`}
                    >
                      {adjustmentAmount === 0
                        ? "—"
                        : `${adjustmentAmount > 0 ? "+" : ""}${formatWizardCurrency(adjustmentAmount, currency)}`}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 border-t border-white/[0.06] pt-2 text-[13px] font-bold">
                    <span className="flex items-center gap-2 text-white/80">
                      Final Total
                      <TimelineBadge badge={timeline.badge} />
                    </span>
                    <motion.span
                      key={displayKey}
                      initial={{ scale: 1.04, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="tabular-nums text-cyan-300"
                    >
                      {formatWizardCurrency(displayTotalUsd, currency)}
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
