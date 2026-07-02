import CatalogSiteLayout from "@/components/layout/CatalogSiteLayout";
import PageLoading from "@/components/ui/PageLoading";
import { buildPageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import MarkalarPageContent from "./MarkalarPageContent";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ sayfa?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Tüm Markalar — İndirim Kodları",
    description:
      "Tüm markaların güncel indirim kodları ve kampanyaları. Aradığınız markayı seçin, kupon kodunu kopyalayın.",
    path: "/markalar",
  });
}

export default function MarkalarPage({ searchParams }: PageProps) {
  return (
    <CatalogSiteLayout>
      <Suspense fallback={<PageLoading />}>
        <MarkalarPageContent searchParams={searchParams} />
      </Suspense>
    </CatalogSiteLayout>
  );
}
