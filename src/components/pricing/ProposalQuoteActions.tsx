"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { formatWizardCurrency } from "./pricing-calculator";
import type { PricingFlowState } from "./types";
import type { useProposalSubmission } from "./useProposalSubmission";

type ProposalSubmission = ReturnType<typeof useProposalSubmission>;

interface ProposalQuoteActionsProps {
  flow: PricingFlowState;
  submission: ProposalSubmission;
  variant?: "inline" | "sidebar";
}

export function ProposalQuoteActions({
  flow,
  submission,
  variant = "inline",
}: ProposalQuoteActionsProps) {
  const {
    isSubmitting,
    error,
    success,
    handleRequestQuote,
    handleDownload,
    whatsAppUrl,
  } = submission;

  const displayPrice = formatWizardCurrency(flow.finalEstimatedTotal, flow.currency);
  const compact = variant === "sidebar";

  if (success) {
    return (
      <div
        className={`rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-cyan-500/[0.05] backdrop-blur-xl ${
          compact ? "p-4" : "p-6"
        }`}
      >
        <div className={compact ? "text-left" : "flex flex-col items-center text-center"}>
          <div
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 ${
              compact ? "" : "mx-auto mb-4 h-14 w-14"
            }`}
          >
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-[15px] font-bold text-white">Request Submitted</h3>
          <p className="mt-2 text-[12px] leading-relaxed text-white/55">
            Proposal reference:
          </p>
          <p className="mt-1 font-mono text-[14px] font-bold tracking-wide text-cyan-300">
            {success.proposalId}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={!success.pdfUrl && !success.pdfBase64}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-[13px] font-bold text-white shadow-[0_4px_24px_rgba(6,182,212,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download Proposal PDF
          </motion.button>

          {whatsAppUrl && (
            <motion.a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-[13px] font-bold text-emerald-200"
            >
              <MessageCircle className="h-4 w-4" />
              Contact via WhatsApp
            </motion.a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl ${
        compact ? "p-4" : "p-5"
      }`}
    >
      {!compact && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80">
          Final Quote
        </p>
      )}

      <div className="space-y-2 text-[12px]">
        <div className="flex justify-between gap-2 border-b border-white/[0.06] pb-2">
          <span className="text-white/45">Client</span>
          <span className="text-right font-medium text-white/85">{flow.client.fullName}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-white/[0.06] pb-2">
          <span className="text-white/45">Project</span>
          <span className="text-right font-medium text-white/85">
            {flow.projectName.trim() || "—"}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-white/45">Estimated total</span>
          <span className="font-bold tabular-nums text-cyan-300">{displayPrice}</span>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      <motion.button
        type="button"
        disabled={isSubmitting}
        whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
        onClick={handleRequestQuote}
        className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 text-[14px] font-bold text-white shadow-[0_4px_24px_rgba(6,182,212,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting request…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Request Final Quote
          </>
        )}
      </motion.button>

      <p className="mt-2 text-center text-[11px] leading-relaxed text-white/35">
        Generates your proposal PDF and saves your quote securely.
      </p>
    </div>
  );
}
