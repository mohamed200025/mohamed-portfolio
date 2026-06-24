import { rgb, type PDFPage, type PDFFont, type RGB } from "pdf-lib";
import { PDF_COLORS } from "./layout";

export function sanitizePdfText(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
): string[] {
  const sanitized = sanitizePdfText(text);
  if (!sanitized) return [];

  const words = sanitized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function toRgb(color: { r: number; g: number; b: number }): RGB {
  return rgb(color.r, color.g, color.b);
}

export const BODY_COLOR = toRgb(PDF_COLORS.body);
export const HEADING_COLOR = toRgb(PDF_COLORS.heading);
export const MUTED_COLOR = toRgb(PDF_COLORS.muted);

export function drawCenteredText(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size: number,
  color: RGB = BODY_COLOR,
): void {
  const sanitized = sanitizePdfText(text);
  if (!sanitized) return;
  const pageWidth = page.getWidth();
  const textWidth = font.widthOfTextAtSize(sanitized, size);
  page.drawText(sanitized, {
    x: (pageWidth - textWidth) / 2,
    y,
    size,
    font,
    color,
  });
}

export function measureWrappedHeight(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
  lineHeight: number,
): number {
  const lines = wrapText(text, maxWidth, font, fontSize);
  if (lines.length === 0) return 0;
  return lines.length * lineHeight;
}
