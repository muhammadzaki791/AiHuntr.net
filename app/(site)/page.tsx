import type { Metadata } from "next";
import { HomepageContentWrapper } from "@/components/homepage-content-wrapper";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("home", {
    title: `${siteConfig.name} — Reviews & Comparisons of the Best AI Tools`,
    description: siteConfig.description,
  });
}

export default function Home() {
  return <HomepageContentWrapper />;
}
