import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CATALOGUE_TAG } from "@/lib/catalogue-data";

/**
 * Where NETICS tells this site what happened.
 *
 * Every delivery is signed: `X-Netics-Signature: t=<unix>,v1=<hex>` where v1
 * is HMAC-SHA256 over `<t>.<raw body>` with NETICS_WEBHOOK_SECRET (shown once
 * when the endpoint is registered). Anything unsigned, mis-signed or older
 * than five minutes is refused.
 *
 * What it does: on `catalogue.updated` (a product, price, picture or stock
 * count changed in NETICS, including pieces taken off stock by a paid order)
 * the cached catalogue is dropped, so the next visit to any page reads the
 * fresh list from NETICS. No build, no commit. Order events are
 * acknowledged: NETICS keeps the stock itself, and the order board there
 * shows every one of them.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SKEW_SECONDS = 300;

type Delivery = {
  id: string;
  event: string;
  created_at: string;
  data: Record<string, unknown>;
};

function verify(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((piece) => piece.trim().split("=", 2) as [string, string]),
  );
  const timestamp = Number(parts.t);
  const signature = parts.v1 ?? "";
  if (!Number.isFinite(timestamp) || !signature) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > MAX_SKEW_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.NETICS_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Loud on purpose: NETICS records the failure, and the Luxe team sees
    // "webhook failing" instead of silently missing every event.
    return NextResponse.json({ error: "NETICS_WEBHOOK_SECRET is not set" }, { status: 503 });
  }
  const rawBody = await request.text();
  if (!verify(rawBody, request.headers.get("x-netics-signature"), secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let delivery: Delivery;
  try {
    delivery = JSON.parse(rawBody) as Delivery;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (delivery.event === "catalogue.updated") {
    // Expire, do not "stale-while-revalidate": the next page view must show
    // the new price, not the old one while a refresh runs behind it. Without
    // a profile Next 16 expires the tag at once (the same path updateTag
    // takes; it only logs a deprecation note), and the path purge drops
    // every rendered page.
    (revalidateTag as (tag: string, profile?: string) => void)(CATALOGUE_TAG);
    revalidatePath("/", "layout");
    console.info("[netics webhook] catalogue refreshed", delivery.id);
    return NextResponse.json({ received: true, event: delivery.event, refreshed: true });
  }
  return NextResponse.json({ received: true, event: delivery.event });
}

export function GET() {
  return NextResponse.json(
    { ok: true, receiver: "netics-webhook", configured: Boolean(process.env.NETICS_WEBHOOK_SECRET) },
    { status: 200 },
  );
}
