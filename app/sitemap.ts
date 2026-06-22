import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { sanityClient } from "@/sanity/lib/client";
import {
  getAllToolSlugsQuery,
  getAllPostSlugsQuery,
  getAllCategorySlugsQuery,
} from "@/lib/client/queries";

/**
 * XML sitemap.
 *
 * Static routes + dynamic tool, post, and category pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/tools",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const [toolSlugs, postSlugs, categorySlugs] = await Promise.all([
    sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      getAllToolSlugsQuery,
    ),
    sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      getAllPostSlugsQuery,
    ),
    sanityClient.fetch<{ slug: string; _updatedAt: string }[]>(
      getAllCategorySlugsQuery,
    ),
  ]);

  const toolEntries: MetadataRoute.Sitemap = toolSlugs.map(
    ({ slug, _updatedAt }) => ({
      url: `${base}/tools/${slug}`,
      lastModified: _updatedAt ? new Date(_updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const postEntries: MetadataRoute.Sitemap = postSlugs.map(
    ({ slug, _updatedAt }) => ({
      url: `${base}/blog/${slug}`,
      lastModified: _updatedAt ? new Date(_updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const categoryEntries: MetadataRoute.Sitemap = categorySlugs.map(
    ({ slug, _updatedAt }) => ({
      url: `${base}/category/${slug}`,
      lastModified: _updatedAt ? new Date(_updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [
    ...staticEntries,
    ...toolEntries,
    ...postEntries,
    ...categoryEntries,
  ];
}
