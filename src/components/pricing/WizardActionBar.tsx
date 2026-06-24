"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatWizardCurrency } from "./pricing-calculator";
import { WIZARD_CHROME_BOTTOM, WIZARD_CHROME_Z } from "./wizard-layout";
import type { WizardCurrency } from "./types";

interface WizardActionBarProps {
  displayTotalUsd: number;
  currency: WizardCurrency;
  canContinue: boolean;
  showBack: boolean;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  hideContinue?: boolean;
}

export function WizardActionBar({
  displayTotalUsd,
  currency,
  canContinue,
  showBack,
  onBack,
  onContinue,
  continueLabel = "Continue",
  hideContinue = false,
}: WizardActionBarProps) {
  return (
    <div
      className="fixed inset-x-0 border-t border-white/[0.08] bg-[#08080f]/90 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      style={{ bottom: WIZARD_CHROME_BOTTOM, zIndex: WIZARD_CHROME_Z }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-2.5">
        {showBack ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 active:bg-white/[0.08]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        ) : (
          <div className="min-w-[44px] shrink-0" aria-hidden />
        )}

        <div className="min-w-0 flex-1 px-1 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
            Current Price
          </p>
          <p className="truncate text-[15px] font-bold tabular-nums text-cyan-300">
            {formatWizardCurrency(displayTotalUsd, currency)}
          </p>
        </div>

        {hideContinue ? (
          <div className="min-w-[44px] shrink-0" aria-hidden />
        ) : (
          <motion.button
            type="button"
            disabled={!canContinue}
            whileTap={canContinue ? { scale: 0.97 } : undefined}
            onClick={onContinue}
            className={`flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-bold transition-all duration-200 ${
              canContinue
                ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white shadow-[0_4px_24px_rgba(6,182,212,0.35)]"
                : "cursor-not-allowed bg-white/[0.06] text-white/25"
            }`}
          >
            <span className="hidden min-[360px]:inline">{continueLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
