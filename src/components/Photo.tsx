import Image from "next/image";
import type { ReactNode } from "react";
import { photoSrc } from "@/lib/photos";

/**
 * Renders an optimised local photo (AVIF/WebP, responsive sizes, lazy by default) if a file exists for
 * the slot, otherwise the fallback. The parent must be `relative` with a size.
 */
export default function Photo({
  slot,
  alt,
  sizes,
  priority = false,
  className = "",
  fallback = null,
}: {
  slot: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  fallback?: ReactNode;
}) {
  const src = photoSrc(slot);
  if (!src) return <>{fallback}</>;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={78} className={`object-cover ${className}`} />;
}
