"use client";

import CouponModal from "@/components/coupons/CouponModal";
import type { Coupon, Store } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CouponModalHandlerProps {
  store: Store;
  coupons: Coupon[];
}

export default function CouponModalHandler({ store, coupons }: CouponModalHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const kuponId = searchParams.get("kupon");
  const selectedCoupon = kuponId
    ? coupons.find((c) => c.id === Number(kuponId))
    : undefined;

  const handleClose = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  if (!selectedCoupon) return null;

  return (
    <CouponModal coupon={selectedCoupon} store={store} onClose={handleClose} />
  );
}
