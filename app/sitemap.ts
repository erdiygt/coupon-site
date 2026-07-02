import {
  getCachedAllCategories,
  getCachedAllStores,
} from "@/lib/db/cache";
import { getRepository } from "@/lib/db/repository";
import { absoluteUrl } from "@/lib/site/url";
import { isCouponActive } from "@/lib/utils/coupon";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = absoluteUrl("");
  const repo = getRepository();

  const [stores, categories, coupons] = await Promise.all([
    getCachedAllStores(),
    getCachedAllCategories(),
    repo.getAllCoupons(),
  ]);

  const activeStoreIds = new Set(
    coupons.filter((coupon) => isCouponActive(coupon)).map((coupon) => coupon.store_id),
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/markalar`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/kategoriler`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const storePages: MetadataRoute.Sitemap = stores
    .filter((store) => activeStoreIds.has(store.id))
    .map((store) => ({
      url: `${base}/${store.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/kategoriler/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...storePages, ...categoryPages];
}
