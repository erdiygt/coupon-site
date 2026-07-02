import CouponClickHandler from "@/components/coupons/CouponClickHandler";
import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_SM } from "@/lib/constants/store-logo";
import type { Coupon, Store } from "@/lib/types";
import { couponClickAnchorProps } from "@/lib/utils/coupon-click-attrs";

interface HomeCouponSectionProps {
  coupons: Coupon[];
  getStore: (storeId: number) => Store | undefined;
}

export default function HomeCouponSection({ coupons, getStore }: HomeCouponSectionProps) {
  if (coupons.length === 0) return null;

  return (
    <section className="mt-14" aria-labelledby="home-coupons-heading">
      <div className="mb-6 rounded-2xl border border-border bg-card px-4 py-4 text-center shadow-sm sm:px-6">
        <h2 id="home-coupons-heading" className="text-base font-semibold text-foreground sm:text-lg">
          Popüler Kuponlar
        </h2>
      </div>

      <CouponClickHandler>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {coupons.map((coupon) => {
            const store = getStore(coupon.store_id);
            if (!store) return null;

            const buttonLabel = coupon.tur === "kod" ? "KODU AÇ" : "KAMPANYAYI GÖR";
            const clickProps = couponClickAnchorProps(coupon, store);

            return (
              <article
                key={coupon.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                  <StoreLogo
                    src={store.logo_url}
                    alt={store.ad}
                    size={STORE_LOGO_SIZE_SM}
                    className="rounded-lg object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-primary">{store.ad}</p>
                  <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {coupon.baslik}
                  </h3>
                </div>

                <a
                  {...clickProps}
                  aria-label={`${store.ad}, ${coupon.baslik}, Kupon ID: ${coupon.id}`}
                  className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-dark sm:px-5 sm:text-sm"
                >
                  {buttonLabel}
                </a>
              </article>
            );
          })}
        </div>
      </CouponClickHandler>
    </section>
  );
}
