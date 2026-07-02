import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { defaultSiteSettings } from "../lib/data/seed-settings";
import { seedCategories } from "../lib/data/seed-categories";
import { seedCoupons, seedStores } from "../lib/data/seed";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  console.log("Kategoriler ekleniyor...");
  const { error: catError } = await supabase.from("categories").upsert(
    seedCategories.map(({ id, ad, slug, aciklama, seo_title, seo_description }) => ({
      id,
      ad,
      slug,
      aciklama,
      seo_title,
      seo_description,
    })),
  );
  if (catError) throw catError;

  console.log("Mağazalar ekleniyor...");
  const { error: storeError } = await supabase.from("stores").upsert(
    seedStores.map(
      ({
        id,
        ad,
        slug,
        logo_url,
        link,
        seo_title,
        seo_description,
        seo_icerik,
        sss,
        kategori_id,
        populer_mi,
        puan,
        degerlendirme_sayisi,
      }) => ({
        id,
        ad,
        slug,
        logo_url,
        link: link ?? "",
        seo_title,
        seo_description,
        seo_icerik: seo_icerik ?? "",
        sss: sss ?? [],
        kategori_id: kategori_id ?? 1,
        populer_mi,
        puan,
        degerlendirme_sayisi,
      }),
    ),
  );
  if (storeError) throw storeError;

  console.log("Kuponlar ekleniyor...");
  const { error: couponError } = await supabase.from("coupons").upsert(
    seedCoupons.map(
      ({
        id,
        store_id,
        baslik,
        aciklama,
        kod,
        link,
        tur,
        baslangic_tarihi,
        bitis_tarihi,
        aktif_mi,
        kullanim_sayisi,
      }) => ({
        id,
        store_id,
        baslik,
        aciklama,
        kod,
        link,
        tur,
        baslangic_tarihi,
        bitis_tarihi,
        aktif_mi,
        kullanim_sayisi: kullanim_sayisi ?? 0,
      }),
    ),
  );
  if (couponError) throw couponError;

  console.log("Site ayarları ekleniyor...");
  const { error: settingsError } = await supabase.from("site_settings").upsert({
    id: 1,
    ...defaultSiteSettings,
  });
  if (settingsError) throw settingsError;

  console.log(
    `Seed tamamlandı: ${seedCategories.length} kategori, ${seedStores.length} mağaza, ${seedCoupons.length} kupon.`,
  );
}

seed().catch((error) => {
  console.error("Seed hatası:", error);
  process.exit(1);
});
