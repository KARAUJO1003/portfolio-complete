import { Fragment } from "react";
import { cn } from "@/lib/utils";

type RichTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  value: string;
};

export function RichText({ className, value, ...props }: RichTextProps) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <span className={cn("whitespace-pre-line", className)} {...props}>
      {parts.map((part, index) => {
        const bold = part.startsWith("**") && part.endsWith("**");
        return bold
          ? <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
          : <Fragment key={`${part}-${index}`}>{part}</Fragment>;
      })}
    </span>
  );
}
