import type { Route } from "next";

/**
 * Site-wide configuration.
 * TODO: replace name/description/social with real branding when provided.
 */
export const siteConfig = {
  name: "AIHuntr",
  // Short tagline used as a default meta description fallback.
  description:
    "Reviews and comparisons of the best AI tools — chatbots, image generators, coding assistants, and more.",
  // Resolved from env at usage sites; this is only a dev fallback.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Primary navigation links (header + footer). */
export const mainNav: { label: string; href: Route }[] = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Product / content links (footer "Product" column). */
export const productNav: { label: string; href: Route }[] = [
  { label: "AI Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Categories", href: "/category" },
];

/** Company links (footer "Company" column). */
export const companyNav: { label: string; href: Route }[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Legal links (footer "Legal" column / bottom bar). */
export const legalNav: { label: string; href: Route }[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
];
