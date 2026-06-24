import {
  PDFDocument,
  type PDFEmbeddedPage,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { ProposalPdfContent, ProposalSection, ProposalSummaryItem } from "./build-content";
import {
  PDF_MARGINS,
  PDF_PAGE_HEIGHT,
  PDF_PAGE_WIDTH,
  PDF_SPACING,
  TEMPLATE_FOOTER_RESERVE,
} from "./layout";
import type { PdfMargins } from "./layout";
import {
  BODY_COLOR,
  HEADING_COLOR,
  MUTED_COLOR,
  sanitizePdfText,
  toRgb,
  wrapText,
} from "./text-utils";
import { PDF_COLORS } from "./layout";
import {
  drawApprovalNote,
  drawClientApprovalSection,
  getApprovalDrawContext,
  measureClosingBlockHeight,
} from "./approval-layout";

const TABLE_HEADER_BG = toRgb({ r: 0.94, g: 0.95, b: 0.97 });
const TABLE_ROW_ALT_BG = toRgb({ r: 0.98, g: 0.98, b: 0.99 });
const TABLE_BORDER = toRgb({ r: 0.82, g: 0.84, b: 0.88 });
const ACCENT_COLOR = toRgb(PDF_COLORS.accent);

type PageKind = "middle" | "last";

export interface FontSet {
  regular: PDFFont;
  bold: PDFFont;
}

interface TableLayout {
  left: number;
  right: number;
  priceX: number;
  serviceWidth: number;
  width: number;
}

function tableLayout(margins: PdfMargins): TableLayout {
  const left = margins.left;
  const right = PDF_PAGE_WIDTH - margins.right;
  const priceX = right - 92;
  return {
    left,
    right,
    priceX,
    serviceWidth: priceX - left - 20,
    width: right - left,
  };
}

function measureServiceRowHeight(
  service: string,
  layout: TableLayout,
  font: PDFFont,
): number {
  const lines = wrapText(service, layout.serviceWidth, font, 10);
  const textHeight = Math.max(lines.length, 1) * 13;
  return textHeight + PDF_SPACING.tableRowPadding * 2;
}

function measurePricingSummaryContentHeight(): number {
  return 10 + 20 + 18 * 3 + 28 + 12;
}

function measurePricingSummarySectionHeight(includeTableGap: boolean): number {
  const gap = includeTableGap ? PDF_SPACING.pricingTableSummaryGap : 0;
  return gap + 20 + measurePricingSummaryContentHeight() + PDF_SPACING.sectionGap;
}

function measureSectionTitleHeight(): number {
  return 20 + PDF_SPACING.sectionGap;
}

export class ProposalPageComposer {
  private page!: PDFPage;
  private pageKind: PageKind = "middle";
  private margins!: PdfMargins;
  private minY = 0;
  private cursorY = 0;
  private contentWidth = 0;
  private tableLayout!: TableLayout;
  private pricingHeaderDrawn = false;
  private pricingRowIndex = 0;
  private footerPageUsed = false;

  constructor(
    private pdfDoc: PDFDocument,
    private embeddedMiddle: PDFEmbeddedPage,
    private embeddedLast: PDFEmbeddedPage,
    private fonts: FontSet,
  ) {}

  get remaining(): number {
    return this.cursorY - this.minY;
  }

  beginMiddleContent(): void {
    this.newPage("middle");
  }

  private newPage(kind: PageKind): void {
    if (kind === "last") {
      if (this.footerPageUsed) {
        kind = "middle";
      } else {
        this.footerPageUsed = true;
      }
    }

    this.pageKind = kind;
    this.margins = kind === "last" ? PDF_MARGINS.last : PDF_MARGINS.middle;
    this.minY =
      kind === "last" ? TEMPLATE_FOOTER_RESERVE + 8 : this.margins.bottom;
    this.contentWidth = PDF_PAGE_WIDTH - this.margins.left - this.margins.right;
    this.tableLayout = tableLayout(this.margins);

    const embedded = kind === "last" ? this.embeddedLast : this.embeddedMiddle;
    this.page = this.pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
    this.page.drawPage(embedded, {
      x: 0,
      y: 0,
      width: PDF_PAGE_WIDTH,
      height: PDF_PAGE_HEIGHT,
    });
    this.cursorY = PDF_PAGE_HEIGHT - this.margins.top;
    this.pricingHeaderDrawn = false;
  }

  private ensureSpace(height: number): void {
    if (this.remaining >= height) return;
    if (this.pageKind === "last") return;
    this.newPage("middle");
  }

  /** Opens the single footer template page (signature / QR / contact). */
  private startFooterPage(): void {
    if (this.pageKind === "last") return;
    this.newPage("last");
  }

  private drawFlowTitle(title: string): void {
    this.page.drawText(sanitizePdfText(title), {
      x: this.margins.left,
      y: this.cursorY,
      size: 14,
      font: this.fonts.bold,
      color: HEADING_COLOR,
    });
    this.cursorY -= 20;
  }

  private drawSectionTitle(title: string): void {
    this.ensureSpace(measureSectionTitleHeight() + 12);
    this.drawFlowTitle(title);
  }

  private drawParagraph(text: string): void {
    const lines = wrapText(text, this.contentWidth, this.fonts.regular, 11);
    for (const line of lines) {
      this.ensureSpace(PDF_SPACING.lineHeightBody);
      this.page.drawText(line, {
        x: this.margins.left,
        y: this.cursorY,
        size: 11,
        font: this.fonts.regular,
        color: BODY_COLOR,
      });
      this.cursorY -= PDF_SPACING.lineHeightBody;
    }
    this.cursorY -= PDF_SPACING.paragraphGap;
  }

  private drawBullet(text: string): void {
    const bulletIndent = 16;
    const textX = this.margins.left + bulletIndent;
    const maxWidth = this.contentWidth - bulletIndent;
    const lines = wrapText(text, maxWidth, this.fonts.regular, 11);

    this.ensureSpace(Math.max(lines.length, 1) * PDF_SPACING.lineHeightBody);
    this.page.drawText("•", {
      x: this.margins.left,
      y: this.cursorY,
      size: 11,
      font: this.fonts.regular,
      color: ACCENT_COLOR,
    });

    for (const line of lines) {
      this.page.drawText(line, {
        x: textX,
        y: this.cursorY,
        size: 11,
        font: this.fonts.regular,
        color: BODY_COLOR,
      });
      this.cursorY -= PDF_SPACING.lineHeightBody;
    }
  }

  private drawSection(section: ProposalSection): void {
    this.drawSectionTitle(section.title);
    for (const paragraph of section.paragraphs) {
      this.drawParagraph(paragraph);
    }
    for (const bullet of section.bullets) {
      this.drawBullet(bullet);
    }
    this.cursorY -= PDF_SPACING.sectionGap;
  }

  drawOverview(section: ProposalSection, items: ProposalSummaryItem[]): void {
    this.drawSection(section);
    for (const item of items) {
      this.ensureSpace(PDF_SPACING.lineHeightBody + 6);
      this.page.drawText(sanitizePdfText(item.label), {
        x: this.margins.left,
        y: this.cursorY,
        size: 10,
        font: this.fonts.bold,
        color: MUTED_COLOR,
      });
      this.cursorY -= PDF_SPACING.lineHeightTight;

      const valueLines = wrapText(item.value, this.contentWidth, this.fonts.regular, 11);
      for (const line of valueLines) {
        this.ensureSpace(PDF_SPACING.lineHeightBody);
        this.page.drawText(line, {
          x: this.margins.left,
          y: this.cursorY,
          size: 11,
          font: this.fonts.regular,
          color: BODY_COLOR,
        });
        this.cursorY -= PDF_SPACING.lineHeightBody;
      }
      this.cursorY -= 6;
    }
    this.cursorY -= PDF_SPACING.sectionGap;
  }

  private measurePricingTableHeight(
    content: ProposalPdfContent,
    layout: TableLayout,
  ): number {
    if (content.pricingRows.length === 0) {
      return measureSectionTitleHeight() + PDF_SPACING.pricingTitleTableGap + PDF_SPACING.tableHeaderHeight;
    }
    let height = measureSectionTitleHeight() + PDF_SPACING.pricingTitleTableGap + PDF_SPACING.tableHeaderHeight;
    for (const row of content.pricingRows) {
      height += measureServiceRowHeight(row.service, layout, this.fonts.regular);
    }
    return height;
  }

  private drawTableHeader(): void {
    const y = this.cursorY;
    const layout = this.tableLayout;
    const headerBottom = y - PDF_SPACING.tableHeaderHeight;

    this.page.drawRectangle({
      x: layout.left,
      y: headerBottom,
      width: layout.width,
      height: PDF_SPACING.tableHeaderHeight,
      color: TABLE_HEADER_BG,
      borderColor: TABLE_BORDER,
      borderWidth: 0.75,
    });

    this.page.drawLine({
      start: { x: layout.priceX - 10, y: headerBottom },
      end: { x: layout.priceX - 10, y },
      thickness: 0.5,
      color: TABLE_BORDER,
    });

    const headerTextY = headerBottom + 6;
    this.page.drawText("Service", {
      x: layout.left + 10,
      y: headerTextY,
      size: 10,
      font: this.fonts.bold,
      color: HEADING_COLOR,
    });
    this.page.drawText("Price", {
      x: layout.priceX,
      y: headerTextY,
      size: 10,
      font: this.fonts.bold,
      color: HEADING_COLOR,
    });

    this.cursorY = headerBottom;
    this.pricingHeaderDrawn = true;
  }

  private drawServiceRow(
    service: string,
    price: string,
    rowIndex: number,
  ): void {
    const layout = this.tableLayout;
    const y = this.cursorY;
    const rowHeight = measureServiceRowHeight(service, layout, this.fonts.regular);
    const rowBottom = y - rowHeight;

    if (rowIndex % 2 === 1) {
      this.page.drawRectangle({
        x: layout.left,
        y: rowBottom,
        width: layout.width,
        height: rowHeight,
        color: TABLE_ROW_ALT_BG,
      });
    }

    this.page.drawRectangle({
      x: layout.left,
      y: rowBottom,
      width: layout.width,
      height: rowHeight,
      borderColor: TABLE_BORDER,
      borderWidth: 0.5,
    });

    this.page.drawLine({
      start: { x: layout.priceX - 10, y: rowBottom },
      end: { x: layout.priceX - 10, y },
      thickness: 0.5,
      color: TABLE_BORDER,
    });

    const serviceLines = wrapText(service, layout.serviceWidth, this.fonts.regular, 10);
    let lineY = y - PDF_SPACING.tableRowPadding - 10;
    for (const line of serviceLines) {
      this.page.drawText(line, {
        x: layout.left + 10,
        y: lineY,
        size: 10,
        font: this.fonts.regular,
        color: BODY_COLOR,
      });
      lineY -= 13;
    }

    this.page.drawText(sanitizePdfText(price), {
      x: layout.priceX,
      y: y - PDF_SPACING.tableRowPadding - 10,
      size: 10,
      font: this.fonts.regular,
      color: BODY_COLOR,
    });

    this.cursorY = rowBottom;
    this.pricingRowIndex += 1;
  }

  /** cursorY after the last drawn pricing row/header — bottom edge of the table. */
  private get pricingTableBottom(): number {
    return this.cursorY;
  }

  private drawPricingTableSection(content: ProposalPdfContent): void {
    this.drawSectionTitle("Pricing Table");
    this.cursorY -= PDF_SPACING.pricingTitleTableGap;

    if (content.pricingRows.length === 0) {
      this.ensureSpace(PDF_SPACING.tableHeaderHeight);
      this.drawTableHeader();
      return;
    }

    for (const row of content.pricingRows) {
      const rowHeight = measureServiceRowHeight(
        row.service,
        this.tableLayout,
        this.fonts.regular,
      );
      const blockHeight =
        (this.pricingHeaderDrawn ? 0 : PDF_SPACING.tableHeaderHeight) + rowHeight;
      this.ensureSpace(blockHeight);
      if (!this.pricingHeaderDrawn) {
        this.drawTableHeader();
      }
      this.drawServiceRow(row.service, row.price, this.pricingRowIndex);
    }
  }

  private drawPricingSummarySection(content: ProposalPdfContent): void {
    const summaryContentHeight = measurePricingSummaryContentHeight();
    const withTableGap = this.remaining >=
      PDF_SPACING.pricingTableSummaryGap + 20 + summaryContentHeight;

    if (withTableGap) {
      this.cursorY = this.pricingTableBottom - PDF_SPACING.pricingTableSummaryGap;
    } else {
      this.ensureSpace(20 + summaryContentHeight + PDF_SPACING.sectionGap);
    }

    this.drawFlowTitle("Pricing Summary");
    this.drawPricingSummaryBlock(content);
  }

  private drawPricingSummaryBlock(content: ProposalPdfContent): void {
    const layout = this.tableLayout;

    this.cursorY -= 10;
    this.page.drawLine({
      start: { x: layout.left, y: this.cursorY },
      end: { x: layout.right, y: this.cursorY },
      thickness: 1,
      color: TABLE_BORDER,
    });
    this.cursorY -= 20;

    const summaryRows: { label: string; value: string; emphasis?: boolean }[] = [
      { label: "Subtotal", value: content.subtotal },
      { label: "Discount", value: content.discount },
      { label: "Delivery Adjustment", value: content.deliveryAdjustment },
      { label: "Final Total", value: content.finalTotal, emphasis: true },
    ];

    for (const row of summaryRows) {
      const isFinal = row.emphasis === true;
      const labelSize = isFinal ? 12 : 10;
      const valueSize = isFinal ? 15 : 10;

      this.page.drawText(row.label, {
        x: layout.left + 10,
        y: this.cursorY,
        size: labelSize,
        font: isFinal ? this.fonts.bold : this.fonts.regular,
        color: isFinal ? HEADING_COLOR : MUTED_COLOR,
      });

      const valueText = sanitizePdfText(row.value);
      const valueWidth = (isFinal ? this.fonts.bold : this.fonts.regular).widthOfTextAtSize(
        valueText,
        valueSize,
      );
      this.page.drawText(valueText, {
        x: layout.right - 10 - valueWidth,
        y: isFinal ? this.cursorY - 1 : this.cursorY,
        size: valueSize,
        font: isFinal ? this.fonts.bold : this.fonts.regular,
        color: isFinal ? ACCENT_COLOR : BODY_COLOR,
      });

      this.cursorY -= isFinal ? 28 : 18;
    }

    this.cursorY -= PDF_SPACING.sectionGap;
  }

  private drawClosingApproval(content: ProposalPdfContent): void {
    const ctx = getApprovalDrawContext(this.margins);
    this.cursorY = drawClientApprovalSection(
      this.page,
      this.cursorY,
      { clientName: content.clientName, clientCompany: content.clientCompany },
      this.fonts,
      ctx,
    );
    drawApprovalNote(this.page, this.cursorY, this.fonts, ctx);
  }

  private getLastPageContentZone(): number {
    return PDF_PAGE_HEIGHT - PDF_MARGINS.last.top - (TEMPLATE_FOOTER_RESERVE + 8);
  }

  drawClosingSections(content: ProposalPdfContent): void {
    const lastLayout = tableLayout(PDF_MARGINS.last);
    const contentWidth = PDF_PAGE_WIDTH - PDF_MARGINS.last.left - PDF_MARGINS.last.right;
    const closingHeight = measureClosingBlockHeight(contentWidth, this.fonts);
    const summarySectionHeight = measurePricingSummarySectionHeight(true);
    const summaryOnFooterHeight = measurePricingSummarySectionHeight(false);
    const fullPricingHeight = this.measurePricingTableHeight(content, lastLayout);
    const lastZone = this.getLastPageContentZone();

    const canPackAllOnFooterPage =
      fullPricingHeight + summarySectionHeight + closingHeight + 24 <= lastZone;

    if (canPackAllOnFooterPage) {
      this.startFooterPage();
      this.drawPricingTableSection(content);
      this.drawPricingSummarySection(content);
      this.drawClosingApproval(content);
      return;
    }

    this.drawPricingTableSection(content);

    const summaryAndApprovalFitFooter =
      summaryOnFooterHeight + closingHeight <= lastZone;

    if (summaryAndApprovalFitFooter) {
      this.startFooterPage();
      this.drawPricingSummarySection(content);
      this.drawClosingApproval(content);
      return;
    }

    this.drawPricingSummarySection(content);
    this.startFooterPage();
    this.drawClosingApproval(content);
  }

  renderBody(content: ProposalPdfContent): void {
    this.beginMiddleContent();
    this.drawOverview(content.summarySection, content.summaryItems);
    this.drawSection(content.requirementsSection);
    this.drawSection(content.featuresSection);
    this.drawClosingSections(content);
  }
}
