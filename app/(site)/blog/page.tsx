import type { Metadata } from "next";
import { Suspense } from "react";
import { sanityClient } from "@/sanity/lib/client";
import {
  getAllPostsQuery,
  getPostsByCategoryQuery,
  getAllCategoriesQuery,
} from "@/lib/client/queries";
import { PostGrid } from "@/components/blog/post-grid";
import { PostFilterBar } from "@/components/blog/post-filter-bar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import type { Category, PostListItem } from "@/types/content-types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("blog", {
    title: "Blog & AI Tool Comparisons",
    description:
      "In-depth comparisons, guides, and reviews of the best AI tools — tested and ranked to help you pick the right one.",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [posts, categories] = await Promise.all([
    category
      ? sanityClient.fetch<PostListItem[]>(getPostsByCategoryQuery, {
          categorySlug: category,
        })
      : sanityClient.fetch<PostListItem[]>(getAllPostsQuery),
    sanityClient.fetch<Category[]>(getAllCategoriesQuery),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <header className="mt-6">
        <p className="eyebrow">Guides &amp; comparisons</p>
        <h1 className="display-heading mt-3 text-4xl font-semibold sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Comparisons, guides, and reviews to help you choose the right AI tool.
          Filter by category to narrow things down.
        </p>
      </header>

      <div className="mt-8">
        {/* useSearchParams in the filter bar requires a Suspense boundary. */}
        <Suspense fallback={null}>
          <PostFilterBar categories={categories} />
        </Suspense>
      </div>

      <div className="mt-8">
        <PostGrid
          posts={posts}
          emptyMessage={
            category
              ? "No posts in this category yet."
              : "No posts have been published yet."
          }
        />
      </div>
    </div>
  );
}
