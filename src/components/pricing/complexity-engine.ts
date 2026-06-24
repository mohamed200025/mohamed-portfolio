import type { PricingCatalog } from "@/lib/pricing/catalog";
import {
  buildFinalAmount,
  calculateComplexity,
  calculateWizardEstimate,
  getAllRequirementIds,
  getDeliveryDuration,
  getRequirementsForCategory,
  getTimelineMultiplier,
} from "@/lib/pricing/catalog";
import { WIZARD_TIMELINE_OPTIONS } from "./timelines";
import type { PricingFlowState } from "./types";
import type { WizardTimelineId } from "./timelines";

export type ComplexityLevel = "simple" | "medium" | "complex";

export type { RequirementOption, RequirementSection } from "@/lib/pricing/catalog";
export {
  calculateComplexity,
  calculateWizardEstimate,
  getAllRequirementIds,
  getDeliveryDuration,
  getRequirementsForCategory,
  getTimelineMultiplier,
} from "@/lib/pricing/catalog";
export { applyTimelineMultiplier } from "@/lib/pricing/catalog";

export function getDefaultDeliveryDuration(catalog: PricingCatalog): string {
  return getDeliveryDuration(catalog, "simple", "standard");
}

export function getTimelineAdjustmentLabel(multiplier: number): string {
  const percent = Math.round((multiplier - 1) * 100);
  if (percent === 0) return "0% adjustment";
  if (percent < 0) return `${percent}% adjustment`;
  return `+${percent}% adjustment`;
}

export function getTimelinePercentLabel(multiplier: number): string {
  const percent = Math.round((multiplier - 1) * 100);
  if (percent === 0) return "0%";
  if (percent < 0) return `${percent}%`;
  return `+${percent}%`;
}

export function getComplexityBadge(level: ComplexityLevel): string {
  if (level === "simple") return "🟢 Simple";
  if (level === "medium") return "🟡 Medium";
  return "🔴 Advanced";
}

export type PricingDeliveryUpdate = Pick<
  PricingFlowState,
  | "requirements"
  | "estimatedTotal"
  | "priceBreakdown"
  | "complexityScore"
  | "complexityLevel"
  | "deliveryDuration"
  | "finalEstimatedTotal"
>;

export function buildPricingDeliveryUpdate(
  catalog: PricingCatalog,
  requirements: string[],
  timelineId: WizardTimelineId,
): PricingDeliveryUpdate {
  const { total, breakdown } = calculateWizardEstimate(catalog, requirements);
  const { finalTotal, deliveryDuration, complexity } = buildFinalAmount(
    catalog,
    total,
    requirements,
    timelineId,
  );

  return {
    requirements,
    estimatedTotal: total,
    priceBreakdown: breakdown,
    complexityScore: complexity.score,
    complexityLevel: complexity.level,
    deliveryDuration,
    finalEstimatedTotal: finalTotal,
  };
}

export function buildFinalTotalUpdate(
  catalog: PricingCatalog,
  baseTotal: number,
  requirements: string[],
  timelineId: WizardTimelineId,
): Pick<PricingFlowState, "deliveryDuration" | "finalEstimatedTotal"> {
  const { finalTotal, deliveryDuration } = buildFinalAmount(
    catalog,
    baseTotal,
    requirements,
    timelineId,
  );

  return {
    deliveryDuration,
    finalEstimatedTotal: finalTotal,
  };
}

export function resolveTimelineOptions(catalog: PricingCatalog, level: ComplexityLevel) {
  return WIZARD_TIMELINE_OPTIONS.map((option) => {
    const multiplier = getTimelineMultiplier(catalog, option.id);
    return {
      ...option,
      duration: getDeliveryDuration(catalog, level, option.id),
      multiplier,
      adjustmentLabel: getTimelineAdjustmentLabel(multiplier),
    };
  });
}

export type ResolvedTimelineOption = ReturnType<typeof resolveTimelineOptions>[number];
