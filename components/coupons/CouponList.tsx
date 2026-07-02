import CouponCard from "@/components/coupons/CouponCard";
import CouponClickHandler from "@/components/coupons/CouponClickHandler";
import type { Coupon, Store } from "@/lib/types";

interface CouponListProps {
  coupons: Coupon[];
  store: Store;
  title: string;
  expired?: boolean;
}

export default function CouponList({
  coupons,
  store,
  title,
  expired = false,
}: CouponListProps) {
  if (coupons.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-foreground">
        <span
          className={`h-6 w-1 rounded-full ${expired ? "bg-zinc-300" : "bg-primary"}`}
        />
        {title}
        <span className="ml-1 text-base font-normal text-muted">({coupons.length})</span>
      </h2>
      {!expired && (
        <p className="mb-4 max-w-prose text-sm leading-relaxed text-muted">
          <strong className="font-semibold text-foreground">{store.ad}</strong> alışverişlerinizde
          geçerli güncel kupon ve kampanyalar aşağıda listelenmiştir.
        </p>
      )}
      {expired && (
        <p className="mb-4 max-w-prose text-sm leading-relaxed text-muted">
          Süresi dolmuş <strong className="font-semibold text-foreground">{store.ad}</strong>{" "}
          kuponları; bazıları hâlâ geçerli olabilir.
        </p>
      )}
      <CouponClickHandler>
        <div className="flex flex-col gap-4">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} store={store} expired={expired} />
          ))}
        </div>
      </CouponClickHandler>
    </section>
  );
}
