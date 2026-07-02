import { isReservedSlug } from "@/lib/validation/reserved-slugs";
import { z } from "zod";

const optionalHttpsUrl = z
  .string()
  .max(2000)
  .refine(
    (value) => !value.trim() || value.trim().startsWith("https://"),
    "URL https:// ile başlamalıdır.",
  );

const optionalAssetUrl = z
  .string()
  .max(2000)
  .refine(
    (value) =>
      !value.trim() || value.startsWith("/") || value.startsWith("https://"),
    "Geçerli bir görsel yolu veya https URL girin.",
  );

const storeFaqSchema = z.object({
  id: z.string().min(1).max(64),
  soru: z.string().min(1).max(500),
  cevap: z.string().max(20000),
});

export const StoreInputSchema = z.object({
  ad: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(160)
    .refine((slug) => !isReservedSlug(slug), "Bu slug rezerve edilmiştir."),
  logo_url: optionalAssetUrl,
  link: optionalHttpsUrl,
  seo_title: z.string().min(1).max(160),
  seo_description: z.string().max(5000),
  seo_icerik: z.string().max(50000).optional().default(""),
  sss: z.array(storeFaqSchema).optional().default([]),
  kategori_id: z.number().int().positive(),
  populer_mi: z.boolean().optional().default(false),
  puan: z.number().min(0).max(5).optional().default(4.5),
  degerlendirme_sayisi: z.number().int().min(0).optional().default(100),
});

export const StoreUpdateSchema = StoreInputSchema.partial();

export const CategoryInputSchema = z.object({
  ad: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(160)
    .refine((slug) => !isReservedSlug(slug), "Bu slug rezerve edilmiştir."),
  aciklama: z.string().max(5000).optional().default(""),
  seo_title: z.string().min(1).max(160),
  seo_description: z.string().max(5000),
});

export const CategoryUpdateSchema = CategoryInputSchema.partial();

export const CouponInputSchema = z.object({
  store_id: z.number().int().positive(),
  baslik: z.string().min(1).max(200),
  aciklama: z.string().max(2000).optional().default(""),
  kod: z.string().max(100).optional().default(""),
  link: optionalHttpsUrl,
  tur: z.enum(["kod", "kampanya"]),
  baslangic_tarihi: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bitis_tarihi: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  aktif_mi: z.boolean().optional().default(true),
});

export const CouponUpdateSchema = CouponInputSchema.partial().omit({ store_id: true });

export const SiteSettingsSchema = z.object({
  site_name: z.string().min(1).max(120),
  logo_url: optionalAssetUrl.optional().default(""),
  favicon_url: optionalAssetUrl.optional().default(""),
  homepage_meta_title: z.string().min(1).max(160),
  homepage_meta_description: z.string().min(1).max(500),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır.").max(120),
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  subject: z.string().min(3, "Konu en az 3 karakter olmalıdır.").max(160),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır.").max(5000),
  website: z.string().max(200).optional().default(""),
});

export function validationErrorResponse(error: z.ZodError) {
  return {
    error: "Geçersiz istek verisi.",
    details: error.flatten(),
  };
}
