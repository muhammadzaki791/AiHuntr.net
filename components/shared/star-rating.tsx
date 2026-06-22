import { Star, StarHalf } from "lucide-react";
import { formatRating } from "@/lib/client/utils";
import { cn } from "@/lib/utils";

/**
 * Visual 1–5 star rating with the numeric value. Renders full, half, and empty
 * stars. Decorative — the numeric label carries the accessible value.
 */
export function StarRating({
  rating,
  className,
  showValue = true,
}: {
  rating: number;
  className?: string;
  showValue?: boolean;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const roundedFull = rating - full >= 0.75 ? full + 1 : full;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`Rated ${formatRating(rating)} out of 5`}
    >
      <div className="flex items-center text-amber-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < roundedFull && !(hasHalf && i === full)) {
            return <Star key={i} className="size-4 fill-current" />;
          }
          if (hasHalf && i === full) {
            return <StarHalf key={i} className="size-4 fill-current" />;
          }
          return <Star key={i} className="size-4 text-muted-foreground/40" />;
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium">{formatRating(rating)}</span>
      )}
    </div>
  );
}
