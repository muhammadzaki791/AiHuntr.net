import type { PortableTextBlock } from "@portabletext/types";
import { PortableTextRenderer } from "@/components/shared/portable-text";

/**
 * Blog body renderer. Delegates to the shared PortableTextRenderer (headings
 * with anchor ids, lazy <Image>, etc.) and optionally injects a mid-content
 * node (e.g. an AdSlot) after roughly the first third of the blocks — the
 * "blog-in-content" placement called for in the spec.
 *
 * Splitting on a top-level block boundary keeps the ad from landing inside a
 * list or other grouped content.
 */
export function PostContent({
  value,
  midContent,
}: {
  value: PortableTextBlock[];
  midContent?: React.ReactNode;
}) {
  if (!midContent || value.length < 6) {
    return (
      <div className="max-w-none">
        <PortableTextRenderer value={value} />
      </div>
    );
  }

  const splitAt = Math.max(1, Math.floor(value.length / 3));
  const head = value.slice(0, splitAt);
  const tail = value.slice(splitAt);

  return (
    <div className="max-w-none">
      <PortableTextRenderer value={head} />
      <div className="my-8">{midContent}</div>
      <PortableTextRenderer value={tail} />
    </div>
  );
}
