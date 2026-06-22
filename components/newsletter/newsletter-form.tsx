"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup form (client). Validates an email with Zod via
 * react-hook-form, POSTs to /api/newsletter/subscribe with the given `source`,
 * then shows a success message that auto-hides after 5 seconds.
 */

type NewsletterSource = "Footer" | "Tool Page" | "Blog Page" | "Homepage";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

const SUCCESS_TIMEOUT_MS = 5000;

export function NewsletterForm({
  source = "Footer",
  layout = "default",
}: {
  source?: NewsletterSource;
  /** "default" stacks input + button; "inline" places them side by side. */
  layout?: "default" | "inline";
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  // Auto-hide the success message after a delay (and clean up on unmount).
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), SUCCESS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [submitted]);

  async function onSubmit(values: NewsletterValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, source }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      reset();
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and retry.");
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-sm"
      >
        <CheckCircle2 className="size-4 shrink-0 text-foreground" aria-hidden="true" />
        <span>Thanks — you&apos;re subscribed.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
      <div
        className={cn(
          "gap-2",
          layout === "inline" ? "flex flex-col sm:flex-row" : "flex flex-col",
        )}
      >
        <div className="flex-1">
          <label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${source}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : undefined}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/30 aria-[invalid=true]:border-destructive"
            {...register("email")}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {errors.email && (
        <p className="text-xs text-destructive">{errors.email.message}</p>
      )}
      {serverError && (
        <p role="alert" className="text-xs text-destructive">
          {serverError}
        </p>
      )}
    </form>
  );
}
