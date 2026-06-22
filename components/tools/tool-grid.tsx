import { ToolCard } from "./tool-card";
import type { Tool, ToolListItem } from "@/types/content-types";

/**
 * Responsive grid of ToolCards. Pure presentational: 1 col on mobile, 2 on sm,
 * 3 on lg, 4 on xl. Renders an empty-state message when no tools are passed.
 */
export function ToolGrid({
  tools,
  emptyMessage = "No tools found.",
}: {
  tools: (ToolListItem | Tool)[];
  emptyMessage?: string;
}) {
  if (tools.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
}
