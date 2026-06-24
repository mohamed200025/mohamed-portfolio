"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PricingWizardFooterProps {
  canContinue: boolean;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

export function PricingWizardFooter({
  canContinue,
  onBack,
  onContinue,
  continueLabel = "Continue",
}: PricingWizardFooterProps) {
  return (
    <div className="fixed bottom-[calc(68px+env(safe-area-inset-bottom))] left-0 right-0 z-40 mx-auto max-w-lg px-5">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a12]/90 p-3 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.4)]">
        <div className={`flex gap-3 ${onBack ? "" : ""}`}>
          {onBack && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] text-white/70 transition-colors active:bg-white/[0.08]"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          )}
          <motion.button
            type="button"
            disabled={!canContinue}
            whileTap={canContinue ? { scale: 0.98 } : undefined}
            onClick={onContinue}
            className={`flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all duration-300 ${
              canContinue
                ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-white shadow-[0_8px_32px_rgba(6,182,212,0.35)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.45)]"
                : "cursor-not-allowed bg-white/[0.06] text-white/25"
            }`}
          >
            {continueLabel}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
