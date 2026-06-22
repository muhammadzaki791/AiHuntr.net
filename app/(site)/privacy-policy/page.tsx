import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, ContentSection } from "@/components/shared/page-shell";
import { buildMetadataForSlug } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("privacy-policy", {
    title: "Privacy Policy",
    description: `How ${siteConfig.name} collects, uses, and protects your data, including analytics and advertising cookies.`,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
    >
      {/* TODO: Review and customize this policy — generate a complete version
          using a tool like termly.io and merge with this draft before going
          live. Add the effective date and a verified contact address. */}
      <p className="rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Draft policy — review and customize before launch. Generate a complete
        version (e.g. with termly.io) and merge it with this draft.
      </p>

      <ContentSection heading="Overview">
        <p>
          This Privacy Policy explains what information {siteConfig.name}{" "}
          collects when you visit the site, how we use it, and the choices you
          have. By using the site you agree to the practices described here.
        </p>
      </ContentSection>

      <ContentSection heading="Information we collect">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Usage &amp; analytics data</span>{" "}
            — pages viewed, approximate location, device and browser type, and
            referral source, collected via cookies and similar technologies.
          </li>
          <li>
            <span className="font-medium text-foreground">Advertising data</span>{" "}
            — once advertising is active, our ad partners may set cookies to
            serve and measure ads (see &ldquo;Third-party services&rdquo; below).
          </li>
          <li>
            <span className="font-medium text-foreground">Newsletter email</span>{" "}
            — if you subscribe, we store the email address you provide.
          </li>
          <li>
            <span className="font-medium text-foreground">Contact details</span>{" "}
            — the name, email, and message you submit through the contact form.
          </li>
        </ul>
      </ContentSection>

      <ContentSection heading="How we use your information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To operate, maintain, and improve the site and its content.</li>
          <li>To understand how visitors use the site (analytics).</li>
          <li>To display relevant advertising.</li>
          <li>To send newsletter emails you&apos;ve opted into.</li>
          <li>To respond to messages you send us.</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Third-party services">
        <p>We rely on the following third parties, each with its own policy:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Google Analytics</span>{" "}
            — site usage measurement.
          </li>
          <li>
            <span className="font-medium text-foreground">Google AdSense</span>{" "}
            — advertising (once active). Google may use cookies to personalize
            ads; you can manage this via Google&apos;s Ads Settings.
          </li>
          <li>
            <span className="font-medium text-foreground">Sanity</span> — the
            content management system that powers our reviews and articles.
          </li>
          <li>
            <span className="font-medium text-foreground">Resend</span> — used
            to deliver contact-form messages to us.
          </li>
        </ul>
      </ContentSection>

      <ContentSection heading="Cookies">
        <p>
          Cookies are small files stored on your device. We use them for
          analytics and, once active, advertising. You can control or delete
          cookies through your browser settings; disabling them may affect some
          functionality.
        </p>
      </ContentSection>

      <ContentSection heading="Your rights">
        <p>
          Depending on where you live, you may have the right to access,
          correct, or delete your personal data, opt out of certain processing,
          or unsubscribe from our newsletter at any time. To exercise these
          rights, contact us using the details below.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p>
          For privacy questions or requests, please reach us through our{" "}
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
