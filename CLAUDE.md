# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AIHuntr — an AI tools directory + blog site that reviews/compares AI tools, publishes SEO content, and monetizes via Google AdSense + affiliate links. There is **no shopping cart, checkout, or payments**: the only conversions are outbound affiliate clicks and newsletter signups.

The authoritative build spec is **`ai-tools-hub-prompt.md`** (full architecture, schemas, queries, component behavior, API routes, and the 6-phase build plan). Seed data for the first 3 tools + 1 blog post lives in **`seed-content.md`**. Treat these two files as the source of truth; when in doubt, re-read them.

The project is built **one phase at a time, pausing for review after each phase** (see Build Phases below).

## Tech Stack

Next.js (App Router, **not** Pages Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui (Nova preset, `components.json`) · Sanity v4 headless CMS with embedded Studio at `/studio` · next-sanity / @sanity/client / @sanity/image-url · @portabletext/react · react-hook-form + Zod · Resend (contact email) · Framer Motion (used sparingly) · lucide-react · Turbopack · deploy target Vercel.

## Commands

```bash
npm run dev      # Turbopack dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

There is no test runner configured. The embedded Sanity Studio is served by the app itself at `/studio` (no separate Studio process) — do **not** create a standalone Studio project folder.

> **typedRoutes is intentionally OFF during the phased build** (`next.config.ts`). Nav/links reference routes like `/tools` and `/blog` before those pages exist, which would fail type-checking under `typedRoutes`. Re-enable it in the final cleanup pass (Phase 6) once every route is present. A stray `C:\Users\dell\package-lock.json` outside the project also exists; `turbopack.root` is pinned to the project dir to silence the workspace-root warning — deleting that parent lockfile is harmless if you want to.

## Architecture

- **Content lives entirely in Sanity.** Five document types: `tool`, `post`, `category`, `newsletter`, `seo`. Never hardcode tool/post/category data in components — fetch from Sanity. Seed content is entered into Sanity, not committed as arrays.
- **Server-first data fetching.** Page-level content (homepage, tools, posts, categories) is fetched in async **server components** via the server Sanity client (`useCdn: true`). The **only** client-side fetch is the debounced search bar.
- **GROQ queries are centralized** in `lib/client/queries.ts` (11 named queries — see spec). Don't scatter inline queries across pages.
- **Affiliate links are centralized** in `lib/config/affiliates.ts`, keyed by each tool's `affiliateSlug`. Never hardcode an affiliate URL in a component or Sanity field. Affiliate `<a>` tags use `rel="noopener noreferrer sponsored"`.
- **SEO is structural, not optional.** Every route implements `generateMetadata()` (via `lib/seo/metadata.ts`, falling back to Sanity `seo` docs then to excerpt/shortDescription). Tool pages inject Review + FAQPage + BreadcrumbList JSON-LD; post pages inject Article + FAQPage + BreadcrumbList — via the `SchemaMarkup` component using builders in `lib/seo/schema.ts`.
- **Internal linking is mandatory.** Every tool and post page renders the `RelatedContent` component (relatedTools + relatedPosts). This multi-page-per-session behavior is what the monetization model depends on — do not omit it.

## Project-specific rules (easy to get wrong)

- **Do not invent a color scheme or design tokens.** Visual styling is handled separately by the `frontend-design` skill / a later styling pass. `app/globals.css` already defines a neutral OKLCH token system (shadcn Nova) — build with those tokens (`bg-background`, `text-foreground`, `border-border`, etc.) and structural Tailwind utilities (layout/flex/grid/sizing) only. No bespoke brand palette.
- **Ad slots are placeholders.** Use the `AdSlot` component everywhere ads will go, but do not wire real AdSense `<ins>`/script tags until the site is approved. Max 3 ad slots per page, never adjacent to nav.
- **No lorem ipsum in shipped pages.** Where real content isn't available (e.g. About bio), leave a visible short placeholder plus a `{/* TODO: replace with real content */}` comment. Never fabricate author names or credentials.
- **All forms use react-hook-form + Zod** — no uncontrolled forms or manual validation.
- **All Sanity images** go through the `urlFor()` builder and render via Next.js `<Image>` (lazy, AVIF/WebP).

## Sanity / environment

- Sanity project ID: **`j6zujfti`**, dataset **`production`** (account: muhammadzak791@gmail.com).
- Env vars (see `.env.local.example`; user supplies values): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.
- Sanity MCP auth may expire; re-run `npx sanity@latest mcp configure` (then restart the client) if MCP tools return "Unauthorized".

## Installed skills (`.claude/skills/`)

`frontend-design` (UI/visual design — owns styling), `next-best-practices` (Next.js App Router), `vercel-react-best-practices` (React patterns), `shadcn` (component management; project uses `components.json`), `seo-audit` (SEO review).

## Build Phases (from `ai-tools-hub-prompt.md`)

1. **Foundation** — folder structure, base layout (Header/Footer), homepage skeleton, `sitemap.ts` + `robots.ts`.
2. **Sanity + Tool Directory** — 5 schemas, GROQ queries, `/tools` + `/tools/[slug]`, AffiliateCtaButton + affiliates config, tool JSON-LD; seed ChatGPT/Claude/Midjourney.
3. **Blog** — `/blog` + `/blog/[slug]`, PortableText renderer, FaqAccordion, AdSlot, Article JSON-LD; seed 1 comparison post.
4. **Categories, Search, Internal Linking** — `/category/[slug]`, RelatedContent, Breadcrumbs, `/search` + header search.
5. **Trust & Legal** — About, Contact (+ Resend API route), Privacy, Terms, Affiliate Disclosure.
6. **Newsletter + Final SEO** — newsletter schema/API/forms, metadata applied everywhere, sitemap/robots + Core Web Vitals pass.
