import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_XL } from "@/lib/constants/store-logo";
import type { Store } from "@/lib/types";
import { AFFILIATE_LINK_REL } from "@/lib/site/links";
import { stripHtmlPreview } from "@/lib/utils/html";
import { safeHttpsUrlString } from "@/lib/utils/safe-url";

interface StoreHeaderProps {
  store: Store;
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  const storeUrl = safeHttpsUrlString(store.link);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-primary-light bg-white p-2 sm:h-28 sm:w-28">
          <StoreLogo
            src={store.logo_url}
            alt={`${store.ad} İndirim Kodu`}
            size={STORE_LOGO_SIZE_XL}
            priority
            className="rounded-xl object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {store.ad} İndirim Kodu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {stripHtmlPreview(store.seo_description)}
          </p>

          <div className="mt-4 flex flex-col items-center gap-4 sm:items-start">
            {storeUrl ? (
              <a
                href={storeUrl}
                target="_blank"
                rel={AFFILIATE_LINK_REL}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Mağazaya Git →
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
