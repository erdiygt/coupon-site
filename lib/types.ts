export type CouponType = "kod" | "kampanya";

export interface SiteSettings {
  site_name: string;
  logo_url: string;
  favicon_url: string;
  homepage_meta_title: string;
  homepage_meta_description: string;
}

export type SiteSettingsInput = SiteSettings;

export interface Category {
  id: number;
  ad: string;
  slug: string;
  aciklama: string;
  seo_title: string;
  seo_description: string;
}

export interface StoreFaq {
  id: string;
  soru: string;
  cevap: string;
}

export interface Store {
  id: number;
  ad: string;
  slug: string;
  logo_url: string;
  link: string;
  seo_title: string;
  seo_description: string;
  seo_icerik: string;
  sss: StoreFaq[];
  kategori_id: number;
  populer_mi: boolean;
  puan: number;
  degerlendirme_sayisi: number;
}

export interface StoreCouponStats {
  toplam_aktif: number;
  kod_sayisi: number;
  kampanya_sayisi: number;
}

export interface StoreSearchResult {
  id: number;
  ad: string;
  slug: string;
  logo_url: string;
}

export interface Coupon {
  id: number;
  store_id: number;
  baslik: string;
  aciklama: string;
  kod: string;
  link: string;
  tur: CouponType;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  aktif_mi: boolean;
  kullanim_sayisi?: number;
}

export type StoreInput = Omit<Store, "id">;
export type CouponInput = Omit<Coupon, "id" | "kullanim_sayisi">;
export type CategoryInput = Omit<Category, "id">;

/** Modal için minimum mağaza alanları (RSC → client payload küçültür). */
export type CouponModalStore = Pick<Store, "id" | "ad" | "slug" | "logo_url" | "link">;

/** Modal için minimum kupon alanları. */
export type CouponModalCoupon = Pick<
  Coupon,
  "id" | "baslik" | "aciklama" | "kod" | "link" | "tur" | "baslangic_tarihi" | "bitis_tarihi"
>;

export interface StoreWithCoupons extends Store {
  aktif_kuponlar: Coupon[];
  suresi_dolmus_kuponlar: Coupon[];
}
