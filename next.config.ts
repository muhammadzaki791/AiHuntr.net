import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists in the parent dir).
  turbopack: { root: process.cwd() },
  // All routes now exist, so statically-typed routes are enabled to catch
  // broken internal links at build time.
  typedRoutes: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Canonicalize on the non-www apex domain. Any request hitting the www host
  // is 301-redirected to the same path on aihuntr.net, keeping one indexable
  // URL per page and consolidating link equity. Runs at the edge on Vercel.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aihuntr.net" }],
        destination: "https://aihuntr.net/:path*",
        permanent: true,
      },
      // Collapse a superseded blog slug onto its canonical URL. An earlier draft
      // of this post was indexed under a longer slug, creating a duplicate
      // title/content pair; 301 consolidates the equity onto the published URL.
      {
        source:
          "/blog/best-ai-tools-for-content-creators-in-2026-tested-and-ranked",
        destination: "/blog/best-ai-tools-content-creators-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
