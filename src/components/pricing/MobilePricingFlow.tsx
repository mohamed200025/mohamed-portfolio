"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PRICING_WIZARD_TOTAL_STEPS } from "./types";
import { usePricingWizard } from "./usePricingWizard";
import { PricingWizardSteps } from "./PricingWizardSteps";
import { WizardStickyChrome } from "./WizardStickyChrome";

export function MobilePricingFlow() {
  const wizard = usePricingWizard();
  const {
    flow,
    catalog,
    timelineMultiplier,
    setCurrency,
    canContinue,
    handleBack,
    handleContinue,
  } = wizard;

  if (!catalog) return null;

  return (
    <div className="relative min-h-[calc(100dvh-80px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={flow.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <PricingWizardSteps wizard={wizard} layout="mobile" />
        </motion.div>
      </AnimatePresence>

      <WizardStickyChrome
        catalog={catalog}
        key={flow.step}
        step={flow.step}
        displayTotalUsd={flow.finalEstimatedTotal}
        baseUsd={flow.estimatedTotal}
        breakdown={flow.priceBreakdown}
        timelineId={flow.timelineId}
        timelineMultiplier={timelineMultiplier}
        complexityLevel={flow.complexityLevel}
        complexityScore={flow.complexityScore}
        deliveryDuration={flow.deliveryDuration}
        client={flow.client}
        currency={flow.currency}
        onCurrencyChange={setCurrency}
        canContinue={canContinue}
        showBack={flow.step > 1}
        onBack={handleBack}
        onContinue={handleContinue}
        continueLabel="Continue"
        hideContinue={flow.step === 7}
      />

      <span className="sr-only" aria-live="polite">
        Pricing wizard step {flow.step} of {PRICING_WIZARD_TOTAL_STEPS}
      </span>
    </div>
  );
}
