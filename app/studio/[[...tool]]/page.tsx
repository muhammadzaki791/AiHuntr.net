/**
 * Embedded Sanity Studio at /studio. Renders the full Studio UI from the
 * shared sanity.config.ts. Must be dynamic (no static export) and is excluded
 * from indexing via robots.ts.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
