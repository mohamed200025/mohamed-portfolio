import type { PriceBreakdownItem, PricingCategoryId, WizardCurrency, WizardTimelineId } from "@/components/pricing/types";
import type { ComplexityLevel } from "@/components/pricing/complexity-engine";
import {
  buildPricingCatalog,
  catalogItemVisibleInCategory,
  priceForCurrency,
  type PricingCatalog,
  type PricingWizardConfig,
} from "./wizard-types";

export type { PricingCatalog, PricingWizardConfig } from "./wizard-types";
export { buildPricingCatalog, priceForCurrency } from "./wizard-types";

const PAGE_OPTION_IDS = new Set(["pages-1-5", "pages-5-10", "pages-10-plus"]);

export interface WizardEstimate {
  total: number;
  breakdown: PriceBreakdownItem[];
}

export interface ComplexityResult {
  score: number;
  level: ComplexityLevel;
  label: string;
}

export interface TimelineAdjustedEstimate {
  baseAmount: number;
  adjustmentAmount: number;
  finalAmount: number;
  multiplier: number;
}

export function getTimelineMultiplier(catalog: PricingCatalog, id: WizardTimelineId): number {
  const row = catalog.timelines.find((t) => t.id === id);
  return row ? Number(row.multiplier) : 1;
}

export function getComplexityLevel(catalog: PricingCatalog, score: number): ComplexityLevel {
  for (const row of catalog.complexityLevels) {
    if (score >= row.score_min && score <= row.score_max) {
      return row.id;
    }
  }
  return catalog.complexityLevels[catalog.complexityLevels.length - 1]?.id ?? "complex";
}

export function getComplexityPriceMultiplier(catalog: PricingCatalog, level: ComplexityLevel): number {
  const row = catalog.complexityLevels.find((c) => c.id === level);
  return row ? Number(row.price_multiplier) : 1;
}

export function getComplexityLabel(catalog: PricingCatalog, level: ComplexityLevel): string {
  return catalog.complexityLevels.find((c) => c.id === level)?.name ?? level;
}

export function getDeliveryDuration(
  catalog: PricingCatalog,
  level: ComplexityLevel,
  timelineId: WizardTimelineId,
): string {
  const row = catalog.complexityLevels.find((c) => c.id === level);
  if (!row) return "";
  const map: Record<WizardTimelineId, string> = {
    flexible: row.duration_flexible,
    standard: row.duration_standard,
    fast: row.duration_fast,
    urgent: row.duration_urgent,
  };
  return map[timelineId] ?? row.duration_standard;
}

export function calculateComplexity(catalog: PricingCatalog, requirementIds: string[]): ComplexityResult {
  let featureScore = 0;
  let pageScore = 0;

  for (const id of requirementIds) {
    const item = catalog.itemsById.get(id);
    if (!item) continue;
    if (PAGE_OPTION_IDS.has(id)) {
      pageScore = Math.max(pageScore, item.complexity_score);
      continue;
    }
    featureScore += item.complexity_score;
  }

  const score = featureScore + pageScore;
  const level = getComplexityLevel(catalog, score);

  return {
    score,
    level,
    label: getComplexityLabel(catalog, level),
  };
}

export function calculateWizardEstimate(
  catalog: PricingCatalog,
  selectedIds: string[],
): WizardEstimate {
  const breakdown: PriceBreakdownItem[] = [];

  for (const id of selectedIds) {
    const item = catalog.itemsById.get(id);
    if (!item) continue;
    breakdown.push({
      id,
      label: item.label,
      amount: priceForCurrency(item, catalog.currency),
    });
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
  return { total, breakdown };
}

export function applyTimelineMultiplier(
  baseAmount: number,
  multiplier: number,
): TimelineAdjustedEstimate {
  const finalAmount = Math.round(baseAmount * multiplier);
  return {
    baseAmount,
    adjustmentAmount: finalAmount - baseAmount,
    finalAmount,
    multiplier,
  };
}

export function applyComplexityMultiplier(baseAmount: number, multiplier: number): number {
  return Math.round(baseAmount * multiplier);
}

export function buildFinalAmount(
  catalog: PricingCatalog,
  baseTotal: number,
  requirements: string[],
  timelineId: WizardTimelineId,
): { finalTotal: number; deliveryDuration: string; complexity: ComplexityResult } {
  const complexity = calculateComplexity(catalog, requirements);
  const complexityMult = getComplexityPriceMultiplier(catalog, complexity.level);
  const withComplexity = applyComplexityMultiplier(baseTotal, complexityMult);
  const timelineMult = getTimelineMultiplier(catalog, timelineId);
  const { finalAmount } = applyTimelineMultiplier(withComplexity, timelineMult);
  const deliveryDuration = getDeliveryDuration(catalog, complexity.level, timelineId);

  return {
    finalTotal: finalAmount,
    deliveryDuration,
    complexity,
  };
}

export interface RequirementOption {
  id: string;
  label: string;
}

export interface RequirementSection {
  id: string;
  title: string;
  options: RequirementOption[];
}

export function getRequirementsForCategory(
  catalog: PricingCatalog,
  categoryId: PricingCategoryId,
): RequirementSection[] {
  const sectionMap = new Map<string, RequirementSection>();

  for (const item of catalog.itemsById.values()) {
    if (!catalogItemVisibleInCategory(item, categoryId)) continue;

    const sectionKey = `${item.section_id}::${item.section_title}`;
    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, {
        id: item.section_id,
        title: item.section_title,
        options: [],
      });
    }
    sectionMap.get(sectionKey)!.options.push({ id: item.id, label: item.label });
  }

  return Array.from(sectionMap.values()).map((section) => ({
    ...section,
    options: section.options.sort((a, b) => a.label.localeCompare(b.label)),
  }));
}

export function getAllRequirementIds(
  catalog: PricingCatalog,
  categoryId: PricingCategoryId,
): string[] {
  return getRequirementsForCategory(catalog, categoryId).flatMap((section) =>
    section.options.map((option) => option.id),
  );
}

export function withCatalogCurrency(
  config: PricingWizardConfig,
  currency: WizardCurrency,
): PricingCatalog {
  return buildPricingCatalog(config, currency);
}
