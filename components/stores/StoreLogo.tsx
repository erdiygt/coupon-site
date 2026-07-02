import { resolveStoreLogoDisplayUrl } from "@/lib/data/store-logos";
import Image from "next/image";

interface StoreLogoProps {
  src: string;
  alt: string;
  /** Logo yoksa avatar için kullanılır (varsayılan: alt metninden). */
  name?: string;
  /** Görüntüleme boyutu (px) — sizes ve lazy yükleme için. */
  size: number;
  /** Sadece above-the-fold görsellerde true. */
  priority?: boolean;
  className?: string;
  /** true ise parent relative + overflow-hidden olmalı. */
  fill?: boolean;
}

export default function StoreLogo({
  src,
  alt,
  name,
  size,
  priority = false,
  className = "object-cover",
  fill = true,
}: StoreLogoProps) {
  const fallbackName =
    name?.trim() || alt.replace(/\s*logo$/i, "").trim() || alt;
  const resolved = resolveStoreLogoDisplayUrl(src, fallbackName);

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={`${size}px`}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      className={className}
    />
  );
}
