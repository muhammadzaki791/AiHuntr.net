import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { StarRating } from "@/components/shared/star-rating";
import { formatRating, truncate } from "@/lib/client/utils";
import type { Tool, ToolListItem } from "@/types/content-types";

/**
 * Tool card: logo, title, short description, category pill (links to category),
 * star rating, pricing badge, and a "Read Review" link to /tools/[slug].
 *
 * The gold score stamp in the top-right is the recurring brand mark — it ties
 * the card back to the star-rating system and to the site's one accent.
 *
 * Accepts either a list-projection tool or a full tool. `compact` renders the
 * smaller variant used inside RelatedContent.
 */
export function ToolCard({
  tool,
  compact = false,
}: {
  tool: ToolListItem | Tool;
  compact?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_8px_30px_-12px] hover:shadow-foreground/15">
      {/* Gold score stamp — the signature mark */}
      <div className="absolute right-4 top-4 flex flex-col items-end">
        <span className="score-stamp text-base">{formatRating(tool.rating)}</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
          / 5
        </span>
      </div>

      <div className="flex items-start gap-3 pr-12">
        {tool.logo && (
          <Image
            src={urlFor(tool.logo).width(96).height(96).fit("max").url()}
            alt={`${tool.title} logo`}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-lg border border-border/60 bg-background object-contain p-1"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="display-heading truncate text-lg font-semibold">
            <Link
              href={`/tools/${tool.slug.current}`}
              className="after:absolute after:inset-0 hover:text-foreground/80"
            >
              {tool.title}
            </Link>
          </h3>
          {tool.category && (
            <Link
              href={`/category/${tool.category.slug.current}`}
              className="relative z-10 mt-1.5 inline-block font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-gold-foreground"
            >
              {tool.category.title}
            </Link>
          )}
        </div>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {truncate(tool.shortDescription, compact ? 90 : 140)}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/70 pt-4">
        <StarRating rating={tool.rating} showValue={false} />
        <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
          {tool.pricingModel}
        </span>
      </div>

      <span className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
        Read review
        <ArrowUpRight
          className="size-4 text-gold-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </article>
  );
}
