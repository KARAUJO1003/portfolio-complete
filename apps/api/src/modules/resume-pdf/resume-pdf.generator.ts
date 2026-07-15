export type PdfSpan = {
  text: string;
  bold?: boolean;
};

export type PdfLine = {
  text?: string;
  spans?: PdfSpan[];
  size?: number;
  bold?: boolean;
  color?: "default" | "brand";
  gapBefore?: number;
  indent?: number;
  pageBreakBefore?: boolean;
};

const pageWidth = 595;
const pageHeight = 842;
const marginX = 62;
const marginTop = 52;
const marginBottom = 48;
const contentWidth = pageWidth - marginX * 2;

export function generateClassicAtsPdf(lines: PdfLine[], options: { compact?: boolean } = {}) {
  const pages: string[] = [];
  let content = "";
  let y = pageHeight - marginTop;

  function addRawLine(line: PdfLine, spans: PdfSpan[]) {
    const scale = options.compact ? 0.9 : 1;
    const size = (line.size ?? 10) * scale;
    const gapBefore = (line.gapBefore ?? 0) * scale;
    const lineHeight = Math.max(13, size + 4);
    const indent = line.indent ?? 0;

    if (line.pageBreakBefore && content) {
      pages.push(content);
      content = "";
      y = pageHeight - marginTop;
    }
    y -= gapBefore;
    if (y < marginBottom + lineHeight) {
      pages.push(content);
      content = "";
      y = pageHeight - marginTop;
    }

    let x = marginX + indent;
    const color = line.color === "brand" ? "0.047 0.451 0.741 rg" : "0.067 0.067 0.067 rg";
    for (const span of spans) {
      if (!span.text) continue;
      const font = span.bold || line.bold ? "F2" : "F1";
      content += `BT ${color} /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(span.text)}) Tj ET\n`;
      x += estimateTextWidth(span.text, size, Boolean(span.bold || line.bold));
    }
    y -= lineHeight;
  }

  for (const line of lines) {
    const spans = line.spans ?? parseMarkdownSpans(line.text ?? "", line.bold);
    const wrapped = wrapSpans(spans, contentWidth - (line.indent ?? 0), line.size ?? 10);
    wrapped.forEach((lineSpans, index) =>
      addRawLine(
        { ...line, gapBefore: index === 0 ? line.gapBefore : 0, pageBreakBefore: index === 0 && line.pageBreakBefore },
        lineSpans,
      ),
    );
  }

  pages.push(content);
  return buildPdf(pages);
}

export function heading(text: string): PdfLine {
  return { text: text.toUpperCase(), size: 10.5, bold: true, color: "brand", gapBefore: 13 };
}

export function subheading(text: string): PdfLine {
  return { text: text.toUpperCase(), size: 10, bold: true, color: "brand", gapBefore: 5, indent: 8 };
}

export function paragraph(text: string, options: Partial<PdfLine> = {}): PdfLine {
  return { text, size: 9.5, ...options };
}

export function bullet(text: string, options: Partial<PdfLine> = {}): PdfLine {
  return { text: `• ${text}`, size: 9.5, indent: 8, ...options };
}

export function numbered(text: string, index: number, options: Partial<PdfLine> = {}): PdfLine {
  return { text: `${index}. ${text}`, size: 9.5, indent: 8, ...options };
}

export function spans(...items: PdfSpan[]): PdfLine {
  return { spans: items, size: 9.5 };
}

function parseMarkdownSpans(text: string, forceBold = false): PdfSpan[] {
  const normalized = normalizeText(text).trim();
  const parts = normalized.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part) => {
    const markdownBold = part.startsWith("**") && part.endsWith("**");
    return {
      text: markdownBold ? part.slice(2, -2) : part,
      bold: forceBold || markdownBold,
    };
  });
}

function wrapSpans(spans: PdfSpan[], maxWidth: number, size: number) {
  const tokens = spans.flatMap((span) =>
    span.text.split(/(\s+)/).filter(Boolean).map((text) => ({ ...span, text })),
  );
  const lines: PdfSpan[][] = [];
  let current: PdfSpan[] = [];
  let width = 0;

  for (const token of tokens) {
    const tokenWidth = estimateTextWidth(token.text, size, Boolean(token.bold));
    if (current.length && width + tokenWidth > maxWidth && token.text.trim()) {
      lines.push(mergeAdjacentSpans(trimSpans(current)));
      current = [];
      width = 0;
    }
    if (!current.length && !token.text.trim()) continue;
    current.push(token);
    width += tokenWidth;
  }

  if (current.length) lines.push(mergeAdjacentSpans(trimSpans(current)));
  return lines.length ? lines : [[{ text: "" }]];
}

function trimSpans(spans: PdfSpan[]) {
  const result = [...spans];
  if (result.length) result[0] = { ...result[0], text: result[0].text.replace(/^\s+/, "") };
  if (result.length) result[result.length - 1] = { ...result[result.length - 1], text: result[result.length - 1].text.replace(/\s+$/, "") };
  return result.filter((span) => span.text);
}

function mergeAdjacentSpans(spans: PdfSpan[]) {
  return spans.reduce<PdfSpan[]>((result, span) => {
    const previous = result[result.length - 1];
    if (previous && Boolean(previous.bold) === Boolean(span.bold)) {
      previous.text += span.text;
    } else {
      result.push({ ...span });
    }
    return result;
  }, []);
}

function estimateTextWidth(text: string, size: number, bold: boolean) {
  return text.length * size * (bold ? 0.62 : 0.5);
}

function normalizeText(text: string) {
  return text
    .replace(/\u2022/g, "\x95")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
}

function escapePdfText(text: string) {
  return normalizeText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\x95/g, "\\225");
}

function buildPdf(pageContents: string[]) {
  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageObjectIds = pageContents.map((_, index) => 3 + index * 2);
  objects.push(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageContents.length} >>`);

  pageContents.forEach((pageContent, index) => {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${pageContents.length * 2 + 3} 0 R /F2 ${pageContents.length * 2 + 4} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    objects.push(`<< /Length ${Buffer.byteLength(pageContent, "latin1")} >>\nstream\n${pageContent}endstream`);
  });

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}
