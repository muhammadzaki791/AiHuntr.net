import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { StarRating } from "@/components/shared/star-rating";
import { ProsConsList } from "@/components/shared/pros-cons-list";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { RelatedContent } from "@/components/shared/related-content";
import { PortableTextRenderer } from "@/components/shared/portable-text";
import { AffiliateCtaButton } from "./affiliate-cta-button";
import { AdSlot } from "@/components/ads/ad-slot";
import type { Tool } from "@/types/content-types";

/**
 * Full tool review layout (server component). Sections in order:
 * header → ad slot → overview → pricing → pros/cons → use cases → FAQ →
 * bottom affiliate CTA → related content. JSON-LD is injected by the page.
 */
export function ToolDetail({ tool }: { tool: Tool }) {
  const ctaLabel = `Try ${tool.title}`;

  return (
    <div className="space-y-12">
      {/* 1. Header */}
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          {tool.logo && (
            <Image
              src={urlFor(tool.logo).width(160).height(160).fit("max").url()}
              alt={`${tool.title} logo`}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-lg object-contain"
            />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="display-heading text-3xl font-semibold sm:text-4xl">
                {tool.title}
              </h1>
              {tool.category && (
                <Link
                  href={`/category/${tool.category.slug.current}`}
                  className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-gold-foreground"
                >
                  {tool.category.title}
                </Link>
              )}
            </div>
            {tool.tagline && (
              <p className="mt-2 text-lg text-muted-foreground">{tool.tagline}</p>
            )}
            <div className="mt-3 flex items-center gap-4">
              <StarRating rating={tool.rating} />
              <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
                {tool.pricingModel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
          <AffiliateCtaButton
            affiliateSlug={tool.affiliateSlug}
            label={ctaLabel}
            variant="primary"
          />
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            Visit Official Site
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Ad slot — top of page, below header */}
      <AdSlot slot="tool-page-top" />

      {/* 2. Overview */}
      <section aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="display-heading text-2xl font-semibold sm:text-3xl"
        >
          Overview
        </h2>
        <div className="mt-2">
          <PortableTextRenderer value={tool.overview} />
        </div>
      </section>

      {/* 3. Pricing */}
      <section aria-labelledby="pricing-heading">
        <h2
          id="pricing-heading"
          className="display-heading text-2xl font-semibold sm:text-3xl"
        >
          Pricing
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tool.pricingPlans.map((plan) => (
            <div
              key={plan.planName}
              className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/15"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
                {plan.planName}
              </p>
              <p className="display-heading mt-1 text-2xl font-semibold">
                {plan.price}
              </p>
              {plan.features?.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Pros & Cons */}
      <section aria-labelledby="proscons-heading">
        <h2
          id="proscons-heading"
          className="display-heading text-2xl font-semibold sm:text-3xl"
        >
          Pros &amp; Cons
        </h2>
        <div className="mt-4">
          <ProsConsList pros={tool.pros} cons={tool.cons} />
        </div>
      </section>

      {/* 5. Use cases */}
      <section aria-labelledby="usecases-heading">
        <h2
          id="usecases-heading"
          className="display-heading text-2xl font-semibold sm:text-3xl"
        >
          Use Cases
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tool.useCases.map((useCase) => (
            <li
              key={useCase}
              className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground"
            >
              {useCase}
            </li>
          ))}
        </ul>
      </section>

      {/* 6. FAQ */}
      {tool.faqs?.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="display-heading text-2xl font-semibold sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FaqAccordion faqs={tool.faqs} />
          </div>
        </section>
      )}

      {/* 7. Secondary affiliate CTA */}
      <section className="relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-8 text-center">
        <span
          className="absolute inset-x-0 top-0 h-0.5 bg-gold"
          aria-hidden="true"
        />
        <h2 className="display-heading text-2xl font-semibold">
          Ready to try {tool.title}?
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {tool.shortDescription}
        </p>
        <AffiliateCtaButton
          affiliateSlug={tool.affiliateSlug}
          label={ctaLabel}
          variant="primary"
        />
      </section>

      {/* 8. Related content */}
      <RelatedContent tools={tool.relatedTools} posts={tool.relatedPosts} />
    </div>
  );
}
