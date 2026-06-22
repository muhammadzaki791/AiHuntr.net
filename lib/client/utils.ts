import type { PortableTextBlock } from "@portabletext/types";

/**
 * Data transformation helpers for Sanity content.
 */

/** Format an ISO datetime as a readable date, e.g. "June 16, 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Truncate a string to `max` chars on a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** Render a 1–5 rating as filled/empty star characters plus the numeric value. */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Extract plain text from portable-text blocks (for reading-time estimates or
 * description fallbacks). Ignores non-text block types.
 */
export function portableTextToPlain(blocks: PortableTextBlock[] = []): string {
  return blocks
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map((block) =>
      (block.children as { text?: string }[])
        .map((child) => child.text ?? "")
        .join(""),
    )
    .join("\n\n");
}

/** Stable id for headings/anchors from a heading's text content. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** A heading extracted from a post body, for building a table of contents. */
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract h2/h3 headings (in document order) from portable-text blocks so a
 * Table of Contents can link to them. Ids are produced with `slugifyHeading`
 * so they match the anchor ids rendered by the PortableText components.
 */
export function extractHeadings(blocks: PortableTextBlock[] = []): TocHeading[] {
  return blocks
    .filter(
      (block) =>
        block._type === "block" &&
        (block.style === "h2" || block.style === "h3") &&
        Array.isArray(block.children),
    )
    .map((block) => {
      const text = (block.children as { text?: string }[])
        .map((child) => child.text ?? "")
        .join("")
        .trim();
      return {
        id: slugifyHeading(text),
        text,
        level: (block.style === "h2" ? 2 : 3) as 2 | 3,
      };
    })
    .filter((heading) => heading.text.length > 0);
}
