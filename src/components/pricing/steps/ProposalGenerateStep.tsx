"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PricingProgress } from "../PricingProgress";
import { ProposalQuoteActions } from "../ProposalQuoteActions";
import { PRICING_WIZARD_TOTAL_STEPS, type PricingFlowState } from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";
import { useProposalSubmission } from "../useProposalSubmission";

type ProposalSubmission = ReturnType<typeof useProposalSubmission>;

interface ProposalGenerateStepProps {
  flow: PricingFlowState;
  layout?: "mobile" | "desktop";
  submission?: ProposalSubmission;
}

export function ProposalGenerateStep({
  flow,
  layout = "mobile",
  submission: externalSubmission,
}: ProposalGenerateStepProps) {
  const internalSubmission = useProposalSubmission(flow);
  const submission = externalSubmission ?? internalSubmission;
  const { success } = submission;
  const isDesktop = layout === "desktop";
  const stepPadding = isDesktop
    ? "px-0 pt-0 lg:pb-8"
    : `px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`;

  if (success && isDesktop) {
    return (
      <div className={stepPadding}>
        <PricingProgress currentStep={7} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-cyan-500/[0.05] p-8 backdrop-blur-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Request Submitted Successfully</h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/55">
                Your project request has been received. A proposal has been generated and assigned
                reference ID{" "}
                <span className="font-mono font-bold text-cyan-300">{success.proposalId}</span>.
                Use the panel on the right to download your PDF or contact us on WhatsApp.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={stepPadding}>
        <PricingProgress currentStep={7} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />
        <div className="mt-8">
          <ProposalQuoteActions flow={flow} submission={submission} variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <div className={stepPadding}>
      <PricingProgress currentStep={7} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white lg:text-3xl">
          Request Final Quote
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/45 lg:text-[15px]">
          Submit your project request. We will generate your proposal PDF, save your quote, and
          assign a unique reference ID.
        </p>
      </motion.div>

      {!isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <ProposalQuoteActions flow={flow} submission={submission} variant="inline" />
        </motion.div>
      )}

      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
        >
          <p className="text-[14px] leading-relaxed text-white/50">
            Review your estimate in the summary panel, then use{" "}
            <span className="font-medium text-white/75">Request Final Quote</span> to generate your
            proposal PDF and save your project request securely.
          </p>
        </motion.div>
      )}
    </div>
  );
}
