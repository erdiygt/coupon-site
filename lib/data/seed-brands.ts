import type { Coupon, Store } from "@/lib/types";
import { storeLogoUrl } from "@/lib/data/store-logos";
import { defaultSeoIcerik, defaultSss } from "@/lib/data/store-content";

export interface BrandSeedConfig {
  ad: string;
  slug: string;
  domain: string;
  kategori_id: number;
  populer_mi?: boolean;
  logoBg?: string;
  logoName?: string;
  puan?: number;
  degerlendirme_sayisi?: number;
  seo_title?: string;
  seo_description?: string;
  coupons: BrandCouponSeed[];
}

function seoForBrand(ad: string, kategori_id: number): { seo_title: string; seo_description: string } {
  const contexts: Record<number, string> = {
    1: "giyim, ayakkabı ve moda alışverişlerinizde",
    2: "online alışveriş, seyahat ve hizmetlerde",
    3: "elektronik ve ev aletleri alışverişlerinizde",
    4: "sağlık ve kişisel bakım hizmetlerinde",
  };
  const ctx = contexts[kategori_id] ?? "online alışverişlerinizde";
  return {
    seo_title: `${ad} İndirim Kodu 2026 — Güncel Kupon & Kampanya`,
    seo_description: `${ad} ${ctx} geçerli en güncel indirim kodları, kupon fırsatları ve kampanyalar. ${ad} kupon kodunu kopyalayarak hemen tasarruf edin.`,
  };
}

export interface BrandCouponSeed {
  baslik: string;
  aciklama: string;
  kod: string;
  tur: "kod" | "kampanya";
  linkPath?: string;
  aktif_mi?: boolean;
  bitis_tarihi?: string;
}

