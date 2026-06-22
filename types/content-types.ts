import type { PortableTextBlock } from "@portabletext/types";

/** Minimal Sanity image reference (as stored on documents). */
export interface SanityImage {
  _type: string;
  asset: { _ref: string; _type: string };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Slug {
  current: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: Slug;
  description?: string;
  icon?: string;
  /** Number of tools + posts referencing this category (from list queries). */
  count?: number;
}

export interface PricingPlan {
  planName: string;
  price: string;
  features: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

/** Reference to a category projected down to display fields. */
export interface CategoryRef {
  title: string;
  slug: Slug;
}

/** Lightweight tool shape returned by list queries (cards, grids). */
export interface ToolListItem {
  _id: string;
  _type: "tool";
  title: string;
  slug: Slug;
  logo: SanityImage;
  shortDescription: string;
  tagline?: string;
  category: CategoryRef;
  pricingModel: "Free" | "Freemium" | "Paid" | "Free Trial";
  rating: number;
  affiliateSlug: string;
}

/** Lightweight post shape returned by list queries. */
export interface PostListItem {
  _id: string;
  _type: "post";
  title: string;
  slug: Slug;
  coverImage: SanityImage;
  excerpt: string;
  category: CategoryRef;
  publishedAt: string;
}

export interface Tool {
  _id: string;
  _type: "tool";
  title: string;
  slug: Slug;
  logo: SanityImage;
  shortDescription: string;
  tagline?: string;
  category: CategoryRef;
  pricingModel: "Free" | "Freemium" | "Paid" | "Free Trial";
  pricingPlans: PricingPlan[];
  rating: number;
  pros: string[];
  cons: string[];
  useCases: string[];
  affiliateSlug: string;
  officialUrl: string;
  overview: PortableTextBlock[];
  faqs: Faq[];
  relatedTools?: ToolListItem[];
  relatedPosts?: PostListItem[];
}

export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: Slug;
  coverImage: SanityImage;
  excerpt: string;
  category: CategoryRef;
  publishedAt: string;
  updatedAt?: string;
  body: PortableTextBlock[];
  faqs: Faq[];
  relatedTools?: ToolListItem[];
  relatedPosts?: PostListItem[];
}

export interface CategoryWithContent extends Category {
  tools: ToolListItem[];
  posts: PostListItem[];
}

export interface SeoDoc {
  pageSlug: string;
  pageTitle: string;
  pageDescription: string;
  ogImage?: SanityImage;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

/** Mixed tool/post result row from the search query. */
export interface SearchResult {
  _id: string;
  _type: "tool" | "post";
  title: string;
  slug: Slug;
  description: string;
}

export interface HomepageContent {
  featuredTools: ToolListItem[];
  latestPosts: PostListItem[];
  categories: Category[];
}
