import type { Metadata } from "next";
import { HomepageContentWrapper } from "@/components/homepage-content-wrapper";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  // Brand-free title: the root layout template appends " | AIHuntr", so the
  // rendered <title> is "Best AI Tools: Expert Reviews & Comparisons | AIHuntr"
  // (53 chars) — under 60, leads with the primary keyword, no duplicate brand.
  return buildMetadataForSlug("home", {
    title: "Best AI Tools: Expert Reviews & Comparisons",
    description: siteConfig.description,
  });
}

export default function Home() {
  return <HomepageContentWrapper />;
}
