import CatalogSiteLayout from "@/components/layout/CatalogSiteLayout";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import SocialLinks from "@/components/social/SocialLinks";
import { getCachedSiteSettings } from "@/lib/db/cache";
import { SOCIAL_LINKS } from "@/lib/site/contact";
import { buildPageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();

  return buildPageMetadata({
    title: "Hakkımızda",
    description: `${settings.site_name} hakkında bilgi edinin. Güncel indirim kodları ve kampanyalar platformumuzun misyonu.`,
    path: "/hakkimizda",
    siteName: settings.site_name,
  });
}

export default async function AboutPage() {
  const settings = await getCachedSiteSettings();
  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "Hakkımızda", href: "/hakkimizda" },
  ]);

  return (
    <CatalogSiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-foreground">Hakkımızda</h1>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              <strong className="text-foreground">{settings.site_name}</strong>, Türkiye&apos;deki
              alışveriş tutkunlarının güncel indirim kodlarına ve kampanyalara tek bir noktadan
              ulaşmasını sağlayan bağımsız bir kupon platformudur.
            </p>
            <p>
              Amacımız; modadan elektroniğe, pazaryerlerinden marka mağazalarına kadar yüzlerce
              markanın aktif kuponlarını düzenli olarak güncelleyerek size zaman ve para kazandırmaktır.
            </p>
            <p>
              Ekibimiz kuponları manuel ve otomatik yöntemlerle takip eder; süresi dolan kodları
              kaldırır, yeni fırsatları hızla yayınlar. Sitemizde gördüğünüz her kupon, ilgili
              mağazanın sayfasına yönlendirilerek güvenli şekilde kullanılabilir.
            </p>
            <p>
              Sorularınız, iş birliği teklifleriniz veya geri bildirimleriniz için{" "}
              <Link href="/iletisim" className="font-medium text-primary hover:underline">
                iletişim sayfamızdan
              </Link>{" "}
              bize ulaşabilirsiniz.
            </p>
          </div>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground">Bizi Takip Edin</h2>
            <p className="mt-2 text-sm text-muted">
              Sosyal medya hesaplarımızdan yeni kuponları ve kampanyaları anında öğrenin.
            </p>
            <SocialLinks links={SOCIAL_LINKS} className="mt-5" />
          </section>
        </article>
      </div>
    </CatalogSiteLayout>
  );
}
