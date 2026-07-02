import type { Coupon } from "@/lib/types";

export function isCouponActive(coupon: Coupon, now = new Date()): boolean {
  if (!coupon.aktif_mi) return false;

  const start = new Date(coupon.baslangic_tarihi);
  const end = new Date(coupon.bitis_tarihi);
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

export function partitionCoupons(coupons: Coupon[]) {
  const aktif: Coupon[] = [];
  const suresi_dolmus: Coupon[] = [];

  for (const coupon of coupons) {
    if (isCouponActive(coupon)) {
      aktif.push(coupon);
    } else {
      suresi_dolmus.push(coupon);
    }
  }

  return { aktif, suresi_dolmus };
}

const TURKISH_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${TURKISH_MONTHS[month - 1]} ${year}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
