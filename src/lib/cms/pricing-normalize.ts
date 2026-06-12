import type {
  PricingCurrency,
  PricingFeature,
  PricingProjectType,
  PricingSettings,
  PricingTimelineOption,
} from "@/types/cms";
import { defaultPricingData } from "./defaults";

export function normalizePricingSettings(row: Record<string, unknown>): PricingSettings {
  return {
    id: Number(row.id) || 1,
    badge: String(row.badge ?? defaultPricingData.settings.badge),
    title_prefix: String(row.title_prefix ?? defaultPricingData.settings.title_prefix),
    title_highlight: String(row.title_highlight ?? defaultPricingData.settings.title_highlight),
    subtitle: String(row.subtitle ?? defaultPricingData.settings.subtitle),
    default_currency: String(
      row.default_currency ?? row.default_currency_code ?? defaultPricingData.settings.default_currency
    ),
    trust_items: defaultPricingData.settings.trust_items,
  };
}

export function normalizePricingCurrency(row: Record<string, unknown>): PricingCurrency {
  return {
    id: String(row.id),
    code: String(row.code),
    symbol: String(row.symbol),
    exchange_rate: Number(row.exchange_rate) || 1,
    enabled: Boolean(row.enabled ?? true),
    sort_order: Number(row.sort_order) || 0,
  };
}

export function normalizePricingProjectType(row: Record<string, unknown>): PricingProjectType {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ""),
    min_price: Number(row.min_price) || 0,
    max_price: Number(row.max_price) || 0,
    icon: String(row.icon ?? "Globe"),
    sort_order: Number(row.sort_order) || 0,
    published: Boolean(row.published ?? true),
  };
}

export function normalizePricingFeature(row: Record<string, unknown>): PricingFeature {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ""),
    min_price: Number(row.min_price) || 0,
    max_price: Number(row.max_price) || 0,
    icon: String(row.icon ?? "Code2"),
    sort_order: Number(row.sort_order) || 0,
    published: Boolean(row.published ?? true),
  };
}

export function normalizePricingTimeline(row: Record<string, unknown>): PricingTimelineOption {
  return {
    id: String(row.id),
    title: String(row.title),
    percentage_modifier: Number(row.percentage_modifier) || 0,
    sort_order: Number(row.sort_order) || 0,
    published: Boolean(row.published ?? true),
  };
}
