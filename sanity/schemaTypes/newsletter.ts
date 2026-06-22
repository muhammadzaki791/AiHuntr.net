import { defineField, defineType } from "sanity";
import { Mail } from "lucide-react";

/**
 * Newsletter subscriber. Created via the write client from the subscribe API
 * route. Emails are stored lowercased for case-insensitive de-duplication.
 */
export const newsletter = defineType({
  name: "newsletter",
  title: "Newsletter Subscriber",
  type: "document",
  icon: Mail,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Footer", value: "Footer" },
          { title: "Tool Page", value: "Tool Page" },
          { title: "Blog Page", value: "Blog Page" },
          { title: "Homepage", value: "Homepage" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", source: "source" },
    prepare({ title, source }) {
      return { title, subtitle: `Source: ${source ?? "—"}` };
    },
  },
});
