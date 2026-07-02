import { computeStoreCouponStats } from "@/lib/db/batch-helpers";
import { getRepository } from "@/lib/db/repository";
import type { Category, Coupon, SiteSettings, Store } from "@/lib/types";
import { cache } from "react";
import { unstable_cache } from "next/cache";

/** unstable_cache Map'i JSON ile düz nesneye çevirir; tüketimden önce yeniden kurulmalı. */
function rehydrateStoreMap(
  value: Map<number, Store> | Record<string, Store>,
): Map<number, Store> {
  if (value instanceof Map) return value;
  return new Map(
    Object.entries(value).map(([id, store]) => [Number(id), store]),
  );
}

function rehydrateCountMap(
  value: Map<number, number> | Record<string, number>,
): Map<number, number> {
  if (value instanceof Map) return value;
  return new Map(
    Object.entries(value).map(([id, count]) => [Number(id), Number(count)]),
  );
}

/**
 * Site ayarları — tag ile invalidate edilir (admin kaydından sonra).
 * React cache aynı request içinde dedup sağlar.
 */
const getSiteSettingsFromCache = unstable_cache(
  async (): Promise<SiteSettings> => getRepository().getSiteSettings(),
  ["site-settings"],
  { tags: ["site-settings"] },
);

export const getCachedSiteSettings = cache(getSiteSettingsFromCache);

const getCachedAllStores = unstable_cache(
  async (): Promise<Store[]> => getRepository().getAllStores(),
  ["all-stores"],
  { revalidate: 300, tags: ["stores"] },
);

export const getCachedStoresForGrid = unstable_cache(
  async (): Promise<Store[]> => getRepository().getStoresForGrid(),
  ["stores-grid"],
  { revalidate: 300, tags: ["stores"] },
);

export const getCachedAllCategories = unstable_cache(
  async (): Promise<Category[]> => getRepository().getAllCategories(),
  ["all-categories"],
  { revalidate: 300, tags: ["categories"] },
);

const getCachedAllCoupons = unstable_cache(
  async (): Promise<Coupon[]> => getRepository().getAllCoupons(),
  ["all-coupons"],
  { revalidate: 300, tags: ["coupons"] },
);

export const getCachedHomepageData = unstable_cache(
  async () => {
    const repo = getRepository();
    const homepageStores = await repo.getHomepageStores(11);
    const storeIds = homepageStores.map((s) => s.id);

    const [couponCounts, topCoupons] = await Promise.all([
      repo.getActiveCouponCountsByStoreIds(storeIds),
      repo.getTopCoupons(6),
    ]);

    const topStoreIds = [...new Set(topCoupons.map((c) => c.store_id))];
    const storesById = Object.fromEntries(
      (await repo.getStoresByIds(topStoreIds)).map((s) => [s.id, s] as const),
    );

    return {
      homepageStores,
      couponCounts: Object.fromEntries(couponCounts),
      topCoupons,
      storesById,
    };
  },
  ["homepage-data"],
  { revalidate: 120, tags: ["stores", "coupons"] },
);

export const getCachedSidebarData = unstable_cache(
  async () => {
    const repo = getRepository();
    const [popularStores, topCoupons] = await Promise.all([
      repo.getPopularStores(6),
      repo.getTopCoupons(5),
    ]);

    const storeIds = [...new Set(topCoupons.map((c) => c.store_id))];
    const storesById = Object.fromEntries(
      (await repo.getStoresByIds(storeIds)).map((s) => [s.id, s] as const),
    );

    return { popularStores, topCoupons, storesById };
  },
  ["sidebar-data"],
  { revalidate: 300, tags: ["stores", "coupons"] },
);

export async function getHomepageData() {
  const data = await getCachedHomepageData();
  return {
    ...data,
    couponCounts: rehydrateCountMap(data.couponCounts),
    storesById: rehydrateStoreMap(data.storesById),
  };
}

export async function getSidebarData() {
  const data = await getCachedSidebarData();
  return {
    ...data,
    storesById: rehydrateStoreMap(data.storesById),
  };
}

const getCachedCategoryGridData = unstable_cache(
  async () => {
    const repo = getRepository();
    const [items, countMap] = await Promise.all([
      repo.getAllCategories(),
      repo.getStoreCountMapByCategory(),
    ]);

    return items.map((category) => ({
      category,
      storeCount: countMap.get(category.id) ?? 0,
    }));
  },
  ["category-grid-data"],
  { revalidate: 300, tags: ["stores", "categories"] },
);

export async function getCategoryGridData(categories?: Category[]) {
  if (categories) {
    const repo = getRepository();
    const countMap = await repo.getStoreCountMapByCategory();
    return categories.map((category) => ({
      category,
      storeCount: countMap.get(category.id) ?? 0,
    }));
  }

  return getCachedCategoryGridData();
}

export { computeStoreCouponStats, getCachedAllCoupons, getCachedAllStores };
