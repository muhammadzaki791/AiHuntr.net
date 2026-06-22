import type { Metadata } from "next";
import { sanityClient } from "@/sanity/lib/client";
import { getSeoByPageSlugQuery } from "@/lib/client/queries";
import { urlFor } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/config/site";
import type { SeoDoc } from "@/types/content-types";

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Sanity image (from an SEO doc) or an absolute URL string. */
  ogImage?: SeoDoc["ogImage"] | string;
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * Build a Next.js Metadata object from resolved title/description/og values.
 * Pages typically call `getSeoForSlug()` first (to pull a Sanity SEO doc) and
 * pass its values here with content-derived fallbacks.
 */
export function buildMetadata({
  title,
  description,
  ogImage,
  canonicalUrl,
  noIndex,
  keywords,
}: BuildMetadataInput): Metadata {
  const image =
    typeof ogImage === "string"
      ? ogImage
      : ogImage
        ? urlFor(ogImage).width(1200).height(630).url()
        : undefined;

  return {
    title,
    description,
    keywords,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Fetch the SEO doc for a page slug (e.g. "tools/chatgpt"), or null. */
export async function getSeoForSlug(pageSlug: string): Promise<SeoDoc | null> {
  return sanityClient.fetch<SeoDoc | null>(getSeoByPageSlugQuery, { pageSlug });
}

/**
 * Convenience: resolve metadata for a page from its SEO doc with fallbacks.
 * `fallback` supplies title/description/ogImage when no SEO doc exists.
 */
export async function buildMetadataForSlug(
  pageSlug: string,
  fallback: { title: string; description: string; ogImage?: SeoDoc["ogImage"] },
): Promise<Metadata> {
  const seo = await getSeoForSlug(pageSlug);
  return buildMetadata({
    title: seo?.pageTitle ?? fallback.title,
    description: seo?.pageDescription ?? fallback.description,
    ogImage: seo?.ogImage ?? fallback.ogImage,
    canonicalUrl: seo?.canonicalUrl,
    noIndex: seo?.noIndex,
    keywords: seo?.keywords,
  });
}
