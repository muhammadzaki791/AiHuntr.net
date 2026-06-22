"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/lib/client/utils";

/**
 * Article Table of Contents. Renders a nested h2/h3 list of anchor links that
 * jump to the matching heading ids in the post body (ids are produced by
 * `slugifyHeading`, shared with the PortableText renderer). Native smooth
 * scroll + `scroll-mt-24` on the headings keeps targets clear of the sticky
 * header.
 *
 * Two presentations share one heading list:
 *  - `desktop` — a sticky sidebar rail (hidden below lg).
 *  - `mobile`  — a collapsible "On this page" card (hidden at lg and up).
 *
 * The active heading is tracked with an IntersectionObserver and highlighted.
 */
export function TableOfContents({
  headings,
  variant,
}: {
  headings: TocHeading[];
  variant: "desktop" | "mobile";
}) {
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) return null;

  const list = (
    <ul className="space-y-1 text-sm">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;
        return (
          <li key={heading.id} className={cn(heading.level === 3 && "ml-3")}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block border-l-2 py-1 pl-3 leading-snug transition-colors",
                isActive
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "desktop") {
    return (
      <nav
        aria-label="Table of contents"
        className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
      >
        <p className="eyebrow mb-3">On this page</p>
        {list}
      </nav>
    );
  }

  return <MobileToc list={list} />;
}

function MobileToc({ list }: { list: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-lg border border-border lg:hidden"
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
      >
        <span>On this page</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && <div className="px-4 pb-4">{list}</div>}
    </nav>
  );
}

/**
 * Returns the id of the heading currently in view. Observes every heading and
 * tracks the topmost one that is intersecting the upper region of the viewport.
 */
function useActiveHeading(headings: TocHeading[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Highlight the first heading (in document order) that is in view.
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) setActiveId(firstVisible.id);
      },
      // Trip the line near the top of the viewport so the active item updates
      // as a section scrolls past the header rather than only at the bottom.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}
