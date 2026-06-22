"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/content-types";

/**
 * Category filter for the /tools page. Renders an "All" option plus a button
 * per category; clicking updates the `?category=` URL search param. The active
 * category is highlighted. The page re-fetches server-side from the new param.
 */
export function ToolFilterBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function select(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(query ? `/tools?${query}` : "/tools");
  }

  const baseBtn =
    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tools by category">
      <button
        type="button"
        onClick={() => select(null)}
        aria-pressed={!active}
        className={cn(
          baseBtn,
          !active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        All
      </button>
      {categories.map((category) => {
        const isActive = active === category.slug.current;
        return (
          <button
            key={category._id}
            type="button"
            onClick={() => select(category.slug.current)}
            aria-pressed={isActive}
            className={cn(
              baseBtn,
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {category.title}
          </button>
        );
      })}
    </div>
  );
}
