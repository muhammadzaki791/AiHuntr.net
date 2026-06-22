import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

/**
 * Newsletter CTA wrapper. A server component that frames the (client)
 * NewsletterForm with copy and a privacy disclaimer.
 *
 * - "default": a bordered card section for in-page placement (homepage).
 * - "footer": compact layout for the footer column.
 */
export function NewsletterSection({
  variant = "default",
  source,
}: {
  variant?: "default" | "footer";
  source?: "Footer" | "Tool Page" | "Blog Page" | "Homepage";
}) {
  const resolvedSource = source ?? (variant === "footer" ? "Footer" : "Homepage");

  if (variant === "footer") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Subscribe for new AI tool reviews and comparisons.
        </p>
        <NewsletterForm source={resolvedSource} layout="default" />
        <PrivacyNote />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center sm:p-10">
      <h2 className="text-2xl font-semibold tracking-tight">Stay in the loop</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Get our latest AI tool reviews and comparisons in your inbox. No spam,
        unsubscribe anytime.
      </p>
      <div className="mx-auto mt-6 max-w-md text-left">
        <NewsletterForm source={resolvedSource} layout="inline" />
        <div className="mt-2 text-center">
          <PrivacyNote />
        </div>
      </div>
    </div>
  );
}

function PrivacyNote() {
  return (
    <p className="text-xs text-muted-foreground">
      We respect your privacy. Read our{" "}
      <Link
        href="/privacy-policy"
        className="underline underline-offset-4 transition-colors hover:text-foreground"
      >
        privacy policy
      </Link>
      .
    </p>
  );
}
