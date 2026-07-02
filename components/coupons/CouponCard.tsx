import type { Coupon, Store } from "@/lib/types";
import { couponClickAnchorProps } from "@/lib/utils/coupon-click-attrs";
import { formatDate } from "@/lib/utils/coupon";

interface CouponCardProps {
  coupon: Coupon;
  store: Store;
  expired?: boolean;
}

export default function CouponCard({
  coupon,
  store,
  expired = false,
}: CouponCardProps) {
  const buttonLabel = coupon.tur === "kod" ? "KODU AL" : "KAMPANYAYI GÖSTER";
  const usageCount = coupon.kullanim_sayisi ?? 0;
  const clickProps = couponClickAnchorProps(coupon, store);
  const buttonClassName =
    "block w-full whitespace-nowrap rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-primary-dark sm:w-auto";

  return (
    <article
      id={`kupon-${coupon.id}`}
      className={`flex flex-col rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between ${
        expired ? "border-border opacity-75" : "border-border"
      }`}
    >
      <div className="flex-1 p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              coupon.tur === "kod"
                ? "bg-primary-light text-primary"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {coupon.tur === "kod" ? "İndirim Kodu" : "Kampanya"}
          </span>
          {expired && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
              Süresi Doldu
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-foreground">{coupon.baslik}</h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{coupon.aciklama}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>
            Geçerlilik: {formatDate(coupon.baslangic_tarihi)} — {formatDate(coupon.bitis_tarihi)}
          </span>
          {usageCount > 0 && (
            <span>{usageCount.toLocaleString("tr-TR")} kez kullanıldı</span>
          )}
        </div>
      </div>

      <div className="border-t border-border p-4 sm:border-t-0 sm:border-l sm:px-6">
        {expired ? (
          <span className="block w-full cursor-not-allowed whitespace-nowrap rounded-lg bg-zinc-100 px-6 py-3 text-center text-sm font-bold text-zinc-400 sm:w-auto">
            SÜRESİ DOLDU
          </span>
        ) : (
          <a
            {...clickProps}
            aria-label={`${store.ad}, ${coupon.baslik}`}
            className={buttonClassName}
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </article>
  );
}
