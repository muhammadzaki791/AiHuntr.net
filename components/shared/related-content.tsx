import { ToolCard } from "@/components/tools/tool-card";
import { PostCard } from "@/components/blog/post-card";
import type { PostListItem, ToolListItem } from "@/types/content-types";

/**
 * Primary internal-linking component — MUST appear on every tool and post page.
 * Renders "Related Tools" and "Keep Reading" groups as a single closing module.
 * Drives the multi-page-per-session behavior the monetization model depends on.
 *
 * Layout note: this module is dropped into narrow article columns (the blog
 * post body is capped at ~48rem). Each group therefore tops out at a 2-up grid
 * — never the nested 2×2 that previously crammed four cards across ~700px.
 *
 * Renders nothing when both lists are empty.
 */
export function RelatedContent({
  tools,
  posts,
}: {
  tools?: ToolListItem[] | null;
  posts?: PostListItem[] | null;
}) {
  // Sanity returns null (not undefined) for unset reference arrays, so a
  // default param wouldn't catch it — coalesce explicitly. We also drop null
  // entries: a weak reference to an unpublished doc dereferences to null, and
  // mapping over those would crash on `tool._id`.
  const toolList = (tools ?? []).filter(Boolean);
  const postList = (posts ?? []).filter(Boolean);
  const hasTools = toolList.length > 0;
  const hasPosts = postList.length > 0;
  if (!hasTools && !hasPosts) return null;

  return (
    <section
      aria-label="Related content"
      className="border-t border-border pt-10"
    >
      <p className="eyebrow">Keep Exploring</p>
      <h2 className="display-heading mt-3 text-2xl font-semibold sm:text-[1.75rem]">
        More from the field guide
      </h2>

      <div className="mt-8 space-y-10">
        {hasTools && (
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Related Tools
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {toolList.map((tool) => (
                <ToolCard key={tool._id} tool={tool} compact />
              ))}
            </div>
          </div>
        )}

        {hasPosts && (
          <div>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Keep Reading
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {postList.map((post) => (
                <PostCard key={post._id} post={post} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
