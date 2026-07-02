import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminNav from "@/components/admin/AdminNav";
import { SiteBrandLink } from "@/components/layout/SiteBrand";
import { getCachedSiteSettings } from "@/lib/db/cache";
import Link from "next/link";

export default async function AdminPanelShell({ children }: { children: React.ReactNode }) {
  const settings = await getCachedSiteSettings();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-6 lg:block">
          <div className="mb-8">
            <SiteBrandLink siteName={settings.site_name} logoUrl={settings.logo_url} />
          </div>
          <AdminNav />
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="block text-sm text-muted transition-colors hover:text-primary"
            >
              ← Siteye Dön
            </Link>
            <AdminLogoutButton />
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-border bg-white px-6 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <SiteBrandLink siteName={settings.site_name} logoUrl={settings.logo_url} />
              <div className="flex items-center gap-3">
                <Link href="/" className="text-sm text-primary">
                  Siteye Dön
                </Link>
                <AdminLogoutButton />
              </div>
            </div>
            <div className="mt-4">
              <AdminNav />
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
