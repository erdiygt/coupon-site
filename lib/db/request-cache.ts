import { isSeedFallbackEnabled } from "@/lib/db/data-source";
import { mapCategory, mapCoupon, mapStore, normalizeStore } from "@/lib/db/mappers";
import { getSeedFallback } from "@/lib/db/seed-fallback";
import { getSupabase } from "@/lib/db/supabase";
import type { Category, Coupon, Store } from "@/lib/types";
import { cache } from "react";

/** Aynı istek içinde kupon listesi tek sefer yüklenir. */
export const loadAllCoupons = cache(async (): Promise<Coupon[]> => {
  if (isSeedFallbackEnabled()) return getSeedFallback().getAllCoupons();

  const { data, error } = await getSupabase()
    .from("coupons")
    .select("*")
    .order("kullanim_sayisi", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapCoupon(row));
});

/** Aynı istek içinde mağaza listesi tek sefer yüklenir. */
export const loadAllStores = cache(async (): Promise<Store[]> => {
  if (isSeedFallbackEnabled()) return getSeedFallback().getAllStores();

  const { data, error } = await getSupabase()
    .from("stores")
    .select("*")
    .order("ad", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => normalizeStore(mapStore(row)));
});

/** Slug ile mağaza — metadata + sayfa aynı istekte tek sorgu. */
export const loadStoreBySlug = cache(async (slug: string): Promise<Store | undefined> => {
  if (isSeedFallbackEnabled()) return getSeedFallback().getStoreBySlug(slug);

  const { data, error } = await getSupabase()
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeStore(mapStore(data)) : undefined;
});

/** Slug ile kategori — metadata + sayfa aynı istekte tek sorgu. */
export const loadCategoryBySlug = cache(async (slug: string): Promise<Category | undefined> => {
  if (isSeedFallbackEnabled()) return getSeedFallback().getCategoryBySlug(slug);

  const { data, error } = await getSupabase()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCategory(data) : undefined;
});
