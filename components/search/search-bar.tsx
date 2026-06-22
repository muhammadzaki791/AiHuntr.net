"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { Search } from "lucide-react";
import { readClient } from "@/lib/client";
import { getSearchResultsQuery } from "@/lib/client/queries";
import { truncate } from "@/lib/client/utils";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/content-types";

/**
 * Live search with a 300ms debounce — the ONLY client-side Sanity fetch in the
 * app. Shows a dropdown of mixed tool/post results with a type badge; pressing
 * Enter or clicking "View all results" navigates to /search?q=…. Closes on
 * click-outside and on navigation.
 */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fetch: wait 300ms after the last keystroke before querying. All
  // state updates live inside the timer callback (not the effect body) to avoid
  // synchronous cascading renders.
  useEffect(() => {
    const term = query.trim();
    const timer = setTimeout(async () => {
      if (term.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await readClient.fetch<SearchResult[]>(
          getSearchResultsQuery,
          { searchTerm: term },
        );
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click-outside detection closes the dropdown.
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goToResults() {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    goToResults();
  }

  function href(result: SearchResult): Route {
    return (
      result._type === "tool"
        ? `/tools/${result.slug.current}`
        : `/blog/${result.slug.current}`
    ) as Route;
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={onSubmit} role="search">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search tools and articles…"
            aria-label="Search tools and articles"
            className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground/30"
          />
        </div>
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No results for “{query.trim()}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <li key={result._id}>
                  <Link
                    href={href(result)}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <span className="mt-0.5 shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {result._type === "tool" ? "Tool" : "Article"}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {result.title}
                      </span>
                      {result.description && (
                        <span className="block text-xs text-muted-foreground">
                          {truncate(result.description, 80)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={goToResults}
            className="block w-full border-t border-border px-4 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            View all results for “{query.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
