import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Server-side Sanity client with `useCdn: true` for cached production reads.
 * Used by all page-level server components (homepage, tools, posts, categories).
 *
 * A read token is attached when available so private/draft datasets resolve;
 * this client is server-only — never import it into a "use client" module.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});
