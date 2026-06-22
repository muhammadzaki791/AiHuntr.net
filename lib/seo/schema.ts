import { siteConfig } from "@/lib/config/site";
import { urlFor } from "@/sanity/lib/image";
import { portableTextToPlain, truncate } from "@/lib/client/utils";
import type { Post, Tool, Faq } from "@/types/content-types";

/**
 * Pure builders that return JSON-LD objects. Rendered via the SchemaMarkup
 * component. Tool pages inject Review + FAQPage + BreadcrumbList; post pages
 * inject Article + FAQPage + BreadcrumbList.
 */

type Json = Record<string, unknown>;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Article schema for a blog post. */
export function buildArticleSchema(post: Post): Json {
  const image = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    ...(image ? { image: [image] } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug.current}`,
    },
  };
}

/** Review schema for a tool review. */
export function buildReviewSchema(tool: Tool): Json {
  const image = tool.logo
    ? urlFor(tool.logo).width(512).height(512).url()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: tool.title,
      applicationCategory: tool.category?.title ?? "AI Tool",
      ...(image ? { image } : {}),
      ...(tool.officialUrl ? { url: tool.officialUrl } : {}),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: tool.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: `${tool.title} Review`,
    reviewBody: truncate(portableTextToPlain(tool.overview), 500),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

/** FAQPage schema from an array of {question, answer}. */
export function buildFaqSchema(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** BreadcrumbList schema from an ordered list of crumbs. */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: `${siteConfig.url}${item.href}` }
        : {}),
    })),
  };
}
