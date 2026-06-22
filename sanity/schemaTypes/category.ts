import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

/**
 * Category — shared by tools and posts. Drives /category/[slug] pages and the
 * filter/nav UI. `icon` holds a lucide-react icon name (rendered client-side).
 */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: Tag,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Shown at the top of the /category/[slug] page.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "A lucide-react icon name (e.g. \"MessageSquare\", \"Image\").",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
