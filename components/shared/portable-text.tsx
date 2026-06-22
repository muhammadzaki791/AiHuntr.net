import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";
import { slugifyHeading } from "@/lib/client/utils";

/**
 * Shared PortableText renderer used by tool overviews and (Phase 3) blog
 * bodies. Headings get auto-generated ids for anchor links; images render via
 * Next.js <Image> with lazy loading. Styling stays structural — prose spacing
 * via the token-based utility classes only.
 */

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        id={slugifyHeading(headingText(children))}
        className="mt-8 scroll-mt-24 text-2xl font-semibold tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugifyHeading(headingText(children))}
        className="mt-6 scroll-mt-24 text-xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 text-lg font-semibold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-border pl-4 text-muted-foreground italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-7 text-foreground/90">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="mt-6">
          <Image
            src={urlFor(value).width(1200).fit("max").url()}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className="h-auto w-full rounded-lg"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[];
}) {
  return <PortableText value={value} components={components} />;
}
