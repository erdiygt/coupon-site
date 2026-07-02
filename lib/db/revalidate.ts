import { revalidatePath, revalidateTag } from "next/cache";

interface RevalidateOptions {
  storeSlug?: string;
  categorySlug?: string;
}

export function revalidatePublicData(options?: RevalidateOptions) {
  revalidateTag("stores", "max");
  revalidateTag("coupons", "max");
  revalidateTag("categories", "max");
  revalidatePath("/");
  revalidatePath("/markalar");
  revalidatePath("/kategoriler");
  revalidatePath("/sitemap.xml");

  if (options?.storeSlug) {
    revalidatePath(`/${options.storeSlug}`);
  }

  if (options?.categorySlug) {
    revalidatePath(`/kategoriler/${options.categorySlug}`);
  }
}

export function revalidateSiteSettings() {
  revalidateTag("site-settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/markalar", "layout");
  revalidatePath("/kategoriler", "layout");
}
