import CouponList from "@/components/coupons/CouponList";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import SiteLayout from "@/components/layout/SiteLayout";
import Sidebar from "@/components/sidebar/Sidebar";
import FaqJsonLd from "@/components/stores/FaqJsonLd";
import StoreFaqSection from "@/components/stores/StoreFaqSection";
import StoreHeader from "@/components/stores/StoreHeader";
import StorePageJsonLd from "@/components/stores/StorePageJsonLd";
import StoreSeoContent from "@/components/stores/StoreSeoContent";
import { getCachedAllStores } from "@/lib/db/cache";
import { isDatabaseConfigured } from "@/lib/db/env";
import { loadStoreBySlug } from "@/lib/db/request-cache";
import { getRepository } from "@/lib/db/repository";
import { buildStoreMetadata } from "@/lib/site/metadata";
import { toMetaDescription } from "@/lib/utils/html";
import { isReservedSlug } from "@/lib/validation/reserved-slugs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ "magaza-slug": string }>;
};

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const stores = await getCachedAllStores();
    return stores
      .filter((store) => store.populer_mi)
      .slice(0, 50)
      .map((store) => ({ "magaza-slug": store.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { "magaza-slug": slug } = await params;
  if (isReservedSlug(slug)) {
    return { title: "Sayfa Bulunamadı" };
  }
  const store = await loadStoreBySlug(slug);

  if (!store) {
    return { title: "Mağaza Bulunamadı" };
  }

  return buildStoreMetadata(store, toMetaDescription(store.seo_description));
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { "magaza-slug": slug } = await params;
  if (isReservedSlug(slug)) {
    notFound();
  }

  const storeData = await getRepository().getStoreWithCoupons(slug);

  if (!storeData) {
    notFound();
  }

  const allCoupons = [
    ...storeData.aktif_kuponlar,
    ...storeData.suresi_dolmus_kuponlar,
  ];

  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "Markalar", href: "/markalar" },
    { label: `${storeData.ad} İndirim Kodu`, href: `/${storeData.slug}` },
  ]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <StoreHeader store={storeData} />

            <CouponList
              coupons={storeData.aktif_kuponlar}
              store={storeData}
              title={`Aktif ${storeData.ad} Kuponları`}
            />

            <CouponList
              coupons={storeData.suresi_dolmus_kuponlar}
              store={storeData}
              title={`Süresi Dolmuş ${storeData.ad} Kuponları`}
              expired
            />

            {allCoupons.length === 0 && (
              <p className="mt-8 rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted">
                Bu mağaza için henüz kupon bulunmuyor.
              </p>
            )}

            <StoreFaqSection storeAd={storeData.ad} faqs={storeData.sss} />
            <StoreSeoContent storeAd={storeData.ad} content={storeData.seo_icerik} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={<aside className="h-64 animate-pulse rounded-xl bg-border/40" />}>
              <Sidebar />
            </Suspense>
          </div>
        </div>
      </div>

      <FaqJsonLd faqs={storeData.sss} />
      <StorePageJsonLd
        store={storeData}
        slug={storeData.slug}
        coupons={storeData.aktif_kuponlar}
      />
    </SiteLayout>
  );
}