function slugifyBrand(ad: string): string {
  return ad
    .toLowerCase()
    .replace(/&/g, "ve")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildStoreFromBrand(id: number, brand: BrandSeedConfig): Store {
  const storeSlug = `${brand.slug}-indirim-kodu`;
  const seo = seoForBrand(brand.ad, brand.kategori_id);

  return {
    id,
    ad: brand.ad,
    slug: storeSlug,
    logo_url: storeLogoUrl(storeSlug, brand.logoName ?? brand.ad, brand.logoBg ?? "22c55e"),
    link: `https://${brand.domain}`,
    seo_title: brand.seo_title ?? seo.seo_title,
    seo_description: brand.seo_description ?? seo.seo_description,
    seo_icerik: defaultSeoIcerik(brand.ad),
    sss: defaultSss(brand.ad),
    kategori_id: brand.kategori_id,
    populer_mi: brand.populer_mi ?? false,
    puan: brand.puan ?? 4.5,
    degerlendirme_sayisi: brand.degerlendirme_sayisi ?? 800,
  };
}

export function buildCouponsForBrand(
  storeId: number,
  startId: number,
  brand: BrandSeedConfig,
): Coupon[] {
  return brand.coupons.map((coupon, index) => ({
    id: startId + index,
    store_id: storeId,
    baslik: coupon.baslik,
    aciklama: coupon.aciklama,
    kod: coupon.kod,
    link: coupon.linkPath
      ? `https://${brand.domain}${coupon.linkPath}`
      : `https://${brand.domain}`,
    tur: coupon.tur,
    baslangic_tarihi: "2026-01-01",
    bitis_tarihi: coupon.bitis_tarihi ?? "2026-12-31",
    aktif_mi: coupon.aktif_mi ?? true,
    kullanim_sayisi: 200 + ((storeId * 47 + index * 13) % 1500),
  }));
}

function c(
  baslik: string,
  aciklama: string,
  kod: string,
  tur: "kod" | "kampanya" = "kod",
  extras?: Partial<BrandCouponSeed>,
): BrandCouponSeed {
  return { baslik, aciklama, kod, tur, ...extras };
}

function tenCoupons(
  prefix: string,
  brand: string,
  extras?: { kampanyaBaslik?: string },
): BrandCouponSeed[] {
  return [
    c(
      `${brand} 100 TL İndirim Kodu`,
      `${brand} online mağazasında 500 TL ve üzeri alışverişlerde geçerli 100 TL indirim.`,
      `${prefix}100`,
    ),
    c(
      `${brand} %20 İndirim Kuponu`,
      `Seçili ürünlerde geçerli %20 indirim kodu. Sepet adımında kuponu uygulayın.`,
      `${prefix}20`,
    ),
    c(
      `${brand} Yeni Üye İndirimi`,
      `${brand}'e ilk kez üye olanlara özel hoş geldin indirim kodu.`,
      `${prefix}HOSG`,
    ),
    c(
      `${brand} Ücretsiz Kargo`,
      `Belirli tutar üzeri alışverişlerde ücretsiz kargo avantajı.`,
      `${prefix}KARGO`,
      "kampanya",
    ),
    c(
      extras?.kampanyaBaslik ?? `${brand} Sezon Kampanyası`,
      `${brand} güncel kampanya fırsatlarından yararlanın. Stoklar tükenene kadar geçerlidir.`,
      `${prefix}KAMP`,
      "kampanya",
      { linkPath: "/kampanya" },
    ),
    c(
      `${brand} 250 TL İndirim Kodu`,
      `${brand} mağazasında 1500 TL ve üzeri alışverişlerde geçerli 250 TL indirim.`,
      `${prefix}250`,
    ),
    c(
      `${brand} %30 Outlet İndirimi`,
      `${brand} outlet ve sezon sonu ürünlerinde ek %30 indirim kodu.`,
      `${prefix}30`,
    ),
    c(
      `${brand} İlk Sipariş İndirimi`,
      `${brand}'den ilk online alışverişinize özel ek indirim kodu.`,
      `${prefix}ILK`,
    ),
    c(
      `${brand} Hafta Sonu Kampanyası`,
      `Hafta sonuna özel ${brand} indirim ve kampanya fırsatları.`,
      `${prefix}HSF`,
      "kampanya",
    ),
    c(
      `${brand} Sezon Sonu Fırsatları`,
      `${brand} sezon sonu koleksiyonunda ek indirim kampanyası.`,
      `${prefix}SS`,
      "kampanya",
      { linkPath: "/outlet" },
    ),
  ];
}

function extraFiveCoupons(prefix: string, brand: string): BrandCouponSeed[] {
  return tenCoupons(prefix, brand).slice(5);
}

export const brandSeedConfigs: BrandSeedConfig[] = [
  {
    ad: "JeansLab",
    slug: "jeanslab",
    domain: "www.jeanslab.com.tr",
    kategori_id: 1,
    logoBg: "1d4ed8",
    coupons: tenCoupons("JL", "JeansLab"),
  },
  {
    ad: "Hatemoğlu",
    slug: "hatemoglu",
    domain: "www.hatemoglu.com",
    kategori_id: 1,
    logoBg: "1e293b",
    coupons: tenCoupons("HTM", "Hatemoğlu"),
  },
  {
    ad: "Madame Coco",
    slug: "madame-coco",
    domain: "www.madamecoco.com",
    kategori_id: 1,
    logoBg: "be185d",
    coupons: tenCoupons("MC", "Madame Coco"),
  },
  {
    ad: "Dünyagöz",
    slug: "dunyagoz",
    domain: "www.dunyagoz.com",
    kategori_id: 4,
    logoBg: "0284c7",
    coupons: tenCoupons("DG", "Dünyagöz", { kampanyaBaslik: "Dünyagöz Göz Muayenesi Kampanyası" }),
  },
  {
    ad: "ebebek",
    slug: "ebebek",
    domain: "www.e-bebek.com",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "f59e0b",
    puan: 4.7,
    degerlendirme_sayisi: 2100,
    coupons: [
      c("ebebek 150 TL İndirim", "750 TL ve üzeri bebek ürünlerinde 150 TL indirim.", "EBEBEK150"),
      c("ebebek %25 Bebek Giyim", "Bebek giyim kategorisinde %25 indirim kodu.", "BEBEK25"),
      c("ebebek Yeni Anne Seti", "Yeni anne ürün setlerinde özel indirim kampanyası.", "ANNESET", "kampanya"),
      c("ebebek Ücretsiz Kargo", "400 TL üzeri siparişlerde ücretsiz kargo.", "EBKARGO", "kampanya"),
      c("ebebek Oyuncak Fırsatları", "Seçili oyuncaklarda ek indirim kampanyası.", "OYUNCAK", "kampanya", { linkPath: "/kampanyalar" }),
      ...extraFiveCoupons("EB", "ebebek"),
    ],
  },
  {
    ad: "Slazenger",
    slug: "slazenger",
    domain: "www.slazenger.com.tr",
    kategori_id: 1,
    logoBg: "166534",
    coupons: tenCoupons("SLZ", "Slazenger"),
  },
  {
    ad: "Fitmoda",
    slug: "fitmoda",
    domain: "www.fitmoda.com",
    kategori_id: 1,
    logoBg: "dc2626",
    coupons: tenCoupons("FIT", "Fitmoda"),
  },
  {
    ad: "Havhav",
    slug: "havhav",
    domain: "www.havhav.com.tr",
    kategori_id: 2,
    logoBg: "ea580c",
    coupons: tenCoupons("HAV", "Havhav", { kampanyaBaslik: "Havhav Pet Shop Kampanyası" }),
  },
  {
    ad: "Sporthink",
    slug: "sporthink",
    domain: "www.sporthink.com.tr",
    kategori_id: 1,
    logoBg: "0f766e",
    coupons: tenCoupons("STH", "Sporthink"),
  },
  {
    ad: "Hotiç",
    slug: "hotic",
    domain: "www.hotic.com.tr",
    kategori_id: 1,
    logoBg: "78350f",
    coupons: tenCoupons("HOT", "Hotiç"),
  },
  {
    ad: "Sport Plus",
    slug: "sport-plus",
    domain: "www.sportplus.com.tr",
    kategori_id: 1,
    logoBg: "2563eb",
    logoName: "S+",
    coupons: tenCoupons("SPP", "Sport Plus"),
  },
  {
    ad: "Toyzz Shop",
    slug: "toyzz-shop",
    domain: "www.toyzzshop.com",
    kategori_id: 1,
    logoBg: "e11d48",
    coupons: tenCoupons("TOY", "Toyzz Shop"),
  },
  {
    ad: "Puma",
    slug: "puma",
    domain: "tr.puma.com",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "171717",
    puan: 4.8,
    degerlendirme_sayisi: 1890,
    coupons: [
      c("Puma %30 Outlet İndirimi", "Puma outlet ürünlerinde ek %30 indirim kodu.", "PUMA30"),
      c("Puma 200 TL İndirim", "1000 TL ve üzeri Puma alışverişlerinde 200 TL indirim.", "PUMA200"),
      c("Puma Spor Ayakkabı Kampanyası", "Seçili spor ayakkabılarda indirim kampanyası.", "PUMAAYK", "kampanya"),
      c("Puma Ücretsiz Kargo", "600 TL üzeri siparişlerde ücretsiz kargo.", "PUMAKRG", "kampanya"),
      c("Puma Yeni Sezon", "Yeni sezon ürünlerinde özel fırsatlar.", "YENISEZON", "kampanya"),
      ...extraFiveCoupons("PUMA", "Puma"),
    ],
  },
  {
    ad: "Gap",
    slug: "gap",
    domain: "www.gap.com.tr",
    kategori_id: 1,
    logoBg: "1e3a8a",
    coupons: tenCoupons("GAP", "Gap"),
  },
  {
    ad: "Enza Home",
    slug: "enza-home",
    domain: "www.enzahome.com",
    kategori_id: 1,
    logoBg: "0891b2",
    coupons: tenCoupons("ENZ", "Enza Home"),
  },
  {
    ad: "Linens",
    slug: "linens",
    domain: "www.linens.com.tr",
    kategori_id: 1,
    logoBg: "64748b",
    coupons: tenCoupons("LIN", "Linens"),
  },
  {
    ad: "Koton",
    slug: "koton",
    domain: "www.koton.com",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "000000",
    puan: 4.6,
    degerlendirme_sayisi: 1650,
    coupons: [
      c("Koton 75 TL İndirim Kodu", "400 TL ve üzeri Koton alışverişlerinde 75 TL indirim.", "KOTON75"),
      c("Koton %15 İndirim Kuponu", "Koton.com sepet adımında geçerli net %15 indirim kodu.", "KTN15"),
      c("Koton 3 Al 2 Öde", "Seçili ürünlerde 3 al 2 öde kampanyası.", "KOT3AL2", "kampanya"),
      c("Koton Outlet %90", "Outlet ürünlerinde ek indirim fırsatları.", "OUTLET90", "kampanya"),
      c("Koton Ücretsiz Kargo", "350 TL üzeri siparişlerde ücretsiz kargo.", "KOTKARGO", "kampanya"),
      ...extraFiveCoupons("KOT", "Koton"),
    ],
  },
  {
    ad: "Saat & Saat",
    slug: "saat-saat",
    domain: "www.saatvesaat.com.tr",
    kategori_id: 1,
    logoBg: "334155",
    coupons: tenCoupons("SS", "Saat & Saat"),
  },
  {
    ad: "Colin's",
    slug: "colins",
    domain: "www.colins.com.tr",
    kategori_id: 1,
    logoBg: "b91c1c",
    coupons: tenCoupons("COL", "Colin's"),
  },
  {
    ad: "D&R",
    slug: "dr",
    domain: "www.dr.com.tr",
    kategori_id: 2,
    logoBg: "22c55e",
    logoName: "DR",
    coupons: tenCoupons("DR", "D&R", { kampanyaBaslik: "D&R Kitap ve Müzik Kampanyası" }),
  },
  {
    ad: "Columbia",
    slug: "columbia",
    domain: "www.columbia.com.tr",
    kategori_id: 1,
    logoBg: "1d4ed8",
    coupons: tenCoupons("COLU", "Columbia"),
  },
  {
    ad: "Sportive",
    slug: "sportive",
    domain: "www.sportive.com.tr",
    kategori_id: 1,
    logoBg: "059669",
    coupons: tenCoupons("SPT", "Sportive"),
  },
  {
    ad: "Modanisa",
    slug: "modanisa",
    domain: "www.modanisa.com",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "db2777",
    puan: 4.7,
    degerlendirme_sayisi: 1420,
    coupons: [
      c("Modanisa 100 TL Kupon", "500 TL üzeri tesettür giyim alışverişlerinde 100 TL indirim.", "MOD100"),
      c("Modanisa %20 İndirim", "Yeni sezon ürünlerde %20 indirim kodu.", "MOD20"),
      c("Modanisa Elbise Kampanyası", "Elbise kategorisinde özel indirimler.", "ELBISE", "kampanya"),
      c("Modanisa Ücretsiz İade", "30 gün ücretsiz iade avantajı kampanyası.", "IADE30", "kampanya"),
      c("Modanisa Yeni Üye", "Yeni üyelere özel hoş geldin indirimi.", "MODHOSG"),
      ...extraFiveCoupons("MOD", "Modanisa"),
    ],
  },
  {
    ad: "Yalı Spor",
    slug: "yalispor",
    domain: "www.yalispor.com.tr",
    kategori_id: 1,
    logoBg: "dc2626",
    coupons: tenCoupons("YLS", "Yalı Spor"),
  },
  {
    ad: "Carrefour",
    slug: "carrefoursa",
    domain: "www.carrefoursa.com",
    kategori_id: 2,
    populer_mi: true,
    logoBg: "2563eb",
    logoName: "CS",
    puan: 4.5,
    degerlendirme_sayisi: 980,
    coupons: tenCoupons("CRF", "Carrefour"),
  },
  {
    ad: "Under Armour",
    slug: "under-armour",
    domain: "www.underarmour.com.tr",
    kategori_id: 1,
    logoBg: "000000",
    logoName: "UA",
    coupons: tenCoupons("UA", "Under Armour"),
  },
  {
    ad: "Camper",
    slug: "camper",
    domain: "www.camper.com.tr",
    kategori_id: 1,
    logoBg: "dc2626",
    coupons: tenCoupons("CMP", "Camper"),
  },
  {
    ad: "Bilet.com",
    slug: "bilet-com",
    domain: "www.bilet.com",
    kategori_id: 2,
    logoBg: "0284c7",
    coupons: [
      c("Bilet.com 50 TL İndirim", "Otobüs ve uçak biletlerinde 50 TL indirim kodu.", "BILET50"),
      c("Bilet.com %10 Uçak Bileti", "Seçili uçuşlarda %10 indirim.", "UCAK10"),
      c("Bilet.com Otel Kampanyası", "Otel rezervasyonlarında özel fırsatlar.", "OTELKMP", "kampanya"),
      c("Bilet.com Erken Rezervasyon", "Erken rezervasyonda ek indirim.", "ERKEN", "kampanya"),
      c("Bilet.com Yaz Tatili", "Yaz tatili rotalarında kampanya fiyatları.", "YAZTAT", "kampanya"),
      ...extraFiveCoupons("BLT", "Bilet.com"),
    ],
  },
  {
    ad: "Homend",
    slug: "homend",
    domain: "www.homend.com",
    kategori_id: 3,
    logoBg: "374151",
    coupons: tenCoupons("HMD", "Homend"),
  },
  {
    ad: "Skechers",
    slug: "skechers",
    domain: "www.skechers.com.tr",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "1e40af",
    puan: 4.7,
    degerlendirme_sayisi: 1320,
    coupons: [
      c("Skechers 150 TL İndirim", "750 TL üzeri Skechers alışverişlerinde 150 TL indirim.", "SKX150"),
      c("Skechers %25 Outlet", "Outlet ürünlerinde %25 ek indirim.", "SKX25"),
      c("Skechers 2. Ürün %50", "İkinci üründe %50 indirim kampanyası.", "SKX2U50", "kampanya"),
      c("Skechers Ücretsiz Kargo", "500 TL üzeri siparişlerde ücretsiz kargo.", "SKXKRG", "kampanya"),
      c("Skechers Yürüyüş Ayakkabısı", "Yürüyüş ayakkabılarında sezon kampanyası.", "YURUYUS", "kampanya"),
      ...extraFiveCoupons("SKX", "Skechers"),
    ],
  },
  {
    ad: "Carter's",
    slug: "carters",
    domain: "www.carters.com.tr",
    kategori_id: 1,
    logoBg: "0891b2",
    coupons: tenCoupons("CRT", "Carter's"),
  },
  {
    ad: "Huawei",
    slug: "huawei",
    domain: "consumer.huawei.com/tr",
    kategori_id: 3,
    populer_mi: true,
    logoBg: "dc2626",
    puan: 4.6,
    degerlendirme_sayisi: 890,
    coupons: [
      c("Huawei 500 TL İndirim", "5000 TL üzeri telefon alışverişlerinde 500 TL indirim.", "HW500"),
      c("Huawei Watch Kampanyası", "Huawei Watch modellerinde özel indirim.", "WATCH", "kampanya"),
      c("Huawei Tablet Fırsatı", "Tablet kategorisinde indirim kodu.", "TABLET10"),
      c("Huawei Kulaklık", "FreeBuds serisinde kampanya fiyatları.", "FREEBUDS", "kampanya"),
      c("Huawei Yeni Üye", "Huawei Store yeni üyelere özel indirim.", "HWHOSG"),
      ...extraFiveCoupons("HW", "Huawei"),
    ],
  },
  {
    ad: "Fidandizisi",
    slug: "fidandizisi",
    domain: "www.fidandizisi.com",
    kategori_id: 2,
    logoBg: "16a34a",
    coupons: tenCoupons("FID", "Fidandizisi", { kampanyaBaslik: "Fidandizisi Bahar Kampanyası" }),
  },
  {
    ad: "Amazon Türkiye",
    slug: "amazon-turkiye",
    domain: "www.amazon.com.tr",
    kategori_id: 2,
    populer_mi: true,
    logoBg: "f59e0b",
    logoName: "AZ",
    puan: 4.8,
    degerlendirme_sayisi: 4200,
    coupons: [
      c("Amazon 150 TL İndirim", "Amazon.com.tr'de geçerli 150 TL indirim kuponu.", "AMZ150"),
      c("Amazon %10 İndirim Kodu", "Seçili kategorilerde %10 indirim.", "AMZ10"),
      c("Amazon Prime Üyelik", "Prime üyeliğinde ilk ay ücretsiz kampanyası.", "PRIME", "kampanya"),
      c("Amazon Elektronik Günleri", "Elektronik kategorisinde özel indirimler.", "AMZELEK", "kampanya"),
      c("Amazon Ücretsiz Kargo", "Prime ile ücretsiz hızlı kargo avantajı.", "AMZKRG", "kampanya"),
      ...extraFiveCoupons("AMZ", "Amazon Türkiye"),
    ],
  },
  {
    ad: "Beymen",
    slug: "beymen",
    domain: "www.beymen.com",
    kategori_id: 1,
    populer_mi: true,
    logoBg: "171717",
    puan: 4.8,
    degerlendirme_sayisi: 1560,
    coupons: [
      c("Beymen 500 TL İndirim", "5000 TL üzeri lüks alışverişlerde 500 TL indirim.", "BEY500"),
      c("Beymen %15 İndirim", "Seçili tasarım markalarında %15 indirim.", "BEY15"),
      c("Beymen Club Kampanyası", "Beymen Club üyelerine özel fırsatlar.", "CLUB", "kampanya"),
      c("Beymen Outlet", "Outlet ürünlerinde ek indirim kampanyası.", "OUTLET", "kampanya"),
      c("Beymen Ücretsiz Kargo", "Tüm siparişlerde ücretsiz kargo.", "BEYKRG", "kampanya"),
      ...extraFiveCoupons("BEY", "Beymen"),
    ],
  },
  {
    ad: "Bella Maison",
    slug: "bella-maison",
    domain: "www.bellamaison.com",
    kategori_id: 1,
    logoBg: "78716c",
    coupons: tenCoupons("BEL", "Bella Maison"),
  },
  {
    ad: "Gencallar",
    slug: "gencallar",
    domain: "www.gencallar.com",
    kategori_id: 3,
    logoBg: "1e40af",
    coupons: tenCoupons("GNC", "Gencallar"),
  },
  {
    ad: "Etstur",
    slug: "etstur",
    domain: "www.etstur.com",
    kategori_id: 2,
    populer_mi: true,
    logoBg: "dc2626",
    puan: 4.6,
    degerlendirme_sayisi: 2340,
    coupons: [
      c("Etstur 500 TL İndirim", "5000 TL üzeri tatil paketlerinde 500 TL indirim.", "ETS500"),
      c("Etstur %10 Otel", "Seçili otellerde %10 indirim kodu.", "ETS10"),
      c("Etstur Erken Rezervasyon", "Erken rezervasyon kampanyası.", "ERKENETS", "kampanya"),
      c("Etstur Yurt Dışı Tur", "Yurt dışı turlarda özel fırsatlar.", "YURTDISI", "kampanya"),
      c("Etstur Balayı Paketi", "Balayı otellerinde kampanya fiyatları.", "BALAYI", "kampanya"),
      ...extraFiveCoupons("ETS", "Etstur"),
    ],
  },
  {
    ad: "SunExpress",
    slug: "sunexpress",
    domain: "www.sunexpress.com",
    kategori_id: 2,
    logoBg: "f59e0b",
    logoName: "SX",
    coupons: [
      c("SunExpress 200 TL İndirim", "SunExpress uçuşlarında 200 TL indirim kodu.", "SUN200"),
      c("SunExpress %15 Bilet", "Seçili rotalarda %15 indirim.", "SUN15"),
      c("SunExpress Yaz Seferleri", "Yaz seferlerinde kampanya biletleri.", "YAZSUN", "kampanya"),
      c("SunExpress Bagaj Kampanyası", "Ek bagaj hakkı kampanyası.", "BAGAJ", "kampanya"),
      c("SunExpress Erken Rezervasyon", "Erken rezervasyonda indirimli biletler.", "ERKSUN", "kampanya"),
      ...extraFiveCoupons("SUN", "SunExpress"),
    ],
  },
  {
    ad: "Network",
    slug: "network",
    domain: "www.network.com.tr",
    kategori_id: 1,
    logoBg: "0f172a",
    coupons: tenCoupons("NET", "Network"),
  },
];

export function generateBrandStores(startId: number): Store[] {
  return brandSeedConfigs.map((brand, index) => buildStoreFromBrand(startId + index, brand));
}

export function generateBrandCoupons(storeStartId: number, couponStartId: number): Coupon[] {
  const coupons: Coupon[] = [];
  let nextCouponId = couponStartId;

  brandSeedConfigs.forEach((brand, index) => {
    const storeId = storeStartId + index;
    const brandCoupons = buildCouponsForBrand(storeId, nextCouponId, brand);
    coupons.push(...brandCoupons);
    nextCouponId += brandCoupons.length;
  });

  return coupons;
}

export { slugifyBrand };
