import { defineField, defineType } from "sanity";
import { User } from "lucide-react";

/**
 * Author — powers E-E-A-T signals (a named, credentialed person behind reviews
 * and articles). Referenced optionally from posts/tools; when unset, schema and
 * bylines fall back to the Organization. Never fabricate people or credentials
 * here — leave it empty until a real author is available.
 */
export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: User,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: 'e.g. "Senior AI Tools Reviewer".',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
      description: "Short bio establishing relevant expertise/experience.",
      validation: (rule) => rule.max(600),
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
      description: "Qualifications or notable experience (one per line).",
    }),
    defineField({
      name: "url",
      title: "Personal URL",
      type: "url",
      description: "Personal site or professional profile.",
    }),
    defineField({
      name: "sameAs",
      title: "Social / Profile Links",
      type: "array",
      of: [{ type: "url" }],
      description:
        "Profile URLs (LinkedIn, X, etc.) — emitted as schema.org sameAs.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar" },
  },
});
