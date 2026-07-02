import SiteLayoutShell from "@/components/layout/SiteLayoutShell";

/** Modal provider olmadan — markalar / kategoriler listeleri için hafif layout. */
export default function CatalogSiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayoutShell>{children}</SiteLayoutShell>;
}
