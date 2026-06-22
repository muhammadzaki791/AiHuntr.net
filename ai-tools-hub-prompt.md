# PROMPT: Build an AI Tools Hub Website (Reviews + Blog + AdSense/Affiliate)

Build me a complete, production-ready **AI Tools directory & blog website** using the exact tech stack and architecture described below. This site reviews and compares AI tools (ChatGPT, Claude, Midjourney, coding assistants, etc.), publishes SEO-focused blog content, and is monetized via Google AdSense + affiliate links. I will provide my own credentials, branding, and final content separately — focus entirely on building the full logical structure, functionality, and codebase.

**IMPORTANT — Enter plan mode first.** Read this entire prompt, then propose a phased build plan (see "BUILD PHASES" near the end). Build one phase at a time and wait for my review before starting the next.

---

## TECH STACK (Must Use Exactly)

- **Framework:** Next.js 16+ (App Router, NOT Pages Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + clsx + tailwind-merge + class-variance-authority
- **CMS:** Sanity v4 (headless CMS, embedded Studio at `/studio` route)
- **Sanity Client:** next-sanity + @sanity/client + @sanity/image-url
- **Rich Text:** @portabletext/react for rendering Sanity block content (tool reviews, blog posts)
- **Email Service:** Resend (for contact form submissions)
- **Forms:** react-hook-form + @hookform/resolvers + Zod for validation
- **Icons:** lucide-react
- **Animations:** Framer Motion (scroll-triggered, hover effects, stagger animations — used sparingly, performance matters more than flair on this site)
- **UI Components:** shadcn/ui (new-york style)
- **SEO:** next-sitemap (or App Router native sitemap.ts/robots.ts) + JSON-LD schema injection
- **Bundler:** Turbopack (enabled in next.config.ts)
- **Deployment Target:** Vercel

---

## PROJECT STRUCTURE

```
ai-tools-hub/
├── app/
│   ├── layout.tsx                    # Root layout: Header + Footer wrapper
│   ├── page.tsx                      # Homepage (server component)
│   ├── globals.css                   # Global Tailwind styles + dark theme tokens
│   ├── favicon.ico
│   ├── sitemap.ts                    # Auto-generated XML sitemap
│   ├── robots.ts                     # Auto-generated robots.txt
│   │
│   ├── (pages)/                      # Static/informational pages (route group)
│   │   ├── about/page.tsx            # About the site/author (E-E-A-T trust signals)
│   │   ├── contact/page.tsx          # Contact form page
│   │   ├── privacy-policy/page.tsx   # Privacy policy (AdSense + cookies disclosure)
│   │   ├── terms/page.tsx            # Terms of service
│   │   └── affiliate-disclosure/page.tsx  # FTC-required affiliate disclosure
│   │
│   ├── tools/                        # Tool directory
│   │   ├── page.tsx                  # /tools — grid of all tools, filterable by category
│   │   └── [slug]/page.tsx           # /tools/[slug] — individual tool review page
│   │
│   ├── blog/                         # Blog/comparison content
│   │   ├── page.tsx                  # /blog — list of all posts
│   │   └── [slug]/page.tsx           # /blog/[slug] — individual post
│   │
│   ├── category/
│   │   └── [slug]/page.tsx           # /category/[slug] — tools + posts grouped by category
│   │
│   ├── search/page.tsx               # Site-wide search results page
│   │
│   ├── api/
│   │   ├── contact-email/route.ts    # POST: Contact form submissions via Resend
│   │   └── newsletter/
│   │       └── subscribe/route.ts    # POST: Newsletter subscription (stores in Sanity)
│   │
│   └── studio/
│       └── [[...tool]]/page.tsx      # Embedded Sanity Studio
│
├── components/
│   ├── homepage-content-wrapper.tsx  # Homepage orchestrator (hero, featured tools, latest posts, search)
│   │
│   ├── navigation/
│   │   ├── header.tsx                # Sticky header with scroll detection, mobile menu, search bar
│   │   └── footer.tsx                # Multi-column footer with links + newsletter form
│   │
│   ├── tools/
│   │   ├── tool-card.tsx             # Tool card (logo, name, short description, category tag, rating, CTA)
│   │   ├── tool-grid.tsx             # Responsive grid layout for tool cards
│   │   ├── tool-filter-bar.tsx       # Category filter buttons/dropdown for /tools page
│   │   ├── tool-detail.tsx           # Full tool review layout (overview, pricing table, pros/cons, FAQ, CTA)
│   │   └── affiliate-cta-button.tsx  # Reusable affiliate CTA button (pulls URL from config/affiliates.ts)
│   │
│   ├── blog/
│   │   ├── post-card.tsx             # Blog post preview card
│   │   ├── post-grid.tsx             # Responsive grid/list for post cards
│   │   └── post-content.tsx          # PortableText renderer with custom styling for blog body
│   │
│   ├── shared/
│   │   ├── related-content.tsx       # "Related Tools" / "Related Posts" — internal linking component
│   │   ├── breadcrumbs.tsx           # Breadcrumb navigation (auto-built from URL path)
│   │   ├── faq-accordion.tsx         # Expandable FAQ section (used on tool & blog pages)
│   │   ├── pros-cons-list.tsx        # Two-column pros/cons display
│   │   └── schema-markup.tsx         # JSON-LD injector — accepts type + data, renders <script>
│   │
│   ├── search/
│   │   └── search-bar.tsx            # Live search with debounce, dropdown results
│   │
│   ├── newsletter/
│   │   ├── newsletter-form.tsx       # Email form with Zod validation
│   │   └── newsletter-section.tsx    # Newsletter CTA section (variants: default, footer)
│   │
│   ├── ads/
│   │   └── ad-slot.tsx               # Wrapper component for AdSense ad units (placeholder until approved)
│   │
│   └── ui/                           # shadcn/ui base components
│       └── card.tsx
│
├── lib/
│   ├── utils.ts                      # cn() utility for Tailwind class merging
│   │
│   ├── client/
│   │   ├── config.ts                 # Sanity config (projectId, dataset, apiVersion)
│   │   ├── client.ts                 # Sanity client factory (read + write token support)
│   │   ├── index.ts                  # Client exports
│   │   ├── queries.ts                # ALL GROQ queries (see detailed section below)
│   │   └── utils.ts                  # Data transformation helpers
│   │
│   ├── config/
│   │   └── affiliates.ts             # Central map of toolSlug -> affiliate URL (single source of truth)
│   │
│   ├── seo/
│   │   ├── schema.ts                 # Helper functions to build JSON-LD objects (Article, Review, FAQPage, BreadcrumbList)
│   │   └── metadata.ts               # Helper to build Next.js Metadata objects from Sanity SEO fields
│   │
│   └── animations/
│       └── index.tsx                 # Framer Motion wrappers: FadeIn, SlideInLeft, StaggerContainer, StaggerItem
│
├── sanity/
│   ├── env.ts                        # Sanity env vars
│   ├── structure.ts                  # Sanity Studio sidebar navigation structure
│   │
│   ├── schemaTypes/
│   │   ├── index.ts                  # Schema exports array
│   │   ├── tool.ts                   # AI Tool schema
│   │   ├── post.ts                   # Blog post schema
│   │   ├── category.ts               # Category schema (shared by tools + posts)
│   │   ├── newsletter.ts             # Newsletter subscriber schema
│   │   └── seo.ts                    # SEO metadata schema
│   │
│   └── lib/
│       ├── client.ts                 # next-sanity server client (CDN enabled)
│       ├── image.ts                  # Image URL builder (urlFor helper)
│       └── live.ts                   # Sanity live content API
│
├── types/
│   └── content-types.ts              # TypeScript interfaces for Tool, Post, Category, etc.
│
├── sanity.config.ts                  # Sanity Studio config (basePath: /studio, plugins: structureTool, visionTool)
├── sanity.cli.ts                      # Sanity CLI config
├── next.config.ts                    # Next.js config (turbopack, typedRoutes, image remotePatterns)
├── tsconfig.json                     # TypeScript config (strict, bundler resolution, @/* path alias)
├── components.json                   # shadcn/ui config (new-york style)
├── postcss.config.mjs                # PostCSS with @tailwindcss/postcss
└── eslint.config.mjs                 # ESLint config
```

---

## SANITY CMS SCHEMAS (Complete Definitions)

### 1. TOOL Schema (`tool.ts` — Document Type)
```
Fields:
- title (string) — Required, max 100 chars (e.g. "ChatGPT")
- slug (slug) — Auto-generated from title, required
- logo (image) — Required, tool logo/icon
- shortDescription (string) — Required, max 200 chars (used on cards)
- tagline (string) — Optional, max 100 chars (e.g. "Best for general-purpose AI chat")
- category (reference to Category) — Required
- pricingModel (string) — Required, dropdown: "Free", "Freemium", "Paid", "Free Trial"
- pricingPlans (array of objects) — Min 1. Each object:
    - planName (string) — e.g. "Free", "Plus", "Pro", "Team"
    - price (string) — e.g. "$0", "$20/month", "Contact for pricing"
    - features (array of strings) — Key features for this plan
- rating (number) — Required, 1-5, step 0.1 (your editorial rating)
- pros (array of strings) — Min 1
- cons (array of strings) — Min 1
- useCases (array of strings) — Min 1, e.g. "Content writing", "Code generation"
- affiliateSlug (string) — Required, key used to look up the affiliate URL in config/affiliates.ts
- officialUrl (string/url) — Required, the tool's actual website (non-affiliate, used for "Visit Official Site")
- overview (portable text) — Required, full review body
- faqs (array of objects) — Min 0. Each object:
    - question (string)
    - answer (text)
- relatedTools (array of references to Tool) — Max 4, manually curated internal links
- relatedPosts (array of references to Post) — Max 3, manually curated internal links
```

### 2. POST Schema (`post.ts` — Document Type)
```
Fields:
- title (string) — Required, max 150 chars
- slug (slug) — Auto-generated from title, required
- coverImage (image) — Required
- excerpt (string) — Required, max 250 chars (used on cards + meta description fallback)
- category (reference to Category) — Required
- publishedAt (datetime) — Required
- updatedAt (datetime) — Optional, shown if post has been refreshed
- body (portable text) — Required, full article content
- faqs (array of objects) — Min 0. Each object:
    - question (string)
    - answer (text)
- relatedTools (array of references to Tool) — Max 6, manually curated internal links (this is the primary affiliate placement mechanism)
- relatedPosts (array of references to Post) — Max 3
```

### 3. CATEGORY Schema (`category.ts` — Document Type)
```
Fields:
- title (string) — Required, max 60 chars (e.g. "AI Writing Tools", "AI Coding Assistants")
- slug (slug) — Auto-generated from title, required
- description (text) — Optional, max 300 chars — shown at top of /category/[slug] page
- icon (string) — Optional, lucide-react icon name for category nav/filter UI

Preview: title as title, description as subtitle
```

### 4. NEWSLETTER Schema (`newsletter.ts` — Document Type)
```
Fields:
- email (string) — Required, email validation regex
- source (string) — Required, dropdown: "Footer", "Tool Page", "Blog Page", "Homepage"
- subscribedAt (datetime) — Auto-set on creation

Preview: email as title, "Source: {source}" as subtitle
```

### 5. SEO Schema (`seo.ts` — Document Type)
```
Fields:
- pageSlug (string) — Required, identifies the page (e.g. "tools/chatgpt", "blog/best-ai-writing-tools-2026")
- pageTitle (string) — Required, max 70 chars
- pageDescription (text) — Required, max 160 chars
- ogImage (image) — For social sharing
- keywords (array of strings) — Max 10
- canonicalUrl (url) — Optional
- noIndex (boolean) — Default false

Preview: pageSlug as title, pageTitle as subtitle
```

---

## SANITY STUDIO STRUCTURE

Configure the Sanity Studio sidebar (`structure.ts`) with these sections, each as a list with newest-first ordering:
1. **AI Tools** — tool documents
2. **Blog Posts** — post documents
3. **Categories** — category documents
4. **Newsletter** — newsletter subscriber documents
5. **SEO** — seo documents

All sections use form-only views (no preview pane, just the editing form), except Tools and Posts which should show a thumbnail preview (logo/coverImage) in the list.

---

## GROQ QUERIES (lib/client/queries.ts)

Implement ALL of these GROQ queries:

### 1. `getAllToolsQuery`
Fetches all tool documents. For each return: _id, title, slug, logo, shortDescription, tagline, category->{title, slug}, pricingModel, rating, affiliateSlug.

### 2. `getToolBySlugQuery`
Takes a `$slug` parameter. Returns the FULL tool document: all fields including pricingPlans, pros, cons, useCases, overview, faqs, officialUrl, affiliateSlug, category->{title, slug}, relatedTools[]->{title, slug, logo, shortDescription, rating}, relatedPosts[]->{title, slug, coverImage, excerpt}.

### 3. `getToolsByCategoryQuery`
Takes a `$categorySlug` parameter. Returns all tools where `category->slug.current == $categorySlug`, same fields as `getAllToolsQuery`.

### 4. `getAllPostsQuery`
Fetches all post documents, ordered by `publishedAt desc`. For each return: _id, title, slug, coverImage, excerpt, category->{title, slug}, publishedAt.

### 5. `getPostBySlugQuery`
Takes a `$slug` parameter. Returns the FULL post document: all fields including body, faqs, publishedAt, updatedAt, category->{title, slug}, relatedTools[]->{title, slug, logo, shortDescription, rating, affiliateSlug}, relatedPosts[]->{title, slug, coverImage, excerpt}.

### 6. `getPostsByCategoryQuery`
Takes a `$categorySlug` parameter. Returns all posts where `category->slug.current == $categorySlug`, same fields as `getAllPostsQuery`.

### 7. `getAllCategoriesQuery`
Fetches all categories: title, slug, description, icon.

### 8. `getCategoryBySlugQuery`
Takes a `$slug` parameter. Returns the category (title, slug, description, icon) plus its tools and posts (combine results of queries 3 and 6 logic into one query using two subqueries).

### 9. `getSeoByPageSlugQuery`
Takes a `$pageSlug` parameter. Fetches SEO metadata for that page.

### 10. `getSearchResultsQuery`
Takes a `$searchTerm` parameter. Searches across both tool and post documents where `title match $searchTerm + "*"` or `shortDescription`/`excerpt` matches. Returns `_type`, title, slug, and a short description field (use `shortDescription` for tools, `excerpt` for posts) so the search UI can render mixed results.

### 11. `getHomepageContentQuery`
Fetches:
- Top 6 tools by `rating desc` (featured tools)
- Latest 4 posts by `publishedAt desc`
- All categories (for nav/quick links)

---

## COMPONENT LOGIC (Detailed Behavior)

### Header (`components/navigation/header.tsx`)
- **Client component** with `"use client"`
- **Scroll detection:** useState + useEffect with scroll listener. When `scrollY > 10`, apply a different background/shadow style
- **Mobile menu:** useState toggle. Hamburger icon transforms to X. Menu slides in with Framer Motion AnimatePresence
- **Desktop nav links:** Home, Tools, Blog, About, Contact — with underline hover effect
- **Search bar** embedded in the header (desktop only), links to `/search?q=...`
- **Logo** links to homepage

### Footer (`components/navigation/footer.tsx`)
- **Client component**
- **Multi-column grid:** Tools categories (links to /category/[slug]), Company links (About, Contact, Privacy, Terms, Affiliate Disclosure), Newsletter signup
- **FadeIn animations** on scroll
- **Copyright + legal links**
- **Affiliate disclaimer line:** short one-sentence reminder ("This site contains affiliate links...") with link to full disclosure page

### Homepage Content Wrapper (`components/homepage-content-wrapper.tsx`)
- **Server component** — fetches directly via Sanity server client using `getHomepageContentQuery` (no client-side fetching needed for SEO-critical homepage content)
- **Sections rendered in order:**
  1. Hero section — headline, short pitch, search bar, primary CTA ("Browse Tools")
  2. Featured tools section (ToolGrid with top 6 rated tools)
  3. Category quick-links grid (all categories as clickable cards)
  4. Latest blog posts section (PostGrid with 4 latest posts)
  5. Newsletter CTA section
- **No client-side loading spinners needed** — server-rendered for SEO

### Search Bar (`components/search/search-bar.tsx`)
- **Client component** with useState, useEffect, useRef
- **Debounced search:** 300ms timeout after user stops typing before firing Sanity query via `getSearchResultsQuery`
- **Dropdown results panel:** Appears below search input, shows mixed tool/post results with type badge ("Tool" / "Article"), title, truncated description
- **Click-outside detection:** useRef + mousedown event listener to close dropdown
- Pressing Enter or clicking "View all results" navigates to `/search?q=...`

### Tool Card (`components/tools/tool-card.tsx`)
- Logo, title, shortDescription (truncated), category tag (small pill, links to /category/[slug]), star rating display, pricingModel badge, "Read Review" button linking to `/tools/[slug]`

### Tool Grid (`components/tools/tool-grid.tsx`)
- Pure presentational component
- Responsive CSS grid: 1 column on mobile, 2 on sm, 3 on lg, 4 on xl
- Maps array of tools to ToolCard components

### Tool Filter Bar (`components/tools/tool-filter-bar.tsx`)
- **Client component**
- Renders category buttons (from getAllCategoriesQuery, passed as prop) + "All" option
- On click, updates URL search param `?category=slug` (use `useRouter` + `useSearchParams`)
- Highlights active category

### Tool Detail (`components/tools/tool-detail.tsx`)
- **Server component** — receives full tool data as props
- Layout sections in order:
  1. Header: logo, title, tagline, rating, category tag, "Visit Official Site" button (officialUrl) + primary AffiliateCtaButton
  2. Overview (PortableText render of `overview`)
  3. Pricing table (map over pricingPlans — plan name, price, feature list)
  4. Pros & Cons (ProsConsList component)
  5. Use cases (simple tag/chip list)
  6. FAQ accordion (FaqAccordion component, only rendered if faqs[] non-empty)
  7. Secondary AffiliateCtaButton (bottom CTA, repeated for conversion)
  8. RelatedContent component (relatedTools + relatedPosts)
- Injects Review + FAQPage + BreadcrumbList JSON-LD via SchemaMarkup component

### Affiliate CTA Button (`components/tools/affiliate-cta-button.tsx`)
- Props: `affiliateSlug` (string), `label` (string, default "Try [Tool Name]"), `variant` ('primary' | 'secondary')
- Looks up the actual URL from `lib/config/affiliates.ts` using `affiliateSlug`
- Renders as `<a target="_blank" rel="noopener noreferrer sponsored">` — the `sponsored` rel attribute is important for Google's affiliate link guidelines
- If `affiliateSlug` has no matching entry in config, falls back to a styled but disabled-looking button with a console warning (so missing affiliate links are caught during development)

### Post Content (`components/blog/post-content.tsx`)
- PortableText renderer with custom component overrides:
  - Headings (h2, h3) get auto-generated `id` attributes for potential anchor links
  - Images render via Next.js `<Image>` with lazy loading
  - Custom block type for "tool callout" (if used) renders a mini ToolCard inline — optional enhancement, build the basic PortableText renderer first and note this as an extension point

### Related Content (`components/shared/related-content.tsx`)
- Props: `tools` (array, optional), `posts` (array, optional)
- Renders two sections side-by-side on desktop, stacked on mobile: "Related Tools" (small ToolCards) and "You Might Also Like" (small PostCards)
- This is the primary internal-linking mechanism — must appear on every tool and post page

### Breadcrumbs (`components/shared/breadcrumbs.tsx`)
- Props: array of `{ label: string, href?: string }` (last item has no href — it's the current page)
- Renders `Home > Category > Page Title` style trail with `>` separators
- Also generates the corresponding BreadcrumbList JSON-LD (pass to SchemaMarkup)

### FAQ Accordion (`components/shared/faq-accordion.tsx`)
- **Client component** with useState for open/closed index
- Props: `faqs` array of `{ question, answer }`
- Click question to expand/collapse answer, only one open at a time (or allow multiple — either is fine, pick one and be consistent)

### Pros/Cons List (`components/shared/pros-cons-list.tsx`)
- Props: `pros` (string[]), `cons` (string[])
- Two-column layout (stacks on mobile): green checkmarks for pros, red x-marks for cons (lucide-react CheckCircle / XCircle icons)

### Schema Markup (`components/shared/schema-markup.tsx`)
- Props: `schema` (object or array of objects — pre-built JSON-LD from `lib/seo/schema.ts` helpers)
- Renders `<script type="application/ld+json">` with `dangerouslySetInnerHTML` containing `JSON.stringify(schema)`

### Newsletter Form (`components/newsletter/newsletter-form.tsx`)
- Uses react-hook-form + Zod for email validation
- States: isSubmitting, isSubmitted, error
- Submits to `/api/newsletter/subscribe`
- Success message auto-hides after 5 seconds
- Resets form on success
- Accepts a `source` prop to pass through to the API (Footer, Tool Page, Blog Page, Homepage)

### Newsletter Section (`components/newsletter/newsletter-section.tsx`)
- Props: `variant` ('default' | 'footer')
- Different layouts per variant
- Success animation with CheckCircle icon
- Privacy disclaimer text + link to privacy policy

### Ad Slot (`components/ads/ad-slot.tsx`)
- Props: `slot` (string identifier, e.g. "tool-page-top", "blog-in-content", "sidebar")
- Renders a styled placeholder `<div>` with the slot name visible (dev mode) and a comment block showing where the actual AdSense `<ins>` tag + script will go once AdSense is approved
- This lets the layout be designed around ad placement now, with a single point of update later
- Placement guidance to follow: one slot near top of tool/post pages (below header/hero), one mid-content on long blog posts, one in sidebar/related section — never more than 3 per page, never adjacent to navigation

### Framer Motion Animation Wrappers (`lib/animations/index.tsx`)
Create reusable animation components:
- `FadeIn` — Fade in when entering viewport (whileInView)
- `SlideInLeft` — Slide from left on scroll
- `StaggerContainer` — Parent that staggers children animations
- `StaggerItem` — Individual item in a stagger group

---

## SEO HELPERS (lib/seo/)

### `lib/seo/schema.ts`
Export pure functions that build JSON-LD objects:
- `buildArticleSchema(post)` — returns Article schema object (headline, description, image, datePublished, dateModified, author)
- `buildReviewSchema(tool)` — returns Review schema object (itemReviewed, reviewRating, author, datePublished)
- `buildFaqSchema(faqs)` — returns FAQPage schema object from an array of {question, answer}
- `buildBreadcrumbSchema(items)` — returns BreadcrumbList schema object from an array of {label, href}

### `lib/seo/metadata.ts`
Export `buildMetadata({ title, description, ogImage, canonicalUrl, noIndex })` returning a Next.js `Metadata` object. Used in every page's `generateMetadata()` function, pulling values from the SEO Sanity document via `getSeoByPageSlugQuery`, with sensible fallbacks (e.g. fall back to `excerpt`/`shortDescription` if no SEO doc exists for that slug).

---

## API ROUTES LOGIC

### POST `/api/contact-email/route.ts`
1. Parse JSON body: `{ name, email, subject, message }`
2. Validate all fields present + email format (regex: `/\S+@\S+\.\S+/`)
3. Send email via Resend SDK:
   - From: `FROM_EMAIL` env var
   - To: `ADMIN_EMAIL` env var
   - Subject: `"New Contact: {subject}"`
   - HTML body: Styled email template with sender info, message, timestamp
4. Return `{ success: true }` or `{ error: message }` with appropriate status codes

### POST `/api/newsletter/subscribe/route.ts`
1. Parse JSON body: `{ email, source }`
2. Validate email format
3. **Check for duplicate:** Query Sanity for existing email (case-insensitive, stored lowercase)
4. If duplicate, return error "Already subscribed"
5. Create newsletter document in Sanity using write client:
   ```
   { _type: 'newsletter', email: email.toLowerCase(), source, subscribedAt: new Date().toISOString() }
   ```
6. Requires `SANITY_API_WRITE_TOKEN` env var
7. Return success with timestamp

---

## PAGE-BY-PAGE LOGIC

### Homepage (`app/page.tsx`)
- Server component, renders `HomepageContentWrapper`
- `generateMetadata()` uses SEO doc for slug `"home"`, falls back to site-wide default title/description

### Tools Directory (`app/tools/page.tsx`)
- Server component
- Reads `?category=` search param
- If present, fetch via `getToolsByCategoryQuery`; else `getAllToolsQuery`
- Renders ToolFilterBar (categories from `getAllCategoriesQuery`) + ToolGrid
- Breadcrumbs: Home > Tools

### Tool Detail (`app/tools/[slug]/page.tsx`)
- Server component, `generateStaticParams()` from all tool slugs (for static generation)
- Fetch via `getToolBySlugQuery`
- 404 (Next.js `notFound()`) if no tool matches
- Renders ToolDetail component
- `generateMetadata()` uses SEO doc for `tools/[slug]`, falls back to tool's tagline/shortDescription
- Breadcrumbs: Home > Tools > [Category] > [Tool Title]

### Blog Listing (`app/blog/page.tsx`)
- Server component
- Reads `?category=` search param, same pattern as Tools Directory
- Renders PostGrid
- Breadcrumbs: Home > Blog

### Blog Post (`app/blog/[slug]/page.tsx`)
- Server component, `generateStaticParams()` from all post slugs
- Fetch via `getPostBySlugQuery`
- 404 if no post matches
- Renders: Breadcrumbs, title, cover image, published/updated dates, PostContent (body), AdSlot ("blog-in-content") inserted after roughly the first third of the content, FaqAccordion (if faqs present), RelatedContent
- `generateMetadata()` uses SEO doc for `blog/[slug]`, falls back to post excerpt
- Injects Article + FAQPage (if applicable) + BreadcrumbList JSON-LD

### Category Page (`app/category/[slug]/page.tsx`)
- Server component, `generateStaticParams()` from all category slugs
- Fetch via `getCategoryBySlugQuery`
- Renders category title/description, then ToolGrid (category's tools) and PostGrid (category's posts) in two sections
- Breadcrumbs: Home > [Category Title]

### Search Results (`app/search/page.tsx`)
- Server component, reads `?q=` search param
- Fetch via `getSearchResultsQuery`
- Renders mixed results list with type badges, or "No results found" state with suggestion to browse `/tools` or `/blog`

### About Page (`app/(pages)/about/page.tsx`)
- Server component (static content)
- Sections: who runs the site / why these reviews can be trusted (E-E-A-T), how reviews are conducted (methodology), contact link
- Use placeholder text marking where personal bio/credentials should go — DO NOT invent fake credentials or fake author names

### Contact Page (`app/(pages)/contact/page.tsx`)
- Client component
- Contact form: name, email, subject, message
- Client-side validation (Zod) before submission
- Submits to `/api/contact-email`
- Success state with "message sent" confirmation + option to send another

### Privacy Policy (`app/(pages)/privacy-policy/page.tsx`)
- Server component, static content
- Must cover: what data is collected (analytics cookies, AdSense cookies once active, newsletter emails), how it's used, third-party services (Google Analytics, Google AdSense, Sanity), user rights, contact for privacy questions
- Mark clearly with a placeholder note: "Review and customize this policy — generate a complete version using a tool like termly.io and merge with this draft before going live"

### Terms of Service (`app/(pages)/terms/page.tsx`)
- Server component, static content
- Standard terms: informational use only, no liability for decisions made based on content, intellectual property notice, governing law placeholder

### Affiliate Disclosure (`app/(pages)/affiliate-disclosure/page.tsx`)
- Server component, static content
- Clear FTC-compliant disclosure: "This site contains affiliate links. If you click a link and make a purchase, we may earn a commission at no additional cost to you. This does not influence our reviews, which reflect our own editorial opinions."

---

## SANITY CLIENT CONFIGURATION

### `lib/client/config.ts`
```typescript
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // For client-side fetching (e.g. search bar — always fresh)
}
```

### `lib/client/client.ts`
Export a `getClient` function that creates a Sanity client. Accept an optional write token parameter for server-side mutations (newsletter subscribe). Default client uses read token only.

### `sanity/lib/client.ts`
Server-side Sanity client with `useCdn: true` for cached production reads — used by all page-level server components (tools, posts, categories, homepage).

### `sanity/lib/image.ts`
Export a `urlFor(source)` helper using `@sanity/image-url` builder configured with projectId and dataset.

---

## TYPE DEFINITIONS (`types/content-types.ts`)

```typescript
interface SanityImage { _type: string; asset: { _ref: string; _type: string } }

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  icon?: string;
}

interface PricingPlan {
  planName: string;
  price: string;
  features: string[];
}

interface Faq {
  question: string;
  answer: string;
}

interface Tool {
  _id: string;
  _type: 'tool';
  title: string;
  slug: { current: string };
  logo: SanityImage;
  shortDescription: string;
  tagline?: string;
  category: { title: string; slug: { current: string } };
  pricingModel: 'Free' | 'Freemium' | 'Paid' | 'Free Trial';
  pricingPlans: PricingPlan[];
  rating: number;
  pros: string[];
  cons: string[];
  useCases: string[];
  affiliateSlug: string;
  officialUrl: string;
  overview: any[]; // Portable text blocks
  faqs: Faq[];
  relatedTools?: Tool[];
  relatedPosts?: Post[];
}

interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  excerpt: string;
  category: { title: string; slug: { current: string } };
  publishedAt: string;
  updatedAt?: string;
  body: any[]; // Portable text blocks
  faqs: Faq[];
  relatedTools?: Tool[];
  relatedPosts?: Post[];
}

interface SeoDoc {
  pageSlug: string;
  pageTitle: string;
  pageDescription: string;
  ogImage?: SanityImage;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}
```

---

## AFFILIATE CONFIG (`lib/config/affiliates.ts`)

```typescript
// Single source of truth for affiliate links.
// Keyed by the `affiliateSlug` field on each Tool document.
// Update links here — never hardcode affiliate URLs in components or Sanity content.

export const affiliateLinks: Record<string, string> = {
  // example entries — replace with real affiliate URLs
  chatgpt: "https://chat.openai.com/",
  claude: "https://claude.ai/",
  midjourney: "https://www.midjourney.com/",
};

export function getAffiliateUrl(affiliateSlug: string): string | null {
  return affiliateLinks[affiliateSlug] ?? null;
}
```

---

## ENVIRONMENT VARIABLES NEEDED

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=

# Email (Resend)
RESEND_API_KEY=
FROM_EMAIL=
ADMIN_EMAIL=

# Analytics (added once accounts are created)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

---

## NEXT.JS CONFIGURATION (`next.config.ts`)

```typescript
const nextConfig = {
  experimental: {
    turbo: { root: process.cwd() },
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## KEY IMPLEMENTATION RULES

1. **No shopping cart, no checkout, no payments** — this is a content/affiliate site. The only "conversions" are affiliate clicks (external links) and newsletter signups.

2. **All tool, post, and category data comes from Sanity CMS** — no hardcoded content arrays for tools/posts. Seed content (Phase 2/3) is entered into Sanity, not hardcoded in components.

3. **Affiliate links are centralized** — every affiliate link lives in `lib/config/affiliates.ts`, referenced via `affiliateSlug`. Never hardcode an affiliate URL in a component or Sanity field.

4. **Server-side data fetching by default** — all page-level content (homepage, tools, posts, categories) uses async server components with the server Sanity client (`useCdn: true`). Only the search bar uses client-side fetching, since it needs live debounced queries.

5. **SEO metadata on every page** — every route implements `generateMetadata()` using the helpers in `lib/seo/metadata.ts`. No page should ship without a title and description.

6. **JSON-LD schema on tool and post pages** — Review+FAQPage+BreadcrumbList for tools, Article+FAQPage+BreadcrumbList for posts, via the SchemaMarkup component.

7. **Internal linking is mandatory** — every tool page renders `relatedTools` + `relatedPosts`, every post page renders `relatedTools` + `relatedPosts`, via the RelatedContent component. This drives the multi-page-per-session behavior the whole monetization model depends on.

8. **Ad slots are placeholders for now** — use the AdSlot component everywhere ads will eventually go, but do not wire up real AdSense script tags until the site is approved. This keeps layout stable when ads are added later.

9. **Newsletter stores in Sanity** — subscribers are stored as Sanity documents via the write client, no third-party email service for now.

10. **Styling will be handled separately** — apply no custom color palette or design decisions of your own. Leave visual styling (colors, spacing, typography, dark theme tokens) to be filled in by the styling skill that will be provided. Use only structural Tailwind utility classes (layout, flex, grid, sizing) where strictly necessary for the component to render correctly. Do not invent a color scheme.

11. **All forms use react-hook-form + Zod** — never use uncontrolled forms or manual validation.

12. **Image optimization** — all Sanity images use the `urlFor()` builder with width/height params, rendered via Next.js `<Image>` with lazy loading and AVIF/WebP formats.

13. **No placeholder/lorem ipsum text in shipped pages** — if real content isn't available yet (e.g. About page bio), insert a clearly marked `{/* TODO: replace with real content */}` comment and a short visible placeholder, not filler paragraphs.

---

## BUILD PHASES

Propose this plan in plan mode, get my approval, then build one phase at a time — stop after each phase for review before continuing:

**Phase 1 — Foundation:** Next.js + TypeScript + Tailwind init, folder structure, dark theme design tokens (globals.css), base layout (Header + Footer), homepage skeleton with placeholder sections, sitemap.ts + robots.ts.

**Phase 2 — Sanity + Tool Directory:** Sanity Studio setup with all 5 schemas, GROQ queries file, `/tools` directory page with filter bar, `/tools/[slug]` detail page with full ToolDetail component, AffiliateCtaButton + affiliates config, schema markup for tools. Seed 3 real example tools (ChatGPT, Claude, Midjourney) directly in Sanity content (I'll provide the written review content — see separate seed content request).

**Phase 3 — Blog:** `/blog` listing + `/blog/[slug]` detail page, PostContent renderer, FaqAccordion, AdSlot placements, Article schema markup. Seed 1 example "Best AI Tools" comparison post linking to Phase 2 tools.

**Phase 4 — Categories, Search, Internal Linking:** `/category/[slug]` pages, RelatedContent component wired into tool/post pages, Breadcrumbs everywhere, `/search` page + header search bar.

**Phase 5 — Trust & Legal Pages:** About, Contact (+ API route + Resend), Privacy Policy, Terms, Affiliate Disclosure.

**Phase 6 — Newsletter + Final SEO Pass:** Newsletter schema + API route + form components wired into footer/pages, metadata helpers applied across all pages, final sitemap/robots check, Lighthouse/Core Web Vitals pass.

---

## WHAT I WILL PROVIDE SEPARATELY

- Site name, logo
- Styling skill (will be provided to Claude Code separately — do not make visual design decisions)
- Real affiliate URLs for `lib/config/affiliates.ts`
- Seed content for the 3 example tool reviews + 1 blog post (full written text)
- About page bio/credentials
- Sanity project credentials
- Resend API key
- Domain/deployment details

---

**Build the COMPLETE codebase following this specification, phase by phase. Every file, every component, every query, every API route per phase — no placeholders or stubs except where explicitly marked (About bio, affiliate URLs before I provide them, ad units before AdSense approval). The site should be fully functional once I plug in my credentials and seed content.**
