import { defaultSiteSettings } from "@/lib/data/seed-settings";
import {
  buildActiveCouponCountMap,
  buildCategoryStoreCountMap,
  computeStoreCouponStats,
} from "@/lib/db/batch-helpers";
import {
  sanitizeCategoryInput,
  sanitizeCouponInput,
  sanitizePartialCategoryInput,
  sanitizePartialCouponInput,
  sanitizePartialStoreInput,
  sanitizeStoreInput,
} from "@/lib/db/sanitize-input";
import { isSeedFallbackEnabled } from "@/lib/db/data-source";
import { getSeedFallback } from "@/lib/db/seed-fallback";
import { mapCategory, mapCoupon, mapSiteSettings, mapStore, mapStoreListing, normalizeStore } from "@/lib/db/mappers";
import { loadAllCoupons, loadAllStores, loadCategoryBySlug, loadStoreBySlug } from "@/lib/db/request-cache";
import { getSupabase } from "@/lib/db/supabase";
import type {
  Category,
  CategoryInput,
  Coupon,
  CouponInput,
  SiteSettings,
  SiteSettingsInput,
  Store,
  StoreCouponStats,
  StoreInput,
  StoreSearchResult,
  StoreWithCoupons,
} from "@/lib/types";
import { isCouponActive, partitionCoupons, slugify } from "@/lib/utils/coupon";
import { matchesStoreSearch } from "@/lib/utils/search";
import { clampStoreRating, sanitizeReviewCount } from "@/lib/utils/store";

const STORE_LISTING_COLUMNS =
  "id, ad, slug, logo_url, seo_description, populer_mi, kategori_id, link";

function normalizeStoreInput(input: StoreInput): StoreInput {
  const sanitized = sanitizeStoreInput(input);
  return {
    ...sanitized,
    link: sanitized.link ?? "",
    seo_icerik: sanitized.seo_icerik ?? "",
    sss: sanitized.sss ?? [],
    kategori_id: sanitized.kategori_id ?? 1,
    puan: clampStoreRating(sanitized.puan ?? 4.5),
    degerlendirme_sayisi: sanitizeReviewCount(sanitized.degerlendirme_sayisi ?? 100),
  };
}

class SupabaseRepository {
  private fb() {
    return getSeedFallback();
  }

  async getAllStores(): Promise<Store[]> {
    if (isSeedFallbackEnabled()) return this.fb().getAllStores();
    return loadAllStores();
  }

  async searchStores(query: string, limit = 8): Promise<StoreSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    if (isSeedFallbackEnabled()) {
      const stores = await this.getAllStores();
      return stores
        .filter((store) => matchesStoreSearch(store, trimmed))
        .slice(0, limit)
        .map(({ id, ad, slug, logo_url }) => ({ id, ad, slug, logo_url }));
    }

    const { data, error } = await getSupabase()
      .from("stores")
      .select("id, ad, slug, logo_url")
      .ilike("ad", `%${trimmed}%`)
      .order("ad", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }

  async getAllCategories(): Promise<Category[]> {
    if (isSeedFallbackEnabled()) return this.fb().getAllCategories();
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .order("ad", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => mapCategory(row));
  }

  async getSiteSettings(): Promise<SiteSettings> {
    if (isSeedFallbackEnabled()) return this.fb().getSiteSettings();
    const { data, error } = await getSupabase()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { ...defaultSiteSettings };
    return mapSiteSettings(data);
  }

  async updateSiteSettings(input: SiteSettingsInput): Promise<SiteSettings> {
    if (isSeedFallbackEnabled()) return this.fb().updateSiteSettings(input);
    const payload = {
      id: 1,
      site_name: input.site_name.trim() || defaultSiteSettings.site_name,
      logo_url: input.logo_url.trim(),
      favicon_url: input.favicon_url.trim(),
      homepage_meta_title:
        input.homepage_meta_title.trim() || defaultSiteSettings.homepage_meta_title,
      homepage_meta_description:
        input.homepage_meta_description.trim() ||
        defaultSiteSettings.homepage_meta_description,
    };

    const { data, error } = await getSupabase()
      .from("site_settings")
      .upsert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return mapSiteSettings(data);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return loadCategoryBySlug(slug);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().getCategoryById(id);
    const { data, error } = await getSupabase()
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapCategory(data) : undefined;
  }

  async getStoresForGrid(): Promise<Store[]> {
    if (isSeedFallbackEnabled()) return this.fb().getAllStores();

    const { data, error } = await getSupabase()
      .from("stores")
      .select(STORE_LISTING_COLUMNS)
      .order("ad", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => mapStoreListing(row));
  }

  async getStoresByCategoryId(categoryId: number): Promise<Store[]> {
    if (isSeedFallbackEnabled()) return this.fb().getStoresByCategoryId(categoryId);
    const { data, error } = await getSupabase()
      .from("stores")
      .select(STORE_LISTING_COLUMNS)
      .eq("kategori_id", categoryId)
      .order("ad", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => mapStoreListing(row));
  }

