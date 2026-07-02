import RichTextContent from "@/components/content/RichTextContent";
import CatalogSiteLayout from "@/components/layout/CatalogSiteLayout";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import StoreGrid from "@/components/stores/StoreGrid";
import { getCachedAllCategories } from "@/lib/db/cache";
import { isDatabaseConfigured } from "@/lib/db/env";
import { getRepository } from "@/lib/db/repository";
import { loadCategoryBySlug } from "@/lib/db/request-cache";
import { buildCategoryMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import { toMetaDescription } from "@/lib/utils/html";
import { notFound } from "next/navigation";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const categories = await getCachedAllCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategoryBySlug(slug);

  if (!category) {
    return { title: "Kategori Bulunamadı" };
  }

  return buildCategoryMetadata(category, toMetaDescription(category.seo_description));
}

export default async function CategoryListingPage({ params }: PageProps) {
  const { slug } = await params;
  const repo = getRepository();
  const category = await loadCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const stores = await repo.getStoresByCategoryId(category.id);
  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "Kategoriler", href: "/kategoriler" },
    {
      label: `${category.ad} İndirim Kodları`,
      href: `/kategoriler/${category.slug}`,
    },
  ]);

  return (
    <CatalogSiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {category.ad} İndirim Kodları
          </h1>
          <RichTextContent content={category.aciklama} className="max-w-2xl" />
          <p className="mt-1 text-sm text-muted">{stores.length} mağaza listeleniyor</p>
        </div>

        <StoreGrid stores={stores} />
      </div>
    </CatalogSiteLayout>
  );
}
