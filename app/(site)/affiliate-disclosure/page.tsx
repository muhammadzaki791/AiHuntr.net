import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, ContentSection } from "@/components/shared/page-shell";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("affiliate-disclosure", {
    title: "Affiliate Disclosure",
    description: `How ${siteConfig.name} uses affiliate links and why it doesn't influence our reviews.`,
  });
}

export default function AffiliateDisclosurePage() {
  return (
    <PageShell
      title="Affiliate Disclosure"
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Affiliate Disclosure" },
      ]}
    >
      <ContentSection heading="Our disclosure">
        <p>
          This site contains affiliate links. If you click a link and make a
          purchase or sign up for a service, we may earn a commission at no
          additional cost to you. This does not influence our reviews, which
          reflect our own editorial opinions.
        </p>
      </ContentSection>

      <ContentSection heading="How it works">
        <p>
          When we recommend a tool, the &ldquo;visit&rdquo; or
          &ldquo;try&rdquo; links may be affiliate links. If you use one to sign
          up for a paid plan, the provider may pay us a referral fee. You pay
          the same price whether you use our link or go directly to the
          provider.
        </p>
      </ContentSection>

      <ContentSection heading="Why you can trust our reviews">
        <p>
          Commissions never determine our ratings or recommendations. We
          evaluate every tool against the same criteria and publish our honest
          assessment — including drawbacks. Read more about{" "}
          <Link
            href="/about"
            className="text-foreground underline underline-offset-4"
          >
            how we review
          </Link>
          . Affiliate revenue simply helps keep {siteConfig.name} free to read.
        </p>
      </ContentSection>

      <ContentSection heading="Questions">
        <p>
          If you have any questions about our affiliate relationships, please{" "}
          <Link
            href="/contact"
            className="text-foreground underline underline-offset-4"
          >
            get in touch
          </Link>
          .
        </p>
      </ContentSection>
    </PageShell>
  );
}
