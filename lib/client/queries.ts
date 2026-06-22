import { groq } from "next-sanity";

/**
 * Centralized GROQ queries. Every page-level read uses one of these — do not
 * scatter inline queries across components. Projections are kept lean for list
 * queries and full for detail queries.
 */

// Shared projection fragments (kept in sync with types/content-types.ts).
const TOOL_LIST_FIELDS = groq`
  _id,
  _type,
  title,
  slug,
  logo,
  shortDescription,
  tagline,
  "category": category->{title, slug},
  pricingModel,
  rating,
  affiliateSlug
`;

const POST_LIST_FIELDS = groq`
  _id,
  _type,
  title,
  slug,
  coverImage,
  excerpt,
  "category": category->{title, slug},
  publishedAt
`;

// 1. All tools (directory grid).
export const getAllToolsQuery = groq`
  *[_type == "tool"] | order(rating desc) {
    ${TOOL_LIST_FIELDS}
  }
`;

// 2. Single tool, full document, with resolved related content.
export const getToolBySlugQuery = groq`
  *[_type == "tool" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    logo,
    shortDescription,
    tagline,
    "category": category->{title, slug},
    pricingModel,
    pricingPlans,
    rating,
    pros,
    cons,
    useCases,
    affiliateSlug,
    officialUrl,
    overview,
    faqs,
    "relatedTools": relatedTools[]->{
      _id, _type, title, slug, logo, shortDescription, tagline,
      "category": category->{title, slug}, pricingModel, rating, affiliateSlug
    },
    "relatedPosts": relatedPosts[]->{
      _id, _type, title, slug, coverImage, excerpt,
      "category": category->{title, slug}, publishedAt
    }
  }
`;

// 3. Tools in a category.
export const getToolsByCategoryQuery = groq`
  *[_type == "tool" && category->slug.current == $categorySlug] | order(rating desc) {
    ${TOOL_LIST_FIELDS}
  }
`;

// 4. All posts, newest first.
export const getAllPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${POST_LIST_FIELDS}
  }
`;

// 5. Single post, full document, with resolved related content.
export const getPostBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    coverImage,
    excerpt,
    "category": category->{title, slug},
    publishedAt,
    updatedAt,
    body,
    faqs,
    "relatedTools": relatedTools[]->{
      _id, _type, title, slug, logo, shortDescription, tagline,
      "category": category->{title, slug}, pricingModel, rating, affiliateSlug
    },
    "relatedPosts": relatedPosts[]->{
      _id, _type, title, slug, coverImage, excerpt,
      "category": category->{title, slug}, publishedAt
    }
  }
`;

// 6. Posts in a category.
export const getPostsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    ${POST_LIST_FIELDS}
  }
`;

// 7. All categories, most populated first (tools + posts), then alphabetical.
//    `count` powers the /category index ordering and the per-card item count.
export const getAllCategoriesQuery = groq`
  *[_type == "category"] {
    _id, title, slug, description, icon,
    "count": count(*[_type in ["tool", "post"] && references(^._id)])
  } | order(count desc, title asc)
`;

// 8. Category with its tools and posts (two subqueries in one fetch).
export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    icon,
    "tools": *[_type == "tool" && category->slug.current == $slug] | order(rating desc) {
      ${TOOL_LIST_FIELDS}
    },
    "posts": *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {
      ${POST_LIST_FIELDS}
    }
  }
`;

// 9. SEO metadata for a page slug.
export const getSeoByPageSlugQuery = groq`
  *[_type == "seo" && pageSlug == $pageSlug][0]{
    pageSlug, pageTitle, pageDescription, ogImage, keywords, canonicalUrl, noIndex
  }
`;

// 10. Mixed tool/post search by title/description.
export const getSearchResultsQuery = groq`
  *[
    (_type == "tool" && (title match $searchTerm + "*" || shortDescription match $searchTerm + "*"))
    || (_type == "post" && (title match $searchTerm + "*" || excerpt match $searchTerm + "*"))
  ] | order(_type asc) {
    _id,
    _type,
    title,
    slug,
    "description": select(
      _type == "tool" => shortDescription,
      _type == "post" => excerpt
    )
  }
`;

// 11. Homepage content: top 6 tools, latest 4 posts, top 8 most-populated categories.
export const getHomepageContentQuery = groq`
  {
    "featuredTools": *[_type == "tool"] | order(rating desc)[0...6] {
      ${TOOL_LIST_FIELDS}
    },
    "latestPosts": *[_type == "post"] | order(publishedAt desc)[0...4] {
      ${POST_LIST_FIELDS}
    },
    "categories": *[_type == "category"] {
      _id, title, slug, description, icon,
      "count": count(*[_type in ["tool", "post"] && references(^._id)])
    } | order(count desc, title asc)[0...8]
  }
`;

/** Slug-only queries for generateStaticParams / sitemap. */
export const getAllToolSlugsQuery = groq`
  *[_type == "tool" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`;

export const getAllPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`;

export const getAllCategorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`;
