"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRICING_CATEGORIES } from "../categories";
import { formatClientPhone } from "../client-info";
import { getTimelineAdjustmentLabel, getTimelinePercentLabel } from "../complexity-engine";
import { PRICING_INDUSTRIES } from "../industries";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import {
  applyComplexityMultiplier,
  applyTimelineMultiplier,
  getComplexityPriceMultiplier,
} from "@/lib/pricing/catalog";
import { formatWizardCurrency } from "../pricing-calculator";
import { PricingProgress } from "../PricingProgress";
import { TimelineBadge } from "../TimelineBadge";
import { getTimelineOption } from "../timelines";
import {
  PRICING_WIZARD_TOTAL_STEPS,
  type PriceBreakdownItem,
  type PricingCategoryId,
  type PricingIndustryId,
  type ComplexityLevel,
  type WizardCurrency,
  type WizardTimelineId,
} from "../types";
import type { ClientInformation } from "../client-info";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

const PAGE_REQUIREMENT_IDS = new Set(["pages-1-5", "pages-5-10", "pages-10-plus"]);

function SummarySection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-xl"
    >
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-cyan-400/80">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="border-b border-white/[0.04] py-2.5 last:border-0 last:pb-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-0.5 text-[13px] leading-snug text-white/85">{value}</p>
    </div>
  );
}

