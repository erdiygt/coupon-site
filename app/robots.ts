import { absoluteUrl } from "@/lib/site/url";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = absoluteUrl("");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/out/", "/cpn/", "/kupona-git/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
