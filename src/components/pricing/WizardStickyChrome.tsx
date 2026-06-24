"use client";

import { useState } from "react";
import { WizardActionBar } from "./WizardActionBar";
import { WizardPriceDrawer } from "./WizardPriceDrawer";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import type {
  ClientInformation,
  ComplexityLevel,
  PriceBreakdownItem,
  PricingFlowStep,
  WizardCurrency,
  WizardTimelineId,
} from "./types";

interface WizardStickyChromeProps {
  catalog: PricingCatalog;
  step: PricingFlowStep;
  displayTotalUsd: number;
  baseUsd: number;
  breakdown: PriceBreakdownItem[];
  timelineId: WizardTimelineId;
  timelineMultiplier: number;
  complexityLevel: ComplexityLevel;
  complexityScore: number;
  deliveryDuration: string;
  client: ClientInformation;
  currency: WizardCurrency;
  onCurrencyChange: (currency: WizardCurrency) => void;
  canContinue: boolean;
  showBack: boolean;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  hideContinue?: boolean;
}

export function WizardStickyChrome({
  catalog,
  step,
  displayTotalUsd,
  baseUsd,
  breakdown,
  timelineId,
  timelineMultiplier,
  complexityLevel,
  complexityScore,
  deliveryDuration,
  client,
  currency,
  onCurrencyChange,
  canContinue,
  showBack,
  onBack,
  onContinue,
  continueLabel,
  hideContinue = false,
}: WizardStickyChromeProps) {
  const [drawerExpanded, setDrawerExpanded] = useState(false);

  return (
    <>
      <WizardPriceDrawer
        catalog={catalog}
        step={step}
        displayTotalUsd={displayTotalUsd}
        baseUsd={baseUsd}
        breakdown={breakdown}
        timelineId={timelineId}
        timelineMultiplier={timelineMultiplier}
        complexityLevel={complexityLevel}
        complexityScore={complexityScore}
        deliveryDuration={deliveryDuration}
        client={client}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        expanded={drawerExpanded}
        onExpandedChange={setDrawerExpanded}
      />
      <WizardActionBar
        displayTotalUsd={displayTotalUsd}
        currency={currency}
        canContinue={canContinue}
        showBack={showBack}
        onBack={onBack}
        onContinue={onContinue}
        continueLabel={continueLabel}
        hideContinue={hideContinue}
      />
    </>
  );
}
