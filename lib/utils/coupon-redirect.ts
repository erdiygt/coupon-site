/** Mağaza slug'ından kuponburada tarzı kısa marka slug'ı (trendyol-indirim-kodu → trendyol). */
export function brandSlugFromStore(storeSlug: string): string {
  return storeSlug.replace(/-indirim-kodu$/i, "") || storeSlug;
}

/** kuponburada.com: /kupona-git/{marka}/?kupon={id} */
export function kuponaGitPath(storeSlug: string, couponId: number): string {
  return `/kupona-git/${brandSlugFromStore(storeSlug)}/?kupon=${couponId}`;
}

/** Mağaza sayfası + kupon query (yeni sekmede modal için). */
export function storeCouponPath(storeSlug: string, couponId: number): string {
  return `/${storeSlug}?kupon=${couponId}`;
}

/** @deprecated /cpn/ yerine kuponaGitPath kullanın. */
export function couponRedirectPath(storeSlug: string, couponId: number): string {
  return kuponaGitPath(storeSlug, couponId);
}
