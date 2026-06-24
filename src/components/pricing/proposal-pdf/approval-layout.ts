import type { PDFPage, PDFFont } from "pdf-lib";
import { PDF_PAGE_WIDTH, PDF_SPACING, TEMPLATE_FOOTER_RESERVE } from "./layout";
import { APPROVAL_NOTE_TEXT } from "./client-approval";
import {
  BODY_COLOR,
  HEADING_COLOR,
  MUTED_COLOR,
  sanitizePdfText,
  toRgb,
  wrapText,
} from "./text-utils";
import { PDF_COLORS } from "./layout";

const TABLE_BORDER = toRgb({ r: 0.82, g: 0.84, b: 0.88 });
const SECTION_FILL = toRgb({ r: 0.97, g: 0.98, b: 0.99 });

interface FontSet {
  regular: PDFFont;
  bold: PDFFont;
}

export interface ClientApprovalData {
  clientName: string;
  clientCompany: string;
}

export interface ApprovalDrawContext {
  left: number;
  right: number;
  innerX: number;
  innerWidth: number;
  minY: number;
}

const CHECKBOX_SIZE = 10;
const LABEL_GAP = 16;
const FIELD_GAP = 22;
const PREFILL_GAP = 14;
const HANDWRITE_HEIGHT = 28;
const SIGNATURE_HANDWRITE_HEIGHT = 34;

export function measureApprovalNoteHeight(contentWidth: number, font: PDFFont): number {
  const lines = wrapText(APPROVAL_NOTE_TEXT, contentWidth - 8, font, 8.5);
  return PDF_SPACING.paragraphGap + Math.max(lines.length, 1) * 11 + 8;
}

export function measureClientApprovalSectionHeight(): number {
  return (
    18 +
    10 +
    16 +
    14 +
    18 +
    20 +
    20 +
    12 +
    measureSignatureFieldHeight(true) +
    FIELD_GAP +
    measureSignatureFieldHeight(true) +
    FIELD_GAP +
    measureSignatureFieldHeight(false) +
    FIELD_GAP +
    measureSignatureFieldHeight(false, true) +
    16 +
    12
  );
}

function measureSignatureFieldHeight(hasPrefill: boolean, isDate = false): number {
  const handwrite = isDate ? SIGNATURE_HANDWRITE_HEIGHT : HANDWRITE_HEIGHT;
  const prefill = hasPrefill ? PREFILL_GAP + 12 : 0;
  return 12 + LABEL_GAP + prefill + handwrite;
}

function drawCheckboxOption(
  page: PDFPage,
  x: number,
  y: number,
  label: string,
  font: PDFFont,
): number {
  page.drawRectangle({
    x,
    y: y - CHECKBOX_SIZE,
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderColor: TABLE_BORDER,
    borderWidth: 0.75,
  });
  page.drawText(sanitizePdfText(label), {
    x: x + CHECKBOX_SIZE + 10,
    y: y - CHECKBOX_SIZE + 1,
    size: 10,
    font,
    color: BODY_COLOR,
  });
  return y - CHECKBOX_SIZE - 14;
}

function drawSignatureField(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  label: string,
  fonts: FontSet,
  options: { prefilled?: string; isDate?: boolean } = {},
): number {
  const handwriteHeight = options.isDate ? SIGNATURE_HANDWRITE_HEIGHT : HANDWRITE_HEIGHT;

  page.drawText(label, {
    x,
    y,
    size: 10,
    font: fonts.bold,
    color: MUTED_COLOR,
  });
  y -= LABEL_GAP;

  if (options.prefilled) {
    page.drawText(sanitizePdfText(options.prefilled), {
      x,
      y,
      size: 11,
      font: fonts.regular,
      color: BODY_COLOR,
    });
    y -= PREFILL_GAP;
  }

  y -= handwriteHeight;

  page.drawLine({
    start: { x, y },
    end: { x: x + width, y },
    thickness: 0.6,
    color: TABLE_BORDER,
  });

  return y - FIELD_GAP;
}

