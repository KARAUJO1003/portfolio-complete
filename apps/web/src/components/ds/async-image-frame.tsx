"use client";

import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState, type ReactNode } from "react";

type AsyncImageFrameProps = Omit<ImageProps, "alt" | "className" | "fill" | "onError" | "onLoad" | "src"> & {
  alt: string;
  className?: string;
  fallback: ReactNode;
  imageClassName?: string;
  loadingSlot?: ReactNode;
  overlay?: ReactNode;
  src?: string;
};

export function AsyncImageFrame({
  alt,
  className,
  fallback,
  imageClassName,
  loadingSlot,
  overlay,
  src,
  ...props
}: AsyncImageFrameProps) {
  const [status, setStatus] = useState<"error" | "loaded" | "loading">(src ? "loading" : "error");

  useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  const canRenderImage = Boolean(src) && status !== "error";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {canRenderImage && src ? (
        <Image
          alt={alt}
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
          fill
          src={src}
          unoptimized
          onError={() => setStatus("error")}
          onLoad={() => setStatus("loaded")}
          {...props}
        />
      ) : (
        fallback
      )}

      {canRenderImage && status === "loading" ? (
        loadingSlot || <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-muted" />
      ) : null}

      {overlay}
    </div>
  );
}
