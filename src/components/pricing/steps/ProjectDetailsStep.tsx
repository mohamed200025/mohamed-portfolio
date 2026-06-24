"use client";

import { motion } from "framer-motion";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import {
  getComplexityBadge,
  getTimelineAdjustmentLabel,
  getTimelinePercentLabel,
  resolveTimelineOptions,
} from "../complexity-engine";
import { formatWizardCurrency } from "../pricing-calculator";
import { PricingProgress } from "../PricingProgress";
import { TimelineOptionCard } from "../TimelineOptionCard";
import { TimelineBadge } from "../TimelineBadge";
import { getTimelineOption } from "../timelines";
import {
  PRICING_WIZARD_TOTAL_STEPS,
  type ComplexityLevel,
  type WizardCurrency,
  type WizardTimelineId,
} from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

const inputClassName =
  "w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/[0.06]";

interface ProjectDetailsStepProps {
  catalog: PricingCatalog;
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  timelineId: WizardTimelineId;
  complexityScore: number;
  complexityLevel: ComplexityLevel;
  deliveryDuration: string;
  baseTotalUsd: number;
  finalTotalUsd: number;
  timelineMultiplier: number;
  currency: WizardCurrency;
  onProjectNameChange: (value: string) => void;
  onProjectDescriptionChange: (value: string) => void;
  onTargetAudienceChange: (value: string) => void;
  onTimelineChange: (id: WizardTimelineId) => void;
}

export function ProjectDetailsStep({
  catalog,
  projectName,
  projectDescription,
  targetAudience,
  timelineId,
  complexityScore,
  complexityLevel,
  deliveryDuration,
  baseTotalUsd,
  finalTotalUsd,
  timelineMultiplier,
  currency,
  onProjectNameChange,
  onProjectDescriptionChange,
  onTargetAudienceChange,
  onTimelineChange,
}: ProjectDetailsStepProps) {
  const timelineOptions = resolveTimelineOptions(catalog, complexityLevel);
  const selectedTimeline = timelineOptions.find((o) => o.id === timelineId) ?? timelineOptions[1];
  const timelineMeta = getTimelineOption(timelineId);
  const adjustmentLabel = getTimelineAdjustmentLabel(timelineMultiplier);
  const percentLabel = getTimelinePercentLabel(timelineMultiplier);

  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={4} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">
          Project Details
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Tell us more about your project so we can generate a professional proposal.
        </p>
      </motion.div>

      <section className="mt-6 space-y-4">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-white/40">
          Project Information
        </h2>

        <div>
          <label htmlFor="project-name" className="mb-1.5 block text-[12px] font-medium text-white/60">
            Project Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            required
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="e.g. Eduvera Learning Platform"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 block text-[12px] font-medium text-white/60"
          >
            Project Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="project-description"
            required
            rows={5}
            value={projectDescription}
            onChange={(e) => onProjectDescriptionChange(e.target.value)}
            placeholder="Describe your project, goals, target users, and any important requirements."
            className={`${inputClassName} min-h-[120px] resize-y`}
          />
        </div>

        <div>
          <label
            htmlFor="target-audience"
            className="mb-1.5 block text-[12px] font-medium text-white/60"
          >
            Target Audience <span className="text-white/30">(optional)</span>
          </label>
          <input
            id="target-audience"
            type="text"
            value={targetAudience}
            onChange={(e) => onTargetAudienceChange(e.target.value)}
            placeholder="e.g. Students, teachers, and training centers"
            className={inputClassName}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-white/40">
          Delivery Planning
        </h2>
        <p className="mt-2 text-[14px] text-white/45">
          Duration is calculated from your project complexity. Pricing updates instantly.
        </p>

        <motion.div
          key={`${complexityLevel}-${deliveryDuration}-${finalTotalUsd}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                Complexity
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-white">
                {getComplexityBadge(complexityLevel)}
                <span className="text-[10px] font-normal text-white/35">({complexityScore} pts)</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                Estimated Duration
              </p>
              <motion.p
                key={deliveryDuration}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-[13px] font-semibold text-cyan-300"
              >
                {deliveryDuration}
              </motion.p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                Price Adjustment
              </p>
              <p
                className={`mt-1 text-[13px] font-semibold ${
                  timelineMultiplier > 1
                    ? "text-amber-400"
                    : timelineMultiplier < 1
                      ? "text-emerald-400"
                      : "text-white/60"
                }`}
              >
                {percentLabel}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
                Final Price
              </p>
              <div className="mt-1 flex items-center gap-2">
                <motion.p
                  key={finalTotalUsd}
                  initial={{ scale: 1.03, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[13px] font-bold tabular-nums text-cyan-300"
                >
                  {formatWizardCurrency(finalTotalUsd, currency)}
                </motion.p>
                <TimelineBadge badge={timelineMeta.badge} />
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-white/30">
            {selectedTimeline.title} · {adjustmentLabel}
          </p>
        </motion.div>

        <div className="mt-4 space-y-2.5">
          {timelineOptions.map((option, index) => (
            <TimelineOptionCard
              key={option.id}
              option={option}
              selected={timelineId === option.id}
              onSelect={() => onTimelineChange(option.id)}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
