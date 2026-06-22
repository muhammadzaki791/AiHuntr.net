import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, ContentSection } from "@/components/shared/page-shell";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("about", {
    title: `About ${siteConfig.name}`,
    description:
      "Who runs AIHuntr, how we test and review AI tools, and why you can trust our recommendations.",
  });
}

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${siteConfig.name}`}
      intro="Independent, hands-on reviews and comparisons of AI tools — built to help you choose the right one with confidence."
      crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
    >
      <ContentSection heading="Who runs this site">
        {/* TODO: replace with real owner/author bio and credentials. Do NOT
            fabricate names, photos, or qualifications. */}
        <p>
          {siteConfig.name} is run by a small team of writers who use AI tools
          daily across writing, design, coding, and research. This section will
          introduce the people behind the reviews and their relevant background.
        </p>
        <p className="text-foreground/80">
          [Placeholder — add the editor/owner bio, relevant experience, and
          credentials here before launch.]
        </p>
      </ContentSection>

      <ContentSection heading="How we review">
        <p>
          Every tool we cover is evaluated against a consistent set of criteria
          so comparisons are fair and repeatable:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Hands-on use</span> —
            we work with each tool on real tasks rather than relying on
            marketing copy.
          </li>
          <li>
            <span className="font-medium text-foreground">Features &amp; limits</span>{" "}
            — what it actually does, where it falls short, and who it&apos;s for.
          </li>
          <li>
            <span className="font-medium text-foreground">Pricing &amp; value</span>{" "}
            — free tiers, paid plans, and whether the cost is justified.
          </li>
          <li>
            <span className="font-medium text-foreground">Ease of use</span> —
            onboarding, learning curve, and day-to-day workflow.
          </li>
        </ul>
        <p>
          Ratings reflect our own editorial judgement. We update reviews as
          tools change.
        </p>
      </ContentSection>

      <ContentSection heading="Editorial independence">
        <p>
          {siteConfig.name} is funded by advertising and affiliate commissions.
          When you click an affiliate link and sign up for a tool, we may earn a
          commission at no extra cost to you. This never changes our verdicts —
          we recommend tools on merit, not commission. See our{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-foreground underline underline-offset-4"
          >
            affiliate disclosure
          </Link>{" "}
          for details.
        </p>
      </ContentSection>

      <ContentSection heading="Get in touch">
        <p>
          Spotted an error, or want us to review a specific tool? We&apos;d love
          to hear from you — head to our{" "}
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
