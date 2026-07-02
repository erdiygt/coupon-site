"use client";

import CouponFromQuery from "@/components/coupons/CouponFromQuery";
import type { CouponModalCoupon, CouponModalStore } from "@/lib/types";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CouponModal = dynamic(() => import("@/components/coupons/CouponModal"), {
  ssr: false,
});

export interface InitialCouponModal {
  coupon: CouponModalCoupon;
  store: CouponModalStore;
}

interface CouponModalState {
  coupon: CouponModalCoupon;
  store: CouponModalStore;
  copied: boolean;
}

interface CouponModalContextValue {
  showCouponModal: (
    coupon: CouponModalCoupon,
    store: CouponModalStore,
    copied: boolean,
  ) => void;
  prefetchedCouponId: number | null;
}

const CouponModalContext = createContext<CouponModalContextValue | null>(null);

export function useCouponModal(): CouponModalContextValue {
  const ctx = useContext(CouponModalContext);
  if (!ctx) {
    throw new Error("useCouponModal yalnızca CouponModalProvider içinde kullanılabilir.");
  }
  return ctx;
}

export function useCouponModalOptional(): CouponModalContextValue | null {
  return useContext(CouponModalContext);
}

interface CouponModalProviderProps {
  children: React.ReactNode;
  initialCouponModal?: InitialCouponModal | null;
}

export default function CouponModalProvider({
  children,
  initialCouponModal = null,
}: CouponModalProviderProps) {
  const [modal, setModal] = useState<CouponModalState | null>(() =>
    initialCouponModal
      ? { coupon: initialCouponModal.coupon, store: initialCouponModal.store, copied: false }
      : null,
  );

  const showCouponModal = useCallback(
    (coupon: CouponModalCoupon, store: CouponModalStore, copied: boolean) => {
      setModal({ coupon, store, copied });
    },
    [],
  );

  const value = useMemo(
    () => ({
      showCouponModal,
      prefetchedCouponId: initialCouponModal?.coupon.id ?? null,
    }),
    [showCouponModal, initialCouponModal?.coupon.id],
  );

  return (
    <CouponModalContext.Provider value={value}>
      {children}
      <CouponFromQuery />
      {modal ? (
        <CouponModal
          coupon={modal.coupon}
          store={modal.store}
          initialCopied={modal.copied}
          onClose={() => setModal(null)}
        />
      ) : null}
    </CouponModalContext.Provider>
  );
}
