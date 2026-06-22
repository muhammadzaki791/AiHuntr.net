import type { StructureResolver } from "sanity/structure";
import { Wrench, FileText, Tag, Mail, Search } from "lucide-react";

/**
 * Studio sidebar structure. Each section lists its document type newest-first.
 * Tools and Posts keep the default list view (thumbnail preview from the
 * schema); the remaining sections are form-only document lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("AI Tools")
        .icon(Wrench)
        .child(
          S.documentTypeList("tool")
            .title("AI Tools")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Blog Posts")
        .icon(FileText)
        .child(
          S.documentTypeList("post")
            .title("Blog Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Categories")
        .icon(Tag)
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Newsletter")
        .icon(Mail)
        .child(
          S.documentTypeList("newsletter")
            .title("Newsletter Subscribers")
            .defaultOrdering([{ field: "subscribedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("SEO")
        .icon(Search)
        .child(
          S.documentTypeList("seo")
            .title("SEO Metadata")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
    ]);
