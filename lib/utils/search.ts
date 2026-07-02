export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

export function matchesStoreSearch(
  fields: { ad: string; slug: string; seo_title: string },
  query: string
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return false;

  const haystack = [
    fields.ad,
    fields.slug,
    fields.seo_title,
    fields.slug.replace(/-indirim-kodu$/, ""),
  ]
    .map(normalizeSearchText)
    .join(" ");

  return haystack.includes(normalizedQuery);
}
