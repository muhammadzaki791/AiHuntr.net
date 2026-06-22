import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { getSearchResultsQuery } from "@/lib/client/queries";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { truncate } from "@/lib/client/utils";
import type { Route } from "next";
import type { SearchResult } from "@/types/content-types";

export const metadata: Metadata = {
  title: "Search",
  description: "Search AI tools and articles.",
  // Search-result pages shouldn't be indexed (thin/duplicate content).
  robots: { index: false, follow: true },
};

function resultHref(result: SearchResult): Route {
  return (
    result._type === "tool"
      ? `/tools/${result.slug.current}`
      : `/blog/${result.slug.current}`
  ) as Route;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";

  const results =
    term.length >= 2
      ? await sanityClient.fetch<SearchResult[]>(getSearchResultsQuery, {
          searchTerm: term,
        })
      : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {term ? `Search results for “${term}”` : "Search"}
        </h1>
        {term && (
          <p className="mt-2 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} found.
          </p>
        )}
      </header>

      <div className="mt-8">
        {!term ? (
          <p className="text-sm text-muted-foreground">
            Enter a search term to find tools and articles.
          </p>
        ) : results.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No results found for “{term}”.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try browsing all{" "}
              <Link
                href="/tools"
                className="underline underline-offset-4 hover:text-foreground"
              >
                tools
              </Link>{" "}
              or the{" "}
              <Link
                href="/blog"
                className="underline underline-offset-4 hover:text-foreground"
              >
                blog
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {results.map((result) => (
              <li key={result._id}>
                <Link
                  href={resultHref(result)}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                >
                  <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {result._type === "tool" ? "Tool" : "Article"}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{result.title}</span>
                    {result.description && (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {truncate(result.description, 140)}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
