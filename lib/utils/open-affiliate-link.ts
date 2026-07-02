"use client";

export type AffiliateOpenResult = "new-tab" | "blocked" | "skipped";

/**
 * Modal içindeki "Alışverişe Başla" için —
 * wp-coupon 'next' mantığıyla aynı: affiliate _blank, sonra _self navigasyon.
 * Çağıran bileşen hemen ardından router.push(modalUrl) yapmalı.
 */
export function openAffiliateInBackground(url: string): AffiliateOpenResult {
  const trimmed = url.trim();
  if (!trimmed) return "skipped";

  const newTab = window.open(trimmed, "_blank");

  if (!newTab) {
    return "blocked";
  }

  try {
    newTab.opener = null;
  } catch {
    // ignore
  }

  return "new-tab";
}
