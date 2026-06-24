import fs from "fs/promises";
import path from "path";
import type { PricingFlowState } from "@/components/pricing/types";
import { generateProposalPdfFromTemplate } from "@/components/pricing/proposal-pdf/generate-proposal-pdf";
import { buildPricingCatalog } from "@/lib/pricing/catalog";
import { fetchPricingWizardConfig } from "@/lib/pricing/fetch-config";

const TEMPLATE_FILENAME = "Project information.pdf";

export async function loadProposalTemplateBytes(): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public", "pdf", TEMPLATE_FILENAME);
  const buffer = await fs.readFile(templatePath);
  return new Uint8Array(buffer);
}

export async function generateProposalPdfServer(flow: PricingFlowState): Promise<Uint8Array> {
  const templateBytes = await loadProposalTemplateBytes();
  const config = await fetchPricingWizardConfig();
  const catalog = config ? buildPricingCatalog(config, flow.currency) : null;
  return generateProposalPdfFromTemplate(templateBytes, flow, catalog);
}
