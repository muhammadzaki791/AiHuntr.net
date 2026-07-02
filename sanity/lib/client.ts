import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Server-side Sanity client with `useCdn: true` for cached production reads.
 * Used by all page-level server components (homepage, tools, posts, categories).
 *
 * A read token is attached when available so private datasets resolve. The
 * `published` perspective is pinned unconditionally so unpublished drafts (e.g.
 * a post edited under a new slug, or a tool awaiting a logo) can never leak onto
 * the public site — they'd otherwise surface as duplicate title/content pages.
 * This also excludes drafts from generateStaticParams / sitemap and stops weak
 * references from resolving to draft-only documents. Pinning it regardless of
 * the token means the guarantee holds even in deploy environments where
 * SANITY_API_READ_TOKEN is unset (the token only gates private-dataset access,
 * not draft visibility). Server-only — never import into a "use client" module.
 */
const readToken = process.env.SANITY_API_READ_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: readToken,
  perspective: "published",
});
