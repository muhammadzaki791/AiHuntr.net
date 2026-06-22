import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/lib/client";
import {
  getCategoryBySlugQuery,
  getAllCategorySlugsQuery,
} from "@/lib/client/queries";
import { ToolGrid } from "@/components/tools/tool-grid";
import { PostGrid } from "@/components/blog/post-grid";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { SchemaMarkup } from "@/components/shared/schema-markup";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import type { CategoryWithContent } from "@/types/content-types";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    getAllCategorySlugsQuery,
  );
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityClient.fetch<CategoryWithContent | null>(
    getCategoryBySlugQuery,
    { slug },
  );

  if (!category) return {};

  return buildMetadataForSlug(`category/${slug}`, {
    title: `${category.title} — AI Tools & Articles`,
    description:
      category.description ??
      `Browse the best ${category.title} — reviews, comparisons, and guides.`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await sanityClient.fetch<CategoryWithContent | null>(
    getCategoryBySlugQuery,
    { slug },
  );

  if (!category) notFound();

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: category.title },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SchemaMarkup schema={buildBreadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {category.title}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        )}
      </header>

      <section className="mt-10" aria-labelledby="category-tools-heading">
        <h2
          id="category-tools-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Tools
        </h2>
        <div className="mt-6">
          <ToolGrid
            tools={category.tools}
            emptyMessage="No tools in this category yet."
          />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="category-posts-heading">
        <h2
          id="category-posts-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Articles
        </h2>
        <div className="mt-6">
          <PostGrid
            posts={category.posts}
            emptyMessage="No articles in this category yet."
          />
        </div>
      </section>
    </div>
  );
}
