import { siteConfig } from "@/lib/config/site";
import { urlFor } from "@/sanity/lib/image";
import { portableTextToPlain, truncate } from "@/lib/client/utils";
import type {
  Post,
  Tool,
  Faq,
  Author,
  PricingPlan,
} from "@/types/content-types";

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

/** Publisher Organization node, reused across Article/Review. */
const organizationNode: Json = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
};

/**
 * Author node for Article/Review. Emits a Person (with credentials/sameAs) when
 * a real author is attached; otherwise falls back to the Organization. This is
 * the E-E-A-T signal — richer when an author document exists.
 */
function authorNode(author?: Author): Json {
  if (!author?.name) return organizationNode;
  return {
    "@type": "Person",
    name: author.name,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.url ? { url: author.url } : {}),
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
  };
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
    author: authorNode(post.author),
    publisher: organizationNode,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug.current}`,
    },
  };
}

/**
 * Parse a pricing-plan price string ("$0", "$20/month", "$30/user/month") into
 * a numeric amount for schema.org Offer. Returns null when no number is found
 * (e.g. "Custom" / "Contact us") so those plans are simply omitted.
 */
function parsePriceAmount(price: string): number | null {
  const match = price.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

/**
 * Build an `offers` value for a SoftwareApplication from its pricing plans.
 * A single plan → one Offer; multiple → an AggregateOffer with low/high price.
 * Returns null when no plan has a parseable price, so the field is omitted
 * rather than emitted empty (which would re-trip validation).
 */
function buildOffers(plans: PricingPlan[] = []): Json | null {
  const priced = plans
    .map((plan) => ({ plan, amount: parsePriceAmount(plan.price) }))
    .filter((p): p is { plan: PricingPlan; amount: number } => p.amount !== null);

  if (priced.length === 0) return null;

  const currency = "USD";
  if (priced.length === 1) {
    return {
      "@type": "Offer",
      price: priced[0].amount,
      priceCurrency: currency,
      ...(priced[0].plan.planName ? { name: priced[0].plan.planName } : {}),
    };
  }

  const amounts = priced.map((p) => p.amount);
  return {
    "@type": "AggregateOffer",
    priceCurrency: currency,
    lowPrice: Math.min(...amounts),
    highPrice: Math.max(...amounts),
    offerCount: priced.length,
  };
}

/**
 * Review schema for a tool review. The reviewed item is a self-contained
 * SoftwareApplication carrying `offers` (from pricing plans) and a nested
 * editorial `review` with our rating — both required by Google for this type.
 */
export function buildReviewSchema(tool: Tool): Json {
  const image = tool.logo
    ? urlFor(tool.logo).width(512).height(512).url()
    : undefined;

  const offers = buildOffers(tool.pricingPlans);

  // The editorial review node, reused as the nested `review` on the app and as
  // the top-level Review. Only carries a rating when one exists — an undefined
  // ratingValue is an invalid Rating and trips Rich Results validation.
  const reviewNode: Json = {
    "@type": "Review",
    name: `${tool.title} Review`,
    reviewBody: truncate(portableTextToPlain(tool.overview), 500),
    author: authorNode(tool.author),
    publisher: organizationNode,
    ...(typeof tool.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: tool.rating,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: tool.category?.title ?? "AI Tool",
    operatingSystem: "Web",
    ...(image ? { image } : {}),
    ...(tool.officialUrl ? { url: tool.officialUrl } : {}),
    ...(offers ? { offers } : {}),
    // aggregateRating satisfies Google's "aggregateRating or review" requirement
    // and renders the star snippet. ratingCount must be ≥1; this is our single
    // editorial score, so count = 1.
    ...(typeof tool.rating === "number"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.rating,
            bestRating: 5,
            worstRating: 1,
            ratingCount: 1,
          },
        }
      : {}),
    review: reviewNode,
  };
}

/**
 * Sitewide Organization node — identity for the knowledge graph. Rendered once
 * on the homepage.
 */
export function buildOrganizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/**
 * WebSite node with a SearchAction — enables the sitelinks search box in
 * Google. Rendered once on the homepage.
 */
export function buildWebSiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * WebPage node — describes an individual page and ties it back to the site's
 * WebSite node via isPartOf. Keeps the entity graph complete for pages that
 * don't already emit a richer primary type (Article/Review).
 */
export function buildWebPageSchema(input: {
  name: string;
  description: string;
  path?: string;
}): Json {
  const url = `${siteConfig.url}${input.path ?? ""}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
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
