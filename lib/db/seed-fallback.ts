import { defaultSiteSettings } from "@/lib/data/seed-settings";
import { seedCategories } from "@/lib/data/seed-categories";
import { seedCoupons, seedStores } from "@/lib/data/seed";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
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

const LOCAL_SETTINGS_PATH = path.join(process.cwd(), ".data", "site-settings.json");

function loadPersistedSiteSettings(): SiteSettings | null {
  try {
    if (!existsSync(LOCAL_SETTINGS_PATH)) return null;
    return JSON.parse(readFileSync(LOCAL_SETTINGS_PATH, "utf8")) as SiteSettings;
  } catch {
    return null;
  }
}

function persistSiteSettings(settings: SiteSettings): void {
  mkdirSync(path.dirname(LOCAL_SETTINGS_PATH), { recursive: true });
  writeFileSync(LOCAL_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
}

/** Supabase yapılandırılmadığında seed verisinden okuma (geliştirme / yedek). */
class SeedFallbackRepository {
  private stores = structuredClone(seedStores);
  private coupons = structuredClone(seedCoupons);
  private categories = structuredClone(seedCategories);
  private siteSettings =
    loadPersistedSiteSettings() ?? structuredClone(defaultSiteSettings);

  getAllStores(): Store[] {
    return this.stores.map((s) => this.normalizeStore(s));
  }

  searchStores(query: string, limit = 8): StoreSearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return this.stores
      .filter((s) => matchesStoreSearch(s, trimmed))
      .slice(0, limit)
      .map(({ id, ad, slug, logo_url }) => ({ id, ad, slug, logo_url }));
  }

  getAllCategories(): Category[] {
    return [...this.categories];
  }

  getSiteSettings(): SiteSettings {
    return structuredClone(this.siteSettings);
  }

  updateSiteSettings(input: SiteSettingsInput): SiteSettings {
    this.siteSettings = {
      site_name: input.site_name.trim() || defaultSiteSettings.site_name,
      logo_url: input.logo_url.trim(),
      favicon_url: input.favicon_url.trim(),
      homepage_meta_title:
        input.homepage_meta_title.trim() || defaultSiteSettings.homepage_meta_title,
      homepage_meta_description:
        input.homepage_meta_description.trim() ||
        defaultSiteSettings.homepage_meta_description,
    };
    persistSiteSettings(this.siteSettings);
    return this.getSiteSettings();
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  getStoresByCategoryId(categoryId: number): Store[] {
    return this.stores
      .filter((s) => s.kategori_id === categoryId)
      .map((s) => this.normalizeStore(s));
  }

  getStoreCountByCategoryId(categoryId: number): number {
    return this.stores.filter((s) => s.kategori_id === categoryId).length;
  }

  getPopularStores(limit = 5): Store[] {
    return this.stores.filter((s) => s.populer_mi).slice(0, limit).map((s) => this.normalizeStore(s));
  }

  getStoreBySlug(slug: string): Store | undefined {
    const store = this.stores.find((s) => s.slug === slug);
    return store ? this.normalizeStore(store) : undefined;
  }

  getStoreById(id: number): Store | undefined {
    const store = this.stores.find((s) => s.id === id);
    return store ? this.normalizeStore(store) : undefined;
  }

  getStoreWithCoupons(slug: string): StoreWithCoupons | undefined {
    const store = this.getStoreBySlug(slug);
    if (!store) return undefined;
    const storeCoupons = this.coupons.filter((c) => c.store_id === store.id);
    const { aktif, suresi_dolmus } = partitionCoupons(storeCoupons);
    return { ...store, aktif_kuponlar: aktif, suresi_dolmus_kuponlar: suresi_dolmus };
  }

  getAllCoupons(): Coupon[] {
    return [...this.coupons];
  }

  getCouponById(id: number): Coupon | undefined {
    return this.coupons.find((c) => c.id === id);
  }

  getCouponsByStoreId(storeId: number): Coupon[] {
    return this.coupons.filter((c) => c.store_id === storeId);
  }

  getTopCoupons(limit = 5): Coupon[] {
    return [...this.coupons]
      .filter((c) => isCouponActive(c))
      .sort((a, b) => (b.kullanim_sayisi ?? 0) - (a.kullanim_sayisi ?? 0))
      .slice(0, limit);
  }

  getActiveCouponCountByStoreId(storeId: number): number {
    return this.coupons.filter((c) => c.store_id === storeId && isCouponActive(c)).length;
  }

  getStoreCouponStats(storeId: number): StoreCouponStats {
    const aktif = this.coupons.filter((c) => c.store_id === storeId && isCouponActive(c));
    return {
      toplam_aktif: aktif.length,
      kod_sayisi: aktif.filter((c) => c.tur === "kod").length,
      kampanya_sayisi: aktif.filter((c) => c.tur === "kampanya").length,
    };
  }

  getHomepageStores(limit = 11): Store[] {
    const popular = this.stores.filter((s) => s.populer_mi);
    const others = this.stores.filter((s) => !s.populer_mi);
    return [...popular, ...others].slice(0, limit).map((s) => this.normalizeStore(s));
  }

  createCategory(input: CategoryInput): Category {
    const id = Math.max(...this.categories.map((c) => c.id), 0) + 1;
    const category: Category = { ...input, id, slug: input.slug || slugify(input.ad) };
    this.categories.push(category);
    return category;
  }

  updateCategory(id: number, input: Partial<CategoryInput>): Category | undefined {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.categories[index] = { ...this.categories[index], ...input };
    return this.categories[index];
  }

  deleteCategory(id: number): boolean {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    this.stores = this.stores.map((s) =>
      s.kategori_id === id ? { ...s, kategori_id: 1 } : s,
    );
    return true;
  }

  createStore(input: StoreInput): Store {
    const id = Math.max(...this.stores.map((s) => s.id), 0) + 1;
    const store = this.normalizeStore({
      id,
      ...input,
      puan: clampStoreRating(input.puan ?? 4.5),
      degerlendirme_sayisi: sanitizeReviewCount(input.degerlendirme_sayisi ?? 100),
    });
    this.stores.push(store);
    return store;
  }

  updateStore(id: number, input: Partial<StoreInput>): Store | undefined {
    const index = this.stores.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.stores[index] = this.normalizeStore({
      ...this.stores[index],
      ...input,
      sss: input.sss ?? this.stores[index].sss ?? [],
      seo_icerik: input.seo_icerik ?? this.stores[index].seo_icerik ?? "",
      kategori_id: input.kategori_id ?? this.stores[index].kategori_id ?? 1,
      puan:
        input.puan !== undefined
          ? clampStoreRating(input.puan)
          : this.stores[index].puan,
      degerlendirme_sayisi:
        input.degerlendirme_sayisi !== undefined
          ? sanitizeReviewCount(input.degerlendirme_sayisi)
          : this.stores[index].degerlendirme_sayisi,
    });
    return this.stores[index];
  }

  deleteStore(id: number): boolean {
    const index = this.stores.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.stores.splice(index, 1);
    this.coupons = this.coupons.filter((c) => c.store_id !== id);
    return true;
  }

  createCoupon(input: CouponInput): Coupon {
    const id = Math.max(...this.coupons.map((c) => c.id), 0) + 1;
    const coupon: Coupon = { id, kullanim_sayisi: 0, ...input };
    this.coupons.push(coupon);
    return coupon;
  }

  updateCoupon(id: number, input: Partial<CouponInput>): Coupon | undefined {
    const index = this.coupons.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.coupons[index] = { ...this.coupons[index], ...input };
    return this.coupons[index];
  }

  deleteCoupon(id: number): boolean {
    const index = this.coupons.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.coupons.splice(index, 1);
    return true;
  }

  private normalizeStore(store: Store): Store {
    return {
      ...store,
      link: store.link ?? "",
      seo_icerik: store.seo_icerik ?? "",
      sss: store.sss ?? [],
      kategori_id: store.kategori_id ?? 1,
      puan: store.puan ?? 4.5,
      degerlendirme_sayisi: store.degerlendirme_sayisi ?? 100,
    };
  }
}

let fallback: SeedFallbackRepository | null = null;

export function getSeedFallback(): SeedFallbackRepository {
  if (!fallback) fallback = new SeedFallbackRepository();
  return fallback;
}
