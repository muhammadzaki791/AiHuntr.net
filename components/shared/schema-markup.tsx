/**
 * JSON-LD injector. Accepts a single pre-built schema object or an array, and
 * renders a <script type="application/ld+json">. Schemas come from the builders
 * in lib/seo/schema.ts. Server component — no client JS shipped.
 */
type Json = Record<string, unknown>;

export function SchemaMarkup({ schema }: { schema: Json | Json[] }) {
  const payload = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify output is safe to inject; values are our own data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
