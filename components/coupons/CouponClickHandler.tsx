"use client";

import type { ReactNode } from "react";

/**
 * wp-coupon akışı:
 * - Yeni sekme: /{slug}?kupon={id} → CouponFromQuery modal açar
 * - Mevcut sekme: /out/{id} → affiliate redirect
 */
export default function CouponClickHandler({ children }: { children: ReactNode }) {
  function handleClick(e: React.MouseEvent) {
    const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[data-coupon-id][data-store-slug]",
    );
    if (!anchor) return;

    e.preventDefault();
    e.stopPropagation();

    const couponId = anchor.dataset.couponId;
    const storeSlug = anchor.dataset.storeSlug;
    if (!couponId || !storeSlug) return;

    const modalUrl = `/${storeSlug}?kupon=${couponId}`;
    window.open(modalUrl, "_blank");

    if (anchor.dataset.hasAffiliate === "true") {
      window.location.href = `/out/${couponId}`;
    }
  }

  return <div onClick={handleClick}>{children}</div>;
}
