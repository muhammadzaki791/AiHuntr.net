"use client";

import Link from "next/link";
import { FadeIn } from "@/lib/animations";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import {
  companyNav,
  legalNav,
  productNav,
  siteConfig,
} from "@/lib/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <FadeIn className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-3 lg:col-span-4">
            <p className="display-heading inline-flex items-center gap-1 text-lg font-semibold">
              {siteConfig.name}
              <span className="text-gold-foreground" aria-hidden="true">
                ★
              </span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="space-y-3 lg:col-span-2">
            <p className="text-sm font-semibold">Product</p>
            <ul className="space-y-2">
              {productNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company + Legal */}
          <nav aria-label="Company" className="space-y-3 lg:col-span-2">
            <p className="text-sm font-semibold">Company</p>
            <ul className="space-y-2">
              {[...companyNav, ...legalNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-4">
            <p className="text-sm font-semibold">Newsletter</p>
            <NewsletterSection variant="footer" source="Footer" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            This site contains affiliate links.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Learn more
            </Link>
            .
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
