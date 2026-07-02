import SiteLayout from "@/components/layout/SiteLayout";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import { buildNoIndexMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildNoIndexMetadata("Sayfa Bulunamadı");

export default async function NotFound() {
  const breadcrumbItems = await withHomeBreadcrumb([{ label: "Sayfa Bulunamadı" }]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-4 py-12">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-6xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Sayfa Bulunamadı</h1>
          <p className="mt-2 text-muted">Aradığınız mağaza veya sayfa mevcut değil.</p>
          <Link
            href="/markalar"
            className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Markalara Dön
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
