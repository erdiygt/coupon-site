import type { Coupon, Store } from "@/lib/types";
import { resolveCouponLink } from "@/lib/utils/coupon-links";

export function couponClickAnchorProps(
  coupon: Pick<Coupon, "id" | "link">,
  store: Pick<Store, "slug" | "link">,
) {
  const hasAffiliate = Boolean(resolveCouponLink(coupon, store));

  return {
    href: `/${store.slug}?kupon=${coupon.id}`,
    "data-coupon-id": String(coupon.id),
    "data-store-slug": store.slug,
    "data-has-affiliate": hasAffiliate ? ("true" as const) : ("false" as const),
    rel: "nofollow sponsored noopener" as const,
  };
}
