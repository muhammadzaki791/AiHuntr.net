import { defineField, defineType } from "sanity";
import { Search } from "lucide-react";

/**
 * SEO metadata document. Keyed by `pageSlug` (e.g. "home", "tools/chatgpt",
 * "blog/best-ai-writing-tools-2026"). Looked up by getSeoByPageSlugQuery with
 * graceful fallbacks in lib/seo/metadata.ts.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO Metadata",
  type: "document",
  icon: Search,
  fields: [
    defineField({
      name: "pageSlug",
      title: "Page Slug",
      type: "string",
      description: 'Identifies the page, e.g. "home" or "tools/chatgpt".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "pageDescription",
      title: "Page Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "For social sharing.",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "pageSlug", subtitle: "pageTitle" },
  },
});
