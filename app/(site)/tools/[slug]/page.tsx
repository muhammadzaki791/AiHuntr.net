import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/lib/client";
import {
  getToolBySlugQuery,
  getAllToolSlugsQuery,
} from "@/lib/client/queries";
import { ToolDetail } from "@/components/tools/tool-detail";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { SchemaMarkup } from "@/components/shared/schema-markup";
import {
  buildReviewSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import type { Tool } from "@/types/content-types";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    getAllToolSlugsQuery,
  );
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = await sanityClient.fetch<Tool | null>(getToolBySlugQuery, {
    slug,
  });

  if (!tool) return {};

  return buildMetadataForSlug(`tools/${slug}`, {
    title: `${tool.title} Review`,
    description: tool.tagline ?? tool.shortDescription,
    ogImage: tool.logo,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await sanityClient.fetch<Tool | null>(getToolBySlugQuery, {
    slug,
  });

  if (!tool) notFound();

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    ...(tool.category
      ? [
          {
            label: tool.category.title,
            href: `/category/${tool.category.slug.current}` as Route,
          },
        ]
      : []),
    { label: tool.title },
  ];

  const schema = [
    buildReviewSchema(tool),
    ...(tool.faqs?.length ? [buildFaqSchema(tool.faqs)] : []),
    buildBreadcrumbSchema(crumbs),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SchemaMarkup schema={schema} />
      <Breadcrumbs items={crumbs} />
      <div className="mt-6">
        <ToolDetail tool={tool} />
      </div>
    </div>
  );
}
