/**
 * Single source of truth for affiliate links.
 * Keyed by the `affiliateSlug` field on each Tool document.
 * Update links HERE — never hardcode affiliate URLs in components or Sanity.
 *
 * TODO: replace these placeholder URLs with real affiliate/referral links
 * when provided. Until then they point at the tools' official sites.
 */
export const affiliateLinks: Record<string, string> = {
  // AI Chatbots
  chatgpt: "https://chat.openai.com/",
  claude: "https://claude.ai/",
  gemini: "https://gemini.google.com/",
  perplexity: "https://www.perplexity.ai/",
  // AI Image Generation
  midjourney: "https://www.midjourney.com/",
  "dalle-3": "https://openai.com/dall-e-3/",
  "leonardo-ai": "https://leonardo.ai/",
  // AI Writing & Content
  jasper: "https://www.jasper.ai/",
  "copy-ai": "https://www.copy.ai/",
  // AI Video Generation
  runway: "https://runwayml.com/",
  synthesia: "https://www.synthesia.io/",
  // AI Coding Assistants
  cursor: "https://cursor.com/",
  "github-copilot": "https://github.com/features/copilot/",
  // AI Voice & Speech
  elevenlabs: "https://elevenlabs.io/",
  "murf-ai": "https://murf.ai/",
  // AI Productivity
  "notion-ai": "https://www.notion.so/product/ai/",
  "microsoft-copilot": "https://copilot.microsoft.com/",
  // AI Design Tools
  "canva-magic-studio": "https://www.canva.com/magic-studio/",
  "adobe-firefly": "https://www.adobe.com/products/firefly.html",
};

/** Returns the affiliate URL for a slug, or null if none is configured. */
export function getAffiliateUrl(affiliateSlug: string): string | null {
  return affiliateLinks[affiliateSlug] ?? null;
}
