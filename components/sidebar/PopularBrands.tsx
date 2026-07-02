import StoreLogo from "@/components/stores/StoreLogo";
import { STORE_LOGO_SIZE_SM } from "@/lib/constants/store-logo";
import Link from "next/link";
import type { Store } from "@/lib/types";

interface PopularBrandsProps {
  stores: Store[];
}

export default function PopularBrands({ stores }: PopularBrandsProps) {
  if (stores.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
        <span className="h-5 w-1 rounded-full bg-primary" />
        Popüler Markalar
      </h3>
      <ul className="space-y-3">
        {stores.map((store) => (
          <li key={store.id}>
            <Link
              href={`/${store.slug}`}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-primary-light/50"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                <StoreLogo
                  src={store.logo_url}
                  alt={store.ad}
                  size={STORE_LOGO_SIZE_SM}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-foreground hover:text-primary">
                {store.ad}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
