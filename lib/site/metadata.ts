import type { Category, SiteSettings, Store } from "@/lib/types";
import type { Metadata } from "next";
import { getTurkishMonthYear } from "@/lib/site/date-label";
import { absoluteUrl } from "@/lib/site/url";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  siteName?: string;
  imageUrl?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  siteName = "İndirimKodu",
  imageUrl,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = imageUrl?.startsWith("http")
    ? imageUrl
    : imageUrl
      ? absoluteUrl(imageUrl)
      : absoluteUrl("/og-default.png");

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: canonical,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildSiteMetadata(settings: SiteSettings): Metadata {
  const title = settings.homepage_meta_title;
  const description = settings.homepage_meta_description;
  const canonical = absoluteUrl("/");
  const ogImage = settings.logo_url
    ? settings.logo_url.startsWith("http")
      ? settings.logo_url
      : absoluteUrl(settings.logo_url)
    : absoluteUrl("/og-default.png");

  const favicon = settings.favicon_url
    ? settings.favicon_url.startsWith("http")
      ? settings.favicon_url
      : absoluteUrl(settings.favicon_url)
    : absoluteUrl("/favicon.png");

  const metadata: Metadata = {
    metadataBase: new URL(getSiteUrlFromSettings()),
    title: {
      default: title,
      template: `%s | ${settings.site_name}`,
    },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: canonical,
      siteName: settings.site_name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: settings.site_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: favicon,
      apple: favicon,
    },
  };

  return metadata;
}

function getSiteUrlFromSettings(): string {
  return absoluteUrl("/").replace(/\/$/, "") || "http://localhost:3000";
}

export function buildHomepageMetadata(settings: SiteSettings): Metadata {
  return buildPageMetadata({
    title: settings.homepage_meta_title,
    description: settings.homepage_meta_description,
    path: "/",
    siteName: settings.site_name,
    imageUrl: settings.logo_url || "/og-default.png",
  });
}

export function buildStoreMetadata(
  store: Pick<Store, "ad" | "slug" | "seo_title" | "logo_url" | "seo_description">,
  description: string,
): Metadata {
  const title =
    store.seo_title?.trim() || `${store.ad} İndirim Kodu ${getTurkishMonthYear()}`;

  return buildPageMetadata({
    title,
    description,
    path: `/${store.slug}`,
    imageUrl: store.logo_url || undefined,
  });
}

export function buildCategoryMetadata(
  category: Pick<Category, "ad" | "slug" | "seo_title" | "seo_description">,
  description: string,
): Metadata {
  const title = category.seo_title?.trim() || `${category.ad} İndirim Kodları`;

  return buildPageMetadata({
    title,
    description,
    path: `/kategoriler/${category.slug}`,
  });
}

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
