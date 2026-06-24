import type { ComplexityLevel } from "./complexity-engine";
import type { WizardTimelineId } from "./timelines";
import { DEFAULT_WIZARD_TIMELINE } from "./timelines";
import { DEFAULT_CLIENT_INFORMATION, type ClientInformation } from "./client-info";

export type { WizardTimelineId } from "./timelines";
export type { ComplexityLevel } from "./complexity-engine";
export type { ClientInformation } from "./client-info";
export const PRICING_WIZARD_TOTAL_STEPS = 7;

export type PricingCategoryId =
  | "website"
  | "web-application"
  | "mobile-application"
  | "e-commerce"
  | "admin-dashboard"
  | "ui-ux-design"
  | "custom-software";

export type PricingIndustryId =
  | "education"
  | "healthcare"
  | "restaurant-food"
  | "real-estate"
  | "finance-banking"
  | "e-commerce"
  | "travel-tourism"
  | "logistics"
  | "sports-fitness"
  | "beauty-cosmetics"
  | "construction"
  | "manufacturing"
  | "media-content"
  | "ai-technology"
  | "ngo-nonprofit"
  | "other";

export type PricingFlowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PriceBreakdownItem {
  id: string;
  label: string;
  amount: number;
}

export type WizardCurrency = "USD" | "EUR" | "DZD";

export const DEFAULT_WIZARD_CURRENCY: WizardCurrency = "DZD";

export const WIZARD_CURRENCY_OPTIONS: {
  code: WizardCurrency;
  label: string;
}[] = [
  { code: "DZD", label: "DA" },
  { code: "EUR", label: "€" },
  { code: "USD", label: "$" },
];

export interface PricingFlowState {
  step: PricingFlowStep;
  categoryId: PricingCategoryId | null;
  industryId: PricingIndustryId | null;
  requirements: string[];
  estimatedTotal: number;
  priceBreakdown: PriceBreakdownItem[];
  currency: WizardCurrency;
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  timelineId: WizardTimelineId;
  complexityScore: number;
  complexityLevel: ComplexityLevel;
  deliveryDuration: string;
  finalEstimatedTotal: number;
  client: ClientInformation;
  /** Client confirmed proposal summary on review step */
  proposalConfirmed: boolean;
}

export const INITIAL_PRICING_FLOW_STATE: PricingFlowState = {
  step: 1,
  categoryId: null,
  industryId: null,
  requirements: [],
  estimatedTotal: 0,
  priceBreakdown: [],
  currency: DEFAULT_WIZARD_CURRENCY,
  projectName: "",
  projectDescription: "",
  targetAudience: "",
  timelineId: DEFAULT_WIZARD_TIMELINE,
  complexityScore: 0,
  complexityLevel: "simple",
  deliveryDuration: "",
  finalEstimatedTotal: 0,
  client: DEFAULT_CLIENT_INFORMATION,
  proposalConfirmed: false,
};
