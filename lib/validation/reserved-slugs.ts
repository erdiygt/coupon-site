const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "out",
  "cpn",
  "kupona-git",
  "markalar",
  "kategoriler",
  "hakkimizda",
  "iletisim",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "_next",
]);

export function isReservedSlug(slug: string): boolean {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return true;
  return RESERVED_SLUGS.has(normalized);
}

export function assertSlugAvailable(slug: string): void {
  if (isReservedSlug(slug)) {
    throw new Error("Bu slug rezerve edilmiştir.");
  }
}
