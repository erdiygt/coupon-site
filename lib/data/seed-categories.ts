import type { Category } from "@/lib/types";

export const seedCategories: Category[] = [
  {
    id: 1,
    ad: "Giyim & Moda",
    slug: "giyim-moda",
    aciklama: "Giyim, ayakkabı ve moda markalarının indirim kodları.",
    seo_title: "Giyim & Moda İndirim Kodları",
    seo_description:
      "Giyim ve moda kategorisindeki markaların güncel indirim kodları ve kampanyaları.",
  },
  {
    id: 2,
    ad: "Pazaryeri",
    slug: "pazaryeri",
    aciklama: "Online pazaryeri platformlarının kupon ve kampanyaları.",
    seo_title: "Pazaryeri İndirim Kodları",
    seo_description:
      "Trendyol, Hepsiburada, N11 gibi pazaryerlerinin güncel indirim kodları.",
  },
  {
    id: 3,
    ad: "Elektronik",
    slug: "elektronik",
    aciklama: "Elektronik ve teknoloji ürünlerinde geçerli indirim fırsatları.",
    seo_title: "Elektronik İndirim Kodları",
    seo_description:
      "Elektronik ve teknoloji alışverişlerinizde kullanabileceğiniz indirim kodları.",
  },
  {
    id: 4,
    ad: "Kozmetik",
    slug: "kozmetik",
    aciklama: "Kozmetik ve kişisel bakım markalarının indirim kodları.",
    seo_title: "Kozmetik İndirim Kodları",
    seo_description:
      "Kozmetik ve kişisel bakım alışverişleriniz için güncel kupon kodları.",
  },
];
