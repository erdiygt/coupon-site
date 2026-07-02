export const CONTACT_EMAIL = "hello@kuponkodlari.com.tr";
export const CONTACT_ADDRESS =
  "Next Level Plaza, Kızılırmak Mah. 1443. Cad. No: 25, 06520 Çankaya/Ankara";
export const CONTACT_RECIPIENT_EMAIL =
  process.env.CONTACT_RECIPIENT_EMAIL?.trim() ||
  (process.env.NODE_ENV === "production" ? "" : "yigiterdi05@gmail.com");
export const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || CONTACT_EMAIL;

export type SocialPlatform = "x" | "facebook" | "instagram" | "tiktok" | "pinterest";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

function socialUrl(envKey: string, fallback: string): string {
  const value = process.env[envKey]?.trim();
  return value || fallback;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "x",
    label: "X",
    href: socialUrl("NEXT_PUBLIC_SOCIAL_X_URL", "https://x.com/kuponkodlarim"),
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: socialUrl("NEXT_PUBLIC_SOCIAL_FACEBOOK_URL", "https://facebook.com/kuponkodlarim"),
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: socialUrl("NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL", "https://instagram.com/kuponkodlarim"),
  },
  {
    platform: "tiktok",
    label: "TikTok",
    href: socialUrl("NEXT_PUBLIC_SOCIAL_TIKTOK_URL", "https://tiktok.com/@kuponkodlarim"),
  },
  {
    platform: "pinterest",
    label: "Pinterest",
    href: socialUrl("NEXT_PUBLIC_SOCIAL_PINTEREST_URL", "https://pinterest.com/kuponkodlarim"),
  },
];
