# AIHuntr

AIHuntr is an AI tools directory and blog. It reviews and compares AI tools, publishes SEO-driven editorial content, and monetizes through Google AdSense and affiliate links. There is no cart, checkout, or payment flow — the only conversions are outbound affiliate clicks and newsletter signups.

All content is managed in [Sanity](https://www.sanity.io/) and rendered server-first with the Next.js App Router.

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript (strict) and Turbopack
- **Styling:** Tailwind CSS v4 + shadcn/ui (Nova preset)
- **CMS:** Sanity v4 (headless) with an embedded Studio at `/studio`
- **Content rendering:** next-sanity, `@sanity/client`, `@sanity/image-url`, `@portabletext/react`
- **Forms & validation:** react-hook-form + Zod
- **Email:** Resend (contact form)
- **Motion & icons:** Framer Motion (used sparingly), lucide-react
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.18+ (or 20+)
- A Sanity project (project ID and dataset)

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date |
| `SANITY_API_READ_TOKEN` | Read token for server-side fetching |
| `SANITY_API_WRITE_TOKEN` | Write token for seeding/scripts |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for metadata, sitemap) |
| `RESEND_API_KEY` | Resend API key for the contact form |
| `FROM_EMAIL` | Sender address for transactional email |
| `ADMIN_EMAIL` | Recipient for contact form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense client ID |

> `.env.local` is git-ignored and must never be committed.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The embedded Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

There is no test runner configured.

## Project Structure

```
app/                  App Router routes, layouts, API routes, sitemap & robots
  (site)/             Public pages (home, tools, blog, categories, legal)
  api/                Route handlers (contact email, newsletter)
  studio/             Embedded Sanity Studio
components/           UI, navigation, tools, blog, shared, and form components
lib/
  client/             Sanity client + centralized GROQ queries
  config/             Site config and affiliate link map
  seo/                Metadata builders and JSON-LD schema builders
sanity/               Sanity config, schema types, and structure
types/                Shared content types
scripts/              Content seeding scripts
```

## Architecture

- **Content lives in Sanity.** Five document types — `tool`, `post`, `category`, `newsletter`, and `seo`. Content is never hardcoded in components; it is fetched from Sanity.
- **Server-first data fetching.** Page-level content is fetched in async server components via the server Sanity client. The only client-side fetch is the debounced search bar.
- **Centralized queries.** All GROQ queries live in `lib/client/queries.ts`.
- **Centralized affiliate links.** Affiliate URLs are keyed by each tool's `affiliateSlug` in `lib/config/affiliates.ts`. Affiliate links use `rel="noopener noreferrer sponsored"`.
- **Structural SEO.** Every route implements `generateMetadata()`. Tool pages inject Review, FAQPage, and BreadcrumbList JSON-LD; post pages inject Article, FAQPage, and BreadcrumbList — via the shared schema markup builders.
- **Internal linking.** Every tool and post page renders related content (related tools and posts) to support multi-page sessions.

## Deployment

The application is built for [Vercel](https://vercel.com/). Configure the environment variables above in your Vercel project settings, then connect the repository for automatic deployments.

## License

This project is proprietary. All rights reserved.