  async getStoreCountByCategoryId(categoryId: number): Promise<number> {
    if (isSeedFallbackEnabled()) return this.fb().getStoreCountByCategoryId(categoryId);
    const { count, error } = await getSupabase()
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("kategori_id", categoryId);

    if (error) throw error;
    return count ?? 0;
  }

  async createCategory(input: CategoryInput): Promise<Category> {
    if (isSeedFallbackEnabled()) return this.fb().createCategory(input);
    const payload = {
      ...sanitizeCategoryInput(input),
      slug: input.slug || slugify(input.ad),
    };

    const { data, error } = await getSupabase()
      .from("categories")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return mapCategory(data);
  }

  async updateCategory(id: number, input: Partial<CategoryInput>): Promise<Category | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().updateCategory(id, input);
    const { data, error } = await getSupabase()
      .from("categories")
      .update(sanitizePartialCategoryInput(input))
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? mapCategory(data) : undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    if (isSeedFallbackEnabled()) return this.fb().deleteCategory(id);
    await getSupabase().from("stores").update({ kategori_id: 1 }).eq("kategori_id", id);

    const { error, count } = await getSupabase()
      .from("categories")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }

  async getActiveStores(): Promise<Store[]> {
    const stores = await this.getAllStores();
    const coupons = await this.getAllCoupons();
    const activeStoreIds = new Set(
      coupons.filter((c) => isCouponActive(c)).map((c) => c.store_id),
    );
    return stores.filter((store) => activeStoreIds.has(store.id));
  }

  async getPopularStores(limit = 5): Promise<Store[]> {
    if (isSeedFallbackEnabled()) return this.fb().getPopularStores(limit);
    const { data, error } = await getSupabase()
      .from("stores")
      .select("*")
      .eq("populer_mi", true)
      .order("ad", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => normalizeStore(mapStore(row)));
  }

  async getStoreBySlug(slug: string): Promise<Store | undefined> {
    return loadStoreBySlug(slug);
  }

  async getStoreById(id: number): Promise<Store | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().getStoreById(id);
    const { data, error } = await getSupabase()
      .from("stores")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeStore(mapStore(data)) : undefined;
  }

  async getStoreWithCoupons(slug: string): Promise<StoreWithCoupons | undefined> {
    const store = await this.getStoreBySlug(slug);
    if (!store) return undefined;

    const storeCoupons = await this.getCouponsByStoreId(store.id);
    const { aktif, suresi_dolmus } = partitionCoupons(storeCoupons);

    return {
      ...store,
      aktif_kuponlar: aktif,
      suresi_dolmus_kuponlar: suresi_dolmus,
    };
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return loadAllCoupons();
  }

  async getCouponById(id: number): Promise<Coupon | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().getCouponById(id);
    const { data, error } = await getSupabase()
      .from("coupons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapCoupon(data) : undefined;
  }

  async getCouponWithStore(
    id: number,
  ): Promise<{ coupon: Coupon; store: Store } | undefined> {
    const coupon = await this.getCouponById(id);
    if (!coupon) return undefined;

    const store = await this.getStoreById(coupon.store_id);
    if (!store) return undefined;

    return { coupon, store };
  }

  async getCouponsByStoreId(storeId: number): Promise<Coupon[]> {
    if (isSeedFallbackEnabled()) return this.fb().getCouponsByStoreId(storeId);
    const { data, error } = await getSupabase()
      .from("coupons")
      .select("*")
      .eq("store_id", storeId)
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => mapCoupon(row));
  }

  async getTopCoupons(limit = 5): Promise<Coupon[]> {
    if (isSeedFallbackEnabled()) {
      return this.fb()
        .getAllCoupons()
        .filter((c) => isCouponActive(c))
        .slice(0, limit);
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await getSupabase()
      .from("coupons")
      .select("*")
      .eq("aktif_mi", true)
      .lte("baslangic_tarihi", today)
      .gte("bitis_tarihi", today)
      .order("kullanim_sayisi", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => mapCoupon(row));
  }

  async getActiveCouponCountByStoreId(storeId: number): Promise<number> {
    const counts = await this.getActiveCouponCountsByStoreIds([storeId]);
    return counts.get(storeId) ?? 0;
  }

  async getActiveCouponCountsByStoreIds(storeIds: number[]): Promise<Map<number, number>> {
    if (storeIds.length === 0) return new Map();

    if (isSeedFallbackEnabled()) {
      return buildActiveCouponCountMap(this.fb().getAllCoupons(), storeIds);
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await getSupabase()
      .from("coupons")
      .select("store_id")
      .in("store_id", storeIds)
      .eq("aktif_mi", true)
      .lte("baslangic_tarihi", today)
      .gte("bitis_tarihi", today);

    if (error) throw error;

    const map = new Map<number, number>();
    for (const row of data ?? []) {
      const storeId = row.store_id as number;
      map.set(storeId, (map.get(storeId) ?? 0) + 1);
    }
    return map;
  }

  async getStoresByIds(ids: number[]): Promise<Store[]> {
    if (ids.length === 0) return [];
    if (isSeedFallbackEnabled()) {
      return ids
        .map((id) => this.fb().getStoreById(id))
        .filter((store): store is Store => store !== undefined);
    }

    const { data, error } = await getSupabase().from("stores").select("*").in("id", ids);
    if (error) throw error;
    return (data ?? []).map((row) => normalizeStore(mapStore(row)));
  }

  async getStoreCountMapByCategory(): Promise<Map<number, number>> {
    if (isSeedFallbackEnabled()) {
      return buildCategoryStoreCountMap(this.fb().getAllStores());
    }

    const { data, error } = await getSupabase().rpc("store_count_by_category");
    if (error) throw error;

    const map = new Map<number, number>();
    for (const row of data ?? []) {
      map.set(row.kategori_id as number, Number(row.store_count));
    }
    return map;
  }

  async getStoreCouponStats(storeId: number): Promise<StoreCouponStats> {
    const coupons = await this.getCouponsByStoreId(storeId);
    return computeStoreCouponStats(coupons);
  }

  async getHomepageStores(limit = 11): Promise<Store[]> {
    if (isSeedFallbackEnabled()) return this.fb().getHomepageStores(limit);
    const { data, error } = await getSupabase()
      .from("stores")
      .select("*")
      .order("populer_mi", { ascending: false })
      .order("ad", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map((row) => normalizeStore(mapStore(row)));
  }

  async createStore(input: StoreInput): Promise<Store> {
    if (isSeedFallbackEnabled()) return this.fb().createStore(input);
    const payload = normalizeStoreInput(input);

    const { data, error } = await getSupabase()
      .from("stores")
      .insert({
        ...payload,
        sss: payload.sss ?? [],
      })
      .select("*")
      .single();

    if (error) throw error;
    return normalizeStore(mapStore(data));
  }

  async updateStore(id: number, input: Partial<StoreInput>): Promise<Store | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().updateStore(id, input);
    const existing = await this.getStoreById(id);
    if (!existing) return undefined;

    const merged = normalizeStore({
      ...existing,
      ...sanitizePartialStoreInput(input),
      sss: input.sss ?? existing.sss ?? [],
      seo_icerik: input.seo_icerik ?? existing.seo_icerik ?? "",
      kategori_id: input.kategori_id ?? existing.kategori_id ?? 1,
      puan: input.puan !== undefined ? clampStoreRating(input.puan) : existing.puan,
      degerlendirme_sayisi:
        input.degerlendirme_sayisi !== undefined
          ? sanitizeReviewCount(input.degerlendirme_sayisi)
          : existing.degerlendirme_sayisi,
    });

    const { data, error } = await getSupabase()
      .from("stores")
      .update({
        ad: merged.ad,
        slug: merged.slug,
        logo_url: merged.logo_url,
        link: merged.link,
        seo_title: merged.seo_title,
        seo_description: merged.seo_description,
        seo_icerik: merged.seo_icerik,
        sss: merged.sss,
        kategori_id: merged.kategori_id,
        populer_mi: merged.populer_mi,
        puan: merged.puan,
        degerlendirme_sayisi: merged.degerlendirme_sayisi,
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeStore(mapStore(data)) : undefined;
  }

  async deleteStore(id: number): Promise<boolean> {
    if (isSeedFallbackEnabled()) return this.fb().deleteStore(id);
    const { error, count } = await getSupabase()
      .from("stores")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }

  async createCoupon(input: CouponInput): Promise<Coupon> {
    if (isSeedFallbackEnabled()) return this.fb().createCoupon(input);
    const payload = sanitizeCouponInput(input);
    const { data, error } = await getSupabase()
      .from("coupons")
      .insert({ ...payload, kullanim_sayisi: 0 })
      .select("*")
      .single();

    if (error) throw error;
    return mapCoupon(data);
  }

  async updateCoupon(id: number, input: Partial<CouponInput>): Promise<Coupon | undefined> {
    if (isSeedFallbackEnabled()) return this.fb().updateCoupon(id, input);
    const { data, error } = await getSupabase()
      .from("coupons")
      .update(sanitizePartialCouponInput(input))
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return data ? mapCoupon(data) : undefined;
  }

  async deleteCoupon(id: number): Promise<boolean> {
    if (isSeedFallbackEnabled()) return this.fb().deleteCoupon(id);
    const { error, count } = await getSupabase()
      .from("coupons")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    return (count ?? 0) > 0;
  }
}

let repository: SupabaseRepository | null = null;

export function getRepository(): SupabaseRepository {
  if (!repository) {
    repository = new SupabaseRepository();
  }
  return repository;
}

export type DataRepository = SupabaseRepository;
