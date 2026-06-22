/**
 * Single source of truth for affiliate links.
 * Keyed by the `affiliateSlug` field on each Tool document.
 * Update links HERE — never hardcode affiliate URLs in components or Sanity.
 *
 * TODO: replace these placeholder URLs with real affiliate/referral links
 * when provided. Until then they point at the tools' official sites.
 */
export const affiliateLinks: Record<string, string> = {
  chatgpt: "https://chat.openai.com/",
  claude: "https://claude.ai/",
  midjourney: "https://www.midjourney.com/",
};

/** Returns the affiliate URL for a slug, or null if none is configured. */
export function getAffiliateUrl(affiliateSlug: string): string | null {
  return affiliateLinks[affiliateSlug] ?? null;
}
