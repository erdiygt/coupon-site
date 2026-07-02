import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getCachedSiteSettings } from "@/lib/db/cache";

export default async function SiteLayoutShell({ children }: { children: React.ReactNode }) {
  const settings = await getCachedSiteSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
