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

// A4 em pontos (210mm x 297mm), margens uniformes de ~2cm (padrao comum de
// curriculo ATS/Europass).
const pageWidth = 595;
const pageHeight = 842;
const marginX = 57;
const marginTop = 57;
const marginBottom = 57;
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

export function bulletSpans(items: PdfSpan[], options: Partial<PdfLine> = {}): PdfLine {
  return { spans: [{ text: "• " }, ...items], size: 9.5, indent: 8, ...options };
}

export function numberedSpans(items: PdfSpan[], index: number, options: Partial<PdfLine> = {}): PdfLine {
  return { spans: [{ text: `${index}. ` }, ...items], size: 9.5, indent: 8, ...options };
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

// Metricas Adobe AFM (Core 14) para Helvetica/Helvetica-Bold, em 1/1000 em,
// ASCII 32-126 - a mesma tabela padrao usada por qualquer gerador de PDF
// (pdfkit, reportlab etc). Substitui a estimativa antiga por caractere fixo
// (`length * size * fator`), que ignorava que "i" e "M" tem larguras bem
// diferentes e causava o desalinhamento de texto reportado.
const helveticaWidths: Record<number, number> = {
  32: 278, 33: 278, 34: 355, 35: 556, 36: 556, 37: 889, 38: 667, 39: 191,
  40: 333, 41: 333, 42: 389, 43: 584, 44: 278, 45: 333, 46: 278, 47: 278,
  48: 556, 49: 556, 50: 556, 51: 556, 52: 556, 53: 556, 54: 556, 55: 556, 56: 556, 57: 556,
  58: 278, 59: 278, 60: 584, 61: 584, 62: 584, 63: 556, 64: 1015,
  65: 667, 66: 667, 67: 722, 68: 722, 69: 667, 70: 611, 71: 778, 72: 722, 73: 278, 74: 500,
  75: 667, 76: 556, 77: 833, 78: 722, 79: 778, 80: 667, 81: 778, 82: 722, 83: 667, 84: 611,
  85: 722, 86: 667, 87: 944, 88: 667, 89: 667, 90: 611,
  91: 278, 92: 278, 93: 278, 94: 469, 95: 556, 96: 333,
  97: 556, 98: 556, 99: 500, 100: 556, 101: 556, 102: 278, 103: 556, 104: 556, 105: 222, 106: 222,
  107: 500, 108: 222, 109: 833, 110: 556, 111: 556, 112: 556, 113: 556, 114: 333, 115: 500, 116: 278,
  117: 556, 118: 500, 119: 722, 120: 500, 121: 500, 122: 500,
  123: 334, 124: 260, 125: 334, 126: 584,
};

const helveticaBoldWidths: Record<number, number> = {
  32: 278, 33: 333, 34: 474, 35: 556, 36: 556, 37: 889, 38: 722, 39: 238,
  40: 333, 41: 333, 42: 389, 43: 584, 44: 278, 45: 333, 46: 278, 47: 278,
  48: 556, 49: 556, 50: 556, 51: 556, 52: 556, 53: 556, 54: 556, 55: 556, 56: 556, 57: 556,
  58: 333, 59: 333, 60: 584, 61: 584, 62: 584, 63: 611, 64: 975,
  65: 722, 66: 722, 67: 722, 68: 722, 69: 667, 70: 611, 71: 778, 72: 722, 73: 278, 74: 556,
  75: 722, 76: 611, 77: 833, 78: 722, 79: 778, 80: 667, 81: 778, 82: 722, 83: 667, 84: 611,
  85: 722, 86: 667, 87: 944, 88: 667, 89: 667, 90: 611,
  91: 333, 92: 278, 93: 333, 94: 584, 95: 556, 96: 333,
  97: 556, 98: 611, 99: 556, 100: 611, 101: 556, 102: 333, 103: 611, 104: 611, 105: 278, 106: 278,
  107: 556, 108: 278, 109: 889, 110: 611, 111: 611, 112: 611, 113: 611, 114: 389, 115: 556, 116: 333,
  117: 611, 118: 556, 119: 778, 120: 556, 121: 556, 122: 500,
  123: 389, 124: 280, 125: 389, 126: 584,
};

/** Remove acentos (NFD) para achar a largura do glifo base - Helvetica da a mesma largura ao caractere acentuado e ao base. */
function baseCharCode(char: string) {
  const combiningMarks = new RegExp("[\\u0300-\\u036f]", "g");
  const normalized = char.normalize("NFD").replace(combiningMarks, "");
  return normalized.charCodeAt(0) || char.charCodeAt(0);
}

function estimateTextWidth(text: string, size: number, bold: boolean) {
  const table = bold ? helveticaBoldWidths : helveticaWidths;
  let units = 0;
  for (const char of text) {
    units += table[baseCharCode(char)] ?? 556;
  }
  return (units / 1000) * size;
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
