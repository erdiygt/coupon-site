import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_MD } from "@/lib/constants/store-logo";
import Link from "next/link";
import type { Store } from "@/lib/types";

interface HomeStoreCardProps {
  store: Store;
  couponCount: number;
  priority?: boolean;
}

export function HomeStoreCard({ store, couponCount, priority = false }: HomeStoreCardProps) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col items-center rounded-2xl border border-border bg-card px-4 py-5 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
    >
      <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-xl border border-border bg-white p-1.5 transition-transform group-hover:scale-105">
        <StoreLogo
          src={store.logo_url}
          alt={`${store.ad} logo`}
          size={STORE_LOGO_SIZE_MD}
          priority={priority}
          className="rounded-lg object-cover"
        />
      </div>
      <h3 className="text-center text-sm font-semibold text-foreground group-hover:text-primary">
        {store.ad}
      </h3>
      <p className="mt-1.5 text-center text-xs text-muted">
        {couponCount} İndirim Kodu
      </p>
    </Link>
  );
}

export function HomeAllStoresCard() {
  return (
    <Link
      href="/markalar"
      className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary-light/30 px-4 py-5 transition-all hover:border-primary hover:bg-primary-light/50"
    >
      <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
        ⊞
      </span>
      <h3 className="text-center text-sm font-semibold text-primary">Tüm Markalar</h3>
      <p className="mt-1.5 text-center text-xs font-medium text-primary/80 group-hover:underline">
        Marka Listesine Git
      </p>
    </Link>
  );
}

interface HomeStoreSectionProps {
  stores: Store[];
  getCouponCount: (storeId: number) => number;
}

export default function HomeStoreSection({ stores, getCouponCount }: HomeStoreSectionProps) {
  return (
    <section aria-labelledby="home-stores-heading">
      <div className="mb-6 rounded-2xl border border-border bg-card px-4 py-4 text-center shadow-sm sm:px-6">
        <h2 id="home-stores-heading" className="text-base font-semibold text-foreground sm:text-lg">
          İndirim Kodu & Kuponu Veren Popüler Markalar
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
        {stores.map((store, index) => (
          <HomeStoreCard
            key={store.id}
            store={store}
            couponCount={getCouponCount(store.id)}
            priority={index < 4}
          />
        ))}
        <HomeAllStoresCard />
      </div>
    </section>
  );
}
