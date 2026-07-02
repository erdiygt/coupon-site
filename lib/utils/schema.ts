import { toAbsoluteUrl } from "@/lib/config/site";
import type { Coupon, Store } from "@/lib/types";
import { resolveCouponLink } from "@/lib/utils/coupon-links";
import type { BreadcrumbItem } from "@/lib/types/breadcrumb";
import type { StoreFaq } from "@/lib/types";
import { stripHtml } from "@/lib/utils/sanitize-rich-html";

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const listItem: Record<string, string | number> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };

      if (item.href) {
        listItem.item = toAbsoluteUrl(item.href);
      }

      return listItem;
    }),
  };
}

export function buildFaqPageSchema(faqs?: StoreFaq[] | null) {
  if (!faqs?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.soru,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(faq.cevap),
      },
    })),
  };
}

export function buildStorePageSchema(
  store: Store,
  slug: string,
  coupons: Coupon[],
) {
  const pageUrl = toAbsoluteUrl(`/${slug}`);
  const description = stripHtml(store.seo_description);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${store.ad} İndirim Kodu`,
    url: pageUrl,
    description,
    ...(coupons.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            name: `Aktif ${store.ad} Kuponları`,
            numberOfItems: coupons.length,
            itemListElement: coupons.map((coupon, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Offer",
                name: coupon.baslik,
                url: resolveCouponLink(coupon, store),
                description: coupon.aciklama,
                validThrough: coupon.bitis_tarihi,
              },
            })),
          },
        }
      : {}),
  };
}
