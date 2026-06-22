import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";

/**
 * Shared shell for static content pages (About, Contact, legal). Renders a
 * breadcrumb trail, a page title + optional intro, and a constrained content
 * column. Structural only — no bespoke styling.
 */
export function PageShell({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-3 text-lg text-muted-foreground">{intro}</p>
        )}
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

/**
 * A titled prose section used inside legal/about pages. Body text uses the
 * neutral token palette and structural spacing only.
 */
export function ContentSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 space-y-3 first:mt-0">
      <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