function FeatureList({ items, currency }: { items: PriceBreakdownItem[]; currency: WizardCurrency }) {
  if (items.length === 0) {
    return <p className="text-[12px] text-white/35">None selected</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item.id} className="flex items-baseline justify-between gap-2 text-[12px]">
          <span className="text-white/70">{item.label}</span>
          <span className="shrink-0 tabular-nums text-cyan-300/80">
            {formatWizardCurrency(item.amount, currency)}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface ProposalReviewStepProps {
  catalog: PricingCatalog;
  categoryId: PricingCategoryId | null;
  industryId: PricingIndustryId | null;
  projectName: string;
  projectDescription: string;
  priceBreakdown: PriceBreakdownItem[];
  timelineId: WizardTimelineId;
  deliveryDuration: string;
  baseTotalUsd: number;
  finalTotalUsd: number;
  timelineMultiplier: number;
  complexityLevel: ComplexityLevel;
  currency: WizardCurrency;
  client: ClientInformation;
  proposalConfirmed: boolean;
  onProposalConfirmedChange: (confirmed: boolean) => void;
}

export function ProposalReviewStep({
  catalog,
  categoryId,
  industryId,
  projectName,
  projectDescription,
  priceBreakdown,
  timelineId,
  deliveryDuration,
  baseTotalUsd,
  finalTotalUsd,
  timelineMultiplier,
  complexityLevel,
  currency,
  client,
  proposalConfirmed,
  onProposalConfirmedChange,
}: ProposalReviewStepProps) {
  const categoryTitle =
    PRICING_CATEGORIES.find((c) => c.id === categoryId)?.title ?? "—";
  const industryTitle =
    PRICING_INDUSTRIES.find((i) => i.id === industryId)?.title ?? "—";
  const timeline = getTimelineOption(timelineId);
  const complexityMult = getComplexityPriceMultiplier(catalog, complexityLevel);
  const afterComplexity = applyComplexityMultiplier(baseTotalUsd, complexityMult);
  const { adjustmentAmount } = applyTimelineMultiplier(afterComplexity, timelineMultiplier);
  const discountUsd = adjustmentAmount < 0 ? Math.abs(adjustmentAmount) : 0;
  const deliveryAdjustmentUsd = adjustmentAmount > 0 ? adjustmentAmount : 0;
  const adjustmentLabel = getTimelineAdjustmentLabel(timelineMultiplier);
  const percentLabel = getTimelinePercentLabel(timelineMultiplier);

  const pageItems = priceBreakdown.filter((item) => PAGE_REQUIREMENT_IDS.has(item.id));
  const featureItems = priceBreakdown.filter((item) => !PAGE_REQUIREMENT_IDS.has(item.id));

  const resolvedPages =
    pageItems.length > 0 ? pageItems.map((p) => p.label).join(", ") : "—";

  const clientPhone = formatClientPhone(client);
  const clientEmail = client.email.trim() || "—";

  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={6} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">
          Project Proposal Summary
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Review every detail, then request your final quote on the next step.
        </p>
      </motion.div>

      <div className="mt-6 space-y-3">
        <SummarySection title="Project Overview" delay={0.05}>
          <SummaryRow label="Project Type" value={categoryTitle} />
          <SummaryRow label="Industry" value={industryTitle} />
          <SummaryRow label="Project Name" value={projectName} />
          <SummaryRow label="Project Description" value={projectDescription} />
        </SummarySection>

        <SummarySection title="Scope & Delivery" delay={0.1}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
            Selected Features
          </p>
          <FeatureList items={featureItems} currency={currency} />
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <SummaryRow label="Selected Pages" value={resolvedPages} />
          </div>
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <SummaryRow
              label="Selected Delivery Option"
              value={`${timeline.title} · ${timeline.badge}`}
            />
            <SummaryRow label="Estimated Duration" value={deliveryDuration} />
          </div>
        </SummarySection>

        <SummarySection title="Client Details" delay={0.15}>
          <SummaryRow label="Client Name" value={client.fullName.trim()} />
          <SummaryRow label="Phone Number" value={clientPhone} />
          <SummaryRow label="Email" value={clientEmail} />
        </SummarySection>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#0c0c14]/95 via-[#0a0a12]/95 to-[#08080f]/95 p-4 shadow-[0_0_40px_rgba(6,182,212,0.1)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.05] via-transparent to-violet-500/[0.05]" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/90">
                Pricing Summary
              </h2>
              <TimelineBadge badge={timeline.badge} />
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between gap-2">
                <span className="text-white/50">Subtotal</span>
                <span className="tabular-nums text-white/80">
                  {formatWizardCurrency(baseTotalUsd, currency)}
                </span>
              </div>
              {discountUsd > 0 && (
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">
                    Discounts ({adjustmentLabel})
                  </span>
                  <span className="tabular-nums text-emerald-400">
                    −{formatWizardCurrency(discountUsd, currency)}
                  </span>
                </div>
              )}
              {deliveryAdjustmentUsd > 0 && (
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">
                    Delivery Adjustment ({percentLabel})
                  </span>
                  <span className="tabular-nums text-amber-400">
                    +{formatWizardCurrency(deliveryAdjustmentUsd, currency)}
                  </span>
                </div>
              )}
              {discountUsd === 0 && deliveryAdjustmentUsd === 0 && (
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Delivery Adjustment</span>
                  <span className="text-white/40">{adjustmentLabel}</span>
                </div>
              )}
            </div>

            <div className="relative mt-4 overflow-hidden rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-violet-600/15 px-4 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_60%)]" />
              <div className="relative flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">
                    Final Price
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">Estimated project total</p>
                </div>
                <motion.p
                  key={finalTotalUsd}
                  initial={{ scale: 1.04, opacity: 0.85 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-[26px] font-bold tabular-nums text-transparent"
                >
                  {formatWizardCurrency(finalTotalUsd, currency)}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
            proposalConfirmed
              ? "border-cyan-400/40 bg-cyan-500/10"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12]"
          }`}
        >
          <input
            type="checkbox"
            checked={proposalConfirmed}
            onChange={(e) => onProposalConfirmedChange(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
              proposalConfirmed
                ? "border-cyan-400 bg-cyan-500/30"
                : "border-white/20 bg-white/[0.04]"
            }`}
          >
            {proposalConfirmed && <Check className="h-3.5 w-3.5 text-cyan-300" strokeWidth={2.5} />}
          </span>
          <span className="text-[13px] leading-snug text-white/75">
            I confirm that all information is correct.
          </span>
        </motion.label>
      </div>
    </div>
  );
}
