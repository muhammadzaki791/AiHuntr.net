import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

/**
 * Dynamic Open Graph image generator.
 *
 * GET /api/og?title=...&image=...
 *   title — the page/post/tool title, rendered as the headline (required)
 *   image — optional absolute URL used as a dark-toned background (e.g. a blog
 *           cover or tool logo). When absent, a branded gradient is used.
 *
 * Referenced from lib/seo/metadata.ts so every page gets a share image. Runs on
 * the edge and is cached; output is 1200×630 (the standard OG size).
 */
export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? siteConfig.name;
  // Keep headlines readable — trim overly long titles for the card.
  const title = rawTitle.length > 110 ? `${rawTitle.slice(0, 107)}…` : rawTitle;
  const image = searchParams.get("image");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          // Dark base; a content image (if any) sits behind a dark overlay.
          backgroundColor: "#0a0a0a",
          backgroundImage: image
            ? `linear-gradient(rgba(10,10,10,0.72), rgba(10,10,10,0.9)), url(${image})`
            : "radial-gradient(circle at 25% 15%, #1e1b4b 0%, #0a0a0a 55%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#6366f1",
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            AI
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 60 : 76,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            color: "#a1a1aa",
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
