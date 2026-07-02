import { getCachedSiteSettings } from "@/lib/db/cache";
import { absoluteUrl } from "@/lib/site/url";
import { safeJsonLd } from "@/lib/utils/html";

export default async function SiteJsonLd() {
  const settings = await getCachedSiteSettings();
  const siteUrl = absoluteUrl("/");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: settings.site_name,
        url: siteUrl,
        logo: settings.logo_url ? absoluteUrl(settings.logo_url) : absoluteUrl("/logo.png"),
      },
      {
        "@type": "WebSite",
        name: settings.site_name,
        url: siteUrl,
        description: settings.homepage_meta_description,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
