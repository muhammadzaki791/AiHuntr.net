import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a Sanity image URL. Chain `.width()/.height()/.format()` as needed.
 * Every Sanity image in the app must render through this builder and a Next.js
 * <Image>, never via a raw asset URL.
 *
 * @example urlFor(tool.logo).width(96).height(96).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
