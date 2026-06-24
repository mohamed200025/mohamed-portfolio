import { createPublicClient } from "@/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { WizardCurrency } from "@/components/pricing/types";
import type {
  PricingComplexitySettingRow,
  PricingServiceRow,
  PricingTimelineSettingRow,
  PricingWizardConfig,
  PricingWizardFeatureRow,
  PricingWizardSettings,
} from "./wizard-types";

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseCurrency(value: unknown): WizardCurrency {
  if (value === "USD" || value === "EUR" || value === "DZD") return value;
  return "DZD";
}

function normalizeSettings(row: Record<string, unknown>): PricingWizardSettings {
  return {
    id: num(row.id, 1),
    usd_to_dzd: num(row.usd_to_dzd, 135),
    eur_to_dzd: num(row.eur_to_dzd, 157),
    default_currency: parseCurrency(row.default_currency),
    updated_at: String(row.updated_at ?? new Date().toISOString()),
  };
}

function normalizeService(row: Record<string, unknown>): PricingServiceRow {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    category_id: String(row.category_id ?? ""),
    section_id: String(row.section_id ?? ""),
    section_title: String(row.section_title ?? ""),
    price_dzd: num(row.price_dzd),
    price_eur: num(row.price_eur),
    price_usd: num(row.price_usd),
    complexity_score: num(row.complexity_score, 1),
    active: row.active !== false,
    sort_order: num(row.sort_order),
  };
}

function normalizeFeature(row: Record<string, unknown>): PricingWizardFeatureRow {
  const categoryIds = Array.isArray(row.category_ids)
    ? row.category_ids.map(String)
    : [];
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    category_ids: categoryIds,
    section_id: String(row.section_id ?? "features"),
    section_title: String(row.section_title ?? "Features"),
    price_dzd: num(row.price_dzd),
    price_eur: num(row.price_eur),
    price_usd: num(row.price_usd),
    complexity_score: num(row.complexity_score, 1),
    active: row.active !== false,
    sort_order: num(row.sort_order),
  };
}

function normalizeTimeline(row: Record<string, unknown>): PricingTimelineSettingRow {
  return {
    id: String(row.id) as PricingTimelineSettingRow["id"],
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    badge: String(row.badge ?? ""),
    multiplier: num(row.multiplier, 1),
    active: row.active !== false,
    sort_order: num(row.sort_order),
  };
}

function normalizeComplexity(row: Record<string, unknown>): PricingComplexitySettingRow {
  return {
    id: String(row.id) as PricingComplexitySettingRow["id"],
    name: String(row.name ?? ""),
    price_multiplier: num(row.price_multiplier, 1),
    score_min: num(row.score_min),
    score_max: num(row.score_max, 999),
    duration_flexible: String(row.duration_flexible ?? ""),
    duration_standard: String(row.duration_standard ?? ""),
    duration_fast: String(row.duration_fast ?? ""),
    duration_urgent: String(row.duration_urgent ?? ""),
    sort_order: num(row.sort_order),
  };
}

export async function fetchPricingWizardConfig(): Promise<PricingWizardConfig | null> {
  const supabase = createPublicClient();

  const [settingsRes, servicesRes, featuresRes, timelinesRes, complexityRes] = await Promise.all([
    supabase.from("pricing_settings").select("id, usd_to_dzd, eur_to_dzd, default_currency, updated_at").eq("id", 1).maybeSingle(),
    supabase.from("pricing_services").select("*").eq("active", true).order("sort_order"),
    supabase.from("pricing_features").select("*").eq("active", true).order("sort_order"),
    supabase.from("pricing_timeline_options").select("*").eq("active", true).order("sort_order"),
    supabase.from("pricing_complexity_options").select("*").order("sort_order"),
  ]);

  const errors = [
    settingsRes.error,
    servicesRes.error,
    featuresRes.error,
    timelinesRes.error,
    complexityRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("[pricing-config] fetch errors:", errors);
    return null;
  }

  if (!settingsRes.data) return null;

  return {
    settings: normalizeSettings(settingsRes.data as Record<string, unknown>),
    services: ((servicesRes.data as Record<string, unknown>[]) ?? []).map(normalizeService),
    features: ((featuresRes.data as Record<string, unknown>[]) ?? []).map(normalizeFeature),
    timelines: ((timelinesRes.data as Record<string, unknown>[]) ?? []).map(normalizeTimeline),
    complexityLevels: ((complexityRes.data as Record<string, unknown>[]) ?? []).map(normalizeComplexity),
  };
}

/** Admin: includes inactive rows for editing */
export async function fetchPricingWizardConfigAdmin(
  supabase: SupabaseClient,
): Promise<PricingWizardConfig | null> {
  const [settingsRes, servicesRes, featuresRes, timelinesRes, complexityRes] = await Promise.all([
    supabase.from("pricing_settings").select("id, usd_to_dzd, eur_to_dzd, default_currency, updated_at").eq("id", 1).maybeSingle(),
    supabase.from("pricing_services").select("*").order("sort_order"),
    supabase.from("pricing_features").select("*").order("sort_order"),
    supabase.from("pricing_timeline_options").select("*").order("sort_order"),
    supabase.from("pricing_complexity_options").select("*").order("sort_order"),
  ]);

  const errors = [
    settingsRes.error,
    servicesRes.error,
    featuresRes.error,
    timelinesRes.error,
    complexityRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("[pricing-config] admin fetch errors:", errors);
    return null;
  }

  if (!settingsRes.data) return null;

  return {
    settings: normalizeSettings(settingsRes.data as Record<string, unknown>),
    services: ((servicesRes.data as Record<string, unknown>[]) ?? []).map(normalizeService),
    features: ((featuresRes.data as Record<string, unknown>[]) ?? []).map(normalizeFeature),
    timelines: ((timelinesRes.data as Record<string, unknown>[]) ?? []).map(normalizeTimeline),
    complexityLevels: ((complexityRes.data as Record<string, unknown>[]) ?? []).map(normalizeComplexity),
  };
}
