import type { Metadata } from "next";
// Self-hosted Geist via @fontsource (no Google Fonts network fetch at build/dev
// time). The CSS variables below are wired up in globals.css.
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
// Fraunces — optical-size variable serif used for display headings only. Its
// "opsz" axis lets large headings pick up high-contrast editorial detailing.
import "@fontsource-variable/fraunces";
import "./globals.css";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

/**
 * Minimal root layout — html/body/fonts only. Site chrome (Header/Footer) lives
 * in the (site) route group so the embedded Studio at /studio renders
 * full-screen without it.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
