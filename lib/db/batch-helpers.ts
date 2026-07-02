import type { Coupon, StoreCouponStats } from "@/lib/types";
import { isCouponActive } from "@/lib/utils/coupon";

export function computeStoreCouponStats(coupons: Coupon[]): StoreCouponStats {
  const aktif = coupons.filter((c) => isCouponActive(c));
  return {
    toplam_aktif: aktif.length,
    kod_sayisi: aktif.filter((c) => c.tur === "kod").length,
    kampanya_sayisi: aktif.filter((c) => c.tur === "kampanya").length,
  };
}

export function buildActiveCouponCountMap(
  coupons: Coupon[],
  storeIds?: number[],
): Map<number, number> {
  const filter = storeIds ? new Set(storeIds) : null;
  const map = new Map<number, number>();

  for (const coupon of coupons) {
    if (!isCouponActive(coupon)) continue;
    if (filter && !filter.has(coupon.store_id)) continue;
    map.set(coupon.store_id, (map.get(coupon.store_id) ?? 0) + 1);
  }

  return map;
}

export function buildCategoryStoreCountMap(
  stores: { kategori_id: number }[],
): Map<number, number> {
  const map = new Map<number, number>();
  for (const store of stores) {
    map.set(store.kategori_id, (map.get(store.kategori_id) ?? 0) + 1);
  }
  return map;
}
