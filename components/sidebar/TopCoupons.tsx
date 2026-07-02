import CouponClickHandler from "@/components/coupons/CouponClickHandler";
import type { Coupon, Store } from "@/lib/types";
import { couponClickAnchorProps } from "@/lib/utils/coupon-click-attrs";

interface TopCouponsProps {
  coupons: Coupon[];
  storesById: Map<number, Store>;
}

export default function TopCoupons({ coupons, storesById }: TopCouponsProps) {
  if (coupons.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
        <span className="h-5 w-1 rounded-full bg-primary" />
        En Çok Kullanılan Kuponlar
      </h3>
      <CouponClickHandler>
        <ul className="space-y-3">
          {coupons.map((coupon) => {
            const store = storesById.get(coupon.store_id);
            if (!store) return null;

            const clickProps = couponClickAnchorProps(coupon, store);

            return (
              <li key={coupon.id}>
                <a
                  {...clickProps}
                  aria-label={`${store.ad}, ${coupon.baslik}, Kupon ID: ${coupon.id}`}
                  className="block w-full rounded-lg p-2 text-left transition-colors hover:bg-primary-light/50"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {coupon.baslik}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {store.ad} · {coupon.kullanim_sayisi?.toLocaleString("tr-TR")} kullanım
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
      </CouponClickHandler>
    </div>
  );
}
