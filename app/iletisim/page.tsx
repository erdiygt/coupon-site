import CatalogSiteLayout from "@/components/layout/CatalogSiteLayout";
import Breadcrumb, { withHomeBreadcrumb } from "@/components/layout/Breadcrumb";
import ContactForm from "@/components/contact/ContactForm";
import { getCachedSiteSettings } from "@/lib/db/cache";
import { CONTACT_ADDRESS, CONTACT_EMAIL } from "@/lib/site/contact";
import { buildPageMetadata } from "@/lib/site/metadata";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();

  return buildPageMetadata({
    title: "İletişim",
    description: `${settings.site_name} iletişim bilgileri ve mesaj formu. Bize ${CONTACT_EMAIL} üzerinden veya form aracılığıyla ulaşın.`,
    path: "/iletisim",
    siteName: settings.site_name,
  });
}

export default async function ContactPage() {
  const breadcrumbItems = await withHomeBreadcrumb([
    { label: "İletişim", href: "/iletisim" },
  ]);

  return (
    <CatalogSiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">İletişim</h1>
          <p className="mt-2 text-muted">
            Soru, öneri veya iş birliği talepleriniz için aşağıdaki formu kullanabilirsiniz.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">E-posta</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 block text-sm font-medium text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Adres</p>
            <p className="mt-2 text-sm font-medium text-foreground">{CONTACT_ADDRESS}</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </CatalogSiteLayout>
  );
}
