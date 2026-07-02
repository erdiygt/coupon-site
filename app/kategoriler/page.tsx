import CatalogSiteLayout from "@/components/layout/CatalogSiteLayout";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryGrid } from "@/components/categories/CategoryCard";
import { getCachedAllCategories } from "@/lib/db/cache";
import { buildPageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Kategoriler — İndirim Kodları",
    description:
      "Giyim, pazaryeri, elektronik ve daha fazla kategoride güncel indirim kodlarını keşfedin.",
    path: "/kategoriler",
  });
}

export default async function KategorilerPage() {
  const categories = await getCachedAllCategories();
  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "Kategoriler", href: "/kategoriler" },
  ]);

  return (
    <CatalogSiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Kategoriler</h1>
          <p className="mt-2 text-muted">
            {categories.length} kategoride binlerce indirim kodu ve kampanya
          </p>
        </div>
        <CategoryGrid categories={categories} />
      </div>
    </CatalogSiteLayout>
  );
}
