import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { pushProductsToNetics, toNeticsProduct } from "@/lib/netics";
import { rowToProduct } from "@/lib/supabase/mappers";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * Where NETICS tells this site what happened to an order.
 *
 * Every delivery is signed: `X-Netics-Signature: t=<unix>,v1=<hex>` where v1
 * is HMAC-SHA256 over `<t>.<raw body>` with NETICS_WEBHOOK_SECRET (shown once
 * when the endpoint is registered). Anything unsigned, mis-signed or older
 * than five minutes is refused.
 *
 * What it does today: when an order is paid, the ordered pieces come off
 * stock here and NETICS is told the new stock, so neither the shop nor the
 * concierge keeps selling something that just sold out. Other events are
 * acknowledged and ignored; they are visible on the NETICS order board.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");
const MAX_SKEW_SECONDS = 300;

type Delivery = {
  id: string;
  event: string;
  created_at: string;
  data: Record<string, unknown>;
};

type NeticsOrderItem = { name: string; quantity: number; notes?: string };

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

/** "SKU LUW-123 · Black · L" -> "LUW-123" */
function skuFromNotes(notes: string | undefined): string {
  const match = /(?:^|·)\s*SKU\s+([^·]+)/i.exec(notes ?? "");
  return match ? match[1].trim() : "";
}

async function fetchOrderItems(orderId: string): Promise<NeticsOrderItem[]> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) return [];
  const res = await fetch(`${API_BASE}/api/public/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("[netics webhook] could not read order", orderId, res.status);
    return [];
  }
  const order = (await res.json()) as { items?: NeticsOrderItem[] };
  return order.items ?? [];
}

/** Take a paid order's pieces off stock and tell NETICS the new levels. */
async function applyPaidOrder(orderId: string, reference: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) {
    console.error("[netics webhook] no service Supabase client; stock not updated for", reference);
    return;
  }
  const items = await fetchOrderItems(orderId);
  const touched: Record<string, unknown>[] = [];
  for (const item of items) {
    const sku = skuFromNotes(item.notes);
    const query = sb.from("products").select("*").limit(1);
    const { data: row } = sku
      ? await query.eq("sku", sku).maybeSingle()
      : await query.eq("name", item.name).maybeSingle();
    if (!row) {
      console.warn("[netics webhook] no product for", sku || item.name, "on", reference);
      continue;
    }
    const current = Number(row.stock ?? 0);
    const next = Math.max(0, current - Math.max(1, Number(item.quantity) || 1));
    if (next === current) continue;
    const { data: saved, error } = await sb
      .from("products")
      .update({ stock: next })
      .eq("id", row.id)
      .select("*")
      .maybeSingle();
    if (error) {
      console.error("[netics webhook] stock update failed", row.id, error.message);
      continue;
    }
    if (saved) touched.push(saved);
  }
  if (touched.length) {
    // Best effort: a NETICS hiccup here must not make the delivery fail and
    // be retried, which would take the same pieces off stock twice.
    await pushProductsToNetics(
      touched.map((row) => toNeticsProduct(rowToProduct(row))),
      "merge",
    ).catch((error: unknown) => console.error("[netics webhook] re-push failed", error));
  }
  console.info("[netics webhook] order paid", reference, "stock adjusted for", touched.length, "product(s)");
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

  if (delivery.event === "order.payment_changed" && delivery.data?.to === "paid") {
    const orderId = String(delivery.data.order_id ?? "");
    const reference = String(delivery.data.reference ?? orderId);
    if (orderId) await applyPaidOrder(orderId, reference);
  }
  return NextResponse.json({ received: true, event: delivery.event });
}

export function GET() {
  return NextResponse.json(
    { ok: true, receiver: "netics-webhook", configured: Boolean(process.env.NETICS_WEBHOOK_SECRET) },
    { status: 200 },
  );
}
