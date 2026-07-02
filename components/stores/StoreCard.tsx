import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_MD } from "@/lib/constants/store-logo";
import Link from "next/link";
import type { Store } from "@/lib/types";
import { stripHtmlPreview } from "@/lib/utils/html";

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-primary-light bg-white p-1 transition-transform group-hover:scale-105">
        <StoreLogo
          src={store.logo_url}
          alt={`${store.ad} logo`}
          size={STORE_LOGO_SIZE_MD}
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="text-center text-base font-semibold text-foreground group-hover:text-primary">
        {store.ad}
      </h3>
      <p className="mt-1 text-center text-xs text-muted line-clamp-2">
        {stripHtmlPreview(store.seo_description).slice(0, 60)}...
      </p>
      {store.populer_mi && (
        <span className="mt-3 rounded-full bg-primary-light px-3 py-0.5 text-xs font-medium text-primary">
          Popüler
        </span>
      )}
    </Link>
  );
}
