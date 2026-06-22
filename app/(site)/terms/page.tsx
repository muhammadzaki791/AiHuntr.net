import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, ContentSection } from "@/components/shared/page-shell";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("terms", {
    title: "Terms of Service",
    description: `The terms governing your use of ${siteConfig.name}.`,
  });
}

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
    >
      {/* TODO: Have these terms reviewed by a qualified professional and set the
          governing-law jurisdiction before launch. */}
      <p className="rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Draft terms — review with a qualified professional and set the governing
        jurisdiction before launch.
      </p>

      <ContentSection heading="Acceptance of terms">
        <p>
          By accessing {siteConfig.name} you agree to these Terms of Service. If
          you do not agree, please do not use the site.
        </p>
      </ContentSection>

      <ContentSection heading="Informational use only">
        <p>
          All content on {siteConfig.name} — reviews, comparisons, ratings, and
          articles — is provided for general informational purposes only. It
          reflects our editorial opinions and does not constitute professional,
          legal, financial, or technical advice.
        </p>
      </ContentSection>

      <ContentSection heading="No liability">
        <p>
          You are responsible for any decisions you make based on the content
          here. To the fullest extent permitted by law, {siteConfig.name} and
          its contributors are not liable for any loss or damage arising from
          your use of the site or reliance on its content. Tool features,
          pricing, and availability change over time and may differ from what is
          described.
        </p>
      </ContentSection>

      <ContentSection heading="Affiliate links">
        <p>
          The site contains affiliate links. We may earn a commission when you
          act on them, at no additional cost to you. See our{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-foreground underline underline-offset-4"
          >
            affiliate disclosure
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection heading="Intellectual property">
        <p>
          The content, design, and branding of {siteConfig.name} are owned by us
          or our licensors and are protected by applicable intellectual property
          laws. You may not reproduce or republish material from the site
          without permission. Third-party names, logos, and trademarks belong to
          their respective owners and are used for identification only.
        </p>
      </ContentSection>

      <ContentSection heading="External links">
        <p>
          We link to third-party sites we don&apos;t control and aren&apos;t
          responsible for their content or practices. Visiting them is at your
          own risk and subject to their terms.
        </p>
      </ContentSection>

      <ContentSection heading="Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes are posted constitutes acceptance of the revised terms.
        </p>
      </ContentSection>

      <ContentSection heading="Governing law">
        <p>
          {/* TODO: insert the governing jurisdiction. */}
          These terms are governed by the laws of [jurisdiction placeholder],
          without regard to conflict-of-law principles.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p>
          Questions about these terms? Reach us via our{" "}
          <Link
            href="/contact"
            className="text-foreground underline underline-offset-4"
          >
            contact page
          </Link>
          .
        </p>
      </ContentSection>
    </PageShell>
  );
}
