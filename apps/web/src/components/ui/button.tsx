import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  asChild?: boolean;
};

function getButtonClassName(variant: NonNullable<ButtonProps["variant"]>, className?: string) {
  return cn(
    "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    variant === "default" && "bg-foreground text-background hover:opacity-90",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:opacity-90",
    variant === "outline" && "border border-input bg-background hover:bg-muted",
    variant === "ghost" && "hover:bg-muted",
    variant === "destructive" && "bg-danger text-background hover:opacity-90",
    variant === "link" && "p-0 underline-offset-4 hover:underline",
    className,
  );
}

export function Button({ className, variant = "default", asChild, children, ...props }: ButtonProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: getButtonClassName(
        variant,
        cn((children.props as { className?: string }).className, className),
      ),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      className={getButtonClassName(variant, className)}
      {...props}
    >
      {children}
    </button>
  );
}
