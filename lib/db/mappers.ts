import type { Category, Coupon, SiteSettings, Store, StoreFaq } from "@/lib/types";

function parseSss(value: unknown): StoreFaq[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is StoreFaq =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "soru" in item &&
      "cevap" in item,
  );
}

export function normalizeStore(store: Store): Store {
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

export function mapStore(row: Record<string, unknown>): Store {
  return {
    id: row.id as number,
    ad: row.ad as string,
    slug: row.slug as string,
    logo_url: (row.logo_url as string) ?? "",
    link: (row.link as string) ?? "",
    seo_title: row.seo_title as string,
    seo_description: (row.seo_description as string) ?? "",
    seo_icerik: (row.seo_icerik as string) ?? "",
    sss: parseSss(row.sss),
    kategori_id: (row.kategori_id as number) ?? 1,
    populer_mi: Boolean(row.populer_mi),
    puan: Number(row.puan ?? 4.5),
    degerlendirme_sayisi: Number(row.degerlendirme_sayisi ?? 100),
  };
}

const STORE_LISTING_DEFAULTS = {
  link: "",
  seo_title: "",
  seo_icerik: "",
  sss: [] as StoreFaq[],
  puan: 4.5,
  degerlendirme_sayisi: 100,
};

/** Grid / liste sayfaları için dar sütun haritalama. */
export function mapStoreListing(row: Record<string, unknown>): Store {
  return normalizeStore({
    ...STORE_LISTING_DEFAULTS,
    id: row.id as number,
    ad: row.ad as string,
    slug: row.slug as string,
    logo_url: (row.logo_url as string) ?? "",
    seo_description: (row.seo_description as string) ?? "",
    populer_mi: Boolean(row.populer_mi),
    kategori_id: (row.kategori_id as number) ?? 1,
    link: (row.link as string) ?? "",
  });
}

export function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as number,
    ad: row.ad as string,
    slug: row.slug as string,
    aciklama: (row.aciklama as string) ?? "",
    seo_title: row.seo_title as string,
    seo_description: (row.seo_description as string) ?? "",
  };
}

export function mapCoupon(row: Record<string, unknown>): Coupon {
  return {
    id: row.id as number,
    store_id: row.store_id as number,
    baslik: row.baslik as string,
    aciklama: (row.aciklama as string) ?? "",
    kod: (row.kod as string) ?? "",
    link: (row.link as string) ?? "",
    tur: row.tur as Coupon["tur"],
    baslangic_tarihi: row.baslangic_tarihi as string,
    bitis_tarihi: row.bitis_tarihi as string,
    aktif_mi: Boolean(row.aktif_mi),
    kullanim_sayisi: Number(row.kullanim_sayisi ?? 0),
  };
}

export function mapSiteSettings(row: Record<string, unknown>): SiteSettings {
  return {
    site_name: row.site_name as string,
    logo_url: (row.logo_url as string) ?? "",
    favicon_url: (row.favicon_url as string) ?? "",
    homepage_meta_title: row.homepage_meta_title as string,
    homepage_meta_description: (row.homepage_meta_description as string) ?? "",
  };
}
