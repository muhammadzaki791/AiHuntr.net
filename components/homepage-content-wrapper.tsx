import Link from "next/link";
import { FadeIn } from "@/lib/animations";
import { siteConfig } from "@/lib/config/site";
import { sanityClient } from "@/sanity/lib/client";
import { getHomepageContentQuery } from "@/lib/client/queries";
import { ToolGrid } from "@/components/tools/tool-grid";
import { PostGrid } from "@/components/blog/post-grid";
import { CategoryCard } from "@/components/category/category-card";
import { SearchBar } from "@/components/search/search-bar";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { SchemaMarkup } from "@/components/shared/schema-markup";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import type { HomepageContent } from "@/types/content-types";

/**
 * Homepage orchestrator (server component). Fetches getHomepageContentQuery and
 * renders the section stack. Featured tools, categories, and latest posts are
 * live; the newsletter CTA (Phase 6) remains a placeholder.
 */
export async function HomepageContentWrapper() {
  const { featuredTools, categories, latestPosts } =
    await sanityClient.fetch<HomepageContent>(getHomepageContentQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <SchemaMarkup
        schema={[
          buildOrganizationSchema(),
          buildWebSiteSchema(),
          buildWebPageSchema({
            name: `${siteConfig.name} — Best AI Tools`,
            description: siteConfig.description,
          }),
        ]}
      />
      {/* 1. Hero */}
      <section className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
        <p className="eyebrow">Independent AI tool reviews</p>
        <h1 className="display-heading max-w-3xl text-balance text-4xl font-semibold sm:text-6xl">
          Find the right AI tool,{" "}
          <span className="italic text-gold-foreground">faster</span>.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="w-full max-w-md">
          <SearchBar />
        </div>
        <Link
          href="/tools"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          Browse Tools
        </Link>
      </section>

      {/* 2. Featured tools */}
      <FadeIn>
        <section className="py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Editor&rsquo;s picks</p>
              <h2 className="display-heading mt-3 text-2xl font-semibold sm:text-3xl">
                Featured Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6">
            <ToolGrid
              tools={featuredTools}
              emptyMessage="Top-rated AI tools will appear here once content is added in Sanity."
            />
          </div>
        </section>
      </FadeIn>

      {/* 3. Category quick-links — top categories; full list at /category */}
      <FadeIn>
        <section className="py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">By the job to be done</p>
              <h2 className="display-heading mt-3 text-2xl font-semibold sm:text-3xl">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/category"
              className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Category links will appear here.
            </p>
          )}
        </section>
      </FadeIn>

      {/* 4. Latest posts */}
      <FadeIn>
        <section className="py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Guides &amp; comparisons</p>
              <h2 className="display-heading mt-3 text-2xl font-semibold sm:text-3xl">
                Latest Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="shrink-0 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          <div className="mt-6">
            <PostGrid
              posts={latestPosts}
              emptyMessage="Recent blog posts will appear here once content is added in Sanity."
            />
          </div>
        </section>
      </FadeIn>

      {/* 5. Newsletter CTA */}
      <FadeIn>
        <section className="py-12 pb-20">
          <NewsletterSection variant="default" source="Homepage" />
        </section>
      </FadeIn>
    </div>
  );
}
