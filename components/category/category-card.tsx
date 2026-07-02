import Link from "next/link";
import { CategoryIcon } from "@/components/category/category-icon";
import type { Category } from "@/types/content-types";

/**
 * Shared category card — used by the homepage "Browse by Category" grid and the
 * /category index page. Renders the lucide icon, title, description, and (when
 * available) the number of tools + posts in the category.
 */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug.current}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_8px_30px_-12px] hover:shadow-foreground/15"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-gold-foreground">
          <CategoryIcon name={category.icon} className="size-5" />
        </span>
        <p className="display-heading text-lg font-semibold transition-colors group-hover:text-gold-foreground">
          {category.title}
        </p>
      </div>
      {category.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      )}
      {typeof category.count === "number" && (
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {category.count} {category.count === 1 ? "item" : "items"}
        </p>
      )}
    </Link>
  );
}
