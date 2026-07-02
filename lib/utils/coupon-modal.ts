import type { Coupon, CouponModalCoupon, CouponModalStore, Store } from "@/lib/types";

export function toCouponModalStore(
  store: Pick<Store, "id" | "ad" | "slug" | "logo_url" | "link">,
): CouponModalStore {
  return {
    id: store.id,
    ad: store.ad,
    slug: store.slug,
    logo_url: store.logo_url,
    link: store.link,
  };
}

export function toCouponModalCoupon(
  coupon: Pick<
    Coupon,
    | "id"
    | "baslik"
    | "aciklama"
    | "kod"
    | "link"
    | "tur"
    | "baslangic_tarihi"
    | "bitis_tarihi"
  >,
): CouponModalCoupon {
  return {
    id: coupon.id,
    baslik: coupon.baslik,
    aciklama: coupon.aciklama,
    kod: coupon.kod,
    link: coupon.link,
    tur: coupon.tur,
    baslangic_tarihi: coupon.baslangic_tarihi,
    bitis_tarihi: coupon.bitis_tarihi,
  };
}
