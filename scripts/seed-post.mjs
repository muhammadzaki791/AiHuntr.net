/**
 * Phase 3 seed: 1 comparison blog post linking to the Phase 2 tools.
 *
 * Idempotent — uses a deterministic _id + createOrReplace, so re-running
 * updates rather than duplicating. The cover image is a placeholder uploaded as
 * a Sanity asset (replace with a real image later in Studio).
 *
 * Requires the Phase 2 tools to exist (tool-chatgpt, tool-claude,
 * tool-midjourney) for relatedTools references to resolve.
 *
 * Run: node --env-file=.env.local scripts/seed-post.mjs
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

let keyCounter = 0;
function nextKey(prefix = "k") {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

/**
 * Build a portable-text block from a {style, text} entry. `text` may contain
 * **bold** segments, which become spans carrying the built-in "strong"
 * decorator (a decorator, not an annotation, so markDefs stays empty).
 */
function block({ style = "normal", text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  const children = parts.map((part) => {
    const boldMatch = /^\*\*([^*]+)\*\*$/.exec(part);
    return {
      _type: "span",
      _key: nextKey("s"),
      text: boldMatch ? boldMatch[1] : part,
      marks: boldMatch ? ["strong"] : [],
    };
  });

  return {
    _type: "block",
    _key: nextKey("b"),
    style,
    markDefs: [],
    children,
  };
}

const body = [
  { style: "h1", text: "Best AI Tools for Content Creators in 2026 (Tested & Ranked)" },
  {
    style: "normal",
    text: "Content creation has changed more in the last two years than in the previous decade. AI tools are no longer novelties — they're daily workhorses for writers, bloggers, social media managers, and marketers who want to produce more without sacrificing quality.",
  },
  {
    style: "normal",
    text: "But the market is flooded with options, and not all of them are worth your time or money. We tested the top contenders and ranked them by what actually matters for content creators: writing quality, ease of use, practical features, and value for money.",
  },
  {
    style: "normal",
    text: "Here are the best AI tools for content creators in 2026.",
  },
  { style: "h2", text: "1. Claude — Best for Writing Quality" },
  {
    style: "normal",
    text: "If you write long-form content — blog posts, articles, newsletters, scripts — Claude produces the most natural, human-sounding output of any AI tool we tested. The writing avoids the over-structured, bullet-point-heavy pattern that makes most AI content feel robotic.",
  },
  {
    style: "normal",
    text: "Claude's large context window is a massive advantage for content creators. You can paste in an entire article draft and ask Claude to rewrite a specific section while preserving the tone of the rest — something most AI tools struggle with because they can only \"see\" a limited amount of text at once.",
  },
  {
    style: "normal",
    text: "The free tier has daily usage limits, but the Pro plan at $20/month is well worth it for anyone writing regularly.",
  },
  {
    style: "normal",
    text: "**Best for:** Blog posts, long-form articles, editing drafts, repurposing content",
  },
  { style: "h2", text: "2. ChatGPT — Best All-Rounder" },
  {
    style: "normal",
    text: "ChatGPT remains the most versatile AI tool available. Where Claude edges it out on writing quality, ChatGPT counters with a broader feature set: image generation via DALL·E 3, web browsing for up-to-date research, file uploads to analyze documents, and a huge ecosystem of custom GPTs built for specific content tasks.",
  },
  {
    style: "normal",
    text: "For content creators who need one tool that does everything reasonably well — write, research, generate images for thumbnails, summarize competitor articles — ChatGPT Plus is the obvious choice.",
  },
  {
    style: "normal",
    text: "**Best for:** All-purpose content workflow, social media, research-backed articles, thumbnail creation",
  },
  { style: "h2", text: "3. Midjourney — Best for Visual Content" },
  {
    style: "normal",
    text: "No AI tool touches Midjourney for image quality. If you create content that needs compelling visuals — YouTube thumbnails, blog cover images, social media graphics, marketing materials — Midjourney is worth the $10-30/month subscription by itself.",
  },
  {
    style: "normal",
    text: "The output requires some prompt skill to get right, but once you develop a feel for it, Midjourney produces professional-quality visuals in seconds that would cost $50-200 from a freelance designer.",
  },
  {
    style: "normal",
    text: "**Best for:** Blog cover images, YouTube thumbnails, social media visuals, marketing assets",
  },
  { style: "h2", text: "Which AI Tool Should You Start With?" },
  {
    style: "normal",
    text: "If you're a writer or blogger, start with **Claude** — the writing quality alone justifies the Pro subscription. If you need a broader tool that covers writing, research, and image generation in one place, **ChatGPT Plus** is the better all-in-one choice. Add **Midjourney** once you're ready to level up your visual content.",
  },
  {
    style: "normal",
    text: "The honest answer is that serious content creators in 2026 use at least two of these together. The $40-50/month combined cost of Claude Pro + ChatGPT Plus is genuinely one of the best productivity investments available.",
  },
];

const faqs = [
  {
    question: "What is the best free AI tool for content creators?",
    answer:
      "Claude and ChatGPT both offer free tiers that are useful for light use. Claude's free tier has better writing quality for long-form content; ChatGPT's free tier is more versatile. For serious content creation, both paid plans are worth the investment.",
  },
  {
    question: "Can AI tools replace human writers?",
    answer:
      "Not currently, and likely not in the near future for high-quality content that requires genuine expertise, original research, or a distinct personal voice. AI tools are most powerful as writing assistants — handling drafts, edits, and repetitive content tasks — freeing human writers to focus on strategy, research, and the creative work that AI can't replicate.",
  },
  {
    question: "Is it okay to publish AI-written content?",
    answer:
      "Google's official stance is that AI-generated content is acceptable as long as it's high-quality, original, and helpful to readers — not produced purely to game search rankings. Adding genuine human expertise, editing, and original insight to AI-assisted drafts is the recommended approach for SEO-safe content.",
  },
];

/** Upload a placeholder cover image and return an image field. */
async function uploadCover() {
  const url =
    "https://placehold.co/1200x675/1e293b/e2e8f0/png?text=Best+AI+Tools+for+Content+Creators+2026";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch cover ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: "content-creators-2026-cover.png",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function main() {
  console.log("Uploading cover image...");
  const coverImage = await uploadCover();

  console.log("Seeding blog post...");
  const doc = {
    _id: "post-best-ai-tools-content-creators-2026",
    _type: "post",
    title: "Best AI Tools for Content Creators in 2026 (Tested & Ranked)",
    slug: {
      _type: "slug",
      current: "best-ai-tools-content-creators-2026",
    },
    coverImage,
    excerpt:
      "We tested the top AI tools for writers, bloggers, and content marketers. Here's what actually works in 2026 — ranked by real-world usefulness, not hype.",
    category: { _type: "reference", _ref: "category-ai-chatbots" },
    publishedAt: "2026-06-16T09:00:00.000Z",
    body: body.map(block),
    faqs: faqs.map((faq) => ({ _type: "faq", _key: nextKey("faq"), ...faq })),
    relatedTools: ["tool-chatgpt", "tool-claude", "tool-midjourney"].map(
      (ref) => ({ _type: "reference", _key: nextKey("rt"), _ref: ref }),
    ),
  };

  await client.createOrReplace(doc);
  console.log(`  ✓ ${doc.title}`);
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
