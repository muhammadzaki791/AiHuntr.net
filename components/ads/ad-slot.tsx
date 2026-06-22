import { cn } from "@/lib/utils";

/**
 * Ad slot placeholder. Renders a labeled box where an AdSense unit will go.
 *
 * Do NOT wire real AdSense <ins>/script tags until the site is approved — when
 * it is, this single component is the only place to update. Placement rules:
 * max 3 slots per page, never adjacent to navigation.
 */
export function AdSlot({
  slot,
  className,
}: {
  slot: string;
  className?: string;
}) {
  return (
    <div
      data-ad-slot={slot}
      aria-hidden="true"
      className={cn(
        "flex min-h-24 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40 text-xs text-muted-foreground",
        className,
      )}
    >
      {/*
        AdSense placeholder — replace with the real unit once approved:
        <ins className="adsbygoogle" style={{ display: "block" }}
             data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
             data-ad-slot="..." data-ad-format="auto" data-full-width-responsive="true" />
      */}
      <span>Ad slot: {slot}</span>
    </div>
  );
}
