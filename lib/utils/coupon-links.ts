import type { Coupon, Store } from "@/lib/types";
import { safeHttpsUrlString } from "@/lib/utils/safe-url";

/** Kupon linki yoksa mağaza linkine düşer; yalnızca güvenli https URL döner. */
export function resolveCouponLink(
  coupon: Pick<Coupon, "link">,
  store: Pick<Store, "link">,
): string {
  const couponLink = safeHttpsUrlString(coupon.link);
  if (couponLink) return couponLink;
  return safeHttpsUrlString(store.link);
}