export function drawClientApprovalSection(
  page: PDFPage,
  topY: number,
  data: ClientApprovalData,
  fonts: FontSet,
  ctx: ApprovalDrawContext,
): number {
  const { left, right, innerX, innerWidth, minY } = ctx;
  const width = right - left;

  let y = topY;

  page.drawText("CLIENT APPROVAL", {
    x: left,
    y,
    size: 13,
    font: fonts.bold,
    color: HEADING_COLOR,
  });
  y -= 18;

  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 0.75,
    color: TABLE_BORDER,
  });
  y -= 16;

  const formTop = y;
  const formBodyHeight =
    14 +
    18 +
    20 +
    20 +
    12 +
    measureSignatureFieldHeight(true) +
    FIELD_GAP +
    measureSignatureFieldHeight(true) +
    FIELD_GAP +
    measureSignatureFieldHeight(false) +
    FIELD_GAP +
    measureSignatureFieldHeight(false, true) +
    8;
  const formBottom = Math.max(formTop - formBodyHeight, minY);

  page.drawRectangle({
    x: left,
    y: formBottom,
    width,
    height: formTop - formBottom,
    color: SECTION_FILL,
    borderColor: TABLE_BORDER,
    borderWidth: 0.75,
  });

  y = formTop - 14;

  page.drawText("Proposal Status", {
    x: innerX,
    y,
    size: 10,
    font: fonts.bold,
    color: MUTED_COLOR,
  });
  y -= 18;

  y = drawCheckboxOption(page, innerX, y, "Approved", fonts.regular);
  y = drawCheckboxOption(page, innerX, y, "Requires Revisions", fonts.regular);
  y -= 12;

  const clientNamePrefill = data.clientName.trim() || undefined;
  const companyPrefill = data.clientCompany.trim() || undefined;

  y = drawSignatureField(page, innerX, y, innerWidth, "Client Full Name:", fonts, {
    prefilled: clientNamePrefill,
  });
  y = drawSignatureField(page, innerX, y, innerWidth, "Company:", fonts, {
    prefilled: companyPrefill,
  });
  y = drawSignatureField(page, innerX, y, innerWidth, "Signature:", fonts);
  y = drawSignatureField(page, innerX, y, innerWidth, "Date:", fonts, { isDate: true });

  y -= 4;
  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 0.5,
    color: TABLE_BORDER,
  });

  return y;
}

export function drawApprovalNote(
  page: PDFPage,
  topY: number,
  fonts: FontSet,
  ctx: ApprovalDrawContext,
): number {
  const { left, minY } = ctx;
  const width = ctx.right - ctx.left;

  let y = topY - PDF_SPACING.paragraphGap;

  const lines = wrapText(APPROVAL_NOTE_TEXT, width - 8, fonts.regular, 8.5);
  for (const line of lines) {
    if (y < minY) break;
    page.drawText(line, {
      x: left + 4,
      y,
      size: 8.5,
      font: fonts.regular,
      color: toRgb(PDF_COLORS.muted),
    });
    y -= 11;
  }

  return Math.max(y, minY);
}

export function getApprovalDrawContext(margins: {
  left: number;
  right: number;
  bottom: number;
}): ApprovalDrawContext {
  const left = margins.left;
  const right = PDF_PAGE_WIDTH - margins.right;
  const minY =
    margins.bottom > 200 ? TEMPLATE_FOOTER_RESERVE + 8 : margins.bottom + 8;

  return {
    left,
    right,
    innerX: left + 16,
    innerWidth: right - left - 32,
    minY,
  };
}

export function measureClosingBlockHeight(
  contentWidth: number,
  fonts: FontSet,
): number {
  return (
    measureClientApprovalSectionHeight() +
    measureApprovalNoteHeight(contentWidth, fonts.regular)
  );
}
