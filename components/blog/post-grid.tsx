import { PostCard } from "./post-card";
import type { Post, PostListItem } from "@/types/content-types";

/**
 * Responsive grid of PostCards. Pure presentational: 1 col on mobile, 2 on sm,
 * 3 on lg. Renders an empty-state message when no posts are passed.
 */
export function PostGrid({
  posts,
  emptyMessage = "No posts found.",
}: {
  posts: (PostListItem | Post)[];
  emptyMessage?: string;
}) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
