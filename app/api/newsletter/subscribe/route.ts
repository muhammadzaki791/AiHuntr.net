import { NextResponse } from "next/server";
import { getClient } from "@/lib/client/client";

/**
 * POST /api/newsletter/subscribe
 *
 * Stores a newsletter subscriber as a Sanity document via the write client.
 * The write token is server-only — this route never runs on the client.
 * Emails are stored lowercased and de-duplicated case-insensitively.
 * Returns { success: true, subscribedAt } or { error } with a status.
 */

interface SubscribePayload {
  email?: unknown;
  source?: unknown;
}

const EMAIL_RE = /\S+@\S+\.\S+/;
const VALID_SOURCES = ["Footer", "Tool Page", "Blog Page", "Homepage"] as const;
type Source = (typeof VALID_SOURCES)[number];

export async function POST(request: Request) {
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const source: Source =
    typeof body.source === "string" &&
    VALID_SOURCES.includes(body.source as Source)
      ? (body.source as Source)
      : "Footer";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    console.error("Newsletter subscribe is not configured (missing write token).");
    return NextResponse.json(
      { error: "Newsletter is not configured. Please try again later." },
      { status: 500 },
    );
  }

  const client = getClient(token);

  try {
    // Duplicate check — emails are stored lowercased, so an exact match works.
    const existing = await client.fetch<string | null>(
      `*[_type == "newsletter" && email == $email][0]._id`,
      { email },
    );
    if (existing) {
      return NextResponse.json(
        { error: "You're already subscribed." },
        { status: 409 },
      );
    }

    const subscribedAt = new Date().toISOString();
    await client.create({
      _type: "newsletter",
      email,
      source,
      subscribedAt,
    });

    return NextResponse.json({ success: true, subscribedAt });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Could not subscribe right now. Please try again later." },
      { status: 502 },
    );
  }
}
