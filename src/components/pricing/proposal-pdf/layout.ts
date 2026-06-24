/** A4 page size in PDF points (matches template). */
import { TEMPLATE_FOOTER_RESERVE } from "./client-approval";

export const PDF_PAGE_WIDTH = 595.5;
export const PDF_PAGE_HEIGHT = 842.25;

export const PROPOSAL_TEMPLATE_URL = "/pdf/Project information.pdf";

/** Template page indices: 0 = cover (logo), 1 = inner, 2 = closing (signature / QR / footer). */
export const TEMPLATE_PAGE = {
  first: 0,
  middle: 1,
  last: 2,
} as const;

export interface PdfMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Content boxes inside the template white area — tuned for the existing border design. */
export const PDF_MARGINS: Record<"first" | "middle" | "last", PdfMargins> = {
  first: { top: 208, bottom: 104, left: 92, right: 92 },
  middle: { top: 96, bottom: 96, left: 92, right: 92 },
  last: { top: 96, bottom: TEMPLATE_FOOTER_RESERVE, left: 92, right: 92 },
};

export { TEMPLATE_FOOTER_RESERVE };

export const PDF_SPACING = {
  sectionGap: 18,
  paragraphGap: 6,
  fieldGap: 20,
  lineHeightBody: 16,
  lineHeightTight: 14,
  tableRowPadding: 8,
  tableHeaderHeight: 22,
  /** Minimum gap between pricing table bottom and pricing summary (pt). */
  pricingTableSummaryGap: 24,
  /** Gap between section title and pricing table header (pt). */
  pricingTitleTableGap: 8,
} as const;

export const PDF_COLORS = {
  heading: { r: 0.12, g: 0.14, b: 0.22 },
  body: { r: 0.2, g: 0.22, b: 0.28 },
  muted: { r: 0.38, g: 0.4, b: 0.46 },
  accent: { r: 0.05, g: 0.45, b: 0.55 },
};
