"use client";

import { motion } from "framer-motion";
import { PRICING_CATEGORIES } from "../categories";
import { PricingCategoryCard } from "../PricingCategoryCard";
import { PricingProgress } from "../PricingProgress";
import { PRICING_WIZARD_TOTAL_STEPS, type PricingCategoryId } from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

interface CategorySelectionStepProps {
  selectedCategoryId: PricingCategoryId | null;
  onSelectCategory: (id: PricingCategoryId) => void;
}

export function CategorySelectionStep({
  selectedCategoryId,
  onSelectCategory,
}: CategorySelectionStepProps) {
  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={1} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">
          What would you like to build?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Select the type of project you need so we can generate an accurate estimate.
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRICING_CATEGORIES.map((category, index) => (
          <PricingCategoryCard
            key={category.id}
            category={category}
            selected={selectedCategoryId === category.id}
            onSelect={() => onSelectCategory(category.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
