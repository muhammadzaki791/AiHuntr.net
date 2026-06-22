import type { Metadata } from "next";
import { PageShell } from "@/components/shared/page-shell";
import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadataForSlug } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("contact", {
    title: "Contact",
    description:
      "Get in touch with the AIHuntr team — questions, corrections, or partnership enquiries.",
  });
}

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Have a question, a correction, or a tool you'd like us to review? Send us a message."
      crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
    >
      <ContactForm />
    </PageShell>
  );
}
