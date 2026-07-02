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
  /** OpenGraph type — "article" for posts, "website" otherwise (default). */
  ogType?: "website" | "article";
  /** Article-only OG fields (ISO strings). Ignored unless ogType === "article". */
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Absolute URL to the dynamic OG image generator (app/api/og). Every page's
 * social image is composed here: the page title over a dark-toned background
 * (the content's own image when one exists, otherwise a branded gradient).
 * Centralizing this means no page ships without a share image.
 */
export function buildOgImageUrl(title: string, bgImageUrl?: string): string {
  const params = new URLSearchParams({ title });
  if (bgImageUrl) params.set("image", bgImageUrl);
  return `${siteConfig.url}/api/og?${params.toString()}`;
}

/**
 * Resolve a self-referencing canonical URL from a page slug. `pageSlug` mirrors
 * the route path ("home" → "/", "tools/chatgpt" → "/tools/chatgpt"), so faceted
 * variants like /blog?category=x still canonicalize to their clean path.
 */
export function canonicalForSlug(pageSlug: string): string {
  const path = pageSlug === "home" ? "" : `/${pageSlug}`;
  return `${siteConfig.url}${path}`;
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
  ogType = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  // Background for the OG composition: an explicit URL, or a cropped Sanity
  // render. The generator overlays the title and darkens it either way.
  const bgImageUrl =
    typeof ogImage === "string"
      ? ogImage
      : ogImage
        ? urlFor(ogImage).width(1200).height(630).fit("crop").url()
        : undefined;

  const ogImageUrl = buildOgImageUrl(title, bgImageUrl);

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
      locale: "en_US",
      type: ogType,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(ogType === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {}),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/** Fetch the SEO doc for a page slug (e.g. "tools/chatgpt"), or null. */
export async function getSeoForSlug(pageSlug: string): Promise<SeoDoc | null> {
  return sanityClient.fetch<SeoDoc | null>(getSeoByPageSlugQuery, { pageSlug });
}

/**
 * Convenience: resolve metadata for a page from its SEO doc with fallbacks.
 * `fallback` supplies title/description/ogImage when no SEO doc exists. A
 * self-referencing canonical is derived from `pageSlug` unless the SEO doc
 * overrides it.
 */
export async function buildMetadataForSlug(
  pageSlug: string,
  fallback: {
    title: string;
    description: string;
    ogImage?: SeoDoc["ogImage"] | string;
    ogType?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
  },
): Promise<Metadata> {
  const seo = await getSeoForSlug(pageSlug);
  return buildMetadata({
    title: seo?.pageTitle ?? fallback.title,
    description: seo?.pageDescription ?? fallback.description,
    ogImage: seo?.ogImage ?? fallback.ogImage,
    canonicalUrl: seo?.canonicalUrl ?? canonicalForSlug(pageSlug),
    noIndex: seo?.noIndex,
    keywords: seo?.keywords,
    ogType: fallback.ogType,
    publishedTime: fallback.publishedTime,
    modifiedTime: fallback.modifiedTime,
  });
}
