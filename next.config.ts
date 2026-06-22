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
};

export default nextConfig;
