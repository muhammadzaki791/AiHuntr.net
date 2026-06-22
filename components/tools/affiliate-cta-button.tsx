"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAffiliateUrl } from "@/lib/config/affiliates";

/**
 * Reusable affiliate CTA. Resolves the URL from lib/config/affiliates.ts by
 * `affiliateSlug` — never hardcode affiliate URLs. Renders a sponsored,
 * new-tab link; on a missing slug it falls back to a disabled-looking button
 * and warns in dev so the gap is caught early.
 */
export function AffiliateCtaButton({
  affiliateSlug,
  label,
  variant = "primary",
  className,
}: {
  affiliateSlug: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const url = getAffiliateUrl(affiliateSlug);
  const text = label ?? "Visit Site";

  useEffect(() => {
    if (!url) {
      console.warn(
        `[AffiliateCtaButton] No affiliate URL configured for slug "${affiliateSlug}". Add it to lib/config/affiliates.ts.`,
      );
    }
  }, [url, affiliateSlug]);

  const base =
    "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-opacity";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "border border-border bg-background hover:bg-muted";

  if (!url) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={cn(base, styles, "cursor-not-allowed opacity-50", className)}
      >
        {text}
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(base, styles, className)}
    >
      {text}
    </a>
  );
}
