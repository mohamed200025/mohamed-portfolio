"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LivePricingSummary } from "./LivePricingSummary";
import { ProposalQuoteActions } from "./ProposalQuoteActions";
import {
  getComplexityBadge,
  getTimelineAdjustmentLabel,
} from "./complexity-engine";
import { getTimelineOption } from "./timelines";
import { TimelineBadge } from "./TimelineBadge";
import type { PricingWizardController } from "./usePricingWizard";
import type { useProposalSubmission } from "./useProposalSubmission";

type ProposalSubmission = ReturnType<typeof useProposalSubmission>;

interface DesktopPricingSidebarProps {
  wizard: PricingWizardController;
  submission: ProposalSubmission;
}

export function DesktopPricingSidebar({ wizard, submission }: DesktopPricingSidebarProps) {
  const {
    flow,
    timelineMultiplier,
    setCurrency,
    canContinue,
    handleBack,
    handleContinue,
  } = wizard;

  const timeline = getTimelineOption(flow.timelineId);
  const showNav = flow.step < 7;
  const showQuoteActions = flow.step === 7;

  return (
    <div className="space-y-4">
      <LivePricingSummary
        totalUsd={flow.finalEstimatedTotal}
        breakdown={flow.priceBreakdown}
        currency={flow.currency}
        onCurrencyChange={setCurrency}
      />

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
          Project Insights
        </p>
        <div className="mt-3 space-y-2.5 text-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/45">Complexity</span>
            <span className="font-medium text-white/75">
              {getComplexityBadge(flow.complexityLevel)}
              <span className="text-white/30"> · {flow.complexityScore} pts</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/45">Delivery</span>
            <span className="font-medium text-cyan-300/90">{flow.deliveryDuration}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/45">Timeline</span>
            <span className="flex items-center gap-2 font-medium text-white/75">
              {timeline.title}
              <TimelineBadge badge={timeline.badge} />
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
            <span className="text-white/45">Adjustment</span>
            <span
              className={`font-medium ${
                timelineMultiplier > 1
                  ? "text-amber-400/90"
                  : timelineMultiplier < 1
                    ? "text-emerald-400/90"
                    : "text-white/50"
              }`}
            >
              {getTimelineAdjustmentLabel(timelineMultiplier)}
            </span>
          </div>
        </div>
      </div>

      {showQuoteActions && (
        <ProposalQuoteActions
          flow={flow}
          submission={submission}
          variant="sidebar"
        />
      )}

      {showNav && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a12]/80 p-3 backdrop-blur-xl">
          <div className="flex gap-3">
            {flow.step > 1 && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 transition-colors hover:bg-white/[0.08]"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
            )}
            <motion.button
              type="button"
              disabled={!canContinue}
              whileTap={canContinue ? { scale: 0.98 } : undefined}
              onClick={handleContinue}
              className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all duration-300 ${
                canContinue
                  ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white shadow-[0_8px_32px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.45)]"
                  : "cursor-not-allowed bg-white/[0.06] text-white/25"
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
