import type { Coupon, Store } from "@/lib/types";
import { safeJsonLd } from "@/lib/utils/html";
import { buildStorePageSchema } from "@/lib/utils/schema";

interface StorePageJsonLdProps {
  store: Store;
  slug: string;
  coupons: Coupon[];
}

export default function StorePageJsonLd({ store, slug, coupons }: StorePageJsonLdProps) {
  const schema = buildStorePageSchema(store, slug, coupons);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
