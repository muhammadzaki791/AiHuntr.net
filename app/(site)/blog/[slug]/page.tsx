import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityClient } from "@/sanity/lib/client";
import {
  getPostBySlugQuery,
  getAllPostSlugsQuery,
} from "@/lib/client/queries";
import { urlFor } from "@/sanity/lib/image";
import { PostContent } from "@/components/blog/post-content";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { RelatedContent } from "@/components/shared/related-content";
import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { SchemaMarkup } from "@/components/shared/schema-markup";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  buildArticleSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/schema";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { formatDate, extractHeadings } from "@/lib/client/utils";
import type { Post } from "@/types/content-types";

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    getAllPostSlugsQuery,
  );
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<Post | null>(getPostBySlugQuery, {
    slug,
  });

  if (!post) return {};

  return buildMetadataForSlug(`blog/${slug}`, {
    title: post.title,
    description: post.excerpt,
    ogImage: post.coverImage,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityClient.fetch<Post | null>(getPostBySlugQuery, {
    slug,
  });

  if (!post) notFound();

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category
      ? [
          {
            label: post.category.title,
            href: `/category/${post.category.slug.current}` as Route,
          },
        ]
      : []),
    { label: post.title },
  ];

  const schema = [
    buildArticleSchema(post),
    ...(post.faqs?.length ? [buildFaqSchema(post.faqs)] : []),
    buildBreadcrumbSchema(crumbs),
  ];

  const headings = extractHeadings(post.body);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SchemaMarkup schema={schema} />
      <Breadcrumbs items={crumbs} />

      <header className="mt-6">
        {post.category && (
          <Link
            href={`/category/${post.category.slug.current}`}
            className="eyebrow hover:text-foreground"
          >
            {post.category.title}
          </Link>
        )}
        <h1 className="display-heading mt-3 text-3xl font-semibold sm:text-[2.5rem] sm:leading-[1.1]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt && (
            <span>· Updated {formatDate(post.updatedAt)}</span>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="mt-6 overflow-hidden rounded-lg bg-muted">
          <Image
            src={urlFor(post.coverImage).width(1200).height(675).fit("crop").url()}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Ad slot — top of post, below the cover image */}
      <AdSlot slot="blog-top" className="mt-8" />

      <div className="mt-8 lg:flex lg:gap-10">
        <div className="min-w-0 lg:flex-1">
          {headings.length > 0 && (
            <TableOfContents headings={headings} variant="mobile" />
          )}

          <div className="mt-6 lg:mt-0">
            <PostContent
              value={post.body}
              midContent={<AdSlot slot="blog-in-content" />}
            />
          </div>

          {post.faqs?.length > 0 && (
            <section aria-labelledby="faq-heading" className="mt-12">
              <p className="eyebrow">Good to know</p>
              <h2
                id="faq-heading"
                className="display-heading mt-3 text-2xl font-semibold sm:text-3xl"
              >
                Frequently Asked Questions
              </h2>
              <div className="mt-4">
                <FaqAccordion faqs={post.faqs} />
              </div>
            </section>
          )}

          <div className="mt-12">
            <RelatedContent
              tools={post.relatedTools}
              posts={post.relatedPosts}
            />
          </div>
        </div>

        {headings.length > 0 && (
          <aside className="hidden lg:block lg:w-60 lg:shrink-0">
            <TableOfContents headings={headings} variant="desktop" />
          </aside>
        )}
      </div>
    </article>
  );
}
