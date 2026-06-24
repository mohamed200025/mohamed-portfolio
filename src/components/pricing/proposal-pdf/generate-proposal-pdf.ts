import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import type { PricingCatalog } from "@/lib/pricing/catalog";
import {
  applyComplexityMultiplier,
  applyTimelineMultiplier,
  getComplexityPriceMultiplier,
} from "@/lib/pricing/catalog";
import { formatWizardCurrency } from "../pricing-calculator";
import { getTimelineMultiplier } from "../timelines";
import type { PricingFlowState } from "../types";
import { buildProposalContent } from "./build-content";
import type { ProposalPdfContent } from "./build-content";
import {
  PDF_MARGINS,
  PDF_PAGE_HEIGHT,
  PDF_PAGE_WIDTH,
  PDF_SPACING,
  PROPOSAL_TEMPLATE_URL,
  TEMPLATE_PAGE,
} from "./layout";
import { PROPOSAL_AUTHOR } from "./proposal-contact";
import { ProposalPageComposer, type FontSet } from "./proposal-composer";
import {
  BODY_COLOR,
  drawCenteredText,
  HEADING_COLOR,
  MUTED_COLOR,
  wrapText,
} from "./text-utils";

function drawCoverBlock(
  page: PDFPage,
  label: string,
  lines: string[],
  y: number,
  fonts: FontSet,
  labelSize = 9,
  valueSize = 12,
): number {
  drawCenteredText(page, label, y, fonts.bold, labelSize, MUTED_COLOR);
  y -= PDF_SPACING.lineHeightTight + 2;

  for (const line of lines) {
    drawCenteredText(page, line, y, fonts.regular, valueSize, BODY_COLOR);
    y -= valueSize + 6;
  }

  return y - PDF_SPACING.fieldGap;
}

function drawFirstPageContent(
  page: PDFPage,
  content: ProposalPdfContent,
  fonts: FontSet,
): void {
  const margins = PDF_MARGINS.first;
  const contentWidth = PDF_PAGE_WIDTH - margins.left - margins.right;
  let y = PDF_PAGE_HEIGHT - margins.top - 8;

  drawCenteredText(page, "PROJECT PROPOSAL", y, fonts.bold, 28, HEADING_COLOR);
  y -= 44;

  y = drawCoverBlock(page, "Prepared For:", [content.clientName], y, fonts);
  y = drawCoverBlock(
    page,
    "Prepared By:",
    [PROPOSAL_AUTHOR.name, PROPOSAL_AUTHOR.title],
    y,
    fonts,
  );
  y = drawCoverBlock(page, "Project Category:", [content.projectCategory], y, fonts);
  y = drawCoverBlock(page, "Industry:", [content.industry], y, fonts);
  y = drawCoverBlock(page, "Date:", [content.dateLabel], y, fonts);

  if (content.hasProjectDescription) {
    drawCenteredText(page, "Project Description:", y, fonts.bold, 9, MUTED_COLOR);
    y -= PDF_SPACING.lineHeightTight + 4;

    const descriptionLines = wrapText(
      content.projectDescription,
      contentWidth,
      fonts.regular,
      11,
    );

    for (const line of descriptionLines) {
      const textWidth = fonts.regular.widthOfTextAtSize(line, 11);
      page.drawText(line, {
        x: (PDF_PAGE_WIDTH - textWidth) / 2,
        y,
        size: 11,
        font: fonts.regular,
        color: BODY_COLOR,
      });
      y -= PDF_SPACING.lineHeightBody;
    }
  }
}

export async function generateProposalPdfFromTemplate(
  templateBytes: ArrayBuffer | Uint8Array,
  flow: PricingFlowState,
  catalog?: PricingCatalog | null,
): Promise<Uint8Array> {
  const templateDoc = await PDFDocument.load(templateBytes);
  const pdfDoc = await PDFDocument.create();

  const [embeddedFirst, embeddedMiddle, embeddedLast] = await pdfDoc.embedPages([
    templateDoc.getPage(TEMPLATE_PAGE.first),
    templateDoc.getPage(TEMPLATE_PAGE.middle),
    templateDoc.getPage(TEMPLATE_PAGE.last),
  ]);

  const fonts: FontSet = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };

  const timelineMultiplier = catalog
    ? getTimelineMultiplier(catalog, flow.timelineId)
    : flow.finalEstimatedTotal > 0 && flow.estimatedTotal > 0
      ? flow.finalEstimatedTotal / flow.estimatedTotal
      : 1;
  const complexityMult = catalog
    ? getComplexityPriceMultiplier(catalog, flow.complexityLevel)
    : 1;
  const afterComplexity = applyComplexityMultiplier(flow.estimatedTotal, complexityMult);
  const { adjustmentAmount } = applyTimelineMultiplier(afterComplexity, timelineMultiplier);
  const discountAmount = adjustmentAmount < 0 ? Math.abs(adjustmentAmount) : 0;
  const deliveryAdjustmentAmount = adjustmentAmount > 0 ? adjustmentAmount : 0;

  const formatPrice = (amount: number) => formatWizardCurrency(amount, flow.currency);

  const content = buildProposalContent(flow, formatPrice, {
    subtotalUsd: flow.estimatedTotal,
    discountUsd: discountAmount,
    deliveryAdjustmentUsd: deliveryAdjustmentAmount,
    finalUsd: flow.finalEstimatedTotal,
  });

  const firstPage = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
  firstPage.drawPage(embeddedFirst, {
    x: 0,
    y: 0,
    width: PDF_PAGE_WIDTH,
    height: PDF_PAGE_HEIGHT,
  });
  drawFirstPageContent(firstPage, content, fonts);

  const composer = new ProposalPageComposer(
    pdfDoc,
    embeddedMiddle,
    embeddedLast,
    fonts,
  );
  composer.renderBody(content);

  return pdfDoc.save();
}

export async function generateProposalPdf(flow: PricingFlowState): Promise<Uint8Array> {
  const templateResponse = await fetch(PROPOSAL_TEMPLATE_URL);
  if (!templateResponse.ok) {
    throw new Error("Failed to load proposal template PDF.");
  }

  return generateProposalPdfFromTemplate(await templateResponse.arrayBuffer(), flow);
}

export { proposalDownloadFilename } from "./build-content";
