import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  asChild?: boolean;
};

function getButtonClassName(variant: NonNullable<ButtonProps["variant"]>, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-foreground text-background hover:opacity-90",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:opacity-90",
    variant === "outline" && "border border-input bg-background hover:bg-muted",
    variant === "ghost" && "hover:bg-muted",
    variant === "destructive" && "bg-destructive text-white hover:opacity-90",
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
