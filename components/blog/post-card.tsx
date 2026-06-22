import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { formatDate, truncate } from "@/lib/client/utils";
import type { Post, PostListItem } from "@/types/content-types";

/**
 * Blog post preview card: cover image, category pill (links to category),
 * title (links to /blog/[slug]), excerpt, and published date.
 *
 * Accepts either a list-projection post or a full post. `compact` renders the
 * smaller variant used inside RelatedContent / tighter grids.
 */
export function PostCard({
  post,
  compact = false,
}: {
  post: PostListItem | Post;
  compact?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_8px_30px_-12px] hover:shadow-foreground/15">
      {post.coverImage && (
        <div className="relative block aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={urlFor(post.coverImage).width(640).height(360).fit("crop").url()}
            alt={post.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <Link
            href={`/category/${post.category.slug.current}`}
            className="relative z-10 inline-block self-start font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-gold-foreground"
          >
            {post.category.title}
          </Link>
        )}

        <h3 className="display-heading mt-2 text-lg font-semibold leading-snug">
          <Link
            href={`/blog/${post.slug.current}`}
            className="after:absolute after:inset-0 hover:text-foreground/80"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {truncate(post.excerpt, compact ? 90 : 160)}
        </p>

        <p className="mt-4 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="h-px w-4 bg-gold" aria-hidden="true" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
      </div>
    </article>
  );
}
