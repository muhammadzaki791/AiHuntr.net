import type { SchemaTypeDefinition } from "sanity";
import { tool } from "./tool";
import { post } from "./post";
import { category } from "./category";
import { newsletter } from "./newsletter";
import { seo } from "./seo";

export const schemaTypes: SchemaTypeDefinition[] = [
  tool,
  post,
  category,
  newsletter,
  seo,
];
