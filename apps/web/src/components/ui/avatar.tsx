"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Adaptado do particle p-avatar-6 do Coss (imagem + fallback quando falha
 * ou nao ha src). Sem lib de primitivo (Base UI nao tem Avatar) - troca
 * simples de estado no erro de carregamento da imagem.
 */
export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-raised text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({ alt, className, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={cn("absolute inset-0 size-full object-cover", className)}
      src={src}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("absolute inset-0 flex items-center justify-center", className)} {...props} />;
}
