import { formatClientPhone } from "@/components/pricing/client-info";
import type { PricingFlowState } from "@/components/pricing/types";

const PAGE_REQUIREMENT_IDS = new Set(["pages-1-5", "pages-5-10", "pages-10-plus"]);

export interface PricingProposalInsert {
  proposal_id: string;
  status: "pending";
  /** Legacy NOT NULL column on existing Supabase tables */
  client_name: string;
  client_full_name: string;
  /** Legacy NOT NULL column on existing Supabase tables */
  phone: string;
  phone_number: string | null;
  email: string | null;
  company_name: string | null;
  country: string | null;
  project_name: string;
  project_description: string;
  category_id: string | null;
  industry_id: string | null;
  target_audience: string | null;
  selected_services: { id: string; label: string; amount: number }[];
  optional_features: { id: string; label: string; amount: number }[];
  /** Page range label(s) from the calculator, e.g. "1–5 Pages" — stored as-is, not a count. */
  number_of_pages: string | null;
  complexity_level: string;
  complexity_score: number;
  timeline: string;
  estimated_duration: string;
  currency: string;
  price_breakdown: { id: string; label: string; amount: number }[];
  subtotal: number;
  final_price: number;
  pdf_storage_path: string | null;
  pdf_public_url: string | null;
  client_metadata: Record<string, unknown>;
}

export function buildProposalRecord(
  flow: PricingFlowState,
  proposalId: string,
  pdfStoragePath: string | null,
  pdfPublicUrl: string | null,
): PricingProposalInsert {
  const pageItems = flow.priceBreakdown.filter((item) => PAGE_REQUIREMENT_IDS.has(item.id));
  const featureItems = flow.priceBreakdown.filter((item) => !PAGE_REQUIREMENT_IDS.has(item.id));
  const pagesLabel =
    pageItems.length > 0 ? pageItems.map((p) => p.label).join(", ") : null;
  const fullName = flow.client.fullName.trim();
  const formattedPhone = formatClientPhone(flow.client);

  return {
    proposal_id: proposalId,
    status: "pending",
    client_name: fullName,
    client_full_name: fullName,
    phone: formattedPhone || "",
    phone_number: formattedPhone || null,
    email: flow.client.email.trim() || null,
    company_name: flow.client.companyName.trim() || null,
    country: flow.client.country.trim() || null,
    project_name: flow.projectName.trim(),
    project_description: flow.projectDescription.trim(),
    category_id: flow.categoryId,
    industry_id: flow.industryId,
    target_audience: flow.targetAudience.trim() || null,
    selected_services: pageItems.map(({ id, label, amount }) => ({ id, label, amount })),
    optional_features: featureItems.map(({ id, label, amount }) => ({ id, label, amount })),
    number_of_pages: pagesLabel,
    complexity_level: flow.complexityLevel,
    complexity_score: flow.complexityScore,
    timeline: flow.timelineId,
    estimated_duration: flow.deliveryDuration,
    currency: flow.currency,
    price_breakdown: flow.priceBreakdown.map(({ id, label, amount }) => ({ id, label, amount })),
    subtotal: flow.estimatedTotal,
    final_price: flow.finalEstimatedTotal,
    pdf_storage_path: pdfStoragePath,
    pdf_public_url: pdfPublicUrl,
    client_metadata: {
      preferredContactMethod: flow.client.preferredContactMethod,
      budgetRange: flow.client.budgetRange,
      projectStartDate: flow.client.projectStartDate,
      additionalNotes: flow.client.additionalNotes,
      requirements: flow.requirements,
    },
  };
}
