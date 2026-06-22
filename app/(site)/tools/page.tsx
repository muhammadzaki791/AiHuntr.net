import type { Metadata } from "next";
import { Suspense } from "react";
import { sanityClient } from "@/sanity/lib/client";
import {
  getAllToolsQuery,
  getToolsByCategoryQuery,
  getAllCategoriesQuery,
} from "@/lib/client/queries";
import { ToolGrid } from "@/components/tools/tool-grid";
import { ToolFilterBar } from "@/components/tools/tool-filter-bar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import type { Category, ToolListItem } from "@/types/content-types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("tools", {
    title: "AI Tools Directory",
    description:
      "Browse and compare the best AI tools — chatbots, image generators, coding assistants, and more. Honest reviews and editorial ratings.",
  });
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [tools, categories] = await Promise.all([
    category
      ? sanityClient.fetch<ToolListItem[]>(getToolsByCategoryQuery, {
          categorySlug: category,
        })
      : sanityClient.fetch<ToolListItem[]>(getAllToolsQuery),
    sanityClient.fetch<Category[]>(getAllCategoriesQuery),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <header className="mt-6">
        <p className="eyebrow">The directory</p>
        <h1 className="display-heading mt-3 text-4xl font-semibold sm:text-5xl">
          AI Tools Directory
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Browse and compare the best AI tools. Filter by category to find the
          right one for your workflow.
        </p>
      </header>

      <div className="mt-8">
        {/* useSearchParams in the filter bar requires a Suspense boundary. */}
        <Suspense fallback={null}>
          <ToolFilterBar categories={categories} />
        </Suspense>
      </div>

      <div className="mt-8">
        <ToolGrid
          tools={tools}
          emptyMessage={
            category
              ? "No tools in this category yet."
              : "No tools have been added yet."
          }
        />
      </div>
    </div>
  );
}
