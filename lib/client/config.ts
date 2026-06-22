/**
 * Sanity client config for CLIENT-SIDE reads (the debounced search bar).
 * `useCdn: false` keeps search results fresh. Page-level server components use
 * the separate CDN-enabled client in `sanity/lib/client.ts`.
 */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
} as const;
