import SiteLayout from "@/components/layout/SiteLayout";
import SiteJsonLd from "@/components/layout/SiteJsonLd";
import HomeCouponSection from "@/components/home/HomeCouponSection";
import HomeSeoSection from "@/components/home/HomeSeoSection";
import HomeStoreSection from "@/components/home/HomeStoreSection";
import { getCachedSiteSettings, getHomepageData } from "@/lib/db/cache";
import { buildHomepageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  return buildHomepageMetadata(settings);
}

export default async function HomePage() {
  const { homepageStores, couponCounts, topCoupons, storesById } = await getHomepageData();

  return (
    <SiteLayout>
      <SiteJsonLd />
      <section className="bg-gradient-to-br from-primary to-primary-dark py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Güncel İndirim Kodları ve Kampanyalar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            Binlerce markada geçerli indirim kodlarını keşfedin, kopyalayın ve anında tasarruf edin.
          </p>
          <Link
            href="/markalar"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary transition-transform hover:scale-[1.02] sm:text-base"
          >
            Tüm Markaları Gör →
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <HomeStoreSection
          stores={homepageStores}
          getCouponCount={(id) => couponCounts.get(id) ?? 0}
        />

        <HomeCouponSection
          coupons={topCoupons}
          getStore={(id) => storesById.get(id)}
        />

        <HomeSeoSection />
      </div>
    </SiteLayout>
  );
}
