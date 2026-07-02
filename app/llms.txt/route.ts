import { siteConfig } from "@/lib/config/site";
import { sanityClient } from "@/sanity/lib/client";
import { getLlmsIndexQuery } from "@/lib/client/queries";

/**
 * /llms.txt — a curated, Markdown-formatted map of the site for large language
 * models (the emerging llms.txt convention). Unlike robots.txt it guides rather
 * than blocks: it hands AI answer engines a concise, link-rich index of our
 * best content so they can cite AIHuntr accurately without wading through
 * nav/ads/JS. Built dynamically from published Sanity content (same server
 * client as the sitemap, so drafts are excluded) — no manual upkeep as tools,
 * posts, and categories are added.
 */

interface Entry {
  title: string;
  slug: string;
  summary?: string;
}

interface LlmsIndex {
  tools: Entry[];
  posts: Entry[];
  categories: Entry[];
}

// Revalidate daily — content changes rarely enough that a stale-by-a-day index
// is fine, and it keeps this off the request hot path.
export const revalidate = 86400;

/** Collapse whitespace/newlines so each entry stays on a single Markdown line. */
function oneLine(text?: string): string {
  return text ? text.replace(/\s+/g, " ").trim() : "";
}

function section(
  heading: string,
  pathPrefix: string,
  entries: Entry[],
): string {
  if (entries.length === 0) return "";
  const lines = entries.map(({ title, slug, summary }) => {
    const url = `${siteConfig.url}${pathPrefix}/${slug}`;
    const desc = oneLine(summary);
    return `- [${title}](${url})${desc ? `: ${desc}` : ""}`;
  });
  return `## ${heading}\n\n${lines.join("\n")}\n`;
}

export async function GET() {
  const { tools, posts, categories } =
    await sanityClient.fetch<LlmsIndex>(getLlmsIndexQuery);

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    section("Tools", "/tools", tools),
    section("Guides & Comparisons", "/blog", posts),
    section("Categories", "/category", categories),
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
