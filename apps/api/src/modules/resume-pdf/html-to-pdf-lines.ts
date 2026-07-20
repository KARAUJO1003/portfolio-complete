import { bulletSpans, numberedSpans, subheading, type PdfLine, type PdfSpan } from "./resume-pdf.generator";

const blockRegex = /<(h2|h3|p|blockquote|ul|ol|div)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const listItemRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
const boldTagRegex = /(<\/?(?:strong|b)>)/gi;

/**
 * Converte o HTML salvo pelo RichTextEditor (Tiptap) em linhas do gerador de
 * PDF hand-rolled (`resume-pdf.generator.ts`). Cobre os nos que o editor
 * produz: paragrafo, h2/h3, lista com/sem numeracao, blockquote, negrito e o
 * bloco Callout (renderizado como `<div data-callout>`).
 */
export function htmlToPdfLines(html: string | undefined | null): PdfLine[] {
  if (!html?.trim()) return [];

  const lines: PdfLine[] = [];
  blockRegex.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(html))) {
    const [, tag, inner] = match;

    if (tag === "h2") {
      const text = stripInlineTags(inner);
      if (text) lines.push(subheading(text));
      continue;
    }

    if (tag === "h3") {
      const text = stripInlineTags(inner);
      if (text) lines.push({ text, size: 9.5, bold: true, indent: 8 });
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const items = [...inner.matchAll(listItemRegex)];
      items.forEach((item, index) => {
        const itemSpans = toSpans(item[1]);
        if (!itemSpans.length) return;
        lines.push(tag === "ol" ? numberedSpans(itemSpans, index + 1) : bulletSpans(itemSpans));
      });
      continue;
    }

    if (tag === "blockquote") {
      const quoteSpans = toSpans(inner);
      if (quoteSpans.length) lines.push({ spans: quoteSpans, size: 9.5, indent: 12 });
      continue;
    }

    if (tag === "div") {
      // Callout: renderiza como paragrafo unico recuado, sem tentar preservar sub-blocos.
      const calloutSpans = toSpans(inner);
      if (calloutSpans.length) lines.push({ spans: calloutSpans, size: 9.5, indent: 8 });
      continue;
    }

    const paragraphSpans = toSpans(inner);
    if (paragraphSpans.length) lines.push({ spans: paragraphSpans, size: 9.5 });
  }

  return lines;
}

/** Achata todo o HTML em um unico array de spans (paragrafos/itens grudados), para contextos de uma linha so (ex.: bullet de skill). */
export function htmlToInlineSpans(html: string | undefined | null): PdfSpan[] {
  if (!html?.trim()) return [];
  return htmlToPdfLines(html).flatMap((line) => line.spans ?? (line.text ? [{ text: line.text, bold: line.bold }] : []));
}

/**
 * O Tiptap salva campo "vazio" como HTML truthy (ex.: "<p></p>"), entao um
 * simples `if (profile.summary)` deixa passar secoes sem conteudo visivel
 * (heading renderiza, corpo fica em branco). Usar esta checagem antes de
 * empurrar qualquer heading condicionado a um campo rich-text.
 */
export function hasVisibleText(html: string | undefined | null): boolean {
  return htmlToPdfLines(html).length > 0;
}

function toSpans(innerHtml: string): PdfSpan[] {
  const withoutBreaks = innerHtml.replace(/<br\s*\/?>/gi, " ");
  const parts = withoutBreaks.split(boldTagRegex);
  const result: PdfSpan[] = [];
  let bold = false;

  for (const part of parts) {
    if (/^<(strong|b)>$/i.test(part)) {
      bold = true;
      continue;
    }
    if (/^<\/(strong|b)>$/i.test(part)) {
      bold = false;
      continue;
    }
    const text = stripInlineTags(part);
    if (text) result.push({ text, bold });
  }

  return result;
}

function stripInlineTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}
