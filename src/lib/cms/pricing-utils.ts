import type {
  PricingCurrency,
  PricingData,
  PricingEstimate,
  PricingFeature,
  PricingProjectType,
  PricingTimelineOption,
} from "@/types/cms";

/** Prices in DB are stored in EUR. Convert for display. */
export function convertFromEur(amount: number, currency: PricingCurrency): number {
  return Math.round(amount * Number(currency.exchange_rate));
}

export function timelineMultiplier(percentageModifier: number): number {
  return 1 + percentageModifier / 100;
}

export function calculatePricingEstimate(
  data: PricingData,
  projectTypeId: string,
  featureIds: string[],
  timelineId: string,
  currencyCode: string
): PricingEstimate {
  const projectType =
    data.projectTypes.find((p) => p.id === projectTypeId) ?? data.projectTypes[0];
  const timeline =
    data.timelineOptions.find((t) => t.id === timelineId) ??
    data.timelineOptions.find((t) => t.title === "Standard") ??
    data.timelineOptions[0];
  const currency =
    data.currencies.find((c) => c.code === currencyCode && c.enabled) ??
    data.currencies.find((c) => c.code === data.settings.default_currency) ??
    data.currencies[0];

  if (!projectType || !timeline || !currency) {
    return emptyEstimate(currency);
  }

  const selectedFeatures = data.features.filter((f) => featureIds.includes(f.id));
  const featureMinEur = selectedFeatures.reduce((s, f) => s + Number(f.min_price), 0);
  const featureMaxEur = selectedFeatures.reduce((s, f) => s + Number(f.max_price), 0);

  const baseMinEur = Number(projectType.min_price);
  const baseMaxEur = Number(projectType.max_price);
  const subtotalMinEur = baseMinEur + featureMinEur;
  const subtotalMaxEur = baseMaxEur + featureMaxEur;

  const mult = timelineMultiplier(Number(timeline.percentage_modifier));
  const estimateMinEur = Math.round(subtotalMinEur * mult);
  const estimateMaxEur = Math.round(subtotalMaxEur * mult);

  const complexity = resolveComplexity(selectedFeatures.length, baseMaxEur);

  return {
    currency,
    baseMin: convertFromEur(baseMinEur, currency),
    baseMax: convertFromEur(baseMaxEur, currency),
    featureMin: convertFromEur(featureMinEur, currency),
    featureMax: convertFromEur(featureMaxEur, currency),
    subtotalMin: convertFromEur(subtotalMinEur, currency),
    subtotalMax: convertFromEur(subtotalMaxEur, currency),
    estimateMin: convertFromEur(estimateMinEur, currency),
    estimateMax: convertFromEur(estimateMaxEur, currency),
    timelineMultiplier: mult,
    timeEstimate: timeline.title,
    complexity,
    complexityLabel: complexity.charAt(0).toUpperCase() + complexity.slice(1),
    projectTypeTitle: projectType.title,
    timelineTitle: timeline.title,
    selectedFeatures: selectedFeatures.map((f) => ({
      id: f.id,
      title: f.title,
      minPrice: convertFromEur(Number(f.min_price), currency),
      maxPrice: convertFromEur(Number(f.max_price), currency),
    })),
  };
}

function emptyEstimate(currency?: PricingCurrency): PricingEstimate {
  const fallback: PricingCurrency = currency ?? {
    id: "",
    code: "EUR",
    symbol: "€",
    exchange_rate: 1,
    enabled: true,
    sort_order: 0,
  };
  return {
    currency: fallback,
    baseMin: 0,
    baseMax: 0,
    featureMin: 0,
    featureMax: 0,
    subtotalMin: 0,
    subtotalMax: 0,
    estimateMin: 0,
    estimateMax: 0,
    timelineMultiplier: 1,
    timeEstimate: "—",
    complexity: "medium",
    complexityLabel: "Medium",
    projectTypeTitle: "",
    timelineTitle: "",
    selectedFeatures: [],
  };
}

function resolveComplexity(featureCount: number, baseMaxEur: number): "low" | "medium" | "high" {
  let score = featureCount;
  if (baseMaxEur >= 4000) score += 3;
  else if (baseMaxEur >= 1500) score += 2;
  else if (baseMaxEur >= 800) score += 1;
  if (score <= 2) return "low";
  if (score <= 5) return "medium";
  return "high";
}

export function formatPrice(amount: number, currency: Pick<PricingCurrency, "symbol" | "code">): string {
  const formatted = amount.toLocaleString("en-US");
  if (currency.code === "DZD") return `${formatted} ${currency.symbol}`;
  return `${currency.symbol}${formatted}`;
}

export function formatPriceRange(
  min: number,
  max: number,
  currency: Pick<PricingCurrency, "symbol" | "code">
): string {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
}

export function buildPricingData(
  settings: PricingData["settings"],
  currencies: PricingCurrency[],
  projectTypes: PricingProjectType[],
  features: PricingFeature[],
  timelineOptions: PricingTimelineOption[]
): PricingData {
  return {
    settings,
    currencies: [...currencies].sort((a, b) => a.sort_order - b.sort_order),
    projectTypes: [...projectTypes].sort((a, b) => a.sort_order - b.sort_order),
    features: [...features].sort((a, b) => a.sort_order - b.sort_order),
    timelineOptions: [...timelineOptions].sort((a, b) => a.sort_order - b.sort_order),
  };
}
