import { formatWizardCurrency } from "@/components/pricing/pricing-calculator";
import type { WizardCurrency } from "@/components/pricing/types";

const WHATSAPP_NUMBER = "213562699830";

export function buildQuoteWhatsAppUrl(options: {
  proposalId: string;
  clientName: string;
  projectName: string;
  finalPriceUsd: number;
  currency: WizardCurrency;
}): string {
  const finalPrice = formatWizardCurrency(options.finalPriceUsd, options.currency);
  const message = `Hello Mohamed,

I have submitted a project request.

Proposal ID:
${options.proposalId}

Client:
${options.clientName}

Project:
${options.projectName || "—"}

Estimated Price:
${finalPrice}

I would like to discuss the project.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
