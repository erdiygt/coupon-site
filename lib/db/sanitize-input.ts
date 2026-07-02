import type { CategoryInput, CouponInput, StoreFaq, StoreInput } from "@/lib/types";
import { plainTextToHtml, sanitizeRichHtml } from "@/lib/utils/html";
import { safeHttpsUrlString } from "@/lib/utils/safe-url";
import { assertSlugAvailable } from "@/lib/validation/reserved-slugs";

function sanitizeRichField(value: string | undefined): string {
  if (!value?.trim()) return "";
  return sanitizeRichHtml(plainTextToHtml(value));
}

function sanitizeFaqs(faqs: StoreFaq[] | undefined): StoreFaq[] {
  return (faqs ?? []).map((faq) => ({
    id: faq.id.trim(),
    soru: faq.soru.trim(),
    cevap: sanitizeRichField(faq.cevap),
  }));
}

export function sanitizeStoreInput(input: StoreInput): StoreInput {
  assertSlugAvailable(input.slug);

  return {
    ...input,
    ad: input.ad.trim(),
    slug: input.slug.trim(),
    logo_url: input.logo_url.trim(),
    link: safeHttpsUrlString(input.link),
    seo_title: input.seo_title.trim(),
    seo_description: sanitizeRichField(input.seo_description),
    seo_icerik: sanitizeRichField(input.seo_icerik),
    sss: sanitizeFaqs(input.sss),
  };
}

export function sanitizePartialStoreInput(input: Partial<StoreInput>): Partial<StoreInput> {
  const result: Partial<StoreInput> = { ...input };

  if (input.slug !== undefined) {
    assertSlugAvailable(input.slug);
    result.slug = input.slug.trim();
  }
  if (input.ad !== undefined) result.ad = input.ad.trim();
  if (input.logo_url !== undefined) result.logo_url = input.logo_url.trim();
  if (input.link !== undefined) result.link = safeHttpsUrlString(input.link);
  if (input.seo_title !== undefined) result.seo_title = input.seo_title.trim();
  if (input.seo_description !== undefined) {
    result.seo_description = sanitizeRichField(input.seo_description);
  }
  if (input.seo_icerik !== undefined) {
    result.seo_icerik = sanitizeRichField(input.seo_icerik);
  }
  if (input.sss !== undefined) {
    result.sss = sanitizeFaqs(input.sss);
  }

  return result;
}

export function sanitizeCategoryInput(input: CategoryInput): CategoryInput {
  assertSlugAvailable(input.slug);

  return {
    ...input,
    ad: input.ad.trim(),
    slug: input.slug.trim(),
    aciklama: sanitizeRichField(input.aciklama),
    seo_title: input.seo_title.trim(),
    seo_description: sanitizeRichField(input.seo_description),
  };
}

export function sanitizePartialCategoryInput(
  input: Partial<CategoryInput>,
): Partial<CategoryInput> {
  const result: Partial<CategoryInput> = { ...input };

  if (input.slug !== undefined) {
    assertSlugAvailable(input.slug);
    result.slug = input.slug.trim();
  }
  if (input.ad !== undefined) result.ad = input.ad.trim();
  if (input.aciklama !== undefined) result.aciklama = sanitizeRichField(input.aciklama);
  if (input.seo_title !== undefined) result.seo_title = input.seo_title.trim();
  if (input.seo_description !== undefined) {
    result.seo_description = sanitizeRichField(input.seo_description);
  }

  return result;
}

export function sanitizeCouponInput(input: CouponInput): CouponInput {
  return {
    ...input,
    baslik: input.baslik.trim(),
    aciklama: input.aciklama.trim(),
    kod: input.kod.trim(),
    link: safeHttpsUrlString(input.link),
  };
}

export function sanitizePartialCouponInput(
  input: Partial<CouponInput>,
): Partial<CouponInput> {
  const result: Partial<CouponInput> = { ...input };

  if (input.baslik !== undefined) result.baslik = input.baslik.trim();
  if (input.aciklama !== undefined) result.aciklama = input.aciklama.trim();
  if (input.kod !== undefined) result.kod = input.kod.trim();
  if (input.link !== undefined) result.link = safeHttpsUrlString(input.link);

  return result;
}
