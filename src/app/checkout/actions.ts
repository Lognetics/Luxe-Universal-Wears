"use server";

import { createHash } from "node:crypto";

/**
 * Online payment through NETICS.
 *
 * The site never touches card details or a payment provider. It creates the
 * order in NETICS through the public API and asks NETICS for the hosted
 * checkout link, which is served by the payment provider connected to the
 * Luxe workspace (Flutterwave or Paystack, settled straight to Luxe's bank).
 * NETICS also emails the customer the link and the receipt, and the order
 * appears on the Luxe team's NETICS order board like any other.
 *
 * One order per bag: the same bag and details always send the same
 * Idempotency-Key, so pressing Pay Online twice, a second tab or a retry
 * after a cancelled payment returns the same NETICS order and payment link,
 * never a second order a customer could pay for twice.
 *
 * Needs NETICS_API_KEY (server only) with the write:orders scope. Without
 * it, the checkout page hands the order to the Luxe Concierge chat.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");
const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.luxeuniversalwears.com"
).replace(/\/+$/, "");

export type CheckoutLine = {
  name: string;
  sku?: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
};

export type CheckoutInput = {
  /** The bag's own id, kept in the browser until its order is paid. */
  bagId: string;
  email: string;
  fullName: string;
  phone: string;
  destination: string;
  international: boolean;
  deliveryPreference: string;
  lines: CheckoutLine[];
};

export type CheckoutResult =
  | { ok: true; checkoutUrl: string; reference: string }
  | { ok: false; reason: "paid"; reference: string; message: string }
  | { ok: false; reason: "stale" | "unavailable" | "failed"; message: string };

const TRY_AGAIN =
  "We could not start the online payment. Please try again in a moment, or ask the Luxe Concierge in the chat at the corner of the page.";

async function neticsFetch(path: string, key: string, init: RequestInit) {
  return fetch(`${API_BASE}/api/public/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

async function detailOf(response: Response): Promise<string> {
  const body = (await response.json().catch(() => ({}))) as { detail?: unknown };
  return typeof body.detail === "string" ? body.detail : "";
}

export async function createNeticsCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const key = process.env.NETICS_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      reason: "unavailable",
      message: "Online payment is not available right now. Ask the Luxe Concierge in the chat at the corner of the page.",
    };
  }
  if (!input.lines.length) {
    return { ok: false, reason: "failed", message: "Your bag is empty." };
  }

  const order = {
    customer_name: input.fullName.slice(0, 200),
    customer_phone: input.phone.slice(0, 40),
    customer_email: input.email.slice(0, 320),
    order_type: "delivery",
    // Paid through the NETICS checkout link below: NETICS tells the Luxe
    // team about the order once it is paid, not when checkout starts.
    payment_method: "online",
    delivery_address: input.destination.slice(0, 400),
    notes: [
      "Website checkout.",
      `Delivery preference: ${input.deliveryPreference || "to be confirmed"}.`,
      input.international ? "International delivery: quote and confirm shipping." : "",
      "Delivery cost is not included in the payment link; confirm it with the customer.",
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 4000),
    items: input.lines.map((line) => ({
      name: line.name.slice(0, 200),
      quantity: Math.max(1, Math.min(999, Math.round(line.quantity))),
      unit_price: Math.max(0, line.price),
      notes: [line.sku ? `SKU ${line.sku}` : "", line.color, line.size]
        .filter(Boolean)
        .join(" · ")
        .slice(0, 400),
    })),
  };
  // The same bag with the same details is the same order; a changed bag or
  // new details are a new one (NETICS refuses a key reused for another order).
  const bagId = (input.bagId || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 64) || "no-bag-id";
  const idempotencyKey = `luxe-${createHash("sha256").update(bagId).update(JSON.stringify(order)).digest("hex")}`;

  try {
    const created = await neticsFetch("/orders", key, {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(order),
    });
    if (!created.ok) {
      console.error("[netics] order create failed", created.status, (await created.text()).slice(0, 300));
      return { ok: false, reason: "failed", message: TRY_AGAIN };
    }
    const placed = (await created.json()) as { id: string; reference: string; payment_state?: string; status?: string };
    if (placed.payment_state === "paid") {
      return { ok: false, reason: "paid", reference: placed.reference, message: `Order ${placed.reference} is already paid.` };
    }
    if (placed.status === "cancelled" || placed.payment_state === "refunded") {
      // The Luxe team closed this order: the bag starts a fresh one.
      return { ok: false, reason: "stale", message: "That order was closed." };
    }

    // After paying, NETICS sends the customer to the success page; after a
    // cancelled or failed payment, back here with the bag kept. A second
    // request for the same order returns the same payment link.
    const checkout = await neticsFetch(`/orders/${placed.id}/checkout`, key, {
      method: "POST",
      body: JSON.stringify({
        return_url: `${SITE_ORIGIN}/checkout/success?order=${encodeURIComponent(placed.reference)}`,
        cancel_url: `${SITE_ORIGIN}/checkout?payment=cancelled&order=${encodeURIComponent(placed.reference)}`,
      }),
    });
    if (checkout.status === 409) {
      const detail = await detailOf(checkout);
      if (/already paid/i.test(detail)) {
        return { ok: false, reason: "paid", reference: placed.reference, message: `Order ${placed.reference} is already paid.` };
      }
      if (/cancelled|refunded/i.test(detail)) {
        return { ok: false, reason: "stale", message: detail };
      }
      console.error("[netics] checkout refused", detail.slice(0, 300));
      return {
        ok: false,
        reason: "failed",
        message: `Order ${placed.reference} is recorded, but the payment link could not be created. The Luxe team will send it to you.`,
      };
    }
    if (!checkout.ok) {
      console.error("[netics] checkout failed", checkout.status, (await checkout.text()).slice(0, 300));
      return {
        ok: false,
        reason: "failed",
        message: `Order ${placed.reference} is recorded, but the payment link could not be created. The Luxe team will send it to you.`,
      };
    }
    const link = (await checkout.json()) as { checkout_url?: string; reference?: string };
    if (!link.checkout_url) {
      return {
        ok: false,
        reason: "failed",
        message: `Order ${placed.reference} is recorded; the payment link is on its way from the Luxe team.`,
      };
    }
    return { ok: true, checkoutUrl: link.checkout_url, reference: link.reference || placed.reference };
  } catch (error) {
    console.error("[netics] checkout error", error);
    return { ok: false, reason: "failed", message: "We could not reach the payment service. Please try again in a moment." };
  }
}
