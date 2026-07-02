"use client";

import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_LG } from "@/lib/constants/store-logo";
import type { CouponModalCoupon, CouponModalStore } from "@/lib/types";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { resolveCouponLink } from "@/lib/utils/coupon-links";
import { formatDate } from "@/lib/utils/coupon";
import { useCallback, useEffect, useState } from "react";

interface CouponModalProps {
  coupon: CouponModalCoupon;
  store: CouponModalStore;
  initialCopied?: boolean;
  onClose: () => void;
}

export default function CouponModal({
  coupon,
  store,
  initialCopied = false,
  onClose,
}: CouponModalProps) {
  const [copied, setCopied] = useState(initialCopied);
  const merchantUrl = resolveCouponLink(coupon, store);
  const isCode = coupon.tur === "kod" && Boolean(coupon.kod.trim());

  const handleCopy = useCallback(() => {
    if (!isCode) return;
    const ok = copyTextToClipboard(coupon.kod);
    setCopied(ok);
  }, [coupon.kod, isCode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Kapat"
      />

      <div className="coupon-modal-enter relative z-10 w-full max-w-md rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-zinc-200 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-800"
          aria-label="Kapat"
        >
          ✕
        </button>

        <div className="p-6 pt-8 sm:p-8 sm:pt-10">
          {isCode && copied && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
                ✓
              </span>
              Kupon kodu panoya kopyalandı
            </div>
          )}

          <div className="text-center">
            <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl border-2 border-primary/20 bg-white p-1.5 shadow-sm">
              <StoreLogo
                src={store.logo_url}
                alt={`${store.ad} logo`}
                size={STORE_LOGO_SIZE_LG}
                className="rounded-xl object-cover"
              />
            </div>

            <p className="text-sm font-medium text-primary">{store.ad}</p>
            <h2 id="coupon-modal-title" className="mt-1.5 text-xl font-bold text-foreground">
              {coupon.baslik}
            </h2>
          </div>

          {isCode ? (
            <div className="mt-6">
              <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-muted">
                İndirim Kodu
              </p>
              <div className="flex items-stretch overflow-hidden rounded-2xl border-2 border-dashed border-primary/35 bg-gradient-to-br from-primary-light/80 to-white shadow-inner">
                <div className="flex flex-1 items-center justify-center px-4 py-5">
                  <span className="font-mono text-2xl font-bold tracking-[0.2em] text-primary sm:text-3xl">
                    {coupon.kod}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 bg-primary px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  {copied ? "KOPYALANDI" : "KOPYALA"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3.5 text-center text-sm font-medium text-amber-800 ring-1 ring-amber-200/80">
              Bu bir kampanya linkidir. Mağazaya gitmek için aşağıdaki butonu kullanın.
            </div>
          )}

          {merchantUrl ? (
            <button
              type="button"
              onClick={() => { window.location.href = `/out/${coupon.id}`; }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/30"
            >
              Alışverişe Başla
              <span aria-hidden="true">→</span>
            </button>
          ) : null}

          <div className="mt-6 rounded-2xl bg-zinc-50 p-4 text-left ring-1 ring-border/60">
            <h3 className="text-sm font-semibold text-foreground">Detaylar</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{coupon.aciklama}</p>
            <p className="mt-3 text-xs text-muted">
              Geçerlilik: {formatDate(coupon.baslangic_tarihi)} — {formatDate(coupon.bitis_tarihi)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
