import { CheckCircle, XCircle } from "lucide-react";

/**
 * Two-column pros/cons display (stacks on mobile). Green checks for pros, red
 * x-marks for cons.
 */
export function ProsConsList({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Pros</h3>
        <ul className="space-y-2">
          {pros.map((pro) => (
            <li key={pro} className="flex items-start gap-2 text-sm">
              <CheckCircle
                className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-500"
                aria-hidden="true"
              />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold">Cons</h3>
        <ul className="space-y-2">
          {cons.map((con) => (
            <li key={con} className="flex items-start gap-2 text-sm">
              <XCircle
                className="mt-0.5 size-4 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
