import type { Metadata } from "next";
import { sanityClient } from "@/sanity/lib/client";
import { getAllCategoriesQuery } from "@/lib/client/queries";
import { CategoryCard } from "@/components/category/category-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import type { Category } from "@/types/content-types";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("category", {
    title: "Browse AI Tools by Category",
    description:
      "Explore every AI tool category — chatbots, image and video generation, coding assistants, writing, marketing, automation, and more. Find the right tools and guides for your workflow.",
  });
}

export default async function CategoryIndexPage() {
  const categories =
    await sanityClient.fetch<Category[]>(getAllCategoriesQuery);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
      />

      <header className="mt-6">
        <p className="eyebrow">By the job to be done</p>
        <h1 className="display-heading mt-3 text-4xl font-semibold sm:text-5xl">
          Browse by Category
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Every AI tool and article on AIHuntr, grouped by what it helps you do.
          Pick a category to see its tools and guides.
        </p>
      </header>

      {categories.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Categories will appear here once they are added in Sanity.
        </p>
      )}
    </div>
  );
}
