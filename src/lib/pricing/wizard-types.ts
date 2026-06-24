import type { PricingCategoryId, WizardCurrency, WizardTimelineId } from "@/components/pricing/types";
import type { ComplexityLevel } from "@/components/pricing/complexity-engine";

export interface PricingWizardSettings {
  id: number;
  usd_to_dzd: number;
  eur_to_dzd: number;
  default_currency: WizardCurrency;
  updated_at: string;
}

export interface PricingServiceRow {
  id: string;
  name: string;
  category_id: string;
  section_id: string;
  section_title: string;
  price_dzd: number;
  price_eur: number;
  price_usd: number;
  complexity_score: number;
  active: boolean;
  sort_order: number;
}

export interface PricingWizardFeatureRow {
  id: string;
  name: string;
  category_ids: string[];
  section_id: string;
  section_title: string;
  price_dzd: number;
  price_eur: number;
  price_usd: number;
  complexity_score: number;
  active: boolean;
  sort_order: number;
}

export interface PricingTimelineSettingRow {
  id: WizardTimelineId;
  name: string;
  description: string;
  badge: string;
  multiplier: number;
  active: boolean;
  sort_order: number;
}

export interface PricingComplexitySettingRow {
  id: ComplexityLevel;
  name: string;
  price_multiplier: number;
  score_min: number;
  score_max: number;
  duration_flexible: string;
  duration_standard: string;
  duration_fast: string;
  duration_urgent: string;
  sort_order: number;
}

export interface PricingWizardConfig {
  settings: PricingWizardSettings;
  services: PricingServiceRow[];
  features: PricingWizardFeatureRow[];
  timelines: PricingTimelineSettingRow[];
  complexityLevels: PricingComplexitySettingRow[];
}

export interface CatalogPriceItem {
  id: string;
  label: string;
  price_dzd: number;
  price_eur: number;
  price_usd: number;
  complexity_score: number;
  section_id: string;
  section_title: string;
  kind: "service" | "feature";
  category_ids: string[];
}

export interface PricingCatalog {
  settings: PricingWizardSettings;
  itemsById: Map<string, CatalogPriceItem>;
  timelines: PricingTimelineSettingRow[];
  complexityLevels: PricingComplexitySettingRow[];
  currency: WizardCurrency;
}

export function priceForCurrency(
  item: Pick<CatalogPriceItem, "price_dzd" | "price_eur" | "price_usd">,
  currency: WizardCurrency,
): number {
  if (currency === "DZD") return Number(item.price_dzd);
  if (currency === "EUR") return Number(item.price_eur);
  return Number(item.price_usd);
}

export function buildPricingCatalog(
  config: PricingWizardConfig,
  currency: WizardCurrency = config.settings.default_currency,
): PricingCatalog {
  const itemsById = new Map<string, CatalogPriceItem>();

  for (const service of config.services) {
    if (!service.active) continue;
    itemsById.set(service.id, {
      id: service.id,
      label: service.name,
      price_dzd: Number(service.price_dzd),
      price_eur: Number(service.price_eur),
      price_usd: Number(service.price_usd),
      complexity_score: service.complexity_score,
      section_id: service.section_id,
      section_title: service.section_title,
      kind: "service",
      category_ids: [service.category_id],
    });
  }

  for (const feature of config.features) {
    if (!feature.active) continue;
    itemsById.set(feature.id, {
      id: feature.id,
      label: feature.name,
      price_dzd: Number(feature.price_dzd),
      price_eur: Number(feature.price_eur),
      price_usd: Number(feature.price_usd),
      complexity_score: feature.complexity_score,
      section_id: feature.section_id,
      section_title: feature.section_title,
      kind: "feature",
      category_ids: feature.category_ids ?? [],
    });
  }

  return {
    settings: config.settings,
    itemsById,
    timelines: config.timelines.filter((t) => t.active).sort((a, b) => a.sort_order - b.sort_order),
    complexityLevels: [...config.complexityLevels].sort((a, b) => a.sort_order - b.sort_order),
    currency,
  };
}

export function catalogItemVisibleInCategory(
  item: CatalogPriceItem,
  categoryId: PricingCategoryId,
): boolean {
  return item.category_ids.includes(categoryId);
}
