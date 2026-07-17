import { cn } from "@/lib/utils";

const DANGEROUS_TAGS = /<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi;
const DANGEROUS_SELF_CLOSING_TAGS = /<(script|style|iframe|object|embed)[^>]*\/>/gi;
const EVENT_HANDLER_ATTRIBUTES = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URI_ATTRIBUTES = /\s+(href|src)\s*=\s*("|')\s*(javascript|data|vbscript):[^"']*\2/gi;

function sanitizeHtml(html: string) {
  return html
    .replace(DANGEROUS_TAGS, "")
    .replace(DANGEROUS_SELF_CLOSING_TAGS, "")
    .replace(EVENT_HANDLER_ATTRIBUTES, "")
    .replace(DANGEROUS_URI_ATTRIBUTES, "");
}

type HtmlContentProps = {
  html: string;
  className?: string;
};

export function HtmlContent({ className, html }: HtmlContentProps) {
  return (
    <div
      className={cn(
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold",
        "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
        "[&_[data-callout]]:mb-3 [&_[data-callout]]:rounded-md [&_[data-callout]]:border [&_[data-callout]]:border-primary/30 [&_[data-callout]]:bg-primary-tint [&_[data-callout]]:p-3",
        "[&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
