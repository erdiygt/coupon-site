import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { getRepository } from "@/lib/db/repository";

export default async function AdminSettingsPage() {
  const initialSettings = await getRepository().getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Site Ayarları</h1>
      <p className="mb-8 text-muted">
        Logo, favicon ve anasayfa meta bilgilerini buradan yönetebilirsiniz.
      </p>
      <SiteSettingsForm initialSettings={initialSettings} />
    </div>
  );
}
