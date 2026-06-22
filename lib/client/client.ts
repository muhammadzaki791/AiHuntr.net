import { createClient, type SanityClient } from "@sanity/client";
import { sanityConfig } from "./config";

/**
 * Sanity client factory.
 *
 * - Default (no token): a read client used for client-side, always-fresh reads
 *   such as the debounced search bar.
 * - With a `token`: a write/authenticated client used by server-only mutations
 *   (e.g. the newsletter subscribe API route). Never pass the write token to a
 *   client component — keep it on the server.
 */
export function getClient(token?: string): SanityClient {
  return createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: sanityConfig.useCdn,
    token,
    // Required for mutations against datasets that aren't public-write.
    ...(token ? { perspective: "published" as const } : {}),
  });
}

/** Default read client (no token) for client-side search reads. */
export const readClient = getClient(process.env.SANITY_API_READ_TOKEN);
