import { PRICING_CATEGORIES } from "../categories";
import { PRICING_INDUSTRIES } from "../industries";
import { getTimelineOption } from "../timelines";
import type { PricingFlowState } from "../types";

const PAGE_REQUIREMENT_IDS = new Set(["pages-1-5", "pages-5-10", "pages-10-plus"]);

export interface ProposalSection {
  title: string;
  paragraphs: string[];
  bullets: string[];
}

export interface ProposalSummaryItem {
  label: string;
  value: string;
}

export interface ProposalPdfContent {
  clientName: string;
  clientCompany: string;
  projectCategory: string;
  industry: string;
  dateLabel: string;
  hasProjectDescription: boolean;
  projectDescription: string;
  summarySection: ProposalSection;
  summaryItems: ProposalSummaryItem[];
  requirementsSection: ProposalSection;
  featuresSection: ProposalSection;
  pricingRows: { service: string; price: string }[];
  subtotal: string;
  discount: string;
  deliveryAdjustment: string;
  finalTotal: string;
}

export function buildProposalContent(
  flow: PricingFlowState,
  formatPrice: (usd: number) => string,
  options: {
    subtotalUsd: number;
    discountUsd: number;
    deliveryAdjustmentUsd: number;
    finalUsd: number;
  },
): ProposalPdfContent {
  const categoryTitle =
    PRICING_CATEGORIES.find((c) => c.id === flow.categoryId)?.title ?? "—";
  const industryTitle =
    PRICING_INDUSTRIES.find((i) => i.id === flow.industryId)?.title ?? "—";
  const timeline = getTimelineOption(flow.timelineId);
  const clientName = flow.client.fullName.trim() || "Client";

  const pageItems = flow.priceBreakdown.filter((item) => PAGE_REQUIREMENT_IDS.has(item.id));
  const featureItems = flow.priceBreakdown.filter((item) => !PAGE_REQUIREMENT_IDS.has(item.id));
  const pagesLabel =
    pageItems.length > 0 ? pageItems.map((p) => p.label).join(", ") : "Not specified";

  const requirementBullets = [
    `Project name: ${flow.projectName.trim() || "—"}`,
    `Category: ${categoryTitle}`,
    `Industry: ${industryTitle}`,
    `Estimated pages: ${pagesLabel}`,
    `Complexity: ${capitalize(flow.complexityLevel)} (${flow.complexityScore} pts)`,
    `Delivery option: ${timeline.title}`,
    `Estimated duration: ${flow.deliveryDuration}`,
    `Timeline: ${timeline.title} — ${timeline.description}`,
  ];

  if (flow.targetAudience.trim()) {
    requirementBullets.push(`Target audience: ${flow.targetAudience.trim()}`);
  }

  requirementBullets.push(
    "Kickoff and requirements validation at project start",
    "Iterative development with milestone reviews",
    "Quality assurance, deployment support, and structured handover",
  );

  const featureBullets =
    featureItems.length > 0
      ? featureItems.map((item) => `${item.label} (${formatPrice(item.amount)})`)
      : ["No additional features selected"];

  const pricingRows = flow.priceBreakdown.map((item) => ({
    service: item.label,
    price: formatPrice(item.amount),
  }));

  const discountDisplay =
    options.discountUsd > 0 ? `−${formatPrice(options.discountUsd)}` : formatPrice(0);
  const deliveryDisplay =
    options.deliveryAdjustmentUsd > 0
      ? `+${formatPrice(options.deliveryAdjustmentUsd)}`
      : formatPrice(0);

  return {
    clientName,
    clientCompany: flow.client.companyName.trim(),
    projectCategory: categoryTitle,
    industry: industryTitle,
    dateLabel: formatProposalDate(new Date()),
    hasProjectDescription: flow.projectDescription.trim().length > 0,
    projectDescription: flow.projectDescription.trim(),
    summarySection: {
      title: "Project Overview",
      paragraphs: [
        "This proposal outlines the development of a custom solution tailored to the client's requirements.",
      ],
      bullets: [],
    },
    summaryItems: [
      { label: "Project Type", value: categoryTitle },
      { label: "Industry", value: industryTitle },
      { label: "Number of Pages", value: pagesLabel },
      { label: "Selected Features Count", value: String(featureItems.length) },
      { label: "Estimated Duration", value: flow.deliveryDuration },
      { label: "Delivery Type", value: timeline.title },
    ],
    requirementsSection: {
      title: "Project Requirements",
      paragraphs: [
        "The following requirements define the agreed scope, delivery expectations, and project parameters.",
      ],
      bullets: requirementBullets,
    },
    featuresSection: {
      title: "Features",
      paragraphs: [],
      bullets: featureBullets,
    },
    pricingRows,
    subtotal: formatPrice(options.subtotalUsd),
    discount: discountDisplay,
    deliveryAdjustment: deliveryDisplay,
    finalTotal: formatPrice(options.finalUsd),
  };
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatProposalDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function proposalDownloadFilename(clientName: string, date = new Date()): string {
  const safeName =
    clientName
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "Client";
  const isoDate = date.toISOString().slice(0, 10);
  return `Proposal-${safeName}-${isoDate}.pdf`;
}
