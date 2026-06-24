"use client";

import { motion } from "framer-motion";
import { PRICING_INDUSTRIES } from "../industries";
import { PricingIndustryCard } from "../PricingIndustryCard";
import { PricingProgress } from "../PricingProgress";
import { PRICING_WIZARD_TOTAL_STEPS, type PricingIndustryId } from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

interface IndustrySelectionStepProps {
  selectedIndustryId: PricingIndustryId | null;
  onSelectIndustry: (id: PricingIndustryId) => void;
}

export function IndustrySelectionStep({
  selectedIndustryId,
  onSelectIndustry,
}: IndustrySelectionStepProps) {
  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={2} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">
          What industry are you in?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Select the industry or business sector your project belongs to.
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
        {PRICING_INDUSTRIES.map((industry, index) => (
          <PricingIndustryCard
            key={industry.id}
            title={industry.title}
            icon={industry.icon}
            iconGradient={industry.iconGradient}
            selected={selectedIndustryId === industry.id}
            onSelect={() => onSelectIndustry(industry.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
