import manifest from "@/lib/data/store-logos-manifest.json";

const logoMap = manifest as Record<string, string>;

/** Yerel logo yolunu WebP'ye çevirir (manifest henüz güncellenmemişse). */
export function resolveStoreLogoUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/uploads/logos/")) {
    return url.replace(/\.(png|jpe?g)$/i, ".webp");
  }
  return url;
}

export function storeLogoUrl(
  storeSlug: string,
  fallbackName?: string,
  fallbackBg = "22c55e",
): string {
  const localLogo = logoMap[storeSlug];
  if (localLogo) {
    return resolveStoreLogoUrl(localLogo);
  }

  const name = encodeURIComponent(
    fallbackName ?? storeSlug.replace(/-indirim-kodu$/, "").slice(0, 8),
  );
  return `https://ui-avatars.com/api/?name=${name}&background=${fallbackBg}&color=fff&size=128&bold=true&format=webp`;
}

/** Görüntüleme URL'si — boşsa mağaza adından avatar üretir. */
export function resolveStoreLogoDisplayUrl(
  url: string,
  fallbackName = "?",
): string {
  if (url?.trim()) return resolveStoreLogoUrl(url.trim());
  const name = encodeURIComponent(fallbackName.trim().slice(0, 8) || "?");
  return `https://ui-avatars.com/api/?name=${name}&background=22c55e&color=fff&size=128&bold=true&format=webp`;
}

export function hasLocalLogo(storeSlug: string): boolean {
  return Boolean(logoMap[storeSlug]);
}
