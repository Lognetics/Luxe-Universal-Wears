import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { triggerRebuild } from "@/lib/rebuild";

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
 * the site asks Vercel to build again, and the build pulls the catalogue from
 * NETICS. NETICS coalesces a burst of edits into one event, so a busy
 * afternoon in the console is a handful of builds, not fifty. Order events
 * are acknowledged: NETICS keeps the stock itself now, and the order board
 * there shows every one of them.
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
    try {
      const result = await triggerRebuild(`catalogue.updated ${delivery.id}`);
      return NextResponse.json({ received: true, event: delivery.event, ...result });
    } catch (error) {
      // Worth a retry from NETICS: say so with a 500, and say why, since
      // NETICS keeps the receiver's answer in its delivery log.
      const reason = error instanceof Error ? error.message : String(error);
      console.error("[netics webhook] rebuild failed", reason);
      return NextResponse.json({ error: "rebuild failed", detail: reason.slice(0, 400) }, { status: 500 });
    }
  }
  return NextResponse.json({ received: true, event: delivery.event });
}

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      receiver: "netics-webhook",
      configured: Boolean(process.env.NETICS_WEBHOOK_SECRET),
      rebuild: Boolean(process.env.VERCEL_DEPLOY_HOOK_URL),
    },
    { status: 200 },
  );
}
