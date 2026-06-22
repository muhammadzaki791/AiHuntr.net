import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Studio is an editing surface, not public content.
      disallow: ["/studio"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
