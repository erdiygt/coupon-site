"use client";

import { useCouponModal } from "@/components/coupons/CouponModalProvider";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const COUPON_OPEN_API = "/api/coupon-open";

/** URL'de ?kupon= varsa modal aç; URL parametresi korunur. */
function CouponFromQueryInner() {
  const searchParams = useSearchParams();
  const { showCouponModal, prefetchedCouponId } = useCouponModal();
  const handled = useRef<string | null>(null);

  const kuponId = searchParams.get("kupon");

  useEffect(() => {
    if (!kuponId) {
      handled.current = null;
      return;
    }

    if (handled.current === kuponId) return;

    const numericId = Number(kuponId);
    if (prefetchedCouponId !== null && numericId === prefetchedCouponId) {
      handled.current = kuponId;
      return;
    }

    handled.current = kuponId;

    fetch(`${COUPON_OPEN_API}/${kuponId}`, { headers: { Accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.coupon || !data?.store) return;
        showCouponModal(data.coupon, data.store, false);
      })
      .catch(() => {
        handled.current = null;
      });
  }, [kuponId, prefetchedCouponId, showCouponModal]);

  return null;
}

export default function CouponFromQuery() {
  return (
    <Suspense fallback={null}>
      <CouponFromQueryInner />
    </Suspense>
  );
}
