import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: Route;
}

/**
 * Breadcrumb trail (Home > Category > Page). The last item has no href — it's
 * the current page. The matching BreadcrumbList JSON-LD is built separately via
 * buildBreadcrumbSchema and injected with SchemaMarkup on the page.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-foreground" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="size-3.5" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
