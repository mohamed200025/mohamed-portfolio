"use client";

import { motion } from "framer-motion";
import { PRICING_CATEGORIES } from "../categories";
import { PricingProgress } from "../PricingProgress";
import { PricingRequirementOption } from "../PricingRequirementOption";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import { getRequirementsForCategory } from "../requirements";
import { PRICING_WIZARD_TOTAL_STEPS, type PricingCategoryId } from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

interface RequirementsSelectionStepProps {
  catalog: PricingCatalog;
  categoryId: PricingCategoryId;
  selectedRequirements: string[];
  onToggleRequirement: (id: string) => void;
}

export function RequirementsSelectionStep({
  catalog,
  categoryId,
  selectedRequirements,
  onToggleRequirement,
}: RequirementsSelectionStepProps) {
  const sections = getRequirementsForCategory(catalog, categoryId);
  const categoryTitle = PRICING_CATEGORIES.find((c) => c.id === categoryId)?.title ?? "Project";

  let optionIndex = 0;

  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={3} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/70">
          {categoryTitle}
        </p>
        <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-white">
          Project Requirements
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Select the features and functionality you need so we can generate an accurate estimate.
        </p>
      </motion.div>

      <div className="mt-6 space-y-6">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-white/40">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {section.options.map((option) => {
                const idx = optionIndex++;
                const selected = selectedRequirements.includes(option.id);
                return (
                  <PricingRequirementOption
                    key={option.id}
                    label={option.label}
                    selected={selected}
                    onToggle={() => onToggleRequirement(option.id)}
                    index={idx}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
