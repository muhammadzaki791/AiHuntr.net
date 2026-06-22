import { defineArrayMember, defineField, defineType } from "sanity";
import { Wrench } from "lucide-react";

/**
 * AI Tool — the core review document. Affiliate links are NOT stored here;
 * `affiliateSlug` is the key looked up in lib/config/affiliates.ts.
 */
export const tool = defineType({
  name: "tool",
  title: "AI Tool",
  type: "document",
  icon: Wrench,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      description: "Used on cards and as a meta-description fallback.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricingModel",
      title: "Pricing Model",
      type: "string",
      options: {
        list: [
          { title: "Free", value: "Free" },
          { title: "Freemium", value: "Freemium" },
          { title: "Paid", value: "Paid" },
          { title: "Free Trial", value: "Free Trial" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricingPlans",
      title: "Pricing Plans",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "pricingPlan",
          fields: [
            defineField({
              name: "planName",
              title: "Plan Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: 'e.g. "$0", "$20/month", "Contact for pricing"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { title: "planName", subtitle: "price" },
          },
        }),
      ],
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Your editorial rating, 1–5.",
      validation: (rule) => rule.required().min(1).max(5).precision(1),
    }),
    defineField({
      name: "pros",
      title: "Pros",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "cons",
      title: "Cons",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "useCases",
      title: "Use Cases",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "affiliateSlug",
      title: "Affiliate Slug",
      type: "string",
      description:
        "Key used to look up the affiliate URL in lib/config/affiliates.ts.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "officialUrl",
      title: "Official URL",
      type: "url",
      description: 'Non-affiliate site, used for "Visit Official Site".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
      description: "Full review body (portable text).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({
      name: "relatedTools",
      title: "Related Tools",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tool" }] }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "logo" },
  },
});
